const fs = require('fs');
const path = require('path');
const mdFilesDir = './articles';
const { Remarkable } = require('remarkable');

var md = new Remarkable();
const pug = require('pug');
const sass = require('sass')

function compileArticle(mdHtml, mdata) {
    const articleTemplate = './article.pug';
    const pugConfig = JSON.parse(fs.readFileSync('.pugrc', 'utf-8'));

    const html = pug.renderFile(articleTemplate, {
        content: mdHtml,
        metadata: mdata,
        ...pugConfig.locals
    });

    const cssOutputPath = path.join('./dist/blog', 'style.css');
    const outputPath = path.join('./dist/blog', mdata.href + '.html');


    const sassFilePath = './blog/style.sass';
    const compiledCss = sass.renderSync({ file: sassFilePath }).css;
    fs.writeFileSync(cssOutputPath, compiledCss);

    fs.writeFile(outputPath, html, (err) => {
        if (err) {
            console.error(`Error writing file: ${outputPath}`);
        } else {
            console.log(`File saved: ${outputPath}`);
        }
    });
}

const generateHtml = async () => {
    fs.readdirSync(mdFilesDir).map(async (file) => {
        if (path.extname(file) === '.md') {
            const mdFilePath = path.join(mdFilesDir, file);
            const mdContent = await fs.promises.readFile(mdFilePath, 'utf-8');

            const resultBlogPreview = extractMetadataFromMarkdown(mdContent);
            const href = path.basename(mdFilePath, path.extname(mdFilePath));
            resultBlogPreview.href = href;

            const html = md.render(mdContent);
            compileArticle(html, resultBlogPreview);
            return html;
        }
        return null;
    });
};

generateHtml();












// previews builder for .pugrc



const extractMetadataFromMarkdown = (markdown) => {
    const charactersBetweenGroupedHyphens = /^-----([\s\S]*?)---/;
    const metadataMatched = markdown.match(charactersBetweenGroupedHyphens);
    const metadata = metadataMatched[1];

    if (!metadata) {
        return {};
    }

    const metadataLines = metadata.split("\n");
    const metadataObject = metadataLines.reduce((accumulator, line) => {
        const [key, ...value] = line.split(":").map((part) => part.trim());

        if (key)
            accumulator[key] = value[1] ? value.join(":") : value.join("");
        return accumulator;
    }, {});

    return metadataObject;
};

const buildBlogPreviews = async () => {
    const pug = JSON.parse(await fs.promises.readFile('.pugrc', 'utf-8'));
    const blogPreviews = await Promise.all(
        fs.readdirSync(mdFilesDir).map(async (file) => {
            if (path.extname(file) === '.md') {
                const mdFilePath = path.join(mdFilesDir, file);
                const mdContent = await fs.promises.readFile(mdFilePath, 'utf-8');
                const resultBlogPreview = extractMetadataFromMarkdown(mdContent);
                resultBlogPreview.href = `${path.basename(mdFilePath, path.extname(mdFilePath))}`;
                return resultBlogPreview;
            }
            return null;
        })
    );

    const filteredBlogPreviews = blogPreviews.filter((article) => article !== null);
    pug.locals.blogs = filteredBlogPreviews;
    await fs.promises.writeFile('.pugrc', JSON.stringify(pug, null, 2));
};

buildBlogPreviews();
const fs = require("fs");
const path = require("path");
const { Remarkable } = require("remarkable");
const pug = require("pug");

const md = new Remarkable();
const pugConfig = JSON.parse(fs.readFileSync(".pugrc", "utf-8"));
const mdFilesDir = "./articles";

async function compileArticle(mdHtml, mdata) {
  const html = pug.renderFile("./blog/_article.pug", {
    content: mdHtml,
    metadata: mdata,
    ...pugConfig.locals,
  });

  await fs.promises.writeFile(`./blog/${mdata.href}.html`, html);
}

const generateHtml = async () => {
  const dir = fs.readdirSync(mdFilesDir);
  for (const file of dir) {
    if (path.extname(file) === ".md") {
      const mdFilePath = path.join(mdFilesDir, file);
      const mdContent = await fs.promises.readFile(mdFilePath, "utf-8");

      const resultBlogPreview = extractMetadataFromMarkdown(mdContent);
      const href = path.basename(mdFilePath, path.extname(mdFilePath));
      resultBlogPreview.href = href;

      const html = md.render(mdContent);
      await compileArticle(html, resultBlogPreview);
    }
  }
};

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

    if (key) accumulator[key] = value[1] ? value.join(":") : value.join("");
    return accumulator;
  }, {});

  return metadataObject;
};

const buildBlogPreviews = async () => {
  const pug = JSON.parse(await fs.promises.readFile(".pugrc", "utf-8"));
  const blogPreviews = await Promise.all(
    fs.readdirSync(mdFilesDir).map(async (file) => {
      if (path.extname(file) === ".md") {
        const mdFilePath = path.join(mdFilesDir, file);
        const mdContent = await fs.promises.readFile(mdFilePath, "utf-8");
        const resultBlogPreview = extractMetadataFromMarkdown(mdContent);
        resultBlogPreview.href = `${path.basename(
          mdFilePath,
          path.extname(mdFilePath)
        )}`;
        return resultBlogPreview;
      }
      return null;
    })
  );

  const filteredBlogPreviews = blogPreviews.filter(
    (article) => article !== null
  );

  pug.locals.blogs = filteredBlogPreviews;
  await fs.promises.writeFile(".pugrc", JSON.stringify(pug, null, 2));
};

buildBlogPreviews();
generateHtml();

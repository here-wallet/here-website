const fs = require('fs');
const path = require('path');

// Функция для обработки каждого md файла и генерации Pug
function processMdFile(mdFilePath) {
    const mdContent = fs.readFileSync(mdFilePath, 'utf-8');
    const metadata = {};
    const mdLines = mdContent.split('\n');
    let insideMetadata = false;

    for (const line of mdLines) {
        if (line.trim() === '-----') {
            if (!insideMetadata) {
                insideMetadata = true;
            } else {
                break;
            }
        } else if (insideMetadata) {
            const [key, ...valueParts] = line.split(':');
            const value = valueParts.join(':').trim();
            metadata[key.trim()] = value;
        }
    }
    const fileName = path.basename(mdFilePath, path.extname(mdFilePath))

    let pugContent = '';


    for (const line of mdLines) {
        if (line.trim() === '-----') {
            insideMetadata = !insideMetadata;
            continue;
        }

        if (insideMetadata) {
            if (line.includes(metadata.title)) {
            } else if (line.startsWith('# ')) {
                const headerText = line.substring(2);
                pugContent += `                h1 ${headerText}\n`;
            } else if (line.startsWith('## ')) {
                const headerText = line.substring(3);
                pugContent += `                h2 ${headerText}\n`;
            } else if (line.startsWith('### ')) {
                const headerText = line.substring(4);
                pugContent += `                h3 ${headerText}\n`;
            } else if (line.startsWith('![')) {
                const imageUrl = line.match(/!\[.*?\]\((.*?)\)/)[1];
                pugContent += `                img(src="${imageUrl}")\n`;
            } else if (line.startsWith('[')) {
                const linkText = line.match(/\[(.*?)\]/)[1];
                const linkUrl = line.match(/\((.*?)\)/)[1];
                pugContent += `                a(href="${linkUrl}") ${linkText}\n`;
            } else if (line.includes('[')) {
                const linkText = line.match(/\[(.*?)\]/)[1];
                const linkUrl = line.match(/\((.*?)\)/)[1].replace(/\)$/g, '');
                const indexOfLink = line.indexOf('[');
                const indexOfLinkEnd = line.indexOf(')');
                const lineWithLinkReplaced = line.replace(line.slice(indexOfLink, indexOfLinkEnd + 1), `
                    a(href="${linkUrl}") ${linkText}
                    | `);
                const trimmedLine = lineWithLinkReplaced.trim();
                if (trimmedLine !== '') {
                    pugContent += `                p.text
                    | ${trimmedLine}\n`;
                }
            } else {
                const trimmedLine = line.trim();
                if (trimmedLine !== '') {
                    pugContent += `                p.text ${trimmedLine}\n`;
                }
            }
        }
    }

    const pugPostHeader = `
            .post-header
                .parameters
                    .tag(id="${metadata.tag}")
                        | ${metadata.tag}
                    .point
                    .time-to-read 
                        | ${metadata.timeToRead} min
                h1.post-title
                    | ${metadata.title}
                .post-date
                    | ${metadata.date}
`

    const pugTemplate = `
doctype
html(lang="en")
    head
        meta(charset="UTF-8")
        meta(http-equiv="X-UA-Compatible", content="IE=edge")
        meta(name="viewport", content="width=device-width, initial-scale=1.0")
        title ${metadata.title}
        meta(name="description", content="Blog HERE")

        meta(name="og:title", content="${metadata.title}")
        meta(name="og:description", content="${metadata.title}")
        meta(name="og:url", content="http://herewallet.app/blog/${fileName}")
        meta(name="og:image", content="https://storage.herewallet.app/download.jpg")
        meta(name="twitter:card", content="summary_large_image")
        meta(name="twitter:image", content="https://storage.herewallet.app/download.jpg")
        meta(name="telegram_channel", content="herewallet")
        link(rel='shortcut icon' href='https://static.tildacdn.com/tild6365-3063-4930-b165-613062656662/favicon_4.ico' type='image/x-icon')
        link(href="style.sass", rel="stylesheet")
        link(href="http://herewallet.app/blog/${fileName}", rel="canonical")
        meta(name="format-detection", content="telephone=no")
        link(href="https://fonts.googleapis.com", rel="preconnect")
        link(rel="preconnect", href="https://fonts.gstatic.com", crossorigin)
        link(href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap", rel="stylesheet")
        
        link(rel='apple-touch-icon' sizes='76x76' href='https://static.tildacdn.com/tild6365-3063-4930-b165-613062656662/favicon_4.ico')
        link(rel='apple-touch-icon' sizes='152x152' href='https://static.tildacdn.com/tild6365-3063-4930-b165-613062656662/favicon_4.ico')
        link(rel='apple-touch-startup-image' href='https://static.tildacdn.com/tild6365-3063-4930-b165-613062656662/favicon_4.ico')

        // Google tag (gtag.js)
        script(async='' src='https://www.googletagmanager.com/gtag/js?id=G-J76SQ67RJB')
        script.
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-J76SQ67RJB');
        link(href="../assets/cabinet-grotesk/index.css", rel="stylesheet")
        link(href="./style.sass", rel="stylesheet")
    body.white
        include ../landing/header/index.pug
        +header("/blog")
        
        section.post
            ${pugPostHeader}
            .post-content
${pugContent}
    `

    // Создаем папку ./dist/blog/ если она не существует
    const distDir = './blog';
    if (!fs.existsSync(distDir)) {
        fs.mkdirSync(distDir, { recursive: true });
    }
    // Сохраняем pug в ./blog/[fileName].pug
    fs.writeFileSync(path.join(distDir, `${fileName}.pug`), pugTemplate);
}

// Папка с md файлами (articles/)
const mdFilesDir = './articles';
// Читаем все md файлы в папке
fs.readdirSync(mdFilesDir).forEach(file => {
    if (path.extname(file) === '.md') {
        const mdFilePath = path.join(mdFilesDir, file);
        processMdFile(mdFilePath);
    }
});


const buildBlogPreviews = async () => {
    const pug = JSON.parse(await fs.promises.readFile('.pugrc', 'utf-8'));

    function readMdFile(mdFilePath) {
        const mdContent = fs.readFileSync(mdFilePath, 'utf-8');
        const metadata = {};
        const mdLines = mdContent.split('\n');
        let insideMetadata = false;
        for (const line of mdLines) {
            if (line.trim() === '-----') {
                if (!insideMetadata) {
                    insideMetadata = true;
                } else {
                    break;
                }
            } else if (insideMetadata) {
                const [key, ...valueParts] = line.split(':');
                const value = valueParts.join(':').trim();
                metadata[key.trim()] = value;
            }
        }
        return metadata;
    }

    const mdFilesDir = './articles';

    const articles = fs.readdirSync(mdFilesDir).map(file => {
        if (path.extname(file) === '.md') {
            const mdFilePath = path.join(mdFilesDir, file);
            const metadata = readMdFile(mdFilePath);
            metadata.href = `${path.basename(mdFilePath, path.extname(mdFilePath))}`;
            return metadata;
        }
        return null;
    }).filter(article => article !== null);

    pug.locals.blogs = articles;

    await fs.promises.writeFile('.pugrc', JSON.stringify(pug, null, 2));
};

buildBlogPreviews();
const fs = require("fs");
const path = require("path");
const { Remarkable } = require("remarkable");
const pug = require("pug");
const parseMD = require("parse-md").default;

const md = new Remarkable({ html: true });
const pugConfig = JSON.parse(fs.readFileSync(".pugrc", "utf-8"));
const mdFilesDir = "./articles";

async function compileArticle(mdHtml, blogMetadata) {
  const html = pug.renderFile("./blog/_article.pug", {
    content: mdHtml,
    metadata: blogMetadata,
    ...pugConfig.locals,
  });

  await fs.promises.writeFile(`./blog/${blogMetadata.href}.html`, html);
}

const generateHtml = async () => {
  const dir = fs.readdirSync(mdFilesDir);
  for (const file of dir) {
    if (path.extname(file) === ".md") {
      const mdFilePath = path.join(mdFilesDir, file);
      const mdContent = await fs.promises.readFile(mdFilePath, "utf-8");
      const { metadata, content } = parseMD(mdContent);
      const href = path.basename(mdFilePath, path.extname(mdFilePath));
      metadata.href = href;
      const html = md.render(content);
      await compileArticle(html, metadata);
    }
  }
};

function formatDateToISO(dateString) {
  const [day, month, year] = dateString.split(".");
  return `${year}-${month}-${day}`;
}

const formatDate = (dateString) => {
  const formattedDate = formatDateToISO(dateString);
  const date = new Date(formattedDate);
  return date;
};

const buildBlogPreviews = async () => {
  const pug = JSON.parse(await fs.promises.readFile(".pugrc", "utf-8"));
  const blogPreviews = await Promise.all(
    fs.readdirSync(mdFilesDir).map(async (file) => {
      if (path.extname(file) === ".md") {
        const mdFilePath = path.join(mdFilesDir, file);
        const mdContent = await fs.promises.readFile(mdFilePath, "utf-8");
        const { metadata } = parseMD(mdContent);
        metadata.href = `${path.basename(mdFilePath, path.extname(mdFilePath))}`;
        return metadata;
      }
      return null;
    })
  );

  const filteredAndSortedBlogPreviews = blogPreviews
    .filter((article) => article !== null)
    .sort((a, b) => formatDate(b.date) - formatDate(a.date));

  pug.locals.blogs = filteredAndSortedBlogPreviews;
  await fs.promises.writeFile(".pugrc", JSON.stringify(pug, null, 2));
};

buildBlogPreviews();
generateHtml();

const blogItems = Array.from(document.querySelectorAll(".blog-item"));
blogItems.forEach((blog) => {
    blog.addEventListener("click", () => {
        blog.querySelector("a")?.click();
    });
});

const tagsItems = Array.from(document.querySelectorAll('.tag'))
tagsItems.forEach((tag) => {
    if (tag.id === 'Company') {
        tag.innerText += ' news'
    }
})
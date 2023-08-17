const allLinks = document.querySelectorAll(".post-content a");
if (allLinks) {
    allLinks.forEach(link => {
        link.setAttribute("target", "_blank");
    });
}

function formatDateToISO(dateString) {
    const [day, month, year] = dateString.split('.');
    return `${year}-${month}-${day}`;
}

const formatDate = (dateString) => {
    const formattedDate = formatDateToISO(dateString);
    const date = new Date(formattedDate);
    const options = { month: 'short', day: '2-digit', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

const dateItem = document.querySelector('.post-date')
if (dateItem) {
    const dateString = dateItem.innerText
    dateItem.innerHTML = formatDate(dateString)
}

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

const smoothstep = (min, max, value) => {
    var x = Math.max(0, Math.min(1, (value - min) / (max - min)));
    return x * x * (3 - 2 * x);
};

const page = document.getElementsByClassName("page")[0];
const pageBg = document.getElementsByClassName("page-background")[0];
const animatePage = () => {
    let pad = window.innerWidth < 1600 ? 44 : 88;
    pad = window.innerWidth < 1200 ? 0 : pad;
    const { y: pageY, height: pageHeight } = pageBg.getBoundingClientRect();
    const step =
        pageY > 0
            ? 1 - smoothstep(620, 200, pageY)
            : smoothstep(-pageHeight + 1000, -pageHeight + 500, pageY);

    const offset = step * pad;
    pageBg.style.left = offset + "px";
    pageBg.style.right = offset + "px";
};

const updateScroll = () => {
    animatePage();
};

document.addEventListener("scroll", updateScroll, { passive: true });
updateScroll();
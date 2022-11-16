const page = document.getElementsByClassName("page-background")[0]
const header = document.getElementsByClassName("header")[0]

document.addEventListener('scroll', (e) => {
    let scroll = Math.max(0, this.scrollY - 820) * 0.005
    let offset = Math.max(88 * (1 - scroll), 0);
    page.style.left = offset + 'px'
    page.style.right = offset + 'px'

    header.classList.toggle('active', this.scrollY > 0)
})

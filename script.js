const page = document.getElementsByClassName("page-background")[0]
const header = document.getElementsByClassName("header")[0]

const updateScroll = () => {
    let pad = window.innerWidth < 1600 ? 44 : 88 
    pad = window.innerWidth < 1200 ? 12 : pad 

    let tophold =  window.innerWidth < 800 ? 260 : 620
    let scroll = Math.max(0, this.scrollY - tophold) * 0.005
    let offset = Math.max(pad * (1 - scroll), 0);
    page.style.left = offset + 'px'
    page.style.right = offset + 'px'

    header.classList.toggle('active', this.scrollY > 0)
}

document.addEventListener('scroll', updateScroll)
updateScroll()

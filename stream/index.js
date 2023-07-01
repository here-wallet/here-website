const line = document.getElementById('line')
const stat = document.getElementById('stat')

const updateBar = async () => {
  const res = await fetch("https://api.herewallet.app/partners/stream")
  const { total, limit } = await res.json();
  stat.innerHTML = `${Math.round(total)}$ / ${Math.round(limit)}$`;
  line.style.width = (595 / limit) * total + 'px'
}

setInterval(updateBar, 5000)
updateBar()

import fetch from 'node-fetch'
import fs from 'fs'

const build = async () => {
    const pug = JSON.parse(await fs.promises.readFile('.pugrc', 'utf-8'))
    const res = await fetch('https://api.herewallet.app/api/v1/web/lending_const')
    const { news } = await res.json()
    pug.locals.news.items = news

    await fs.promises.writeFile('.pugrc', JSON.stringify(pug, null, 2))
}

build()

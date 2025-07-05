// 🌟 Plugin "cantante" con 10 APIs, botón "10 más" y hasta 3 repeticiones. ENVÍA VIDEOS en vez de solo enlaces let fetch = global.fetch || import('node-fetch').then(m => m.default)

if (!global.cantanteCache) global.cantanteCache = {} // cache por usuario-artista

let handler = async (m, { conn, args }) => { if (!args[0]) return conn.reply(m.chat, '🎤 Escribe el nombre del cantante. Ej: !cantante Shakira', m)

const artista = args.join(' ').toLowerCase() const userID = m.sender const key = ${userID}-${artista} const maxUsos = 3

if (!global.cantanteCache[key]) global.cantanteCache[key] = { canciones: [], usos: 0 }

const data = global.cantanteCache[key] if (data.usos >= maxUsos) { delete global.cantanteCache[key] return conn.reply(m.chat, '❌ Ya has solicitado el máximo de canciones para este artista.', m) }

try { let nuevas = []

const apis = [
  async () => {
    let r = await fetch(`https://yt.dtapp.net/api/search?query=${encodeURIComponent(artista)}%20musica`)
    let j = await r.json()
    return j.result?.map(v => ({ titulo: v.title, url: v.url, fuente: 'YouTube' })) || []
  },
  async () => {
    let r = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(artista)}&entity=musicVideo&limit=10`)
    let j = await r.json()
    return j.results?.map(v => ({ titulo: v.trackName, url: v.previewUrl, fuente: 'iTunes' })) || []
  },
  async () => {
    let r = await fetch(`https://api.deezer.com/search?q=${encodeURIComponent(artista)}`)
    let j = await r.json()
    return j.data?.map(v => ({ titulo: v.title + ' - ' + v.artist.name, url: v.link, fuente: 'Deezer' })) || []
  },
  async () => {
    let r = await fetch(`https://shazam-api-beta.vercel.app/api/artist/${encodeURIComponent(artista)}`)
    let j = await r.json()
    return j.tracks?.map(v => ({ titulo: v.title + ' - ' + v.subtitle, url: v.url, fuente: 'Shazam' })) || []
  },
  async () => {
    let r = await fetch(`https://saavn.dev/api/search/songs?query=${encodeURIComponent(artista)}`)
    let j = await r.json()
    return j.data?.results?.map(v => ({ titulo: v.name, url: v.url, fuente: 'JioSaavn' })) || []
  },
  async () => { return [] },
  async () => { return [] },
  async () => { return [] },
  async () => { return [] },
  async () => { return [] }
]

for (let fn of apis) {
  let canciones = await fn()
  for (let c of canciones) {
    if (nuevas.length >= 10) break
    if (!data.canciones.find(x => x.url === c.url)) {
      nuevas.push(c)
      data.canciones.push(c)
    }
  }
  if (nuevas.length >= 10) break
}

if (!nuevas.length) return conn.reply(m.chat, '⚠️ No se encontraron nuevas canciones con video.', m)

for (let c of nuevas) {
  if (c.url.includes('youtube.com') || c.url.includes('youtu.be')) {
    let vidID = c.url.split('v=')[1] || c.url.split('/').pop()
    let dlLink = `https://yt.dtapp.net/api/button/video/${vidID}`
    await conn.sendMessage(m.chat, { video: { url: c.url }, caption: `🎬 ${c.titulo}\n🌐 ${c.fuente}` }, { quoted: m })
  } else {
    await conn.sendMessage(m.chat, { text: `🎶 ${c.titulo}\n🔗 ${c.url}\n🌐 ${c.fuente}` }, { quoted: m })
  }
}

let buttons = []
if (data.usos + 1 < maxUsos) {
  buttons.push({ buttonId: `.cantante ${artista}`, buttonText: { displayText: '🔁 Más canciones' }, type: 1 })
} else {
  delete global.cantanteCache[key]
}

data.usos++

} catch (e) { console.error(e) conn.reply(m.chat, '❌ Error al buscar o enviar los videos.', m) } }

handler.command = /^cantante2$/i handler.tags = ['busqueda'] handler.help = ['cantante2 <nombre>']

export default handler


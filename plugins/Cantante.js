// 🌟 Plugin "cantante" con 10 APIs, botón "10 más" y hasta 3 repeticiones sin repetir canciones let fetch = global.fetch || import('node-fetch').then(m => m.default)

if (!global.cantanteCache) global.cantanteCache = {} // cache por usuario-artista

let handler = async (m, { conn, args, command }) => { if (!args[0]) return conn.reply(m.chat, '🎤 Escribe el nombre del cantante. Ej: !cantante Shakira', m)

const artista = args.join(' ').toLowerCase() const userID = m.sender const key = ${userID}-${artista} const maxUsos = 3

// inicializar cache si no existe if (!global.cantanteCache[key]) global.cantanteCache[key] = { canciones: [], usos: 0 }

const data = global.cantanteCache[key] if (data.usos >= maxUsos) delete global.cantanteCache[key] // limpiar después del uso 3

try { let nuevas = []

// Funciones para APIs (todas usan fetch directo sin librerías externas)
const apis = [
  async () => { // YouTube
    let r = await fetch(`https://yt.dtapp.net/api/search?query=${artista}%20musica`)
    let j = await r.json()
    return j.result?.map(v => ({ titulo: v.title, url: v.url, fuente: 'YouTube' })) || []
  },
  async () => { // iTunes
    let r = await fetch(`https://itunes.apple.com/search?term=${artista}&entity=song&limit=10`)
    let j = await r.json()
    return j.results?.map(v => ({ titulo: v.trackName + ' - ' + v.artistName, url: v.trackViewUrl, fuente: 'iTunes' })) || []
  },
  async () => { // Deezer
    let r = await fetch(`https://api.deezer.com/search?q=${artista}`)
    let j = await r.json()
    return j.data?.map(v => ({ titulo: v.title + ' - ' + v.artist.name, url: v.link, fuente: 'Deezer' })) || []
  },
  async () => { // Shazam
    let r = await fetch(`https://shazam-api-beta.vercel.app/api/artist/${artista}`)
    let j = await r.json()
    return j.tracks?.map(v => ({ titulo: v.title + ' - ' + v.subtitle, url: v.url, fuente: 'Shazam' })) || []
  },
  async () => { // JioSaavn
    let r = await fetch(`https://saavn.dev/api/search/songs?query=${artista}`)
    let j = await r.json()
    return j.data?.results?.map(v => ({ titulo: v.name, url: v.url, fuente: 'JioSaavn' })) || []
  },
  async () => { // Genius
    let r = await fetch(`https://api.genius.com/search?q=${artista}`, {
      headers: { Authorization: 'Bearer ' + 'HARD_CODED_OR_PUBLIC_TOKEN' } // opcional
    })
    let j = await r.json()
    return j.response?.hits?.map(v => ({ titulo: v.result.full_title, url: v.result.url, fuente: 'Genius' })) || []
  },
  async () => { // SoundCloud (scrape no oficial)
    let r = await fetch(`https://api-v2.soundcloud.com/search/tracks?q=${artista}&client_id=YOUR_CLIENT_ID`)
    let j = await r.json()
    return j.collection?.map(v => ({ titulo: v.title, url: v.permalink_url, fuente: 'SoundCloud' })) || []
  },
  async () => { // Last.fm
    let r = await fetch(`https://ws.audioscrobbler.com/2.0/?method=track.search&track=${artista}&api_key=API_KEY&format=json`)
    let j = await r.json()
    return j.results?.trackmatches?.track?.map(v => ({ titulo: v.name + ' - ' + v.artist, url: v.url, fuente: 'Last.fm' })) || []
  },
  async () => { // Google fallback
    return [] // no usar scrape directo sin permiso
  },
  async () => { // Fallback API
    return []
  }
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

if (!nuevas.length) return conn.reply(m.chat, '⚠️ No se encontraron nuevas canciones.', m)

let text = `🎵 *Canciones de ${artista} (parte ${data.usos + 1}/3):*

nuevas.forEach((c, i) => { text +=${i + 1}. ${c.titulo} 🔗 ${c.url} 🌐 ${c.fuente}

` })

let buttons = []
if (data.usos + 1 < maxUsos) {
  buttons.push({ buttonId: `.cantante ${artista}`, buttonText: { displayText: '🔁 Más canciones' }, type: 1 })
} else {
  delete global.cantanteCache[key] // limpiar al final
}

await conn.sendMessage(m.chat, {
  text,
  buttons,
  footer: '🎶 Harold-bot - Buscar canciones',
  headerType: 1
}, { quoted: m })

data.usos++

} catch (e) { console.error(e) conn.reply(m.chat, '❌ Error buscando canciones. Intenta con otro artista.', m) } }

handler.command = /^cantante$/i handler.tags = ['busqueda'] handler.help = ['cantante <nombre>']

export default handler


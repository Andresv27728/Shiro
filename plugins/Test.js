let handler = async (m, { conn, args }) => {
  let userId = m.mentionedJid?.[0] || m.sender
  let user = global.db.data.users[userId]
  let name = conn.getName(userId)
  let _uptime = process.uptime() * 1000
  let uptime = clockString(_uptime)
  let totalreg = Object.keys(global.db.data.users).length

  // Saludo decorado
  let hour = new Intl.DateTimeFormat('es-PE', {
  hour: 'numeric',
  hour12: false,
  timeZone: 'America/Lima'
}).format(new Date())
  
  let saludo = hour < 6 ? "🌌 Buenas madrugadas" :
               hour < 12 ? "🌅 Buenos días" :
               hour < 18 ? "🌄 Buenas tardes" :
               "🌃 Buenas noches"

  // Agrupar comandos por categorías
  let categories = {}
  for (let plugin of Object.values(global.plugins)) {
    if (!plugin.help || !plugin.tags) continue
    for (let tag of plugin.tags) {
      if (!categories[tag]) categories[tag] = []
      categories[tag].push(...plugin.help.map(cmd => `#${cmd}`))
    }
  }

  // Emojis random por categoría
  let decoEmojis = ['✨', '🌸', '👻', '⭐', '🔮', '💫', '☁️', '🦋', '🪄']
  let emojiRandom = () => decoEmojis[Math.floor(Math.random() * decoEmojis.length)]

  // MENÚ HANAKO-KUN STYLE
  let menuText = `
╭───❖ 𝓖𝓸𝓴𝓾 𝓑𝓸𝓽 ❖───╮

  Hey*. 
> *_

╰─────❖ 𝓜𝓮𝓷𝓾 ❖─────╯

🩵  INFO - BOT  🩵

Baileys: Multi-Device.
Usuario: 
Tiempo activo: 
Registros: 

> Desarrollado por *Félix*

≪──── ⋆🩵⚡🩵⋆ ────≫
`.trim()

for (let [tag, cmds] of Object.entries(categories)) {
  let tagName = tag.toUpperCase().replace(/_/g, ' ')
  let deco = emojiRandom()
  menuText += `

╭─━━━MAKIMA-MENU+━━━╮
${cmds.map(cmd => `│ ➯ ${cmd}`).join('\n')}
╰─━━━━━━━━━━━━━━━━╯`
}
  
  // Mensaje previo cute
  await conn.reply(m.chat, 'CARGANDO COMANDOS...', m, {
    contextInfo: {
      externalAdReply: {
        title: botname,
        body: "Estoy cargando sus comandos",
        thumbnailUrl: 'https://qu.ax/KzvBL.jpg',
        sourceUrl: redes,
        mediaType: 1,
        showAdAttribution: true,
        renderLargerThumbnail: true,
      }
    }
  })

  // Enviar menú con video estilo gif
  await conn.sendMessage(m.chat, {
    video: { url: 'https://files.catbox.moe/eyt570.mp4', gifPlayback: true },
    caption: menuText,
    gifPlayback: true,
    contextInfo: {
      mentionedJid: [m.sender, userId],
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363402615935849@newsletter',
        newsletterName: 'Makima-Bot',
        serverMessageId: -1,
      },
      forwardingScore: 999,
      externalAdReply: {
        title: botname,
        body: "Menu - Makima",
        thumbnailUrl: banner,
        sourceUrl: redes,
        mediaType: 1,
        showAdAttribution: true,
        renderLargerThumbnail: true,
      },
    }
  }, { quoted: m })
}

handler.help = ['menutest']
handler.tags = ['main']
handler.command = ['menutest', 'asistmaki', 'makimabot', 'ayuda']

export default handler

function clockString(ms) {
  let h = Math.floor(ms / 3600000)
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60
  return `${h}h ${m}m ${s}s`
    }

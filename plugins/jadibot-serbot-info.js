async function handler(m, { conn: stars, usedPrefix }) {
  let uniqueUsers = new Map()

  global.conns.forEach((conn) => {
    if (conn.user && conn.ws && conn.ws.socket && conn.ws.socket.readyState === 1) {
      uniqueUsers.set(conn.user.jid, conn)
    }
  })

  let users = [...uniqueUsers.values()]
  let totalUsers = users.length
  global.totalUsers = totalUsers

  let packname = global.packname || '🩵 𝙱𝙾𝚃'
  let title = `⭑『 𝐓𝐎𝐓𝐀𝐋 𝐒𝐔𝐁𝐁𝐎𝐓𝐒』⭑`
  let barra = '━━━━━━━━━━━━━━━━'

  let listado = users.map((v, i) => {
    let jid = v.user.jid.replace(/[^0-9]/g, '')
    let nombre = v.user.name || 'SubBot'
    return `╭╼⟪ MAKIMA 2.0 ⟫╾╮
┃ #${i + 1} 💎 @${jid}
┃ 💎 Link: wa.me/${jid}
┃ 💎 Nombre: ${nombre}
╰╼✰`
  }).join('\n\n')

  let responseMessage = `╭═✰ ${title}
┃ 🔢 Total: *${totalUsers}*
╰═${barra}✰

${listado || '💎 En este momento no hay subbots activos.'}`.trim()

  const imageUrl = 'https://qu.ax/dXOUo.jpg' // ⚠️ Cambia esta URL si quieres usar otra imagen

  const fkontak = {
    key: {
      participants: "0@s.whatsapp.net",
      remoteJid: "status@broadcast",
      fromMe: false,
      id: "Halo"
    },
    message: {
      contactMessage: {
        displayName: "Subbot",
        vcard: "BEGIN:VCARD\nVERSION:3.0\nN:;Subbot;;;\nFN:Subbot\nEND:VCARD"
      }
    }
  }

  await stars.sendMessage(m.chat, {
    image: { url: imageUrl },
    caption: responseMessage,
    mentions: stars.parseMention(responseMessage)
  }, { quoted: fkontak })
}

handler.command = ['listjadibot', 'bots']
handler.help = ['bots']
handler.tags = ['jadibot']
export default handler

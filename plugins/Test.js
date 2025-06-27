//═════════════════════════════════════════════════//
//        Comando de mención a todos los miembros  //
//═════════════════════════════════════════════════//

const delay = ms => new Promise(res => setTimeout(res, ms))

let tagallHandler = async (m, { conn, participants, isBotAdmin, isAdmin, isOwner, groupMetadata }) => {
  // Validaciones
  if (!m.isGroup) {
    return m.reply('〘💎〙Este comando solo puede ser usado en grupos.')
  }
  if (!isAdmin && !isOwner) {
    return m.reply('〘💎〙Este comando solo puede ser usado por admins.')
  }

  // Lista de usuarios a mencionar
  let users = participants.map(u => u.id)
  let invocadorTag = '@' + m.sender.split('@')[0]
  let lista = users.map(u => '┃✰ @' + u.split('@')[0]).join('\n')
  let texto = `╭───〘 ✰ 〙───╮
┃MAKIMA 2.0 BOT┃
╰━━━━━━━━━━━╯

Tᴇ ɪɴᴠᴏᴄᴏ́: ${invocadorTag}

╔━❍━❍━❍━❍━❍╗
${lista}
╚━━━━━━━━━━━━╝`

  // Mensaje de "Mencionando el grupo..." (reply y newsletter)
  let prepMsg = await conn.sendMessage(m.chat, {
    text: '〘💎〙Mencionando el grupo, espere un momento...',
    contextInfo: newsletterContext([m.sender])
  }, { quoted: m })

  // Reaccionar 💎 → 🩵 → 💎 al mensaje de espera
  if (conn.sendMessage && prepMsg.key) {
    try {
      await conn.sendMessage(m.chat, { react: { text: "💎", key: prepMsg.key }})
      await delay(500)
      await conn.sendMessage(m.chat, { react: { text: "🩵", key: prepMsg.key }})
      await delay(500)
      await conn.sendMessage(m.chat, { react: { text: "💎", key: prepMsg.key }})
    } catch {}
  }

  // Esperar 2 segundos
  await delay(2000)

  // Enviar mensaje principal con mención masiva (newsletter, sin reply)
  await conn.sendMessage(m.chat, {
    text: texto,
    mentions: users,
    contextInfo: newsletterContext(users)
  })
}

// Integrar al handler principal de tu archivo Test.js
handler.command = handler.command ? handler.command.concat(['tagall','mensionall','todos','invocar']) : ['tagall','mensionall','todos','invocar']
handler.register = true

handler.before = async function (m, info) {
  const cmds = ['tagall','mensionall','todos','invocar']
  if (!m.isGroup && cmds.some(c => m.text?.toLowerCase()?.includes('#'+c))) {
    return m.reply('〘💎〙Este comando solo puede ser usado en grupos.')
  }
  if (m.isGroup && cmds.some(c => m.text?.toLowerCase()?.includes('#'+c))) {
    if (!info.isAdmin && !info.isOwner) {
      return m.reply('〘💎〙Este comando solo puede ser usado por admins.')
    }
    return await tagallHandler(m, info)
  }
}

// Si ya tienes una función newsletterContext, reutilízala
function newsletterContext(mentioned = []) {
  return {
    mentionedJid: mentioned,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: channelRD.id,
      newsletterName: channelRD.name,
      serverMessageId: -1,
    },
    forwardingScore: 999,
    externalAdReply: {
      title: NEWSLETTER_TITLE,
      body: channelRD.name,
      thumbnailUrl: MAKIMA_ICON,
      sourceUrl: GITHUB_MAKIMA,
      mediaType: 1,
      renderLargerThumbnail: false
    }
  }
}

//═════════════════════════════════════════════════//
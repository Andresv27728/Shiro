let handler = async function (m, { conn }) {
  let user = global.db.data.users[m.sender]
  
  if (!user.registered) {
    return m.reply(`
⚠️ *ERROR DE SISTEMA*
🚫 No estás registrado actualmente.
`)
  }

  user.registered = false
  m.reply(`
🗡️ *USUARIO ELIMINADO*
📁 Registro completamente eliminado del sistema...
⌛ Vuelve a registrarte con *.reg* si lo deseas.
`)

  // Datos del canal/newsletter (para el efecto de reenviado)
  const channelRD = { id: "120363400360651198@newsletter", name: "MAKIMA - Frases" }
  
  // El mensaje que TÚ quieras (puedes cambiarlo)
  let mensaje = "⚠️ Este es un mensaje importante reenviado desde el canal oficial."

  // Envía el mensaje simulado como reenviado desde el canal
  await conn.sendMessage(m.chat, {
    text: mensaje,
    contextInfo: {
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: channelRD.id,
        newsletterName: channelRD.name,
        serverMessageId: -1,
      },
      forwardingScore: 999,
      externalAdReply: {
        title: channelRD.name,
        body: 'Mensaje oficial',
        thumbnailUrl: 'https://i.imgur.com/5Q1OtS2.jpg', // Opcional, cámbiala si quieres
        mediaType: 1,
        renderLargerThumbnail: true,
      }
    }
  }, { quoted: m })
}

handler.help = ['unreg']
handler.tags = ['rg']
handler.command = ['unreg']
handler.register = true

export default handler
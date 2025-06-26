let handler = async (m, { conn, text, isOwner }) => {
  let botNumber = (conn.user && conn.user.id) ? conn.user.id.split('@')[0] : ''
  let senderNumber = m.sender.split('@')[0]

  if (!isOwner && senderNumber !== botNumber) {
    return conn.reply(m.chat, '「🩵」Este comando solo puede ser utilizado por el owner o el propio bot.', m)
  }

  if (!text) return conn.reply(m.chat, `🩵 *¿Qué nombre deseas ponerme?*`, m)

  if (typeof conn.updateProfileName !== 'function') {
    return conn.reply(m.chat, '🚩 Este bot no soporta cambiar el nombre por este método.', m)
  }

  try {
    await conn.updateProfileName(text)
    await conn.reply(m.chat, '✅️ *Nombre cambiado con éxito*', m)
    await m.react('✅')
  } catch (e) {
    console.log(e)
    await m.react('❌')
    await conn.reply(m.chat, `🩵 ¡Ocurrió un error!\n${e}`, m)
  }
}

handler.help = ['nuevonombrebot <nombre>']
handler.tags = ['owner']
handler.command = ['nuevonombrebot', 'setname', 'namebot']
handler.owner = false

export default handler
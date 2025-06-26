let handler = async (m, { conn, text, isOwner }) => {
  // Obtiene el número del bot
  let botNumber = (conn.user && conn.user.id) ? conn.user.id.split('@')[0] : ''
  // Obtiene el número de quien envía el comando
  let senderNumber = m.sender.split('@')[0]

  // Permite solo si es owner o el propio bot (útil para subbots)
  if (!isOwner && senderNumber !== botNumber) {
    return conn.reply(m.chat, '⛔️ Este comando solo puede ser usado por el owner o por el propio bot.', m)
  }

  if (!text) return conn.reply(m.chat, '✏️ ¿Qué nombre quieres ponerme?', m)

  try {
    await conn.updateProfileName(text)
    await conn.reply(m.chat, `✅ Nombre cambiado con éxito a: *${text}*`, m)
    await m.react('✅')
  } catch (e) {
    console.error(e)
    await m.react('❌')
    await conn.reply(m.chat, `❌ Ocurrió un error al cambiar el nombre.\n${e}`, m)
  }
}

handler.help = ['nuevonombrebot <nuevo_nombre>']
handler.tags = ['owner']
handler.command = ['nuevonombrebot', 'setbotname', 'setname', 'namebot']
handler.owner = false // Lo controlamos manualmente en el código

export default handler
let handler = async (m, { conn, text, isOwner }) => {
  // El número del bot (solo números)
  let botNumber = (conn.user && conn.user.id) ? conn.user.id.split('@')[0] : ''
  // El número del remitente (solo números)
  let senderNumber = m.sender.split('@')[0]

  // Permitir solo si es owner o el propio bot
  if (!isOwner && senderNumber !== botNumber) {
    return conn.reply(m.chat, '「🩵」Este comando solo puede ser utilizado por el owner o Subbots.', m)
  }

  if (!text) return conn.reply(m.chat, `🩵 *¿Qué nombre deseas ponerme?*`, m)
  try {
    await conn.updateProfileName(text)
    await conn.reply(m.chat, '✅️ *Nombre cambiado con éxito*', m)
    await m.react('✅')
  } catch (e) {
    console.log(e)
    await m.react('❌')
    await conn.reply(m.chat, `🩵 ¡Ocurrió un error!`, m)
  }
}

handler.help = ['nuevonombrebot <nombre>']
handler.tags = ['owner']
handler.command = ['nuevonombrebot', 'setname', 'namebot']
handler.owner = false // Así funciona el chequeo personalizado

export default handler
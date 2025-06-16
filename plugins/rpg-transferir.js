//código creado x Félix Manuel
//Porfavor deja los creditos

let handler = async (m, { conn, args, usedPrefix, command }) => {
  let user = global.db.data.users[m.sender]
  let recipient = m.mentionedJid[0]

  if (!recipient) return conn.reply(m.chat, `💎Comando mal utilizado, usa:\n\n${usedPrefix + command} @usuario cantidad`, m)

  if (!(recipient in global.db.data.users)) return conn.reply(m.chat, 'Este usuario no se encuentra en mi base de datos.', m)

  let amount = parseInt(args[1])
  if (isNaN(amount) || amount <= 0) return conn.reply(m.chat, '🩵 Ingresa una *cantidad válida* para transferir.', m)

  if (user.monedas < amount) return conn.reply(m.chat, 'No tienes suficientes Diamantes para transferir.', m)

  global.db.data.users[m.sender].monedas -= amount
  global.db.data.users[recipient].monedas += amount

  let msg = `
 *MAKIMA 2.0 - TRANSFERIR* 
┃
┃ 🩵 *Remitente:* @${m.sender.split('@')[0]}
┃ 🩵 *Destinatario:* @${recipient.split('@')[0]}
┃ 💎 *Cantidad Transferida:* ${amount} Diamantes 
┃
┗━━━━━━━━━━━━━━━━━━┛`.trim()

  await conn.reply(m.chat, msg, m, { mentions: [m.sender, recipient] })
}

handler.help = ['transferir @usuario cantidad']
handler.tags = ['rpg']
handler.command = ['transferir', 'enviar', 'send']
handler.register = true

export default handler

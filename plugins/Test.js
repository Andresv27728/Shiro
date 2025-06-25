let handler = async (m, { conn, isOwner }) => {
  if (!isOwner) throw 'Este comando solo puede usarlo el owner del bot.'

  // Intentar sacar pairing code (si tu Baileys lo soporta)
  if (typeof conn.requestPairingCode === 'function') {
    try {
      let code = await conn.requestPairingCode(conn.user.id.split(':')[0])
      if (code) {
        code = code.match(/.{1,4}/g)?.join('-')
        let pasos = `*︰꯭𞋭🩵 CONEXIÓN PREMIUM*\n\n━⧽ MODO CÓDIGO\n\n✰ Pasos de vinculación:\n➪ Ve a la esquina superior derecha en WhatsApp.\n➪ Toca en *Dispositivos vinculados*.\n➪ Selecciona *Vincular con el número de teléfono*.\n➪ Pega el código que te enviaré en el siguiente mensaje.\n\n★ Nota: Este código solo funciona en el número que lo solicitó.`
        await m.reply(pasos)
        await m.reply(`*Código de vinculación:*\n${code}`)
        return
      } else {
        await m.reply('No se pudo generar pairing code, intenta desde la consola con el comando .code')
        return
      }
    } catch (e) {
      await m.reply('Error generando pairing code: ' + (e && e.message ? e.message : e))
      return
    }
  }

  // Si el método no existe, solo QR por consola
  await m.reply('Tu versión de Baileys no soporta pairing code por comando. Ve a la consola y ejecuta: node . code')
}

handler.help = ['codepremium', 'qrpremium']
handler.tags = ['owner']
handler.command = ['codepremium', 'qrpremium']
handler.owner = true

export default handler
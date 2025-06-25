let handler = async (m, { conn, args, isOwner, command }) => {
  // Solo el owner puede generar codes
  if (!isOwner) throw 'Este comando solo es para el *owner* del bot.'

  // Intenta generar código de emparejamiento (nuevo método Baileys)
  if (typeof conn.requestPairingCode === 'function') {
    try {
      let code = await conn.requestPairingCode(conn.user.id.split(':')[0])
      code = code.match(/.{1,4}/g)?.join("-")
      let pasos = `*︰꯭𞋭🩵 CONEXIÓN PREMIUM*\n\n━⧽ MODO CÓDIGO\n\n✰ Pasos de vinculación:\n➪ Ve a la esquina superior derecha en WhatsApp.\n➪ Toca en *Dispositivos vinculados*.\n➪ Selecciona *Vincular con el número de teléfono*.\n➪ Pega el código que te enviaré en el siguiente mensaje.\n\n★ Nota: Este código solo funciona en el número que lo solicitó.`
      await m.reply(pasos)
      await m.reply(`*Código de vinculación:*\n${code}`)
      return
    } catch (e) {
      await m.reply('No se pudo generar pairing code. Prueba desde la consola o usa QR.')
      return
    }
  }

  // Si no existe requestPairingCode, muestra el QR (antiguo)
  if (typeof conn?.ev?.emit === 'function') {
    await m.reply('Escanea este QR en WhatsApp Web en *Dispositivos vinculados* (tienes 30 seg)...')
    conn.ev.emit('creds.update', conn.authState.creds)
    // El QR aparecerá en la consola donde iniciaste el bot
    return
  }

  await m.reply('Tu Baileys no soporta pairing code ni QR desde comandos.')
}

handler.help = ['qrpremium', 'codepremium']
handler.tags = ['owner']
handler.command = ['codepremium', 'qrpremium']
handler.owner = true

export default handler
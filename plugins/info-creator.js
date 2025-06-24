let handler = async (m, { conn }) => {
  let number = '18293142989' // Número del creador con prefijo país, sin +
  let nombre = 'CREADOR'
  let waLink = 'https://wa.me/' + number // Enlace directo al chat de WhatsApp

  // vCard de contacto para WhatsApp
  let vcard = `BEGIN:VCARD
VERSION:3.0
N:${nombre}
FN:${nombre}
TEL;type=CELL;type=VOICE;waid=${number}:${number}
END:VCARD`

  // Envía mensaje con botón para chatear directo en WhatsApp
  await conn.sendMessage(m.chat, {
    text: `💙 Aquí está el número de mi creador:\n\n*${nombre}*\n${number}`,
    footer: 'Toca el botón para ir directo al chat.',
    buttons: [
      { buttonId: waLink, buttonText: { displayText: 'Chatear en WhatsApp' }, type: 1 }
    ],
    headerType: 1
  }, { quoted: m })

  // Envía la tarjeta de contacto (vCard)
  await conn.sendMessage(m.chat, {
    contacts: {
      displayName: nombre,
      contacts: [{ vcard }]
    }
  }, { quoted: m })
}

handler.help = ['owner']
handler.tags = ['main']
handler.command = ['owner', 'creatora', 'creadora', 'dueña']

export default handler
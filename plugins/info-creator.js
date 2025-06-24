let handler = async (m, { conn }) => {
  // Cambia estos valores por los correctos de tu creadora
  let number = '18293142989' // Número de la creadora con prefijo país, sin espacios ni +
  let nombre = 'CREADOR'
  let canal = 'https://wa.me18293142989' // Enlace a tu canal (puedes sacar el mismo que en el menú)

  // vCard de la creadora
  let vcard = `BEGIN:VCARD
VERSION:3.0
N:${nombre}
FN:${nombre}
TEL;waid=${number}:${number}
END:VCARD`

  // Envía el canal como texto (puedes personalizar el mensaje)
  await conn.sendMessage(m.chat, { text: `💙 AQUI ESTA EL NUMERO DE MI CREADOR` }, { quoted: m })

  // Envía la tarjeta de contacto
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
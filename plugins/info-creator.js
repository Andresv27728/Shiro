import fetch from 'node-fetch'

let handler = async (m, { conn }) => {
  let txt_owner = "¡Hola! Este es el Contacto de mi creador\n\n> https://wa.me/18293142989?text=Hola+Félix"
  try {
    let res = await fetch("https://qu.ax/dXOUo.jpg")
    let buffer = await res.buffer()
    await conn.sendFile(m.chat, buffer, 'thumbnail.jpg', txt_owner, m)
  } catch (e) {
    console.error(e)
    m.reply('👨‍💻 No se pudo enviar la imagen del creador. Intenta más tarde...')
  }
}

handler.help = ['owner']
handler.tags = ['main']
handler.command = ['owner', 'creator', 'creador', 'dueño']

export default handler

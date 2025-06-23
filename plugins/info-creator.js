import fetch from 'node-fetch'

let handler = async (m, { conn }) => {
  let txt_owner = "¡Hola! Mi creadora no permite mostrar su número de telefono."
  try {
    let res = await fetch("https://qu.ax/dXOUo.jpg")
    let buffer = await res.buffer()
    await conn.sendFile(m.chat, buffer, 'thumbnail.jpg', txt_owner, m)
  } catch (e) {
    console.error(e)
    m.reply('👨‍💻 No se pudo enviar la imagen del bot. Intenta más tarde...')
  }
}

handler.help = ['owner']
handler.tags = ['main']
handler.command = ['owner', 'creatora', 'creadora', 'dueña']

export default handler

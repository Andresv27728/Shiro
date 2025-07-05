



let handler = async (m, { text, conn }) => {


  if (!text) {
    return await conn.reply(m.chat, `Escribe el prompt de la imagen. Ejemplo:\n#dalle2 𝙎𝙃𝙊𝙔𝙊 𝙃𝙄𝙉𝘼𝙏𝘼 ოძ  𝘽 ꂦ Ꮏ con denji.`, m)
  }

  await conn.reply(m.chat, ` Generando la imagen de: "${text}", espera un momento...`, m)

  try {
    let prompt = encodeURIComponent(text.trim())
    let imageUrl = `https://anime-xi-wheat.vercel.app/api/ia-img?prompt=${prompt}`

    await conn.sendFile(m.chat, imageUrl, 'imagen.jpg', ` Imagen generada:\n"${text}"`, m)
  } catch (e) {
    console.error(e)
    m.reply(`❌ Ocurrió un error al generar la imagen:\n${e.message}`)
  }
}

handler.help = ['imagina <prompt>']
handler.tags = ['main'];
handler.command = ['dalle2', 'imagen2']

export default handler

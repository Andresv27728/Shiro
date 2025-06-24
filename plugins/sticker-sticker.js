import { sticker } from '../lib/sticker.js'
//import uploadFile from '../lib/uploadFile.js'
//import uploadImage from '../lib/uploadImage.js'
//import { webp2png } from '../lib/webp2mp4.js'

let handler = async (m, { conn, args, usedPrefix, command }) => {

  let stiker = false
  try {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || q.mediaType || ''
    if (/webp|image|video/g.test(mime)) {
      if (/video/g.test(mime)) if ((q.msg || q).seconds > 8) return m.reply(`🩵 *¡El video no puede durar mas de 8 segundos!*`)
      let img = await q.download?.()
      if (!img) return conn.reply(m.chat, `🩵  *_Responde a un vídeo, imagen o Gif para generar tu sticker._*`, m)

      let out
      try {
        stiker = await sticker(img, false, global.packsticker, global.author)
      } catch (e) {
        console.error(e)
      } finally {
        if (!stiker) {
          if (/webp/g.test(mime)) out = await webp2png(img)
          else if (/image/g.test(mime)) out = await uploadImage(img)
          else if (/video/g.test(mime)) out = await uploadFile(img)
          if (typeof out !== 'string') out = await uploadImage(img)
          stiker = await sticker(false, out, global.packsticker, global.author)
        }
      }
    } else if (args[0]) {
      if (isUrl(args[0])) stiker = await sticker(false, args[0], global.packsticker, global.author)
      else return m.reply(`🩵 El url es incorrecto`)
    }
  } catch (e) {
    console.error(e)
    if (!stiker) stiker = e
  } finally {
    if (stiker) {
      // Datos del canal/newsletter
      const channelRD = { id: "120363400360651198@newsletter", name: "MAKIMA - Frases" }
      // Mensaje que irá como reenviado desde el canal
      let mensaje = "🩵 Sticker generado por MAKIMA 2.0"
      await conn.sendFile(m.chat, stiker, 'sticker.webp', '', m, true, {
        contextInfo: {
          isForwarded: true,
          forwardingScore: 999,
          forwardedNewsletterMessageInfo: {
            newsletterJid: channelRD.id,
            newsletterName: channelRD.name,
            serverMessageId: -1,
          },
          externalAdReply: {
            showAdAttribution: false,
            title: channelRD.name,
            body: `Sticker Oficial`,
            mediaType: 2,
            sourceUrl: '', // Puedes poner un enlace si quieres
            thumbnail: 'https://i.imgur.com/5Q1OtS2.jpg' // Cambia la imagen si lo deseas
          }
        }
      }, { quoted: m })

      // (Opcional) También puedes enviar un mensaje reenviado desde el canal, así:
      // await conn.sendMessage(m.chat, {
      //   text: mensaje,
      //   contextInfo: {
      //     isForwarded: true,
      //     forwardingScore: 999,
      //     forwardedNewsletterMessageInfo: {
      //       newsletterJid: channelRD.id,
      //       newsletterName: channelRD.name,
      //       serverMessageId: -1,
      //     }
      //   }
      // }, { quoted: m })
    } else {
      return conn.reply(m.chat, '🩵 *_Debes responder a un Video, Foto o Gif, para generar su sticker._*', m)
    }
  }
}

handler.help = ['stiker <img>', 'sticker <url>']
handler.tags = ['sticker']
handler.group = false;
handler.register = true
handler.command = ['s', 'sticker', 'stiker']

export default handler

const isUrl = (text) => {
  return text.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)(jpe?g|gif|png)/, 'gi'))
}
import { WAMessageStubType } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

const channelRD = {
  id: "120363400360651198@newsletter", // Cambia por tu canal si quieres
  name: "MAKIMA - CHANNEL"
};

export async function before(m, { conn, participants, groupMetadata }) {
  if (
    !m.messageStubType ||
    !m.isGroup ||
    !m.messageStubParameters?.[0] ||
    !global.db.data.chats[m.chat]?.welcome
  ) return !0

  const jid = m.messageStubParameters[0]
  const user = `@${jid.split('@')[0]}`
  // Usa una imagen cuadrada y pequeña para la miniatura
  const thumbnailUrl = 'https://i.imgur.com/5Q1OtS2.jpg' // Puedes cambiarla por otra de 96x96 px si prefieres
  const pp = await conn.profilePictureUrl(jid, 'image').catch(() => thumbnailUrl)
  const img = await fetch(pp).then(r => r.buffer())
  const total = [28, 32].includes(m.messageStubType)
    ? participants.length - 1
    : participants.length + 1

  // Contexto newsletter/canal
  const contextNewsletter = {
    isForwarded: true,
    forwardingScore: 999,
    forwardedNewsletterMessageInfo: {
      newsletterJid: channelRD.id,
      newsletterName: channelRD.name,
      serverMessageId: -1
    },
    externalAdReply: {
      title: channelRD.name,
      body: 'Canal oficial de MAKIMA 2.0',
      thumbnailUrl: thumbnailUrl, // Imagen cuadrada y pequeña
      mediaType: 1,
      renderLargerThumbnail: false,
      sourceUrl: `https://whatsapp.com/channel/${channelRD.id.replace('@newsletter', '')}`
    }
  };

  if (m.messageStubType == 27) {
    const bienvenida = `
💎 WELCOME - USER 💎

🩵 Usuario: ${user}
🩵 Grupo: ${groupMetadata.subject}
🩵 Miembros: ${total}

⌬ Usa *#help* para ver los comandos disponibles
`
    // Mensaje de bienvenida como newsletter
    await conn.sendMessage(m.chat, { 
      image: img, 
      caption: bienvenida, 
      contextInfo: contextNewsletter 
    })
    // Mensaje adicional
    await conn.sendMessage(m.chat, { 
      text: 'SE NOS UNIÓ UN USUARIO', 
      contextInfo: contextNewsletter
    })
  }

  if ([28, 32].includes(m.messageStubType)) {
    const despedida = `
💎 ADIOS - USER 💎

🩵 Usuario: ${user}
🩵 Grupo: ${groupMetadata.subject}
🩵 Miembros: ${total}

⌬ Espero y vuelvas después.
`
    // Mensaje de despedida como newsletter
    await conn.sendMessage(m.chat, { 
      image: img, 
      caption: despedida, 
      contextInfo: contextNewsletter 
    })
    // Segundo mensaje como newsletter
    await conn.sendMessage(m.chat, { 
      text: 'SE NOS FUE EL USUARIO', 
      contextInfo: contextNewsletter
    })
  }
}
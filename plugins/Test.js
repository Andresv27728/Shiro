const channelRD = {
  id: "120363400360651198@newsletter", // Cambia por tu canal si es necesario
  name: "MAKIMA - CHANNEL"
};

let WAMessageStubType = (await import('@whiskeysockets/baileys')).default;

let handler = m => m;
handler.before = async function (m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return;
  const fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net"};
  let chat = global.db.data.chats[m.chat];
  let usuario = `@${m.sender.split`@`[0]}`;
  let pp = await conn.profilePictureUrl(m.chat, 'image').catch(_ => null) || 'https://qu.ax/dXOUo.jpg';

  let nombre, foto, edit, newlink, status, admingp, noadmingp, aceptar;
  nombre = `${usuario} Ha cambiado el nombre del grupo.\n\nAhora el grupo se llama:\n*${m.messageStubParameters[0]}*.`;
  foto = `Se ha cambiado la imagen del grupo.\n\nAcción hecha por:\n> » ${usuario}`;
  edit = `${usuario} Ha permitido que ${m.messageStubParameters[0] == 'on' ? 'solo admins' : 'todos'} puedan configurar el grupo.`;
  newlink = `El enlace del grupo ha sido restablecido.\n\nAcción hecha por:\n> » ${usuario}`;
  status = `El grupo ha sido ${m.messageStubParameters[0] == 'on' ? '*cerrado*' : '*abierto*'} Por ${usuario}\n\n> ✧ Ahora ${m.messageStubParameters[0] == 'on' ? '*solo admins*' : '*todos*'} pueden enviar mensaje.`;
  admingp = `《✦》${m.messageStubParameters[0].replace(/@.+/, '')} Ahora es admin del grupo.\n\n> ✧ Acción hecha por:\n> » ${usuario}`;
  noadmingp =  `《✦》${m.messageStubParameters[0].replace(/@.+/, '')} Deja de ser admin del grupo.\n\n> ✧ Acción hecha por:\n> » ${usuario}`;
  aceptar = `✦ Ha llegado un nuevo participante al grupo.\n\n> ◦ ✐ Grupo: *${groupMetadata.subject}*\n\n> ◦ ⚘ Bienvenido/a: ${m.messageStubParameters[0].replace(/@.+/, '')}\n\n> ◦ ✧ Aceptado por: ${usuario}`;

  // newsletter context
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
      thumbnailUrl: 'https://i.imgur.com/5Q1OtS2.jpg',
      mediaType: 1,
      renderLargerThumbnail: true,
      sourceUrl: `https://whatsapp.com/channel/${channelRD.id.replace('@newsletter', '')}`
    }
  };

  if (chat.detect && m.messageStubType == 21) {
    await conn.sendMessage(m.chat, { text: nombre, contextInfo: contextNewsletter }, { quoted: fkontak });
  } else if (chat.detect && m.messageStubType == 22) {
    await conn.sendMessage(m.chat, { image: { url: pp }, caption: foto, contextInfo: contextNewsletter }, { quoted: fkontak });
  } else if (chat.detect && m.messageStubType == 23) {
    await conn.sendMessage(m.chat, { text: newlink, contextInfo: contextNewsletter }, { quoted: fkontak });
  } else if (chat.detect && m.messageStubType == 25) {
    await conn.sendMessage(m.chat, { text: edit, contextInfo: contextNewsletter }, { quoted: fkontak });
  } else if (chat.detect && m.messageStubType == 26) {
    await conn.sendMessage(m.chat, { text: status, contextInfo: contextNewsletter }, { quoted: fkontak });
  } else if (chat.detect2 && m.messageStubType == 27) {
    await conn.sendMessage(m.chat, { text: aceptar, contextInfo: contextNewsletter }, { quoted: fkontak });
  } else if (chat.detect && m.messageStubType == 29) {
    await conn.sendMessage(m.chat, { text: admingp, contextInfo: contextNewsletter }, { quoted: fkontak });
  } else if (chat.detect && m.messageStubType == 30) {
    await conn.sendMessage(m.chat, { text: noadmingp, contextInfo: contextNewsletter }, { quoted: fkontak });
  } else {
    if (m.messageStubType == 2) return;
    console.log({
      messageStubType: m.messageStubType,
      messageStubParameters: m.messageStubParameters,
      type: WAMessageStubType[m.messageStubType],
    });
  }
};
export default handler;


const channelRD = {
  id: "120363419172960653@newsletter", // Cambia por tu canal si quieres
  name: "𝙎𝙃𝙊𝙔𝙊 𝙃𝙄𝙉𝘼𝙏𝘼 ოძ  𝘽 ꂦ Ꮏ"
}
const thumbnailUrl = 'https://cdn.russellxz.click/17cdc1bd.jpeg' // Imagen cuadrada y pequeña

let handler = async function (m, { args, command, usedPrefix, conn }) {
  if (!args[0]) {
    // Reacciona con ✖️ al mensaje del usuario
    await conn.sendMessage(m.chat, {
      react: { text: "✖️", key: m.key }
    });
    // Si no hay texto, responde como newsletter y citando el mensaje original del usuario
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
        body: '𝙎𝙃𝙊𝙔𝙊 𝙃𝙄𝙉𝘼𝙏𝘼 ოძ  𝘽 ꂦ Ꮏ',
        thumbnailUrl: thumbnailUrl,
        mediaType: 1,
        renderLargerThumbnail: false,
        sourceUrl: `https://whatsapp.com/channel/${channelRD.id.replace('@newsletter', '')}`
      }
    };
    await conn.sendMessage(
      m.chat,
      {
        text: '「🖤」Debes ingresar un texto para usar este comando.',
        contextInfo: contextNewsletter
      },
      { quoted: m }
    );
    return;
  }
  // Construye el texto a repetir
  const text = args.join(' ');
  // Mensaje citado
  const quotedMsg = {
    key: { fromMe: false, participant: "0@s.whatsapp.net", remoteJid: m.chat, id: Math.random().toString(36).slice(2) },
    message: { conversation: '𝙎𝙃𝙊𝙔𝙊 𝙃𝙄𝙉𝘼𝙏𝘼 ოძ  𝘽 ꂦ Ꮏ' }
  };
  await conn.sendMessage(m.chat, { text }, { quoted: quotedMsg });
};

handler.help = ['repite', 'repeat', 'copiame'].map(v => v + ' <texto>');
handler.tags = ['tools'];
handler.command = /^(repite|repeat|copiame)$/i;
handler.register = false;
handler.limit = false;
handler.group = false; // pon true si quieres solo en grupos

export default handler;

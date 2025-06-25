const channelRD = {
  id: "120363400360651198@newsletter",
  name: "MAKIMA - Frases"
};

let handler = m => m;
handler.before = async function (m, { conn }) {
  if (!m.messageStubType || !m.isGroup) return;

  // 29 = promote, 30 = demote (según Baileys)
  if (m.messageStubType == 29 || m.messageStubType == 30) {
    // Nombre o número limpio del usuario afectado
    let target = m.messageStubParameters[0];
    let username = '';
    try {
      username = await conn.getName(target);
    } catch (e) {}
    if (!username || username === target) {
      username = target.replace(/[@:\.a-z]/gi, '');
    }

    // Nombre o número limpio del actor
    let by = m.sender;
    let username2 = '';
    try {
      username2 = await conn.getName(by);
    } catch (e) {}
    if (!username2 || username2 === by) {
      username2 = by.replace(/[@:\.a-z]/gi, '');
    }

    let texto = '';
    if (m.messageStubType == 29) {
      texto = `${username} fue puesto de admin por ${username2}`;
    } else if (m.messageStubType == 30) {
      texto = `${username} fue quitado de admin por ${username2}`;
    }

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

    await conn.sendMessage(m.chat, { text: texto, contextInfo: contextNewsletter });
  }
};
export default handler;
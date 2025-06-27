import util from 'util';

let delay = util.promisify(setTimeout);
// O si prefieres, usa esto después de los imports:
// let delay = ms => new Promise(res => setTimeout(res, ms));

let handler = async (m, { isOwner, isAdmin, conn, participants }) => {
  if (!m.isGroup) {
    await conn.sendMessage(m.chat, {
      text: '〘💎〙Este comando solo puede ser usado en grupos.',
      contextInfo: newsletterContext([m.sender])
    }, { quoted: m });
    return;
  }
  if (!(isAdmin || isOwner)) {
    await conn.sendMessage(m.chat, {
      text: '〘💎〙Este comando solo puede ser usado por admins.',
      contextInfo: newsletterContext([m.sender])
    }, { quoted: m });
    return;
  }
  let prepMsg = await conn.sendMessage(m.chat, {
    text: '〘💎〙Mencionando el grupo, espere un momento...',
    contextInfo: newsletterContext([m.sender])
  }, { quoted: m });

  try {
    await conn.sendMessage(m.chat, { react: { text: "💎", key: prepMsg.key }});
    await delay(500);
    await conn.sendMessage(m.chat, { react: { text: "🩵", key: prepMsg.key }});
    await delay(500);
    await conn.sendMessage(m.chat, { react: { text: "💎", key: prepMsg.key }});
  } catch {}

  await delay(2000);

  let invocador = '@' + m.sender.split('@')[0];
  let lista = participants.map(mem => `┃✰ @${mem.id.split('@')[0]}`).join('\n');
  let texto = `╭───〘 ✰ 〙───╮
┃MAKIMA 2.0 BOT┃
╰━━━━━━━━━━━╯

Tᴇ ɪɴᴠᴏᴄᴏ́: ${invocador}

╔━❍━❍━❍━❍━❍╗
${lista}
╚━━━━━━━━━━━━╝`;

  await conn.sendMessage(m.chat, {
    text: texto,
    mentions: participants.map(a => a.id),
    contextInfo: newsletterContext(participants.map(a => a.id))
  });
};

handler.help = ['tagall', 'mensionall', 'todos', 'invocar'];
handler.tags = ['grupo'];
handler.command = ['tagall', 'mensionall', 'todos', 'invocar'];
handler.admin = true;
handler.group = true;
export default handler;

// Si ya tienes newsletterContext, omítelo.
function newsletterContext(mentioned = []) {
  return {
    mentionedJid: mentioned,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: channelRD.id,
      newsletterName: channelRD.name,
      serverMessageId: -1,
    },
    forwardingScore: 999,
    externalAdReply: {
      title: NEWSLETTER_TITLE,
      body: channelRD.name,
      thumbnailUrl: MAKIMA_ICON,
      sourceUrl: GITHUB_MAKIMA,
      mediaType: 1,
      renderLargerThumbnail: false
    }
  }
}
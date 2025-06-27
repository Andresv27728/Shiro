let handler = async (m, { isOwner, isAdmin, conn, participants }) => {
  if (!m.isGroup) {
    return await conn.sendMessage(m.chat, {
      text: '〘💎〙Este comando solo puede ser usado en grupos.',
      contextInfo: newsletterContext([m.sender])
    }, { quoted: m });
  }
  if (!(isAdmin || isOwner)) {
    return await conn.sendMessage(m.chat, {
      text: '〘💎〙Este comando solo puede ser usado por admins.',
      contextInfo: newsletterContext([m.sender])
    }, { quoted: m });
  }
  // Mensaje de espera con reply y newsletter
  let prepMsg = await conn.sendMessage(m.chat, {
    text: '〘💎〙Mencionando el grupo, espere un momento...',
    contextInfo: newsletterContext([m.sender])
  }, { quoted: m });
  // Reacciones secuenciales
  if (conn.sendMessage && prepMsg.key) {
    await conn.sendMessage(m.chat, { react: { text: "💎", key: prepMsg.key }});
    await conn.sendMessage(m.chat, { react: { text: "🩵", key: prepMsg.key }});
    await conn.sendMessage(m.chat, { react: { text: "💎", key: prepMsg.key }});
  }
  // Mensión masiva con formato
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

// Si ya tienes esto, NO lo pegues dos veces:
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
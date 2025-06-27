// --- INICIO DEL NUEVO COMANDO ---

const delay = ms => new Promise(res => setTimeout(res, ms));

handler.command = handler.command ? handler.command.concat(['tagall','mensionall','todos','invocar']) : ['tagall','mensionall','todos','invocar'];

handler.all = async (m, { conn, participants, isBotAdmin, isAdmin, isOwner, groupMetadata }) => {
  // Este bloque es para que el comando esté disponible sólo en grupos y sólo para admins
  if (!m.isGroup) {
    if (/^#(tagall|mensionall|todos|invocar)$/i.test(m.text.trim()))
      return m.reply('〘💎〙Este comando solo puede ser usado en grupos.');
    return;
  }
  if (/^#(tagall|mensionall|todos|invocar)$/i.test(m.text.trim()) && !isAdmin && !isOwner)
    return m.reply('〘💎〙Este comando solo puede ser usado por admins.');
};

handler.before = async (m, { conn, participants, isBotAdmin, isAdmin, isOwner, groupMetadata }) => {
  // Solo ejecuta el comando si es uno de los que queremos
  if (!/^#(tagall|mensionall|todos|invocar)$/i.test(m.text.trim())) return;

  // Solo grupos y admins, el resto se gestiona en handler.all
  if (!m.isGroup || (!isAdmin && !isOwner)) return;

  // Armar la lista de menciones
  let users = participants.map(u => u.id);
  let invocadorTag = '@' + m.sender.split('@')[0];
  let lista = users.map(u => '┃✰ @' + u.split('@')[0]).join('\n');
  let texto = `╭───〘 ✰ 〙───╮
┃MAKIMA 2.0 BOT┃
╰━━━━━━━━━━━╯

Tᴇ ɪɴᴠᴏᴄᴏ́: ${invocadorTag}

╔━❍━❍━❍━❍━❍╗
${lista}
╚━━━━━━━━━━━━╝`;

  // Mensaje de "espere un momento" con reply y newsletter
  let prepMsg = await conn.sendMessage(m.chat, {
    text: '〘💎〙Mencionando el grupo, espere un momento...',
    contextInfo: newsletterContext([m.sender])
  }, { quoted: m });

  // Reaccionar 💎 → 🩵 → 💎
  if (conn.sendMessage && prepMsg.key) {
    try {
      await conn.sendMessage(m.chat, { react: { text: "💎", key: prepMsg.key }});
      await delay(500);
      await conn.sendMessage(m.chat, { react: { text: "🩵", key: prepMsg.key }});
      await delay(500);
      await conn.sendMessage(m.chat, { react: { text: "💎", key: prepMsg.key }});
    } catch {}
  }

  // Esperar 2 segundos
  await delay(2000);

  // Mensaje de mención masiva con newsletter (sin reply)
  await conn.sendMessage(m.chat, {
    text: texto,
    mentions: users,
    contextInfo: newsletterContext(users)
  });
};

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
  };
}

// --- FIN DEL NUEVO COMANDO ---
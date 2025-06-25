const channelRD = {
  id: "120363400360651198@newsletter",
  name: "MAKIMA - Frases"
};

conn.ev.on('group-participants.update', async (update) => {
  if (!update || !update.action || !['promote', 'demote'].includes(update.action)) return;
  const grupo = update.id;
  const afectados = update.participants || [];
  const by = update.actor || '';

  for (let target of afectados) {
    // Obtener los nombres visibles de WhatsApp
    let username = await conn.getName(target).catch(_ => target.split('@')[0]);
    let username2 = await conn.getName(by).catch(_ => by.split('@')[0]);

    let texto = '';
    if (update.action === 'promote') {
      texto = `${username} fue puesto de admin por ${username2}`;
    } else if (update.action === 'demote') {
      texto = `${username} fue quitado de admin por ${username2}`;
    }

    await conn.sendMessage(grupo, {
      text: texto,
      contextInfo: {
        isForwarded: true,
        forwardingScore: 999,
        forwardedNewsletterMessageInfo: {
          newsletterJid: channelRD.id,
          newsletterName: channelRD.name,
          serverMessageId: -1,
        },
        externalAdReply: {
          title: channelRD.name,
          body: 'Canal oficial de MAKIMA 2.0',
          thumbnailUrl: 'https://i.imgur.com/5Q1OtS2.jpg',
          mediaType: 1,
          renderLargerThumbnail: true,
          sourceUrl: `https://whatsapp.com/channel/${channelRD.id.replace('@newsletter', '')}`
        }
      }
    });
  }
});
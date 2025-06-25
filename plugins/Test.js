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
    // Obtener nombres reales
    let nombreTarget = await conn.getName(target);
    let nombreBy = await conn.getName(by);

    let texto = '';
    if (update.action === 'promote') {
      texto = `${nombreTarget} fue puesto de admin por ${nombreBy}`;
    } else if (update.action === 'demote') {
      texto = `${nombreTarget} fue quitado de admin por ${nombreBy}`;
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
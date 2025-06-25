// Configuración de tu canal/newsletter
const channelRD = {
  id: "120363400360651198@newsletter", // ID de tu canal/newsletter
  name: "MAKIMA - Frases"              // Nombre de tu canal/newsletter
}

// Listener del evento de cambios en administradores
conn.ev.on('group-participants.update', async (update) => {
  /*
    update = {
      id: 'grupo@g.us',
      participants: [ 'usuario@s.whatsapp.net' ],
      action: 'promote' | 'demote',
      actor: 'quien-hizo-el-cambio@s.whatsapp.net'
    }
  */
  if (!update || !update.action || !['promote', 'demote'].includes(update.action)) return;
  const grupo = update.id;
  const afectados = update.participants || [];
  const by = update.actor || '';
  for (let target of afectados) {
    let texto = '';
    if (update.action === 'promote') {
      texto = `@${target.split('@')[0]} fue puesto de admin por @${by.split('@')[0]}`;
    } else if (update.action === 'demote') {
      texto = `@${target.split('@')[0]} fue quitado de admin por @${by.split('@')[0]}`;
    }
    await conn.sendMessage(grupo, {
      text: texto,
      mentions: [target, by],
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
    })
  }
});
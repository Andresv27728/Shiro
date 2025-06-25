// Porfavor deja los creditos: Código original x Félix Manuel, adaptación por GitHub Copilot Chat Assistant

const channelRD = {
  id: "120363400360651198@newsletter", // tu canal/newsletter
  name: "MAKIMA - Frases"              // nombre de tu canal/newsletter
}

export async function onGroupParticipantsUpdate(update, conn) {
  // update: { id, participants, action, actor }
  if (!update || !update.action || !['promote', 'demote'].includes(update.action)) return;
  const target = update.participants[0]
  const by = update.actor
  let texto = ''
  if (update.action === 'promote') {
    texto = `@${target.split('@')[0]} fue puesto de admin por @${by.split('@')[0]}`
  } else if (update.action === 'demote') {
    texto = `@${target.split('@')[0]} fue quitado de admin por @${by.split('@')[0]}`
  } else return;

  await conn.sendMessage(update.id, {
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
    },
  })
}

// --- EN TU MAIN O DONDE INICIALIZAS EL BOT ---
conn.ev.on('group-participants.update', async (update) => {
  await onGroupParticipantsUpdate(update, conn)
})
const channelRD = {
  id: "120363400360651198@newsletter", // Cambia estos datos si quieres usar otro canal
  name: "MAKIMA - Frases"
};

conn.ev.on('group-participants.update', async (update) => {
  if (!update || !['promote', 'demote'].includes(update.action)) return;
  const grupo = update.id;
  const afectados = update.participants || [];
  const by = update.actor || '';

  for (let target of afectados) {
    // Intentar obtener el nombre visible, sino solo el número sin arroba
    let username = '';
    try {
      username = await conn.getName(target);
    } catch (e) {}
    if (!username || username === target) {
      username = target.replace(/[@:\.a-z]/gi, '');
    }

    // Actor
    let username2 = '';
    if (by && typeof by === 'string') {
      try {
        username2 = await conn.getName(by);
      } catch (e) {}
      if (!username2 || username2 === by) {
        username2 = by.replace(/[@:\.a-z]/gi, '');
      }
    } else {
      username2 = 'Desconocido';
    }

    let texto = '';
    if (update.action === 'promote') {
      texto = `${username} fue puesto de admin por ${username2}`;
    } else if (update.action === 'demote') {
      texto = `${username} fue quitado de admin por ${username2}`;
    }

    await conn.sendMessage(grupo, {
      text: texto.jpg',
          mediaType: 1,
          renderLargerThumbnail: true,
          sourceUrl: `https://whatsapp.com/channel/${channelRD.id.replace('@newsletter', '')}`
        }
      }
    });
  }
});
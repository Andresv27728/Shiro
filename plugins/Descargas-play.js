import yts from 'yt-search';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    throw `✐ Ingresa un nombre o texto para buscar en YouTube.\n> *Ejemplo:* ${usedPrefix + command} Haikyuu AMV`;
  }

  try {
    await m.react('🔍'); // Reacción de búsqueda

    const search = await yts(text);
    const videoInfo = search.all?.[0];

    if (!videoInfo) {
      throw '❌ No se encontraron resultados. Intenta con otro título.';
    }

    const body = `*「✧ Resultados 」*

❀ *Título:* » ${videoInfo.title}
❀ *Canal:* » ${videoInfo.author.name}
❀ *Duración:* » ${videoInfo.timestamp}
❀ *Publicado:* » ${videoInfo.ago}
👁❀ *Vistas:* » ${videoInfo.views.toLocaleString()}

✦ *Selecciona una opción para descargar:*`;

    await conn.sendMessage(
      m.chat,
      {
        image: { url: videoInfo.thumbnail },
        caption: body,
        footer: '🍨 ᴍᴀᴋɪᴍᴀ ʙᴏᴛ 🎋| ᴘʟᴀʏ',
        buttons: [
          { buttonId: `.ytmp3 ${videoInfo.url}`, buttonText: { displayText: '★ 𝙰𝚄𝙳𝙸𝙾 ★' } },
          { buttonId: `.ytmp4 ${videoInfo.url}`, buttonText: { displayText: '★ 𝚅𝙸𝙳𝙴𝙾 ★' } },
        ],
        viewOnce: true,
        headerType: 4,
      },
      { quoted: m }
    );

    await m.react('✅'); // Reacción de éxito
  } catch (e) {
    await m.reply(`❌ Error: ${e.message}`);
    await m.react('✖️');
  }
};

handler.command = ['play', 'playvid', 'play2'];
handler.tags = ['downloader'];
handler.group = true;
handler.limit = 6;

export default handler;

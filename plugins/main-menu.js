let handler = async (m, { conn }) => {
  try {
    const nombre = await conn.getName(m.sender);
    const saludo = `╭━━❰ 𝙈𝙀𝙉𝙐 ❱━━⬣
┃🌟  ¡Hola ${nombre}!
┃👋 Bienvenido/a al *Bot Oficial*
┃📜 Aquí tienes el menú:
╰━━━━━━━━━━━━━━⬣`;

    const buttons = [
      { buttonId: '#infobot', buttonText: { displayText: '📌 InfoBot' }, type: 1 },
      { buttonId: '#estado', buttonText: { displayText: '📈 Estado' }, type: 1 },
      { buttonId: '#menu2', buttonText: { displayText: '📋 Más opciones' }, type: 1 },
    ];

    const buttonMessage = {
      text: saludo,
      footer: '✨ Usa los botones o comandos manuales.',
      buttons: buttons,
      headerType: 1
    };

    await conn.sendMessage(m.chat, buttonMessage, { quoted: m });

    // Reacciona con un emoji al mensaje original
    await conn.sendMessage(m.chat, { react: { text: '📋', key: m.key } });
  } catch (e) {
    console.error(e);
    await m.reply('❌ Hubo un error al mostrar el menú.');
  }
};

handler.help = ['menu'];
handler.tags = ['main'];
handler.command = /^menu$/i; // Asegura que reconozca solo "menu"

export default handler;

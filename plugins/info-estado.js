import ws from 'ws';

// Inicializamos variables globales para el nombre y la foto del bot
global.botName = 'MAKIMA 2.0 BOT'; // Nombre inicial del bot
global.botBanner = 'https://files.catbox.moe/ed9tq4.jpg'; // URL inicial de la foto del bot

let handler = async (m, { conn, usedPrefix, text, command }) => {
  let _muptime;
  let totalreg = Object.keys(global.db.data.users).length;
  let totalchats = Object.keys(global.db.data.chats).length;
  let vs = global.vs || '1.0.0';

  // Tiempo de actividad
  if (process.send) {
    process.send('uptime');
    _muptime = await new Promise(resolve => {
      process.once('message', resolve);
      setTimeout(resolve, 1000);
    }) * 1000;
  }

  let muptime = clockString(_muptime || 0);

  // SubBots activos
  let users = [...new Set([...global.conns.filter((conn) => conn.user && conn.ws?.socket?.readyState !== ws.CLOSED)])];
  const chats = Object.entries(conn.chats).filter(([id, data]) => id && data.isChats);
  const groupsIn = chats.filter(([id]) => id.endsWith('@g.us'));
  const totalUsers = users.length;

  // Velocidad
  let old = performance.now();
  let neww = performance.now();
  let speed = neww - old;

  // Actualizaciones con #setname y #setbanner
  if (command === 'setname') {
    if (!text) {
      return await m.reply('「🩵」Por favor, proporciona el nuevo nombre para el bot.', m);
    }
    global.botName = text.trim(); // Actualiza el nombre global del bot
    return await m.reply(`「🩵」El nombre del bot se actualizó con éxito a: ${global.botName}`, m);
  }

  if (command === 'setbanner') {
    if (!text) {
      return await m.reply('「🩵」Por favor, proporciona el enlace de la nueva foto del bot.', m);
    }
    global.botBanner = text.trim(); // Actualiza la URL global de la foto del bot
    return await m.reply('「🩵」La foto del bot se actualizó con éxito.', m);
  }

  // Mensaje principal
  let blackclover = `
╭━━━━◇◇◇━━━━⬣
┃ ESTADO DE LA BOT 
┃ ${global.botName}
╰━━━━◇◇◇━━━━⬣

🩵 *Creador:* Félix Manuel 
🩵 *Prefijo:* [ ${usedPrefix} ]
🩵 *Versión:* ${vs}

🩵 *Usuarios registrados:* ${totalreg}
🩵 *Total de chats:* ${chats.length}
🩵 *Grupos:* ${groupsIn.length}
🩵 *Privados:* ${chats.length - groupsIn.length}
🩵 *SubBots activos:* ${totalUsers || '0'}

🩵 *Actividad:* ${muptime}
🩵 *Velocidad:* ${(speed * 1000).toFixed(0) / 1000}s
`.trim();

  await conn.sendFile(m.chat, global.botBanner, 'estado.jpg', blackclover, null, null, null);
};

handler.help = ['status', 'setname', 'setbanner'];
handler.tags = ['info'];
handler.command = ['estado', 'status', 'estate', 'state', 'stado', 'stats', 'setname', 'setbanner'];
handler.register = true;

export default handler;

// Función para convertir milisegundos a hh:mm:ss
function clockString(ms) {
  let h = Math.floor(ms / 3600000);
  let m = Math.floor(ms / 60000) % 60;
  let s = Math.floor(ms / 1000) % 60;
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
}
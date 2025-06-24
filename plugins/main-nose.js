import ws from 'ws';

let handler = async (m, { conn, usedPrefix, args, participants }) => {

  // Si no pone el número o tag, le responde con ejemplo
  if (!args[0] && (!m.mentionedJid || m.mentionedJid.length === 0)) {
    return m.reply(`⚠️ Etiqueta el número de algún bot o escribe el número directamente.\nEjemplo:\n${usedPrefix}setprimary @tag\n${usedPrefix}setprimary 51999999999`);
  }

  // Lista de bots conectados
  const users = [...new Set(
    global.conns?.filter(c => c.user && c.ws && c.ws.socket && c.ws.socket.readyState !== ws.CLOSED)
  )];

  let botJid;
  let selectedBot;

  // Si lo etiquetó directamente
  if (m.mentionedJid && m.mentionedJid.length > 0) {
    botJid = m.mentionedJid[0];
  } else {
    // Si puso número manual, lo formatea
    botJid = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
  }

  // Si el que quiere setear es el bot principal actual
  if (botJid === conn.user.jid) {
    selectedBot = conn;
  } else {
    // Busca entre los otros bots conectados
    selectedBot = users.find(c => c.user?.jid === botJid);
  }

  if (!selectedBot) {
    return m.reply(`⚠️ No se encontró un bot conectado con esa mención o número. Usa ${usedPrefix}listjadibot para ver los bots disponibles.`);
  }

  // Guarda en la base de datos de ese chat
  let chat = global.db.data.chats[m.chat];
  if (!chat) chat = global.db.data.chats[m.chat] = {};
  
  chat.primaryBot = botJid;

  conn.sendMessage(m.chat, {
    text: `✅ El bot @${botJid.split('@')[0]} ha sido establecido como *PRIMARIO* en este grupo.\nLos demás bots no responderán aquí.`,
    mentions: [botJid]
  }, { quoted: m });

};

handler.help = ['setprimary <@tag o numero>'];
handler.tags = ['jadibot'];
handler.command = ['setprimary'];
handler.group = true;
handler.admin = true; // Solo admin puede usarlo
handler.botAdmin = true; // El bot debe ser admin para evitar confusiones

export default handler;

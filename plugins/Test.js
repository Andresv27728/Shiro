import fetch from "node-fetch";
import yts from "yt-search";

const getServerInfo = async () => {
  const memoryUsage = process.memoryUsage().heapUsed / 1024 / 1024;
  const registeredUsers = 100; // Cambiar por tu lógica real
  return { memoryUsage, registeredUsers };
};

const handler = async (m, { conn, text }) => {
  if (text?.toLowerCase() === "infobot") {
    const creatorName = "Felix";
    const botName = "Mi Bot de WhatsApp";

    const { memoryUsage, registeredUsers } = await getServerInfo();

    const infoMessage = `
🤖 Información del Bot:
Nombre del Bot: ${botName}
Creador: ${creatorName}
Memoria del Servidor: ${memoryUsage.toFixed(2)} MB
Usuarios Registrados: ${registeredUsers}
    `.trim();

    await conn.reply(m.chat, infoMessage, m);
  }
};

handler.command = ["infobot", "botinfoo"];
handler.tags = ["info"];

export default handler;
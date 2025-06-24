import fetch from "node-fetch";
import yts from "yt-search";

// Aquí puedes agregar la lógica para obtener la memoria del servidor y los usuarios registrados
const getServerInfo = async () => {
    // Simulación de datos, reemplaza esto con tu lógica real
    const memoryUsage = process.memoryUsage().heapUsed / 1024 / 1024; // Memoria en MB
    const registeredUsers = 100; // Cambia esto por la lógica que uses para contar usuarios
    return { memoryUsage, registeredUsers };
};

const handler = async (m, { conn, text }) => {
    if (text === "#infobot") {
        const creatorName = "Ado (Wirk)"; // Cambia esto por el nombre del creador
        const botName = "Mi Bot de WhatsApp"; // Cambia esto por el nombre de tu bot

        // Obtener información del servidor
        const { memoryUsage, registeredUsers } = await getServerInfo();

        const infoMessage = `
🤖 Información del Bot:
Nombre del Bot: ${botName}
Creador: ${creatorName}
Memoria del Servidor: ${memoryUsage.toFixed(2)} MB
Usuarios Registrados: ${registeredUsers}
        `.trim();

        await m.reply(infoMessage);
    } else {
        // Aquí puedes manejar otros comandos si es necesario
    }
};

handler.command = ["infobott", "botinfoo"];
handler.help = handler.command;
handler.tags = ["info"];

export default handler;
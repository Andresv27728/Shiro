import fetch from "node-fetch";
import yts from "yt-search";

// Función para generar la respuesta de la IA
const getAdonixResponse = () => {
    return `
¡Qué pex we! 😎 Soy Adonix, tu asistente virtual. Aquí estoy para ayudarte con tus dudas sobre programación, bots de WhatsApp y más. ¿Qué necesitas saber? ¡Dímelo y le damos! ✌️
    `.trim();
};

const handler = async (m, { conn, text }) => {
    if (text === "#adonix") {
        const responseMessage = getAdonixResponse();

        // Enviar el mensaje como reenviado
        await conn.sendMessage(m.chat, {
            text: responseMessage,
            quoted: m // Esto hace que el mensaje parezca reenviado
        });
    } else {
        // Aquí puedes manejar otros comandos si es necesario
    }
};

handler.command = ["adonix"];
handler.help = handler.command;
handler.tags = ["main"];

export default handler;

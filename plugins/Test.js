const YOUR_PHONE_NUMBER = "18293142989@s.whatsapp.net";

// Lista de memes actualizada con imágenes reales
const memes = [
  { url: "https://i.imgur.com/fYdPp3E.jpg", caption: "Meme divertido 1" },
  { url: "https://i.imgur.com/CXhhcLq.jpg", caption: "Meme gracioso 2" },
  { url: "https://i.imgur.com/ZvUQU5U.jpg", caption: "Meme de TikTok 3" }
];

let handler = async (m, { conn, command }) => {
  console.log("Comando memechannel ejecutado"); // Mensaje de depuración

  if (command === 'memechannel') {
    console.log("Enviando memes al número privado..."); // Mensaje de depuración

    // Enviar todos los memes al número privado
    for (const meme of memes) {
      await conn.sendMessage(YOUR_PHONE_NUMBER, {
        image: { url: meme.url },
        caption: meme.caption,
      });
    }
    console.log("Memes enviados al número privado."); // Mensaje de depuración

    // Mensaje de confirmación en el chat
    await conn.sendMessage(m.chat, {
      text: '「🩵」Memes enviados exitosamente a tu número privado.',
    }, { quoted: m });

    console.log("Mensaje de confirmación enviado al chat."); // Mensaje de depuración
  }
};

handler.help = ['memechannel'];
handler.tags = ['fun'];
handler.command = ['memechannel'];
handler.register = true;
export default handler;
const YOUR_PHONE_NUMBER = "18293142989@s.whatsapp.net";

// Lista de memes
const memes = [
  { url: "https://i.imgur.com/1.jpg", caption: "Meme 1" },
  { url: "https://i.imgur.com/2.jpg", caption: "Meme 2" },
  { url: "https://i.imgur.com/3.jpg", caption: "Meme 3" }
];

let handler = async (m, { conn, command }) => {
  console.log("Comando testconnection ejecutado"); // Mensaje de depuración

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
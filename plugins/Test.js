const YOUR_PHONE_NUMBER = "18293142989@s.whatsapp.net";

let handler = async (m, { conn, command }) => {
  console.log("Comando testconnection ejecutado"); // Mensaje de depuración

  if (command === 'testconnection') {
    console.log("Enviando mensaje al número privado..."); // Mensaje de depuración

    await conn.sendMessage(YOUR_PHONE_NUMBER, {
      text: "Hola, este es un mensaje de prueba para verificar la conexión.",
    });

    console.log("Mensaje enviado al número privado."); // Mensaje de depuración

    await conn.sendMessage(m.chat, {
      text: '「🩵」Mensaje de prueba enviado a tu número privado.',
    }, { quoted: m });

    console.log("Mensaje de confirmación enviado al chat."); // Mensaje de depuración
  }
};

handler.help = ['testconnection'];
handler.tags = ['test'];
handler.command = ['testconnection'];
handler.register = true;
export default handler;
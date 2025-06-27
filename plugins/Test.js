const YOUR_PHONE_NUMBER = "18293142989";

let handler = async (m, { conn, command }) => {
  if (command === 'testconnection') {
    await conn.sendMessage(YOUR_PHONE_NUMBER, {
      text: "Hola, este es un mensaje de prueba para verificar la conexión.",
    });

    await conn.sendMessage(m.chat, {
      text: '「🩵」Mensaje de prueba enviado a tu número privado.',
    }, { quoted: m });
  }
};

handler.help = ['testconnection'];
handler.tags = ['test'];
handler.command = ['testconnection'];
handler.register = true;
export default handler;
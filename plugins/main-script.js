const handler = async (m, { conn }) => {
  const texto = `
 _*REPO DE LA BOT*_ 

\`\`\`Repositorio OFC:\`\`\`
https://github.com/mantis-has/Makima

> 🌟 Deja tu estrella así nos motivas a seguir mejorando la bot.

🩵 *Grupo oficial de la bot:* ${gc1}
  `.trim()

  await conn.reply(m.chat, texto, m)
}

handler.help = ['script']
handler.tags = ['info']
handler.command = ['script']

export default handler

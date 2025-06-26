let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw '𝙄𝙉𝙂𝙍𝙀𝙎𝙀 𝙐𝙉 𝙉𝙊𝙈𝘽𝙍𝙀'
  try {
    await conn.updateProfileName(text)
    m.reply('LISTO!')
  } catch (e) {
    console.log(e)
    throw `Error`
  }
}
handler.help = ['setbotname <nombre>']
handler.tags = ['owner']
handler.command = /^(setbotname)$/i

handler.owner = true

export default handler
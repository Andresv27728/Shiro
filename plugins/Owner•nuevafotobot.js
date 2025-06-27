import fs from 'fs'
import path from 'path'

const handler = async (m, { text, usedPrefix, command }) => {
  const senderNumber = m.sender.replace(/[^0-9]/g, '')
  const botPath = path.join('./MakiJadiBot', senderNumber)
  const configPath = path.join(botPath, 'config.json')

  
  const urlRegex = /(https?:\/\/[^\s]+(\.jpg|\.jpeg|\.png|\.webp))/i
  const match = text.match(urlRegex)
  if (!match) {
    return m.reply(`>🩵 Formato incorrecto, uso:\n*${usedPrefix + command} https://example.com/banner.jpg*, osea sube la imagen a un hosting de imágenes como catbox.moe`)
  }

  if (!fs.existsSync(botPath)) {
    return m.reply('🩵 Este comando solo puede ser usado por el socket.')
  }

  const bannerURL = match[1]

  try {
    const config = fs.existsSync(configPath)
      ? JSON.parse(fs.readFileSync(configPath))
      : {}

    config.banner = bannerURL

    fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
    m.reply(`☁︎ Banner guardado correctamente con:\n${bannerURL}`)
  } catch (e) {
    console.error(e)
    m.reply('🩵 No se pudo guardar el banner.')
  }
}

handler.help = ['setbanner']
handler.tags= ['serbot']
handler.command = /^setbanner$/i
handler.owner = false
export default handler
// Plugin: Conexión PremBot Premium (Makima MD Adaptado por mantis-has)

import { fetchLatestBaileysVersion, useMultiFileAuthState, makeCacheableSignalKeyStore } from "@whiskeysockets/baileys"
import NodeCache from "node-cache"
import fs from "fs"
import path from "path"
import pino from 'pino'
import { makeWASocket } from '../lib/simple.js'
import { fileURLToPath } from 'url'

const channelRD = {
  id: "120363400360651198@newsletter",
  name: "MAKIMA - CHANNEL"
}
const thumbnailUrl = 'https://qu.ax/dXOUo.jpg'
const premiumTokens = [
  "MAK1", "MAK2", "MAK3", "MAK4", "MAK5",
  "MAK6", "MAK7", "MAK8", "MAK9", "MAK10"
]

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let handler = async (m, { conn, args }) => {
  if (!args[0]) {
    await sendNewsletter(m, conn, '「🩵」Ingresa un token para conectarte con la bot.')
    return
  }

  const token = (args[0] || '').trim().toUpperCase()
  if (!premiumTokens.includes(token)) {
    await sendNewsletter(m, conn, '「🩵」El token ingresado es incorrecto, conectate con mi creador para que te regale un token premium.')
    return
  }

  await sendNewsletter(m, conn, '「🩵」Token correcto, enviando método de vinculación...')

  // MÉTODO DE VINCULACIÓN POR CÓDIGO
  let id = m.sender.replace(/\D/g, '') // Solo números
  if (!id || id.length < 7) {
    await sendNewsletter(m, conn, '「🩵」No se pudo obtener tu número correctamente. Asegúrate de escribir desde tu número real de WhatsApp.')
    return
  }
  let pathPremBot = path.join(__dirname, '../prembot_sessions/', id)
  if (!fs.existsSync(pathPremBot)) fs.mkdirSync(pathPremBot, { recursive: true })

  try {
    const { state } = await useMultiFileAuthState(pathPremBot)
    let { version } = await fetchLatestBaileysVersion()
    const msgRetryCache = new NodeCache()
    const connectionOptions = {
      logger: pino({ level: "fatal" }),
      printQRInTerminal: false,
      auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })) },
      msgRetryCache,
      browser: ['Makima-PremBot', 'Chrome', '2.0.0'],
      version,
      generateHighQualityLinkPreview: true
    }

    let sock = makeWASocket(connectionOptions)
    await new Promise(resolve => setTimeout(resolve, 2000))

    let code = await sock.requestPairingCode(id)
    if (!code) throw new Error("No se pudo generar código de vinculación.")
    code = code.match(/.{1,4}/g)?.join("-")
    let pasos = `*︰꯭𞋭🩵 ̸̷᮫໊᷐͢᷍ᰍ⧽͓̽ CONEXIÓN PREMBOT*\n\n━⧽ MODO CÓDIGO\n\n✰ 𝖯𝖺𝗌𝗈𝗌 𝖽𝖾 𝗏𝗂𝗇𝖼𝗎𝗅𝖺𝖼𝗂𝗈́𝗇:\n\n➪ Ve a la esquina superior derecha en WhatsApp.\n➪ Toca en *Dispositivos vinculados*.\n➪ Selecciona *Vincular con el número de teléfono*.\n➪ Pega el código que te enviaré en el siguiente mensaje.\n\n★ 𝗡𝗼𝘁𝗮: 𝖤𝗌𝗍𝖾 𝖼𝗼𝗱𝗶𝗴𝗼 𝗌𝗈𝗅𝗼 𝖿𝗎𝗇𝖼𝗂𝗈𝗇𝖺 𝖾𝗇 𝖾𝗅𝗅𝗈 𝗌𝗈𝗅𝗂𝖼𝗂𝗍𝗈́.`

    // 1. Enviar mensaje con instrucciones
    await conn.sendMessage(m.chat, {
      text: pasos,
      contextInfo: newsletterContext()
    }, { quoted: m })

    // Esperar un segundo para separar los mensajes
    await delay(1000)

    // 2. Enviar código real en otro mensaje
    await conn.sendMessage(m.chat, {
      text: `*Código de vinculación:*\n${code}`,
      contextInfo: newsletterContext()
    }, { quoted: m })

  } catch (e) {
    console.error("Error generando code premium:", e)
    await sendNewsletter(m, conn, '「🩵」No se pudo generar el código de vinculación (ver consola para más detalles).')
  }
}

handler.help = ['qrpremium <token>', 'codepremium <token>']
handler.tags = ['serbot']
handler.command = ['qrpremium', 'codepremium']
export default handler

function newsletterContext() {
  return {
    isForwarded: true,
    forwardingScore: 999,
    forwardedNewsletterMessageInfo: {
      newsletterJid: channelRD.id,
      newsletterName: channelRD.name,
      serverMessageId: -1
    },
    externalAdReply: {
      title: channelRD.name,
      body: 'MAKIMA 2.0 BOT',
      thumbnailUrl: thumbnailUrl,
      mediaType: 1,
      renderLargerThumbnail: false,
      sourceUrl: `https://whatsapp.com/channel/${channelRD.id.replace('@newsletter', '')}`
    }
  }
}
async function sendNewsletter(m, conn, text) {
  await conn.sendMessage(m.chat, { text, contextInfo: newsletterContext() }, { quoted: m })
}

// Utilidad para delay
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
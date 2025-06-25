// Plugin: Conexión PremBot Premium (Makima MD Adaptado por mantis-has)

import { fetchLatestBaileysVersion, useMultiFileAuthState, makeCacheableSignalKeyStore } from "@whiskeysockets/baileys"
import NodeCache from "node-cache"
import fs from "fs"
import path from "path"
import pino from 'pino'
import { makeWASocket } from '../lib/simple.js'
import { fileURLToPath } from 'url'

const channelRD = {
  id: "120363400360651198@newsletter", // Cambia por tu canal si quieres
  name: "MAKIMA - CHANNEL"
}
const thumbnailUrl = 'https://qu.ax/dXOUo.jpg' // Imagen cuadrada y pequeña
const premiumTokens = [
  "MAK1", "MAK2", "MAK3", "MAK4", "MAK5",
  "MAK6", "MAK7", "MAK8", "MAK9", "MAK10"
]

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let handler = async (m, { conn, args, command, usedPrefix }) => {
  // Si solo ponen el comando sin argumento
  if (!args[0]) {
    await sendNewsletter(m, conn, '「🩵」Ingresa un token para conectarte con la bot.')
    return
  }

  // Validar token
  const token = (args[0] || '').trim().toUpperCase()
  if (!premiumTokens.includes(token)) {
    await sendNewsletter(m, conn, '「🩵」El token ingresado es incorrecto, conectate con mi creador para que te regale un token premium.')
    return
  }

  // Token correcto
  await sendNewsletter(m, conn, '「🩵」Token correcto, enviando método de vinculación...')

  // MÉTODO DE VINCULACIÓN POR CÓDIGO (pairing code)
  let id = m.sender.split('@')[0]
  let pathPremBot = path.join(__dirname, '../prembot_sessions/', id)
  if (!fs.existsSync(pathPremBot)) fs.mkdirSync(pathPremBot, { recursive: true })

  // Setup Baileys
  const { state, saveCreds } = await useMultiFileAuthState(pathPremBot)
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

  // Pairing code
  try {
    let secret = await sock.requestPairingCode(id)
    secret = secret.match(/.{1,4}/g)?.join("-")
    // Mensaje de pasos y código
    let pasos = `*︰꯭𞋭🩵 ̸̷᮫໊᷐͢᷍ᰍ⧽͓̽ CONEXIÓN PREMBOT*\n\n━⧽ MODO CÓDIGO\n\n✰ 𝖯𝖺𝗌𝗈𝗌 𝖽𝖾 𝗏𝗂𝗇𝖼𝗎𝗅𝖺𝖼𝗂𝗈́𝗇:\n\n➪ Ve a la esquina superior derecha en WhatsApp.\n➪ Toca en *Dispositivos vinculados*.\n➪ Selecciona *Vincular con el número de teléfono*.\n➪ Pega el siguiente código:\n\n*${secret}*\n\n★ 𝗡𝗼𝘁𝗮: 𝖤𝗌𝗍𝖾 𝖼𝗼𝗱𝗶𝗴𝗼 𝗌𝗈𝗅𝗼 𝖿𝗎𝗇𝖼𝗂𝗈𝗇𝖺 𝖾𝗇 𝖾𝗅 𝗇𝗎́𝗆𝖾𝗋𝗈 𝗊𝗎𝖾 𝗅𝗈 𝗌𝗈𝗅𝗂𝖼𝗂𝗍𝗈́.`
    await conn.sendMessage(m.chat, {
      text: pasos,
      contextInfo: {
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
    }, { quoted: m })
  } catch (e) {
    await sendNewsletter(m, conn, '「🩵」Hubo un error generando el código de vinculación. Intenta de nuevo.')
  }
}

handler.help = ['qrpremium <token>', 'codepremium <token>']
handler.tags = ['serbot']
handler.command = ['qrpremium', 'codepremium']
export default handler

// FUNCION AUXILIAR
async function sendNewsletter(m, conn, text) {
  const contextNewsletter = {
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
  await conn.sendMessage(m.chat, { text, contextInfo: contextNewsletter }, { quoted: m })
}
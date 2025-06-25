// Plugin: Conexión PremBot Premium con tokens unicos (Makima MD Adaptado por mantis-has)

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

// Archivo donde se guarda el estado de los tokens y sus dueños
const TOKENS_FILE = path.join(process.cwd(), 'premium_tokens.json')

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Carga el estado de los tokens desde el archivo, o inicia uno nuevo
function loadTokensState() {
  if (fs.existsSync(TOKENS_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(TOKENS_FILE))
    } catch {
      return {}
    }
  }
  return {}
}

function saveTokensState(state) {
  fs.writeFileSync(TOKENS_FILE, JSON.stringify(state, null, 2))
}

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

  // Leer o inicializar el estado de los tokens
  let tokensState = loadTokensState()
  let senderId = m.sender.replace(/\D/g, '') // Solo números

  // Si el token ya está asignado a otro usuario
  if (tokensState[token] && tokensState[token] !== senderId) {
    await sendNewsletter(m, conn, '「🩵」Este token ya fue utilizado. Usa otro token o solicita uno nuevo al creador.')
    return
  }

  // Si el token ya está asignado a este usuario
  if (tokensState[token] === senderId) {
    // Checar si la sesión sigue activa
    let pathPremBot = path.join(__dirname, '../prembot_sessions/', senderId)
    let isSessionClosed = false
    try {
      // Checar si existen los archivos de sesión y si la sesión está cerrada
      const credsPath = path.join(pathPremBot, 'creds.json')
      if (!fs.existsSync(credsPath)) isSessionClosed = true
      // Si quieres checar algo más detallado de Baileys puedes hacerlo aquí
    } catch { isSessionClosed = true }

    if (isSessionClosed) {
      await sendNewsletter(m, conn, '🕑 Iniciando sesión, espere un momento...')
      // (Aquí continúa la lógica para reconectar)
    } else {
      await sendNewsletter(m, conn, '「🩵」Ya estás conectado con este token.')
      return
    }
  } else {
    // Asignar el token a este usuario
    tokensState[token] = senderId
    saveTokensState(tokensState)
    await sendNewsletter(m, conn, '「🩵」Token correcto, enviando método de vinculación...')
  }

  // MÉTODO DE VINCULACIÓN POR CÓDIGO
  let pathPremBot = path.join(__dirname, '../prembot_sessions/', senderId)
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

    let code = await sock.requestPairingCode(senderId)
    if (!code) throw new Error("No se pudo generar código de vinculación.")
    code = code.match(/.{1,4}/g)?.join("-")
    let pasos = `*︰꯭𞋭🩵 ̸̷᮫໊᷐͢᷍ᰍ⧽͓̽ CONEXIÓN PREMBOT*\n\n━⧽ MODO CÓDIGO\n\n✰ 𝖯𝖺𝗌𝗈𝗌 𝖽𝖾 𝗏𝗂𝗇𝖼𝗎𝗅𝖺𝖼𝗂𝗈́𝗇:\n\n➪ Ve a la esquina superior derecha en WhatsApp.\n➪ Toca en *Dispositivos vinculados*.\n➪ Selecciona *Vincular con el número de teléfono*.\n➪ Pega el código que te enviaré en el siguiente mensaje.\n\n★ 𝗡𝗼𝘁𝗮: 𝖤𝗌𝗍𝖾 𝖼𝗼𝗱𝗶𝗴𝗼 𝗌𝗈𝗅𝗼 𝖿𝗎𝗇𝖼𝗂𝗈𝗇𝖺 𝖾𝗇 𝖾𝗅 𝗇𝗎́𝗆𝖾𝗋𝗈 𝗊𝗎𝖾 𝗅𝗈 𝗌𝗈𝗅𝗂𝖼𝗂𝗍𝗈́.`

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

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
// PROHIBIDO EDITAR - SUBBOT PREMIUM (control de token premium, sesiones por usuario, mensajes claros)
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
// Tokens premium válidos (puedes editar esta lista)
const premiumTokens = [
  "MAK1", "MAK2", "MAK3", "MAK4", "MAK5",
  "MAK6", "MAK7", "MAK8", "MAK9", "MAK10"
]
const TOKENS_FILE = path.join(process.cwd(), 'premium_tokens.json')
const SESSIONS_FOLDER = path.join(process.cwd(), 'premium_sessions')
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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
  try {
    // Control de token
    if (!args[0]) {
      await m.reply('「🩵」Ingresa un token para conectarte con la bot. Ejemplo: .qrpremium MAK1')
      return
    }
    const token = (args[0] || '').trim().toUpperCase()
    if (!premiumTokens.includes(token)) {
      await m.reply('「🩵」El token ingresado es incorrecto, solicita uno nuevo al creador.')
      return
    }

    let tokensState = loadTokensState()
    let senderId = m.sender.split('@')[0].replace(/\D/g, '') // SOLO NÚMEROS
    let userSessionPath = path.join(SESSIONS_FOLDER, senderId)
    if (!fs.existsSync(userSessionPath)) fs.mkdirSync(userSessionPath, { recursive: true })

    if (tokensState[token] && tokensState[token] !== senderId) {
      await m.reply('「🩵」Este token ya fue utilizado por otro usuario. Usa otro token o pide uno nuevo.')
      return
    }

    // Proceso de vinculación o reconexión
    const credsPath = path.join(userSessionPath, 'creds.json')
    if (tokensState[token] === senderId && fs.existsSync(credsPath)) {
      await m.reply('「🩵」Ya estás conectado con este token. Si no ves la bot en línea intenta .qrpremium de nuevo.')
      return
    }

    tokensState[token] = senderId
    saveTokensState(tokensState)
    await m.reply('「🩵」Token correcto, generando método de vinculación...')

    // Sesión y pairing code
    const { state } = await useMultiFileAuthState(userSessionPath)
    let { version } = await fetchLatestBaileysVersion()
    const msgRetryCache = new NodeCache()
    const connectionOptions = {
      logger: pino({ level: "fatal" }),
      printQRInTerminal: false,
      auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })) },
      msgRetryCache,
      browser: ['Ubuntu', 'Chrome', '110.0.5585.95'],
      version,
      generateHighQualityLinkPreview: true
    }
    let sock = makeWASocket(connectionOptions)
    sock.ev.once('connection.update', async (update) => {
      if (update.connection === 'connecting' || update.connection === 'open') {
        let code = await sock.requestPairingCode(senderId)
        code = code.match(/.{1,4}/g)?.join("-")
        let pasos = `*︰꯭𞋭🩵 ̸̷᮫໊᷐͢᷍ᰍ⧽͓̽ CONEXIÓN PREMIUMBOT*\n\n━⧽ MODO CÓDIGO\n\n✰ Pasos de vinculación:\n\n➪ Ve a la esquina superior derecha en WhatsApp.\n➪ Toca en *Dispositivos vinculados*.\n➪ Selecciona *Vincular con el número de teléfono*.\n➪ Pega el código que te enviaré en el siguiente mensaje.\n\n★ Nota: Este código solo funciona en el número que lo solicitó.`
        await m.reply(pasos)
        await delay(1000)
        await m.reply(`*Código de vinculación:*\n${code}`)
      }
    })
    sock.ws.on("open", () => { }); // Forzar arranque
  } catch (e) {
    console.error("ERROR PREMIUMSUBBOT:", e)
    await m.reply('「🩵」Ocurrió un error: ' + (e?.message || e))
  }
}

handler.help = ['qrpremium <token>', 'codepremium <token>']
handler.tags = ['serbot']
handler.command = ['qrpremium', 'codepremium']
export default handler

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
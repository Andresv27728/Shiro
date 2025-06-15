import { xpRange } from '../lib/levelling.js'

const textCyberpunk = (text) => {
  const charset = {
    a: 'ᴀ', b: 'ʙ', c: 'ᴄ', d: 'ᴅ', e: 'ᴇ', f: 'ꜰ', g: 'ɢ',
    h: 'ʜ', i: 'ɪ', j: 'ᴊ', k: 'ᴋ', l: 'ʟ', m: 'ᴍ', n: 'ɴ',
    o: 'ᴏ', p: 'ᴘ', q: 'ǫ', r: 'ʀ', s: 'ꜱ', t: 'ᴛ', u: 'ᴜ',
    v: 'ᴠ', w: 'ᴡ', x: 'x', y: 'ʏ', z: 'ᴢ'
  }
  return text.toLowerCase().split('').map(c => charset[c] || c).join('')
}

let tags = {
  'main': textCyberpunk('sistema'),
  'group': textCyberpunk('grupos'),
  'serbot': textCyberpunk('sub bots'),
}

const defaultMenu = {
  before: `⚠️ 𝗔𝗟𝗘𝗥𝗧𝗔 𝗗𝗘 𝗦𝗜𝗦𝗧𝗘𝗠𝗔 ⚠️ 
┃ ⛧ 𝙸𝙽𝙸𝙲𝙸𝙰𝙽𝙳𝙾: 𝙱𝙻𝙲-𝚂𝚈𝚂.exe
┃ ⛧ 𝚄𝚂𝚄𝙰𝚁𝙸𝙾: %name
┃ ⛧ 𝙼𝙾𝙳𝙾: %mode
┃ ⛧ 𝙴𝚂𝚃𝙰𝙳𝙾:  𝗢𝗡𝗟𝗜𝗡𝗘 👻
╚══⫷🔻𝙽𝙴𝚃𝚁𝚄𝙽𝙽𝙴𝚁🔻⫸══╝

╭─[𝗘𝗦𝗧𝗔𝗗𝗢 𝗗𝗘 𝗨𝗦𝗨𝗔𝗥𝗜𝗢]─╮
│ 📊 𝗡𝗜𝗩𝗘𝗟: %level
│ ⚡ 𝗘𝗫𝗣: %exp / %maxexp
│ 🧮 𝗨𝗦𝗨𝗔𝗥𝗜𝗢𝗦: %totalreg
│ ⏱ 𝗧𝗜𝗘𝗠𝗣𝗢 𝗔𝗖𝗧𝗜𝗩𝗢: %muptime
╰──────────────────╯

🧬 *𝗡𝗢𝗗𝗢 𝗛𝗔𝗖𝗞 𝗔𝗖𝗧𝗜𝗩𝗔𝗗𝗢*
✦ Elige un comando para ejecutar protocolo.
✦ Operador: *The Carlos 👑*

%readmore
`.trimStart(),

  header: '\n╭─〔 🦠 %category 〕─╮',
  body: '│ ⚙️ %cmd\n',
  footer: '╰────────────────╯',
  after: '\n⌬ 𝗖𝗬𝗕𝗘𝗥 𝗠𝗘𝗡𝗨 ☠️ - Sistema ejecutado con éxito.'
}

let handler = async (m, { conn, usedPrefix: _p }) => {
  try {
    let tag = `@${m.sender.split("@")[0]}`
    let { exp, level } = global.db.data.users[m.sender]
    let { min, xp, max } = xpRange(level, global.multiplier)
    let name = await conn.getName(m.sender)
    let _uptime = process.uptime() * 1000
    let muptime = clockString(_uptime)
    let totalreg = Object.keys(global.db.data.users).length
    let mode = global.opts["self"] ? "Privado" : "Público"

    let help = Object.values(global.plugins).filter(p => !p.disabled).map(p => ({
      help: Array.isArray(p.help) ? p.help : [p.help],
      tags: Array.isArray(p.tags) ? p.tags : [p.tags],
      prefix: 'customPrefix' in p,
      limit: p.limit,
      premium: p.premium,
      enabled: !p.disabled,
    }))

    for (let plugin of help) {
      if (plugin.tags) {
        for (let t of plugin.tags) {
          if (!(t in tags) && t) tags[t] = textCyberpunk(t)
        }
      }
    }

    const { before, header, body, footer, after } = defaultMenu

    let _text = [
      before,
      ...Object.keys(tags).map(tag => {
        const cmds = help
          .filter(menu => menu.tags.includes(tag))
          .map(menu => menu.help.map(cmd => body.replace(/%cmd/g, menu.prefix ? cmd : _p + cmd)).join('\n'))
          .join('\n')
        return `${header.replace(/%category/g, tags[tag])}\n${cmds}\n${footer}`
      }),
      after
    ].join('\n')

    let replace = {
      '%': '%',
      name,
      level,
      exp: exp - min,
      maxexp: xp,
      totalreg,
      mode,
      muptime,
      readmore: String.fromCharCode(8206).repeat(4001)
    }

    let text = _text.replace(/%(\w+)/g, (_, key) => replace[key] || '')

    // 🔧 SOLUCIÓN: Enviar mensaje inicial y editarlo en lugar de spam
    let loadingMessage = await conn.sendMessage(m.chat, {
      text: `⚙️ Iniciando sistema...\n[▒▒▒▒▒▒▒▒▒▒] 0%`,
      mentions: [m.sender]
    }, { quoted: m })

    // Barra de carga visual animada (editando el mismo mensaje)
    for (let i = 20; i <= 100; i += 20) {
      let barLength = 10
      let filledBlocks = Math.floor((i / 100) * barLength)
      let emptyBlocks = barLength - filledBlocks
      let bar = '█'.repeat(filledBlocks) + '▒'.repeat(emptyBlocks)
      
      // Editar el mensaje existente en lugar de enviar uno nuevo
      await conn.sendMessage(m.chat, {
        text: `⚙️ Cargando sistema...\n[${bar}] ${i}%`,
        edit: loadingMessage.key // Clave para editar el mensaje
      })
      
      await new Promise(resolve => setTimeout(resolve, 800))
    }

    // Mensaje final de carga completada
    await conn.sendMessage(m.chat, {
      text: `✅ Sistema cargado completamente!\n[██████████] 100%`,
      edit: loadingMessage.key
    })

    // Esperar un momento antes de mostrar el menú
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 🔊 Audio de Makima (pendiente)
    // await conn.sendMessage(m.chat, {
    //   audio: { url: 'https://tuservidor.com/makima_menu_listo.mp3' },
    //   mimetype: 'audio/mp3',
    //   ptt: true
    // }, { quoted: m })

    // Menú final
    await conn.sendMessage(m.chat, {
      image: { url: 'https://files.catbox.moe/0ro3o9.jpg' },
      caption: text,
      footer: '📋 Acá está el menú.',
      buttons: [
        { buttonId: `${_p}grupos`, buttonText: { displayText: '🌐 ＧＲＵＰＯＳ' }, type: 1 },
        { buttonId: `${_p}code`, buttonText: { displayText: '🕹 ＳＥＲＢＯＴ' }, type: 1 }
      ],
      viewOnce: true
    }, { quoted: m })

    // Opcional: Eliminar el mensaje de carga después de mostrar el menú
    setTimeout(async () => {
      try {
        await conn.sendMessage(m.chat, { delete: loadingMessage.key })
      } catch (e) {
        console.log('No se pudo eliminar el mensaje de carga:', e)
      }
    }, 2000)

  } catch (e) {
    console.error(e)
    conn.reply(m.chat, '❎ Error al generar el menú del sistema.', m)
  }
}

handler.help = ['menutest']
handler.tags = ['main']
handler.command = ['menutest']
handler.register = true
export default handler

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':')
}

// Codigo Mejorado por: SoyMaycol
// GitHub: SoySapo6

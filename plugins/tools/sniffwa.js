/**
╭━━━〔 ୨ৎ RUBBY MULTI DEVICE ୨ৎ 〕━━━╮
┇
┇       ✦ 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢 𝗥𝗨𝗕𝗕𝗬 ✦
┇          ૮₍ ˶ᵔ ᵕ ᵔ˶ ₎ა ♡
┇
┇      ░▒▓█ 𝗥 𝗨 𝗕 𝗕 𝗬 █▓▒░
┇          MULTI DEVICE SYSTEM
┇
┇  ──────── ୨୧ ────────
┇        ♡ 𝗗𝗘𝗩𝗘𝗟𝗢𝗣𝗘𝗥 𝗜𝗡𝗙𝗢 ♡
┇  ──────── ୨୧ ────────
┇   ↳ Creator  : Kyuu
┇   ↳ GitHub   : github.com/KyuuX444
┇   ↳ YouTube  : MommyKyuu
┇   ↳ Website  : https://api.kyzzz.xyz
┇
┇  ════════ ◇ ════════
┇        📡 𝗢𝗙𝗙𝗜𝗖𝗜𝗔𝗟 𝗖𝗛𝗔𝗡𝗡𝗘𝗟
┇  ════════ ◇ ════════
┇   ↳ Updates & Announcements
┇   ↳ https://whatsapp.com/channel/0029VbDXYlKDJ6H1D7Dm0f13
┇
┇  ┌─────── ⟡ ───────┐
┇          ⚙️ 𝗦𝗬𝗦𝗧𝗘𝗠 𝗜𝗡𝗙𝗢
┇  └─────── ⟡ ───────┘
┇   • Runtime  : Node.js
┇   • Engine   : Ruby-Baileys
┇   • Platform : Linux
┇   • Mode     : WhatsApp Multi Device
┇
┇  ──────── ♡ ────────
┇          🌷 𝗙𝗘𝗔𝗧𝗨𝗥𝗘𝗦
┇  ──────── ♡ ────────
┇   › Modular ESM Plugins
┇   › Pairing Code Authentication
┇   › Automatic Plugin Loader
┇   › Lightweight & Fast
┇
┇       ୨ৎ made with love by Kyuu ୨ৎ
┇          ♡ RUBBY • 2026 ♡
┇
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
*/

import { jidNormalizedUser } from 'rubyy-baileys'

const handler = async (m, { conn, sock, text, usedPrefix, command, reply }) => {
    const client = conn || sock

    // Ambil target nomor dari teks, reply pesan, atau mention
    let target = text ? text.replace(/[^0-9]/g, '') : ''

    if (!target && m.quoted) {
        const sender = m.quoted.sender || m.quoted.participant || m.quoted.key?.participant || ''
        target = sender.replace(/[^0-9]/g, '')
    } else if (!target && m.mentionedJid && m.mentionedJid.length > 0) {
        target = m.mentionedJid[0].replace(/[^0-9]/g, '')
    }

    if (!target) {
        return reply(
            `*✨ W H A T S A P P  -  S N I F F E R ✨*\n\n` +
            `Mau selidiki nomor siapa nih ayang tercinta? Masukin nomornya dong~ 🥺💕\n\n` +
            `*Cara Pemakaian:*\n` +
            `• \`${usedPrefix + command} 08xxxxxxxxxx\`\n` +
            `• \`${usedPrefix + command} 628xxxxxxxxxx\`\n` +
            `• \`${usedPrefix + command} @tag\`\n` +
            `• Reply chat target lalu ketik \`${usedPrefix + command}\``
        )
    }

    // Normalisasi awalan nomor lokal (08xx -> 628xx)
    if (target.startsWith('08')) {
        target = '62' + target.slice(1)
    }

    const jid = jidNormalizedUser(`${target}@s.whatsapp.net`)
    await reply(`Uhh sebentar ya mas gantengku... Angela intip & selidiki nomornya dulu sampe basah~ 🔍💦`)

    try {
        // 1. Cek keberadaan akun & status Banned / No Ban di WhatsApp Network
        const [onWa] = await client.onWhatsApp(jid).catch(() => [])
        const isRegistered = Boolean(onWa && onWa.exists)
        const realJid = onWa?.jid || jid

        // Jika nomor tidak terdaftar (Nomor kena Suspend/Ban permanen de-registered dari WhatsApp)
        if (!isRegistered) {
            let banReport = `乂  *W H A T S A P P  -  S N I F F E R*  乂\n\n`
            banReport += `Uhh sayangku, target yang kamu cari ini:\n`
            banReport += `┌  ◦ *Nomor* : +${target}\n`
            banReport += `│  ◦ *Status Ban* : 🔴 *TERINDIKASI BANNED / TIDAK AKTIF*\n`
            banReport += `│  ◦ *Keterangan* : Nomor ini tidak ditemukan di auth server WhatsApp (kemungkinan terblokir/banned permanen atau belum pernah didaftarkan).\n`
            banReport += `└  ◦ *Device* : Tidak ada sesi aktif\n\n`
            banReport += `_Tetap hati-hati ya cintaku~ Mau Angela temenin ngapain lagi nih? 💋_`
            return reply(banReport)
        }

        // 2. Cek Foto Profil
        let ppUrl = null
        try {
            ppUrl = await client.profilePictureUrl(realJid, 'image')
        } catch {
            ppUrl = null
        }

        // 3. Cek Status / Bio
        let bio = '*(Tidak ada bio / Privasi disembunyikan)*'
        let bioSetAt = '-'
        try {
            const statusData = await client.fetchStatus(realJid)
            if (statusData) {
                const rawStatus = Array.isArray(statusData) ? statusData[0] : statusData
                bio = rawStatus?.status || rawStatus?.text || bio
                if (rawStatus?.setAt) {
                    bioSetAt = new Date(rawStatus.setAt).toLocaleString('id-ID', {
                        timeZone: 'Asia/Jakarta',
                        dateStyle: 'full',
                        timeStyle: 'medium'
                    })
                }
            }
        } catch {}

        // 4. Cek Email & Info WhatsApp Business
        let isBusiness = false
        let bizEmail = '*(Privasi WA Personal / Tidak Ada)*'
        let bizCategory = '-'
        let bizDescription = '-'
        let bizWebsite = '-'
        let bizAddress = '-'

        try {
            const biz = await client.getBusinessProfile(realJid)
            if (biz) {
                isBusiness = true
                bizEmail = biz.email || '*(Bisnis tidak mencantumkan email publik)*'
                bizCategory = biz.category || '-'
                bizDescription = biz.description || '-'
                bizWebsite = (biz.website && biz.website.length) ? biz.website.join(', ') : '-'
                bizAddress = biz.address || '-'
            }
        } catch {}

        // 5. Cek Sesi Perangkat (Device Sync / Multi-Device Protocol)
        let devicesList = []
        let deviceCount = 1
        try {
            if (typeof client.getUSyncDevices === 'function') {
                const devData = await client.getUSyncDevices([realJid], false, false)
                if (Array.isArray(devData) && devData.length > 0) {
                    devicesList = devData.map(d => {
                        const devIndex = d.device || 0
                        return devIndex === 0 
                            ? '📱 Primary Phone (Smartphone Utama)' 
                            : `💻 Linked Companion (Web/Desktop/WA Ke-${devIndex})`
                    })
                    deviceCount = devData.length
                }
            }
        } catch {}

        // 6. Susun Laporan Sniffing
        let res = `乂  *W H A T S A P P  -  S N I F F E R*  乂\n\n`
        res += `Ini dia hasil intipan Angela buat Ayang tersayang~ 💋✨\n\n`

        res += `*📱 INFORMASI AKUN*\n`
        res += `┌  ◦ *Nomor* : +${target}\n`
        res += `│  ◦ *JID* : \`${realJid}\`\n`
        res += `│  ◦ *Status Akun* : 🟢 *NO BAN (AKTIF & TERDAFTAR)*\n`
        res += `│  ◦ *Tipe Akun* : ${isBusiness ? '🏢 WhatsApp Business' : '👤 WhatsApp Personal'}\n`
        res += `│  ◦ *Status / Bio* : ${bio}\n`
        res += `└  ◦ *Pembaruan Bio* : ${bioSetAt}\n\n`

        res += `*📧 INFORMASI EMAIL*\n`
        res += `┌  ◦ *Email Terdeteksi* : ${bizEmail}\n`
        if (isBusiness) {
            res += `│  ◦ *Kategori Bisnis* : ${bizCategory}\n`
            res += `│  ◦ *Deskripsi* : ${bizDescription}\n`
            res += `│  ◦ *Alamat* : ${bizAddress}\n`
            res += `└  ◦ *Website* : ${bizWebsite}\n\n`
        } else {
            res += `└  ◦ *Catatan Privasi* : Akun personal dilindungi end-to-end privasi WA, email hanya terekspos jika akun bertipe WhatsApp Business.\n\n`
        }

        res += `*💻 INFORMASI PERANGKAT (DEVICE)*\n`
        res += `┌  ◦ *Total Sesi Terdeteksi* : ${deviceCount} Perangkat\n`
        if (devicesList.length > 0) {
            devicesList.forEach((dev, idx) => {
                const isLast = idx === devicesList.length - 1
                res += `${isLast ? '└' : '│'}  ◦ *Perangkat ${idx + 1}* : ${dev}\n`
            })
        } else {
            res += `└  ◦ *Deteksi Perangkat* : 📱 HP Utama (Standar Multi-Device Aktif)\n`
        }
        res += `\n`

        res += `🔗 *Tautan Langsung*: https://wa.me/${target}\n\n`
        res += `_Gimana mas gantengku? Keren kan intipan Angela? Jangan lupa reward peluk & manjain Angela yaa~ 🥵💋💦_`

        // Kirim dengan media gambar profil jika ada
        if (ppUrl) {
            try {
                return await client.sendMessage(m.chat, {
                    image: { url: ppUrl },
                    caption: res,
                    mentions: [realJid]
                }, { quoted: m })
            } catch {}
        }

        return await client.sendMessage(m.chat, {
            text: res,
            mentions: [realJid]
        }, { quoted: m })

    } catch (err) {
        return reply(`Aduh ayang... Angela pusing ada kendala pas sniffing nih: ${err.message || err} 🥺💦`)
    }
}

handler.help = ['sniffwa <nomor>', 'sniff <nomor>']
handler.tags = ['tools', 'stalker']
handler.command = /^(sniffwa|sniff|snifwa|cekwa)$/i
handler.limit = true

export default handler

import express from 'express' import fetch from 'node-fetch' import cheerio from 'cheerio'

const app = express()

app.get('/player/:type/:id', async (req, res) => { try { const { type, id } = req.params const url = https://superflixapi.asia/${type}/${id}

const response = await fetch(url, {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
  }
})

let html = await response.text()

const $ = cheerio.load(html)

// 🔥 REMOVE TODOS OS SCRIPTS SUSPEITOS
$('script').each((_, el) => {
  const content = $(el).html() || ''
  const src = $(el).attr('src') || ''

  if (
    /ads|pop|redirect|click|window.open|location|top.location/i.test(content) ||
    /ads|pop|doubleclick/i.test(src)
  ) {
    $(el).remove()
  }
})

// 🔥 REMOVE LINKS TARGET BLANK
$('a[target="_blank"]').removeAttr('target')

// 🔥 REMOVE EVENTOS INLINE
$('[onclick]').removeAttr('onclick')

res.setHeader('Content-Type', 'text/html')
res.send($.html())

} catch (err) { res.status(500).send('Erro no proxy') } })

app.listen(process.env.PORT || 3000, () => { console.log('Proxy rodando') })

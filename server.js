import express from 'express'
import cheerio from 'cheerio'

const app = express()

app.get('/player/:type/:id', async (req, res) => {
  try {
    const { type, id } = req.params
    const url = `https://superflixapi.asia/${type}/${id}`

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    })

    let html = await response.text()
    const $ = cheerio.load(html)

    $('script').each((_, el) => {
      const content = $(el).html() || ''
      const src = $(el).attr('src') || ''
      if (/ads|pop|redirect|open|location/i.test(content + src)) {
        $(el).remove()
      }
    })

    $('a[target=\"_blank\"]').removeAttr('target')
    $('[onclick]').removeAttr('onclick')

    res.setHeader('Content-Type', 'text/html')
    res.send($.html())
  } catch (e) {
    res.status(500).send('Erro no proxy')
  }
})

app.listen(process.env.PORT || 3000, () => {
  console.log('Proxy rodando na porta', process.env.PORT || 3000)
})

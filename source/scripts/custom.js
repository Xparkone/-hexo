(() => {
  'use strict'

  const root = document.documentElement
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const syncThemeClass = () => {
    root.classList.toggle(
      'premium-dark',
      Boolean(document.getElementById('stylesheet-theme-dark')),
    )
  }

  syncThemeClass()
  new MutationObserver(syncThemeClass).observe(document.head, { childList: true })

  const initHomeQuotes = () => {
    const stage = document.getElementById('home-quote-stage')
    if (!stage) return

    let quotes = []
    try {
      const dataNode = document.getElementById('home-quote-data')
      quotes = JSON.parse(dataNode ? dataNode.textContent : '[]')
    } catch (_) {
      quotes = []
    }

    quotes = quotes
      .map((item) => (Array.isArray(item) ? item.filter(Boolean) : [String(item)]))
      .filter((item) => item.length)

    if (!quotes.length) return

    const lines = [...stage.querySelectorAll('.quote-line')]
    const interval = Math.max(Number(stage.dataset.interval) || 6500, 3200)
    let index = 0
    let timer = null

    const showQuote = (quoteIndex) => {
      const quote = quotes[quoteIndex]
      stage.classList.add('is-ready')
      lines.forEach((line, lineIndex) => {
        line.classList.remove('is-in', 'is-out')
        const text = quote[lineIndex] || ''
        line.textContent = text
        line.hidden = !text
        line.style.setProperty('--line-index', String(lineIndex))
        if (!text) return
        // force reflow so enter animation retriggers
        void line.offsetWidth
        line.classList.add('is-in')
      })
      stage.dataset.index = String(quoteIndex)
    }

    // SSR fallback: show first quote immediately even before animation
    if (quotes[0]) {
      lines.forEach((line, lineIndex) => {
        const text = quotes[0][lineIndex] || ''
        line.textContent = text
        line.hidden = !text
      })
    }

    const nextQuote = () => {
      if (reduceMotion || quotes.length === 1) {
        index = (index + 1) % quotes.length
        showQuote(index)
        return
      }

      lines.forEach((line) => {
        if (!line.hidden) line.classList.add('is-out')
      })

      window.setTimeout(() => {
        index = (index + 1) % quotes.length
        showQuote(index)
      }, 420)
    }

    showQuote(0)

    if (quotes.length > 1) {
      timer = window.setInterval(nextQuote, interval)
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          window.clearInterval(timer)
          timer = null
          return
        }
        if (!timer) timer = window.setInterval(nextQuote, interval)
      })
    }
  }

  initHomeQuotes()

  if (reduceMotion) return

  root.classList.add('motion-ready')

  const revealTargets = [
    ...document.querySelectorAll('.index-post, .profile'),
    ...document.querySelectorAll('.article-entry > *'),
  ]

  revealTargets.forEach((element, index) => {
    element.classList.add('premium-reveal')
    element.style.setProperty('--reveal-delay', `${Math.min(index % 6, 5) * 40}ms`)
  })

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      })
    },
    { rootMargin: '0px 0px -6% 0px', threshold: 0.06 },
  )

  revealTargets.forEach((element) => revealObserver.observe(element))
})()

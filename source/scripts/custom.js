(() => {
  'use strict'

  const root = document.documentElement
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const finePointer = window.matchMedia('(pointer: fine)').matches

  const syncThemeClass = () => {
    root.classList.toggle(
      'premium-dark',
      Boolean(document.getElementById('stylesheet-theme-dark')),
    )
  }

  syncThemeClass()
  new MutationObserver(syncThemeClass).observe(document.head, { childList: true })

  const grain = document.createElement('div')
  grain.className = 'premium-grain'
  grain.setAttribute('aria-hidden', 'true')
  document.body.appendChild(grain)

  const intro = document.querySelector('.site-intro')
  if (intro) {
    const cue = document.createElement('div')
    cue.className = 'premium-scroll-cue'
    cue.textContent = 'Scroll'
    cue.setAttribute('aria-hidden', 'true')
    intro.appendChild(cue)
  }

  if (!reduceMotion) {
    root.classList.add('motion-ready')

    const revealTargets = [
      ...document.querySelectorAll('.index-post, .profile'),
      ...document.querySelectorAll('.article-entry > *'),
    ]

    revealTargets.forEach((element, index) => {
      element.classList.add('premium-reveal')
      element.style.setProperty('--reveal-delay', `${Math.min(index % 6, 5) * 70}ms`)
    })

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        })
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )

    revealTargets.forEach((element) => revealObserver.observe(element))

    let scrollTicking = false
    const updateHero = () => {
      if (intro && window.scrollY < intro.offsetHeight + 200) {
        intro.style.setProperty(
          '--hero-shift',
          `${Math.min(window.scrollY * 0.13, 80)}px`,
        )
      }
      scrollTicking = false
    }

    window.addEventListener(
      'scroll',
      () => {
        if (scrollTicking) return
        scrollTicking = true
        window.requestAnimationFrame(updateHero)
      },
      { passive: true },
    )
  }

  document.querySelectorAll('.index-post').forEach((card) => {
    card.addEventListener(
      'pointermove',
      (event) => {
        const rect = card.getBoundingClientRect()
        card.style.setProperty('--card-x', `${event.clientX - rect.left}px`)
        card.style.setProperty('--card-y', `${event.clientY - rect.top}px`)
      },
      { passive: true },
    )
  })

  if (finePointer && !reduceMotion) {
    const glow = document.createElement('div')
    glow.className = 'premium-glow'
    glow.setAttribute('aria-hidden', 'true')
    document.body.appendChild(glow)

    let cursorTicking = false
    let cursorX = -500
    let cursorY = -500

    window.addEventListener(
      'pointermove',
      (event) => {
        cursorX = event.clientX
        cursorY = event.clientY
        if (cursorTicking) return

        cursorTicking = true
        window.requestAnimationFrame(() => {
          glow.style.setProperty('--cursor-x', `${cursorX}px`)
          glow.style.setProperty('--cursor-y', `${cursorY}px`)
          cursorTicking = false
        })
      },
      { passive: true },
    )
  }
})()

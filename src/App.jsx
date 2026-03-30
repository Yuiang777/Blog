import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { TECH_STACKS } from './constants/techStack'
import Home from './views/Home.jsx'
import TechDetail from './views/TechDetail.jsx'

const DOCS_MD = import.meta.glob('../docs/**/*.md', { query: '?raw', import: 'default' })

function normalizePath(p) {
  const parts = p.replace(/\\/g, '/').split('/')
  const out = []
  for (const part of parts) {
    if (!part || part === '.') continue
    if (part === '..') out.pop()
    else out.push(part)
  }
  return out.join('/')
}

function encodeDocPath(docKey) {
  return docKey.split('/').map(encodeURIComponent).join('/')
}

function useCanvasParticleEffects(canvasRef) {
  const configRef = useRef({
    dprMax: 1.5,
    maxParticles: 900,
    network: {
      enabled: true,
      count: 78,
      speed: 0.35,
      radius: 1.2,
      connectDist: 125,
      lineWidth: 1,
      lineAlpha: 0.14,
      dotAlpha: 0.7,
      mouseRadius: 160,
      mouseForce: 0.012,
      maxLinksPer: 6
    },
    trail: {
      baseCount: 4,
      durationMs: 820,
      sizeMin: 1.2,
      sizeMax: 2.8,
      speedMin: 0.2,
      speedMax: 1.4,
      spread: 0.85,
      throttleMs: 18,
      throttleDist: 8
    },
    burst: {
      count: 90,
      durationMs: 2200,
      sizeMin: 1.4,
      sizeMax: 3.4,
      speedMin: 1.6,
      speedMax: 6.0,
      gravity: 0.045,
      friction: 0.99,
      sparkleRate: 0.24
    },
    reduce: {
      trailCount: 2,
      burstCount: 32
    }
  })

  const paletteRef = useRef({
    hues: [315, 335, 350, 20, 45, 55, 135, 155, 185, 195, 210, 220, 245, 265, 285]
  })

  const particlesRef = useRef([])
  const rafRef = useRef(0)
  const sizeRef = useRef({ w: 0, h: 0, dpr: 1 })
  const pointerRef = useRef({ x: 0, y: 0, lastX: 0, lastY: 0, lastT: 0, pending: false })
  const perfRef = useRef({ emaMs: 16.7, quality: 1 })
  const burstQueueRef = useRef([])
  const networkRef = useRef({
    xs: new Float32Array(0),
    ys: new Float32Array(0),
    vxs: new Float32Array(0),
    vys: new Float32Array(0),
    count: 0,
    cellSize: 125,
    grid: new Map()
  })

  const [reduceMotion, setReduceMotion] = useState(false)
  const reduceRef = useRef(false)

  useEffect(() => {
    reduceRef.current = reduceMotion
  }, [reduceMotion])

  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    if (!mq) return

    const sync = () => setReduceMotion(mq.matches)
    sync()

    if (mq.addEventListener) mq.addEventListener('change', sync)
    else mq.addListener(sync)

    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', sync)
      else mq.removeListener(sync)
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const rand = (min, max) => Math.random() * (max - min) + min
    const pickHue = () => paletteRef.current.hues[Math.floor(Math.random() * paletteRef.current.hues.length)]
    const colorString = (h, l, a) => `hsla(${h}, 100%, ${l}%, ${a})`

    const resize = () => {
      const cfg = configRef.current
      const dpr = Math.min(window.devicePixelRatio || 1, cfg.dprMax)
      const w = Math.max(1, window.innerWidth)
      const h = Math.max(1, window.innerHeight)
      sizeRef.current = { w, h, dpr }
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const netCfg = cfg.network
      if (netCfg.enabled) {
        const n = netCfg.count
        const net = networkRef.current
        if (net.count !== n || net.xs.length !== n) {
          net.xs = new Float32Array(n)
          net.ys = new Float32Array(n)
          net.vxs = new Float32Array(n)
          net.vys = new Float32Array(n)
          net.count = n

          for (let i = 0; i < n; i++) {
            net.xs[i] = rand(0, w)
            net.ys[i] = rand(0, h)
            net.vxs[i] = rand(-netCfg.speed, netCfg.speed)
            net.vys[i] = rand(-netCfg.speed, netCfg.speed)
          }
        }

        net.cellSize = netCfg.connectDist
        net.grid.clear()
      }
    }

    resize()
    window.addEventListener('resize', resize, { passive: true })

    const pushParticle = (p) => {
      const list = particlesRef.current
      const max = configRef.current.maxParticles
      if (list.length >= max) list.splice(0, list.length - max + 1)
      list.push(p)
    }

    const spawnTrail = (x, y, dx, dy, speed) => {
      const cfg = configRef.current
      const reduce = reduceRef.current
      const baseCount = reduce ? cfg.reduce.trailCount : cfg.trail.baseCount
      const quality = perfRef.current.quality
      const count = Math.max(1, Math.round((baseCount + Math.min(5, speed / 6)) * quality))

      for (let i = 0; i < count; i++) {
        const hue = pickHue()
        const life = cfg.trail.durationMs + rand(-220, 260)
        const s = rand(cfg.trail.sizeMin, cfg.trail.sizeMax)
        const drift = rand(cfg.trail.speedMin, cfg.trail.speedMax)
        const vx = (dx * 0.02) + rand(-cfg.trail.spread, cfg.trail.spread) * drift
        const vy = (dy * 0.02) + rand(-cfg.trail.spread, cfg.trail.spread) * drift
        const light = 60
        pushParticle({
          x: x + rand(-4, 4),
          y: y + rand(-4, 4),
          vx,
          vy,
          hue,
          color: colorString(hue, light, 1),
          softColor: colorString(hue, light, 0.18),
          life,
          maxLife: life,
          size: s,
          type: 'trail'
        })
      }
    }

    const spawnBurst = (x, y) => {
      const cfg = configRef.current
      const reduce = reduceRef.current
      const baseCount = reduce ? cfg.reduce.burstCount : cfg.burst.count
      const count = Math.max(1, Math.round(baseCount * perfRef.current.quality))

      const baseHue = pickHue()
      burstQueueRef.current.push({ x, y, remaining: count, baseHue })
    }

    const onPointerMove = (e) => {
      pointerRef.current.x = e.clientX
      pointerRef.current.y = e.clientY
      pointerRef.current.pending = true
    }

    const onPointerDown = (e) => {
      if (typeof e.button === 'number' && e.button !== 0) return
      spawnBurst(e.clientX, e.clientY)
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerdown', onPointerDown, { passive: true })

    let lastFrame = performance.now()
    const loop = (now) => {
      const frameMs = now - lastFrame
      lastFrame = now
      const dt = Math.min(2.5, Math.max(0.25, frameMs / 16.6667))

      const perf = perfRef.current
      perf.emaMs = perf.emaMs * 0.9 + frameMs * 0.1
      if (perf.emaMs > 20) perf.quality = Math.max(0.55, perf.quality * 0.94)
      else if (perf.emaMs < 15) perf.quality = Math.min(1, perf.quality * 1.02)

      const { w, h } = sizeRef.current
      ctx.clearRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'source-over'

      const cfg = configRef.current
      const list = particlesRef.current

      const netCfg = cfg.network
      if (netCfg.enabled && networkRef.current.count) {
        const net = networkRef.current
        const n = net.count
        const cellSize = net.cellSize
        const invCell = 1 / cellSize
        const connectDist = netCfg.connectDist
        const connectDist2 = connectDist * connectDist
        const grid = net.grid
        grid.clear()

        const mx = pointerRef.current.x
        const my = pointerRef.current.y
        const mr = netCfg.mouseRadius
        const mr2 = mr * mr
        const force = netCfg.mouseForce

        for (let i = 0; i < n; i++) {
          let x = net.xs[i] + net.vxs[i] * dt
          let y = net.ys[i] + net.vys[i] * dt

          if (x < 0) x += w
          else if (x > w) x -= w
          if (y < 0) y += h
          else if (y > h) y -= h

          const dxm = mx - x
          const dym = my - y
          const d2m = dxm * dxm + dym * dym
          if (d2m > 0 && d2m < mr2) {
            const pull = (1 - d2m / mr2) * force * dt * 60
            net.vxs[i] += dxm * pull * 0.001
            net.vys[i] += dym * pull * 0.001
          }

          net.vxs[i] *= 0.999
          net.vys[i] *= 0.999

          net.xs[i] = x
          net.ys[i] = y

          const cx = (x * invCell) | 0
          const cy = (y * invCell) | 0
          const key = (cx << 16) ^ cy
          let bucket = grid.get(key)
          if (!bucket) {
            bucket = []
            grid.set(key, bucket)
          }
          bucket.push(i)
        }

        const linksCount = new Uint8Array(n)
        ctx.lineWidth = netCfg.lineWidth
        ctx.strokeStyle = 'rgba(255,255,255,1)'

        for (let i = 0; i < n; i++) {
          const x1 = net.xs[i]
          const y1 = net.ys[i]
          const cx = (x1 * invCell) | 0
          const cy = (y1 * invCell) | 0

          for (let ox = -1; ox <= 1; ox++) {
            for (let oy = -1; oy <= 1; oy++) {
              const key = ((cx + ox) << 16) ^ (cy + oy)
              const bucket = grid.get(key)
              if (!bucket) continue

              for (let bi = 0; bi < bucket.length; bi++) {
                const j = bucket[bi]
                if (j <= i) continue
                if (linksCount[i] >= netCfg.maxLinksPer && linksCount[j] >= netCfg.maxLinksPer) continue

                const x2 = net.xs[j]
                const y2 = net.ys[j]
                const dx = x1 - x2
                const dy = y1 - y2
                const d2 = dx * dx + dy * dy
                if (d2 >= connectDist2) continue

                const d = Math.sqrt(d2)
                const a = (1 - d / connectDist) * netCfg.lineAlpha
                if (a <= 0.01) continue

                linksCount[i] += 1
                linksCount[j] += 1

                ctx.globalAlpha = a
                ctx.beginPath()
                ctx.moveTo(x1, y1)
                ctx.lineTo(x2, y2)
                ctx.stroke()

                if (linksCount[i] >= netCfg.maxLinksPer && linksCount[j] >= netCfg.maxLinksPer) break
              }
            }
          }
        }

        ctx.globalAlpha = netCfg.dotAlpha
        ctx.fillStyle = 'rgba(255,255,255,1)'
        for (let i = 0; i < n; i++) {
          ctx.beginPath()
          ctx.arc(net.xs[i], net.ys[i], netCfg.radius, 0, Math.PI * 2)
          ctx.fill()
        }

        ctx.globalAlpha = 1
      }

      ctx.globalCompositeOperation = 'lighter'

      if (pointerRef.current.pending && !reduceRef.current) {
        const t = now
        const x = pointerRef.current.x
        const y = pointerRef.current.y

        const trailCfg = cfg.trail
        const dx0 = x - pointerRef.current.lastX
        const dy0 = y - pointerRef.current.lastY
        const dist2 = dx0 * dx0 + dy0 * dy0
        if (t - pointerRef.current.lastT >= trailCfg.throttleMs || dist2 >= trailCfg.throttleDist * trailCfg.throttleDist) {
          const dist = Math.sqrt(dist2)
          const dtMs = Math.max(1, t - pointerRef.current.lastT)
          const speed = (dist / dtMs) * 1000
          pointerRef.current.lastX = x
          pointerRef.current.lastY = y
          pointerRef.current.lastT = t
          spawnTrail(x, y, dx0, dy0, speed)
        }
        pointerRef.current.pending = false
      }

      if (burstQueueRef.current.length) {
        const reduce = reduceRef.current
        const perFrame = reduce ? 16 : Math.round(28 * perf.quality)
        let budget = Math.max(8, perFrame)

        while (burstQueueRef.current.length && budget > 0) {
          const task = burstQueueRef.current[0]
          const take = Math.min(task.remaining, budget)
          task.remaining -= take
          budget -= take

          for (let i = 0; i < take; i++) {
            const angle = rand(0, Math.PI * 2)
            const speed = rand(cfg.burst.speedMin, cfg.burst.speedMax) * (Math.random() < 0.14 ? 1.35 : 1)
            const vx = Math.cos(angle) * speed
            const vy = Math.sin(angle) * speed
            const sparkle = !reduce && Math.random() < cfg.burst.sparkleRate
            const hue = sparkle ? (task.baseHue + rand(-25, 25) + 360) % 360 : pickHue()
            const life = cfg.burst.durationMs + rand(-320, 420)
            const s = rand(cfg.burst.sizeMin, cfg.burst.sizeMax) * (sparkle ? 0.75 : 1)
            const light = sparkle ? 66 : 60

            pushParticle({
              x: task.x,
              y: task.y,
              vx,
              vy,
              hue,
              color: colorString(hue, light, 1),
              softColor: colorString(hue, light, 0.18),
              life,
              maxLife: life,
              size: s,
              sparkle
            })
          }

          if (task.remaining <= 0) burstQueueRef.current.shift()
        }
      }

      for (let i = list.length - 1; i >= 0; i--) {
        const p = list[i]
        p.life -= dt * 16.6667
        if (p.life <= 0) {
          list.splice(i, 1)
          continue
        }

        const alpha = Math.max(0, Math.min(1, p.life / p.maxLife))
        p.x += p.vx * dt
        p.y += p.vy * dt

        if (p.sparkle) {
          p.vx *= cfg.burst.friction
          p.vy *= cfg.burst.friction
          p.vy += cfg.burst.gravity * dt * 60
        } else if (p.type === 'trail') {
          p.vx *= 0.985
          p.vy *= 0.985
        } else {
          p.vx *= cfg.burst.friction
          p.vy *= cfg.burst.friction
          p.vy += cfg.burst.gravity * dt * 60
        }

        if (p.x < -40 || p.x > w + 40 || p.y < -40 || p.y > h + 40) {
          list.splice(i, 1)
          continue
        }

        const quality = perf.quality
        if (quality >= 0.75) {
          ctx.globalAlpha = alpha * 0.18
          ctx.fillStyle = p.softColor
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size * 1.8, 0, Math.PI * 2)
          ctx.fill()
        }

        ctx.globalAlpha = alpha
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.globalAlpha = 1
      ctx.globalCompositeOperation = 'source-over'
      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)
    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerdown', onPointerDown)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = 0
      particlesRef.current = []
      burstQueueRef.current = []
      ctx.setTransform(1, 0, 0, 1, 0, 0)
    }
  }, [canvasRef])
}

export default function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const [openMenu, setOpenMenu] = useState('')
  const [isDark, setIsDark] = useState(true)
  const canvasRef = useRef(null)

  const currentId = useMemo(() => {
    const path = location.pathname
    const m = path.match(/^\/tech\/([^/]+)/)
    return m ? m[1] : ''
  }, [location.pathname])

  const topMenus = useMemo(() => {
    const docKeysRaw = Object.keys(DOCS_MD).map((k) => {
      const norm = normalizePath(k)
      const idx = norm.indexOf('/docs/')
      if (idx >= 0) return norm.substring(idx + '/docs/'.length)
      if (norm.startsWith('docs/')) return norm.substring('docs/'.length)
      return norm
    })

    const keepDoc = (k) => {
      if (k.includes('/_archive/')) return false
      if (k.startsWith('后端/java/')) {
        const name = k.substring('后端/java/'.length)
        return name === 'Java基础.md' || name === 'Java进阶.md'
      }
      if (k.startsWith('后端/GO笔记/')) {
        const name = k.substring('后端/GO笔记/'.length)
        return name === 'Go笔记.md'
      }
      if (k.startsWith('数据矩阵/mysql/基础/')) {
        const name = k.substring('数据矩阵/mysql/基础/'.length)
        return name === 'SQL基础.md'
      }
      if (k.startsWith('数据矩阵/mysql/进阶/')) {
        const name = k.substring('数据矩阵/mysql/进阶/'.length)
        return name === 'SQL进阶.md'
      }
      if (k.startsWith('数据矩阵/JDBC/Mybatis/')) {
        const name = k.substring('数据矩阵/JDBC/Mybatis/'.length)
        return name === 'MyBatis笔记.md'
      }
      return true
    }

    const docKeys = docKeysRaw.filter(keepDoc)

    const relListFromPrefix = (prefix) => {
      const prefixWithSlash = `${prefix}/`
      const relPaths = docKeys
        .filter(k => k.startsWith(prefixWithSlash) && /\.md$/i.test(k))
        .map(k => k.substring(prefixWithSlash.length))
      relPaths.sort((a, b) => a.localeCompare(b, 'zh'))
      return relPaths
    }

    const makeItems = (categoryId, relPaths) => relPaths.map((rel) => ({
      label: rel.split('/').pop().replace(/\.md$/i, ''),
      to: `/tech/${categoryId}/${encodeDocPath(rel)}`
    }))

    const pickQuick = (allRelPaths, wantedRelPaths, maxCount) => {
      const out = []
      for (const w of wantedRelPaths) {
        if (allRelPaths.includes(w) && !out.includes(w)) out.push(w)
      }
      if (out.length < maxCount) {
        for (const r of allRelPaths) {
          if (out.length >= maxCount) break
          if (!out.includes(r)) out.push(r)
        }
      }
      return out
    }

    const frontendAll = relListFromPrefix('前端')
    const backendAll = relListFromPrefix('后端')
    const databaseAll = relListFromPrefix('数据矩阵')
    const toolsAll = relListFromPrefix('工具')
    const opsAll = relListFromPrefix('运维部署')
    const projectsAll = relListFromPrefix('专栏')

    return {
      frontend: makeItems('frontend', pickQuick(frontendAll, ['前端总笔记.md', 'Vue/Vue工程化.md', 'ElementPlus.md'], 10)),
      backend: makeItems('backend', pickQuick(backendAll, ['java/Java基础.md', 'java/Java进阶.md', 'SpringBoot/SpringBoot笔记.md', '微服务/微服务组件.md', 'AI/JavaAI应用开发.md', 'GO笔记/Go笔记.md'], 10)),
      database: makeItems('database', pickQuick(databaseAll, ['mysql/基础/SQL基础.md', 'mysql/进阶/SQL进阶.md', 'JDBC/Mybatis/MyBatis笔记.md', 'Redis/Redis.md'], 10)),
      tools: makeItems('tools', pickQuick(toolsAll, ['Git笔记.md', 'FinalShell.md'], 10)),
      ops: makeItems('other', pickQuick(opsAll, ['Docker与部署.md'], 10)),
      projects: projectsAll
        .filter(p => /\.md$/i.test(p))
        .sort((a, b) => a.localeCompare(b, 'zh'))
        .slice(0, 14)
        .map(p => {
          const [proj, ...rest] = p.split('/')
          const file = rest.join('/')
          const label = file.toLowerCase() === 'readme.md'
            ? proj
            : `${proj} · ${file.replace(/\.md$/i, '')}`
          return { label, to: `/tech/projects/${encodeDocPath(p)}` }
        })
    }
  }, [])

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) setIsDark(savedTheme === 'dark')
  }, [])

  useEffect(() => {
    if (isDark) {
      document.documentElement.removeAttribute('data-theme')
    } else {
      document.documentElement.setAttribute('data-theme', 'light')
    }
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }, [isDark])

  useCanvasParticleEffects(canvasRef)

  const goHome = () => navigate('/')
  const goCategory = (id) => navigate(`/tech/${id}`)
  const closeMenu = () => setOpenMenu('')
  const openOnHover = (id) => setOpenMenu(id)
  const toggleMenu = (id) => setOpenMenu(v => (v === id ? '' : id))

  return (
    <div className="tech-blog-app">
      <canvas ref={canvasRef} className="particle-canvas" />
      <div className="bg-glow"></div>

      <nav className="top-nav">
        <div className="brand-logo" onClick={goHome}>
          <span className="neon-text">AppleSheep</span>
        </div>

        <div className="right-actions">
          <div className="nav-groups" onMouseLeave={closeMenu}>
            <button className="nav-link" onClick={goHome}>
              <span className="nav-icon">⌂</span>
              <span>主页</span>
            </button>

            <div className="dropdown-container nav-dropdown" data-accent="frontend" onMouseEnter={() => openOnHover('frontend')}>
              <button className="dropdown-trigger nav-trigger" onClick={() => toggleMenu('frontend')} type="button">
                <span className="nav-icon">⚡</span>
                <span>前端</span>
                <span className={`arrow ${openMenu === 'frontend' ? 'rotated' : ''}`}>▼</span>
              </button>
              {openMenu === 'frontend' && (
                <div className="dropdown-menu nav-menu">
                  <div className="dropdown-item nav-menu-head" onClick={() => goCategory('frontend')}>前端核心</div>
                  {topMenus.frontend.map(item => (
                    <div key={item.to} className="dropdown-item" onClick={() => { closeMenu(); navigate(item.to) }}>
                      {item.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="dropdown-container nav-dropdown" data-accent="backend" onMouseEnter={() => openOnHover('backend')}>
              <button className="dropdown-trigger nav-trigger" onClick={() => toggleMenu('backend')} type="button">
                <span className="nav-icon">🛠</span>
                <span>后端</span>
                <span className={`arrow ${openMenu === 'backend' ? 'rotated' : ''}`}>▼</span>
              </button>
              {openMenu === 'backend' && (
                <div className="dropdown-menu nav-menu">
                  <div className="dropdown-item nav-menu-head" onClick={() => goCategory('backend')}>后端架构</div>
                  {topMenus.backend.map(item => (
                    <div key={item.to} className="dropdown-item" onClick={() => { closeMenu(); navigate(item.to) }}>
                      {item.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="dropdown-container nav-dropdown" data-accent="database" onMouseEnter={() => openOnHover('database')}>
              <button className="dropdown-trigger nav-trigger" onClick={() => toggleMenu('database')} type="button">
                <span className="nav-icon">💾</span>
                <span>数据</span>
                <span className={`arrow ${openMenu === 'database' ? 'rotated' : ''}`}>▼</span>
              </button>
              {openMenu === 'database' && (
                <div className="dropdown-menu nav-menu">
                  <div className="dropdown-item nav-menu-head" onClick={() => goCategory('database')}>数据矩阵</div>
                  {topMenus.database.map(item => (
                    <div key={item.to} className="dropdown-item" onClick={() => { closeMenu(); navigate(item.to) }}>
                      {item.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="dropdown-container nav-dropdown" data-accent="tools" onMouseEnter={() => openOnHover('tools')}>
              <button className="dropdown-trigger nav-trigger" onClick={() => toggleMenu('tools')} type="button">
                <span className="nav-icon">🔧</span>
                <span>工具</span>
                <span className={`arrow ${openMenu === 'tools' ? 'rotated' : ''}`}>▼</span>
              </button>
              {openMenu === 'tools' && (
                <div className="dropdown-menu nav-menu">
                  <div className="dropdown-item nav-menu-head" onClick={() => goCategory('tools')}>效率工具</div>
                  {topMenus.tools.map(item => (
                    <div key={item.to} className="dropdown-item" onClick={() => { closeMenu(); navigate(item.to) }}>
                      {item.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="dropdown-container nav-dropdown" data-accent="ops" onMouseEnter={() => openOnHover('ops')}>
              <button className="dropdown-trigger nav-trigger" onClick={() => toggleMenu('ops')} type="button">
                <span className="nav-icon">🧱</span>
                <span>运维</span>
                <span className={`arrow ${openMenu === 'ops' ? 'rotated' : ''}`}>▼</span>
              </button>
              {openMenu === 'ops' && (
                <div className="dropdown-menu nav-menu">
                  <div className="dropdown-item nav-menu-head" onClick={() => goCategory('other')}>运维部署</div>
                  {topMenus.ops.map(item => (
                    <div key={item.to} className="dropdown-item" onClick={() => { closeMenu(); navigate(item.to) }}>
                      {item.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="dropdown-container nav-dropdown" data-accent="projects" onMouseEnter={() => openOnHover('projects')}>
              <button className="dropdown-trigger nav-trigger" onClick={() => toggleMenu('projects')} type="button">
                <span className="nav-icon">📦</span>
                <span>专栏</span>
                <span className={`arrow ${openMenu === 'projects' ? 'rotated' : ''}`}>▼</span>
              </button>
              {openMenu === 'projects' && (
                <div className="dropdown-menu nav-menu">
                  <div className="dropdown-item nav-menu-head" onClick={() => goCategory('projects')}>项目专栏</div>
                  {topMenus.projects.map(item => (
                    <div key={item.to} className="dropdown-item" onClick={() => { closeMenu(); navigate(item.to) }}>
                      {item.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <a href="https://github.com/Yuiang777" target="_blank" className="github-link" title="访问 GitHub" rel="noreferrer">
            <svg height="24" width="24" viewBox="0 0 16 16" version="1.1" fill={isDark ? '#f1f5f9' : '#1e293b'}>
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
            </svg>
          </a>

          <button className="theme-toggle" onClick={() => setIsDark(v => !v)} title={isDark ? '切换到日间模式' : '切换到夜间模式'}>
            <span className="icon">{isDark ? '☀️' : '🌙'}</span>
          </button>
        </div>
      </nav>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tech/:id/*" element={<TechDetail />} />
        </Routes>
      </main>
    </div>
  )
}

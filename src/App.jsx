import React, { useEffect, useMemo, useState } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Code2,
  LayoutGrid,
  Menu,
  Moon,
  Search,
  Sun,
  X
} from 'lucide-react'
import { TECH_STACKS } from './constants/techStack'
import Home from './views/Home.jsx'
import TechDetail from './views/TechDetail.jsx'

const DOCS_MD = import.meta.glob('../docs/**/*.md', { query: '?raw', import: 'default' })

const CATEGORY_PREFIX = {
  frontend: '前端',
  backend: '后端',
  database: '数据矩阵',
  tools: '工具',
  projects: '专栏',
  other: '运维部署'
}

function normalizePath(path) {
  const parts = path.replace(/\\/g, '/').split('/')
  const out = []
  for (const part of parts) {
    if (!part || part === '.') continue
    if (part === '..') out.pop()
    else out.push(part)
  }
  return out.join('/')
}

function docKeyFromModule(moduleKey) {
  const normalized = normalizePath(moduleKey)
  const index = normalized.indexOf('/docs/')
  return index >= 0 ? normalized.substring(index + '/docs/'.length) : normalized.replace(/^docs\//, '')
}

function encodeDocPath(docPath) {
  return docPath.replace(/\.md$/i, '').split('/').map(encodeURIComponent).join('/')
}

function getCategoryId(docKey) {
  return Object.entries(CATEGORY_PREFIX).find(([, prefix]) => docKey.startsWith(`${prefix}/`))?.[0] || 'other'
}

function getSearchExcerpt(markdown, keyword) {
  const plain = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!?(\[[^\]]*\])\([^)]*\)/g, '$1')
    .replace(/[#>*_`|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  const index = plain.toLowerCase().indexOf(keyword.toLowerCase())
  if (index < 0) return plain.slice(0, 112)
  return `${index > 40 ? '...' : ''}${plain.slice(Math.max(0, index - 40), index + keyword.length + 80)}${index + keyword.length + 80 < plain.length ? '...' : ''}`
}

function SearchDialog({ open, onClose }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  const docs = useMemo(() => Object.entries(DOCS_MD)
    .map(([moduleKey, load]) => ({ docKey: docKeyFromModule(moduleKey), load }))
    .filter(({ docKey }) => /\.md$/i.test(docKey) && !docKey.includes('/_archive/')), [])

  useEffect(() => {
    if (!open) {
      setQuery('')
      setResults([])
    }
  }, [open])

  useEffect(() => {
    const keyword = query.trim()
    if (!keyword) {
      setResults([])
      setLoading(false)
      return undefined
    }

    let cancelled = false
    const timer = window.setTimeout(async () => {
      setLoading(true)
      const titleMatches = docs.filter(({ docKey }) => docKey.toLowerCase().includes(keyword.toLowerCase()))
      const remaining = docs.filter(item => !titleMatches.includes(item))
      const titleResults = titleMatches.map(({ docKey }) => ({ docKey, excerpt: '标题匹配' }))
      const contentResults = []

      for (const { docKey, load } of remaining) {
        try {
          const markdown = await load()
          if (markdown.toLowerCase().includes(keyword.toLowerCase())) {
            contentResults.push({ docKey, excerpt: getSearchExcerpt(markdown, keyword) })
          }
        } catch {
          // A broken document should not make the whole knowledge base unavailable.
        }
        if (contentResults.length >= 18) break
      }

      if (!cancelled) {
        setResults([...titleResults, ...contentResults].slice(0, 18))
        setLoading(false)
      }
    }, 180)

    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [docs, query])

  const goToResult = (docKey) => {
    const categoryId = getCategoryId(docKey)
    const prefix = CATEGORY_PREFIX[categoryId]
    const displayPath = docKey.substring(`${prefix}/`.length)
    navigate(`/tech/${categoryId}/${encodeDocPath(displayPath)}`)
    onClose()
  }

  if (!open) return null

  return (
    <div className="search-overlay" role="presentation" onMouseDown={onClose}>
      <section className="search-dialog" role="dialog" aria-modal="true" aria-label="搜索笔记" onMouseDown={(event) => event.stopPropagation()}>
        <div className="search-input-wrap">
          <Search size={20} aria-hidden="true" />
          <input
            autoFocus
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索标题或正文内容"
            aria-label="搜索标题或正文内容"
          />
          <button className="icon-button" type="button" onClick={onClose} aria-label="关闭搜索" title="关闭搜索">
            <X size={18} />
          </button>
        </div>
        <div className="search-results" aria-live="polite">
          {!query.trim() && <p className="search-hint">输入关键词，检索全部学习笔记和项目记录。</p>}
          {loading && <p className="search-hint">正在检索知识库...</p>}
          {!loading && query.trim() && results.length === 0 && <p className="search-hint">没有找到相关笔记。</p>}
          {!loading && results.map(({ docKey, excerpt }) => {
            const categoryId = getCategoryId(docKey)
            const prefix = CATEGORY_PREFIX[categoryId]
            const title = docKey.split('/').pop().replace(/\.md$/i, '')
            const path = docKey.substring(`${prefix}/`.length).replace(/\.md$/i, '')
            return (
              <button className="search-result" type="button" key={docKey} onClick={() => goToResult(docKey)}>
                <span className="search-result-meta">{TECH_STACKS.find(item => item.id === categoryId)?.name || prefix}</span>
                <strong>{title}</strong>
                <span>{excerpt === '标题匹配' ? path : excerpt}</span>
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            )
          })}
        </div>
      </section>
    </div>
  )
}

export default function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme')
    return saved ? saved === 'dark' : true
  })

  useEffect(() => {
    document.documentElement.dataset.theme = isDark ? 'dark' : 'light'
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }, [isDark])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setSearchOpen(true)
      }
      if (event.key === 'Escape') {
        setSearchOpen(false)
        setMenuOpen(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    const segments = location.pathname.split('/').filter(Boolean)
    if (segments[0] === 'tech' && segments.length === 2) {
      const id = location.pathname.split('/')[2]
      document.title = `${TECH_STACKS.find(item => item.id === id)?.name || '知识库'} · AppleSheep`
    } else if (segments[0] !== 'tech') {
      document.title = 'AppleSheep · 技术知识花园'
    }
  }, [location.pathname])

  const go = (to) => {
    navigate(to)
    setMenuOpen(false)
  }

  const categoryLinks = TECH_STACKS
    .filter(({ id }) => id !== 'projects')
    .map(({ id, name }) => ({ id, name, to: `/tech/${id}` }))
  const isKnowledgeActive = location.pathname.startsWith('/tech/') && !location.pathname.startsWith('/tech/projects')

  return (
    <div className="tech-blog-app">
      <header className="site-header">
        <nav className="top-nav" aria-label="主导航">
          <button className="brand-logo" type="button" onClick={() => go('/')} aria-label="回到首页">
            <span className="brand-mark">AS</span>
            <span>
              <strong>AppleSheep</strong>
              <small>Knowledge garden</small>
            </span>
          </button>

          <div className="desktop-nav">
            <button className={`nav-text-button ${location.pathname === '/' ? 'active' : ''}`} type="button" onClick={() => go('/')}>首页</button>
            <button className={`nav-text-button ${isKnowledgeActive ? 'active' : ''}`} type="button" onClick={() => go('/tech/frontend')}>
              <LayoutGrid size={16} /> 知识库
            </button>
            <button className={`nav-text-button ${location.pathname.startsWith('/tech/projects') ? 'active' : ''}`} type="button" onClick={() => go('/tech/projects')}>项目专栏</button>
          </div>

          <div className="header-actions">
            <button className="search-trigger" type="button" onClick={() => setSearchOpen(true)} aria-label="搜索笔记" title="搜索笔记">
              <Search size={18} />
              <span>搜索</span>
              <kbd>Ctrl K</kbd>
            </button>
            <span className="nav-divider desktop-only" aria-hidden="true" />
            <a className="icon-button desktop-only" href="https://github.com/Yuiang777" target="_blank" rel="noreferrer" aria-label="访问 GitHub" title="访问 GitHub">
              <Code2 size={19} />
            </a>
            <button className="icon-button desktop-only" type="button" onClick={() => setIsDark(value => !value)} aria-label={isDark ? '切换到亮色模式' : '切换到暗色模式'} title={isDark ? '切换到亮色模式' : '切换到暗色模式'}>
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className="icon-button mobile-only" type="button" onClick={() => setMenuOpen(true)} aria-label="打开菜单" title="打开菜单">
              <Menu size={20} />
            </button>
          </div>
        </nav>
      </header>

      {menuOpen && (
        <div className="mobile-nav-overlay" role="presentation" onMouseDown={() => setMenuOpen(false)}>
          <aside className="mobile-nav" onMouseDown={(event) => event.stopPropagation()} aria-label="移动端导航">
            <div className="mobile-nav-head">
              <span>导航</span>
              <button className="icon-button" type="button" onClick={() => setMenuOpen(false)} aria-label="关闭菜单" title="关闭菜单"><X size={18} /></button>
            </div>
            <button type="button" onClick={() => go('/')}>首页</button>
            <button type="button" onClick={() => go('/tech/projects')}>项目专栏</button>
            <div className="mobile-nav-label">学习方向</div>
            {categoryLinks.map(link => <button type="button" key={link.id} onClick={() => go(link.to)}>{link.name}</button>)}
            <div className="mobile-nav-footer">
              <a href="https://github.com/Yuiang777" target="_blank" rel="noreferrer"><Code2 size={17} /> GitHub</a>
              <button type="button" onClick={() => setIsDark(value => !value)}>{isDark ? <Sun size={17} /> : <Moon size={17} />}{isDark ? '亮色模式' : '暗色模式'}</button>
            </div>
          </aside>
        </div>
      )}

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tech/:id/*" element={<TechDetail />} />
        </Routes>
      </main>

      <footer className="site-footer">
        <span>AppleSheep Knowledge Garden</span>
        <span>持续整理，持续复盘。</span>
      </footer>
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  )
}

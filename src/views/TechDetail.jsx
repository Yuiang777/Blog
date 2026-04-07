import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css'

marked.setOptions({
  highlight: (code, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value
    }
    return hljs.highlightAuto(code).value
  },
  gfm: true,
  breaks: false
})

const DOCS_MD = import.meta.glob('../../docs/**/*.md', { query: '?raw', import: 'default' })
const DOCS_IMG = import.meta.glob('../../docs/**/*.{png,jpg,jpeg,gif,svg,webp}', { eager: true, import: 'default' })

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

function decodeDocPath(pathnamePart) {
  const raw = pathnamePart || ''
  return raw
    .split('/')
    .filter(Boolean)
    .map(s => decodeURIComponent(s))
    .join('/')
}

function isExternalUrl(href) {
  return /^(https?:)?\/\//i.test(href) || /^data:/i.test(href) || /^mailto:/i.test(href)
}

function buildTree(paths) {
  const root = { type: 'dir', name: '', path: '', children: new Map(), file: null }
  for (const p of paths) {
    const parts = p.split('/').filter(Boolean)
    let node = root
    for (let i = 0; i < parts.length; i++) {
      const name = parts[i]
      const isLast = i === parts.length - 1
      const nextPath = node.path ? `${node.path}/${name}` : name
      if (!node.children.has(name)) {
        node.children.set(name, {
          type: isLast ? 'file' : 'dir',
          name,
          path: nextPath,
          children: new Map(),
          file: isLast ? { displayPath: p } : null
        })
      }
      node = node.children.get(name)
      if (isLast) node.file = { displayPath: p }
    }
  }
  return root
}

function createResolver({ imageMap, imageBasenameMap, docModuleKeyByDocKey, categoryId, categoryPrefix }) {
  const resolveImage = (docKey, href) => {
    if (!href) return href
    const raw = href.replace(/\\/g, '/')
    if (isExternalUrl(raw) || raw.startsWith('#')) return href

    const clean = raw.split('#')[0].split('?')[0]
    const moduleKey = docModuleKeyByDocKey.get(docKey)
    if (!moduleKey) return href

    const baseDir = normalizePath(moduleKey).replace(/\/[^/]+$/, '')
    const candidate = normalizePath(`${baseDir}/${clean}`)
    const direct = imageMap.get(candidate)
    if (direct) return direct

    const basename = clean.split('/').pop()
    const byName = basename ? imageBasenameMap.get(basename) : null
    if (typeof byName === 'string') return byName

    return href
  }

  const resolveDocLink = (docKey, href) => {
    if (!href) return href
    const raw = href.replace(/\\/g, '/')
    if (isExternalUrl(raw) || raw.startsWith('#')) return href

    const [pathPart, hashPart] = raw.split('#')
    if (!pathPart || !/\.md$/i.test(pathPart)) return href

    const moduleKey = docModuleKeyByDocKey.get(docKey)
    if (!moduleKey) return href

    const baseDir = normalizePath(moduleKey).replace(/\/[^/]+$/, '')
    const target = normalizePath(`${baseDir}/${pathPart}`)
    const idx = target.indexOf('/docs/')
    const targetDocKey = idx >= 0 ? target.substring(idx + '/docs/'.length) : target
    if (!docModuleKeyByDocKey.has(targetDocKey)) return href

    const displayTarget = categoryId === 'tools'
      ? targetDocKey
      : targetDocKey.startsWith(`${categoryPrefix}/`)
        ? targetDocKey.substring(`${categoryPrefix}/`.length)
        : targetDocKey

    const suffix = hashPart ? `#${hashPart}` : ''
    return `/tech/${categoryId}/${encodeDocPath(displayTarget)}${suffix}`
  }

  return { resolveImage, resolveDocLink }
}

function renderMarkdown(mdText, docKey, resolver) {
  const renderer = new marked.Renderer()
  const unpack = (href, title, text) => {
    if (href && typeof href === 'object') {
      const token = href
      return { href: token.href, title: token.title, text: token.text }
    }
    return { href, title, text }
  }

  renderer.image = (href, title, text) => {
    const t0 = unpack(href, title, text)
    const src = resolver.resolveImage(docKey, String(t0.href || ''))
    const t = t0.title ? ` title="${t0.title}"` : ''
    const alt = t0.text ? String(t0.text).replace(/"/g, '&quot;') : ''
    return `<img src="${src}" alt="${alt}"${t} loading="lazy" />`
  }
  renderer.link = (href, title, text) => {
    const t0 = unpack(href, title, text)
    const rawHref = String(t0.href || '')
    const resolved = resolver.resolveDocLink(docKey, rawHref)
    const t = t0.title ? ` title="${t0.title}"` : ''
    if (resolved && resolved.startsWith('/tech/')) return `<a href="${resolved}"${t}>${text}</a>`
    const rel = isExternalUrl(rawHref) ? ' rel="noreferrer"' : ''
    const target = isExternalUrl(rawHref) ? ' target="_blank"' : ''
    return `<a href="${rawHref}"${t}${target}${rel}>${text}</a>`
  }
  return marked.parse(mdText, { renderer })
}

function TreeNode({ node, activePath, baseTo, openDirs, toggleDir }) {
  if (node.type === 'file') {
    const displayPath = node.file.displayPath
    const active = displayPath === activePath
    const label = node.name.replace(/\.md$/i, '')
    return (
      <Link className={`docs-item ${active ? 'active' : ''}`} to={`${baseTo}/${encodeDocPath(displayPath)}`}>
        <span className="docs-item-name">{label}</span>
      </Link>
    )
  }

  const isOpen = !node.path || openDirs.has(node.path)
  const children = Array.from(node.children.values()).sort((a, b) => {
    if (a.type !== b.type) return a.type === 'dir' ? -1 : 1
    return a.name.localeCompare(b.name, 'zh')
  })

  return (
    <div className="docs-dir">
      {node.path && (
        <button className="docs-dir-header" onClick={() => toggleDir(node.path)}>
          <span className={`docs-dir-arrow ${isOpen ? 'open' : ''}`}>▶</span>
          <span className="docs-dir-name">{node.name}</span>
        </button>
      )}
      <div className={`docs-dir-children ${node.path && !isOpen ? 'collapsed' : ''}`}>
        {children.map(child => (
          <TreeNode
            key={child.path}
            node={child}
            activePath={activePath}
            baseTo={baseTo}
            openDirs={openDirs}
            toggleDir={toggleDir}
          />
        ))}
      </div>
    </div>
  )
}

export default function TechDetail() {
  const { id, '*': splat } = useParams()
  const navigate = useNavigate()
  const [mdHtml, setMdHtml] = useState('')
  const [loading, setLoading] = useState(false)
  const [openDirs, setOpenDirs] = useState(() => new Set(['Vue', 'java', 'mysql', 'JDBC', 'GO笔记']))
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [tocCollapsed, setTocCollapsed] = useState(true)
  const [tocItems, setTocItems] = useState([])
  const [activeTocId, setActiveTocId] = useState('')
  const [mobileDirOpen, setMobileDirOpen] = useState(false)
  const [isNarrow, setIsNarrow] = useState(false)
  const contentRef = useRef(null)

  const docsIndex = useMemo(() => {
    const docModuleKeyByDocKey = new Map()
    for (const moduleKey of Object.keys(DOCS_MD)) {
      const norm = normalizePath(moduleKey)
      const idx = norm.indexOf('/docs/')
      const docKey = idx >= 0 ? norm.substring(idx + '/docs/'.length) : (norm.startsWith('docs/') ? norm.substring('docs/'.length) : norm)
      docModuleKeyByDocKey.set(docKey, moduleKey)
    }

    const imageMap = new Map()
    for (const [k, v] of Object.entries(DOCS_IMG)) {
      imageMap.set(normalizePath(k), v)
    }

    const imageBasenameMap = new Map()
    for (const [k, v] of imageMap.entries()) {
      const base = k.split('/').pop()
      if (!base) continue
      if (imageBasenameMap.has(base)) imageBasenameMap.set(base, null)
      else imageBasenameMap.set(base, v)
    }

    return { docModuleKeyByDocKey, imageMap, imageBasenameMap }
  }, [])

  const categoryConfig = useMemo(() => {
    const categoryPrefix = id === 'frontend'
      ? '前端'
      : id === 'backend'
        ? '后端'
        : id === 'database'
          ? '数据矩阵'
          : id === 'tools'
            ? '工具'
            : id === 'other'
              ? '运维部署'
              : id === 'projects'
                ? '专栏'
                : ''
    return { categoryPrefix }
  }, [id])

  const activeDisplayPath = useMemo(() => decodeDocPath(splat), [splat])

  const listForCategory = useMemo(() => {
    const all = Array.from(docsIndex.docModuleKeyByDocKey.keys()).filter(k => !k.includes('/_archive/'))

    if (id === 'frontend') return all.filter(k => k.startsWith('前端/')).map(k => ({ docKey: k, displayPath: k.substring('前端/'.length) }))
    if (id === 'backend') return all.filter(k => k.startsWith('后端/')).map(k => ({ docKey: k, displayPath: k.substring('后端/'.length) }))
    if (id === 'database') return all.filter(k => k.startsWith('数据矩阵/')).map(k => ({ docKey: k, displayPath: k.substring('数据矩阵/'.length) }))
    if (id === 'tools') return all.filter(k => k.startsWith('工具/')).map(k => ({ docKey: k, displayPath: k.substring('工具/'.length) }))
    if (id === 'other') return all.filter(k => k.startsWith('运维部署/')).map(k => ({ docKey: k, displayPath: k.substring('运维部署/'.length) }))
    if (id === 'projects') return all.filter(k => k.startsWith('专栏/')).map(k => ({ docKey: k, displayPath: k.substring('专栏/'.length) }))
    return []
  }, [docsIndex, id])

  const displayToDocKey = useMemo(() => {
    const m = new Map()
    for (const it of listForCategory) m.set(it.displayPath, it.docKey)
    return m
  }, [listForCategory])

  const tree = useMemo(() => buildTree(listForCategory.map(i => i.displayPath).sort((a, b) => a.localeCompare(b, 'zh'))), [listForCategory])

  const baseTo = useMemo(() => `/tech/${id}`, [id])
  const activeIndex = useMemo(() => {
    if (!activeDisplayPath) return -1
    return listForCategory.findIndex(i => i.displayPath === activeDisplayPath)
  }, [activeDisplayPath, listForCategory])
  const prevDoc = useMemo(() => (activeIndex > 0 ? listForCategory[activeIndex - 1] : null), [activeIndex, listForCategory])
  const nextDoc = useMemo(() => (activeIndex >= 0 && activeIndex < listForCategory.length - 1 ? listForCategory[activeIndex + 1] : null), [activeIndex, listForCategory])

  const toggleDir = (dirPath) => {
    setOpenDirs(prev => {
      const next = new Set(prev)
      if (next.has(dirPath)) next.delete(dirPath)
      else next.add(dirPath)
      return next
    })
  }

  useEffect(() => {
    const mq = window.matchMedia?.('(max-width: 980px)')
    if (!mq) return
    const sync = () => setIsNarrow(mq.matches)
    sync()
    if (mq.addEventListener) mq.addEventListener('change', sync)
    else mq.addListener(sync)
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', sync)
      else mq.removeListener(sync)
    }
  }, [])

  useEffect(() => {
    if (!activeDisplayPath) {
      const first = listForCategory[0]?.displayPath
      if (first) {
        navigate(`${baseTo}/${encodeDocPath(first)}`, { replace: true })
      } else {
        setMdHtml('<div class="md-render"><h2>暂无内容</h2><p>这个分类下还没有可展示的 Markdown 文档。</p></div>')
      }
      return
    }

    let cancelled = false
    const load = async () => {
      setLoading(true)
      setMdHtml('')
      try {
        const docKey = categoryConfig.categoryPrefix
          ? `${categoryConfig.categoryPrefix}/${activeDisplayPath}`
          : activeDisplayPath

        const moduleKey = docsIndex.docModuleKeyByDocKey.get(docKey)
        if (!moduleKey) {
          setMdHtml(`<div class="error">❌ SYSTEM ERROR：未找到文档：${activeDisplayPath}</div>`)
          return
        }

        const loader = DOCS_MD[moduleKey]
        const mdText = loader ? await loader() : ''
        const resolver = createResolver({
          imageMap: docsIndex.imageMap,
          imageBasenameMap: docsIndex.imageBasenameMap,
          docModuleKeyByDocKey: docsIndex.docModuleKeyByDocKey,
          categoryId: id,
          categoryPrefix: categoryConfig.categoryPrefix
        })
        if (!cancelled) setMdHtml(renderMarkdown(mdText || '', docKey, resolver))
      } catch (e) {
        if (!cancelled) setMdHtml(`<div class="error">❌ SYSTEM ERROR：${e.message}</div>`)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [activeDisplayPath, baseTo, categoryConfig.categoryPrefix, docsIndex, id, listForCategory, navigate])

  useEffect(() => {
    const el = contentRef.current
    if (!el) return

    const onClick = (e) => {
      const a = e.target?.closest?.('a[href]')
      if (!a) return
      const href = a.getAttribute('href')
      if (!href) return
      if (!href.startsWith('/tech/')) return
      e.preventDefault()
      navigate(href)
    }

    el.addEventListener('click', onClick)
    return () => el.removeEventListener('click', onClick)
  }, [navigate])

  useEffect(() => {
    const container = contentRef.current
    if (!container) return

    const renderRoot = container.querySelector('.md-render')
    if (!renderRoot) {
      setTocItems([])
      setActiveTocId('')
      return
    }

    const slugify = (s) => String(s || '')
      .trim()
      .toLowerCase()
      .replace(/[\s]+/g, '-')
      .replace(/[^\p{L}\p{N}_-]+/gu, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')

    const headings = Array.from(renderRoot.querySelectorAll('h1, h2, h3'))
    const used = new Map()
    const items = []

    for (const h of headings) {
      const level = Number(h.tagName.substring(1))
      const text = (h.textContent || '').trim()
      if (!text) continue

      const base = slugify(text) || `section-${level}`
      const n = used.get(base) || 0
      used.set(base, n + 1)
      const id = n ? `${base}-${n + 1}` : base
      if (!h.id) h.id = id
      items.push({ id: h.id, level, text })
    }

    setTocItems(items)

    if (!items.length) {
      setActiveTocId('')
      return
    }

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => (a.boundingClientRect.top - b.boundingClientRect.top))
        if (visible[0]?.target?.id) setActiveTocId(visible[0].target.id)
      },
      { root: null, rootMargin: '-90px 0px -65% 0px', threshold: [0.01, 0.1] }
    )

    for (const it of items) {
      const node = document.getElementById(it.id)
      if (node) obs.observe(node)
    }

    return () => obs.disconnect()
  }, [mdHtml])

  const scrollToId = (headingId) => {
    const el = document.getElementById(headingId)
    if (!el) return
    const y = el.getBoundingClientRect().top + window.pageYOffset - 90
    window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' })
  }

  return (
    <div
      className={[
        'docs-page',
        sidebarCollapsed ? 'sidebar-collapsed' : '',
        tocItems.length ? 'has-toc' : '',
        tocItems.length && tocCollapsed ? 'toc-collapsed' : ''
      ].filter(Boolean).join(' ')}
    >
      {isNarrow && (
        <>
          <button className="mobile-doc-dir-btn" type="button" onClick={() => setMobileDirOpen(true)}>目录</button>
          {mobileDirOpen && (
            <div className="mobile-doc-overlay" onClick={() => setMobileDirOpen(false)}>
              <div className="mobile-doc-panel" onClick={(e) => e.stopPropagation()}>
                <div className="mobile-doc-head">
                  <div className="mobile-doc-title">目录</div>
                  <button className="mobile-doc-close" type="button" onClick={() => setMobileDirOpen(false)}>×</button>
                </div>
                <div className="mobile-doc-tree">
                  <TreeNode node={tree} activePath={activeDisplayPath} baseTo={baseTo} openDirs={openDirs} toggleDir={toggleDir} />
                </div>
              </div>
            </div>
          )}
        </>
      )}
      <aside className={`docs-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="docs-sidebar-header">
          <div className="docs-header-row">
            <div className="docs-title">{id === 'frontend' ? '前端核心' : id === 'backend' ? '后端架构' : id === 'database' ? '数据矩阵' : id === 'tools' ? '效率工具' : id === 'other' ? '运维部署' : id === 'projects' ? '项目专栏' : '模块'}</div>
            <button className="docs-sidebar-toggle" onClick={() => setSidebarCollapsed(v => !v)} type="button" title={sidebarCollapsed ? '展开目录' : '收起目录'}>
              {sidebarCollapsed ? '»' : '«'}
            </button>
          </div>
        </div>

        {!sidebarCollapsed && (
          <div className="docs-tree">
            <TreeNode node={tree} activePath={activeDisplayPath} baseTo={baseTo} openDirs={openDirs} toggleDir={toggleDir} />
          </div>
        )}
      </aside>

      <section className="docs-content" ref={contentRef}>
        {loading && (
          <div className="loading">
            <span className="load-icon">💠</span>
            <span>SYSTEM LOADING...</span>
          </div>
        )}
        {!loading && mdHtml && (
          <div className="md-render fade" dangerouslySetInnerHTML={{ __html: mdHtml }} />
        )}
        {!loading && !mdHtml && (
          <div className="empty">
            <span style={{ fontSize: 40, marginBottom: 10 }}>📚</span>
            <span>选择左侧笔记以查看内容</span>
          </div>
        )}
      </section>

      {!!tocItems.length && (
        <aside className={`toc-panel ${tocCollapsed ? 'collapsed' : ''}`}>
          <button className="toc-toggle" type="button" onClick={() => setTocCollapsed(v => !v)} title={tocCollapsed ? '展开目录' : '收起目录'}>
            {tocCollapsed ? '≡' : '×'}
          </button>

          <div className="toc-dots">
            {tocItems.map((it) => (
              <button
                key={it.id}
                className={`toc-dot level-${it.level} ${activeTocId === it.id ? 'active' : ''}`}
                type="button"
                title={it.text}
                onClick={() => scrollToId(it.id)}
              />
            ))}
          </div>

          {!tocCollapsed && (
            <div className="toc-body">
              <div className="toc-title">本文目录</div>
              <div className="toc-list">
                {tocItems.map((it) => (
                  <button
                    key={it.id}
                    className={`toc-item level-${it.level} ${activeTocId === it.id ? 'active' : ''}`}
                    type="button"
                    onClick={() => scrollToId(it.id)}
                  >
                    {it.text}
                  </button>
                ))}
              </div>
            </div>
          )}
        </aside>
      )}

      <div className="doc-nav">
        <button
          className="doc-nav-btn"
          type="button"
          disabled={!prevDoc}
          title={prevDoc ? `上一篇：${prevDoc.displayPath.replace(/\.md$/i, '')}` : '没有上一篇'}
          onClick={() => prevDoc && navigate(`${baseTo}/${encodeDocPath(prevDoc.displayPath)}`)}
        >
          ←
        </button>
        <button
          className="doc-nav-btn"
          type="button"
          disabled={!nextDoc}
          title={nextDoc ? `下一篇：${nextDoc.displayPath.replace(/\.md$/i, '')}` : '没有下一篇'}
          onClick={() => nextDoc && navigate(`${baseTo}/${encodeDocPath(nextDoc.displayPath)}`)}
        >
          →
        </button>
      </div>
    </div>
  )
}

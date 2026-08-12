import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  BookOpen,
  Boxes,
  Braces,
  Cloud,
  Compass,
  Database,
  FolderKanban,
  Server,
  Sparkles,
  Wrench
} from 'lucide-react'
import { TECH_STACKS } from '../constants/techStack'

const DOCS_MD = import.meta.glob('../../docs/**/*.md', { query: '?raw', import: 'default' })

const CATEGORY_PREFIX = {
  frontend: '前端',
  backend: '后端',
  database: '数据矩阵',
  tools: '工具',
  projects: '专栏',
  other: '运维部署'
}

const CATEGORY_META = {
  frontend: {
    icon: Braces,
    label: 'Frontend',
    tone: 'cyan',
    route: '从页面结构到工程实践，建立一套可复用的前端认知。',
    steps: ['HTML / CSS / JavaScript', 'Vue 工程化与组件库', '接口联调与应用体验']
  },
  backend: {
    icon: Server,
    label: 'Backend',
    tone: 'green',
    route: '把基础语法、业务开发和系统设计连成一条主线。',
    steps: ['Java 基础与进阶', 'Spring Boot 业务开发', '微服务与 AI 应用']
  },
  database: {
    icon: Database,
    label: 'Data',
    tone: 'amber',
    route: '围绕查询、设计、性能和缓存，夯实数据层能力。',
    steps: ['SQL 与关系模型', '索引、事务和存储引擎', 'JDBC / MyBatis / Redis']
  },
  tools: {
    icon: Wrench,
    label: 'Toolbox',
    tone: 'rose',
    route: '把高频开发操作沉淀为能随时复用的工作流。',
    steps: ['Git 协作流程', '远程连接与排查', '日常效率工具']
  },
  projects: {
    icon: Boxes,
    label: 'Projects',
    tone: 'violet',
    route: '用真实业务把知识点串起来，留下可以复盘的过程。',
    steps: ['理解业务背景', '设计数据和接口', '记录开发与复盘']
  },
  other: {
    icon: Cloud,
    label: 'Ops',
    tone: 'blue',
    route: '补齐从本地开发到交付上线的最后一段能力。',
    steps: ['Linux 基础', 'Docker 容器化', '部署和环境排查']
  }
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

export default function Home() {
  const navigate = useNavigate()
  const stats = useMemo(() => {
    const docKeys = Object.keys(DOCS_MD)
      .map(docKeyFromModule)
      .filter(key => /\.md$/i.test(key) && !key.includes('/_archive/'))
    const counts = Object.fromEntries(Object.entries(CATEGORY_PREFIX).map(([id, prefix]) => [
      id,
      docKeys.filter(key => key.startsWith(`${prefix}/`)).length
    ]))
    return { total: docKeys.length, projects: counts.projects || 0, counts }
  }, [])

  const featured = [
    { category: 'frontend', title: '前端开发', desc: '从页面基础、JavaScript 到 Vue 工程化建立完整知识网络。', to: '/tech/frontend/前端开发' },
    { category: 'backend', title: 'Java 开发', desc: '从语言基础出发，逐步进入运行机制和服务端开发。', to: '/tech/backend/Java开发' },
    { category: 'database', title: 'MySQL', desc: '在一篇笔记中掌握查询、建模、事务、索引和优化。', to: '/tech/database/MySQL' }
  ]

  return (
    <div className="home-container">
      <section className="home-hero">
        <div className="hero-copy">
          <span className="eyebrow"><Sparkles size={15} /> AppleSheep Knowledge Garden</span>
          <h1>让每一篇笔记，都成为下一次解决问题的起点。</h1>
          <p>一个持续整理中的个人技术花园。从基础知识到项目复盘，用清晰路径代替零散收藏。</p>
          <div className="hero-actions">
            <button className="primary-action" type="button" onClick={() => navigate('/tech/frontend')}>开始学习 <ArrowRight size={17} /></button>
            <button className="secondary-action" type="button" onClick={() => navigate('/tech/projects')}>浏览项目专栏</button>
          </div>
        </div>

        <div className="hero-visual" aria-label="知识库概览">
          <div className="visual-window-bar">
            <span></span><span></span><span></span>
            <small>learning-path.md</small>
          </div>
          <div className="visual-path">
            <span className="visual-line-number">01</span><span>基础知识</span>
            <span className="visual-line-number">02</span><span>动手实践</span>
            <span className="visual-line-number">03</span><span>项目复盘</span>
            <span className="visual-line-number">04</span><span>持续迭代</span>
          </div>
          <div className="visual-stat-row">
            <div><strong>{stats.total}</strong><span>篇笔记</span></div>
            <div><strong>{stats.projects}</strong><span>篇项目记录</span></div>
            <div><strong>{TECH_STACKS.length}</strong><span>个学习方向</span></div>
          </div>
        </div>
      </section>

      <section className="home-section direction-section">
        <div className="section-heading split-heading">
          <div>
            <span className="eyebrow">Knowledge Tracks</span>
            <h2>按学习方向进入，不在目录里迷路。</h2>
          </div>
          <p>每个方向都从基础开始，并为项目实践和后续复盘预留位置。</p>
        </div>
        <div className="tech-grid">
          {TECH_STACKS.map(tech => {
            const meta = CATEGORY_META[tech.id]
            const CategoryIcon = meta.icon
            return (
              <button className={`tech-card accent-${meta.tone}`} key={tech.id} type="button" onClick={() => navigate(`/tech/${tech.id}`)}>
                <div className="tech-card-head"><span>{meta.label}</span><span>{stats.counts[tech.id] || 0} 篇</span></div>
                <div className="tech-icon"><CategoryIcon size={28} strokeWidth={1.7} /></div>
                <h3>{tech.name}</h3>
                <p>{tech.description}</p>
                <span className="tech-card-link">进入方向 <ArrowRight size={16} /></span>
              </button>
            )
          })}
        </div>
      </section>

      <section className="home-section featured-section">
        <div className="section-heading">
          <span className="eyebrow"><BookOpen size={15} /> 从这里开始</span>
          <h2>三条最适合建立手感的主线。</h2>
        </div>
        <div className="featured-grid">
          {featured.map((item, index) => (
            <button className="featured-note" type="button" key={item.title} onClick={() => navigate(item.to)}>
              <span className="featured-index">0{index + 1}</span>
              <span className="featured-category">{CATEGORY_META[item.category].label}</span>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
              <ArrowRight size={18} />
            </button>
          ))}
        </div>
      </section>

      <section className="home-section roadmap-section">
        <div className="section-heading">
          <span className="eyebrow"><Compass size={15} /> Learning map</span>
          <h2>把笔记变成一条可执行的成长路线。</h2>
        </div>
        <div className="roadmap-grid">
          {TECH_STACKS.map((tech, index) => {
            const meta = CATEGORY_META[tech.id]
            return (
              <article className="roadmap-card" key={tech.id}>
                <span className="roadmap-index">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h3>{tech.name}</h3>
                  <p>{meta.route}</p>
                  <ol>{meta.steps.map(step => <li key={step}>{step}</li>)}</ol>
                </div>
              </article>
            )
          })}
        </div>
        <button className="roadmap-cta" type="button" onClick={() => navigate('/tech/projects')}>
          <FolderKanban size={18} /> 从项目记录中查看知识如何落地 <ArrowRight size={17} />
        </button>
      </section>
    </div>
  )
}

import React, { useMemo } from 'react'
import { TECH_STACKS } from '../constants/techStack'

export default function MobileHome({ topMenus, onGoCategory, onGoDoc }) {
  const items = useMemo(() => {
    const wanted = ['frontend', 'backend', 'database', 'tools', 'other', 'projects']
    return TECH_STACKS.filter(s => wanted.includes(s.id))
  }, [])

  return (
    <div className="m-home">
      <div className="m-hero">
        <div className="m-title">AppleSheep</div>
        <div className="m-subtitle">移动端入口</div>
      </div>

      <div className="m-section">
        <div className="m-section-title">分类</div>
        <div className="m-grid">
          {items.map(it => (
            <button key={it.id} className="m-card" type="button" onClick={() => onGoCategory(it.id)}>
              <div className="m-card-top">
                <span className="m-card-icon">{it.icon}</span>
                <span className="m-card-name">{it.name}</span>
              </div>
              <div className="m-card-desc">{it.description}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="m-section">
        <div className="m-section-title">快捷入口</div>
        <div className="m-list">
          {topMenus.frontend.slice(0, 6).map(item => (
            <button key={item.to} className="m-list-item" type="button" onClick={() => onGoDoc(item.to)}>
              前端 · {item.label}
            </button>
          ))}
          {topMenus.backend.slice(0, 6).map(item => (
            <button key={item.to} className="m-list-item" type="button" onClick={() => onGoDoc(item.to)}>
              后端 · {item.label}
            </button>
          ))}
          {topMenus.database.slice(0, 6).map(item => (
            <button key={item.to} className="m-list-item" type="button" onClick={() => onGoDoc(item.to)}>
              数据 · {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}


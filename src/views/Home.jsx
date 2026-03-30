import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TECH_STACKS } from '../constants/techStack'

export default function Home() {
  const navigate = useNavigate()
  const techStacks = TECH_STACKS
  const [visitCount, setVisitCount] = useState(0)
  const [typingText, setTypingText] = useState('')
  const [logs, setLogs] = useState([
    { time: '10:42:01', message: 'System initialized successfully', type: 'info' },
    { time: '10:42:03', message: 'Loading modules...', type: 'info' },
    { time: '10:42:05', message: 'Connection established', type: 'success' },
    { time: '10:42:08', message: 'User access granted', type: 'success' }
  ])

  const navigateToTech = (id) => navigate(`/tech/${id}`)

  useEffect(() => {
    let count = localStorage.getItem('visit_count')
    if (!count) count = 1024
    else count = parseInt(count) + 1
    localStorage.setItem('visit_count', count)

    const target = count
    let current = target - 50
    const visitTimer = setInterval(() => {
      current += 1
      setVisitCount(current)
      if (current >= target) clearInterval(visitTimer)
    }, 20)

    const text = " Welcome to the Cyber Nexus. Let's build the future."
    let i = 0
    const typeTimer = setInterval(() => {
      if (i < text.length) {
        setTypingText(prev => prev + text.charAt(i))
        i++
      } else {
        clearInterval(typeTimer)
      }
    }, 100)

    const logTimer = setInterval(() => {
      const newLog = generateRandomLog()
      setLogs(prev => {
        const next = [newLog, ...prev]
        return next.slice(0, 6)
      })
    }, 3000)

    return () => {
      clearInterval(visitTimer)
      clearInterval(typeTimer)
      clearInterval(logTimer)
    }
  }, [])

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1 className="main-title">
          <span className="glitch" data-text="CYBER">CYBER</span>
          <span className="separator">•</span>
          <span className="neon-text">NEXUS</span>
        </h1>
        <p className="subtitle">连接未来技术的数字枢纽</p>
        <div className="slogan-container">
          <p className="slogan-text">"探索代码的边界，构建数字世界的无限可能"</p>
          <p className="slogan-sub">Exploring boundaries, Building possibilities.</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="profile-card">
          <div className="profile-header">
            <div className="avatar-placeholder">
              <span className="avatar-text">AS</span>
            </div>
            <div className="profile-info">
              <h3 className="profile-name">AppleSheep</h3>
              <p className="profile-role">Full Stack Developer</p>
            </div>
          </div>
          <div className="typing-container">
            <span className="prompt"></span>
            <span className="typing-text">{typingText}</span>
            <span className="cursor">_</span>
          </div>
          <div className="skill-tags">
            <span className="tag">React</span>
            <span className="tag">Node.js</span>
            <span className="tag">Cyberpunk</span>
            <span className="tag">Design</span>
          </div>
        </div>

        <div className="system-logs">
          <div className="log-header">
            <span className="status-dot"></span>
            SYSTEM LOGS
          </div>
          <div className="log-content">
            {logs.map((log, index) => (
              <div key={index} className="log-item">
                <span className="log-time">[{log.time}]</span>
                <span className={`log-msg ${log.type}`}>{log.message}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="tech-grid">
        {techStacks.map(tech => (
          <div key={tech.id} className="tech-card" onClick={() => navigateToTech(tech.id)}>
            <div className="card-content">
              <div className="icon-wrapper">{tech.icon}</div>
              <h2 className="tech-name">{tech.name}</h2>
              <p className="tech-desc">{tech.description}</p>
              <div className="card-glow"></div>
            </div>
          </div>
        ))}
      </div>

      <footer className="site-footer">
        <div className="visitor-stats">
          <span className="stats-icon">📡</span>
          <span className="stats-label">SYSTEM STATUS:</span>
          <span className="stats-value">ONLINE</span>
          <span className="separator">|</span>
          <span className="stats-label">TOTAL VISITS:</span>
          <span className="stats-count">{visitCount}</span>
        </div>
        <p className="footer-note">Server IP Recorded • Secure Connection Established</p>
      </footer>
    </div>
  )
}

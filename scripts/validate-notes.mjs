import fs from 'node:fs'
import path from 'node:path'
import { marked } from 'marked'

const root = path.resolve(import.meta.dirname, '..')
const docsRoot = path.join(root, 'docs')
const requiredSections = ['阅读目录', '学习目标', '知识地图', '核心内容', '综合示例', '常见误区', '练习题', '参考答案', '复习清单']

function listMarkdown(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const absolute = path.join(directory, entry.name)
    if (entry.isDirectory()) return listMarkdown(absolute)
    return entry.isFile() && entry.name.toLowerCase().endsWith('.md') ? [absolute] : []
  })
}

function walkTokens(tokens, callback) {
  for (const token of tokens) {
    callback(token)
    if (Array.isArray(token.tokens)) walkTokens(token.tokens, callback)
    if (Array.isArray(token.items)) {
      for (const item of token.items) {
        if (Array.isArray(item.tokens)) walkTokens(item.tokens, callback)
      }
    }
  }
}

const errors = []
let headingCount = 0
let codeBlockCount = 0
let exerciseCount = 0
let imageCount = 0

const noteFiles = listMarkdown(docsRoot)

for (const file of noteFiles) {
  const relative = path.relative(root, file).split(path.sep).join('/')
  const markdown = fs.readFileSync(file, 'utf8')
  const tokens = marked.lexer(markdown)
  const headings = []
  const images = []

  walkTokens(tokens, token => {
    if (token.type === 'heading') headings.push(token)
    if (token.type === 'code') codeBlockCount += 1
    if (token.type === 'image') images.push(token)
  })

  headingCount += headings.length
  imageCount += images.length
  const h1 = headings.filter(heading => heading.depth === 1)
  if (h1.length !== 1) errors.push(`${relative}: 应有且仅有一个 H1，实际为 ${h1.length}`)
  if (headings[0]?.depth !== 1) errors.push(`${relative}: 第一处标题必须是 H1`)

  const sectionNames = new Set(headings.filter(heading => heading.depth === 2).map(heading => heading.text.trim()))
  for (const section of requiredSections) {
    if (!sectionNames.has(section)) errors.push(`${relative}: 缺少二级章节“${section}”`)
  }

  for (let index = 1; index < headings.length; index += 1) {
    if (headings[index].depth > headings[index - 1].depth + 1) {
      errors.push(`${relative}: 标题层级从 H${headings[index - 1].depth} 跳到 H${headings[index].depth}（${headings[index].text}）`)
    }
  }

  const fenceCount = markdown.split('\n').filter(line => /^\s*(```|~~~)/.test(line)).length
  if (fenceCount % 2 !== 0) errors.push(`${relative}: 代码围栏未闭合`)
  if (/[ \t]+$/m.test(markdown)) errors.push(`${relative}: 存在行尾空白`)
  if (/^ +\t/m.test(markdown)) errors.push(`${relative}: 行首缩进混用了空格和 Tab`)
  if (!markdown.endsWith('\n') || markdown.endsWith('\n\n')) errors.push(`${relative}: 文件结尾必须保留且仅保留一个换行`)
  const hasLocalMarkdownPath = /\]\([A-Za-z]:[\\/][^)]+\)/.test(markdown)
  const hasLocalHtmlImage = /<img[^>]+src=["'][A-Za-z]:[\\/]/i.test(markdown)
  if (hasLocalMarkdownPath || hasLocalHtmlImage) errors.push(`${relative}: 存在不可移植的本机绝对路径`)
  if (/<iframe\b|googleads|Advertisement/i.test(markdown)) errors.push(`${relative}: 存在网页抓取噪音`)
  if (/\]\(\/tech\/[^)]*\.md(?:#[^)]*)?\)/.test(markdown)) errors.push(`${relative}: 存在旧版 .md 站内链接`)

  const exerciseSection = markdown.match(/^##\s+练习题\s*$([\s\S]*?)^##\s+参考答案\s*$/m)?.[1] || ''
  const exercises = exerciseSection.match(/^\s*\d+\.\s+\S.+$/gm) || []
  exerciseCount += exercises.length
  if (exercises.length < 3) errors.push(`${relative}: 至少需要 3 道练习题`)

  for (const image of images) {
    const href = String(image.href || '')
    if (!href || /^(https?:)?\/\//i.test(href) || /^data:/i.test(href)) continue
    const decoded = decodeURI(href.split('#')[0].split('?')[0])
    const target = path.resolve(path.dirname(file), decoded)
    if (!fs.existsSync(target)) errors.push(`${relative}: 图片不存在（${href}）`)
  }
}

if (errors.length) {
  process.stderr.write(`笔记检查失败，共 ${errors.length} 个问题：\n- ${errors.join('\n- ')}\n`)
  process.exit(1)
}

process.stdout.write(`笔记检查通过：${noteFiles.length} 篇主笔记，${headingCount} 个标题，${codeBlockCount} 个代码示例，${exerciseCount} 道练习，${imageCount} 张有效图片。\n`)

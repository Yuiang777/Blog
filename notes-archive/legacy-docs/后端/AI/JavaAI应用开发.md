# Java AI 应用开发（专栏式笔记）

## Agent 代理应用开发（日志摘要）

### 初始化与能力清单

- DDD 架构组织代码
- 接入 Ollama，并拉取模型（示例：deepseek-r1:1.5b）
- 支持两类调用：
  - `generate`：同步阻塞调用
  - `generate_stream`：异步流式调用
- RAG：知识库上传、解析、入库、检索与问答

## RAG 核心流程（从文件到回答）

知识入库：

```
原始文件
  → TikaDocumentReader（抽取文本）
  → TokenTextSplitter（切分）
  → Embedding（向量化）
  → PgVectorStore（入库）
```

问答流程：

```
用户问题
  → SearchRequest
  → PgVectorStore.similaritySearch()
  → TopK 文档
  → 拼接 Prompt（SystemPromptTemplate）
  → LLM（OllamaChatModel）
  → 最终回答
```

## 相关知识点速记

### Reactor：Flux

- 0..N 的异步序列
- 非阻塞、支持背压、操作符丰富

### VectorStore：SimpleVectorStore vs PgVectorStore

| 特性 | SimpleVectorStore | PgVectorStore |
| --- | --- | --- |
| 速度 | 极快（内存） | 较快（数据库） |
| 持久性 | 临时 | 永久 |
| 容量 | 受内存限制 | 受硬盘限制 |
| 共享 | 单应用内 | 多应用共享 |

### TikaDocumentReader

用于解析 PDF/Word/Excel/PPT 等多种格式并提取文本。

### TokenTextSplitter

用于将文本按 token 规模切分，尽量在语义边界处断开，便于 embedding 与检索。

### SearchRequest（TopK + Filter）

```
query: 用户问题
topK: 取最相似的 K 个
filterExpression: 限定知识库/范围
```

### SystemPromptTemplate

将检索出来的文档作为上下文注入提示词，要求模型基于 DOCUMENTS 回答。

### MultipartFile

Spring MVC 文件上传对象，常用 `getOriginalFilename / getInputStream / transferTo`。


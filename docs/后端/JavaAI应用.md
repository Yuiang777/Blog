# Java AI 应用完整笔记

> 从模型调用到 RAG 数据链路，统一整理 Agent、文档解析、切分、嵌入、向量存储与检索增强生成。内容强调可观测性、引用和失败降级。

| 项目 | 说明 |
| --- | --- |
| 难度 | 专项实践 |
| 适合读者 | 希望使用 Java 构建大模型、RAG 与向量检索应用的开发者 |
| 原始资料 | 2 份分散笔记，已合并并保留到 `notes-archive/legacy-docs/` |

## 阅读目录

1. [学习目标](#学习目标)
2. [知识地图](#知识地图)
3. [核心内容](#核心内容)
4. [综合示例](#综合示例)
5. [常见误区](#常见误区)
6. [练习题](#练习题)
7. [参考答案](#参考答案)
8. [复习清单](#复习清单)

## 学习目标

- 理解提示词、模型、工具和 Agent 的职责
- 掌握 RAG 的加载、切分、嵌入、检索与回答流程
- 理解向量存储抽象与实现差异
- 能够评估检索质量并避免无依据回答

## 知识地图

1. 模型调用与提示词
2. 文档加载与切分
3. Embedding 与 Vector Store
4. 检索、上下文注入与答案评估

## 核心内容



### Agent 与 RAG 应用

#### Java AI 应用开发（专栏式笔记）

#### Agent 代理应用开发（日志摘要）

##### 初始化与能力清单

- DDD 架构组织代码
- 接入 Ollama，并拉取模型（示例：deepseek-r1:1.5b）
- 支持两类调用：
  - `generate`：同步阻塞调用
  - `generate_stream`：异步流式调用
- RAG：知识库上传、解析、入库、检索与问答

#### RAG 核心流程（从文件到回答）

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

#### 相关知识点速记

##### Reactor：Flux

- 0..N 的异步序列
- 非阻塞、支持背压、操作符丰富

##### VectorStore：SimpleVectorStore vs PgVectorStore

| 特性 | SimpleVectorStore | PgVectorStore |
| --- | --- | --- |
| 速度 | 极快（内存） | 较快（数据库） |
| 持久性 | 临时 | 永久 |
| 容量 | 受内存限制 | 受硬盘限制 |
| 共享 | 单应用内 | 多应用共享 |

##### TikaDocumentReader

用于解析 PDF/Word/Excel/PPT 等多种格式并提取文本。

##### TokenTextSplitter

用于将文本按 token 规模切分，尽量在语义边界处断开，便于 embedding 与检索。

##### SearchRequest（TopK + Filter）

```
query: 用户问题
topK: 取最相似的 K 个
filterExpression: 限定知识库/范围
```

##### SystemPromptTemplate

将检索出来的文档作为上下文注入提示词，要求模型基于 DOCUMENTS 回答。

##### MultipartFile

Spring MVC 文件上传对象，常用 `getOriginalFilename / getInputStream / transferTo`。

---

### Vector Store 补充

#### 一、简单介绍

Vector Store（向量数据库）本质上是：

> 用来存储“文本向量”的数据库，并支持“相似度搜索”。

它和传统关系数据库不同的是查询的方式，执行相似性搜索，而不是精确匹配

VectorStore 用于将您的数据与 AI 模型集成。在使用它们时的第一步是将您的数据加载到矢量数据库中。然后，当要将用户查询发送到 AI 模型时，首先检索一组相似文档。然后，这些文档作为用户问题的上下文，并与用户的查询一起发送到 AI 模型。这种技术被称为检索增强生成（`Retrieval Augmented Generation，RAG`）。

传统数据库：

```mysql
select * from doc where content like '%AI%'
```

向量数据库：

```
给我找“语义上最接近这个问题”的文档
```


在 RAG（Retrieval-Augmented Generation）中流程是：

```
用户问题
    ↓
Embedding（向量化）
    ↓
Vector Store 相似度搜索
    ↓
拿到 TopK 文档
    ↓
拼接 Prompt
    ↓
大模型回答
```

------

#### 二、核心知识点


#### 三、API介绍

​

## 综合示例

### 综合示例：带来源约束的 RAG 提示词

```java
String context = documents.stream()
    .map(doc -> "来源: " + doc.getMetadata().get("source") + "\n" + doc.getText())
    .collect(Collectors.joining("\n\n---\n\n"));

String prompt = """
    只根据给定资料回答。资料不足时明确说明不知道。
    回答末尾列出使用的来源。

    资料：
    %s

    问题：%s
    """.formatted(context, question);
```

示例要点：

- 文档元数据必须保留来源、页码或章节，便于引用。
- “只能根据资料回答”是约束，不是质量保证，仍需评测。
- 切分大小、重叠长度和 topK 要基于语料做实验。

## 常见误区

- 把向量相似度当作事实正确性
- 文档切分后丢失标题与来源元数据
- 把所有历史对话无限加入提示词
- 只做演示，不建立检索命中率和答案质量评测集

## 练习题

1. 设计一个最小 RAG 评测集。
2. 为什么文档切分需要重叠？
3. Vector Store 接口与具体数据库实现是什么关系？

## 参考答案

### 1. 设计一个最小 RAG 评测集。

准备至少 20 个问题，标注预期来源、答案要点和不可回答问题；分别评估召回、引用和最终答案。

### 2. 为什么文档切分需要重叠？

重叠可以减少关键语义被分割边界截断，但过大将增加重复召回和 token 成本。

### 3. Vector Store 接口与具体数据库实现是什么关系？

接口统一增删查能力；内存实现适合本地验证，PgVector 等持久化实现适合生产规模、过滤和运维。

## 复习清单

- [ ] 能画出完整 RAG 数据流
- [ ] 能保留并展示来源
- [ ] 能解释切分和检索参数
- [ ] 能建立离线评测与失败降级

## 原始资料索引

- Agent 与 RAG 应用：`后端/AI/JavaAI应用开发.md`
- Vector Store 补充：`后端/java/stream流.md`

> 整理原则：正文保留原笔记知识点，统一标题层级与资源链接；新增示例、练习和答案用于检验理解。遇到版本相关 API 时，应以所用版本的官方文档为准。

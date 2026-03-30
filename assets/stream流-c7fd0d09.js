const r=`# Vector Store（向量数据库）\r
\r
\r
\r
## 一、简单介绍\r
\r
Vector Store（向量数据库）本质上是：\r
\r
> 用来存储“文本向量”的数据库，并支持“相似度搜索”。\r
\r
它和传统关系数据库不同的是查询的方式，执行相似性搜索，而不是精确匹配\r
\r
VectorStore 用于将您的数据与 AI 模型集成。在使用它们时的第一步是将您的数据加载到矢量数据库中。然后，当要将用户查询发送到 AI 模型时，首先检索一组相似文档。然后，这些文档作为用户问题的上下文，并与用户的查询一起发送到 AI 模型。这种技术被称为检索增强生成（\`Retrieval Augmented Generation，RAG\`）。\r
\r
传统数据库：\r
\r
\`\`\`mysql\r
select * from doc where content like '%AI%'\r
\`\`\`\r
\r
向量数据库：\r
\r
\`\`\`\r
给我找“语义上最接近这个问题”的文档\r
\`\`\`\r
\r
\r
\r
在 RAG（Retrieval-Augmented Generation）中流程是：\r
\r
\`\`\`\r
用户问题\r
    ↓\r
Embedding（向量化）\r
    ↓\r
Vector Store 相似度搜索\r
    ↓\r
拿到 TopK 文档\r
    ↓\r
拼接 Prompt\r
    ↓\r
大模型回答\r
\`\`\`\r
\r
------\r
\r
## 二、核心知识点\r
\r
\r
\r
## 三、API介绍\r
\r
​	`;export{r as default};

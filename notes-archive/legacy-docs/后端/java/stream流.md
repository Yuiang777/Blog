# Vector Store（向量数据库）



## 一、简单介绍

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

## 二、核心知识点



## 三、API介绍

​	
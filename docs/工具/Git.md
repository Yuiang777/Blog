# Git 完整笔记

> 从工作区、暂存区和仓库模型出发，整理常用命令、分支协作、撤销、冲突处理和提交规范。

| 项目 | 说明 |
| --- | --- |
| 难度 | 日常协作 |
| 适合读者 | 需要建立可靠版本控制和团队协作流程的开发者 |
| 原始资料 | 1 份分散笔记，已合并并保留到 `notes-archive/legacy-docs/` |

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

- 理解 Git 对象、三区和分支指针
- 掌握提交、分支、合并、变基与远程协作
- 能够选择安全的撤销方式
- 能够处理冲突并编写清晰提交

## 知识地图

1. 仓库模型与三区
2. 提交与分支
3. 远程协作与冲突
4. 撤销、恢复与历史整理

## 核心内容



### Git 原理与常用流程

#### Git 能解决什么

- 备份与历史追溯（谁在什么时候改了什么）
- 回滚与试错（快速切换版本）
- 协同开发（分支并行、合并）

#### 版本控制模型

##### 集中式（SVN / CVS）

- 代码与版本库在“中央服务器”
- 必须联网才能提交/协作

##### 分布式（Git）

- 每个人本地都有完整仓库历史
- 远端（GitHub/GitLab）更多是协作中心，不是唯一版本源

#### Git 工作区三大区域

```
工作区  ->  暂存区  ->  本地仓库  ->  远端仓库
```

配套示意图：

![](./img/%E5%AF%B9git%E4%BB%93%E5%BA%93%E7%9A%84%E4%BF%AE%E6%94%B9.png)

#### 常用命令速查

##### 初始化与查看

```bash
git init
git status
git log --all --graph --pretty=oneline --abbrev-commit
git reflog
```

##### 提交流程

```bash
git add .
git commit -m "feat: xxx"
```

##### 版本切换（回退）

```bash
git reset --hard <commit>
```

#### 配置与常见问题

##### 设置用户名与邮箱

```bash
git config --global user.name "your-name"
git config --global user.email "your-email@example.com"
```

##### 中文乱码（文件名）

```bash
git config --global core.quotepath false
```

##### 常用别名

```bash
git config --global alias.lg "log --all --graph --pretty=oneline --abbrev-commit"
```

#### Git 工作流程（理解分支）

![](./img/%E5%B7%A5%E4%BD%9C%E6%B5%81%E7%A8%8B.png)

#### 工作树（git worktree）

适用场景：同一个仓库同时维护多个分支，但不想反复切换分支（比如一边修 bug 一边开发新功能）。

```bash
git worktree add <path> <branch>
git worktree list
git worktree remove <path>
```

## 综合示例

### 综合示例：完成一个小功能

```bash
git switch -c feat/article-search
git status
git add src/search.js tests/search.test.js
git diff --cached
git commit -m "feat: add article search"
git fetch origin
git rebase origin/master
git push -u origin feat/article-search
```

示例要点：

- 提交前检查暂存区差异，避免带入无关文件。
- 在个人分支上变基以整理历史；共享分支变基前必须协调。
- 提交描述使用动词并说明可观察的变化。

## 常见误区

- 使用 `git add .` 后不检查暂存区
- 用 `reset --hard` 处理所有撤销场景
- 在共享分支强制推送
- 一个提交同时混合功能、格式化和无关重构

## 练习题

1. 已提交但尚未推送，如何修改最后一次提交信息？
2. `revert` 与 `reset` 的区别是什么？
3. 冲突解决后要做什么？

## 参考答案

### 1. 已提交但尚未推送，如何修改最后一次提交信息？

使用 `git commit --amend`；若已推送到共享分支，应新增修正提交或先协调。

### 2. `revert` 与 `reset` 的区别是什么？

revert 创建反向提交，保留公开历史；reset 移动分支指针，适合未共享的本地历史。

### 3. 冲突解决后要做什么？

逐个确认冲突标记和最终逻辑，运行测试，git add 标记已解决，再继续 merge 或 rebase。

## 复习清单

- [ ] 能解释工作区、暂存区和 HEAD
- [ ] 能安全撤销不同阶段的修改
- [ ] 能处理合并与变基冲突
- [ ] 能保持提交小而清晰

## 原始资料索引

- Git 原理与常用流程：`工具/Git笔记.md`

> 整理原则：正文保留原笔记知识点，统一标题层级与资源链接；新增示例、练习和答案用于检验理解。遇到版本相关 API 时，应以所用版本的官方文档为准。

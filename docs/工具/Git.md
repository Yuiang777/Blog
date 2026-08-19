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

## Git 对象模型

理解对象模型后，很多命令就不再需要死记。Git 主要保存四类对象：

- `blob`：文件内容，不包含文件名。
- `tree`：目录快照，记录文件名、权限和指向 blob 或子 tree 的引用。
- `commit`：指向根 tree，并保存父提交、作者、时间和说明。
- `tag`：为某个对象创建带说明和签名的固定名称。

分支只是指向某个 commit 的可移动引用，`HEAD` 通常指向当前分支。提交并不是“保存 diff”，而是创建一次完整快照；Git 会在存储层做去重和压缩。

```bash
git cat-file -t HEAD
git cat-file -p HEAD
git ls-tree HEAD
git rev-parse HEAD^{tree}
```

`HEAD~2` 表示沿第一个父提交向前两步；`HEAD^2` 表示合并提交的第二个父提交。排查合并历史时要区分两者。

## 差异与历史阅读

### 三种常用 diff

```bash
git diff                 # 工作区 vs 暂存区
git diff --staged        # 暂存区 vs HEAD
git diff HEAD            # 工作区和暂存区整体 vs HEAD
```

查看某次提交：

```bash
git show --stat <commit>
git show <commit> -- src/App.jsx
git log --oneline --graph --decorate --all
git log -S "关键字符串" --all
git log -G "正则表达式" -- src
```

`-S` 查找某个字符串数量发生变化的提交，`-G` 查找补丁内容匹配正则的提交。定位“某段代码何时引入”时比逐个打开提交更有效。

### blame 的正确用法

```bash
git blame -L 80,120 src/App.jsx
```

`blame` 用于找到上下文和相关提交，不是用于追责。发现可疑行后继续阅读对应提交说明、测试和关联改动。

## 分支、合并与变基

### 功能分支的基本流程

```bash
git switch master
git pull --ff-only
git switch -c feature/note-search

# 开发并提交
git add -p
git commit -m "feat: add note search"
```

`git add -p` 可以按补丁块选择暂存内容，帮助把无关修改拆成独立提交。

### merge 与 rebase 如何选择

| 操作 | 历史特点 | 合适场景 |
| --- | --- | --- |
| merge | 保留真实分叉，可能产生合并提交 | 共享分支、希望保留上下文 |
| rebase | 将提交重放到新基线，历史线性 | 整理未共享的个人功能分支 |
| squash merge | PR 合并为一个提交 | 小功能、仓库希望主分支简洁 |

更新个人功能分支：

```bash
git fetch origin
git rebase origin/master
```

只要提交已经被其他人基于其继续工作，就不要随意 rebase 和强推。确需覆盖远端个人分支时使用：

```bash
git push --force-with-lease
```

`--force-with-lease` 会在远端分支出现未预期更新时拒绝覆盖，比 `--force` 安全，但仍应确认分支所有权。

### 冲突处理

1. 执行 `git status` 确认冲突文件和当前操作。
2. 理解两边意图，不要机械选择 ours 或 theirs。
3. 删除冲突标记，运行格式化和测试。
4. `git add` 标记已解决。
5. merge 使用 `git commit`，rebase 使用 `git rebase --continue`。

如果方向错误，可分别使用 `git merge --abort` 或 `git rebase --abort` 返回操作前状态。

## 撤销与恢复决策表

| 场景 | 推荐操作 | 是否改写历史 |
| --- | --- | --- |
| 丢弃未暂存的单个文件修改 | `git restore path` | 否 |
| 取消暂存，保留文件修改 | `git restore --staged path` | 否 |
| 修改最后一次未推送提交 | `git commit --amend` | 是 |
| 撤销已共享提交 | `git revert <commit>` | 否，新增反向提交 |
| 将本地分支退回旧提交 | `git reset --soft/mixed/hard` | 是 |
| 找回误删分支或 reset 前提交 | `git reflog` | 否 |

`git reset --hard` 会丢弃工作区和暂存区修改，执行前必须检查状态。更稳妥的恢复过程：

```bash
git reflog --date=local
git branch rescue/<date> <lost-commit>
git show rescue/<date>
```

先创建救援分支，再决定 cherry-pick、merge 或继续开发。只要对象尚未被垃圾回收，reflog 往往能找回误操作前的位置。

### 用 stash 临时保存

```bash
git stash push -u -m "wip: note layout"
git stash list
git stash show -p stash@{0}
git stash apply stash@{0}
```

`-u` 包含未跟踪文件。重要工作不要长期只放在 stash 中，应尽快转为分支提交。`apply` 成功后再手工 `drop`，比直接 `pop` 更容易处理冲突。

## 高质量提交

一个提交应满足：

- 只解决一个清晰问题。
- 构建和相关测试可以通过。
- 提交说明表达“为什么改”和结果，而不是罗列文件名。
- 不混入格式化、生成物或无关重构。
- 不包含密钥、口令、令牌和用户数据。

推荐说明结构：

```text
feat: add active heading tracking

Keep the article table of contents visible while reading and
scroll its active heading into view for long notes.
```

提交前检查：

```bash
git status --short
git diff --check
git diff
git diff --staged
```

## 团队协作工作流

### 拉取请求检查清单

- 标题和说明能解释变更目标、方案和影响范围。
- 关联需求或缺陷，列出验证方法。
- UI 变更提供桌面和移动端截图。
- 数据库变更说明向前兼容、迁移和回滚。
- 大型重构与功能变更尽量拆开。

### 发布标签

```bash
git tag -s v1.4.0 -m "AppleSheep v1.4.0"
git push origin v1.4.0
```

生产发布推荐使用带注释标签，关键仓库可签名。标签应指向经过 CI 验证且可重建的提交，不要把同一版本标签移动到另一个提交。

### 防止敏感信息进入历史

`.gitignore` 只能阻止未跟踪文件被新增，已经提交的文件仍会继续被跟踪：

```bash
git rm --cached .env
```

若密钥已经进入历史，应先立即吊销和轮换，再评估使用 `git filter-repo` 清理历史。仅删除最新提交中的文件不能消除旧提交里的秘密。

## 排错工具箱

### 二分定位回归

```bash
git bisect start
git bisect bad HEAD
git bisect good v1.3.0

# 每轮测试后
git bisect good   # 或 git bisect bad

git bisect reset
```

有自动化测试时可以运行 `git bisect run <test-command>`，Git 会自动定位第一个失败提交。

### 选择性搬运提交

```bash
git cherry-pick -x <commit>
```

适合把独立修复搬到发布分支。`-x` 会在提交说明中保留来源提交，便于追踪。若一个修复依赖大量前置提交，应优先评估正常合并或重新实现，而不是连续搬运一串提交。

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
4. 误用 `reset --hard` 后如何尝试找回提交？
5. 为什么不应随意 rebase 已经共享的分支？

## 参考答案

### 1. 已提交但尚未推送，如何修改最后一次提交信息？

使用 `git commit --amend`；若已推送到共享分支，应新增修正提交或先协调。

### 2. `revert` 与 `reset` 的区别是什么？

revert 创建反向提交，保留公开历史；reset 移动分支指针，适合未共享的本地历史。

### 3. 冲突解决后要做什么？

逐个确认冲突标记和最终逻辑，运行测试，git add 标记已解决，再继续 merge 或 rebase。

### 4. 误用 `reset --hard` 后如何尝试找回提交？

先执行 `git reflog` 找到误操作前的提交，再立即创建 `rescue/...` 分支保存它。确认内容后通过 merge、cherry-pick 或切换分支恢复，不要继续执行会触发清理的操作。

### 5. 为什么不应随意 rebase 已经共享的分支？

rebase 会创建新的提交 ID，其他人基于旧提交的工作会产生分叉和重复历史。共享分支应优先 merge 或新增修复提交；个人分支确需改写时也要协调并使用 `--force-with-lease`。

## 复习清单

- [ ] 能解释工作区、暂存区和 HEAD
- [ ] 能安全撤销不同阶段的修改
- [ ] 能处理合并与变基冲突
- [ ] 能保持提交小而清晰

## 官方文档与延伸阅读

- [Pro Git](https://git-scm.com/book/en/v2) - Git 原理、分支、远程与内部对象。
- [Git Reference](https://git-scm.com/docs) - 所有命令的官方参考。
- [gitrevisions](https://git-scm.com/docs/gitrevisions) - 提交引用、父提交和范围表达式。
- [gitreflog](https://git-scm.com/docs/git-reflog) - reflog 与误操作恢复。
- [gitworkflows](https://git-scm.com/docs/gitworkflows) - 团队协作与维护工作流。

## 原始资料索引

- Git 原理与常用流程：`工具/Git笔记.md`

> 整理原则：正文保留原笔记知识点，统一标题层级与资源链接；新增示例、练习和答案用于检验理解。遇到版本相关 API 时，应以所用版本的官方文档为准。

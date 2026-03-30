const n=`# Git 笔记

## Git 能解决什么

- 备份与历史追溯（谁在什么时候改了什么）
- 回滚与试错（快速切换版本）
- 协同开发（分支并行、合并）

## 版本控制模型

### 集中式（SVN / CVS）

- 代码与版本库在“中央服务器”
- 必须联网才能提交/协作

### 分布式（Git）

- 每个人本地都有完整仓库历史
- 远端（GitHub/GitLab）更多是协作中心，不是唯一版本源

## Git 工作区三大区域

\`\`\`
工作区  ->  暂存区  ->  本地仓库  ->  远端仓库
\`\`\`

配套示意图：

![](对git仓库的修改.png)

## 常用命令速查

### 初始化与查看

\`\`\`bash
git init
git status
git log --all --graph --pretty=oneline --abbrev-commit
git reflog
\`\`\`

### 提交流程

\`\`\`bash
git add .
git commit -m "feat: xxx"
\`\`\`

### 版本切换（回退）

\`\`\`bash
git reset --hard <commit>
\`\`\`

## 配置与常见问题

### 设置用户名与邮箱

\`\`\`bash
git config --global user.name "your-name"
git config --global user.email "your-email@example.com"
\`\`\`

### 中文乱码（文件名）

\`\`\`bash
git config --global core.quotepath false
\`\`\`

### 常用别名

\`\`\`bash
git config --global alias.lg "log --all --graph --pretty=oneline --abbrev-commit"
\`\`\`

## Git 工作流程（理解分支）

![](工作流程.png)

## 工作树（git worktree）

适用场景：同一个仓库同时维护多个分支，但不想反复切换分支（比如一边修 bug 一边开发新功能）。

\`\`\`bash
git worktree add <path> <branch>
git worktree list
git worktree remove <path>
\`\`\`

`;export{n as default};

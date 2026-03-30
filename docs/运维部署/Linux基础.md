# Linux 基础（速记）

## 目录结构

![](目录结构.png)

根目录 `/` 是所有目录的起点，常见目录含义：

| 目录 | 含义 |
| --- | --- |
| /bin | 常用二进制命令 |
| /etc | 系统配置 |
| /home | 普通用户目录 |
| /root | root 用户目录 |
| /var | 可变数据（日志等） |
| /usr | 应用程序与共享资源 |

## 命令格式

```
command [-options] [parameter]
```

常用技巧：

- Tab 自动补全
- 上下方向键翻历史命令
- `clear` 或 `Ctrl + L` 清屏

## 常用命令

### ls

```bash
ls
ls -al
```

### cd / pwd

```bash
pwd
cd /
cd ~
cd -
```

### 文件与目录

```bash
mkdir -p a/b/c
touch a.txt
cp -r src dst
mv old new
rm -rf dir
```

### 查看文件

```bash
cat file
less file
head -n 50 file
tail -n 200 file
tail -f app.log
```

## 开发流程（常见）

```
需求分析 -> 设计 -> 编码 -> 测试 -> 上线运维
```


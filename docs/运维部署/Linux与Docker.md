# Linux 与 Docker 完整笔记

> 从 Linux 文件、进程、权限和网络开始，过渡到 Docker 镜像、容器、卷、网络和部署检查，形成可执行的发布路径。

| 项目 | 说明 |
| --- | --- |
| 难度 | 部署基础 |
| 适合读者 | 需要从 Linux 命令进入容器化和应用部署的开发者 |
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

- 掌握 Linux 文件、权限、进程、日志和网络命令
- 理解镜像、容器、卷与网络
- 能够编写基础 Dockerfile 并部署服务
- 能够执行上线检查、健康验证和回滚

## 知识地图

1. Linux 文件系统与权限
2. 进程、服务、日志与网络
3. Docker 镜像、容器、存储和网络
4. 构建、发布、健康检查与回滚

## 核心内容



### Linux 基础

#### 目录结构


根目录 `/` 是所有目录的起点，常见目录含义：

| 目录 | 含义 |
| --- | --- |
| /bin | 常用二进制命令 |
| /etc | 系统配置 |
| /home | 普通用户目录 |
| /root | root 用户目录 |
| /var | 可变数据（日志等） |
| /usr | 应用程序与共享资源 |

#### 命令格式

```
command [-options] [parameter]
```

常用技巧：

- Tab 自动补全
- 上下方向键翻历史命令
- `clear` 或 `Ctrl + L` 清屏

#### 常用命令

##### ls

```bash
ls
ls -al
```

##### cd / pwd

```bash
pwd
cd /
cd ~
cd -
```

##### 文件与目录

```bash
mkdir -p a/b/c
touch a.txt
cp -r src dst
mv old new
rm -rf dir
```

##### 查看文件

```bash
cat file
less file
head -n 50 file
tail -n 200 file
tail -f app.log
```

#### 开发流程（常见）

```
需求分析 -> 设计 -> 编码 -> 测试 -> 上线运维
```


> 图片说明：原笔记引用的 目录结构.png 未保存到仓库；相关文字知识点已保留。

---

### Docker 与项目部署

#### 为什么用 Docker

- 不再强依赖服务器环境（系统/依赖/配置差异更少）
- 安装部署流程更短（镜像 + 容器）
- 适合项目阶段的多服务部署与复现

核心概念：

- 镜像（image）：包含应用 + 运行环境
- 容器（container）：镜像的运行实例

#### 快速入门：部署 MySQL（示例）

```bash
docker run -d \
  --name mysql \
  -p 3307:3306 \
  -e TZ=Asia/Shanghai \
  -e MYSQL_ROOT_PASSWORD=YOUR_PASSWORD \
  mysql:8
```

说明：

- `-d` 后台运行
- `--name` 容器名
- `-p 宿主机端口:容器端口` 端口映射
- `-e KEY=VALUE` 环境变量（由镜像决定）

#### 常用命令速查

```bash
docker pull nginx:1.20.2
docker images
docker run -d --name nginx -p 80:80 nginx
docker ps
docker ps -a
docker logs nginx
docker exec -it nginx bash
docker stop nginx
docker start nginx
docker restart nginx
docker rm nginx
docker rmi nginx:1.20.2
docker inspect nginx
```

镜像与容器操作图示（参考）：


#### 开机自启

```bash
systemctl enable docker
docker update --restart=always <容器名或容器id>
```

#### Nginx 安装与目录结构（提示）


> 图片说明：原笔记引用的 Docker操作镜像.png、安装nginx.png、目录结构.png 未保存到仓库；相关文字知识点已保留。

## 综合示例

### 综合示例：Java 应用镜像

```dockerfile
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY app.jar /app/app.jar
RUN useradd --system --uid 10001 appuser
USER appuser
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
```

示例要点：

- 运行时镜像不包含构建工具，减少体积和攻击面。
- 使用非 root 用户运行应用。
- 配置和密钥应在运行时注入，不写入镜像。

## 常见误区

- 在容器中保存唯一业务数据却不挂载卷
- 镜像使用 `latest` 导致发布不可追踪
- 以 root 用户运行所有服务
- 没有健康检查、日志采集和回滚版本

## 练习题

1. 如何让容器化 MySQL 的数据持久化？
2. 容器启动后立即退出如何排查？
3. 发布前的最小检查清单是什么？

## 参考答案

### 1. 如何让容器化 MySQL 的数据持久化？

将宿主卷或命名卷挂载到 MySQL 数据目录，并同时规划备份、权限和版本升级。

### 2. 容器启动后立即退出如何排查？

查看 `docker logs` 和退出码；确认 ENTRYPOINT、环境变量、端口、文件权限及前台主进程。

### 3. 发布前的最小检查清单是什么？

镜像版本固定；配置与密钥已注入；资源限制、健康检查、日志、迁移、备份和回滚方案已验证。

## 复习清单

- [ ] 能查看进程、端口、磁盘和日志
- [ ] 能构建并运行非 root 镜像
- [ ] 能正确使用卷与容器网络
- [ ] 能执行部署验证和回滚

## 原始资料索引

- Linux 基础：`运维部署/Linux基础.md`
- Docker 与项目部署：`运维部署/Docker与部署.md`

> 整理原则：正文保留原笔记知识点，统一标题层级与资源链接；新增示例、练习和答案用于检验理解。遇到版本相关 API 时，应以所用版本的官方文档为准。

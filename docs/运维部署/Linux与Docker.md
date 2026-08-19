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

## Linux 生产排查基础

### 用户、权限与 sudo

Linux 权限分为所有者、所属组和其他用户：

```bash
ls -l /srv/blog
stat /srv/blog/current
id deploy
groups deploy
```

常用权限：目录通常需要执行位才能进入，脚本需要读取和执行权限，私钥必须限制为当前用户可读。不要遇到权限问题就执行 `chmod -R 777`。

```bash
sudo chown -R deploy:blog /srv/blog
find /srv/blog -type d -exec chmod 750 {} \;
find /srv/blog -type f -exec chmod 640 {} \;
```

生产服务使用独立的不可登录用户运行。`sudoers` 只授权需要的命令，并通过 `visudo` 修改，避免语法错误导致 sudo 不可用。

### 进程与资源

```bash
ps -ef | grep java
top
free -h
df -h
df -i
du -xh /var/log | sort -h | tail
```

磁盘空间充足但仍不能创建文件时，检查 inode。CPU 高时确认是单进程持续占用还是系统负载；内存问题同时观察可用内存、swap、OOM 日志和应用堆设置。

```bash
journalctl -k | grep -i -E 'oom|killed process'
uptime
vmstat 1 5
```

### 网络与端口

```bash
ip addr
ip route
ss -lntp
curl -v http://127.0.0.1:8080/actuator/health
dig www.apple-sheep.com
```

排查顺序：域名是否解析、路由是否可达、端口是否监听、本机访问是否成功、防火墙与安全组是否放行、反向代理是否正确转发。

### 日志查询

```bash
journalctl -u applesheep.service --since "30 minutes ago" --no-pager
journalctl -u applesheep.service -f
tail -F /var/log/nginx/error.log
grep -R "trace-id" /var/log/applesheep/
```

日志应通过轮转限制大小。不要在故障时直接清空日志文件；先确认占用者、备份必要证据，再压缩或执行已验证的清理方案。

## systemd 服务管理

Java 应用可以由 systemd 管理：

```ini
[Unit]
Description=AppleSheep API
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=applesheep
Group=applesheep
WorkingDirectory=/srv/applesheep/current
EnvironmentFile=/etc/applesheep/api.env
ExecStart=/usr/bin/java -jar app.jar
Restart=on-failure
RestartSec=5
TimeoutStopSec=30
SuccessExitStatus=143
NoNewPrivileges=true

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now applesheep.service
sudo systemctl status applesheep.service
```

环境文件权限限制为服务用户和管理员可读。修改 unit 后必须 `daemon-reload`；重启前先确认新产物、配置和数据库迁移已经准备好。

## Docker 镜像原理

### 镜像层与构建上下文

Dockerfile 每个主要指令会产生缓存层。频繁变化的源码应放在依赖安装之后，以提高缓存命中率。构建上下文中的文件会发送给构建器，因此需要 `.dockerignore`：

```text
.git
node_modules
dist
logs
.env
*.md
```

秘密不能通过 `COPY` 或普通 `ARG` 写入镜像，因为历史层中可能仍可读取。构建时秘密使用 BuildKit secret，运行时由环境或 Secret 管理系统注入。

### 多阶段构建

```dockerfile
FROM eclipse-temurin:21-jdk AS build
WORKDIR /workspace
COPY mvnw pom.xml ./
COPY .mvn .mvn
RUN ./mvnw -q -DskipTests dependency:go-offline
COPY src src
RUN ./mvnw -q -DskipTests package

FROM eclipse-temurin:21-jre
RUN useradd --system --uid 10001 --create-home app
WORKDIR /app
COPY --from=build /workspace/target/*.jar app.jar
USER 10001
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
```

最终镜像只包含运行时和 jar，不包含编译工具。基础镜像固定到经过验证的版本，定期扫描漏洞并重建。

### ENTRYPOINT 与 CMD

- `ENTRYPOINT` 定义容器主要程序。
- `CMD` 提供默认参数，可在运行时覆盖。
- exec 格式 `[...]` 能让应用直接接收终止信号，利于优雅停机。

容器必须有前台主进程。用后台方式启动服务后 Shell 退出，会导致容器立即结束。

## 容器运行边界

### 网络

同一 Compose 网络中的容器使用服务名访问：

```text
jdbc:mysql://mysql:3306/applesheep
```

容器内的 `localhost` 指当前容器，不是宿主机也不是其他容器。只暴露用户真正需要访问的端口，数据库通常不应映射到公网接口。

### 数据卷

- 镜像层用于不可变程序。
- 命名卷适合数据库持久数据。
- bind mount 适合明确的宿主配置和开发目录。
- 临时数据写到容器可写层或 tmpfs，并设置大小限制。

卷不是备份。MySQL 备份还要考虑一致性、保留周期、异地存储和恢复演练。

### 资源限制与健康检查

```yaml
services:
  api:
    image: applesheep-api:1.4.0
    mem_limit: 768m
    cpus: 1.5
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://127.0.0.1:8080/actuator/health/readiness"]
      interval: 20s
      timeout: 3s
      retries: 3
      start_period: 40s
```

健康检查区分存活和就绪：存活失败说明进程需要重启；就绪失败说明暂时不应接收流量。检查不能执行过重查询。

## Docker Compose 实战

```yaml
services:
  api:
    image: ghcr.io/example/applesheep-api:1.4.0
    env_file: /etc/applesheep/api.env
    depends_on:
      mysql:
        condition: service_healthy
    networks: [backend]
    restart: unless-stopped

  mysql:
    image: mysql:8.4
    environment:
      MYSQL_DATABASE: applesheep
      MYSQL_USER: applesheep
      MYSQL_PASSWORD_FILE: /run/secrets/mysql_password
      MYSQL_ROOT_PASSWORD_FILE: /run/secrets/mysql_root_password
    volumes:
      - mysql-data:/var/lib/mysql
    secrets: [mysql_password, mysql_root_password]
    networks: [backend]
    healthcheck:
      test: ["CMD-SHELL", "mysqladmin ping -h 127.0.0.1 -uroot -p$$(cat /run/secrets/mysql_root_password)"]
      interval: 10s
      timeout: 5s
      retries: 10

networks:
  backend:

volumes:
  mysql-data:

secrets:
  mysql_password:
    file: /etc/applesheep/secrets/mysql_password
  mysql_root_password:
    file: /etc/applesheep/secrets/mysql_root_password
```

`depends_on` 只解决启动顺序和条件，应用仍必须处理数据库启动慢、运行中断线和重连。

## 容器安全基线

- 使用非 root 用户运行应用。
- 镜像只安装运行必需组件。
- 根文件系统尽量只读，显式挂载可写目录。
- 删除不需要的 Linux capabilities，启用 `no-new-privileges`。
- 不挂载 Docker Socket 到普通业务容器。
- 镜像使用确定版本和 digest，不长期依赖 `latest`。
- CI 生成 SBOM 并执行依赖与镜像漏洞扫描。
- 运行时配置和 Secret 不写入镜像、仓库与日志。

## 发布、验证与回滚

### 发布前

1. 构建产物与提交、版本号可以关联。
2. 测试和镜像扫描通过。
3. 配置、Secret 和外部依赖已验证。
4. 数据库迁移向前兼容并有备份。
5. 健康检查、资源限制和日志采集已配置。
6. 上一版本镜像仍可获取。

### 发布后

```bash
docker compose ps
docker compose logs --tail=200 api
curl -fsS https://api.example.com/actuator/health/readiness
```

还要验证一条核心业务链路，并观察错误率、P95 延迟、CPU、内存、重启次数和数据库连接。

### 回滚

回滚使用明确版本：

```bash
export APP_VERSION=1.3.2
docker compose pull api
docker compose up -d --no-deps api
```

如果新版本已经执行不可逆数据库迁移，单纯回滚镜像可能无法工作。因此推荐“扩展 -> 双版本兼容 -> 切换 -> 清理”的迁移方式。

## 常见故障定位

| 现象 | 优先检查 |
| --- | --- |
| 容器立即退出 | `docker logs`、退出码、ENTRYPOINT、配置 |
| 应用连不上数据库 | 服务名、网络、端口、数据库就绪、账号权限 |
| 宿主机端口不可访问 | `docker ps` 映射、监听地址、防火墙、安全组 |
| 文件权限错误 | 容器 UID/GID、卷所有者、SELinux 标签 |
| 磁盘持续增长 | 容器日志、镜像、构建缓存、数据库卷 |
| 频繁 OOM 重启 | 内存限制、JVM 堆、堆外内存、并发量 |

清理前先使用 `docker system df` 确认占用。不要在不清楚卷用途时运行会删除全部未使用卷的命令。

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
4. 为什么应用容器不能用 `localhost` 连接另一个数据库容器？
5. 为什么数据库迁移会影响应用镜像回滚？

## 参考答案

### 1. 如何让容器化 MySQL 的数据持久化？

将宿主卷或命名卷挂载到 MySQL 数据目录，并同时规划备份、权限和版本升级。

### 2. 容器启动后立即退出如何排查？

查看 `docker logs` 和退出码；确认 ENTRYPOINT、环境变量、端口、文件权限及前台主进程。

### 3. 发布前的最小检查清单是什么？

镜像版本固定；配置与密钥已注入；资源限制、健康检查、日志、迁移、备份和回滚方案已验证。

### 4. 为什么应用容器不能用 `localhost` 连接另一个数据库容器？

每个容器有独立网络命名空间，容器内 `localhost` 只指向自己。Compose 中应使用数据库服务名和容器端口，例如 `mysql:3306`，并确保两个服务加入同一网络。

### 5. 为什么数据库迁移会影响应用镜像回滚？

新版本可能删除、改名或改变旧版本依赖的字段，回滚旧镜像后就无法读写。应采用先扩展结构、双版本兼容、切换流量、最后清理旧结构的迁移方式。

## 复习清单

- [ ] 能查看进程、端口、磁盘和日志
- [ ] 能构建并运行非 root 镜像
- [ ] 能正确使用卷与容器网络
- [ ] 能执行部署验证和回滚

## 官方文档与延伸阅读

- [Linux man-pages](https://www.kernel.org/doc/man-pages/) - Linux 系统调用和常用接口参考。
- [systemd 官方文档](https://systemd.io/) - unit、服务生命周期、日志与项目手册入口。
- [Docker Documentation](https://docs.docker.com/) - 镜像、容器、网络、存储和安全。
- [Dockerfile Reference](https://docs.docker.com/reference/dockerfile/) - Dockerfile 指令与构建语义。
- [Docker Compose Reference](https://docs.docker.com/reference/compose-file/) - Compose 服务配置。
- [Docker Security](https://docs.docker.com/engine/security/) - daemon、容器与运行时安全。

## 原始资料索引

- Linux 基础：`运维部署/Linux基础.md`
- Docker 与项目部署：`运维部署/Docker与部署.md`

> 整理原则：正文保留原笔记知识点，统一标题层级与资源链接；新增示例、练习和答案用于检验理解。遇到版本相关 API 时，应以所用版本的官方文档为准。

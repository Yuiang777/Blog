const n=`# Docker 与项目部署

## 为什么用 Docker

- 不再强依赖服务器环境（系统/依赖/配置差异更少）
- 安装部署流程更短（镜像 + 容器）
- 适合项目阶段的多服务部署与复现

核心概念：

- 镜像（image）：包含应用 + 运行环境
- 容器（container）：镜像的运行实例

## 快速入门：部署 MySQL（示例）

\`\`\`bash
docker run -d \\
  --name mysql \\
  -p 3307:3306 \\
  -e TZ=Asia/Shanghai \\
  -e MYSQL_ROOT_PASSWORD=YOUR_PASSWORD \\
  mysql:8
\`\`\`

说明：

- \`-d\` 后台运行
- \`--name\` 容器名
- \`-p 宿主机端口:容器端口\` 端口映射
- \`-e KEY=VALUE\` 环境变量（由镜像决定）

## 常用命令速查

\`\`\`bash
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
\`\`\`

镜像与容器操作图示（参考）：

![](Docker操作镜像.png)

## 开机自启

\`\`\`bash
systemctl enable docker
docker update --restart=always <容器名或容器id>
\`\`\`

## Nginx 安装与目录结构（提示）

![](安装nginx.png)
![](目录结构.png)

`;export{n as default};

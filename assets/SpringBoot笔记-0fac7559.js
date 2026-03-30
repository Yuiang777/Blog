const n=`# Spring Boot 笔记

## 工程创建与分层

常见分层：

- controller：处理 HTTP 请求与响应
- service：业务逻辑
- repository/mapper：数据访问
- domain/entity/pojo：领域对象

## Web 开发基础

### @RestController vs @Controller

| 特性 | @RestController | @Controller |
| --- | --- | --- |
| 默认返回 | 直接写入响应体（JSON 等） | 视图解析（页面模板） |
| 是否需要 @ResponseBody | 不需要 | 需要时手动加 |

### HTTP 请求数据获取（Servlet）

\`\`\`java
String method = request.getMethod();
String url = request.getRequestURL().toString();
String uri = request.getRequestURI();
String ua = request.getHeader("User-Agent");
String param = request.getParameter("param");
String protocol = request.getProtocol();
\`\`\`

### HTTP 响应

基于 \`HttpServletResponse\`：

\`\`\`java
response.setStatus(200);
response.setHeader("Content-Type","application/json;charset=utf-8");
response.getWriter().write("hello,world");
\`\`\`

## 配置体系

### 配置文件（application.yml / properties）

- 环境区分：dev/test/prod
- 常见配置：server.port、spring.datasource、logging.level

### 自动配置与 Starter

- Starter：把依赖 + 自动配置打包成“开箱即用”
- 自动配置类：基于条件装配，按需生效

配套图：

![](Starter.jpg)
![](Starter配置步骤.jpg)
![](@Conditional.jpg)
![](自动配置类.jpg)

## AOP

核心概念：切面、连接点、切点、通知、织入。

![](AOP.jpg)
![](AOP核心概念.jpg)
![](AOP执行流程.jpg)
![](通知类型.jpg)
![](AOP通知顺序.jpg)

常用场景：

- 日志与链路追踪
- 权限校验
- 事务与异常统一处理

## 事务管理

- 常用注解：\`@Transactional\`
- 注意：事务边界通常放在 service 层

## 登录校验与拦截

常见三层：

- Filter：Servlet 级别（更底层）
- Interceptor：Spring MVC 级别（更常用）
- AOP：方法级别切面

配套图：

![](令牌校验.jpg)
![](拦截路径.png)
![](拦截器-拦截路径.jpg)
![](过滤器链.jpg)
![](过滤器和拦截器的区别和流程.jpg)

## 异常处理

推荐做法：

- 统一异常处理：返回统一结构（code/msg/data）
- 区分业务异常与系统异常

## 文件上传与下载（要点）

- 上传：multipart/form-data
- 下载：设置 Content-Type 与 Content-Disposition

![](资源上传与下载.jpg)

## Maven 进阶（要点）

- 依赖管理：依赖传递、版本冲突处理
- 多模块：聚合、继承、父子工程

![](聚合.jpg)
![](继承.jpg)
![](继承实现.jpg)
![](版本锁定.jpg)
![](Maven私服.jpg)

## HTTP 状态码（速记）

- 2xx：成功
- 3xx：重定向
- 4xx：客户端错误
- 5xx：服务端错误

![](响应类型.png)

## ThreadLocal（提示）

常用于：

- 用户上下文（需要注意清理，避免线程复用导致污染）

![](ThreadLocal.jpg)

`;export{n as default};

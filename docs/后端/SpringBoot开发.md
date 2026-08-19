# Spring Boot 开发完整笔记

> 将 Spring 容器、Bean 生命周期、Spring Boot 配置、Web 请求、AOP、拦截器和工程分层放在同一条业务开发路径中。

| 项目 | 说明 |
| --- | --- |
| 难度 | 业务开发 |
| 适合读者 | 具备 Java 基础、希望建立 Spring IoC 到 Web 业务完整认知的开发者 |
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

- 理解 IoC、DI、BeanDefinition 与容器扩展点
- 掌握 Spring Boot 配置和 Web 接口开发
- 理解 AOP、过滤器、拦截器和异常处理边界
- 能够组织 Controller、Service、Repository 与测试

## 知识地图

1. 容器：Bean 注册、装配与生命周期
2. Boot：自动配置与外部化配置
3. Web：参数、响应、校验与异常
4. 横切能力：AOP、过滤器、拦截器、安全

## 核心内容



### Spring 容器与 Bean

#### IoC / DI（一句话）

- IoC：把对象创建与管理交给容器
- DI：容器把依赖注入到对象里

#### BeanDefinition 与 BeanFactory

##### BeanDefinition

Bean 的“说明书”（元信息），描述：

- 类型
- 作用域（singleton/prototype）
- 依赖关系
- 初始化/销毁回调

##### DefaultListableBeanFactory（常用实现）

内部常见结构（速记）：

- `beanDefinitionMap`：保存所有 BeanDefinition
- 单例缓存：
  - `singletonObjects`：完全初始化的单例
  - `earlySingletonObjects`：早期单例（解决循环依赖）
  - `singletonFactories`：单例工厂（AOP 代理等场景）

#### 运行时动态注册与删除（提示）

动态注册：把 BeanDefinition 注册进容器。

动态删除：Spring 不允许删除已创建的单例对象，但可以删除 BeanDefinition，使其不再能被获取与注入。

```java
public void removeBean(String beanName) {
  DefaultListableBeanFactory beanFactory =
    (DefaultListableBeanFactory) context.getAutowireCapableBeanFactory();
  if (beanFactory.containsBeanDefinition(beanName)) {
    beanFactory.removeBeanDefinition(beanName);
  }
}
```

#### ApplicationContext（更高级容器）

在 BeanFactory 基础上提供：

- 国际化
- 事件机制
- 资源加载
- 自动装配与更多扩展点

#### 扩展点（常用）

- BeanPostProcessor：Bean 实例级增强（AOP、注解处理等）
- BeanFactoryPostProcessor：BeanDefinition 级增强（影响实例化前的定义）

---

### Spring Boot Web 与工程实践

#### 工程创建与分层

常见分层：

- controller：处理 HTTP 请求与响应
- service：业务逻辑
- repository/mapper：数据访问
- domain/entity/pojo：领域对象

#### Web 开发基础

##### @RestController vs @Controller

| 特性 | @RestController | @Controller |
| --- | --- | --- |
| 默认返回 | 直接写入响应体（JSON 等） | 视图解析（页面模板） |
| 是否需要 @ResponseBody | 不需要 | 需要时手动加 |

##### HTTP 请求数据获取（Servlet）

```java
String method = request.getMethod();
String url = request.getRequestURL().toString();
String uri = request.getRequestURI();
String ua = request.getHeader("User-Agent");
String param = request.getParameter("param");
String protocol = request.getProtocol();
```

##### HTTP 响应

基于 `HttpServletResponse`：

```java
response.setStatus(200);
response.setHeader("Content-Type","application/json;charset=utf-8");
response.getWriter().write("hello,world");
```

#### 配置体系

##### 配置文件（application.yml / properties）

- 环境区分：dev/test/prod
- 常见配置：server.port、spring.datasource、logging.level

##### 自动配置与 Starter

- Starter：把依赖 + 自动配置打包成“开箱即用”
- 自动配置类：基于条件装配，按需生效

配套图：


#### AOP

核心概念：切面、连接点、切点、通知、织入。


常用场景：

- 日志与链路追踪
- 权限校验
- 事务与异常统一处理

#### 事务管理

- 常用注解：`@Transactional`
- 注意：事务边界通常放在 service 层

#### 登录校验与拦截

常见三层：

- Filter：Servlet 级别（更底层）
- Interceptor：Spring MVC 级别（更常用）
- AOP：方法级别切面

配套图：


#### 异常处理

推荐做法：

- 统一异常处理：返回统一结构（code/msg/data）
- 区分业务异常与系统异常

#### 文件上传与下载（要点）

- 上传：multipart/form-data
- 下载：设置 Content-Type 与 Content-Disposition


#### Maven 进阶（要点）

- 依赖管理：依赖传递、版本冲突处理
- 多模块：聚合、继承、父子工程


#### HTTP 状态码（速记）

- 2xx：成功
- 3xx：重定向
- 4xx：客户端错误
- 5xx：服务端错误


#### ThreadLocal（提示）

常用于：

- 用户上下文（需要注意清理，避免线程复用导致污染）


> 图片说明：原笔记引用的 Starter.jpg、Starter配置步骤.jpg、@Conditional.jpg、自动配置类.jpg、AOP.jpg、AOP核心概念.jpg等 22 张 未保存到仓库；相关文字知识点已保留。

## 一次 Web 请求的完整链路

```text
客户端
  -> Servlet Filter
  -> DispatcherServlet
  -> HandlerInterceptor.preHandle
  -> Controller
  -> Application Service
  -> Repository / 外部服务
  -> HandlerInterceptor.afterCompletion
  -> Filter 返回响应
```

- Filter 属于 Servlet 规范，适合请求包装、CORS、通用安全头和 trace ID。
- Interceptor 属于 Spring MVC，能获取 Handler，适合登录上下文、接口权限和耗时统计。
- AOP 围绕 Spring Bean 方法，适合审计、事务和稳定的横切逻辑。
- 业务规则放在 Service 或领域对象中，不能散落在 Filter 和 AOP。

每一层只承担清晰职责，排错时才能判断请求在哪一阶段失败。

## 接口设计与参数校验

### 请求对象

```java
public record CreateArticleRequest(
    @NotBlank @Size(max = 120) String title,
    @NotBlank String content,
    @NotEmpty Set<@NotBlank String> tags,
    @NotNull ArticleVisibility visibility
) {}

@PostMapping("/articles")
public ResponseEntity<ArticleResponse> create(
        @Valid @RequestBody CreateArticleRequest request,
        @AuthenticationPrincipal LoginUser user) {
    ArticleResponse response = articleApplicationService.create(request, user);
    return ResponseEntity.status(HttpStatus.CREATED).body(response);
}
```

Bean Validation 负责格式和基本约束；“标签是否存在”“用户能否发布到该专栏”等需要查询数据的规则放在业务层。

### 分组校验要谨慎

创建和修改差异很大时，优先使用不同 DTO，而不是在一个巨型 DTO 上堆大量校验分组。独立对象能让接口契约更明确，也避免客户端修改不允许变更的字段。

### 统一异常响应

```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<ApiError> handleValidation(MethodArgumentNotValidException ex) {
        var fields = ex.getBindingResult().getFieldErrors().stream()
            .map(error -> new FieldErrorItem(error.getField(), error.getDefaultMessage()))
            .toList();
        return ResponseEntity.badRequest()
            .body(ApiError.validation("VALIDATION_FAILED", fields));
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    ResponseEntity<ApiError> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(ApiError.of("RESOURCE_NOT_FOUND", ex.getMessage()));
    }
}
```

不要把堆栈、SQL 或内部类名返回给客户端。响应保留稳定错误码和 trace ID，详细异常写入服务端日志。

## 配置体系与环境隔离

### 类型安全配置

```java
@ConfigurationProperties(prefix = "storage")
@Validated
public record StorageProperties(
    @NotBlank String endpoint,
    @NotBlank String bucket,
    @DurationUnit(ChronoUnit.SECONDS) Duration timeout
) {}
```

```yaml
storage:
  endpoint: ${STORAGE_ENDPOINT}
  bucket: ${STORAGE_BUCKET:applesheep-public}
  timeout: 5s
```

相比散落的 `@Value`，`@ConfigurationProperties` 更容易校验、测试和发现配置项。启动时缺少关键配置应直接失败，而不是等到第一次请求才报错。

### Profile 的边界

Profile 用于少量环境差异，不应用于维护完全不同的业务代码。推荐：

- 默认配置保留所有环境共享项。
- 环境变量或部署配置覆盖地址、容量和开关。
- 密码、令牌和私钥由 Secret 管理系统注入。
- 生产环境禁止启用调试端点和详细错误响应。

## 事务设计

### 事务边界放在哪里

事务通常放在完成一个业务用例的 public Service 方法上：

```java
@Transactional
public Long publishArticle(PublishArticleCommand command, LoginUser user) {
    permissionService.checkPublish(user, command.categoryId());
    Article article = Article.create(command, user.id(), clock.instant());
    articleRepository.insert(article);
    outboxRepository.append(ArticlePublished.from(article));
    return article.getId();
}
```

数据库写入和 Outbox 事件处于同一事务。外部 HTTP、邮件和消息发送不应长时间占用数据库事务。

### 常见失效原因

- 同类内部调用绕过 Spring 代理，`@Transactional` 不生效。
- 方法不是可代理的 public 方法，或对象不是 Spring Bean。
- 捕获异常后不再抛出，事务按成功提交。
- 默认只对运行时异常回滚，受检异常需要明确策略。
- 异步线程和新建线程不会自动继承原事务。

### 传播行为

`REQUIRED` 是常用默认值：有事务就加入，没有就新建。`REQUIRES_NEW` 会挂起外层事务并创建新事务，只适合确实需要独立提交的场景，例如某些审计记录；滥用会导致外层失败但部分数据已提交。

### 乐观锁

```sql
UPDATE article
SET title = ?, content = ?, version = version + 1
WHERE id = ? AND version = ?;
```

受影响行数为零时返回并发冲突。不要在读取后无条件覆盖其他用户刚刚提交的修改。

## 认证与授权

### 认证流程

1. 用户登录，服务校验凭证。
2. 签发短期访问令牌，必要时配合长期刷新令牌。
3. 请求经过安全过滤器，解析并验证令牌。
4. 将最小身份信息放入 `SecurityContext`。
5. Controller 和 Service 根据身份与资源执行授权。

令牌验证至少检查签名、过期时间、签发者和受众。不能只把 JWT Base64 解码后就信任其中内容。

### 授权必须靠近资源

```java
public ArticleResponse update(Long articleId, UpdateArticleRequest request, LoginUser user) {
    Article article = articleRepository.require(articleId);
    if (!article.canEditBy(user.id(), user.roles())) {
        throw new ForbiddenException("无权修改此文章");
    }
    // ...
}
```

路由级角色判断无法覆盖“只能修改自己的文章”这类资源权限，因此 Service 必须再次校验。

### Web 安全基线

- 密码使用 BCrypt、Argon2 等专用算法哈希。
- Cookie 会话启用 `HttpOnly`、`Secure` 和合适的 `SameSite`。
- Cookie 认证的写请求需要 CSRF 防护。
- CORS 使用明确来源白名单，不把凭证与任意来源组合。
- 上传文件校验大小、类型、扩展名和存储路径，不直接信任原文件名。
- 对登录、搜索和高成本接口实施限流。

## 数据访问与性能

### 避免 N+1

列表查询不要对每一行继续查询作者、标签或统计。可通过 join、批量查询、专用读模型或缓存解决。开启 SQL 日志只用于开发排查，生产应采集慢 SQL 和汇总指标，避免泄露参数。

### 分页

浅分页可以使用 offset；深分页更适合基于稳定排序键的游标：

```sql
SELECT id, title, published_at
FROM article
WHERE status = 'PUBLISHED'
  AND (published_at, id) < (:lastPublishedAt, :lastId)
ORDER BY published_at DESC, id DESC
LIMIT :size;
```

排序必须稳定且索引匹配。客户端 page size 设置上限，不能一次请求全部数据。

### 缓存

缓存适合读多写少、允许短暂旧数据的内容。设计时明确：

- key 包含哪些业务维度和权限范围。
- TTL 与主动失效策略。
- 空值缓存与随机过期，避免穿透和雪崩。
- 缓存不可用时是回源、降级还是拒绝。

使用 `@Cacheable` 仍要理解代理调用、序列化和一致性，不应把缓存注解当作无成本优化。

## 异步与定时任务

### `@Async` 注意事项

- 配置独立、可观测且有界的线程池。
- 明确队列满时的拒绝策略。
- 异步方法异常不会自动返回给原请求。
- MDC、登录身份和事务上下文不会天然传播。
- 关键任务不能只存在内存队列，进程重启会丢失。

```java
@Bean
ThreadPoolTaskExecutor notificationExecutor() {
    var executor = new ThreadPoolTaskExecutor();
    executor.setCorePoolSize(4);
    executor.setMaxPoolSize(8);
    executor.setQueueCapacity(200);
    executor.setThreadNamePrefix("notification-");
    executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
    return executor;
}
```

### 定时任务

多实例部署时，普通 `@Scheduled` 会在每个实例各执行一次。需要单实例语义时使用数据库锁、Redis 锁或任务调度平台，并设置锁超时、幂等和补偿扫描。

## 可观测性与健康检查

### Actuator

推荐暴露经过控制的健康、指标和信息端点。健康检查区分：

- liveness：应用进程是否需要重启。
- readiness：应用是否已经准备好接收流量。

数据库短暂不可用可能影响 readiness，但不一定应该让容器无限重启。敏感端点必须鉴权或只在内网开放。

### 日志与追踪

结构化日志至少包含时间、级别、服务名、trace ID、错误码和必要业务键。禁止记录密码、令牌、完整请求体和个人敏感信息。

关键指标：请求量、错误率、P95/P99 延迟、线程池队列、连接池等待、GC、外部依赖耗时和业务成功率。

## 测试策略

### 测试金字塔

| 类型 | 重点 | 常用方式 |
| --- | --- | --- |
| 单元测试 | 纯业务规则、边界值 | JUnit、Mockito 少量替身 |
| Slice 测试 | MVC、序列化、Mapper | `@WebMvcTest`、`@DataJpaTest` |
| 集成测试 | 事务、数据库、消息 | `@SpringBootTest`、Testcontainers |
| 契约测试 | 服务输入输出兼容 | Provider / Consumer Contract |
| 端到端测试 | 少量核心用户路径 | 真实部署环境或预发布环境 |

### Controller 测试示例

```java
@WebMvcTest(ArticleController.class)
class ArticleControllerTest {
    @Autowired MockMvc mvc;
    @MockBean ArticleApplicationService service;

    @Test
    void shouldRejectBlankTitle() throws Exception {
        mvc.perform(post("/articles")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""{"title":"","content":"body","tags":["java"],"visibility":"PUBLIC"}"""))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.code").value("VALIDATION_FAILED"));
    }
}
```

测试不仅覆盖成功路径，还要包含无权限、不存在、并发冲突、重复请求、依赖超时和事务回滚。

## 生产发布清单

- 使用受支持的 JDK 与 Spring Boot 版本。
- 构建产物与 Git 提交、配置版本可追踪。
- JVM 内存与容器限制匹配，并预留堆外空间。
- 数据库迁移向前兼容，发布前备份并验证回滚。
- readiness、优雅停机和连接池超时已配置。
- Secret 未进入仓库、镜像和日志。
- 核心接口的错误率、延迟和业务指标有告警。
- 灰度发布后再逐步放量，不一次替换全部实例。

## 综合示例

### 综合示例：规范的查询接口

```java
@RestController
@RequestMapping("/api/articles")
class ArticleController {
    private final ArticleService articleService;

    ArticleController(ArticleService articleService) {
        this.articleService = articleService;
    }

    @GetMapping("/{id}")
    ResponseEntity<ArticleView> find(@PathVariable long id) {
        return articleService.find(id)
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
```

示例要点：

- 优先使用构造器注入，使依赖显式且便于测试。
- Controller 负责协议转换，业务规则放在 Service。
- 不存在的资源返回 404，不使用 200 携带错误字符串。

## 常见误区

- 字段注入让依赖隐式且不利于单元测试
- Controller 直接访问数据库并堆叠业务逻辑
- 在同类内部调用 `@Transactional` 方法并期待代理生效
- 把过滤器、拦截器、AOP 的使用边界混为一谈

## 练习题

1. 为创建文章接口设计请求对象和校验。
2. 过滤器和拦截器的主要区别是什么？
3. 为什么推荐构造器注入？
4. 为什么同一个 Bean 内部调用事务方法可能不生效？
5. 多实例部署时如何避免 `@Scheduled` 任务重复执行？

## 参考答案

### 1. 为创建文章接口设计请求对象和校验。

使用独立 DTO；标题 `@NotBlank` 且限制长度；正文必填；使用 `@Valid`，并统一返回字段级错误。

### 2. 过滤器和拦截器的主要区别是什么？

过滤器属于 Servlet 规范，围绕请求链；拦截器属于 Spring MVC，可获取 Handler，更适合登录、权限和控制器调用前后逻辑。

### 3. 为什么推荐构造器注入？

依赖不可缺失、可声明为 final、对象在创建后即完整，也更容易在测试中直接传入替身。

### 4. 为什么同一个 Bean 内部调用事务方法可能不生效？

Spring 事务通常由代理拦截，从对象内部使用 `this` 调用不会经过代理，因此事务切面无法执行。应重新划分业务边界、把方法移动到独立 Bean，或通过明确的事务模板执行。

### 5. 多实例部署时如何避免 `@Scheduled` 任务重复执行？

任务本身先实现幂等，再使用数据库锁、Redis 锁或专用调度平台保证同一时刻只有一个实例取得执行权；锁必须设置租约、续期或超时，并监控任务漏跑和执行失败。

## 复习清单

- [ ] 能说明 Bean 创建与依赖注入过程
- [ ] 能设计统一响应和异常处理
- [ ] 能区分过滤器、拦截器和 AOP
- [ ] 能正确划分事务与业务边界

## 官方文档与延伸阅读

- [Spring Boot Reference](https://docs.spring.io/spring-boot/reference/) - 配置、Web、Actuator 与生产能力。
- [Spring Framework Core](https://docs.spring.io/spring-framework/reference/core.html) - IoC、Bean、AOP 和资源管理。
- [Spring Transaction Management](https://docs.spring.io/spring-framework/reference/data-access/transaction.html) - 事务抽象与传播行为。
- [Spring MVC](https://docs.spring.io/spring-framework/reference/web/webmvc.html) - 请求处理、校验和异常响应。
- [Spring Security Reference](https://docs.spring.io/spring-security/reference/) - 认证、授权和 Web 安全。
- [Testcontainers for Java](https://java.testcontainers.org/) - 使用真实依赖进行集成测试。

## 原始资料索引

- Spring 容器与 Bean：`后端/SpringBoot/Spring容器与Bean.md`
- Spring Boot Web 与工程实践：`后端/SpringBoot/SpringBoot笔记.md`

> 整理原则：正文保留原笔记知识点，统一标题层级与资源链接；新增示例、练习和答案用于检验理解。遇到版本相关 API 时，应以所用版本的官方文档为准。

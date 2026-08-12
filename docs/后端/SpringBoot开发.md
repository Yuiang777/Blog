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

## 参考答案

### 1. 为创建文章接口设计请求对象和校验。

使用独立 DTO；标题 `@NotBlank` 且限制长度；正文必填；使用 `@Valid`，并统一返回字段级错误。

### 2. 过滤器和拦截器的主要区别是什么？

过滤器属于 Servlet 规范，围绕请求链；拦截器属于 Spring MVC，可获取 Handler，更适合登录、权限和控制器调用前后逻辑。

### 3. 为什么推荐构造器注入？

依赖不可缺失、可声明为 final、对象在创建后即完整，也更容易在测试中直接传入替身。

## 复习清单

- [ ] 能说明 Bean 创建与依赖注入过程
- [ ] 能设计统一响应和异常处理
- [ ] 能区分过滤器、拦截器和 AOP
- [ ] 能正确划分事务与业务边界

## 原始资料索引

- Spring 容器与 Bean：`后端/SpringBoot/Spring容器与Bean.md`
- Spring Boot Web 与工程实践：`后端/SpringBoot/SpringBoot笔记.md`

> 整理原则：正文保留原笔记知识点，统一标题层级与资源链接；新增示例、练习和答案用于检验理解。遇到版本相关 API 时，应以所用版本的官方文档为准。

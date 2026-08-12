import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const docsRoot = path.join(root, 'docs')
const archiveRoot = path.join(root, 'notes-archive', 'legacy-docs')

const lines = (...values) => values.flat().join('\n')
const exercise = (question, answer) => ({ question, answer })
const cleanMarkdown = value => `${value
  .replace(/^[ \t]+/gm, indent => indent.replace(/\t/g, '    '))
  .replace(/[ \t]+$/gm, '')
  .replace(/\n+$/g, '')}\n`

const topics = [
  {
    title: '前端开发完整笔记',
    output: '前端/前端开发.md',
    level: '入门到进阶',
    audience: '需要系统学习 HTML、CSS、JavaScript、Vue 与 Element Plus 的开发者',
    intro: '从浏览器基础到 Vue 工程化，按“页面结构 → 编程能力 → 组件化 → 工程实践”的顺序组织。阅读时先理解原理，再运行示例，最后完成练习。',
    goals: ['掌握 HTML 语义、CSS 盒模型与常用布局', '理解 JavaScript 数据、函数、DOM、异步请求', '能够创建 Vue 工程并组织组件、路由和状态', '能够使用 Element Plus 完成表单校验与常见页面'],
    map: ['HTML / CSS：页面结构与视觉布局', 'JavaScript：数据、行为与浏览器 API', 'Vue：响应式、组件、路由与工程化', 'Element Plus：业务组件与表单规范'],
    sources: [
      ['前端/前端总笔记.md', 'HTML、CSS 与 JavaScript 基础'],
      ['前端/Vue工程化.md', 'Vue 工程化与应用开发'],
      ['前端/ElementPlus.md', 'Element Plus 表单实践']
    ],
    demoTitle: '综合示例：可筛选的任务列表',
    demoLanguage: 'vue',
    demo: lines(
      '<script setup>',
      "import { computed, ref } from 'vue'",
      '',
      "const keyword = ref('')",
      'const tasks = ref([',
      "  { id: 1, title: '整理 Vue 笔记', done: true },",
      "  { id: 2, title: '完成表单练习', done: false }",
      '])',
      'const visibleTasks = computed(() =>',
      '  tasks.value.filter(task => task.title.includes(keyword.value))',
      ')',
      '</script>',
      '',
      '<template>',
      '  <main class="task-page">',
      '    <label>搜索任务 <input v-model.trim="keyword" /></label>',
      '    <ul>',
      '      <li v-for="task in visibleTasks" :key="task.id">',
      '        <input v-model="task.done" type="checkbox" />',
      '        <span :class="{ done: task.done }">{{ task.title }}</span>',
      '      </li>',
      '    </ul>',
      '  </main>',
      '</template>',
      '',
      '<style scoped>',
      '.task-page { max-width: 40rem; margin: 2rem auto; }',
      '.done { color: #66716d; text-decoration: line-through; }',
      '</style>'
    ),
    demoNotes: ['使用 `computed` 表达派生数据，不在模板中堆叠复杂筛选逻辑。', '`v-for` 必须使用稳定且唯一的 `key`。', '`v-model.trim` 在写入状态前移除首尾空格。'],
    mistakes: ['只记框架 API，却忽略 HTML 语义和 CSS 布局基础', '在模板中执行有副作用或成本很高的函数', '把所有状态写在一个组件中，导致职责混乱', '只依赖组件库默认校验，不处理接口错误和提交状态'],
    exercises: [
      exercise('为任务列表增加“全部 / 未完成 / 已完成”筛选。', '增加 `status` 状态，并让 `computed` 同时根据关键词和状态过滤。不要修改原数组。'),
      exercise('为什么不能使用数组下标作为可变列表的 `key`？', '插入、删除或排序后下标会变化，Vue 可能复用错误的 DOM 与组件状态；应使用业务唯一标识。'),
      exercise('为新增任务表单设计三条校验规则。', '标题必填；去除空格后长度为 2～50；提交期间禁用按钮并处理服务端重复标题错误。')
    ],
    checklist: ['能独立完成响应式页面布局', '能解释事件循环与异步请求流程', '能拆分 Vue 组件并设计 props / emits', '能完成路由、请求封装、表单校验和错误状态']
  },
  {
    title: 'Java 开发完整笔记', output: '后端/Java开发.md', level: '基础到进阶',
    audience: '需要系统复习 Java 语法、集合、面向对象、JVM、反射与动态代理的开发者',
    intro: '以可运行代码为主线，将语法、对象模型、集合、异常、并发基础与运行时机制串联起来。学习时优先掌握常用能力，再进入 JVM 和动态代理。',
    goals: ['掌握类型系统、面向对象、集合与异常处理', '理解泛型、函数式接口和常用标准库', '理解 JVM、类加载、反射和动态代理', '能写出边界明确、可测试的 Java 代码'],
    map: ['语言基础：类型、控制流、方法', '对象模型：封装、继承、多态、接口', '常用能力：集合、泛型、异常、IO', '运行机制：JVM、反射、代理'],
    sources: [['后端/java/Java基础.md', 'Java 语言基础与常用 API'], ['后端/java/Java进阶.md', 'JVM、反射与动态代理']],
    demoTitle: '综合示例：按分类统计有效订单金额', demoLanguage: 'java',
    demo: lines(
      'record Order(String category, long amountInCent, boolean paid) {}',
      '',
      'public static Map<String, Long> summarize(List<Order> orders) {',
      '    if (orders == null) {',
      '        return Map.of();',
      '    }',
      '    return orders.stream()',
      '        .filter(Objects::nonNull)',
      '        .filter(Order::paid)',
      '        .filter(order -> order.amountInCent() > 0)',
      '        .collect(Collectors.groupingBy(',
      '            Order::category,',
      '            Collectors.summingLong(Order::amountInCent)',
      '        ));',
      '}'
    ),
    demoNotes: ['金额使用整数分保存，避免浮点精度问题。', '先处理空集合、空元素和非法金额，再进行聚合。', '只在数据转换清晰时使用 Stream；复杂分支可以使用普通循环。'],
    mistakes: ['用 `==` 比较字符串内容', '修改作为 `HashMap` 键的可变对象', '捕获 `Exception` 后静默忽略', '在不了解线程安全性的情况下共享可变集合'],
    exercises: [exercise('实现一个不可变的值对象 `Money`。', '字段使用 `final`；在构造阶段校验币种和金额；加减运算返回新对象；实现基于值的 `equals` 与 `hashCode`。'), exercise('解释 `HashMap` 为什么要求键的哈希值保持稳定。', '键进入桶后依赖哈希定位；若键的字段变化导致哈希变化，原条目可能无法再被正确查找。'), exercise('什么时候使用 JDK 动态代理，什么时候使用 CGLIB？', '有稳定接口时优先 JDK 动态代理；无接口且允许继承时可用 CGLIB。`final` 类或方法不能被 CGLIB 覆盖。')],
    checklist: ['能正确选择集合类型', '能解释 equals / hashCode 契约', '能设计异常边界和资源释放', '能说明 JVM、反射与代理的基本工作方式']
  },
  {
    title: 'Go 开发完整笔记', output: '后端/Go开发.md', level: '基础到实战',
    audience: '从零学习 Go，并希望掌握工程结构、并发和常用标准库的开发者',
    intro: '围绕 Go 的简洁类型系统、组合式设计和并发模型展开。原始长笔记被纳入统一层级，建议配合 `go test` 和竞态检测逐章练习。',
    goals: ['掌握变量、函数、结构体、接口和错误处理', '理解切片、Map、指针和值语义', '掌握 goroutine、channel、context 和同步工具', '能够组织模块、编写测试并使用常用标准库'],
    map: ['语法与数据结构', '结构体、方法与接口', '错误、文件、网络与时间', '并发、测试与工程实践'],
    sources: [['后端/GO笔记/Go笔记.md', 'Go 语言与工程实践']],
    demoTitle: '综合示例：可取消的并发任务', demoLanguage: 'go',
    demo: lines(
      'func run(ctx context.Context, jobs <-chan int) <-chan int {',
      '    results := make(chan int)',
      '    go func() {',
      '        defer close(results)',
      '        for {',
      '            select {',
      '            case <-ctx.Done():',
      '                return',
      '            case job, ok := <-jobs:',
      '                if !ok { return }',
      '                results <- job * job',
      '            }',
      '        }',
      '    }()',
      '    return results',
      '}'
    ),
    demoNotes: ['生产者负责关闭自己创建的 channel。', '`context` 用于取消和超时，不用于传递普通业务参数。', '消费 channel 时要检查 `ok`，区分零值与关闭状态。'],
    mistakes: ['忽略错误或只打印后继续运行', '对 nil Map 直接写入', '并发读写普通 Map', '启动 goroutine 后没有退出、取消或回收路径'],
    exercises: [exercise('把示例扩展为固定数量的 worker pool。', '创建 N 个 worker 共同读取 jobs；使用 WaitGroup 等待 worker 结束，再由单独 goroutine 关闭 results。'), exercise('切片的长度和容量有什么区别？', '长度是当前可访问元素数；容量是从起始位置到底层数组末尾的空间。append 超出容量会分配新数组。'), exercise('如何验证并发代码是否存在数据竞争？', '运行 `go test -race ./...`，同时让测试覆盖多 goroutine 的读写路径。')],
    checklist: ['能解释值、指针与接口语义', '能正确处理 error 并保留上下文', '能设计可退出的并发流程', '能编写表驱动测试并运行 race detector']
  },
  {
    title: 'Spring Boot 开发完整笔记', output: '后端/SpringBoot开发.md', level: '业务开发',
    audience: '具备 Java 基础、希望建立 Spring IoC 到 Web 业务完整认知的开发者',
    intro: '将 Spring 容器、Bean 生命周期、Spring Boot 配置、Web 请求、AOP、拦截器和工程分层放在同一条业务开发路径中。',
    goals: ['理解 IoC、DI、BeanDefinition 与容器扩展点', '掌握 Spring Boot 配置和 Web 接口开发', '理解 AOP、过滤器、拦截器和异常处理边界', '能够组织 Controller、Service、Repository 与测试'],
    map: ['容器：Bean 注册、装配与生命周期', 'Boot：自动配置与外部化配置', 'Web：参数、响应、校验与异常', '横切能力：AOP、过滤器、拦截器、安全'],
    sources: [['后端/SpringBoot/Spring容器与Bean.md', 'Spring 容器与 Bean'], ['后端/SpringBoot/SpringBoot笔记.md', 'Spring Boot Web 与工程实践']],
    demoTitle: '综合示例：规范的查询接口', demoLanguage: 'java',
    demo: lines(
      '@RestController',
      '@RequestMapping("/api/articles")',
      'class ArticleController {',
      '    private final ArticleService articleService;',
      '',
      '    ArticleController(ArticleService articleService) {',
      '        this.articleService = articleService;',
      '    }',
      '',
      '    @GetMapping("/{id}")',
      '    ResponseEntity<ArticleView> find(@PathVariable long id) {',
      '        return articleService.find(id)',
      '            .map(ResponseEntity::ok)',
      '            .orElseGet(() -> ResponseEntity.notFound().build());',
      '    }',
      '}'
    ),
    demoNotes: ['优先使用构造器注入，使依赖显式且便于测试。', 'Controller 负责协议转换，业务规则放在 Service。', '不存在的资源返回 404，不使用 200 携带错误字符串。'],
    mistakes: ['字段注入让依赖隐式且不利于单元测试', 'Controller 直接访问数据库并堆叠业务逻辑', '在同类内部调用 `@Transactional` 方法并期待代理生效', '把过滤器、拦截器、AOP 的使用边界混为一谈'],
    exercises: [exercise('为创建文章接口设计请求对象和校验。', '使用独立 DTO；标题 `@NotBlank` 且限制长度；正文必填；使用 `@Valid`，并统一返回字段级错误。'), exercise('过滤器和拦截器的主要区别是什么？', '过滤器属于 Servlet 规范，围绕请求链；拦截器属于 Spring MVC，可获取 Handler，更适合登录、权限和控制器调用前后逻辑。'), exercise('为什么推荐构造器注入？', '依赖不可缺失、可声明为 final、对象在创建后即完整，也更容易在测试中直接传入替身。')],
    checklist: ['能说明 Bean 创建与依赖注入过程', '能设计统一响应和异常处理', '能区分过滤器、拦截器和 AOP', '能正确划分事务与业务边界']
  },
  {
    title: 'Java AI 应用完整笔记', output: '后端/JavaAI应用.md', level: '专项实践',
    audience: '希望使用 Java 构建大模型、RAG 与向量检索应用的开发者',
    intro: '从模型调用到 RAG 数据链路，统一整理 Agent、文档解析、切分、嵌入、向量存储与检索增强生成。内容强调可观测性、引用和失败降级。',
    goals: ['理解提示词、模型、工具和 Agent 的职责', '掌握 RAG 的加载、切分、嵌入、检索与回答流程', '理解向量存储抽象与实现差异', '能够评估检索质量并避免无依据回答'],
    map: ['模型调用与提示词', '文档加载与切分', 'Embedding 与 Vector Store', '检索、上下文注入与答案评估'],
    sources: [['后端/AI/JavaAI应用开发.md', 'Agent 与 RAG 应用'], ['后端/java/stream流.md', 'Vector Store 补充']],
    demoTitle: '综合示例：带来源约束的 RAG 提示词', demoLanguage: 'java',
    demo: lines(
      'String context = documents.stream()',
      '    .map(doc -> "来源: " + doc.getMetadata().get("source") + "\\n" + doc.getText())',
      '    .collect(Collectors.joining("\\n\\n---\\n\\n"));',
      '',
      'String prompt = """',
      '    只根据给定资料回答。资料不足时明确说明不知道。',
      '    回答末尾列出使用的来源。',
      '',
      '    资料：',
      '    %s',
      '',
      '    问题：%s',
      '    """.formatted(context, question);'
    ),
    demoNotes: ['文档元数据必须保留来源、页码或章节，便于引用。', '“只能根据资料回答”是约束，不是质量保证，仍需评测。', '切分大小、重叠长度和 topK 要基于语料做实验。'],
    mistakes: ['把向量相似度当作事实正确性', '文档切分后丢失标题与来源元数据', '把所有历史对话无限加入提示词', '只做演示，不建立检索命中率和答案质量评测集'],
    exercises: [exercise('设计一个最小 RAG 评测集。', '准备至少 20 个问题，标注预期来源、答案要点和不可回答问题；分别评估召回、引用和最终答案。'), exercise('为什么文档切分需要重叠？', '重叠可以减少关键语义被分割边界截断，但过大将增加重复召回和 token 成本。'), exercise('Vector Store 接口与具体数据库实现是什么关系？', '接口统一增删查能力；内存实现适合本地验证，PgVector 等持久化实现适合生产规模、过滤和运维。')],
    checklist: ['能画出完整 RAG 数据流', '能保留并展示来源', '能解释切分和检索参数', '能建立离线评测与失败降级']
  },
  {
    title: '微服务完整笔记', output: '后端/微服务.md', level: '架构基础',
    audience: '理解单体应用并准备学习 RPC、服务注册和分布式治理的开发者',
    intro: '从分布式基本概念开始，整理 Dubbo、ZooKeeper 及服务治理基础。重点不是记配置，而是理解调用边界、失败模式和可观测性。',
    goals: ['区分集群、分布式和微服务', '理解 RPC、序列化、注册发现和负载均衡', '掌握 Dubbo 与 ZooKeeper 的基础配置', '认识超时、重试、幂等、熔断与链路追踪'],
    map: ['服务拆分与边界', 'RPC 与序列化', '注册中心与服务发现', '容错、治理与可观测性'],
    sources: [['后端/微服务/微服务组件.md', '分布式基础、Dubbo 与 ZooKeeper']],
    demoTitle: '综合示例：为远程调用设置明确边界', demoLanguage: 'yaml',
    demo: lines('dubbo:', '  consumer:', '    timeout: 1500', '    retries: 0', '    check: false', '  registry:', '    address: zookeeper://127.0.0.1:2181'),
    demoNotes: ['写操作默认不要自动重试，除非接口具有幂等保证。', '超时应根据下游耗时分布和上游总预算设置。', '启动检查策略取决于服务是否允许降级运行。'],
    mistakes: ['按数据库表而不是业务能力拆服务', '没有超时和幂等设计就开启重试', '将注册中心误认为业务数据存储', '只看平均耗时，不观察 P95 / P99 和错误率'],
    exercises: [exercise('为创建订单接口设计幂等方案。', '客户端携带唯一请求号；服务端使用唯一索引或原子存储记录处理结果；重复请求返回首次结果。'), exercise('为什么重试可能放大故障？', '下游已经过载时，重试会增加请求量；多层重试还会呈乘法放大，应限制次数、退避并设总预算。'), exercise('服务拆分前至少要明确哪些边界？', '业务职责、数据所有权、调用契约、失败处理、团队所有权和独立发布价值。')],
    checklist: ['能解释一次 RPC 调用链', '能设置合理超时和重试', '能识别幂等和数据一致性问题', '能用指标、日志、追踪定位故障']
  },
  {
    title: 'MySQL 完整笔记', output: '数据矩阵/MySQL.md', level: '基础到优化',
    audience: '希望把 SQL、表设计、事务、索引、执行计划和运维安装合并学习的开发者',
    intro: '这是 MySQL 的唯一主笔记。原先分散的 DDL、DML、DQL、函数、约束、多表查询、事务、存储引擎、索引和安装内容已按学习顺序合并。',
    goals: ['掌握库表管理、增删改查与权限控制', '能够设计约束清晰、类型合理的表结构', '理解事务隔离、锁、InnoDB 与索引', '能够使用 EXPLAIN 分析并优化查询'],
    map: ['基础操作：DDL、DML、DQL、DCL', '数据建模：类型、约束、关联与范式', '查询能力：函数、连接、子查询与聚合', '性能与可靠性：事务、存储引擎、索引、执行计划'],
    sources: [
      ['数据矩阵/mysql/基础/SQL基础.md', 'SQL 基础总览'],
      ['数据矩阵/mysql/基础/数据库操作.md', '数据库与表操作'],
      ['数据矩阵/mysql/基础/DDL.md', '数据定义语言 DDL'],
      ['数据矩阵/mysql/基础/DML.md', '数据操作语言 DML'],
      ['数据矩阵/mysql/基础/DQL.md', '数据查询语言 DQL'],
      ['数据矩阵/mysql/基础/函数.md', '常用函数'],
      ['数据矩阵/mysql/基础/约束.md', '约束与数据完整性'],
      ['数据矩阵/mysql/基础/多表查询.md', '多表查询'],
      ['数据矩阵/mysql/基础/事务.md', '事务与隔离级别'],
      ['数据矩阵/mysql/基础/DCL.md', '用户与权限 DCL'],
      ['数据矩阵/mysql/进阶/存储引擎.md', '存储引擎'],
      ['数据矩阵/mysql/进阶/索引.md', '索引原理'],
      ['数据矩阵/mysql/进阶/SQL进阶.md', '执行计划与 SQL 优化'],
      ['数据矩阵/mysql/进阶/重点.md', '进阶重点复习'],
      ['数据矩阵/mysql/进阶/finalshell.md', '远程环境中的 MySQL 操作'],
      ['数据矩阵/finalshell/安装mysql.md', 'MySQL 安装与连接']
    ],
    demoTitle: '综合示例：订单表设计与聚合查询', demoLanguage: 'sql',
    demo: lines(
      'CREATE TABLE orders (',
      '  id BIGINT PRIMARY KEY AUTO_INCREMENT,',
      '  user_id BIGINT NOT NULL,',
      '  status VARCHAR(20) NOT NULL,',
      '  amount DECIMAL(12, 2) NOT NULL,',
      '  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,',
      '  INDEX idx_user_created (user_id, created_at)',
      ');',
      '',
      'SELECT user_id, COUNT(*) AS order_count, SUM(amount) AS total_amount',
      'FROM orders',
      "WHERE created_at >= '2026-01-01'",
      "  AND status = 'PAID'",
      'GROUP BY user_id',
      'HAVING SUM(amount) >= 1000',
      'ORDER BY total_amount DESC',
      'LIMIT 20;'
    ),
    demoNotes: ['金额使用 `DECIMAL`，状态列使用受控值并由业务或约束保证合法。', '联合索引顺序应结合等值条件、范围条件和排序需求验证。', '优化前先使用真实数据量和 `EXPLAIN`，不要凭直觉添加索引。'],
    mistakes: ['使用 `SELECT *` 作为长期接口契约', '在索引列上进行不必要的函数或隐式类型转换', '事务范围过大，并在事务中调用慢速远程接口', '重复创建高度相似的索引却不检查写入成本'],
    exercises: [exercise('为什么示例索引 `(user_id, created_at)` 不一定适合给定聚合查询？', '查询没有限定 user_id，无法充分利用最左前缀。应基于查询频率评估 `(status, created_at, user_id)` 等方案，并用 EXPLAIN 和真实数据验证。'), exercise('设计转账事务的关键步骤。', '开启事务；按固定顺序锁定账户；校验余额；扣减与增加余额；记录流水；提交。任何异常回滚，并通过唯一业务号保证幂等。'), exercise('`WHERE` 与 `HAVING` 的区别是什么？', 'WHERE 在分组前过滤行；HAVING 在 GROUP BY 后过滤聚合结果。能前置到 WHERE 的条件通常应前置。')],
    checklist: ['能写出清晰的 CRUD 和多表查询', '能设计主键、外键、唯一约束和字段类型', '能解释 ACID 与隔离级别', '能读取 EXPLAIN 并验证索引效果']
  },
  {
    title: 'Java 数据访问完整笔记', output: '数据矩阵/Java数据访问.md', level: '工程实践',
    audience: '使用 Java 访问关系数据库，需要掌握 JDBC、MyBatis、MyBatis-Plus 与分页的开发者',
    intro: '从 JDBC 原理进入 MyBatis 映射、动态 SQL、连接池、分页和 MyBatis-Plus，统一说明参数绑定、结果映射、事务和批量操作。',
    goals: ['理解 JDBC 连接、预编译、执行与资源释放', '掌握 MyBatis Mapper、XML、动态 SQL 和结果映射', '正确使用连接池、事务与分页', '理解 MyBatis-Plus 的适用范围和边界'],
    map: ['JDBC：底层访问流程', 'MyBatis：参数、映射与动态 SQL', 'PageHelper：分页上下文与结果', 'MyBatis-Plus：通用 CRUD 与条件构造'],
    sources: [
      ['数据矩阵/JDBC/介绍.md', 'JDBC 基础'],
      ['数据矩阵/JDBC/JDBC数据库操作.md', 'JDBC 数据库操作'],
      ['数据矩阵/JDBC/Mybatis/MyBatis笔记.md', 'MyBatis 基础'],
      ['数据矩阵/JDBC/Mybatis/查询.md', 'MyBatis 查询、映射与动态 SQL'],
      ['数据矩阵/JDBC/Mybatis/MyBatisPlus.md', 'MyBatis-Plus'],
      ['数据矩阵/mysql/基础/PageHelper(分页查询).md', 'PageHelper 分页']
    ],
    demoTitle: '综合示例：安全的动态查询', demoLanguage: 'xml',
    demo: lines(
      '<select id="findOrders" resultType="Order">',
      '  SELECT id, user_id, status, amount, created_at',
      '  FROM orders',
      '  <where>',
      '    <if test="userId != null">AND user_id = #{userId}</if>',
      '    <if test="status != null and status != \'\'">AND status = #{status}</if>',
      '  </where>',
      '  ORDER BY created_at DESC',
      '</select>'
    ),
    demoNotes: ['值参数使用 `#{}` 预编译绑定，不能用 `${}` 拼接用户输入。', '显式列出查询字段，保证映射和接口契约稳定。', '动态条件放入 `<where>`，自动处理首个 AND。'],
    mistakes: ['手工拼接 SQL 导致注入风险', 'N+1 查询导致大量数据库往返', 'Mapper 返回实体后在 Controller 中拼装业务规则', '在循环中逐条提交本可批处理的数据'],
    exercises: [exercise('什么时候才可以使用 `${}`？', '仅用于无法参数化的结构片段，如经过白名单映射的排序列；绝不能直接拼接用户输入。'), exercise('PageHelper 使用时要注意什么？', '`startPage` 应紧邻目标查询；分页信息通常存在线程上下文，避免中间插入其他查询，并确保线程复用前被正确清理。'), exercise('如何定位 N+1 查询？', '打开 SQL 日志或链路指标，观察一次请求是否重复执行相似 SQL；改用批量查询、JOIN 或一次性加载后组装。')],
    checklist: ['能写安全的预编译查询', '能设计结果映射和动态 SQL', '能正确使用事务、连接池和分页', '能识别 SQL 注入、N+1 与批处理问题']
  },
  {
    title: 'Redis 完整笔记', output: '数据矩阵/Redis.md', level: '基础到实战',
    audience: '需要学习 Redis 数据结构、缓存、持久化和并发业务应用的开发者',
    intro: '围绕“数据结构选择 → 缓存模式 → 一致性 → 高可用”整理 Redis。保留原有命令和项目实践，同时修复不可发布的本机图片引用。',
    goals: ['掌握 String、Hash、List、Set、ZSet 的适用场景', '理解过期、淘汰、持久化与缓存异常', '能够实现分布式锁、计数、排行和库存操作', '认识主从、哨兵、集群和性能诊断'],
    map: ['数据结构与命令', '缓存、过期与淘汰', '事务、Lua 与分布式锁', '持久化、高可用与集群'],
    sources: [['数据矩阵/Redis/Redis.md', 'Redis 原理、命令与项目实践']],
    demoTitle: '综合示例：原子扣减库存', demoLanguage: 'lua',
    demo: lines(
      'local stock = tonumber(redis.call("GET", KEYS[1]) or "0")',
      'local count = tonumber(ARGV[1])',
      'if count <= 0 then return -2 end',
      'if stock < count then return -1 end',
      'redis.call("DECRBY", KEYS[1], count)',
      'return stock - count'
    ),
    demoNotes: ['Lua 脚本在 Redis 内原子执行，避免“读取后再扣减”的竞态。', '脚本只负责原子状态变更，订单落库仍需幂等和最终一致性设计。', '集群环境中多个 KEYS 必须位于同一 hash slot。'],
    mistakes: ['使用 `KEYS *` 扫描生产大库', '热点 key 永不过期且没有容量控制', '只设置锁 key，不校验持有者就删除锁', '缓存更新失败时没有重试、补偿或监控'],
    exercises: [exercise('设计缓存穿透防护。', '参数校验；对不存在结果设置短期空值；高风险场景使用布隆过滤器；监控异常 key 访问。'), exercise('安全释放分布式锁需要什么条件？', '锁值保存唯一持有者 token，释放时通过 Lua 原子比较 token 后删除，避免误删他人的锁。'), exercise('RDB 与 AOF 的主要取舍是什么？', 'RDB 紧凑、恢复快但可能丢失快照间数据；AOF 数据更完整但文件和写入成本更高。生产通常结合业务目标配置。')],
    checklist: ['能按访问模式选择数据结构', '能解释缓存击穿、穿透和雪崩', '能实现带所有权校验的锁', '能说明持久化和高可用取舍']
  },
  {
    title: '消息队列完整笔记', output: '数据矩阵/消息队列.md', level: '架构基础',
    audience: '准备学习 Kafka 及异步解耦、削峰和事件驱动设计的开发者',
    intro: '原笔记只有 Kafka 起始记录，本章补齐消息模型、分区、副本、消费组、可靠性、幂等与失败处理，形成可继续扩展的主笔记。',
    goals: ['理解消息队列的适用场景与代价', '掌握 Kafka topic、partition、offset 与 consumer group', '理解至少一次投递下的幂等消费', '能够设计重试、死信、监控和消息演进'],
    map: ['异步、解耦与削峰', 'Kafka 主题、分区、副本与消费组', '生产确认、offset 与投递语义', '幂等、顺序、重试和死信'],
    sources: [['数据矩阵/消息队列/消息队列.md', 'Kafka 原始记录']],
    primer: lines(
      '### 消息模型补充',
      '',
      '- **Topic**：一类消息的逻辑集合。',
      '- **Partition**：并行与有序的基本单位；同一分区内有序。',
      '- **Consumer Group**：组内消费者分担分区，组间独立消费。',
      '- **Offset**：消费者在分区中的读取进度。',
      '- **Replica**：分区副本用于容错，不等于额外的消费并行度。',
      '',
      '生产设计默认假设消息可能重复。消费者应以业务唯一键建立幂等记录，在业务处理成功后再提交消费进度。失败消息必须有受控重试次数、退避和最终告警。'
    ),
    demoTitle: '综合示例：幂等消费伪代码', demoLanguage: 'java',
    demo: lines(
      '@Transactional',
      'public void handle(OrderCreated event) {',
      '    if (processedEventRepository.exists(event.eventId())) {',
      '        return;',
      '    }',
      '    orderProjection.apply(event);',
      '    processedEventRepository.save(event.eventId());',
      '}'
    ),
    demoNotes: ['幂等记录与业务变更放在同一数据库事务中。', '消息键可选择聚合根 ID，使同一业务对象进入同一分区以保持顺序。', '不要无限重试不可恢复错误，应进入死信或人工处理流程。'],
    mistakes: ['把消息队列当作同步 RPC 的透明替代', '承诺全局顺序却配置多个分区', '业务成功前提交 offset 导致消息丢失', '没有 schema 版本和向后兼容策略'],
    exercises: [exercise('如何保证同一订单的事件有序？', '用订单 ID 作为消息 key，使同一订单进入同一分区；消费者仍需校验事件版本，处理重放和迟到消息。'), exercise('为什么“至少一次”要求消费者幂等？', '故障恢复、超时或提交 offset 失败都可能导致重复投递，相同事件不能重复产生业务副作用。'), exercise('什么消息适合进入死信队列？', '多次重试仍失败、格式不可解析或违反业务约束的消息；死信必须保留原因、原消息、重试次数和可追踪标识。')],
    checklist: ['能解释 Kafka 核心对象', '能设计分区键和消费组', '能处理重复、乱序与失败消息', '能建立 lag、失败率和死信监控']
  },
  {
    title: 'Git 完整笔记', output: '工具/Git.md', level: '日常协作', audience: '需要建立可靠版本控制和团队协作流程的开发者',
    intro: '从工作区、暂存区和仓库模型出发，整理常用命令、分支协作、撤销、冲突处理和提交规范。',
    goals: ['理解 Git 对象、三区和分支指针', '掌握提交、分支、合并、变基与远程协作', '能够选择安全的撤销方式', '能够处理冲突并编写清晰提交'],
    map: ['仓库模型与三区', '提交与分支', '远程协作与冲突', '撤销、恢复与历史整理'],
    sources: [['工具/Git笔记.md', 'Git 原理与常用流程']],
    demoTitle: '综合示例：完成一个小功能', demoLanguage: 'bash',
    demo: lines('git switch -c feat/article-search', 'git status', 'git add src/search.js tests/search.test.js', 'git diff --cached', 'git commit -m "feat: add article search"', 'git fetch origin', 'git rebase origin/master', 'git push -u origin feat/article-search'),
    demoNotes: ['提交前检查暂存区差异，避免带入无关文件。', '在个人分支上变基以整理历史；共享分支变基前必须协调。', '提交描述使用动词并说明可观察的变化。'],
    mistakes: ['使用 `git add .` 后不检查暂存区', '用 `reset --hard` 处理所有撤销场景', '在共享分支强制推送', '一个提交同时混合功能、格式化和无关重构'],
    exercises: [exercise('已提交但尚未推送，如何修改最后一次提交信息？', '使用 `git commit --amend`；若已推送到共享分支，应新增修正提交或先协调。'), exercise('`revert` 与 `reset` 的区别是什么？', 'revert 创建反向提交，保留公开历史；reset 移动分支指针，适合未共享的本地历史。'), exercise('冲突解决后要做什么？', '逐个确认冲突标记和最终逻辑，运行测试，git add 标记已解决，再继续 merge 或 rebase。')],
    checklist: ['能解释工作区、暂存区和 HEAD', '能安全撤销不同阶段的修改', '能处理合并与变基冲突', '能保持提交小而清晰']
  },
  {
    title: '远程终端完整笔记', output: '工具/远程终端.md', level: '工具速查', audience: '使用 FinalShell 或 SSH 管理远程开发环境的开发者',
    intro: '将 FinalShell 快捷操作提升为一份远程连接安全清单，覆盖 SSH 密钥、文件传输、会话管理和常见排查。',
    goals: ['掌握 SSH 连接与密钥认证', '能够安全传输文件并管理会话', '了解最小权限和主机指纹验证', '能够排查连接、端口与权限问题'],
    map: ['连接配置', '认证与安全', '终端和文件传输', '常见故障排查'],
    sources: [['工具/FinalShell.md', 'FinalShell 快捷键与操作']],
    primer: lines('### SSH 安全基线', '', '1. 优先使用密钥认证，并为私钥设置口令。', '2. 首次连接核对主机指纹，不盲目接受变化的指纹。', '3. 禁止使用 root 进行日常操作；通过 sudo 获取临时权限。', '4. 不在会话记录、脚本或仓库中保存明文密码。'),
    demoTitle: '综合示例：本地 SSH 配置', demoLanguage: 'bash',
    demo: lines('Host blog-server', '  HostName 203.0.113.10', '  User deploy', '  Port 22', '  IdentityFile ~/.ssh/blog_ed25519', '  ServerAliveInterval 60'),
    demoNotes: ['示例 IP 属于文档保留地址，需要替换为真实服务器。', '为不同环境使用不同 Host 别名和密钥。', '密钥文件权限应限制为当前用户读取。'],
    mistakes: ['使用 root 和弱密码直接暴露公网 SSH', '忽略主机指纹突然变化', '上传配置文件时覆盖生产环境密钥', '遇到连接失败只重启服务，不检查网络、端口和日志'],
    exercises: [exercise('如何判断是网络不通还是 SSH 认证失败？', '先检查 DNS、路由和端口连通性，再使用 `ssh -v` 查看握手与认证阶段；认证失败说明网络连接通常已建立。'), exercise('为什么要使用不同环境的独立密钥？', '降低单个密钥泄露的影响范围，便于单独吊销和审计。'), exercise('上传新配置的安全步骤是什么？', '先上传到临时路径，校验内容和权限，备份旧配置，原子替换，验证服务后保留回滚入口。')],
    checklist: ['能配置密钥登录', '能验证主机指纹', '能安全上传和替换文件', '能用日志分层定位连接问题']
  },
  {
    title: 'Linux 与 Docker 完整笔记', output: '运维部署/Linux与Docker.md', level: '部署基础', audience: '需要从 Linux 命令进入容器化和应用部署的开发者',
    intro: '从 Linux 文件、进程、权限和网络开始，过渡到 Docker 镜像、容器、卷、网络和部署检查，形成可执行的发布路径。',
    goals: ['掌握 Linux 文件、权限、进程、日志和网络命令', '理解镜像、容器、卷与网络', '能够编写基础 Dockerfile 并部署服务', '能够执行上线检查、健康验证和回滚'],
    map: ['Linux 文件系统与权限', '进程、服务、日志与网络', 'Docker 镜像、容器、存储和网络', '构建、发布、健康检查与回滚'],
    sources: [['运维部署/Linux基础.md', 'Linux 基础'], ['运维部署/Docker与部署.md', 'Docker 与项目部署']],
    demoTitle: '综合示例：Java 应用镜像', demoLanguage: 'dockerfile',
    demo: lines('FROM eclipse-temurin:21-jre', 'WORKDIR /app', 'COPY app.jar /app/app.jar', 'RUN useradd --system --uid 10001 appuser', 'USER appuser', 'EXPOSE 8080', 'ENTRYPOINT ["java", "-jar", "/app/app.jar"]'),
    demoNotes: ['运行时镜像不包含构建工具，减少体积和攻击面。', '使用非 root 用户运行应用。', '配置和密钥应在运行时注入，不写入镜像。'],
    mistakes: ['在容器中保存唯一业务数据却不挂载卷', '镜像使用 `latest` 导致发布不可追踪', '以 root 用户运行所有服务', '没有健康检查、日志采集和回滚版本'],
    exercises: [exercise('如何让容器化 MySQL 的数据持久化？', '将宿主卷或命名卷挂载到 MySQL 数据目录，并同时规划备份、权限和版本升级。'), exercise('容器启动后立即退出如何排查？', '查看 `docker logs` 和退出码；确认 ENTRYPOINT、环境变量、端口、文件权限及前台主进程。'), exercise('发布前的最小检查清单是什么？', '镜像版本固定；配置与密钥已注入；资源限制、健康检查、日志、迁移、备份和回滚方案已验证。')],
    checklist: ['能查看进程、端口、磁盘和日志', '能构建并运行非 root 镜像', '能正确使用卷与容器网络', '能执行部署验证和回滚']
  },
  {
    title: '大型营销服务项目笔记', output: '专栏/大型营销服务.md', level: '项目复盘', audience: '希望学习营销抽奖系统领域设计、规则编排、库存和项目演进的开发者',
    intro: '将项目概览、数据库设计和开发日志合并为一份可复盘的专栏，按背景、架构、数据、核心流程、关键决策和版本演进阅读。',
    goals: ['理解活动、策略、奖品和规则的领域边界', '掌握抽奖规则编排与库存一致性思路', '能够从开发日志提炼技术决策', '形成项目风险、指标和后续计划'],
    map: ['业务目标与领域模型', '数据库与接口边界', '规则、决策树与库存', '版本日志与复盘'],
    sources: [['专栏/大型营销服务/README.md', '项目概览'], ['专栏/大型营销服务/数据库设计.md', '数据库设计'], ['专栏/大型营销服务/开发日志.md', '开发日志']],
    primer: lines('### 推荐的项目阅读顺序', '', '1. 先确认业务目标、参与者和核心用例。', '2. 再阅读领域对象与表结构，理解数据所有权。', '3. 然后跟随抽奖、规则过滤、库存扣减和发奖流程。', '4. 最后按时间线复盘每次迭代解决的问题与引入的风险。'),
    demoTitle: '实践模板：架构决策记录（ADR）', demoLanguage: 'markdown',
    demo: lines('## 决策：库存扣减使用 Redis Lua', '', '- 状态：已接受', '- 背景：高并发抽奖需要避免超卖。', '- 方案：Lua 原子校验并扣减，数据库异步记录结果。', '- 代价：需要处理 Redis 与数据库的最终一致性。', '- 验证：并发压测、重复请求、消息重放和补偿任务。'),
    demoNotes: ['每个关键决策同时记录收益、代价和验证方式。', '开发日志应描述问题与结果，不只记录“完成了什么”。', '库存正确性需要在故障和重放场景中验证。'],
    mistakes: ['领域对象按数据库表一一映射，缺少业务行为', '只描述成功路径，不记录失败、重试和补偿', '开发日志没有指标、证据或决策背景', '抽奖概率、规则与库存代码耦合在一个流程中'],
    exercises: [exercise('画出一次抽奖的时序图。', '至少包含资格校验、策略装配、随机抽取、库存扣减、结果落库、发奖和失败补偿。'), exercise('如何验证不超卖？', '使用大于库存量的并发请求；验证成功数不超过库存、重复请求幂等、Redis 与数据库最终一致，并注入超时和重启故障。'), exercise('从日志中选一次迭代写 ADR。', '补齐背景、候选方案、选择理由、代价、验证结果和后续观察指标。')],
    checklist: ['能解释核心领域对象', '能描述抽奖和发奖完整链路', '能说明库存与幂等方案', '能从日志提炼可验证的技术决策']
  },
  {
    title: '苍穹外卖项目笔记', output: '专栏/苍穹外卖.md', level: '项目实践', audience: '希望通过外卖业务学习 Java Web、数据访问、缓存和部署的开发者',
    intro: '围绕用户端、商家端和订单履约整理项目。原笔记较短，本章增加需求边界、模块拆分、核心流程和复盘任务，作为持续补充的项目主页。',
    goals: ['理解用户、商品、购物车和订单模块', '能够描述下单、支付和履约状态流转', '识别权限、缓存、并发和数据一致性问题', '形成接口、测试和部署文档'],
    map: ['业务角色与功能架构', '数据模型与接口', '订单状态机与核心流程', '测试、部署与复盘'],
    sources: [['专栏/苍穹外卖/README.md', '项目概览与技术选型']],
    primer: lines('### 订单状态机建议', '', '`待付款 → 待接单 → 已接单 → 派送中 → 已完成` 是主路径；取消、拒单、超时和退款是显式分支。每次状态迁移都要校验当前状态、操作者权限，并记录时间和原因。'),
    demoTitle: '实践示例：订单状态迁移', demoLanguage: 'java',
    demo: lines('public void accept(long orderId, long merchantId) {', '    Order order = repository.findForUpdate(orderId)', '        .orElseThrow(OrderNotFoundException::new);', '    if (!order.belongsTo(merchantId) || order.status() != PENDING_ACCEPT) {', '        throw new InvalidOrderStateException();', '    }', '    order.accept(Instant.now());', '    repository.save(order);', '}'),
    demoNotes: ['状态检查与修改必须位于同一事务。', '并发场景需要悲观锁、乐观锁或条件更新。', '状态变化应写入审计或事件记录。'],
    mistakes: ['用一个布尔值表示复杂订单状态', '接口只校验登录，不校验资源归属', '缓存商品后忽略上下架与价格变更', '支付回调没有签名校验和幂等处理'],
    exercises: [exercise('补充订单取消的状态迁移表。', '列出允许取消的当前状态、操作者、退款需求、库存恢复、优惠回退和通知动作。'), exercise('如何保证支付回调幂等？', '校验签名与金额；使用支付单号唯一约束；事务内判断当前状态；重复回调返回成功但不重复扣减或发放。'), exercise('制定项目接口文档最小字段。', '方法与路径、鉴权、请求参数、响应结构、状态码、业务错误、示例、幂等与限流说明。')],
    checklist: ['能画出模块与角色关系', '能解释订单状态机', '能设计权限和幂等', '能补齐接口、测试和部署说明']
  },
  {
    title: '部门管理系统项目笔记', output: '专栏/部门管理系统.md', level: '入门项目', audience: '使用 Spring Boot 与 MyBatis 完成 RESTful CRUD 项目的开发者',
    intro: '以部门管理为最小业务闭环，整理 RESTful 接口、分层、MyBatis 映射、表结构和功能实现，并增加验证和复盘任务。',
    goals: ['掌握 Controller、Service、Mapper 分层', '理解 RESTful 资源与 HTTP 方法', '掌握 MyBatis 结果映射与 CRUD', '能够处理校验、异常、重复数据和测试'],
    map: ['需求与资源建模', 'RESTful 接口', '数据库与 MyBatis 映射', '校验、测试与复盘'],
    sources: [['专栏/部门管理系统/README.md', '项目实现记录']],
    demoTitle: '实践示例：创建部门接口', demoLanguage: 'java',
    demo: lines('@PostMapping("/departments")', 'ResponseEntity<DepartmentView> create(@Valid @RequestBody CreateDepartmentRequest request) {', '    DepartmentView created = departmentService.create(request);', '    URI location = URI.create("/departments/" + created.id());', '    return ResponseEntity.created(location).body(created);', '}'),
    demoNotes: ['成功创建资源返回 201，并通过 Location 指向新资源。', '请求 DTO 与持久化实体分离。', '部门名称唯一性应由数据库唯一约束兜底。'],
    mistakes: ['所有接口都使用 POST', '直接把数据库实体作为外部请求和响应', '只在代码中检查唯一性，没有数据库约束', '删除部门时不检查关联员工或业务规则'],
    exercises: [exercise('设计部门资源的五个基础接口。', 'POST /departments；GET /departments；GET /departments/{id}；PUT 或 PATCH /departments/{id}；DELETE /departments/{id}。'), exercise('三种 MyBatis 映射方式如何选择？', '字段一致时开启驼峰映射；少量特殊字段可用别名；复杂或复用映射使用 resultMap。'), exercise('为项目设计最小测试集。', '创建成功与重名；查询存在与不存在；修改校验；有关联数据时删除失败；Mapper 映射正确。')],
    checklist: ['能设计资源化接口', '能区分 DTO、领域对象和实体', '能正确配置 MyBatis 映射', '能覆盖主要成功与失败测试']
  }
]

const toPosix = value => value.split(path.sep).join('/')

function listMarkdown(directory) {
  if (!fs.existsSync(directory)) return []
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const absolute = path.join(directory, entry.name)
    if (entry.isDirectory()) return listMarkdown(absolute)
    return entry.isFile() && entry.name.toLowerCase().endsWith('.md') ? [absolute] : []
  })
}

function listAssets(directory) {
  if (!fs.existsSync(directory)) return []
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const absolute = path.join(directory, entry.name)
    if (entry.isDirectory()) return listAssets(absolute)
    return entry.isFile() && /\.(png|jpe?g|gif|svg|webp)$/i.test(entry.name) ? [absolute] : []
  })
}

const assets = listAssets(docsRoot)
const assetsByBasename = new Map()
for (const asset of assets) {
  const basename = path.basename(asset)
  const values = assetsByBasename.get(basename) || []
  values.push(asset)
  assetsByBasename.set(basename, values)
}

function relativeAsset(sourceRelative, outputRelative, rawHref) {
  const href = rawHref.trim().replace(/^<|>$/g, '')
  if (/^(https?:)?\/\//i.test(href) || /^data:/i.test(href)) return href
  if (/^[a-zA-Z]:[\\/]/.test(href)) return null

  const cleanHref = decodeURI(href.split('#')[0].split('?')[0]).replace(/\\/g, '/')
  const direct = path.resolve(docsRoot, path.dirname(sourceRelative), cleanHref)
  let asset = fs.existsSync(direct) ? direct : null
  if (!asset) {
    const matches = assetsByBasename.get(path.basename(cleanHref)) || []
    if (matches.length === 1) asset = matches[0]
  }
  if (!asset) return null
  let relative = toPosix(path.relative(path.dirname(path.join(docsRoot, outputRelative)), asset))
  if (!relative.startsWith('.')) relative = `./${relative}`
  return encodeURI(relative)
}

function repairSource(content, sourceRelative) {
  let repaired = content.replace(/\r\n/g, '\n')

  if (sourceRelative === '后端/GO笔记/Go笔记.md') {
    repaired = repaired.replace(/```go\s*\n# 在线文档/, '# 在线文档')
  }

  if (sourceRelative === '前端/前端总笔记.md') {
    repaired = repaired
      .replace(/- \[Vue 工程化\]\([^\n]+\)/g, '- Vue 工程化：见下文“Vue 工程化与应用开发”')
      .replace(/- \[Element Plus\]\([^\n]+\)/g, '- Element Plus：见下文“Element Plus 表单实践”')
  }

  repaired = repaired
    .replace(/\[application\.properties\]\([A-Za-z]:[\\/][^)]+\)/g, '`application.properties`')
    .replace(/hettp:\/\//g, 'http://')
    .replace(/^Sider Fusion\s*$/gim, '')
    .replace(/[!！]{2,}/g, '。')
    .replace('直接举例子。', '下面通过示例说明。')
    .replace('很简单，很无聊，不想写', '数组的声明、初始化与访问方式如下。')
    .replace(/可可以的[。!]*/g, '可以。')
    .replace(/可以的[。!]*/g, '可以。')
    .replace('可以进行切片操作。和py差不多', '数组与切片都支持切片表达式，但需要关注容量和底层数组共享。')
    .replace('很简单的对（true）错（false）', '布尔类型只有 `true` 和 `false` 两个值。')
    .replace('//主函数，大家都见过', '// main 是程序入口')
    .replace('mport "fmt"', 'import "fmt"')
    .replace('fmt.printfln', 'fmt.Println')
    .replace('！！！闭包复制的是原对象指针，这就很容易解释延迟引用现象。', '闭包捕获外部变量，而不是在创建时复制变量值，因此延迟执行时会观察到变量的最新状态。')
    .replace('systemctl start MySQL //启动', 'systemctl start mysqld  # 启动服务')
    .replace(/^https:\/\/www\.topgoer\.com\/(\S+)$/gm, '[Go 标准库参考](https://www.topgoer.com/$1)')
    .replace(/^.*<iframe\b.*<\/iframe>.*$/gim, '')
    .replace(/^.*Advertisement.*$/gim, '')

  // Older installation notes used a standalone `bash` label before commands.
  // Convert those labels into real fenced blocks so the rendered note is scannable.
  repaired = repaired.replace(/(?:^|\n)bash\n((?:(?:sudo|yum|cpan|perl)[^\n]*(?:\n|$))+)/g, (match, commands, offset) => {
    const prefix = offset === 0 ? '' : '\n'
    return `${prefix}\`\`\`bash\n${commands.trimEnd()}\n\`\`\`\n`
  })

  return repaired
}

function rewriteAssets(content, sourceRelative, outputRelative) {
  const missingAssets = new Set()
  let result = content.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, rawTarget) => {
    const target = rawTarget.trim().replace(/^([^\s]+)(?:\s+["'][^"']*["'])?$/, '$1')
    const resolved = relativeAsset(sourceRelative, outputRelative, target)
    if (!resolved) {
      missingAssets.add(alt || path.basename(target))
      return ''
    }
    return `![${alt}](${resolved})`
  })

  result = result.replace(/<img\s+[^>]*src=["']([^"']+)["'][^>]*\/?\s*>/gi, (match, target) => {
    const resolved = relativeAsset(sourceRelative, outputRelative, target)
    if (!resolved) {
      missingAssets.add(path.basename(target))
      return ''
    }
    return `![图片](${resolved})`
  })
  if (missingAssets.size) {
    const names = [...missingAssets]
    const visible = names.slice(0, 6).join('、')
    const more = names.length > 6 ? `等 ${names.length} 张` : ''
    result += `\n\n> 图片说明：原笔记引用的 ${visible}${more} 未保存到仓库；相关文字知识点已保留。`
  }
  return result
}

function stabilizeFences(content) {
  const sourceLines = content.split('\n')
  const output = []
  let open = false
  let language = ''
  const looksLikeMarkdown = line => /^(#{1,6}\s+|\*\*[^*]|>\s+|\d+\.\s+[^);]|[-*]\s+[^-])/.test(line.trim())

  for (const line of sourceLines) {
    const match = line.match(/^\s*```\s*([\w+-]*)\s*$/)
    if (match) {
      if (!open) {
        open = true
        language = match[1].toLowerCase()
        output.push(line)
      } else {
        output.push('```')
        open = false
        language = ''
      }
      continue
    }
    if (open && language && looksLikeMarkdown(line)) {
      output.push('```', '')
      open = false
      language = ''
    }
    output.push(line)
  }
  if (open) output.push('', '```')
  return output.join('\n')
}

function normalizeHeadings(content, label) {
  const sourceLines = content.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').split('\n')
  const normalized = []
  let fence = ''
  let firstMeaningful = true
  let lastHeadingLevel = 3

  for (let line of sourceLines) {
    const fenceMatch = line.match(/^\s*(```+|~~~+)/)
    if (fenceMatch) {
      if (!fence) fence = fenceMatch[1][0]
      else if (fence === fenceMatch[1][0]) fence = ''
      normalized.push(line.trimEnd())
      continue
    }
    if (!fence) {
      if (firstMeaningful && line.trim()) {
        const firstHeading = line.match(/^#\s+(.+)$/)
        const comparable = value => value.replace(/[（(].*?[）)]/g, '').replace(/\s|笔记|整理版|专栏式/g, '').toLowerCase()
        if (firstHeading && (comparable(firstHeading[1]).includes(comparable(label)) || comparable(label).includes(comparable(firstHeading[1])))) {
          firstMeaningful = false
          continue
        }
        firstMeaningful = false
      }
      const heading = line.match(/^(#{1,6})\s*(.+)$/)
      if (heading) {
        const originalLevel = heading[1].length
        let level = originalLevel <= 2 ? 4 : Math.min(6, originalLevel + 2)
        level = Math.min(level, lastHeadingLevel + 1)
        lastHeadingLevel = level
        line = `${'#'.repeat(level)} ${heading[2].trim()}`
      }
      line = line.replace(/[ \t]+$/g, '')
    }
    normalized.push(line)
  }
  return normalized.join('\n').replace(/\n{4,}/g, '\n\n\n').trim()
}

function renderTopic(topic, sourceRoot) {
  const sections = topic.sources.map(([source, label]) => {
    const absolute = path.join(sourceRoot, source)
    if (!fs.existsSync(absolute)) throw new Error(`缺少原始笔记：${source}`)
    let content = fs.readFileSync(absolute, 'utf8')
    content = repairSource(content, source)
    content = stabilizeFences(content)
    content = rewriteAssets(content, source, topic.output)
    content = normalizeHeadings(content, label)
    return lines(`### ${label}`, '', content)
  })

  const readingDirectory = [
    '1. [学习目标](#学习目标)',
    '2. [知识地图](#知识地图)',
    '3. [核心内容](#核心内容)',
    '4. [综合示例](#综合示例)',
    '5. [常见误区](#常见误区)',
    '6. [练习题](#练习题)',
    '7. [参考答案](#参考答案)',
    '8. [复习清单](#复习清单)'
  ]

  const exerciseQuestions = topic.exercises.map((item, index) => `${index + 1}. ${item.question}`)
  const exerciseAnswers = topic.exercises.map((item, index) => lines(`### ${index + 1}. ${item.question}`, '', item.answer))
  const sourceList = topic.sources.map(([source, label]) => `- ${label}：\`${source}\``)

  return cleanMarkdown(lines(
    `# ${topic.title}`,
    '',
    `> ${topic.intro}`,
    '',
    '| 项目 | 说明 |',
    '| --- | --- |',
    `| 难度 | ${topic.level} |`,
    `| 适合读者 | ${topic.audience} |`,
    `| 原始资料 | ${topic.sources.length} 份分散笔记，已合并并保留到 \`notes-archive/legacy-docs/\` |`,
    '',
    '## 阅读目录',
    '',
    readingDirectory,
    '',
    '## 学习目标',
    '',
    topic.goals.map(value => `- ${value}`),
    '',
    '## 知识地图',
    '',
    topic.map.map((value, index) => `${index + 1}. ${value}`),
    '',
    '## 核心内容',
    '',
    topic.primer || '',
    topic.primer ? '' : '',
    sections.join('\n\n---\n\n'),
    '',
    '## 综合示例',
    '',
    `### ${topic.demoTitle}`,
    '',
    `\`\`\`${topic.demoLanguage}`,
    topic.demo,
    '\`\`\`',
    '',
    '示例要点：',
    '',
    topic.demoNotes.map(value => `- ${value}`),
    '',
    '## 常见误区',
    '',
    topic.mistakes.map(value => `- ${value}`),
    '',
    '## 练习题',
    '',
    exerciseQuestions,
    '',
    '## 参考答案',
    '',
    exerciseAnswers.join('\n\n'),
    '',
    '## 复习清单',
    '',
    topic.checklist.map(value => `- [ ] ${value}`),
    '',
    '## 原始资料索引',
    '',
    sourceList,
    '',
    '> 整理原则：正文保留原笔记知识点，统一标题层级与资源链接；新增示例、练习和答案用于检验理解。遇到版本相关 API 时，应以所用版本的官方文档为准。',
    ''
  ))
}

const sourceFiles = topics.flatMap(topic => topic.sources.map(([source]) => source))
const duplicateSources = sourceFiles.filter((source, index) => sourceFiles.indexOf(source) !== index)
if (duplicateSources.length) throw new Error(`原始笔记被重复映射：${duplicateSources.join(', ')}`)

const isFirstRun = !fs.existsSync(archiveRoot)
if (isFirstRun) {
  const currentMarkdown = listMarkdown(docsRoot).map(file => toPosix(path.relative(docsRoot, file))).sort()
  const mapped = [...sourceFiles].sort()
  const unmapped = currentMarkdown.filter(file => !mapped.includes(file))
  const missing = mapped.filter(file => !currentMarkdown.includes(file))
  if (unmapped.length || missing.length) {
    throw new Error(lines(
      unmapped.length ? `存在未映射笔记：${unmapped.join(', ')}` : '',
      missing.length ? `映射中的笔记不存在：${missing.join(', ')}` : ''
    ))
  }

  for (const source of sourceFiles) {
    const from = path.join(docsRoot, source)
    const to = path.join(archiveRoot, source)
    fs.mkdirSync(path.dirname(to), { recursive: true })
    fs.copyFileSync(from, to)
  }
}

for (const source of sourceFiles) {
  const current = path.join(docsRoot, source)
  if (fs.existsSync(current)) fs.rmSync(current)
}

for (const topic of topics) {
  const output = path.join(docsRoot, topic.output)
  fs.mkdirSync(path.dirname(output), { recursive: true })
  fs.writeFileSync(output, renderTopic(topic, archiveRoot), 'utf8')
}

const archiveReadme = lines(
  '# 原始笔记归档',
  '',
  '此目录保存内容重构前的 Markdown 原文。博客不扫描这里，因此不会在知识库目录中重复展示。',
  '',
  '- 归档日期：2026-08-12',
  '- 主笔记位置：`docs/`',
  '- 图片资源仍保留在 `docs/` 原目录中，以避免二进制文件重复。',
  '- 重新生成：在仓库根目录运行 `npm run organize:notes`。',
  '',
  '## 合并映射',
  '',
  ...topics.flatMap(topic => [
    `### ${topic.title}`,
    '',
    `生成文件：\`docs/${topic.output}\``,
    '',
    ...topic.sources.map(([source, label]) => `- ${label}：\`${source}\``),
    ''
  ])
)
fs.mkdirSync(path.dirname(archiveRoot), { recursive: true })
fs.writeFileSync(path.join(root, 'notes-archive', 'README.md'), cleanMarkdown(archiveReadme), 'utf8')

const generated = topics.map(topic => `- docs/${topic.output}`).join('\n')
process.stdout.write(`已生成 ${topics.length} 篇主题主笔记：\n${generated}\n`)

const r=`# 项目日志\r
\r
------\r
\r
\r
\r
## 项目名称\r
\r
大型营销平台系统\r
\r
------\r
\r
\r
\r
## 项目目标\r
\r
本项目采用的DDD领域架构，以OpenAi大模型应用的营销活动\r
\r
------\r
\r
\r
\r
## 任务和进展\r
\r
\r
\r
### v.25.10.19\r
\r
#### 1.策略概率装配处理\r
\r
**总体实现逻辑**：StrategyArmory实现IStrategyArmory接口对策略的初始化操作，其中assembleLuckyStrategy将未存放的数据进行处理并放入redis持久层中，通过调用IStrategyRepository的持久层对数据读取\r
\r
**对策略概率的具体实现逻辑**：\r
\r
1. 获取**策略数据**：调用IStrategyRepository获取\r
\r
2. 通过策略数据提取最小概率和总概率，处理获取**最大位数**\r
\r
3. 将每个**奖品id**发生的概率转变成数量按照**顺序**存放再**List**中，然后进行**乱序**处理，并存放在**map**键值对中\r
\r
4. 将数据存放再**Redis**中，方便获取\r
\r
   ------\r
\r
   \r
\r
#### 2.策略权重概率装配\r
\r
**总体实现逻辑**：**StrategyArmoryDispatch**实现**IStrategyDispatch**接口的**assembleLuckyStrategy**的策略权重概率装配，根据权重不同来分配可分配的奖品种类进行抽取\r
\r
**具体实现逻辑**：\r
\r
1. 首先获取权重策略数据，通过ruleWeight和strategyId查询StrategyRule\r
2. getRuleWeightValues将获取的权重数据进行处理提取并且将**key**与**对应策略**进行**策略概率装配处理**\r
3. 再调用**assembleLuckyStrategy**的概率装配处理进行分布奖品位置并且抽取奖品\r
\r
**更新**：\r
\r
- 具体划分为策略装配库，负责**初始化策略计算**和根据**权重策略抽奖调度**\r
- 策略装配库：IStrategyArmory接口，负责装配抽奖策略配置「触发的时机可以为活动审核通过后进行调用」\r
- 策略抽奖调度：IStrategyDispatch接口，负责获取抽奖策略装配的随机结果\r
- StrategyArmory实现类转换为StrategyArmoryDispatch实现**策略装配库**和**策略抽奖调度**\r
\r
------\r
\r
### v25.10.21\r
\r
#### 1.抽奖前置规则过滤\r
\r
**总体实现逻辑**：通过调用IRaffleStrategy执行抽奖策略，AbstractRaffleStrategy抽象模板实现接口的方法，DefaultRaffleStrategy继承抽象模板实现过滤规则\r
\r
**规则过滤具体实现**：\r
\r
1. 通过logicFactory.openLogicFiliter()的方法实现规则的映射，存储ruleModel的数据，注解进行分配规则\r
2. 通过规则过滤接口ILogicFilter将策略数据进行规则划分\r
3. RuleBackListLogicFilter和RuleWeightLogicFilter分别实现黑名单和权重的数据处理方式\r
\r
\r
\r
#### 2.抽奖中置规则过滤\r
\r
在前置规则过滤中新增次数锁来判断此奖品是否达到了解锁该奖品的条件（抽奖次数是否足够）新增DefaultLogicFactory规则工厂的条件数据，在AbstractRaffleStrategy抽象模板新增抽奖中的奖品条件判断\r
\r
------\r
\r
### v25.10.23\r
\r
#### 1.责任链模式处理抽奖规则\r
\r
**总体实现逻辑**：将抽奖前的抽象实现删除，只保留抽奖中，因为实现了规则链，那么就会按照规则链式的执行\r
\r
责任链具体实现：\r
\r
1. 通过ILogiChain接口实现的责任链的门面，ILogicChainArmory实现的责任链内部链式结构的标准，而三个规则分别按照标准设计\r
2. 抽象类AbstractLoginChain继承责任链标准门面接口，制定方法规则，三个规则继承抽象类实现类实现门面接口的logic并返回奖品\r
3. 其中的默认工厂实现类，将最开始的ruleModels拆分分布并装载到责任链中\r
\r
\r
\r
------\r
\r
#### 2.抽奖规则树模型结构设计\r
\r
总体实现逻辑：通过决策树接口ILogicTreeNode，重构AbstractRaffleStrategy抽象类，通过DefaultTreeFctory里的引擎DecisionTreeEngine实现装配类，通过对应不同的实现方法进行实现。\r
\r
决策树读取节点的具体实现：\r
\r
1. 获取RuleTreeVO的节点信息，通过循环调用对应的工厂方法，直到读取到最后的节点然后返回奖品数据\r
\r
#### 3.模板模式串联抽奖规则\r
\r
重构AbstractRaffleStrategy的实现，通过责任链raffleLogicChain和决策树raffleLogicTree进行抽取奖品，并且建立查找决策树数据的持久层，并将其包装成vo进行决策树寻找数据\r
\r
重构DefaultRaffleStrategy的实现，实现责任链raffleLogicChain和决策树raffleLogicTree\r
\r
#### 4.不超卖库存规则实现\r
\r
总体实现逻辑：通过添加redis装配库存数据，在抽奖策略领域服务中的装配抽奖配置中新增redis缓存读取库存数据，事先做好装配的工作，IRaffleStock 接口进行异步处理库存数据\r
\r
具体实现：\r
\r
1. IRaffleStock 接口在进行处理扣减库存的时候写到到 redis 队列中的库存消耗数据，再由 trigger 中定时任务扫描获取 redis 队列数据，从而缓慢更新库表数据。\r
2. 提供库存的装配，也要提供库存的扣减。让外部调用的时候不需要更多的更新扣减的细节\r
3. 库存规则节点，通过装配服务做一个库存的扣减流程。如果扣减成功则发送消费队列由UpdateAwardStockJob消费，延迟队列数据存放缓存处理。\r
\r
------\r
\r
### v25.10.25\r
\r
#### 抽奖API接口实现\r
\r
1. 定义3个接口；策略装配接口、查询抽奖奖品列表配置、随机抽奖接口。\r
2. 定义 **IRaffleService** 接口，由 **trigger** 模块下的 http 层 **RaffleController** 实现接口。\r
3. 接口层的实现，直接调用到 **domain** 领域层。也就是我们前面所实现的抽奖策略领域服务。\r
4. 定义查询奖品列表接口，用于大转盘展示奖品使用。\r
5. 注意调用到 StrategyRepository#queryStrategyAwardList 方法的时候，缓存的 Key 调整 STRATEGY_AWARD_LIST_KEY 这个是查询 List 的结果。在查询字段上，增加了 额外的内容，如 sort。\r
\r
\r
\r
\r
\r
调整：\r
\r
- DecisionTreeEngine#nextNode 决策树引擎的判断下一个阶段方法，在找不到下一个阶段的时候返回 null 不需要抛异常。null 结束即可。\r
- 在通过缓存获取抽奖范围值时，如果忘记初始化策略到缓存中会抛异常。所以新增加了判断代码，增强健壮性。\r
- 抽奖策略接口返回的结果 RaffleAwardEntity 需要调整下字段。在我们前面章节实现的前端 UI 中知道，抽奖优先根据奖品列表的顺序ID进行抽奖，正好这个字段是我们数据库设计的 sort 排序字段。所以我们在 RaffleAwardEntity 中新增加这个字段来使用。\r
\r
\r
\r
------\r
\r
### v25.10.29\r
\r
#### 抽奖活动流水\r
\r
通过工厂模式抽象模板实现责任链,校验活动的领取情况和库存数量,并且将信息存储\r
\r
调整：\r
\r
- mapstruct的测试\r
- 构建Activity的领域服务，并且构建数据提供支撑层\r
- 活动持久层的实现\r
\r
------\r
\r
#### 引入MQ处理活动SKU库存一致性\r
\r
完善抽奖活动流水的责任链的具体实现\r
\r
其中的数据处理采用mq延迟队列处理缓慢处理库存，如果reids的库存为0则直接清除，通过监听者自动监听信息进行消费。\r
\r
------\r
\r
### v25.11.3\r
\r
#### 领取活动库表设计\r
\r
- 用户中奖订单表**user_award_record_000**\r
- 将抽奖活动账户表的月日次数时间单独设计两个表**raffle_activity_account_month**和**raffle_activity_account_day**，进行数量的计算\r
- 新建**task**表，进行mq信息的存储，统一信息规范\r
- **user_raffle_order**用户抽奖订单表\r
\r
------\r
\r
\r
\r
### v25.11.11\r
\r
#### 领取活动扣减账户额度\r
\r
调整：\r
\r
- 将处理活动的责任链和实现类规范到quota中\r
- 新建partake参与活动领域模块\r
\r
partake领域模块：\r
\r
- 抽象实现类首先校验数据，将额度数据进行扣减并且修改数据库的额度\r
- 并且将对象数据聚合并交给持久层处理\r
- 将扣减额度的行为作为一个事务进行处理，分别处理总账户和月日账户的额度的一个扣减事务\r
\r
------\r
\r
\r
\r
#### 写入中奖记录和任务补偿发送MQ\r
\r
- 新建award和task领域模块，分别是奖品服务模块和mq任务补偿消费模块\r
- award：负责存储task信息\r
- task负责消费和修改task状态\r
- 在triger层进行mq消息消费和监听的实现\r
\r
------\r
\r
\r
\r
### v25.11.16\r
\r
#### 抽奖活动流程串联\r
\r
定义RaffleActivityController实现类，分别是：\r
\r
- strategyArmory：负责活动的装配预热\r
- activityDraw：负责抽奖的流程\r
\r
具体实现\r
\r
- strategyArmory：\r
  - 通过IActivityArmory的assembleActivitySkuByActivityId方法预热sku数据\r
  - IStrategyArmory的assembleLotteryStrategyByActivityId方法预热策略数据\r
- activityDraw：\r
  - 首先通过IRaffleActivityPartakeService的createOrder方法进行抽奖订单的创建\r
  - IRaffleStrategy的perfromRaffle方法进行抽奖流程获取奖品信息\r
  - 最后通过IAwardService的saveUserAwardRecord方法，将中奖信息存储在数据库的user_award_record和task表中，方便后续的mq消费\r
\r
#### 活动信息API迭代和功能完善\r
\r
调整RaffleActivityController的activityDraw方法，添加endtime的加锁，在结束时间延迟一天释放\r
\r
增加RaffleStrategyController的新策略\r
\r
1. 提供带有活动和用户属性信息判断的抽奖列表数据，满足后续前端展示抽奖列表时可以渲染出奖品是否被加锁并提示用户还需要抽奖几次才能解锁奖品。\r
\r
2. 并且添加\r
\r
   private Boolean isAwardUnLock;\r
   //抽奖规则限制\r
   private Integer awardRuleLockCount;\r
   //还剩余多少抽奖机会\r
   private Integer waitUnLockCount;\r
\r
   为后续前端的展示提供数据\r
\r
------\r
\r
\r
\r
### v25.11.17\r
\r
#### 前端的基础抽奖ui设计\r
\r
调整：\r
\r
将RaffleStrategyController的query_raffle_award_list请求参数strategyId修改为activityId\r
\r
------\r
\r
### v25.11.18\r
\r
#### 用户行为返利入账\r
\r
rebate领域的构建:\r
\r
- IBehavioRebateService接口实现的用户行为返利行为的处理，并且进行mq的补偿\r
- 构建了基本的库表：\r
  user_behavior_rebate_order_000为用户的行为信息的存储\r
  daily_behavior_rebate为所有行为的模式\r
- 基本的库表插入和查询操作\r
\r
------\r
\r
#### 用户行为返利结算\r
\r
RebateMessageCustomer实现监听消息的消费\r
\r
调整：\r
\r
增加RaffleActivityController的calendarSignRebate方法，进行用户签到事件的接口调用\r
\r
 ActivityRepository持久层的saveActivityOrder方法增加了日月的账户记录\r
\r
\r
\r
### v25.11.19\r
\r
#### 规则完善和应用接口实现\r
\r
添加三个接口分别是：\r
\r
1. IRaffleActivityService 增加3个接口；是否签到过 - sCalendarSignRebate、查询账户额度 - queryUserActivityAccount\r
2. IRaffleStrategyService 增加1个接口；查询权重配置 - queryRaffleStrategyRuleWeight 这里需要封装下权重配置信息，方便前端渲染使用。\r
\r
#### 前端\r
\r
**BUG!!!!**\r
\r
\r
\r
### v25.11.20\r
\r
#### 积分发奖服务实现(user_credit_random)\r
\r
- 实现的user_credit_random随机积分奖品的发放\r
- 构建user_credit_account数据库表，方便存储用户的积分信息\r
- user_credit_record表，负责记录用户中奖记录信息\r
- 实现mq的发奖队列，通过接收抽奖完成，发出来的MQ消息，触发奖品发放。\r
\r
调整：\r
\r
- AbstractRaffleStrategy返回 ruleValue 也就是奖品配置  - awardConfig\r
- BackListLogicChain：awardRuleValue("0.01,1") 对黑名单用户给默认随机积分值范围，也可以配置到库表这个值。\r
- RaffleActivityController的activityDraw，把 awardConfig 等字段一起返回。\r
\r
\r
\r
------\r
\r
#### 积分领域调额服务\r
\r
- 增加用户积分领域模块，开发积分调额接口。串联行为发奖动作，发放用户积分奖励。\r
- 修改RebateMessageCustomer，增加sku的对应返利方式\r
- 串联前面章节中实现积分模块功能完成积分兑换case（串联的每一个服务都可以当做一个case看待），后期改为map对应接口\r
- 开发扣减积分，兑换sku商品，所需的服务模块。让积分的获取、消费，形成逻辑闭环。\r
- 首先，对 sku 商品库增加积分金额，用于积分支付，而签到兑换类则无需关注金额。\r
- 之后，商品下单需要提供出交易策略；无支付交易和有支付交易。\r
- 最后，下单完成则进行积分抵扣，以及接收到支付成功消息，进行充值入账。\r
\r
------\r
\r
### v25.11.21\r
\r
#### 分布式动态配置\r
\r
调整：\r
\r
- 增加了CreditAdjustSuccessCustomer监听积分的调整成功消息\r
- ActivityRepository 增加 【raffleActivityOrderRes】 null 判断，以及增加 lock 解锁时，lock.unlock(); 判断\r
- RaffleActivityController 补全接口注解 @RequestMapping\r
\r
**引入Nacos+Dubbo框架**\r
\r
- 给api层的每个DTO加上implements Serializable，外部访问\r
- 在controller层加上@DubboService(version = "1.0")\r
\r
**引入zookeeper**\r
\r
#### DCC动态配置活动降级\r
\r
- 配置zookeeperconfig的多参数构建ZooKeeper客户端连接\r
- 通过反射和spring的bean自动注入，配置DCC活动降级的配置。\r
- 设置活动降级接口，动态配置DCC活动降级。\r
\r
#### DCC动态配置限流和熔断\r
\r
- 利用aop和反射进行限流的配置\r
- HystrixCommand进行熔断的配置\r
\r
------\r
\r
### v25.11.22\r
\r
#### ES同步配置\r
\r
- 选择big_market_01、big_market_02 两个分库中两组表进行配置ES同步操作\r
- 新增加了 canal、canal-adapter、kibana、logstash，以及修改了 yml 脚本文件。\r
- 创建一个 canal 的账户，之后开启 binlog 日志\r
- 在 canal-adapter 中 es7 文件夹添加同步的库表 yml 配置。\r
- 在 application.yml 中配置出需要链接的库表以及同步的目标地址，也就是 es 的地址\r
- 为两套查询对应的 MyBatis 配置对应的数据源\r
\r
引入xxl-job\r
\r
**[http://127.0.0.1:9090/xxl-job-admin ](http://127.0.0.1:9090/xxl-job-admin)**//admin/12\r
\r
\r
------\r
\r
## 库表设计\r
\r
\r
\r
\r
\r
`;export{r as default};

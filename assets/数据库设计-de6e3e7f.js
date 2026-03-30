const n=`# 数据库设计（活动抽奖系统）

## 核心表结构（概览）

| 表名 | 描述 |
| --- | --- |
| activity | 活动配置 |
| award | 奖品配置 |
| strategy | 策略配置 |
| strategy_detail | 策略明细 |

## 扩展：用户参与与发奖（分表）

典型业务流程：

1. 用户参与活动（uId + activityId）
2. 校验剩余次数（\`user_take_activity_count.leftCount\`）
3. 记录参与流水（\`user_take_activity\`）
4. 计算中奖结果并按分片写入（\`user_strategy_export_001\` ~ \`004\`）

建议：

- 关键查询字段建立索引（activityId、strategyId、awardId）
- 状态字段统一字典（枚举/字典表）
- 业务核心数据与流水数据分离（便于扩展与对账）

`;export{n as default};

# 部门管理系统（专栏）

## 目标与开发模式

推荐前后端分离：

- 前端：部署到 Nginx
- 后端：部署到 Tomcat / Spring Boot
- 协作：以接口文档为契约（配合原型与需求）

## RESTful 风格（速记）

| REST URL | 方法 | 含义 |
| --- | --- | --- |
| `/users/1` | GET | 查询 |
| `/users/1` | DELETE | 删除 |
| `/users` | POST | 新增 |
| `/users` | PUT | 修改 |

## 工程搭建

- Spring Boot：web、mybatis、mysql driver、lombok
- 基础包结构：controller / service / mapper / pojo

统一响应结构（示例）：

```java
public class Result {
  private Integer code;
  private String msg;
  private Object data;
}
```

## MyBatis 结果映射（三种方式）

### 1）@Results 手动映射

```java
@Results({
  @Result(column = "create_time", property = "createTime"),
  @Result(column = "update_time", property = "updateTime")
})
```

### 2）起别名映射

```java
@Select("select id, name, create_time createTime, update_time updateTime from dept")
```

### 3）开启驼峰映射（推荐）

```yaml
mybatis:
  configuration:
    map-underscore-to-camel-case: true
```

## 查询部门（示例）

- 路径：`/depts`
- 方法：GET
- 排序：按最后修改时间倒序

表结构参考：

![](表结构.png)

实现流程参考：

![](功能实现.png)


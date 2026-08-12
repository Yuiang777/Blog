# Java进阶

## JVM 入门

Java 源码先编译为字节码（`.class`），再由 JVM 在不同操作系统上执行。JVM 通过解释器 + JIT 组合：

- 启动快：解释执行
- 热点快：JIT 把热点代码编译成机器码缓存

JVM 的优势：

- 跨平台（字节码 + JVM）
- 自动内存管理（GC）
- 线程运行时资源隔离（PC/栈/本地栈）

## 反射（常用 API 速查）

### Class：入口

```
getName()
getSimpleName()
getPackage()
getClassLoader()
getModifiers()
```

创建对象推荐：

```
getConstructor().newInstance()
```

### Field / Method / Constructor

- Field：`get / set / setAccessible`
- Method：`invoke`
- Constructor：`newInstance`

## 动态代理（建议掌握两种）

### 1）JDK 动态代理（基于接口）

关键点：

- 被代理对象需要有接口
- 通过 `InvocationHandler` 拦截方法调用

```java
InvocationHandler h = (proxy, method, args) -> {
  // before
  Object result = method.invoke(target, args);
  // after
  return result;
};

SomeApi proxy = (SomeApi) Proxy.newProxyInstance(
  target.getClass().getClassLoader(),
  new Class[]{SomeApi.class},
  h
);
```

### 2）CGLIB（基于继承）

关键点：

- 生成子类代理（final 类/方法不可代理）
- 常见于 Spring AOP 场景（内部会根据条件选择 JDK 或 CGLIB）

为什么现在默认都用**CGLIB**代替**JDK**的

------



## 向量数据库 / RAG（面向检索增强生成）

Vector Store（向量数据库）用于存储文本的向量表示，并做相似度检索。典型 RAG 流程：

```
用户问题
  ↓
Embedding（向量化）
  ↓
Vector Store 相似度搜索（TopK）
  ↓
拼接 Prompt
  ↓
大模型回答
```

传统数据库更偏精确匹配：

```mysql
select * from doc where content like '%AI%';
```

向量数据库更偏语义相近检索。

## MapStruct（对象映射）

适用场景：

- DTO/VO/Entity 之间的转换
- 编译期生成代码（比反射拷贝更快、更可控）

### 依赖与编译插件（示例）

```xml
<dependency>
  <groupId>org.mapstruct</groupId>
  <artifactId>mapstruct</artifactId>
  <version>1.6.0.Beta1</version>
</dependency>
```

```xml
<plugin>
  <groupId>org.apache.maven.plugins</groupId>
  <artifactId>maven-compiler-plugin</artifactId>
  <version>3.11.0</version>
  <configuration>
    <annotationProcessorPaths>
      <path>
        <groupId>org.mapstruct</groupId>
        <artifactId>mapstruct-processor</artifactId>
        <version>1.6.0.Beta1</version>
      </path>
    </annotationProcessorPaths>
  </configuration>
</plugin>
```

### 基本用法

```java
@Mapper
public interface SimpleMapper {
  Dst toDst(Src src);
  Src toSrc(Dst dst);
}
```

### 常用注解速记

- `@Mapping(source=..., target=...)`
- `@BeanMapping(ignoreByDefault = true)`
- `@MappingTarget`：更新到已有对象
- `@AfterMapping`：映射后补充处理

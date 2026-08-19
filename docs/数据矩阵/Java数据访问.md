# Java 数据访问完整笔记

> 从 JDBC 原理进入 MyBatis 映射、动态 SQL、连接池、分页和 MyBatis-Plus，统一说明参数绑定、结果映射、事务和批量操作。

| 项目 | 说明 |
| --- | --- |
| 难度 | 工程实践 |
| 适合读者 | 使用 Java 访问关系数据库，需要掌握 JDBC、MyBatis、MyBatis-Plus 与分页的开发者 |
| 原始资料 | 6 份分散笔记，已合并并保留到 `notes-archive/legacy-docs/` |

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

- 理解 JDBC 连接、预编译、执行与资源释放
- 掌握 MyBatis Mapper、XML、动态 SQL 和结果映射
- 正确使用连接池、事务与分页
- 理解 MyBatis-Plus 的适用范围和边界

## 知识地图

1. JDBC：底层访问流程
2. MyBatis：参数、映射与动态 SQL
3. PageHelper：分页上下文与结果
4. MyBatis-Plus：通用 CRUD 与条件构造

## 核心内容



### JDBC 基础

**本质**

​	sun公司官方定义的一套操作所有关系型数据库的规范，即接口。

​	各个数据库厂商去实现这套接口，提供数据库驱动jar包

​	可以使用这套接口（JDBC）编程，真正执行的代码时驱动jar包中的实现类

​	1.在maven项目，引入依赖，并准备数据库表user。

```java
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <version>8.0.33</version>
</dependency>
```

​	2.代码实现：编写JDBC程序，操作数据库

​

```JAVA
//1.注册驱动
Class.forName("com.mysql.cj.jdbc.Driver");
//2.获取连接
String url = "jdbc:mysql://localhost:3306/web01";
String username = "root";
String password = "1234";
Connection connection = DriverManager.getConnection(url,username,password);
//3.获取SQL语句执行对象
Statement statement = connection.createStatement();
//4.执行SQL
int i = statement.executeUpdate("update user set age = 25 where id = 1");
//5.释放资源
statement.close();
connection.close();
```

---

### JDBC 数据库操作

#### **一、查找数据**

​	将查询结构封装到User对象中，要引入依赖Driver

​	例如：

```java
package com.example.springbootweb1;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {
    private Integer id;
    private String username;
    private String password;
    private Integer age;
    private String name;
}
```

```java
@Test
    public void testSelect() throws Exception {
        //1.加载驱动
        Class.forName("com.mysql.cj.jdbc.Driver");//mysql 5.0以上版本不需要加载驱动
        //2.获取数据库连接
        Connection connection = DriverManager.getConnection("jdbc:mysql://localhost:3306/web01","root","YOUR_PASSWORD");//url,用户名，密码
        //3.编写sql语句
        Statement statement = connection.createStatement();
        //4.执行静态sql语句
        ResultSet tn = statement.executeQuery("select * from user");//查询语句
        //PreparedStatement ps = connection.prepareStatement("select * from user where id = ? and password = ?");
        ps.setString(1 ,"daqiao" );
        ResultSet tn = ps.executeQuery();//结果集对象//预编译查询
        while (tn.next()){
            User user= new User(
                    tn.getInt("id"),
                    tn.getString("username"),
                    tn.getString("password"),
                    tn.getInt("age"),
                    tn.getString("name")
            );
            System.out.println(user);


        }
```

Resulset(结果集对象): ResultSet tn = statement.executeQuery("select * from user");

查询语句：statement.executeQuery("select * from user");

​	next():将光标从当前位置向前移动一行，并且判断当前行是否为有效行，返回值为boolean

​	true：有效行，当前行有数据
​	false：无效行，当前行没有数据

getXxx()：获取数据，可以根据列的编号获取，也可以根据列明获取（推荐）。

1.**预编译查询：**

**PreparedStatement** ps = connection.prepareStatement("select * from user where id = ? and password = ?");**
        **ps.setString(1 ,"daqiao" );**
        **ResultSet** tn = ps.executeQuery();//结果集对象//预编译查询**

2.**静态查询**：

  ResultSet tn = statement.executeQuery("select * from user");//查询语句

区别：预编译的安全和性能更高

​	优势1：可以防止sql防止注入，更安全

​		SQL注入：通过控制输入来修改事先定义好的SQL语句，以达到执行代码对服务器进行攻击的方法。

​	优势2：性能更高

​		正常流程是线SQL语法解析检查->优化SQL->编译SQL->执行SQL

​	静态需要执行很多次，而预编译则先放入缓存，在直接再往缓存里拿出来这条相同的SQL语句直接编译

扩展：登陆系统通过查询记录count值是否是0，0则是没有。

#### 二、MyBatis

​	是一款持久层框架，用于简化JDBC的开发，引入MyBatis Framework，配置Mybatis(application.properties中数据库连接信息)

---

### MyBatis 基础

#### 准备工作

- 创建 SpringBoot 工程，引入 MyBatis 相关依赖
- 准备数据库表 `user`、实体类 `User`
- 配置数据库连接（`application.properties`）

示例（请用自己的账号与密码，不要把密码写进笔记仓库）：

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/web01
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
```

#### Mapper 接口（注解方式）

```java
@Mapper
public interface UserMapper {
  @Select("select * from user")
  List<User> findAll();
}
```

#### 增删改查（CRUD）

##### 删除

```java
@Delete("delete from user where id = #{id}")
void deleteById(Integer id);
```

##### 插入

```java
@Insert("insert into user(username,password,age,name) values(#{username},#{password},#{age},#{name})")
void insert(User user);
```

##### 修改

```java
@Update("update user set username=#{username},password=#{password},age=#{age},name=#{name} where id=#{id}")
void update(User user);
```

##### 查询（多参数）

```java
@Select("select * from user where id=#{id} and username=#{username}")
User findByIdAndUsername(@Param("id") Integer id, @Param("username") String username);
```

#### #{} 与 ${}

| 符号 | 说明 | 场景 | 优缺点 |
| --- | --- | --- | --- |
| `#{...}` | 占位符，替换为 `?`，生成预编译 SQL | 参数值传递 | 安全、性能高（推荐） |
| `${...}` | 字符串拼接 | 动态表名、字段名 | 存在 SQL 注入风险 |

#### XML 映射（复杂 SQL 推荐）

规则：

1. XML 映射文件与 Mapper 接口同包同名
2. `namespace` 与 Mapper 全限定名一致
3. SQL 的 `id` 与方法名一致，返回类型匹配

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
  PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
  "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.example.mybatis.mapper.UserMapper">
  <select id="findAll" resultType="com.example.mybatis.pojo.User">
    select * from user
  </select>
</mapper>
```

示例图：

![xml文件规则](./JDBC/Mybatis/img/xml%E6%96%87%E4%BB%B6%E8%A7%84%E5%88%99.png)

#### MyBatis-Plus（补充）

通过 Maven 导入 mybatis-plus 即可开始使用。

---

### MyBatis 查询、映射与动态 SQL

#### 准备工作

​	1.创建SpringBoot工程、引入Mybatis相关依赖

​	2.准备数据库表user、实体类User

​	3.配置Mybatis（在application.properties中数据库连接信息）

```java
```

#### 数据库连接配置
spring.datasource.url=jdbc:mysql://localhost:3306/web01
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
```

### 一、编写Mybatis程序:

与JDBC不同的是，先前的数据库配置的相关代码写在application.properties文件中

```
#### 数据库连接配置
spring.datasource.url=jdbc:mysql://localhost:3306/web01
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
```



​	编写Mybatis的持久层接口，定义SQL（注释/XML），定义Mapper接口

​	持久层接口命名规范为XxxMapper，也成为Mapper接口。

```
@Mapper// 应用程序在运行时，会自动的为该接口创建一个实现类对象（代理对象），并且会自动将该实现类对象存入IOC容器 - bean
public interface UserMapper{
    @Select("select * from user")
    public List<User> findAll();
}
```

在测试类中

```
SpringBootTest // 加载SpringBoot的配置文件,当前测试类中的测试方法运行时，会启动springboot项目 - IOC容器
class MybatisApplicationTests {
    @Autowired//自动注入#分层解耦
    private UserMapper userMapper;

    @Test
    public void test(){
        List<User> userlist =  userMapper.findAll();
        userlist.forEach(System.out::println);
    }

}
```

### 二、数据库连接池

基于DataSource的官方连接池的接口

​	优势：资源复用、提升系统响应速度

​	产品：C3P0、DBCP、Druid、Hikari(默认)

1.数据库连接池是一个容器，负责分配、管理数据库连接（Connection）。

2.它允许应用程序重复使用一个现有的数据库来凝结，而不是再重新建立一个。

3.释放空闲时间超过最大空闲时间的连接，来避免因为没有释放来连接而引起的数据库连接遗漏。

优点：

​	1.资源重用

​	2.提升系统响应速度

​	3.避免数据库连接遗漏

#### Druid连接池

​	pom引入依赖

​

```
<dependency>

    <groupId>com.alibaba</groupId>

    <artifactId>druid</artifactId>

    <version>1.1.9</version>

</dependency>
```

​	配置application.properties文件

```
#### 数据库连接配置
spring.datasource.type=com.alibaba.druid.pool.DruidDataSource
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.url=jdbc:mysql://localhost:3306/web01
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
```

### 三、增删改查

#### 	删除语句

​	SQL:delete form user where id = 5;

​	Mapper接口：

```
#### 预编译语句
@Delete("delete from user where id = #{id}")
public void deleteById(Integer id);
#### 若将void改为Integer的话，返回值就是该DML语句执行完毕影响的行数
```

​	测试类：

```
@Test
public void testDelete(){
userMapper.deleteById(1);
}
```

Mybatis中的#和$

| 符号   | 说明                                               | 场景                       | 优缺点             |
| ------ | -------------------------------------------------- | -------------------------- | ------------------ |
| #(...) | 占位符。执行时会将#(...)替换为?，生成预编译SQL     | 参数值传递                 | 安全、性能高(推荐) |
| $(...) | 拼接符。直接将参数拼接在SQL语句中，存在SQL注入问题 | 表名、字段名动态设置时使用 | 不安全、性能低     |

#### 	插入语句

​	SQL：insert into user(username,password,....) values('username','4564'....);

​	Mapper接口:

```
@Insert("insert into user(username,password,age,name) values(#{username},#{password},#{age},#{name})")
public void Insert(User user);
```


​	测试类：

```
@Test
public void testInsert(){
    User user = new User();// = new User(null , null ...);
    user.setUsername("zhangsan");
    user.setPassword("123456");
    user.setAge(18);
    user.setName("张三");
    userMapper.Insert(user);
}
```

#### 	修改语句

​	SQL：update user set username = '...' , password = '11111'.... where id = 1

​	Mapper接口：

```
@Update("update user set username=#{username},password=#{password},age=#{age},name=#{name} where id=#{id}")
public void update(User user);
```

​	测试类：

```
@Test
public void testUpdate(){
    User user = new User();
    user.setId(6);
    user.setUsername("liubei");
    user.setPassword("123456");
    user.setAge(18);
    user.setName("张三");
    userMapper.update(user);
}
```

#### 	查询语句

​	SQL：select * from where username = '...' and password = '....';

​	Mapper接口：

```
@Select("select * from user where id=#{id} and username=#{username}")

public User findByIdAndUsername(@Param("id") Integer id,@Param("username") String username);
//当给形参传值的时候形参的名字并没有被保存，所以要用Param这个注解来自给他取名字，而打括号里面写的属性名，并没有改变，所以可以不用这个注解
```

​	测试类：

```
@Test
public void testFindByIdAndUsername(){
    User user = userMapper.findByIdAndUsername(6,"liubei");
}
```

**注意：**当使用了@Param注解来声明参数的时候，SQL语句取值使用#{}，${}取值都可以。

   当不使用@Param注解声明参数的时候，必须使用的是#{}来取参数。使用${}方式取值会报错。

   不使用@Param注解时，参数只能有一个，并且是Javabean。在SQL语句里可以引用JavaBean的属性，而且只能引用JavaBean的属性。

如果基于官方骨架船舰的springboot项目中，接口编译时会保留方法形参名，@Param注解可以省略（#{形参名}）

### XML映射配置

​	再Mybatis中，既可以通过注解配置SQL语句，也可以通过XML配置文件配置SQL语句//**注意**：创建目录的时候不要用.要用/，并且要把原接口中的注解注销掉。

​	规则：

     1. XML映射文件的名称与Mapper接口名称一致，并且将XML映射文件和Mapper接口放置在相同包下(同包同名)
     2. 2.XML映射文件的namespace属性为Mapper接口全限定名一致
     3. XML映射文件中SQL语句的id与Mapper接口中的方法名一致，并保持返回类型一致。

```
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace= "com.example.mybatis.mapper.UserMapper">
    <select id="findAll" resultType="com.example.mybatis.pojo.User">
        select * from user
    </select>
</mapper>
```

在resources目录中建立与UserMapper引用相同的目录，文件名也要相同，映射。

例如：![xml文件规则](./JDBC/Mybatis/img/xml%E6%96%87%E4%BB%B6%E8%A7%84%E5%88%99.png)


**使用Mybatis的注解，主要完成一些简单的增删改查功能，如果需要实现复杂的SQL功能，建议使用XML来配置映射语句。**

官方：https://mybatis.net.cn/getting-started.html


#### 	辅助配置

1.如果没有按照同包同名来，可以在 `application.properties` 加入

```
#### 配置mybatis的mapper接口的扫描包
mybatis.mapper-locations=classpath:mapper/*.xml
```

在这个mapper目录下寻找xml文件。

2.MybatisX插件，提高效率（🐦飞起来）


### 动态SQL

#### where

1.通过<where>标签可以自动将and保留或删除

#### if

2.通过<if test="">标签可以进行判断语句

```
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.webproject.mapper.EmpMapper">
    <select id="selectList" resultType="com.webproject.pojo.Emp">
        select emp.* , dept.name deptName
        from emp
        left outer join dept on emp.dept_id = dept.id
        <where>
            <if test="name != null">
                emp.name like concat('%',#{name},'%')
            </if>
            <if test="gender != null">
                and emp.gender = #{gender}
            </if>
            <if test="begin != null and end != null">
                and emp.entry_date between #{begin} and #{end}
            </if>
        </where>
        order by emp.update_time desc
    </select>
</mapper>
```

#### choose、when、otherwise


有时候，我们不想使用所有的条件，而只是想从多个条件中选择一个使用。针对这种情况，MyBatis 提供了 choose 元素，它有点像 Java 中的 switch 语句。

还是上面的例子，但是策略变为：传入了 “title” 就按 “title” 查找，传入了 “author” 就按 “author” 查找的情形。若两者都没有传入，就返回标记为 featured 的 BLOG（这可能是管理员认为，与其返回大量的无意义随机 Blog，还不如返回一些由管理员挑选的 Blog）。

```
<select id="findActiveBlogLike"
     resultType="Blog">
  SELECT * FROM BLOG WHERE state = ‘ACTIVE’
  <choose>
    <when test="title != null">
      AND title like #{title}
    </when>
    <when test="author != null and author.name != null">
      AND author_name like #{author.name}
    </when>
    <otherwise>
      AND featured = 1
    </otherwise>
  </choose>
</select>
```


#### trim、where、set


前面几个例子已经合宜地解决了一个臭名昭著的动态 SQL 问题。现在回到之前的 “if” 示例，这次我们将 “state = ‘ACTIVE’” 设置成动态条件，看看会发生什么。

```
<select id="findActiveBlogLike"
     resultType="Blog">
  SELECT * FROM BLOG
  WHERE
  <if test="state != null">
    state = #{state}
  </if>
  <if test="title != null">
    AND title like #{title}
  </if>
  <if test="author != null and author.name != null">
    AND author_name like #{author.name}
  </if>
</select>
```

如果没有匹配的条件会怎么样？最终这条 SQL 会变成这样：


```
SELECT * FROM BLOG
WHERE
```

这会导致查询失败。如果匹配的只是第二个条件又会怎样？这条 SQL 会是这样:

```
SELECT * FROM BLOG
WHERE
AND title like ‘someTitle’
```

这个查询也会失败。这个问题不能简单地用条件元素来解决。这个问题是如此的难以解决，以至于解决过的人不会再想碰到这种问题。

MyBatis 有一个简单且适合大多数场景的解决办法。而在其他场景中，可以对其进行自定义以符合需求。而这，只需要一处简单的改动：

```
<select id="findActiveBlogLike"
     resultType="Blog">
  SELECT * FROM BLOG
  <where>
    <if test="state != null">
         state = #{state}
    </if>
    <if test="title != null">
        AND title like #{title}
    </if>
    <if test="author != null and author.name != null">
        AND author_name like #{author.name}
    </if>
  </where>
</select>
```


*where* 元素只会在子元素返回任何内容的情况下才插入 “WHERE” 子句。而且，若子句的开头为 “AND” 或 “OR”，*where* 元素也会将它们去除。

如果 *where* 元素与你期望的不太一样，你也可以通过自定义 trim 元素来定制 *where* 元素的功能。比如，和 *where* 元素等价的自定义 trim 元素为：

```
<trim prefix="WHERE" prefixOverrides="AND |OR ">
  ...
</trim>
```

*prefixOverrides* 属性会忽略通过管道符分隔的文本序列（注意此例中的空格是必要的）。上述例子会移除所有 *prefixOverrides* 属性中指定的内容，并且插入 *prefix* 属性中指定的内容。

用于动态更新语句的类似解决方案叫做 *set*。*set* 元素可以用于动态包含需要更新的列，忽略其它不更新的列。比如：

```
<update id="updateAuthorIfNecessary">
  update Author
    <set>
      <if test="username != null">username=#{username},</if>
      <if test="password != null">password=#{password},</if>
      <if test="email != null">email=#{email},</if>
      <if test="bio != null">bio=#{bio}</if>
    </set>
  where id=#{id}
</update>
```


这个例子中，*set* 元素会动态地在行首插入 SET 关键字，并会删掉额外的逗号（这些逗号是在使用条件语句给列赋值时引入的）。

来看看与 *set* 元素等价的自定义 *trim* 元素吧：

```
<trim prefix="SET" suffixOverrides=",">
  ...
</trim>
```

注意，我们覆盖了后缀值设置，并且自定义了前缀值。

#### foreach

动态 SQL 的另一个常见使用场景是对集合进行遍历（尤其是在构建 IN 条件语句的时候）。比如：

```
<select id="selectPostIn" resultType="domain.blog.Post">
  SELECT *
  FROM POST P
  WHERE ID in
  <foreach item="item" index="index" collection="list"
      open="(" separator="," close=")">
        #{item}
  </foreach>
</select>
```

1.collection：集合名称

2.item：集合遍历出来的元素/项

3.separator：每一次遍历使用的分隔符

4.open：比办理开始前拼接的片段

5.close：遍历结束后拼接的片段


*foreach* 元素的功能非常强大，它允许你指定一个集合，声明可以在元素体内使用的集合项（item）和索引（index）变量。它也允许你指定开头与结尾的字符串以及集合项迭代之间的分隔符。这个元素也不会错误地添加多余的分隔符，看它多智能！

**提示** 你可以将任何可迭代对象（如 List、Set 等）、Map 对象或者数组对象作为集合参数传递给 *foreach*。当使用可迭代对象或者数组时，index 是当前迭代的序号，item 的值是本次迭代获取到的元素。当使用 Map 对象（或者 Map.Entry 对象的集合）时，index 是键，item 是值。

至此，我们已经完成了与 XML 配置及映射文件相关的讨论。下一章将详细探讨 Java API，以便你能充分利用已经创建的映射配置。

#### script

要在带注解的映射器接口类中使用动态 SQL，可以使用 *script* 元素。比如:

```
    @Update({"<script>",
      "update Author",
      "  <set>",
      "    <if test='username != null'>username=#{username},</if>",
      "    <if test='password != null'>password=#{password},</if>",
      "    <if test='email != null'>email=#{email},</if>",
      "    <if test='bio != null'>bio=#{bio}</if>",
      "  </set>",
      "where id=#{id}",
      "</script>"})
    void updateAuthorValues(Author author);
```

#### bind


`bind` 元素允许你在 OGNL 表达式以外创建一个变量，并将其绑定到当前的上下文。比如：

```
<select id="selectBlogsLike" resultType="Blog">
  <bind name="pattern" value="'%' + _parameter.getTitle() + '%'" />
  SELECT * FROM BLOG
  WHERE title LIKE #{pattern}
</select>
```

### 注解

在MyBatis中，注解的目的是为了取代XML文件的配置项，而@Options注解的作用是设置如下几项：

1、useCache，是否使用缓存，默认是true
2、fetchSize，获取记录数的限度，默认是-1，没有条数限制
3、timeout，设置超时时间，默认是-1，没有时间限制
4、useGeneratedKeys，是否自动生成注解，默认是false。
5、keyProperty，数据行主键所对应的映射对象的属性，默认是id属性。


### 自定义结果ResultMap

colum：字段名

property：要封装的名字

例如：

```
<!-- 自定义结果ResultMap -->
    <resultMap id="empResultMap" type="com.webproject.pojo.Emp">
        <id column="id" property="id"/>
        <result column="username" property="username"/>
        <result column="password" property="password"/>
        <result column="name" property="name"/>
        <result column="gender" property="gender"/>
        <result column="phone" property="phone"/>
        <result column="job" property="job"/>
        <result column="salary" property="salary"/>
        <result column="image" property="image"/>
        <result column="entry_date" property="entryDate"/>
        <result column="dept_id" property="deptId"/>
        <result column="create_time" property="createTime"/>
        <result column="update_time" property="updateTime"/>
        <!-- 封装工作经历的信息 -->
        <collection property="exprList" ofType="com.webproject.pojo.EmpExpr">
        <id column="ee_id" property="id"/>
        <result column="ee_empid" property="empId"/>
        <result column="ee_begin" property="begin"/>
        <result column="ee_end" property="end"/>
        <result column="ee_company" property="company"/>
        <result column="ee_job" property="job"/>
        </collection>
    </resultMap>
```

id标签：id值

result标签：普通属性

collection标签：集合

#### 关联的嵌套结果映射

| 属性            | 描述                                                         |
| --------------- | ------------------------------------------------------------ |
| `resultMap`     | 结果映射的 ID，可以将此关联的嵌套结果集映射到一个合适的对象树中。 它可以作为使用额外 select 语句的替代方案。它可以将多表连接操作的结果映射成一个单一的 `ResultSet`。这样的 `ResultSet` 有部分数据是重复的。 为了将结果集正确地映射到嵌套的对象树中, MyBatis 允许你“串联”结果映射，以便解决嵌套结果集的问题。使用嵌套结果映射的一个例子在表格以后。 |
| `columnPrefix`  | 当连接多个表时，你可能会不得不使用列别名来避免在 `ResultSet` 中产生重复的列名。指定 columnPrefix 列名前缀允许你将带有这些前缀的列映射到一个外部的结果映射中。 详细说明请参考后面的例子。 |
| `notNullColumn` | 默认情况下，在至少一个被映射到属性的列不为空时，子对象才会被创建。 你可以在这个属性上指定非空的列来改变默认行为，指定后，Mybatis 将只在这些列中任意一列非空时才创建一个子对象。可以使用逗号分隔来指定多个列。默认值：未设置（unset）。 |
| `autoMapping`   | 如果设置这个属性，MyBatis 将会为本结果映射开启或者关闭自动映射。 这个属性会覆盖全局的属性 autoMappingBehavior。注意，本属性对外部的结果映射无效，所以不能搭配 `select` 或 `resultMap` 元素使用。默认值：未设置（unset）。 |
| association     | 一对一关联                                                   |

```
<select id="selectNodeVoList" resultMap="NodeVoResult">
        SELECT
        n.id,
        n.node_name,
        n.address,
        n.business_type,
        n.region_id,
        n.partner_id,
        n.create_time,
        n.update_time,
        n.create_by,
        n.update_by,
        n.remark,
        COUNT(v.id) AS vm_count
        FROM
        tb_node n
        LEFT JOIN
        tb_vending_machine v ON n.id = v.node_id
        <where>
            <if test="nodeName != null  and nodeName != ''"> and n.node_name like concat('%', #{nodeName}, '%')</if>
            <if test="regionId != null "> and n.region_id = #{regionId}</if>
            <if test="partnerId != null "> and n.partner_id = #{partnerId}</if>
        </where>
        GROUP BY
        n.id
    </select>
<resultMap id="NodeVoResult" type="NodeVo">
    <result property="id"    column="id"    />
    <result property="nodeName"    column="node_name"    />
    <result property="address"    column="address"    />
    <result property="businessType"    column="business_type"    />
    <result property="regionId"    column="region_id"    />
    <result property="partnerId"    column="partner_id"    />
    <result property="createTime"    column="create_time"    />
    <result property="updateTime"    column="update_time"    />
    <result property="createBy"    column="create_by"    />
    <result property="updateBy"    column="update_by"    />
    <result property="remark"    column="remark"    />
    <result property="vmCount" column="vm_count"/>
    <association property="region" javaType="Region" column="region_id" select="com.dkd.manage.mapper.RegionMapper.selectRegionById"/>
    <association property="partner" javaType="Partner" column="partner_id" select="com.dkd.manage.mapper.PartnerMapper.selectPartnerById"/>
</resultMap>
```

| 属性            | 描述                                                         |
| --------------- | ------------------------------------------------------------ |
| `column`        | 当使用多个结果集时，该属性指定结果集中用于与 `foreignColumn` 匹配的列（多个列名以逗号隔开），以识别关系中的父类型与子类型。 |
| `foreignColumn` | 指定外键对应的列名，指定的列将与父类型中 `column` 的给出的列进行匹配。 |
| `resultSet`     | 指定用于加载复杂类型的结果集名字。                           |

| 属性          | 描述                                                         |
| ------------- | ------------------------------------------------------------ |
| `property`    | 映射到列结果的字段或属性。如果用来匹配的 JavaBean 存在给定名字的属性，那么它将会被使用。否则 MyBatis 将会寻找给定名称的字段。 无论是哪一种情形，你都可以使用通常的点式分隔形式进行复杂属性导航。 比如，你可以这样映射一些简单的东西：“username”，或者映射到一些复杂的东西上：“address.street.number”。 |
| `javaType`    | 一个 Java 类的完全限定名，或一个类型别名（关于内置的类型别名，可以参考上面的表格）。 如果你映射到一个 JavaBean，MyBatis 通常可以推断类型。然而，如果你映射到的是 HashMap，那么你应该明确地指定 javaType 来保证行为与期望的相一致。 |
| `jdbcType`    | JDBC 类型，所支持的 JDBC 类型参见这个表格之前的“支持的 JDBC 类型”。 只需要在可能执行插入、更新和删除的且允许空值的列上指定 JDBC 类型。这是 JDBC 的要求而非 MyBatis 的要求。如果你直接面向 JDBC 编程，你需要对可能存在空值的列指定这个类型。 |
| `typeHandler` | 我们在前面讨论过默认的类型处理器。使用这个属性，你可以覆盖默认的类型处理器。 这个属性值是一个类型处理器实现类的完全限定名，或者是类型别名。 |

 “ofType” 属性。这个属性非常重要，它用来将 JavaBean（或字段）属性的类型和集合存储的类型区分开来

例如：

```
<collection property="posts" javaType="ArrayList" column="id" ofType="Post" select="selectPostsForBlog"/>
```


```

---

### MyBatis-Plus

一、项目导入mybatis-plus

​	通过maven导入mybatis-plus

---

### PageHelper 分页

#### Mapper接口的定义方法

##### 原始方式-controller层

```java
@Slf4j
@RestController
@RequestMapping("/emps")
public class Empcontroller {
    @Autowired
    private EmpService empService;
    //查询员工列表
    @GetMapping()
    public Result page(@RequestParam(defaultValue = "1") Integer page,@RequestParam(defaultValue = "10") Integer pageSize){
        log.info("查询员工列表:{},{}",page,pageSize);
        PageResult<Emp> pageResult =  empService.page(page,pageSize);
        return Result.success(pageResult);
    }
}
```

##### 原始方式-mapper层

```java
    //统计符合条件的数量
    @Select("select count(*) from emp e ...")

    //查询结果列表
    @Select("select e.* from emp e ... limit #{start},#{pageSize}")
    public List<Emp> list(Integer start , Integer pageSize);
```


##### 原始方式-service层

```java
public PageResult<Emp> page(Integer page, Integer pageSize){
//1.获取总记录数
Long total = empMapper.count();
//2.获取数据列表
Interger start = (page - 1) * pageSize;
List<Emp> emplist = empMapper.list(start,pageSize);
//3.封装分页结果
return new PageResult<Emp>(total,empList);
}

```

------


#### PageHelper

是第三方提供的在Mybatis框架中实现分页的插件，用来简化分页操作，提高开发效率

##### PageHelper-mapper层

```java
@Select("select e.* from emp e ...")
public List<Emp> list();
```

##### PageHelper-service层

```java
public PageResult<Emp> page(Integer page, Integer pageSize){
//1.设置分页参数
PageHelper.startPge(page, pageSize);
//2.调用Mapper接口方法
List<Emp> empList = empMapper.list();
//3.调用pageHelper的PageInfo对象获取全部数据，用getTotal的方法获取总记录数
long total = new PageInfo<Emp>(rows).getTotal();
/*通过Page获取数据
Page<Emp> pageInfo = (Page<Emp>) rows;
long total = pageInfo.getTotal();
*/
//4.解析并封装结果
return newPageResult(...);
}
```

**注意：**1.sql语句不能加";"

​	    2.仅能根据紧跟在其后的第一个sql语句进行分页处理

##### PageHelper使用方法

1.引入PageHelper的依赖

<!--分页插件PageHelper-->
<dependency>
       <groupId>com.github.pagehelper</groupId>
       <artifactId>pagehelper-spring-boot-starter</artifactId>
       <version>1.4.7</version>
</dependency>

2.定义Mapper接口的查询方法(无需考虑分页)

3.在Service方法中实现分页查询

PageHelper会自动把分页结果的所有信息封装到Page或者PageInfo中了

###### Page和PageInfo区别：

两者都能获取到数据，

Page是一个ArrayListList。之所以可以强转类型，Page就是List接口实现类（多态）

PageInfo是一个对象，能获取到的数据比Page多；

## Java 数据访问工程补充

### 数据访问层的职责

Repository 或 Mapper 负责持久化转换和查询，不承担完整业务流程。Service 负责事务、权限和业务规则。Controller 不应直接拼 SQL 或操作 Mapper。

```text
Controller -> Application Service -> Repository interface -> MyBatis/JDBC adapter
```

查询模型和写模型可以不同。复杂列表直接返回专用 DTO，避免加载完整领域对象后再做大量 N+1 查询。

## JDBC 正确使用

### 资源与参数

```java
String sql = """
    SELECT id, order_no, status, amount
    FROM orders
    WHERE user_id = ? AND created_at >= ?
    ORDER BY created_at DESC, id DESC
    LIMIT ?
    """;

try (Connection connection = dataSource.getConnection();
     PreparedStatement statement = connection.prepareStatement(sql)) {
    statement.setLong(1, userId);
    statement.setTimestamp(2, Timestamp.from(since));
    statement.setInt(3, Math.min(limit, 100));
    statement.setQueryTimeout(3);

    try (ResultSet results = statement.executeQuery()) {
        while (results.next()) {
            // 显式映射需要的列
        }
    }
}
```

所有外部值使用占位符绑定。表名、列名和排序方向不能参数化时，必须通过服务端白名单映射，不能直接拼接用户字符串。

### 批量写入

```java
try (PreparedStatement statement = connection.prepareStatement(
        "INSERT INTO order_item(order_id, sku_id, quantity) VALUES (?, ?, ?)")) {
    for (OrderItem item : items) {
        statement.setLong(1, orderId);
        statement.setLong(2, item.skuId());
        statement.setInt(3, item.quantity());
        statement.addBatch();
    }
    int[] counts = statement.executeBatch();
}
```

批量大小需要限制，过大会增加事务、日志、内存和锁竞争。执行后检查返回结果和异常链。

## 连接池

连接池容量不是越大越好。总连接数由“实例数 × 每实例池上限”决定，必须低于数据库可承受范围并预留管理连接。

关键参数：

- 最大连接数与最小空闲连接。
- 获取连接超时。
- 连接最大生命周期，略短于服务端或网络空闲回收时间。
- 泄漏检测只在排查时谨慎启用。
- 连接验证与初始化 SQL。

监控活跃、空闲、等待线程和获取耗时。连接池满通常是慢 SQL、长事务、连接泄漏或数据库变慢的结果，不应只靠扩大池子掩盖。

## MyBatis 映射设计

### 显式 ResultMap

```xml
<resultMap id="OrderResultMap" type="com.example.order.Order">
  <id property="id" column="id" />
  <result property="orderNo" column="order_no" />
  <result property="status" column="status" javaType="com.example.order.OrderStatus" />
  <result property="amount" column="amount" />
</resultMap>
```

复杂查询明确列别名和映射，避免 `SELECT *`。枚举、JSON、加密字段和特殊时间类型使用经过测试的 TypeHandler。

### 动态 SQL 安全

```xml
<select id="findPage" resultMap="OrderResultMap">
  SELECT id, order_no, user_id, status, amount, created_at
  FROM orders
  <where>
    user_id = #{query.userId}
    <if test="query.status != null">
      AND status = #{query.status}
    </if>
    <if test="query.since != null">
      AND created_at >= #{query.since}
    </if>
  </where>
  ORDER BY created_at DESC, id DESC
  LIMIT #{query.limit}
</select>
```

`#{}` 生成参数绑定；`${}` 是原样文本替换。排序字段可在 Java 层映射为枚举，或在 XML 使用 `choose` 输出固定列名。

### 更新要检查影响行数

```java
int changed = orderMapper.markPaid(orderId, expectedVersion, paidAt);
if (changed == 0) {
    throw new OptimisticLockException("订单状态已变化");
}
```

忽略影响行数会把不存在、状态冲突和并发覆盖当作成功。

## N+1 与批量加载

以下模式会产生 N+1：先查订单列表，再循环查询每个订单明细。解决方案：

1. 一次 join 后在内存按订单分组。
2. 先查询订单 ID，再用 `IN` 批量查询明细。
3. 对列表页使用专用扁平查询 DTO。
4. 使用按请求范围的 DataLoader 合并查询。

```xml
<select id="findItemsByOrderIds" resultType="OrderItemRow">
  SELECT id, order_id, sku_id, quantity
  FROM order_item
  WHERE order_id IN
  <foreach collection="orderIds" item="id" open="(" separator="," close=")">
    #{id}
  </foreach>
</select>
```

IN 列表同样要限制大小，大批量可分片或使用临时表。

## 分页与排序

### Offset 分页

适合后台浅分页和需要页码的场景，但深分页扫描成本高。PageHelper 依赖线程上下文，调用 `startPage` 后紧接目标查询，避免中间执行其他 SQL。

### 游标分页

```sql
SELECT id, order_no, created_at
FROM orders
WHERE user_id = ?
  AND (created_at, id) < (?, ?)
ORDER BY created_at DESC, id DESC
LIMIT ?;
```

游标包含完整稳定排序键。不能只使用可能重复的 `created_at`，否则会漏行或重复。

## 事务、锁与重试

### 事务只包围本地一致性

```java
@Transactional
public void transfer(TransferCommand command) {
    accountMapper.lockInOrder(command.accountIdsSorted());
    accountMapper.debit(command.fromId(), command.amount());
    accountMapper.credit(command.toId(), command.amount());
    transferMapper.insert(command.toRecord());
}
```

事务内不等待邮件、HTTP 或消息代理。需要跨系统通知时写 Outbox，在提交后异步发布。

### 隔离级别与锁

默认隔离级别不等于所有并发问题自动解决。先明确不变量，再选择：条件更新、乐观锁、`SELECT ... FOR UPDATE`、唯一约束或串行化。

### 重试边界

死锁、连接重置等错误有时可以重试，但重试单元必须覆盖整个事务并确保幂等。不能只重试事务中的最后一条 SQL。

## 数据库迁移

推荐使用 Flyway、Liquibase 等工具版本化管理 schema：

```text
V20260819_01__add_article_visibility.sql
V20260819_02__create_event_outbox.sql
```

生产迁移原则：

- 先新增可空列或有安全默认值的列。
- 新旧应用同时兼容一段时间。
- 数据回填分批、限速并可恢复。
- 切换读写后再删除旧列。
- 大表 DDL 评估锁、临时空间和复制延迟。

不要在应用启动时由 ORM 自动修改生产 schema。

## 测试与观测

### 测试

- Mapper 测试使用真实数据库行为，不用纯 mock 证明 SQL 正确。
- Testcontainers 可提供接近生产版本的临时数据库。
- 覆盖 NULL、时区、字符集、唯一约束、并发更新和事务回滚。
- 为关键 SQL 保存执行计划基线和典型数据量测试。

### 观测

记录 SQL 模板标识、耗时、返回/影响行数和 trace ID，不记录密码和完整敏感参数。监控连接池等待、慢 SQL、锁等待、死锁、事务时长和数据库错误率。

## 综合示例

### 综合示例：安全的动态查询

```xml
<select id="findOrders" resultType="Order">
  SELECT id, user_id, status, amount, created_at
  FROM orders
  <where>
    <if test="userId != null">AND user_id = #{userId}</if>
    <if test="status != null and status != ''">AND status = #{status}</if>
  </where>
  ORDER BY created_at DESC
</select>
```

示例要点：

- 值参数使用 `#{}` 预编译绑定，不能用 `${}` 拼接用户输入。
- 显式列出查询字段，保证映射和接口契约稳定。
- 动态条件放入 `<where>`，自动处理首个 AND。

## 常见误区

- 手工拼接 SQL 导致注入风险
- N+1 查询导致大量数据库往返
- Mapper 返回实体后在 Controller 中拼装业务规则
- 在循环中逐条提交本可批处理的数据

## 练习题

1. 什么时候才可以使用 `${}`？
2. PageHelper 使用时要注意什么？
3. 如何定位 N+1 查询？
4. 连接池长期满载时为什么不应先直接扩大连接数？
5. 游标分页为什么需要包含完整稳定排序键？

## 参考答案

### 1. 什么时候才可以使用 `${}`？

仅用于无法参数化的结构片段，如经过白名单映射的排序列；绝不能直接拼接用户输入。

### 2. PageHelper 使用时要注意什么？

`startPage` 应紧邻目标查询；分页信息通常存在线程上下文，避免中间插入其他查询，并确保线程复用前被正确清理。

### 3. 如何定位 N+1 查询？

打开 SQL 日志或链路指标，观察一次请求是否重复执行相似 SQL；改用批量查询、JOIN 或一次性加载后组装。

### 4. 连接池长期满载时为什么不应先直接扩大连接数？

满载通常来自慢 SQL、长事务、连接泄漏或数据库变慢。直接扩容会把更多并发压向数据库，可能进一步恶化。应先分析连接等待、事务时间、慢查询和数据库容量。

### 5. 游标分页为什么需要包含完整稳定排序键？

若只用可能重复的时间列，多条记录位于同一时间点时会漏行或重复。游标应包含时间和唯一 ID，并与 `ORDER BY` 和联合索引保持一致。

## 复习清单

- [ ] 能写安全的预编译查询
- [ ] 能设计结果映射和动态 SQL
- [ ] 能正确使用事务、连接池和分页
- [ ] 能识别 SQL 注入、N+1 与批处理问题

## 官方文档与延伸阅读

- [JDBC Basics](https://docs.oracle.com/javase/tutorial/jdbc/basics/) - 连接、语句、结果集和事务基础。
- [MyBatis 3](https://mybatis.org/mybatis-3/) - Mapper、动态 SQL、ResultMap 与配置。
- [MyBatis-Plus](https://baomidou.com/) - CRUD、分页、插件和扩展能力。
- [HikariCP](https://github.com/brettwooldridge/HikariCP) - 连接池配置与运行行为。
- [Flyway Documentation](https://documentation.red-gate.com/flyway) - 数据库迁移版本管理。
- [Testcontainers JDBC](https://java.testcontainers.org/modules/databases/jdbc/) - 数据访问集成测试。

## 原始资料索引

- JDBC 基础：`数据矩阵/JDBC/介绍.md`
- JDBC 数据库操作：`数据矩阵/JDBC/JDBC数据库操作.md`
- MyBatis 基础：`数据矩阵/JDBC/Mybatis/MyBatis笔记.md`
- MyBatis 查询、映射与动态 SQL：`数据矩阵/JDBC/Mybatis/查询.md`
- MyBatis-Plus：`数据矩阵/JDBC/Mybatis/MyBatisPlus.md`
- PageHelper 分页：`数据矩阵/mysql/基础/PageHelper(分页查询).md`

> 整理原则：正文保留原笔记知识点，统一标题层级与资源链接；新增示例、练习和答案用于检验理解。遇到版本相关 API 时，应以所用版本的官方文档为准。

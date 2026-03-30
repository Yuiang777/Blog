# JDBC数据库操作

## **一、查找数据**

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

## 二、MyBatis

​	是一款持久层框架，用于简化JDBC的开发，引入MyBatis Framework，配置Mybatis(application.properties中数据库连接信息)

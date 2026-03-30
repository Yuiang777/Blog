const r=`# JDBC数据库操作\r
\r
## **一、查找数据**\r
\r
​	将查询结构封装到User对象中，要引入依赖Driver\r
\r
​	例如：\r
\r
\`\`\`java\r
package com.example.springbootweb1;\r
\r
import lombok.AllArgsConstructor;\r
import lombok.Data;\r
import lombok.NoArgsConstructor;\r
\r
@Data\r
@AllArgsConstructor\r
@NoArgsConstructor\r
public class User {\r
    private Integer id;\r
    private String username;\r
    private String password;\r
    private Integer age;\r
    private String name;\r
}\r
\`\`\`\r
\r
\`\`\`java\r
@Test\r
    public void testSelect() throws Exception {\r
        //1.加载驱动\r
        Class.forName("com.mysql.cj.jdbc.Driver");//mysql 5.0以上版本不需要加载驱动\r
        //2.获取数据库连接\r
        Connection connection = DriverManager.getConnection("jdbc:mysql://localhost:3306/web01","root","YOUR_PASSWORD");//url,用户名，密码
        //3.编写sql语句\r
        Statement statement = connection.createStatement();\r
        //4.执行静态sql语句\r
        ResultSet tn = statement.executeQuery("select * from user");//查询语句\r
        //PreparedStatement ps = connection.prepareStatement("select * from user where id = ? and password = ?");\r
        ps.setString(1 ,"daqiao" );\r
        ResultSet tn = ps.executeQuery();//结果集对象//预编译查询\r
        while (tn.next()){\r
            User user= new User(\r
                    tn.getInt("id"),\r
                    tn.getString("username"),\r
                    tn.getString("password"),\r
                    tn.getInt("age"),\r
                    tn.getString("name")\r
            );\r
            System.out.println(user);\r
\r
\r
        }\r
\`\`\`\r
\r
Resulset(结果集对象): ResultSet tn = statement.executeQuery("select * from user");\r
\r
查询语句：statement.executeQuery("select * from user");\r
\r
​	next():将光标从当前位置向前移动一行，并且判断当前行是否为有效行，返回值为boolean\r
\r
​	true：有效行，当前行有数据\r
​	false：无效行，当前行没有数据\r
\r
getXxx()：获取数据，可以根据列的编号获取，也可以根据列明获取（推荐）。\r
\r
1.**预编译查询：**\r
\r
**PreparedStatement** ps = connection.prepareStatement("select * from user where id = ? and password = ?");**\r
        **ps.setString(1 ,"daqiao" );**\r
        **ResultSet** tn = ps.executeQuery();//结果集对象//预编译查询**\r
\r
2.**静态查询**：\r
\r
  ResultSet tn = statement.executeQuery("select * from user");//查询语句\r
\r
区别：预编译的安全和性能更高\r
\r
​	优势1：可以防止sql防止注入，更安全\r
\r
​		SQL注入：通过控制输入来修改事先定义好的SQL语句，以达到执行代码对服务器进行攻击的方法。\r
\r
​	优势2：性能更高\r
\r
​		正常流程是线SQL语法解析检查->优化SQL->编译SQL->执行SQL\r
\r
​	静态需要执行很多次，而预编译则先放入缓存，在直接再往缓存里拿出来这条相同的SQL语句直接编译\r
\r
扩展：登陆系统通过查询记录count值是否是0，0则是没有。\r
\r
## 二、MyBatis\r
\r
​	是一款持久层框架，用于简化JDBC的开发，引入MyBatis Framework，配置Mybatis(application.properties中数据库连接信息)
`;export{r as default};

const n=`**本质**\r
\r
​	sun公司官方定义的一套操作所有关系型数据库的规范，即接口。\r
\r
​	各个数据库厂商去实现这套接口，提供数据库驱动jar包\r
\r
​	可以使用这套接口（JDBC）编程，真正执行的代码时驱动jar包中的实现类\r
\r
​	1.在maven项目，引入依赖，并准备数据库表user。\r
\r
\`\`\`java\r
<dependency>\r
	<groupId>com.mysql</groupId>\r
    <artifactId>mysql-connector-j</artifactId>\r
    <version>8.0.33</version>\r
</dependency>\r
\`\`\`\r
\r
​	2.代码实现：编写JDBC程序，操作数据库\r
\r
​	\r
\r
\`\`\`JAVA\r
//1.注册驱动\r
Class.forName("com.mysql.cj.jdbc.Driver");\r
//2.获取连接\r
String url = "jdbc:mysql://localhost:3306/web01";\r
String username = "root";\r
String password = "1234";\r
Connection connection = DriverManager.getConnection(url,username,password);\r
//3.获取SQL语句执行对象\r
Statement statement = connection.createStatement();\r
//4.执行SQL\r
int i = statement.executeUpdate("update user set age = 25 where id = 1");\r
//5.释放资源\r
statement.close();\r
connection.close();\r
\`\`\`\r
\r
`;export{n as default};

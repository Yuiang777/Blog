const r=`### 准备工作\r
\r
​	1.创建SpringBoot工程、引入Mybatis相关依赖\r
\r
​	2.准备数据库表user、实体类User\r
\r
​	3.配置Mybatis（在application.properties中数据库连接信息）\r
\r
\`\`\`java\r
# 数据库连接配置\r
spring.datasource.url=jdbc:mysql://localhost:3306/web01\r
spring.datasource.username=root\r
spring.datasource.password=YOUR_PASSWORD\r
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver\r
\`\`\`\r
\r
### 一、编写Mybatis程序:\r
\r
与JDBC不同的是，先前的数据库配置的相关代码写在application.properties文件中\r
\r
\`\`\`java\r
# 数据库连接配置\r
spring.datasource.url=jdbc:mysql://localhost:3306/web01\r
spring.datasource.username=root\r
spring.datasource.password=YOUR_PASSWORD\r
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver\r
\`\`\`\r
\r
 \r
\r
​	编写Mybatis的持久层接口，定义SQL（注释/XML），定义Mapper接口\r
\r
​	持久层接口命名规范为XxxMapper，也成为Mapper接口。\r
\r
\`\`\`java\r
@Mapper// 应用程序在运行时，会自动的为该接口创建一个实现类对象（代理对象），并且会自动将该实现类对象存入IOC容器 - bean\r
public interface UserMapper{\r
    @Select("select * from user")\r
    public List<User> findAll();\r
}\r
\`\`\`\r
\r
在测试类中\r
\r
\`\`\`java\r
SpringBootTest // 加载SpringBoot的配置文件,当前测试类中的测试方法运行时，会启动springboot项目 - IOC容器\r
class MybatisApplicationTests {\r
    @Autowired//自动注入#分层解耦\r
    private UserMapper userMapper;\r
\r
    @Test\r
    public void test(){\r
        List<User> userlist =  userMapper.findAll();\r
        userlist.forEach(System.out::println);\r
    }\r
\r
}\r
\`\`\`\r
\r
### 二、数据库连接池\r
\r
基于DataSource的官方连接池的接口\r
\r
​	优势：资源复用、提升系统响应速度\r
\r
​	产品：C3P0、DBCP、Druid、Hikari(默认)\r
\r
1.数据库连接池是一个容器，负责分配、管理数据库连接（Connection）。\r
\r
2.它允许应用程序重复使用一个现有的数据库来凝结，而不是再重新建立一个。\r
\r
3.释放空闲时间超过最大空闲时间的连接，来避免因为没有释放来连接而引起的数据库连接遗漏。\r
\r
优点：\r
\r
​	1.资源重用\r
\r
​	2.提升系统响应速度\r
\r
​	3.避免数据库连接遗漏\r
\r
#### Druid连接池\r
\r
​	pom引入依赖\r
\r
​	\r
\r
\`\`\`java\r
<dependency>\r
\r
    <groupId>com.alibaba</groupId>\r
\r
    <artifactId>druid</artifactId>\r
\r
    <version>1.1.9</version>\r
\r
</dependency>\r
\`\`\`\r
\r
​	配置application.properties文件\r
\r
\`\`\`java\r
# 数据库连接配置\r
spring.datasource.type=com.alibaba.druid.pool.DruidDataSource\r
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver\r
spring.datasource.url=jdbc:mysql://localhost:3306/web01\r
spring.datasource.username=root\r
spring.datasource.password=YOUR_PASSWORD\r
\`\`\`\r
\r
### 三、增删改查\r
\r
#### 	删除语句\r
\r
​	SQL:delete form user where id = 5;\r
\r
​	Mapper接口：\r
\r
\`\`\`java\r
#预编译语句\r
@Delete("delete from user where id = #{id}")\r
public void deleteById(Integer id);\r
#若将void改为Integer的话，返回值就是该DML语句执行完毕影响的行数\r
\`\`\`\r
\r
​	测试类：\r
\r
\`\`\`java\r
@Test\r
public void testDelete(){\r
userMapper.deleteById(1);\r
}\r
\`\`\`\r
\r
Mybatis中的#和$\r
\r
| 符号   | 说明                                               | 场景                       | 优缺点             |\r
| ------ | -------------------------------------------------- | -------------------------- | ------------------ |\r
| #(...) | 占位符。执行时会将#(...)替换为?，生成预编译SQL     | 参数值传递                 | 安全、性能高(推荐) |\r
| $(...) | 拼接符。直接将参数拼接在SQL语句中，存在SQL注入问题 | 表名、字段名动态设置时使用 | 不安全、性能低     |\r
\r
#### 	插入语句\r
\r
​	SQL：insert into user(username,password,....) values('username','4564'....);\r
\r
​	Mapper接口:\r
\r
\`\`\`java\r
@Insert("insert into user(username,password,age,name) values(#{username},#{password},#{age},#{name})")\r
public void Insert(User user);\r
\`\`\`\r
\r
\r
\r
​	测试类：\r
\r
\`\`\`java\r
@Test\r
public void testInsert(){\r
    User user = new User();// = new User(null , null ...);\r
    user.setUsername("zhangsan");\r
    user.setPassword("123456");\r
    user.setAge(18);\r
    user.setName("张三");\r
    userMapper.Insert(user);\r
}\r
\`\`\`\r
\r
#### 	修改语句\r
\r
​	SQL：update user set username = '...' , password = '11111'.... where id = 1\r
\r
​	Mapper接口：\r
\r
\`\`\`java\r
@Update("update user set username=#{username},password=#{password},age=#{age},name=#{name} where id=#{id}")\r
public void update(User user);\r
\`\`\`\r
\r
​	测试类：\r
\r
\`\`\`java\r
@Test\r
public void testUpdate(){\r
    User user = new User();\r
    user.setId(6);\r
    user.setUsername("liubei");\r
    user.setPassword("123456");\r
    user.setAge(18);\r
    user.setName("张三");\r
    userMapper.update(user);\r
}\r
\`\`\`\r
\r
#### 	查询语句\r
\r
​	SQL：select * from where username = '...' and password = '....';\r
\r
​	Mapper接口：\r
\r
\`\`\`java\r
@Select("select * from user where id=#{id} and username=#{username}")\r
 \r
public User findByIdAndUsername(@Param("id") Integer id,@Param("username") String username); \r
//当给形参传值的时候形参的名字并没有被保存，所以要用Param这个注解来自给他取名字，而打括号里面写的属性名，并没有改变，所以可以不用这个注解\r
\`\`\`\r
\r
​	测试类：\r
\r
\`\`\`java\r
@Test\r
public void testFindByIdAndUsername(){\r
    User user = userMapper.findByIdAndUsername(6,"liubei");\r
}\r
\`\`\`\r
\r
**注意：**当使用了@Param注解来声明参数的时候，SQL语句取值使用#{}，\${}取值都可以。\r
\r
   当不使用@Param注解声明参数的时候，必须使用的是#{}来取参数。使用\${}方式取值会报错。\r
\r
   不使用@Param注解时，参数只能有一个，并且是Javabean。在SQL语句里可以引用JavaBean的属性，而且只能引用JavaBean的属性。\r
\r
如果基于官方骨架船舰的springboot项目中，接口编译时会保留方法形参名，@Param注解可以省略（#{形参名}）\r
\r
### XML映射配置\r
\r
​	再Mybatis中，既可以通过注解配置SQL语句，也可以通过XML配置文件配置SQL语句//**注意**：创建目录的时候不要用.要用/，并且要把原接口中的注解注销掉。\r
\r
​	规则：\r
\r
 	1. XML映射文件的名称与Mapper接口名称一致，并且将XML映射文件和Mapper接口放置在相同包下(同包同名)\r
 	2. 2.XML映射文件的namespace属性为Mapper接口全限定名一致\r
 	3. XML映射文件中SQL语句的id与Mapper接口中的方法名一致，并保持返回类型一致。\r
\r
\`\`\`java\r
<?xml version="1.0" encoding="UTF-8" ?>\r
<!DOCTYPE mapper\r
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"\r
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">\r
<mapper namespace= "com.example.mybatis.mapper.UserMapper">\r
    <select id="findAll" resultType="com.example.mybatis.pojo.User">\r
        select * from user\r
    </select>\r
</mapper>\r
\`\`\`\r
\r
在resources目录中建立与UserMapper引用相同的目录，文件名也要相同，映射。\r
\r
例如：![xml文件规则](./img/xml文件规则.png)\r
\r
\r
\r
**使用Mybatis的注解，主要完成一些简单的增删改查功能，如果需要实现复杂的SQL功能，建议使用XML来配置映射语句。**\r
\r
官方：https://mybatis.net.cn/getting-started.html\r
\r
\r
\r
\r
\r
#### 	辅助配置\r
\r
1.如果没有按照同包同名来，可以在 [application.properties](F:\\javaproject\\newproject\\springboot-web-1\\Mybatis\\src\\main\\resources\\application.properties) 加入\r
\r
\`\`\`java\r
#配置mybatis的mapper接口的扫描包\r
mybatis.mapper-locations=classpath:mapper/*.xml\r
\`\`\`\r
\r
在这个mapper目录下寻找xml文件。\r
\r
2.MybatisX插件，提高效率（🐦飞起来）\r
\r
\r
\r
### 动态SQL\r
\r
#### where\r
\r
1.通过<where>标签可以自动将and保留或删除\r
\r
#### if\r
\r
2.通过<if test="">标签可以进行判断语句\r
\r
\`\`\`java\r
<?xml version="1.0" encoding="UTF-8" ?>\r
<!DOCTYPE mapper\r
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"\r
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">\r
<mapper namespace="com.webproject.mapper.EmpMapper">\r
    <select id="selectList" resultType="com.webproject.pojo.Emp">\r
        select emp.* , dept.name deptName\r
        from emp\r
        left outer join dept on emp.dept_id = dept.id\r
        <where>\r
            <if test="name != null">\r
                emp.name like concat('%',#{name},'%')\r
            </if>\r
            <if test="gender != null">\r
                and emp.gender = #{gender}\r
            </if>\r
            <if test="begin != null and end != null">\r
                and emp.entry_date between #{begin} and #{end}\r
            </if>\r
        </where>\r
        order by emp.update_time desc\r
    </select>\r
</mapper>\r
\`\`\`\r
\r
#### choose、when、otherwise\r
\r
<iframe id="aswift_5" name="aswift_5" browsingtopics="true" sandbox="allow-forms allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts allow-top-navigation-by-user-activation" width="1200" height="0" frameborder="0" marginwidth="0" marginheight="0" vspace="0" hspace="0" allowtransparency="true" scrolling="no" allow="attribution-reporting; run-ad-auction" src="https://googleads.g.doubleclick.net/pagead/ads?client=ca-pub-6117966252207595&amp;output=html&amp;h=280&amp;adk=1221122396&amp;adf=1677598752&amp;w=1200&amp;abgtt=9&amp;fwrn=4&amp;fwrnh=100&amp;lmt=1747322009&amp;num_ads=1&amp;rafmt=1&amp;armr=3&amp;sem=mc&amp;pwprc=3035314289&amp;ad_type=text_image&amp;format=1200x280&amp;url=https%3A%2F%2Fmybatis.net.cn%2Fdynamic-sql.html&amp;fwr=0&amp;pra=3&amp;rh=200&amp;rw=1368&amp;rpe=1&amp;resp_fmts=3&amp;wgl=1&amp;fa=27&amp;uach=WyJXaW5kb3dzIiwiMTkuMC4wIiwieDg2IiwiIiwiMTM2LjAuMzI0MC42NCIsbnVsbCwwLG51bGwsIjY0IixbWyJDaHJvbWl1bSIsIjEzNi4wLjcxMDMuOTMiXSxbIk1pY3Jvc29mdCBFZGdlIiwiMTM2LjAuMzI0MC42NCJdLFsiTm90LkEvQnJhbmQiLCI5OS4wLjAuMCJdXSwwXQ..&amp;dt=1747322008992&amp;bpp=1&amp;bdt=749&amp;idt=-M&amp;shv=r20250513&amp;mjsv=m202505120101&amp;ptt=9&amp;saldr=aa&amp;abxe=1&amp;cookie=ID%3D48248a0d7119835f%3AT%3D1743957615%3ART%3D1747322011%3AS%3DALNI_MYk26n5iU4Q9-qcPnBNuFgxS1q8RA&amp;gpic=UID%3D0000108de651e64d%3AT%3D1743957615%3ART%3D1747322011%3AS%3DALNI_MYieFXOYpU_4wpYu9gOzWMQJxk5lQ&amp;eo_id_str=ID%3Da9719ef2a57a0f75%3AT%3D1743957615%3ART%3D1747322011%3AS%3DAA-AfjawU5TX6lvVwBOLsw0ER7Fv&amp;prev_fmts=0x0%2C1200x280%2C1684x973%2C1005x124%2C1200x280&amp;nras=6&amp;correlator=1790473853956&amp;frm=20&amp;pv=1&amp;u_tz=480&amp;u_his=2&amp;u_h=1067&amp;u_w=1707&amp;u_ah=1067&amp;u_aw=1707&amp;u_cd=30&amp;u_sd=1.5&amp;dmc=8&amp;adx=380&amp;ady=1727&amp;biw=1684&amp;bih=988&amp;scr_x=0&amp;scr_y=0&amp;eid=42532523%2C95353386%2C95360815%2C31092421%2C95360958%2C31091873%2C95360950&amp;oid=2&amp;pvsid=4623226852973723&amp;tmod=716970385&amp;wsm=1&amp;uas=0&amp;nvt=1&amp;ref=https%3A%2F%2Fmybatis.net.cn%2F&amp;fc=1408&amp;brdim=0%2C0%2C0%2C0%2C1707%2C0%2C1707%2C1067%2C1699%2C988&amp;vis=1&amp;rsz=%7C%7Cs%7C&amp;abl=NS&amp;fu=128&amp;bc=31&amp;bz=1&amp;td=1&amp;tdf=2&amp;psd=W251bGwsbnVsbCxudWxsLDNd&amp;nt=1&amp;ifi=6&amp;uci=a!6&amp;btvi=3&amp;fsb=1&amp;dtd=45" data-google-container-id="a!6" tabindex="0" title="Advertisement" aria-label="Advertisement" data-google-query-id="CNrxieHhpY0DFYKI6QUdxrAesQ" data-load-complete="true" style="box-sizing: border-box; left: 0px; top: 0px; border: 0px; width: 1200px; height: 0px;"></iframe>\r
\r
有时候，我们不想使用所有的条件，而只是想从多个条件中选择一个使用。针对这种情况，MyBatis 提供了 choose 元素，它有点像 Java 中的 switch 语句。\r
\r
还是上面的例子，但是策略变为：传入了 “title” 就按 “title” 查找，传入了 “author” 就按 “author” 查找的情形。若两者都没有传入，就返回标记为 featured 的 BLOG（这可能是管理员认为，与其返回大量的无意义随机 Blog，还不如返回一些由管理员挑选的 Blog）。\r
\r
\`\`\`java\r
<select id="findActiveBlogLike"\r
     resultType="Blog">\r
  SELECT * FROM BLOG WHERE state = ‘ACTIVE’\r
  <choose>\r
    <when test="title != null">\r
      AND title like #{title}\r
    </when>\r
    <when test="author != null and author.name != null">\r
      AND author_name like #{author.name}\r
    </when>\r
    <otherwise>\r
      AND featured = 1\r
    </otherwise>\r
  </choose>\r
</select>\r
\`\`\`\r
\r
\r
\r
#### trim、where、set\r
\r
<iframe id="aswift_6" name="aswift_6" browsingtopics="true" sandbox="allow-forms allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts allow-top-navigation-by-user-activation" width="1200" height="0" frameborder="0" marginwidth="0" marginheight="0" vspace="0" hspace="0" allowtransparency="true" scrolling="no" allow="attribution-reporting; run-ad-auction" src="https://googleads.g.doubleclick.net/pagead/ads?client=ca-pub-6117966252207595&amp;output=html&amp;h=280&amp;adk=1792289275&amp;adf=1591901163&amp;w=1200&amp;abgtt=9&amp;fwrn=4&amp;fwrnh=100&amp;lmt=1747322009&amp;num_ads=1&amp;rafmt=1&amp;armr=3&amp;sem=mc&amp;pwprc=3035314289&amp;ad_type=text_image&amp;format=1200x280&amp;url=https%3A%2F%2Fmybatis.net.cn%2Fdynamic-sql.html&amp;fwr=0&amp;pra=3&amp;rh=200&amp;rw=1368&amp;rpe=1&amp;resp_fmts=3&amp;wgl=1&amp;fa=27&amp;uach=WyJXaW5kb3dzIiwiMTkuMC4wIiwieDg2IiwiIiwiMTM2LjAuMzI0MC42NCIsbnVsbCwwLG51bGwsIjY0IixbWyJDaHJvbWl1bSIsIjEzNi4wLjcxMDMuOTMiXSxbIk1pY3Jvc29mdCBFZGdlIiwiMTM2LjAuMzI0MC42NCJdLFsiTm90LkEvQnJhbmQiLCI5OS4wLjAuMCJdXSwwXQ..&amp;dt=1747322008992&amp;bpp=1&amp;bdt=750&amp;idt=-M&amp;shv=r20250513&amp;mjsv=m202505120101&amp;ptt=9&amp;saldr=aa&amp;abxe=1&amp;cookie=ID%3D48248a0d7119835f%3AT%3D1743957615%3ART%3D1747322011%3AS%3DALNI_MYk26n5iU4Q9-qcPnBNuFgxS1q8RA&amp;gpic=UID%3D0000108de651e64d%3AT%3D1743957615%3ART%3D1747322011%3AS%3DALNI_MYieFXOYpU_4wpYu9gOzWMQJxk5lQ&amp;eo_id_str=ID%3Da9719ef2a57a0f75%3AT%3D1743957615%3ART%3D1747322011%3AS%3DAA-AfjawU5TX6lvVwBOLsw0ER7Fv&amp;prev_fmts=0x0%2C1200x280%2C1684x973%2C1005x124%2C1200x280%2C1200x280&amp;nras=7&amp;correlator=1790473853956&amp;frm=20&amp;pv=1&amp;u_tz=480&amp;u_his=2&amp;u_h=1067&amp;u_w=1707&amp;u_ah=1067&amp;u_aw=1707&amp;u_cd=30&amp;u_sd=1.5&amp;dmc=8&amp;adx=380&amp;ady=2472&amp;biw=1684&amp;bih=988&amp;scr_x=0&amp;scr_y=0&amp;eid=42532523%2C95353386%2C95360815%2C31092421%2C95360958%2C31091873%2C95360950&amp;oid=2&amp;pvsid=4623226852973723&amp;tmod=716970385&amp;wsm=1&amp;uas=0&amp;nvt=1&amp;ref=https%3A%2F%2Fmybatis.net.cn%2F&amp;fc=1408&amp;brdim=0%2C0%2C0%2C0%2C1707%2C0%2C1707%2C1067%2C1699%2C988&amp;vis=1&amp;rsz=%7C%7Cs%7C&amp;abl=NS&amp;fu=128&amp;bc=31&amp;bz=1&amp;td=1&amp;tdf=2&amp;psd=W251bGwsbnVsbCxudWxsLDNd&amp;nt=1&amp;ifi=7&amp;uci=a!7&amp;btvi=4&amp;fsb=1&amp;dtd=47" data-google-container-id="a!7" tabindex="0" title="Advertisement" aria-label="Advertisement" data-google-query-id="CNLtieHhpY0DFdOH6QUdt2IItg" data-load-complete="true" style="box-sizing: border-box; left: 0px; top: 0px; border: 0px; width: 1200px; height: 0px;"></iframe>\r
\r
前面几个例子已经合宜地解决了一个臭名昭著的动态 SQL 问题。现在回到之前的 “if” 示例，这次我们将 “state = ‘ACTIVE’” 设置成动态条件，看看会发生什么。\r
\r
\`\`\`java\r
<select id="findActiveBlogLike"\r
     resultType="Blog">\r
  SELECT * FROM BLOG\r
  WHERE\r
  <if test="state != null">\r
    state = #{state}\r
  </if>\r
  <if test="title != null">\r
    AND title like #{title}\r
  </if>\r
  <if test="author != null and author.name != null">\r
    AND author_name like #{author.name}\r
  </if>\r
</select>\r
\`\`\`\r
\r
如果没有匹配的条件会怎么样？最终这条 SQL 会变成这样：\r
\r
<iframe id="aswift_7" name="aswift_7" browsingtopics="true" sandbox="allow-forms allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts allow-top-navigation-by-user-activation" width="1200" height="0" frameborder="0" marginwidth="0" marginheight="0" vspace="0" hspace="0" allowtransparency="true" scrolling="no" allow="attribution-reporting; run-ad-auction" src="https://googleads.g.doubleclick.net/pagead/ads?client=ca-pub-6117966252207595&amp;output=html&amp;h=280&amp;adk=1792289275&amp;adf=3841663317&amp;w=1200&amp;abgtt=9&amp;fwrn=4&amp;fwrnh=100&amp;lmt=1747322009&amp;num_ads=1&amp;rafmt=1&amp;armr=3&amp;sem=mc&amp;pwprc=3035314289&amp;ad_type=text_image&amp;format=1200x280&amp;url=https%3A%2F%2Fmybatis.net.cn%2Fdynamic-sql.html&amp;fwr=0&amp;pra=3&amp;rh=200&amp;rw=1368&amp;rpe=1&amp;resp_fmts=3&amp;wgl=1&amp;fa=27&amp;uach=WyJXaW5kb3dzIiwiMTkuMC4wIiwieDg2IiwiIiwiMTM2LjAuMzI0MC42NCIsbnVsbCwwLG51bGwsIjY0IixbWyJDaHJvbWl1bSIsIjEzNi4wLjcxMDMuOTMiXSxbIk1pY3Jvc29mdCBFZGdlIiwiMTM2LjAuMzI0MC42NCJdLFsiTm90LkEvQnJhbmQiLCI5OS4wLjAuMCJdXSwwXQ..&amp;dt=1747322008992&amp;bpp=1&amp;bdt=750&amp;idt=1&amp;shv=r20250513&amp;mjsv=m202505120101&amp;ptt=9&amp;saldr=aa&amp;abxe=1&amp;cookie=ID%3D48248a0d7119835f%3AT%3D1743957615%3ART%3D1747322011%3AS%3DALNI_MYk26n5iU4Q9-qcPnBNuFgxS1q8RA&amp;gpic=UID%3D0000108de651e64d%3AT%3D1743957615%3ART%3D1747322011%3AS%3DALNI_MYieFXOYpU_4wpYu9gOzWMQJxk5lQ&amp;eo_id_str=ID%3Da9719ef2a57a0f75%3AT%3D1743957615%3ART%3D1747322011%3AS%3DAA-AfjawU5TX6lvVwBOLsw0ER7Fv&amp;prev_fmts=0x0%2C1200x280%2C1684x973%2C1005x124%2C1200x280%2C1200x280%2C1200x280&amp;nras=8&amp;correlator=1790473853956&amp;frm=20&amp;pv=1&amp;u_tz=480&amp;u_his=2&amp;u_h=1067&amp;u_w=1707&amp;u_ah=1067&amp;u_aw=1707&amp;u_cd=30&amp;u_sd=1.5&amp;dmc=8&amp;adx=380&amp;ady=3123&amp;biw=1684&amp;bih=988&amp;scr_x=0&amp;scr_y=0&amp;eid=42532523%2C95353386%2C95360815%2C31092421%2C95360958%2C31091873%2C95360950&amp;oid=2&amp;pvsid=4623226852973723&amp;tmod=716970385&amp;wsm=1&amp;uas=0&amp;nvt=1&amp;ref=https%3A%2F%2Fmybatis.net.cn%2F&amp;fc=1408&amp;brdim=0%2C0%2C0%2C0%2C1707%2C0%2C1707%2C1067%2C1699%2C988&amp;vis=1&amp;rsz=%7C%7Cs%7C&amp;abl=NS&amp;fu=128&amp;bc=31&amp;bz=1&amp;td=1&amp;tdf=2&amp;psd=W251bGwsbnVsbCxudWxsLDNd&amp;nt=1&amp;ifi=8&amp;uci=a!8&amp;btvi=5&amp;fsb=1&amp;dtd=50" data-google-container-id="a!8" tabindex="0" title="Advertisement" aria-label="Advertisement" data-google-query-id="CI74ieHhpY0DFdet6QUd3Joseg" data-load-complete="true" style="box-sizing: border-box; left: 0px; top: 0px; border: 0px; width: 1200px; height: 0px;"></iframe>\r
\r
\`\`\`mysql\r
SELECT * FROM BLOG\r
WHERE\r
\`\`\`\r
\r
这会导致查询失败。如果匹配的只是第二个条件又会怎样？这条 SQL 会是这样:\r
\r
\`\`\`mysql\r
SELECT * FROM BLOG\r
WHERE\r
AND title like ‘someTitle’\r
\`\`\`\r
\r
这个查询也会失败。这个问题不能简单地用条件元素来解决。这个问题是如此的难以解决，以至于解决过的人不会再想碰到这种问题。\r
\r
MyBatis 有一个简单且适合大多数场景的解决办法。而在其他场景中，可以对其进行自定义以符合需求。而这，只需要一处简单的改动：\r
\r
\`\`\`java\r
<select id="findActiveBlogLike"\r
     resultType="Blog">\r
  SELECT * FROM BLOG\r
  <where>\r
    <if test="state != null">\r
         state = #{state}\r
    </if>\r
    <if test="title != null">\r
        AND title like #{title}\r
    </if>\r
    <if test="author != null and author.name != null">\r
        AND author_name like #{author.name}\r
    </if>\r
  </where>\r
</select>\r
\`\`\`\r
\r
<iframe id="aswift_8" name="aswift_8" browsingtopics="true" sandbox="allow-forms allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts allow-top-navigation-by-user-activation" width="1200" height="0" frameborder="0" marginwidth="0" marginheight="0" vspace="0" hspace="0" allowtransparency="true" scrolling="no" allow="attribution-reporting; run-ad-auction" src="https://googleads.g.doubleclick.net/pagead/ads?client=ca-pub-6117966252207595&amp;output=html&amp;h=280&amp;adk=1792289275&amp;adf=2234308463&amp;w=1200&amp;abgtt=9&amp;fwrn=4&amp;fwrnh=100&amp;lmt=1747322009&amp;num_ads=1&amp;rafmt=1&amp;armr=3&amp;sem=mc&amp;pwprc=3035314289&amp;ad_type=text_image&amp;format=1200x280&amp;url=https%3A%2F%2Fmybatis.net.cn%2Fdynamic-sql.html&amp;fwr=0&amp;pra=3&amp;rh=200&amp;rw=1368&amp;rpe=1&amp;resp_fmts=3&amp;wgl=1&amp;fa=27&amp;uach=WyJXaW5kb3dzIiwiMTkuMC4wIiwieDg2IiwiIiwiMTM2LjAuMzI0MC42NCIsbnVsbCwwLG51bGwsIjY0IixbWyJDaHJvbWl1bSIsIjEzNi4wLjcxMDMuOTMiXSxbIk1pY3Jvc29mdCBFZGdlIiwiMTM2LjAuMzI0MC42NCJdLFsiTm90LkEvQnJhbmQiLCI5OS4wLjAuMCJdXSwwXQ..&amp;dt=1747322008995&amp;bpp=1&amp;bdt=752&amp;idt=0&amp;shv=r20250513&amp;mjsv=m202505120101&amp;ptt=9&amp;saldr=aa&amp;abxe=1&amp;cookie=ID%3D48248a0d7119835f%3AT%3D1743957615%3ART%3D1747322011%3AS%3DALNI_MYk26n5iU4Q9-qcPnBNuFgxS1q8RA&amp;gpic=UID%3D0000108de651e64d%3AT%3D1743957615%3ART%3D1747322011%3AS%3DALNI_MYieFXOYpU_4wpYu9gOzWMQJxk5lQ&amp;eo_id_str=ID%3Da9719ef2a57a0f75%3AT%3D1743957615%3ART%3D1747322011%3AS%3DAA-AfjawU5TX6lvVwBOLsw0ER7Fv&amp;prev_fmts=0x0%2C1200x280%2C1684x973%2C1005x124%2C1200x280%2C1200x280%2C1200x280%2C1200x280&amp;nras=9&amp;correlator=1790473853956&amp;frm=20&amp;pv=1&amp;u_tz=480&amp;u_his=2&amp;u_h=1067&amp;u_w=1707&amp;u_ah=1067&amp;u_aw=1707&amp;u_cd=30&amp;u_sd=1.5&amp;dmc=8&amp;adx=380&amp;ady=3985&amp;biw=1684&amp;bih=988&amp;scr_x=0&amp;scr_y=57&amp;eid=42532523%2C95353386%2C95360815%2C31092421%2C95360958%2C31091873%2C95360950&amp;oid=2&amp;pvsid=4623226852973723&amp;tmod=716970385&amp;wsm=1&amp;uas=0&amp;nvt=1&amp;ref=https%3A%2F%2Fmybatis.net.cn%2F&amp;fc=1408&amp;brdim=0%2C0%2C0%2C0%2C1707%2C0%2C1707%2C1067%2C1699%2C988&amp;vis=1&amp;rsz=%7C%7Cs%7C&amp;abl=NS&amp;fu=128&amp;bc=31&amp;bz=1&amp;td=1&amp;tdf=2&amp;psd=W251bGwsbnVsbCxudWxsLDNd&amp;nt=1&amp;ifi=9&amp;uci=a!9&amp;btvi=6&amp;fsb=1&amp;dtd=61" data-google-container-id="a!9" tabindex="0" title="Advertisement" aria-label="Advertisement" data-google-query-id="CJaFiuHhpY0DFXmG6QUdpUoEyA" data-load-complete="true" style="box-sizing: border-box; left: 0px; top: 0px; border: 0px; width: 1200px; height: 0px;"></iframe>\r
\r
*where* 元素只会在子元素返回任何内容的情况下才插入 “WHERE” 子句。而且，若子句的开头为 “AND” 或 “OR”，*where* 元素也会将它们去除。\r
\r
如果 *where* 元素与你期望的不太一样，你也可以通过自定义 trim 元素来定制 *where* 元素的功能。比如，和 *where* 元素等价的自定义 trim 元素为：\r
\r
\`\`\`java\r
<trim prefix="WHERE" prefixOverrides="AND |OR ">\r
  ...\r
</trim>\r
\`\`\`\r
\r
*prefixOverrides* 属性会忽略通过管道符分隔的文本序列（注意此例中的空格是必要的）。上述例子会移除所有 *prefixOverrides* 属性中指定的内容，并且插入 *prefix* 属性中指定的内容。\r
\r
用于动态更新语句的类似解决方案叫做 *set*。*set* 元素可以用于动态包含需要更新的列，忽略其它不更新的列。比如：\r
\r
\`\`\`java\r
<update id="updateAuthorIfNecessary">\r
  update Author\r
    <set>\r
      <if test="username != null">username=#{username},</if>\r
      <if test="password != null">password=#{password},</if>\r
      <if test="email != null">email=#{email},</if>\r
      <if test="bio != null">bio=#{bio}</if>\r
    </set>\r
  where id=#{id}\r
</update>\r
\`\`\`\r
\r
<iframe id="aswift_9" name="aswift_9" browsingtopics="true" sandbox="allow-forms allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts allow-top-navigation-by-user-activation" width="1200" height="0" frameborder="0" marginwidth="0" marginheight="0" vspace="0" hspace="0" allowtransparency="true" scrolling="no" allow="attribution-reporting; run-ad-auction" src="https://googleads.g.doubleclick.net/pagead/ads?client=ca-pub-6117966252207595&amp;output=html&amp;h=280&amp;adk=1792289275&amp;adf=2766429744&amp;w=1200&amp;abgtt=9&amp;fwrn=4&amp;fwrnh=100&amp;lmt=1747322009&amp;num_ads=1&amp;rafmt=1&amp;armr=3&amp;sem=mc&amp;pwprc=3035314289&amp;ad_type=text_image&amp;format=1200x280&amp;url=https%3A%2F%2Fmybatis.net.cn%2Fdynamic-sql.html&amp;fwr=0&amp;pra=3&amp;rh=200&amp;rw=1368&amp;rpe=1&amp;resp_fmts=3&amp;wgl=1&amp;fa=27&amp;uach=WyJXaW5kb3dzIiwiMTkuMC4wIiwieDg2IiwiIiwiMTM2LjAuMzI0MC42NCIsbnVsbCwwLG51bGwsIjY0IixbWyJDaHJvbWl1bSIsIjEzNi4wLjcxMDMuOTMiXSxbIk1pY3Jvc29mdCBFZGdlIiwiMTM2LjAuMzI0MC42NCJdLFsiTm90LkEvQnJhbmQiLCI5OS4wLjAuMCJdXSwwXQ..&amp;dt=1747322008997&amp;bpp=1&amp;bdt=754&amp;idt=0&amp;shv=r20250513&amp;mjsv=m202505120101&amp;ptt=9&amp;saldr=aa&amp;abxe=1&amp;cookie=ID%3D48248a0d7119835f%3AT%3D1743957615%3ART%3D1747322011%3AS%3DALNI_MYk26n5iU4Q9-qcPnBNuFgxS1q8RA&amp;gpic=UID%3D0000108de651e64d%3AT%3D1743957615%3ART%3D1747322011%3AS%3DALNI_MYieFXOYpU_4wpYu9gOzWMQJxk5lQ&amp;eo_id_str=ID%3Da9719ef2a57a0f75%3AT%3D1743957615%3ART%3D1747322011%3AS%3DAA-AfjawU5TX6lvVwBOLsw0ER7Fv&amp;prev_fmts=0x0%2C1200x280%2C1684x973%2C1005x124%2C1200x280%2C1200x280%2C1200x280%2C1200x280%2C1200x280&amp;nras=10&amp;correlator=1790473853956&amp;frm=20&amp;pv=1&amp;u_tz=480&amp;u_his=2&amp;u_h=1067&amp;u_w=1707&amp;u_ah=1067&amp;u_aw=1707&amp;u_cd=30&amp;u_sd=1.5&amp;dmc=8&amp;adx=380&amp;ady=4167&amp;biw=1684&amp;bih=988&amp;scr_x=0&amp;scr_y=400&amp;eid=42532523%2C95353386%2C95360815%2C31092421%2C95360958%2C31091873%2C95360950&amp;oid=2&amp;psts=AOrYGsnN8f3nI0y_ZLhqqWQN0gMr2KswVM9PnXRdZLDp-Tr1Z7PurPez_pLY8oRM1oXqTpxQrTzf85hwu7Y15_aRhbqOSD4qYIRBz2n5bOHlfxoxS4hFFQ&amp;pvsid=4623226852973723&amp;tmod=716970385&amp;wsm=1&amp;uas=0&amp;nvt=1&amp;ref=https%3A%2F%2Fmybatis.net.cn%2F&amp;fc=1408&amp;brdim=0%2C0%2C0%2C0%2C1707%2C0%2C1707%2C1067%2C1699%2C988&amp;vis=1&amp;rsz=%7C%7Cs%7C&amp;abl=NS&amp;fu=128&amp;bc=31&amp;bz=1&amp;td=1&amp;tdf=2&amp;psd=W251bGwsbnVsbCxudWxsLDNd&amp;nt=1&amp;ifi=10&amp;uci=a!a&amp;btvi=7&amp;fsb=1&amp;dtd=684" data-google-container-id="a!a" tabindex="0" title="Advertisement" aria-label="Advertisement" data-google-query-id="CMTDq-HhpY0DFQKI6QUdYQANxg" data-load-complete="true" style="box-sizing: border-box; left: 0px; top: 0px; border: 0px; width: 1200px; height: 0px;"></iframe>\r
\r
这个例子中，*set* 元素会动态地在行首插入 SET 关键字，并会删掉额外的逗号（这些逗号是在使用条件语句给列赋值时引入的）。\r
\r
来看看与 *set* 元素等价的自定义 *trim* 元素吧：\r
\r
\`\`\`java\r
<trim prefix="SET" suffixOverrides=",">\r
  ...\r
</trim>\r
\`\`\`\r
\r
注意，我们覆盖了后缀值设置，并且自定义了前缀值。\r
\r
#### foreach\r
\r
动态 SQL 的另一个常见使用场景是对集合进行遍历（尤其是在构建 IN 条件语句的时候）。比如：\r
\r
\`\`\`java\r
<select id="selectPostIn" resultType="domain.blog.Post">\r
  SELECT *\r
  FROM POST P\r
  WHERE ID in\r
  <foreach item="item" index="index" collection="list"\r
      open="(" separator="," close=")">\r
        #{item}\r
  </foreach>\r
</select>\r
\`\`\`\r
\r
1.collection：集合名称\r
\r
2.item：集合遍历出来的元素/项\r
\r
3.separator：每一次遍历使用的分隔符\r
\r
4.open：比办理开始前拼接的片段\r
\r
5.close：遍历结束后拼接的片段\r
\r
\r
\r
*foreach* 元素的功能非常强大，它允许你指定一个集合，声明可以在元素体内使用的集合项（item）和索引（index）变量。它也允许你指定开头与结尾的字符串以及集合项迭代之间的分隔符。这个元素也不会错误地添加多余的分隔符，看它多智能！\r
\r
**提示** 你可以将任何可迭代对象（如 List、Set 等）、Map 对象或者数组对象作为集合参数传递给 *foreach*。当使用可迭代对象或者数组时，index 是当前迭代的序号，item 的值是本次迭代获取到的元素。当使用 Map 对象（或者 Map.Entry 对象的集合）时，index 是键，item 是值。\r
\r
至此，我们已经完成了与 XML 配置及映射文件相关的讨论。下一章将详细探讨 Java API，以便你能充分利用已经创建的映射配置。\r
\r
#### script\r
\r
要在带注解的映射器接口类中使用动态 SQL，可以使用 *script* 元素。比如:\r
\r
\`\`\`java\r
    @Update({"<script>",\r
      "update Author",\r
      "  <set>",\r
      "    <if test='username != null'>username=#{username},</if>",\r
      "    <if test='password != null'>password=#{password},</if>",\r
      "    <if test='email != null'>email=#{email},</if>",\r
      "    <if test='bio != null'>bio=#{bio}</if>",\r
      "  </set>",\r
      "where id=#{id}",\r
      "<\/script>"})\r
    void updateAuthorValues(Author author);\r
\`\`\`\r
\r
#### bind\r
\r
<iframe id="aswift_11" name="aswift_11" browsingtopics="true" sandbox="allow-forms allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts allow-top-navigation-by-user-activation" width="1200" height="0" frameborder="0" marginwidth="0" marginheight="0" vspace="0" hspace="0" allowtransparency="true" scrolling="no" allow="attribution-reporting; run-ad-auction" src="https://googleads.g.doubleclick.net/pagead/ads?client=ca-pub-6117966252207595&amp;output=html&amp;h=280&amp;adk=2723956906&amp;adf=3539814763&amp;w=1200&amp;abgtt=9&amp;fwrn=4&amp;fwrnh=100&amp;lmt=1747322010&amp;num_ads=1&amp;rafmt=1&amp;armr=3&amp;sem=mc&amp;pwprc=3035314289&amp;ad_type=text_image&amp;format=1200x280&amp;url=https%3A%2F%2Fmybatis.net.cn%2Fdynamic-sql.html&amp;fwr=0&amp;pra=3&amp;rh=200&amp;rw=1368&amp;rpe=1&amp;resp_fmts=3&amp;wgl=1&amp;fa=27&amp;uach=WyJXaW5kb3dzIiwiMTkuMC4wIiwieDg2IiwiIiwiMTM2LjAuMzI0MC42NCIsbnVsbCwwLG51bGwsIjY0IixbWyJDaHJvbWl1bSIsIjEzNi4wLjcxMDMuOTMiXSxbIk1pY3Jvc29mdCBFZGdlIiwiMTM2LjAuMzI0MC42NCJdLFsiTm90LkEvQnJhbmQiLCI5OS4wLjAuMCJdXSwwXQ..&amp;dt=1747322009001&amp;bpp=1&amp;bdt=758&amp;idt=0&amp;shv=r20250513&amp;mjsv=m202505120101&amp;ptt=9&amp;saldr=aa&amp;abxe=1&amp;cookie=ID%3D48248a0d7119835f%3AT%3D1743957615%3ART%3D1747322011%3AS%3DALNI_MYk26n5iU4Q9-qcPnBNuFgxS1q8RA&amp;gpic=UID%3D0000108de651e64d%3AT%3D1743957615%3ART%3D1747322011%3AS%3DALNI_MYieFXOYpU_4wpYu9gOzWMQJxk5lQ&amp;eo_id_str=ID%3Da9719ef2a57a0f75%3AT%3D1743957615%3ART%3D1747322011%3AS%3DAA-AfjawU5TX6lvVwBOLsw0ER7Fv&amp;prev_fmts=0x0%2C1200x280%2C1684x973%2C1005x124%2C1200x280%2C1200x280%2C1200x280%2C1200x280%2C1200x280%2C1200x280%2C1200x280&amp;nras=12&amp;correlator=1790473853956&amp;frm=20&amp;pv=1&amp;u_tz=480&amp;u_his=2&amp;u_h=1067&amp;u_w=1707&amp;u_ah=1067&amp;u_aw=1707&amp;u_cd=30&amp;u_sd=1.5&amp;dmc=8&amp;adx=380&amp;ady=4644&amp;biw=1684&amp;bih=988&amp;scr_x=0&amp;scr_y=900&amp;eid=42532523%2C95353386%2C95360815%2C31092421%2C95360958%2C31091873%2C95360950&amp;oid=2&amp;psts=AOrYGsnN8f3nI0y_ZLhqqWQN0gMr2KswVM9PnXRdZLDp-Tr1Z7PurPez_pLY8oRM1oXqTpxQrTzf85hwu7Y15_aRhbqOSD4qYIRBz2n5bOHlfxoxS4hFFQ%2CAOrYGsnB4NUqkdJ5XOvfBcc8togfa0gECaFxtQgbKVfmFKNAUmTPnE1wOttBtLgA1GXcVZ5Vqvw6-mfw7z8v8JanF86dVQyl&amp;pvsid=4623226852973723&amp;tmod=716970385&amp;wsm=1&amp;uas=0&amp;nvt=1&amp;ref=https%3A%2F%2Fmybatis.net.cn%2F&amp;fc=1408&amp;brdim=0%2C0%2C0%2C0%2C1707%2C0%2C1707%2C1067%2C1699%2C988&amp;vis=1&amp;rsz=%7C%7Cs%7C&amp;abl=NS&amp;fu=128&amp;bc=31&amp;bz=1&amp;td=1&amp;tdf=2&amp;psd=W251bGwsbnVsbCxudWxsLDNd&amp;nt=1&amp;ifi=12&amp;uci=a!c&amp;btvi=9&amp;fsb=1&amp;dtd=1062" data-google-container-id="a!c" tabindex="0" title="Advertisement" aria-label="Advertisement" data-google-query-id="COqEw-HhpY0DFZOG6QUdXq43VQ" data-load-complete="true" style="box-sizing: border-box; left: 0px; top: 0px; border: 0px; width: 1200px; height: 0px;"></iframe>\r
\r
\`bind\` 元素允许你在 OGNL 表达式以外创建一个变量，并将其绑定到当前的上下文。比如：\r
\r
\`\`\`java\r
<select id="selectBlogsLike" resultType="Blog">\r
  <bind name="pattern" value="'%' + _parameter.getTitle() + '%'" />\r
  SELECT * FROM BLOG\r
  WHERE title LIKE #{pattern}\r
</select>\r
\`\`\`\r
\r
### 注解\r
\r
在MyBatis中，注解的目的是为了取代XML文件的配置项，而@Options注解的作用是设置如下几项：\r
\r
1、useCache，是否使用缓存，默认是true\r
2、fetchSize，获取记录数的限度，默认是-1，没有条数限制\r
3、timeout，设置超时时间，默认是-1，没有时间限制\r
4、useGeneratedKeys，是否自动生成注解，默认是false。\r
5、keyProperty，数据行主键所对应的映射对象的属性，默认是id属性。\r
\r
\r
\r
\r
\r
\r
\r
### 自定义结果ResultMap\r
\r
colum：字段名\r
\r
property：要封装的名字\r
\r
例如：\r
\r
\`\`\`java\r
<!-- 自定义结果ResultMap -->\r
    <resultMap id="empResultMap" type="com.webproject.pojo.Emp">\r
        <id column="id" property="id"/>\r
        <result column="username" property="username"/>\r
        <result column="password" property="password"/>\r
        <result column="name" property="name"/>\r
        <result column="gender" property="gender"/>\r
        <result column="phone" property="phone"/>\r
        <result column="job" property="job"/>\r
        <result column="salary" property="salary"/>\r
        <result column="image" property="image"/>\r
        <result column="entry_date" property="entryDate"/>\r
        <result column="dept_id" property="deptId"/>\r
        <result column="create_time" property="createTime"/>\r
        <result column="update_time" property="updateTime"/>\r
        <!-- 封装工作经历的信息 -->\r
        <collection property="exprList" ofType="com.webproject.pojo.EmpExpr">\r
        <id column="ee_id" property="id"/>\r
        <result column="ee_empid" property="empId"/>\r
        <result column="ee_begin" property="begin"/>\r
        <result column="ee_end" property="end"/>\r
        <result column="ee_company" property="company"/>\r
        <result column="ee_job" property="job"/>\r
        </collection>\r
    </resultMap>\r
\`\`\`\r
\r
id标签：id值\r
\r
result标签：普通属性\r
\r
collection标签：集合\r
\r
#### 关联的嵌套结果映射\r
\r
| 属性            | 描述                                                         |\r
| --------------- | ------------------------------------------------------------ |\r
| \`resultMap\`     | 结果映射的 ID，可以将此关联的嵌套结果集映射到一个合适的对象树中。 它可以作为使用额外 select 语句的替代方案。它可以将多表连接操作的结果映射成一个单一的 \`ResultSet\`。这样的 \`ResultSet\` 有部分数据是重复的。 为了将结果集正确地映射到嵌套的对象树中, MyBatis 允许你“串联”结果映射，以便解决嵌套结果集的问题。使用嵌套结果映射的一个例子在表格以后。 |\r
| \`columnPrefix\`  | 当连接多个表时，你可能会不得不使用列别名来避免在 \`ResultSet\` 中产生重复的列名。指定 columnPrefix 列名前缀允许你将带有这些前缀的列映射到一个外部的结果映射中。 详细说明请参考后面的例子。 |\r
| \`notNullColumn\` | 默认情况下，在至少一个被映射到属性的列不为空时，子对象才会被创建。 你可以在这个属性上指定非空的列来改变默认行为，指定后，Mybatis 将只在这些列中任意一列非空时才创建一个子对象。可以使用逗号分隔来指定多个列。默认值：未设置（unset）。 |\r
| \`autoMapping\`   | 如果设置这个属性，MyBatis 将会为本结果映射开启或者关闭自动映射。 这个属性会覆盖全局的属性 autoMappingBehavior。注意，本属性对外部的结果映射无效，所以不能搭配 \`select\` 或 \`resultMap\` 元素使用。默认值：未设置（unset）。 |\r
| association     | 一对一关联                                                   |\r
\r
\`\`\`sql\r
<select id="selectNodeVoList" resultMap="NodeVoResult">\r
        SELECT\r
        n.id,\r
        n.node_name,\r
        n.address,\r
        n.business_type,\r
        n.region_id,\r
        n.partner_id,\r
        n.create_time,\r
        n.update_time,\r
        n.create_by,\r
        n.update_by,\r
        n.remark,\r
        COUNT(v.id) AS vm_count\r
        FROM\r
        tb_node n\r
        LEFT JOIN\r
        tb_vending_machine v ON n.id = v.node_id\r
        <where>\r
            <if test="nodeName != null  and nodeName != ''"> and n.node_name like concat('%', #{nodeName}, '%')</if>\r
            <if test="regionId != null "> and n.region_id = #{regionId}</if>\r
            <if test="partnerId != null "> and n.partner_id = #{partnerId}</if>\r
        </where>\r
        GROUP BY\r
        n.id\r
    </select>\r
<resultMap id="NodeVoResult" type="NodeVo">\r
    <result property="id"    column="id"    />\r
    <result property="nodeName"    column="node_name"    />\r
    <result property="address"    column="address"    />\r
    <result property="businessType"    column="business_type"    />\r
    <result property="regionId"    column="region_id"    />\r
    <result property="partnerId"    column="partner_id"    />\r
    <result property="createTime"    column="create_time"    />\r
    <result property="updateTime"    column="update_time"    />\r
    <result property="createBy"    column="create_by"    />\r
    <result property="updateBy"    column="update_by"    />\r
    <result property="remark"    column="remark"    />\r
    <result property="vmCount" column="vm_count"/>\r
    <association property="region" javaType="Region" column="region_id" select="com.dkd.manage.mapper.RegionMapper.selectRegionById"/>\r
    <association property="partner" javaType="Partner" column="partner_id" select="com.dkd.manage.mapper.PartnerMapper.selectPartnerById"/>\r
</resultMap>\r
\`\`\`\r
\r
| 属性            | 描述                                                         |\r
| --------------- | ------------------------------------------------------------ |\r
| \`column\`        | 当使用多个结果集时，该属性指定结果集中用于与 \`foreignColumn\` 匹配的列（多个列名以逗号隔开），以识别关系中的父类型与子类型。 |\r
| \`foreignColumn\` | 指定外键对应的列名，指定的列将与父类型中 \`column\` 的给出的列进行匹配。 |\r
| \`resultSet\`     | 指定用于加载复杂类型的结果集名字。                           |\r
\r
| 属性          | 描述                                                         |\r
| ------------- | ------------------------------------------------------------ |\r
| \`property\`    | 映射到列结果的字段或属性。如果用来匹配的 JavaBean 存在给定名字的属性，那么它将会被使用。否则 MyBatis 将会寻找给定名称的字段。 无论是哪一种情形，你都可以使用通常的点式分隔形式进行复杂属性导航。 比如，你可以这样映射一些简单的东西：“username”，或者映射到一些复杂的东西上：“address.street.number”。 |\r
| \`javaType\`    | 一个 Java 类的完全限定名，或一个类型别名（关于内置的类型别名，可以参考上面的表格）。 如果你映射到一个 JavaBean，MyBatis 通常可以推断类型。然而，如果你映射到的是 HashMap，那么你应该明确地指定 javaType 来保证行为与期望的相一致。 |\r
| \`jdbcType\`    | JDBC 类型，所支持的 JDBC 类型参见这个表格之前的“支持的 JDBC 类型”。 只需要在可能执行插入、更新和删除的且允许空值的列上指定 JDBC 类型。这是 JDBC 的要求而非 MyBatis 的要求。如果你直接面向 JDBC 编程，你需要对可能存在空值的列指定这个类型。 |\r
| \`typeHandler\` | 我们在前面讨论过默认的类型处理器。使用这个属性，你可以覆盖默认的类型处理器。 这个属性值是一个类型处理器实现类的完全限定名，或者是类型别名。 |\r
\r
 “ofType” 属性。这个属性非常重要，它用来将 JavaBean（或字段）属性的类型和集合存储的类型区分开来\r
\r
例如：\r
\r
\`\`\`java\r
<collection property="posts" javaType="ArrayList" column="id" ofType="Post" select="selectPostsForBlog"/>\r
\`\`\`\r
`;export{r as default};

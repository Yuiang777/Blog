const e=`## Mapper接口的定义方法\r
\r
### 原始方式-controller层\r
\r
\`\`\`java\r
@Slf4j\r
@RestController\r
@RequestMapping("/emps")\r
public class Empcontroller {\r
    @Autowired\r
    private EmpService empService;\r
    //查询员工列表\r
    @GetMapping()\r
    public Result page(@RequestParam(defaultValue = "1") Integer page,@RequestParam(defaultValue = "10") Integer pageSize){\r
        log.info("查询员工列表:{},{}",page,pageSize);\r
        PageResult<Emp> pageResult =  empService.page(page,pageSize);\r
        return Result.success(pageResult);\r
    }\r
}\r
\`\`\`\r
\r
### 原始方式-mapper层\r
\r
\`\`\`java\r
	//统计符合条件的数量\r
	@Select("select count(*) from emp e ...")\r
	\r
	//查询结果列表\r
	@Select("select e.* from emp e ... limit #{start},#{pageSize}")\r
	public List<Emp> list(Integer start , Integer pageSize);\r
\`\`\`\r
\r
\r
\r
### 原始方式-service层\r
\r
\`\`\`java\r
public PageResult<Emp> page(Integer page, Integer pageSize){\r
//1.获取总记录数\r
Long total = empMapper.count();\r
//2.获取数据列表\r
Interger start = (page - 1) * pageSize;\r
List<Emp> emplist = empMapper.list(start,pageSize);\r
//3.封装分页结果\r
return new PageResult<Emp>(total,empList);\r
}\r
\r
\`\`\`\r
\r
------\r
\r
\r
\r
## PageHelper\r
\r
是第三方提供的在Mybatis框架中实现分页的插件，用来简化分页操作，提高开发效率\r
\r
### PageHelper-mapper层\r
\r
\`\`\`java\r
@Select("select e.* from emp e ...")\r
public List<Emp> list();\r
\`\`\`\r
\r
### PageHelper-service层\r
\r
\`\`\`java\r
public PageResult<Emp> page(Integer page, Integer pageSize){\r
//1.设置分页参数\r
PageHelper.startPge(page, pageSize);\r
//2.调用Mapper接口方法\r
List<Emp> empList = empMapper.list();\r
//3.调用pageHelper的PageInfo对象获取全部数据，用getTotal的方法获取总记录数\r
long total = new PageInfo<Emp>(rows).getTotal();\r
/*通过Page获取数据\r
Page<Emp> pageInfo = (Page<Emp>) rows;\r
long total = pageInfo.getTotal();\r
*/\r
//4.解析并封装结果\r
return newPageResult(...);\r
}\r
\`\`\`\r
\r
**注意：**1.sql语句不能加";"\r
\r
​	    2.仅能根据紧跟在其后的第一个sql语句进行分页处理\r
\r
### PageHelper使用方法\r
\r
1.引入PageHelper的依赖\r
\r
<!--分页插件PageHelper-->\r
<dependency>\r
       <groupId>com.github.pagehelper</groupId>\r
       <artifactId>pagehelper-spring-boot-starter</artifactId>\r
       <version>1.4.7</version>\r
</dependency>\r
\r
2.定义Mapper接口的查询方法(无需考虑分页)\r
\r
3.在Service方法中实现分页查询\r
\r
PageHelper会自动把分页结果的所有信息封装到Page或者PageInfo中了\r
\r
#### Page和PageInfo区别：\r
\r
两者都能获取到数据，\r
\r
Page是一个ArrayListList。之所以可以强转类型，Page就是List接口实现类（多态）\r
\r
PageInfo是一个对象，能获取到的数据比Page多；`;export{e as default};

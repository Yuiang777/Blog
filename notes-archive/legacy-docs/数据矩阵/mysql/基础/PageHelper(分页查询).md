## Mapper接口的定义方法

### 原始方式-controller层

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

### 原始方式-mapper层

```java
	//统计符合条件的数量
	@Select("select count(*) from emp e ...")
	
	//查询结果列表
	@Select("select e.* from emp e ... limit #{start},#{pageSize}")
	public List<Emp> list(Integer start , Integer pageSize);
```



### 原始方式-service层

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



## PageHelper

是第三方提供的在Mybatis框架中实现分页的插件，用来简化分页操作，提高开发效率

### PageHelper-mapper层

```java
@Select("select e.* from emp e ...")
public List<Emp> list();
```

### PageHelper-service层

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

### PageHelper使用方法

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

#### Page和PageInfo区别：

两者都能获取到数据，

Page是一个ArrayListList。之所以可以强转类型，Page就是List接口实现类（多态）

PageInfo是一个对象，能获取到的数据比Page多；
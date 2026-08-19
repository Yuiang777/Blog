# MySQL 完整笔记

> 这是 MySQL 的唯一主笔记。原先分散的 DDL、DML、DQL、函数、约束、多表查询、事务、存储引擎、索引和安装内容已按学习顺序合并。

| 项目 | 说明 |
| --- | --- |
| 难度 | 基础到优化 |
| 适合读者 | 希望把 SQL、表设计、事务、索引、执行计划和运维安装合并学习的开发者 |
| 原始资料 | 16 份分散笔记，已合并并保留到 `notes-archive/legacy-docs/` |

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

- 掌握库表管理、增删改查与权限控制
- 能够设计约束清晰、类型合理的表结构
- 理解事务隔离、锁、InnoDB 与索引
- 能够使用 EXPLAIN 分析并优化查询

## 知识地图

1. 基础操作：DDL、DML、DQL、DCL
2. 数据建模：类型、约束、关联与范式
3. 查询能力：函数、连接、子查询与聚合
4. 性能与可靠性：事务、存储引擎、索引、执行计划

## 核心内容



### SQL 基础总览

#### 数据库与表（DDL）

```mysql
show databases;
show tables;
desc 表名;
show create table 表名;
select database();
use 数据库名;

create database [if not exists] 数据库名 [default charset utf8mb4];
drop database [if exists] 数据库名;

create table 表名 (
  字段1 类型 [comment '注释'],
  字段2 类型 [comment '注释']
) [comment '表注释'];

alter table 表名 add 字段名 类型(长度) [comment '注释'];
alter table 表名 modify 字段名 新类型(长度);
alter table 表名 change 旧字段名 新字段名 类型(长度) [comment '注释'];
alter table 表名 drop 字段名;
alter table 表名 rename to 新表名;

drop table [if exists] 表名;
truncate table 表名;
```

#### 数据操作（DML）

```mysql
insert into 表名(字段1, 字段2, ...) values(值1, 值2, ...);
insert into 表名 values(值1, 值2, ...);
insert into 表名(字段1, 字段2, ...) values(值1, 值2, ...), (值1, 值2, ...);

update 表名 set 字段1 = 值1, 字段2 = 值2 where 条件;

delete from 表名 where 条件;
```

#### 查询（DQL）

```mysql
select 字段1, 字段2 from 表名;
select * from 表名;
select distinct 字段列表 from 表名;

select 字段列表 from 表名 where 条件列表;

select 聚合函数(字段) from 表名;

select 字段列表
from 表名
[where 条件]
group by 分组字段
[having 分组后条件]
order by 字段 排序方式
limit 起始索引, 记录数;
```

执行顺序（记忆版）：

```
from -> where -> group by -> having -> select -> order by -> limit
```

#### 多表查询（Join / Union / 子查询）

```mysql
select ... from 表1 join 表2 on 条件;
select ... from 表1 left join 表2 on 条件;
select ... from 表1 right join 表2 on 条件;

select ... from 表a
union [all]
select ... from 表b;

select * from t1 where col = (select col from t2);
```

#### 约束（Constraints）

- 非空：`not null`
- 唯一：`unique`
- 主键：`primary key`
- 默认：`default`
- 检查（8.0.13+）：`check`
- 外键：`foreign key`
- 自增：`auto_increment`

外键（添加 / 删除）：

```mysql
alter table 子表 add constraint 外键名
foreign key (子表字段) references 主表(主表字段);

alter table 子表 drop foreign key 外键名;
```

级联示例：

```mysql
alter table 子表 add constraint 外键名
foreign key (外键字段) references 主表(主表字段)
on update cascade on delete cascade;
```

#### 事务（ACID / 隔离级别）

```mysql
select @@autocommit;
set @@autocommit = 0;

start transaction;
commit;
rollback;

select @@transaction_isolation;
set session transaction isolation level repeatable read;
```

并发问题速记：脏读 / 不可重复读 / 幻读

#### 用户与权限（DCL）

```mysql
use mysql;
select * from user;

create user '用户名'@'主机名' identified by '密码';
show grants for '用户名'@'主机名';

grant 权限列表 on 数据库名.表名 to '用户名'@'主机名';
revoke 权限列表 on 数据库名.表名 from '用户名'@'主机名';
```

---

### 数据库与表操作

```mysql
查询所有数据库：
show databases；
查询当前数据库
select database();
创建
create database [if not exists] 数据库名 [default charset 字符集] 【collate 排序规则];
删除
drop databases [if exists] 数据库名;
使用
use 数据库名;


mysql -u '数据库用户名' -p

注：其中的【】号可以忽略
DDL -表查询-查询：
查询当前数据库所有表
show tables;
查询表结构
desc表名；
查询指定表的建表语句
show create table 表名；


DDL-表操作-创建
create table 表名（
 字段1 字段1类型[comment 字段1注释]
 字段2 字段2类型[comment 字段2注释]
.........
字段n 字段n类型[comment 字段n注释]
)[commen 表注释]//例如eng设置自增字段的初始值。ine=innodb//修改存储引擎类型;
AUTO_INCREMENT=2 //设置自增字段的初始值。
DEFAULT CHARSET=utf8mb4 //设置表的默认字符集为 utf8mb4。

COLLATE=utf8mb4_bin //设置表的默认排序规则为 utf8mb4_bin
_bin 是 “binary” 的缩写，意味着直接按照字符的二进制编码值进行比较和排序。
这种排序规则是区分大小写的（'A' != 'a'）和区分重音的（'ü' != 'u'）。
另一种常见的规则是 utf8mb4_unicode_ci（ci 表示 Case Insensitive，不区分大小写）。

charecter set [编码格式] //设置字段的编码格式


DLL-表操作-修改
添加字段
alter table 表名 add 字段名 类型（长度）【comment‘名称（可加可不加）’】【约束】；
修改数据类型
alter table 表名modify 字段名 新数据类型（长度）；
修改字段名和字段类型
alter table 表名 change 旧字段名 新字段名 类型（长度） 【comment  ‘用户名’】【约束】；
删除字段
alter table 表名 drop 字段名；
修改表名
alter table 表名 rename to 新表名；


DDL-表操作-删除
删除表
drop table 【if exists】 表名； #其中的【】若有就删除，没有也不报错；
删除指定表，并重新创建该表
truncate table 表名；  #不管哪个都会删除掉内容， 第二个保留表的结构

1.查看变量信息
  显示MySQL服务器的配置变量的值，这个命令常在排查问题的时候用到，用于查看mysql实例的参数配置，经常结合like一起使用，用于过滤指定参数。可以使用show global variables或者show session variables查看全局或者会话参数，默认是查看会话参数。
2.查看数据表的索引信息
  如果我们需要查看某表都创建了哪些索引可以使用show index from table_name的方式查看，默认有主键索引，如果还创建了其他索引通过此方式都可以看到。
  
  
3.使用show grants for user@host 可以查看用户的授权，如果用户的host是任意源可以省略；也可以直接输入show grants查看当前用户的权限。


4.查看数据库创建信息
  使用show create 可以查看创建数据库、事件、函数、存储过程、触发器、视图等的信息，需要对应的名称。

mysql> show create database testdb;
SHOW CREATE DATABASE db_name
SHOW CREATE EVENT event_name
SHOW CREATE FUNCTION func_name
SHOW CREATE PROCEDURE proc_name
SHOW CREATE TRIGGER trigger_name
SHOW CREATE VIEW view_name


5、查看最近事件
mysql> show events;
Empty set (0.00 sec)

6、查看最近告警
mysql> show warnings;
Empty set (0.00 sec)

7、查看最近错误
mysql> show errors;
Empty set (0.00 sec)

8、查看引擎状态
  查看innodb引擎状态，

mysql> SHOW ENGINE innodb status;

9、查看已安装的插件
mysql>SHOW PLUGINS


查看所有打开的表
mysql> show open tables;

12、查看数据库触发器
  我们可以通过show triggers查看所有触发器，也可以show triggers from db_name查看指定数据库的触发器。

mysql> show triggers from testdb;

13、查看函数或者存储过程状态
mysql> SHOW FUNCTION STATUS like ‘%version_patch%’\G
mysql> SHOW PROCEDURE STATUS like ‘table_exists’\G

14、使用profile语句分析sql性能
  我们可以使用profile语句分析需要执行的sql执行的性能情况，可以看到sql执行的各阶段的资源消耗，SHOW PROFILE语句支持选择ALL、CPU、BLOCK IO、CONTEXT SWITCH和PAGE FAULTS等来查看具体的明细信息。不过此功能即将被淘汰，在新版本中通过Performance Schema库来分析资源消耗和使用情况。

mysql> set profiling=1;
mysql> select count(*) from testdb.tb_0001;
mysql> show profiles;
mysql> show profile for query 1;
mysql> show profile cpu for query 1;


五、show status常用参数说明
  使用SHOW STATUS语句能够获取MySQL服务器的一些状态信息，这些状态信息主要是MySQL数据库的性能参数。SHOW STATUS语句的语法格式如下：

SHOW [SESSION | GLOBAL] STATUS LIKE ‘status_name’;

  其中，SESSION表示获取当前会话级别的性能参数，GLOBAL表示获取全局级别的性能参数，并且SESSION和GLOBAL可以省略，如果省略不写，默认为SESSION。status_name表示查询的参数值。熟练掌握这些参数的使用，能够更好地了解SQL语句的执行频率。常用参数说明如下：

参数值	参数说明
Connections	连接MySQL服务器的次数
Uptime MySQL	服务器启动后连续工作的时间
Slow_queries	慢查询的次数
Com insert	插入数据的次数，批量插入多条数据时，只累加1
Com delete	删除数据的次数，每次累加1
Com update	修改数据的次数，每次累加1
Com select	查询数据的次数，一次查询操作累加1
Innodb rows read	查询数据时返回的数据行数
Innodb rows inserted	插入数据时返回的记录数
Innodb rows updated	更新数据时返回的记录数
Innodb rows deleted	删除数据时返回的记录数

show variables like'innodb_file_per_table'查询innodb存储引擎是否打开;


```

---

### 数据定义语言 DDL

```mysql
定义数据库对象（数据库，表，字段）

查询所有数据库
show databases/schema;

查询当前数据库所有表
show tables;

查询表结构
desc 表名；

查询指定表的建表语句
show create table 表名；

查询当前数据库
select database();

使用/切换数据库
use 数据库名;

创建数据库
creat database [if not exists] 数据库名 [default charset utf8mb4]；

删除数据库
drop database [if exists]数据库名;

创建表
create table 表名（
 字段1 字段1类型[comment 字段1注释]
 字段2 字段2类型[comment 字段2注释]
.........
字段n 字段n类型[comment 字段n注释]
)[commen 表注释]//例如engine=innodb//修改存储引擎类型;

DLL-表操作-修改
添加字段
alter table 表名 add 字段名 类型（长度）【comment‘名称（可加可不加）’】【约束】；

修改数据类型
alter table 表名modify 字段名 新数据类型（长度）；

修改字段名和字段类型
alter table 表名 change 旧字段名 新字段名 类型（长度） 【comment  ‘用户名’】【约束】；

删除字段
alter table 表名 drop 字段名；

修改表名
alter table 表名 rename to 新表名；

DDL-表操作-删除
删除表
drop table 【if exists】 表名； #其中的【】若有就删除，没有也不报错；

删除指定表，并重新创建该表
truncate table 表名；  #不管哪个都会删除掉内容， 第二个保留表的结构
```


| 类型         | 大小(byte)                               | 有符号(SIGNED)范围                                           | 无符号(UNSIGNED)范围                                         | 描述                     | 备注                 |
| ------------ | ---------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------ | -------------------- |
| tinyint      | 1                                        | (-128,127)                                                   | (0,255)                                                      | 小整数值                 |                      |
| smallint     | 2                                        | (-32768 , 32767)                                             | (0,65535)                                                    | 大整数值                 |                      |
| mediumint    | 3                                        | (-8 388 608，8 388 607)                                      | (0，16 777 215)                                              | 大整数值                 |                      |
| INT或INTEGER | 4                                        | (-2 147 483 648，2 147 483 647)                              | (0，4 294 967 295)                                           | 大整数值                 |                      |
| BIGINT       | 8                                        | (-9,223,372,036,854,775,808，9 223 372 036 854 775 807)      | (0，18 446 744 073 709 551 615)                              | 极大整数值               |                      |
| FLOAT        | 4 Bytes                                  | (-3.402 823 466 E+38，-1.175 494 351 E-38)，0，(1.175 494 351 E-38，3.402 823 466 351 E+38) | 0，(1.175 494 351 E-38，3.402 823 466 E+38)                  | 单精度 浮点数值          |                      |
| DOUBLE       | 8 Bytes                                  | (-1.797 693 134 862 315 7 E+308，-2.225 073 858 507 201 4 E-308)，0，(2.225 073 858 507 201 4 E-308，1.797 693 134 862 315 7 E+308) | 0，(2.225 073 858 507 201 4 E-308，1.797 693 134 862 315 7 E+308) | 双精度 浮点数值          |                      |
| DECIMAL      | 对DECIMAL(M,D) ，如果M>D，为M+2否则为D+2 | 依赖于M和D的值                                               | 依赖于M和D的值                                               | 小数值                   |                      |
| DATE         | 3                                        | 1000-01-01/9999-12-31                                        | YYYY-MM-DD                                                   | 日期值                   |                      |
| TIME         | 3                                        | '-838:59:59'/'838:59:59'                                     | HH:MM:SS                                                     | 时间值或持续时间         |                      |
| YEAR         | 1                                        | 1901/2155                                                    | YYYY                                                         | 年份值                   |                      |
| DATETIME     | 8                                        | '1000-01-01 00:00:00' 到 '9999-12-31 23:59:59'               | YYYY-MM-DD hh:mm:ss                                          | 混合日期和时间值         |                      |
| TIMESTAMP    | 4                                        | '1970-01-01 00:00:01' UTC 到 '2038-01-19 03:14:07' UTC结束时间是第 **2147483647** 秒，北京时间 **2038-1-19 11:14:07**，格林尼治时间 2038年1月19日 凌晨 03:14:07 | YYYY-MM-DD hh:mm:ss                                          | 混合日期和时间值，时间戳 |                      |
| CHAR         | 0-255 bytes                              | 定长字符串                                                   |                                                              |                          | 性能略高，浪费资源   |
| VARCHAR      | 0-65535 bytes                            | 变长字符串                                                   |                                                              |                          | 节约资源，性能略不好 |
| TINYBLOB     | 0-255 bytes                              | 不超过 255 个字符的二进制字符串                              |                                                              |                          |                      |
| TINYTEXT     | 0-255 bytes                              | 短文本字符串                                                 |                                                              |                          |                      |
| BLOB         | 0-65 535 bytes                           | 二进制形式的长文本数据                                       |                                                              |                          |                      |
| TEXT         | 0-65 535 bytes                           | 长文本数据                                                   |                                                              |                          |                      |
| MEDIUMBLOB   | 0-16 777 215 bytes                       | 二进制形式的中等长度文本数据                                 |                                                              |                          |                      |
| MEDIUMTEXT   | 0-16 777 215 bytes                       | 中等长度文本数据                                             |                                                              |                          |                      |
| LONGBLOB     | 0-4 294 967 295 bytes                    | 二进制形式的极大文本数据                                     |                                                              |                          |                      |
| LONGTEXT     | 0-4 294 967 295 bytes                    | 极大文本数据                                                 |                                                              |                          |                      |
|              |                                          |                                                              |                                                              |                          |                      |

---

### 数据操作语言 DML

```mysql
DML-添加数据

1.给指定字段添加数据
insert into 表名（字段名1 ， 字段名2 ， ......) values(值1 ， 值2 ， ....);

2 . 给全部字段添加数据
insert into 表名 values(值1 ， 值2 ， .....）;

3.批量添加数据
insert into 表名（字段名1 ， 字段名2 ， ......) values(值1 ， 值2 ， ....), (值1 ， 值2，.....);
insert into 表名 values(值1 ， 值2 ， .....）,(值1 ， 值2 ， .....）,(值1 ， 值2 ， .....）;

注：插入数据的时候， 指定的字段顺序需要与值的顺序是一一对应的。
字符串和日期型数据应该包含在引号中。
插入的数据大小，应该在字段的规定范围内。


DML-修改数据
update 表名 set 字段名1 = 值1 ， 字段名2 = 值2，[where 条件];


DML-删除数据
delete from 表名 [where 条件];
```

---

### 数据查询语言 DQL

```mysql
DQL-基本查询
1.查询多个字段
select 字段1，字段2，字段3......from 表名;
select * from 表名; #*指的是返回所有字段

2.设置别名
select 字段1 [as 别名1],字段2[as 别名2]......from 表名;

3.去除重复记录
select distinct 字段列表 from 表名;


DQL-条件查询
1.语法
select 字段列表 from 表名 where 条件列表

DQL-聚合函数
1.将一列数据作为整体，进行纵向计算

2.常见：
函数						功能
min						最小值
max						最大值
count					统计数量
avg						平均值
sum						求和

格式：select 聚合函数(其中写入字段列表) from 列表名;
注：不计算null值的


DQL-分组查询（group by)

```

1. 语法
   select 字段列表 from 表名 [where 条件] group by 分组字段名 [having 分组后过滤条件];

2. where与having的区别
   执行时机不同 ，一个是在分组之前过滤的，第二个是分组之后
   判断条件不同：where不能对聚合函数进行判断， having可以


DQL-排序查询 (order by)
1.语法
select 字段列表 from 表名 order by 字段1 排序方式1 ， 字段2 ， 排序方式2；

2.排序方式
ASC：升序（默认值）
DESC：降序
注 ： 如果是多字段排序，当第一个字段值相同时，才会根据第二个字段进行排序。


DQL-分页查询
1.语法
select 字段列表 from 表名 limit 起始索引，查询记录数;

注 ： 起始索引是从0开始，起始索引 = （查询页码 - 1）*每页显示记录数
分页查询是数据库的方言，不同的数据库有不同的实现，mysql中是limit
如果查询的是第一页数据，起始索引可以省略，直接简写为limit 10.


以上是编写顺序

执行顺序：
from 表名列表
where 条件列表
group by 分组字段列表
having 分组后条件列表
select 字段列表
order by 排序字段列表
limit 分页参数


```

| 运算符             | 作用                       |                                                              |
| ------------------ | -------------------------- | ------------------------------------------------------------ |
| +                  | 加法                       |                                                              |
| -                  | 减法                       |                                                              |
| *                  | 乘法                       |                                                              |
| =                  | 等于                       |                                                              |
| <>, !=             | 不等于                     |                                                              |
| >                  | 大于                       |                                                              |
| <                  | 小于                       |                                                              |
| <=                 | 小于等于                   |                                                              |
| >=                 | 大于等于                   |                                                              |
| BETWEEN...AND..... | 在两值之间                 | >=min&&<=max                                                 |
| NOT BETWEEN        | 不在两值之间               |                                                              |
| IN                 | 在集合中                   |                                                              |
| NOT IN             | 不在集合中                 |                                                              |
| <=>                | 严格比较两个NULL值是否相等 | 两个操作码均为NULL时，其所得值为1；而当一个操作码为NULL时，其所得值为0 |
| LIKE               | 模糊匹配                   | （_匹配单个字符,%匹配任意个字符）                            |
| REGEXP 或 RLIKE    | 正则式匹配                 |                                                              |
| IS NULL            | 为空                       |                                                              |
| IS NOT NULL        | 不为空                     |                                                              |
| NOT 或 !           | 逻辑非                     |                                                              |
| AND                | 逻辑与                     |                                                              |
| OR                 | 逻辑或                     |                                                              |
| XOR                | 逻辑异或                   |                                                              |
| &                  | 按位与                     |                                                              |
| \|                 | 按位或                     |                                                              |
| ^                  | 按位异或                   |                                                              |
| !                  | 取反                       |                                                              |
| <<                 | 左移                       |                                                              |
| >>                 | 右移                       |                                                              |

**字符串函数**

| 函数                                  | 描述                                                         | 实例                                                         |
| ------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| ASCII(s)                              | 返回字符串 s 的第一个字符的 ASCII 码。                       | 返回 CustomerName 字段第一个字母的 ASCII 码：`SELECT ASCII(CustomerName) AS NumCodeOfFirstChar FROM Customers;` |
| CHAR_LENGTH(s)                        | 返回字符串 s 的字符数                                        | 返回字符串 RUNOOB 的字符数`SELECT CHAR_LENGTH("RUNOOB") AS LengthOfString;` |
| CHARACTER_LENGTH(s)                   | 返回字符串 s 的字符数，等同于 CHAR_LENGTH(s)                 | 返回字符串 RUNOOB 的字符数`SELECT CHARACTER_LENGTH("RUNOOB") AS LengthOfString;` |
| CONCAT(s1,s2...sn)                    | 字符串 s1,s2 等多个字符串合并为一个字符串                    | 合并多个字符串`SELECT CONCAT("SQL ", "Runoob ", "Gooogle ", "Facebook") AS ConcatenatedString;` |
| CONCAT_WS(x, s1,s2...sn)              | 同 CONCAT(s1,s2,...) 函数，但是每个字符串之间要加上 x，x 可以是分隔符 | 合并多个字符串，并添加分隔符：`SELECT CONCAT_WS("-", "SQL", "Tutorial", "is", "fun!")AS ConcatenatedString;` |
| FIELD(s,s1,s2...)                     | 返回第一个字符串 s 在字符串列表(s1,s2...)中的位置            | 返回字符串 c 在列表值中的位置：`SELECT FIELD("c", "a", "b", "c", "d", "e");` |
| FIND_IN_SET(s1,s2)                    | 返回在字符串s2中与s1匹配的字符串的位置                       | 返回字符串 c 在指定字符串中的位置：`SELECT FIND_IN_SET("c", "a,b,c,d,e");` |
| FORMAT(x,n)                           | 函数可以将数字 x 进行格式化 "#,###.##", 将 x 保留到小数点后 n 位，最后一位四舍五入。 | 格式化数字 "#,###.##" 形式：`SELECT FORMAT(250500.5634, 2);     -- 输出 250,500.56` |
| INSERT(s1,x,len,s2)                   | 字符串 s2 替换 s1 的 x 位置开始长度为 len 的字符串           | 从字符串第一个位置开始的 6 个字符替换为 runoob：`SELECT INSERT("google.com", 1, 6, "runoob");  -- 输出：runoob.com` |
| LOCATE(s1,s)                          | 从字符串 s 中获取 s1 的开始位置                              | 获取 b 在字符串 abc 中的位置：`SELECT LOCATE('st','myteststring');  -- 5`返回字符串 abc 中 b 的位置：`SELECT LOCATE('b', 'abc') -- 2` |
| LCASE(s)                              | 将字符串 s 的所有字母变成小写字母                            | 字符串 RUNOOB 转换为小写：`SELECT LCASE('RUNOOB') -- runoob` |
| LEFT(s,n)                             | 返回字符串 s 的前 n 个字符                                   | 返回字符串 runoob 中的前两个字符：`SELECT LEFT('runoob',2) -- ru` |
| LOWER(s)                              | 将字符串 s 的所有字母变成小写字母                            | 字符串 RUNOOB 转换为小写：`SELECT LOWER('RUNOOB') -- runoob` |
| LPAD(s1,len,s2)                       | 在字符串 s1 的开始处填充字符串 s2，使字符串长度达到 len      | 将字符串 xx 填充到 abc 字符串的开始处：`SELECT LPAD('abc',5,'xx') -- xxabc` |
| LTRIM(s)                              | 去掉字符串 s 开始处的空格                                    | 去掉字符串 RUNOOB开始处的空格：`SELECT LTRIM("    RUNOOB") AS LeftTrimmedString;-- RUNOOB` |
| MID(s,n,len)                          | 从字符串 s 的 n 位置截取长度为 len 的子字符串，同 SUBSTRING(s,n,len) | 从字符串 RUNOOB 中的第 2 个位置截取 3个 字符：`SELECT MID("RUNOOB", 2, 3) AS ExtractString; -- UNO` |
| POSITION(s1 IN s)                     | 从字符串 s 中获取 s1 的开始位置                              | 返回字符串 abc 中 b 的位置：`SELECT POSITION('b' in 'abc') -- 2` |
| REPEAT(s,n)                           | 将字符串 s 重复 n 次                                         | 将字符串 runoob 重复三次：`SELECT REPEAT('runoob',3) -- runoobrunoobrunoob` |
| REPLACE(s,s1,s2)                      | 将字符串 s2 替代字符串 s 中的字符串 s1                       | 将字符串 abc 中的字符 a 替换为字符 x：`SELECT REPLACE('abc','a','x') --xbc` |
| REVERSE(s)                            | 将字符串s的顺序反过来                                        | 将字符串 abc 的顺序反过来：`SELECT REVERSE('abc') -- cba`    |
| RIGHT(s,n)                            | 返回字符串 s 的后 n 个字符                                   | 返回字符串 runoob 的后两个字符：`SELECT RIGHT('runoob',2) -- ob` |
| RPAD(s1,len,s2)                       | 在字符串 s1 的结尾处添加字符串 s2，使字符串的长度达到 len    | 将字符串 xx 填充到 abc 字符串的结尾处：`SELECT RPAD('abc',5,'xx') -- abcxx` |
| RTRIM(s)                              | 去掉字符串 s 结尾处的空格                                    | 去掉字符串 RUNOOB 的末尾空格：`SELECT RTRIM("RUNOOB     ") AS RightTrimmedString;   -- RUNOOB` |
| SPACE(n)                              | 返回 n 个空格                                                | 返回 10 个空格：`SELECT SPACE(10);`                          |
| STRCMP(s1,s2)                         | 比较字符串 s1 和 s2，如果 s1 与 s2 相等返回 0 ，如果 s1>s2 返回 1，如果 s1<s2 返回 -1 | 比较字符串：`SELECT STRCMP("runoob", "runoob");  -- 0`       |
| SUBSTR(s, start, length)              | 从字符串 s 的 start 位置截取长度为 length 的子字符串         | 从字符串 RUNOOB 中的第 2 个位置截取 3个 字符：`SELECT SUBSTR("RUNOOB", 2, 3) AS ExtractString; -- UNO` |
| SUBSTRING(s, start, length)           | 从字符串 s 的 start 位置截取长度为 length 的子字符串，等同于 SUBSTR(s, start, length) | 从字符串 RUNOOB 中的第 2 个位置截取 3个 字符：`SELECT SUBSTRING("RUNOOB", 2, 3) AS ExtractString; -- UNO` |
| SUBSTRING_INDEX(s, delimiter, number) | 返回从字符串 s 的第 number 个出现的分隔符 delimiter 之后的子串。 如果 number 是正数，返回第 number 个字符左边的字符串。 如果 number 是负数，返回第(number 的绝对值(从右边数))个字符右边的字符串。 | `SELECT SUBSTRING_INDEX('a*b','*',1) -- a SELECT SUBSTRING_INDEX('a*b','*',-1)  -- b SELECT SUBSTRING_INDEX(SUBSTRING_INDEX('a*b*c*d*e','*',3),'*',-1)  -- c` |
| TRIM(s)                               | 去掉字符串 s 开始和结尾处的空格                              | 去掉字符串 RUNOOB 的首尾空格：`SELECT TRIM('    RUNOOB    ') AS TrimmedString;` |
| UCASE(s)                              | 将字符串转换为大写                                           | 将字符串 runoob 转换为大写：`SELECT UCASE("runoob"); -- RUNOOB` |
| UPPER(s)                              | 将字符串转换为大写                                           | 将字符串 runoob 转换为大写：`SELECT UPPER("runoob"); -- RUNOOB` |

## 数字函数

​

| 函数名                             | 描述                                                         | 实例                                                         |
| ---------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| ABS(x)                             | 返回 x 的绝对值                                              | 返回 -1 的绝对值：`SELECT ABS(-1) -- 返回1`                  |
| ACOS(x)                            | 求 x 的反余弦值（单位为弧度），x 为一个数值                  | `SELECT ACOS(0.25);`                                         |
| ASIN(x)                            | 求反正弦值（单位为弧度），x 为一个数值                       | `SELECT ASIN(0.25);`                                         |
| ATAN(x)                            | 求反正切值（单位为弧度），x 为一个数值                       | `SELECT ATAN(2.5);`                                          |
| ATAN2(n, m)                        | 求反正切值（单位为弧度）                                     | `SELECT ATAN2(-0.8, 2);`                                     |
| AVG(expression)                    | 返回一个表达式的平均值，expression 是一个字段                | 返回 Products 表中Price 字段的平均值：`SELECT AVG(Price) AS AveragePrice FROM Products;` |
| CEIL(x)                            | 返回大于或等于 x 的最小整数                                  | `SELECT CEIL(1.5) -- 返回2`                                  |
| CEILING(x)                         | 返回大于或等于 x 的最小整数                                  | `SELECT CEILING(1.5); -- 返回2`                              |
| COS(x)                             | 求余弦值(参数是弧度)                                         | `SELECT COS(2);`                                             |
| COT(x)                             | 求余切值(参数是弧度)                                         | `SELECT COT(6);`                                             |
| COUNT(expression)                  | 返回查询的记录总数，expression 参数是一个字段或者 * 号       | 返回 Products 表中 products 字段总共有多少条记录：`SELECT COUNT(ProductID) AS NumberOfProducts FROM Products;` |
| DEGREES(x)                         | 将弧度转换为角度                                             | `SELECT DEGREES(3.1415926535898) -- 180`                     |
| n DIV m                            | 整除，n 为被除数，m 为除数                                   | 计算 10 除于 5：`SELECT 10 DIV 5;  -- 2`                     |
| EXP(x)                             | 返回 e 的 x 次方                                             | 计算 e 的三次方：`SELECT EXP(3) -- 20.085536923188`          |
| FLOOR(x)                           | 返回小于或等于 x 的最大整数                                  | 小于或等于 1.5 的整数：`SELECT FLOOR(1.5) -- 返回1`          |
| GREATEST(expr1, expr2, expr3, ...) | 返回列表中的最大值                                           | 返回以下数字列表中的最大值：`SELECT GREATEST(3, 12, 34, 8, 25); -- 34`返回以下字符串列表中的最大值：`SELECT GREATEST("Google", "Runoob", "Apple");   -- Runoob` |
| LEAST(expr1, expr2, expr3, ...)    | 返回列表中的最小值                                           | 返回以下数字列表中的最小值：`SELECT LEAST(3, 12, 34, 8, 25); -- 3`返回以下字符串列表中的最小值：`SELECT LEAST("Google", "Runoob", "Apple");   -- Apple` |
| LN                                 | 返回数字的自然对数，以 e 为底。                              | 返回 2 的自然对数：`SELECT LN(2);  -- 0.6931471805599453`    |
| LOG(x) 或 LOG(base, x)             | 返回自然对数(以 e 为底的对数)，如果带有 base 参数，则 base 为指定带底数。 | `SELECT LOG(20.085536923188) -- 3 SELECT LOG(2, 4); -- 2`    |
| LOG10(x)                           | 返回以 10 为底的对数                                         | `SELECT LOG10(100) -- 2`                                     |
| LOG2(x)                            | 返回以 2 为底的对数                                          | 返回以 2 为底 6 的对数：`SELECT LOG2(6);  -- 2.584962500721156` |
| MAX(expression)                    | 返回字段 expression 中的最大值                               | 返回数据表 Products 中字段 Price 的最大值：`SELECT MAX(Price) AS LargestPrice FROM Products;` |
| MIN(expression)                    | 返回字段 expression 中的最小值                               | 返回数据表 Products 中字段 Price 的最小值：`SELECT MIN(Price) AS MinPrice FROM Products;` |
| MOD(x,y)                           | 返回 x 除以 y 以后的余数                                     | 5 除于 2 的余数：`SELECT MOD(5,2) -- 1`                      |
| PI()                               | 返回圆周率(3.141593）                                        | `SELECT PI() --3.141593`                                     |
| POW(x,y)                           | 返回 x 的 y 次方                                             | 2 的 3 次方：`SELECT POW(2,3) -- 8`                          |
| POWER(x,y)                         | 返回 x 的 y 次方                                             | 2 的 3 次方：`SELECT POWER(2,3) -- 8`                        |
| RADIANS(x)                         | 将角度转换为弧度                                             | 180 度转换为弧度：`SELECT RADIANS(180) -- 3.1415926535898`   |
| RAND()                             | 返回 0 到 1 的随机数                                         | `SELECT RAND() --0.93099315644334`                           |
| ROUND(x [,y])                      | 返回离 x 最近的整数，可选参数 y 表示要四舍五入的小数位数，如果省略，则返回整数。 | `SELECT ROUND(1.23456) --1 SELECT ROUND(345.156, 2) -- 345.16` |
| SIGN(x)                            | 返回 x 的符号，x 是负数、0、正数分别返回 -1、0 和 1          | `SELECT SIGN(-10) -- (-1)`                                   |
| SIN(x)                             | 求正弦值(参数是弧度)                                         | `SELECT SIN(RADIANS(30)) -- 0.5`                             |
| SQRT(x)                            | 返回x的平方根                                                | 25 的平方根：`SELECT SQRT(25) -- 5`                          |
| SUM(expression)                    | 返回指定字段的总和                                           | 计算 OrderDetails 表中字段 Quantity 的总和：`SELECT SUM(Quantity) AS TotalItemsOrdered FROM OrderDetails;` |
| TAN(x)                             | 求正切值(参数是弧度)                                         | `SELECT TAN(1.75);  -- -5.52037992250933`                    |
| TRUNCATE(x,y)                      | 返回数值 x 保留到小数点后 y 位的值（与 ROUND 最大的区别是不会进行四舍五入） | `SELECT TRUNCATE(1.23456,3) -- 1.234`                        |

## 日期函数

| 函数名                                            | 描述                                                         | 实例                                                         |
| ------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| ADDDATE(d,n)                                      | 计算起始日期 d 加上 n 天的日期                               | `SELECT ADDDATE("2017-06-15", INTERVAL 10 DAY); ->2017-06-25` |
| ADDTIME(t,n)                                      | n 是一个时间表达式，时间 t 加上时间表达式 n                  | 加 5 秒：`SELECT ADDTIME('2011-11-11 11:11:11', 5); ->2011-11-11 11:11:16 (秒)`添加 2 小时, 10 分钟, 5 秒:`SELECT ADDTIME("2020-06-15 09:34:21", "2:10:5");  -> 2020-06-15 11:44:26` |
| CURDATE()                                         | 返回当前日期                                                 | `SELECT CURDATE(); -> 2018-09-19`                            |
| CURRENT_DATE()                                    | 返回当前日期                                                 | `SELECT CURRENT_DATE(); -> 2018-09-19`                       |
| CURRENT_TIME                                      | 返回当前时间                                                 | `SELECT CURRENT_TIME(); -> 19:59:02`                         |
| CURRENT_TIMESTAMP()                               | 返回当前日期和时间                                           | `SELECT CURRENT_TIMESTAMP() -> 2018-09-19 20:57:43`          |
| CURTIME()                                         | 返回当前时间                                                 | `SELECT CURTIME(); -> 19:59:02`                              |
| DATE()                                            | 从日期或日期时间表达式中提取日期值                           | `SELECT DATE("2017-06-15");     -> 2017-06-15`               |
| DATEDIFF(d1,d2)                                   | 计算日期 d1->d2 之间相隔的天数                               | `SELECT DATEDIFF('2001-01-01','2001-02-02') -> -32`          |
| DATE_ADD(d，INTERVAL expr type)                   | 计算起始日期 d 加上一个时间段后的日期，type 值可以是：MICROSECONDSECONDMINUTEHOURDAYWEEKMONTHQUARTERYEARSECOND_MICROSECONDMINUTE_MICROSECONDMINUTE_SECONDHOUR_MICROSECONDHOUR_SECONDHOUR_MINUTEDAY_MICROSECONDDAY_SECONDDAY_MINUTEDAY_HOURYEAR_MONTH | `SELECT DATE_ADD("2017-06-15", INTERVAL 10 DAY);     -> 2017-06-25 SELECT DATE_ADD("2017-06-15 09:34:21", INTERVAL 15 MINUTE); -> 2017-06-15 09:49:21 SELECT DATE_ADD("2017-06-15 09:34:21", INTERVAL -3 HOUR); ->2017-06-15 06:34:21 SELECT DATE_ADD("2017-06-15 09:34:21", INTERVAL -3 MONTH); ->2017-03-15 09:34:21` |
| DATE_FORMAT(d,f)                                  | 按表达式 f的要求显示日期 d                                   | `SELECT DATE_FORMAT('2011-11-11 11:11:11','%Y-%m-%d %r') -> 2011-11-11 11:11:11 AM` |
| DATE_SUB(date,INTERVAL expr type)                 | 函数从日期减去指定的时间间隔。                               | Orders 表中 OrderDate 字段减去 2 天：`SELECT OrderId,DATE_SUB(OrderDate,INTERVAL 2 DAY) AS OrderPayDate FROM Orders` |
| DAY(d)                                            | 返回日期值 d 的日期部分                                      | `SELECT DAY("2017-06-15");   -> 15`                          |
| DAYNAME(d)                                        | 返回日期 d 是星期几，如 Monday,Tuesday                       | `SELECT DAYNAME('2011-11-11 11:11:11') ->Friday`             |
| DAYOFMONTH(d)                                     | 计算日期 d 是本月的第几天                                    | `SELECT DAYOFMONTH('2011-11-11 11:11:11') ->11`              |
| DAYOFWEEK(d)                                      | 日期 d 今天是星期几，1 星期日，2 星期一，以此类推            | `SELECT DAYOFWEEK('2011-11-11 11:11:11') ->6`                |
| DAYOFYEAR(d)                                      | 计算日期 d 是本年的第几天                                    | `SELECT DAYOFYEAR('2011-11-11 11:11:11') ->315`              |
| EXTRACT(type FROM d)                              | 从日期 d 中获取指定的值，type 指定返回的值。 type可取值为： MICROSECONDSECONDMINUTEHOURDAYWEEKMONTHQUARTERYEARSECOND_MICROSECONDMINUTE_MICROSECONDMINUTE_SECONDHOUR_MICROSECONDHOUR_SECONDHOUR_MINUTEDAY_MICROSECONDDAY_SECONDDAY_MINUTEDAY_HOURYEAR_MONTH | `SELECT EXTRACT(MINUTE FROM '2011-11-11 11:11:11')  -> 11`   |
| FROM_DAYS(n)                                      | 计算从 0000 年 1 月 1 日开始 n 天后的日期                    | `SELECT FROM_DAYS(1111) -> 0003-01-16`                       |
| HOUR(t)                                           | 返回 t 中的小时值                                            | `SELECT HOUR('1:2:3') -> 1`                                  |
| LAST_DAY(d)                                       | 返回给给定日期的那一月份的最后一天                           | `SELECT LAST_DAY("2017-06-20"); -> 2017-06-30`               |
| LOCALTIME()                                       | 返回当前日期和时间                                           | `SELECT LOCALTIME() -> 2018-09-19 20:57:43`                  |
| LOCALTIMESTAMP()                                  | 返回当前日期和时间                                           | `SELECT LOCALTIMESTAMP() -> 2018-09-19 20:57:43`             |
| MAKEDATE(year, day-of-year)                       | 基于给定参数年份 year 和所在年中的天数序号 day-of-year 返回一个日期 | `SELECT MAKEDATE(2017, 3); -> 2017-01-03`                    |
| MAKETIME(hour, minute, second)                    | 组合时间，参数分别为小时、分钟、秒                           | `SELECT MAKETIME(11, 35, 4); -> 11:35:04`                    |
| MICROSECOND(date)                                 | 返回日期参数所对应的微秒数                                   | `SELECT MICROSECOND("2017-06-20 09:34:00.000023"); -> 23`    |
| MINUTE(t)                                         | 返回 t 中的分钟值                                            | `SELECT MINUTE('1:2:3') -> 2`                                |
| MONTHNAME(d)                                      | 返回日期当中的月份名称，如 November                          | `SELECT MONTHNAME('2011-11-11 11:11:11') -> November`        |
| MONTH(d)                                          | 返回日期d中的月份值，1 到 12                                 | `SELECT MONTH('2011-11-11 11:11:11') ->11`                   |
| NOW()                                             | 返回当前日期和时间                                           | `SELECT NOW() -> 2018-09-19 20:57:43`                        |
| PERIOD_ADD(period, number)                        | 为 年-月 组合日期添加一个时段                                | `SELECT PERIOD_ADD(201703, 5);    -> 201708`                 |
| PERIOD_DIFF(period1, period2)                     | 返回两个时段之间的月份差值                                   | `SELECT PERIOD_DIFF(201710, 201703); -> 7`                   |
| QUARTER(d)                                        | 返回日期d是第几季节，返回 1 到 4                             | `SELECT QUARTER('2011-11-11 11:11:11') -> 4`                 |
| SECOND(t)                                         | 返回 t 中的秒钟值                                            | `SELECT SECOND('1:2:3') -> 3`                                |
| SEC_TO_TIME(s)                                    | 将以秒为单位的时间 s 转换为时分秒的格式                      | `SELECT SEC_TO_TIME(4320) -> 01:12:00`                       |
| STR_TO_DATE(string, format_mask)                  | 将字符串转变为日期                                           | `SELECT STR_TO_DATE("August 10 2017", "%M %d %Y"); -> 2017-08-10` |
| SUBDATE(d,n)                                      | 日期 d 减去 n 天后的日期                                     | `SELECT SUBDATE('2011-11-11 11:11:11', 1) ->2011-11-10 11:11:11 (默认是天)` |
| SUBTIME(t,n)                                      | 时间 t 减去 n 秒的时间                                       | `SELECT SUBTIME('2011-11-11 11:11:11', 5) ->2011-11-11 11:11:06 (秒)` |
| SYSDATE()                                         | 返回当前日期和时间                                           | `SELECT SYSDATE() -> 2018-09-19 20:57:43`                    |
| TIME(expression)                                  | 提取传入表达式的时间部分                                     | `SELECT TIME("19:30:10"); -> 19:30:10`                       |
| TIME_FORMAT(t,f)                                  | 按表达式 f 的要求显示时间 t                                  | `SELECT TIME_FORMAT('11:11:11','%r') 11:11:11 AM`            |
| TIME_TO_SEC(t)                                    | 将时间 t 转换为秒                                            | `SELECT TIME_TO_SEC('1:12:00') -> 4320`                      |
| TIMEDIFF(time1, time2)                            | 计算时间差值                                                 | `mysql> SELECT TIMEDIFF("13:10:11", "13:10:10"); -> 00:00:01 mysql> SELECT TIMEDIFF('2000:01:01 00:00:00',    ->                 '2000:01:01 00:00:00.000001');        -> '-00:00:00.000001' mysql> SELECT TIMEDIFF('2008-12-31 23:59:59.000001',    ->                 '2008-12-30 01:01:01.000002');        -> '46:58:57.999999'` |
| TIMESTAMP(expression, interval)                   | 单个参数时，函数返回日期或日期时间表达式；有2个参数时，将参数加和 | `mysql> SELECT TIMESTAMP("2017-07-23",  "13:10:11"); -> 2017-07-23 13:10:11 mysql> SELECT TIMESTAMP('2003-12-31');        -> '2003-12-31 00:00:00' mysql> SELECT TIMESTAMP('2003-12-31 12:00:00','12:00:00');        -> '2004-01-01 00:00:00'` |
| TIMESTAMPDIFF(unit,datetime_expr1,datetime_expr2) | 计算时间差，返回 datetime_expr2 − datetime_expr1 的时间差    | `mysql> SELECT TIMESTAMPDIFF(DAY,'2003-02-01','2003-05-01');   // 计算两个时间相隔多少天        -> 89 mysql> SELECT TIMESTAMPDIFF(MONTH,'2003-02-01','2003-05-01');   // 计算两个时间相隔多少月        -> 3 mysql> SELECT TIMESTAMPDIFF(YEAR,'2002-05-01','2001-01-01');    // 计算两个时间相隔多少年        -> -1 mysql> SELECT TIMESTAMPDIFF(MINUTE,'2003-02-01','2003-05-01 12:05:55');  // 计算两个时间相隔多少分钟        -> 128885` |
| TO_DAYS(d)                                        | 计算日期 d 距离 0000 年 1 月 1 日的天数                      | `SELECT TO_DAYS('0001-01-01 01:01:01') -> 366`               |
| WEEK(d)                                           | 计算日期 d 是本年的第几个星期，范围是 0 到 53                | `SELECT WEEK('2011-11-11 11:11:11') -> 45`                   |
| WEEKDAY(d)                                        | 日期 d 是星期几，0 表示星期一，1 表示星期二                  | `SELECT WEEKDAY("2017-06-15"); -> 3`                         |
| WEEKOFYEAR(d)                                     | 计算日期 d 是本年的第几个星期，范围是 0 到 53                | `SELECT WEEKOFYEAR('2011-11-11 11:11:11') -> 45`             |
| YEAR(d)                                           | 返回年份                                                     | `SELECT YEAR("2017-06-15"); -> 2017`                         |
| YEARWEEK(date, mode)                              | 返回年份及第几周（0到53），mode 中 0 表示周天，1表示周一，以此类推 | `SELECT YEARWEEK("2017-06-15"); -> 201724`                   |

## 高级函数

| 函数名                                                       | 描述                                                         | 实例                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| BIN(x)                                                       | 返回 x 的二进制编码，x 为十进制数                            | 15 的 2 进制编码:`SELECT BIN(15); -- 1111`                   |
| BINARY(s)                                                    | 将字符串 s 转换为二进制字符串                                | `SELECT BINARY "RUNOOB"; -> RUNOOB`                          |
| `CASE expression    WHEN condition1 THEN result1    WHEN condition2 THEN result2   ...    WHEN conditionN THEN resultN    ELSE result END` | CASE 表示函数开始，END 表示函数结束。如果 condition1 成立，则返回 result1, 如果 condition2 成立，则返回 result2，当全部不成立则返回 result，而当有一个成立之后，后面的就不执行了。 | `SELECT CASE  　WHEN 1 > 0 　THEN '1 > 0' 　WHEN 2 > 0 　THEN '2 > 0' 　ELSE '3 > 0' 　END ->1 > 0` |
| CAST(x AS type)                                              | 转换数据类型                                                 | 字符串日期转换为日期：`SELECT CAST("2017-08-29" AS DATE); -> 2017-08-29` |
| COALESCE(expr1, expr2, ...., expr_n)                         | 返回参数中的第一个非空表达式（从左向右）                     | `SELECT COALESCE(NULL, NULL, NULL, 'runoob.com', NULL, 'google.com'); -> runoob.com` |
| CONNECTION_ID()                                              | 返回唯一的连接 ID                                            | `SELECT CONNECTION_ID(); -> 4292835`                         |
| CONV(x,f1,f2)                                                | 返回 f1 进制数变成 f2 进制数                                 | `SELECT CONV(15, 10, 2); -> 1111`                            |
| CONVERT(s USING cs)                                          | 函数将字符串 s 的字符集变成 cs                               | `SELECT CHARSET('ABC') ->utf-8     SELECT CHARSET(CONVERT('ABC' USING gbk)) ->gbk` |
| CURRENT_USER()                                               | 返回当前用户                                                 | `SELECT CURRENT_USER(); -> guest@%`                          |
| DATABASE()                                                   | 返回当前数据库名                                             | `SELECT DATABASE();    -> runoob`                            |
| IF(expr,v1,v2)                                               | 如果表达式 expr 成立，返回结果 v1；否则，返回结果 v2。       | `SELECT IF(1 > 0,'正确','错误')     ->正确`                  |
| [IFNULL(v1,v2)](https://www.runoob.com/mysql/mysql-func-ifnull.html) | 如果 v1 的值不为 NULL，则返回 v1，否则返回 v2。              | `SELECT IFNULL(null,'Hello Word') ->Hello Word`              |
| ISNULL(expression)                                           | 判断表达式是否为 NULL                                        | `SELECT ISNULL(NULL); ->1`                                   |
| LAST_INSERT_ID()                                             | 返回最近生成的 AUTO_INCREMENT 值                             | `SELECT LAST_INSERT_ID(); ->6`                               |
| NULLIF(expr1, expr2)                                         | 比较两个字符串，如果字符串 expr1 与 expr2 相等 返回 NULL，否则返回 expr1 | `SELECT NULLIF(25, 25); ->`                                  |
| SESSION_USER()                                               | 返回当前用户                                                 | `SELECT SESSION_USER(); -> guest@%`                          |
| SYSTEM_USER()                                                | 返回当前用户                                                 | `SELECT SYSTEM_USER(); -> guest@%`                           |
| USER()                                                       | 返回当前用户                                                 | `SELECT USER(); -> guest@%`                                  |
| VERSION()                                                    | 返回数据库的版本号                                           | `SELECT VERSION() -> 5.6.34`                                 |

**8.0新增的**

| 函数            | 描述                                   | 实例                                                         |
| --------------- | -------------------------------------- | ------------------------------------------------------------ |
| JSON_OBJECT()   | 将键值对转换为 JSON 对象               | `SELECT JSON_OBJECT('key1', 'value1', 'key2', 'value2')`     |
| JSON_ARRAY()    | 将值转换为 JSON 数组                   | `SELECT JSON_ARRAY(1, 2, 'three')`                           |
| JSON_EXTRACT()  | 从 JSON 字符串中提取指定的值           | `SELECT JSON_EXTRACT('{"name": "John", "age": 30}', '$.name')` |
| JSON_CONTAINS() | 检查一个 JSON 字符串是否包含指定的值   | `SELECT JSON_CONTAINS('{"name": "John", "age": 30}', 'John', '$.name')` |
| ROW_NUMBER()    | 为查询结果中的每一行分配一个唯一的数字 | `SELECT ROW_NUMBER() OVER(ORDER BY id) AS row_number, name FROM users` |
| RANK()          | 为查询结果中的每一行分配一个排名       | `SELECT RANK() OVER(ORDER BY score DESC) AS rank, name, score FROM students` |


```

---

### 常用函数

```mysql
指一段可以直接被另一段程序调用的程序或代码。


1.字符串函数
函数					功能
concat(s1,s2,....sn)		字符串拼接，将s1,s2,...sn拼接成一个字符串
lower(str)				将字符串str全部转为小写
upper(str)				将字符串str全部转为大写
lpad(str,n,pad)			左填充，用字符串pad对str的左边进行填充，达到n个字符串长度
rpad(str,n,pad)			右填充，用字符串pad对str的右边进行填充，达到n个字符串长度
trim(str)				去掉字符串头部和尾部的空格
substring(str,start,len)	返回从字符串str从start位置起的len个长度的字符串

格式：select 函数（参数）;


2.数值函数
函数					功能
ceil(x)				向上取整
floor(x)				向下取整
mod(x,y)				返回x/y的模
rand()				返回0~1内的随机数
round(x,y)				求参数x的四舍五入的值，保留y位小数


3.日期函数
函数							功能
curdate()						返回当前日期
curtime()						返回当前时间
now()						返回当前日期和时间
tear(date)						获取指定date的年份
month(date)					获取指定date的月份
day(date)						获取指定date的日期
date_add(date,intervalexpr type)	返回一个日期/时间值加上一个时间间隔expr后的时间值
datediff(date1,date2)				返回起始时间date1和结束时间date2之间的天数


4.流程控制函数
函数												功能
if(value , t,f)										如果value为true，则返回t否则返回f
ifnull(value1,value2)									如果value1不为空，返回value1，否则返回value2
case when [val1] then [res1]....else[default]end				如果value1为true则返回res1,.....否则返回default默认值
case [expr]when[val1] then [res1].....else[default] end			如果expr的值等于val1，返回res1s...否则返回default默认值


```

---

### 约束与数据完整性

```mysql

1.语法
(添加外键)
create table 表名(
字段名 数据类型，
.....
[constraint] [外键名称] foreign key (外键字段名) references 主表(主表列名)
);
alter table 表名 add constraint 外键名称 foreign key(外键字段名) references 主表(主表列名);
(删除外键)
alter table (外键表名) drop foreign key (外键名称);


删除/更新行为

行为					说明
no action				当在父表中删除/更新对应记录时，首先检查该记录是否有对应外键，如果有则不允许删除/更新。（与restrict一致）
restrict				当在父表中删除/更新对应记录时，首先检查该记录是否有对应外键，如果有则不允许删除/更新。（与restrict一致）
cascade				当在父表中删除/更新对应记录时，首先检查该记录是否有对应外键，如果有则也删除/更新外键在子表中的记录。
set null				当在父表中删除对应记录时，首先检查该记录是否有对应外键，如果有，则设置子表中该外键值为null（这就要求该外键允许取null）。
set default				父表有变更时，子表将外键列设置成一个默认的值（innodb不支持）


alter table 表名 add constraint 外键名称 foreign key (外键字段) references 主表名(主表字段名) on update cascade on delete cascade;
                                                                        在更新时怎么操作，在删除时怎么操作;


```


| 约束                                                         | 描述                                                         | 关键字                                                       |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 非空约束                                                     | 限制该字段的数据不能为null                                   | not null                                                     |
| 唯一约束                                                     | 保证该字段的所有数据都是唯一，不重复的                       | unique                                                       |
| 主键约束                                                     | 主键是一行数据的唯一标识，要求非空且唯一                     | primary key                                                  |
| 默认约束                                                     | 保重数据时，如果未指定该字段的值，则采用默认值               | default                                                      |
| 检查约束（8.0.13版本之后）                                   | 保证字段值满足某一个条件                                     | check                                                        |
| 外键约束                                                     | 用来让两张表的数据之间建立链接，保证数据的一致性和完整性     | foreigh key                                                  |
| 主键自增                                                     | 自动增加数据(根据最大值)                                     | auto_increment                                               |
| **概念：用来让两个表的数据之间建立连接，从而保证数据的一致性和完整性** | **注意：约束时作用于表中字段上的，可以在创建表/修改表的时候添加约束。** | **1.约束是作用于表中字段上的规则，用于限制存储在表中的数据<br/>2.保证数据库中的数据的正确，有效性和完整性** |

---

### 多表查询

```mysql
1.多表关系

三种情况{
        一对多：
                案例：部门与员工的关系
                关系：一个部门对应多个员工，一个员工对应一个部门
                实现：在多的一方建立外键，指向一的一方的主键
        多对多：
                案例：学生与课程的关系
                关系：一个学生可以选多个课程，一个课程也可以多个学生选
                实现：建立第三张中间表，中间表至少包含两个外键，分别关联两方主键
        一对一：
                案例：用户与用户详情的关系
                关系：一对一关系，多用于单表拆分，将一张表的基础字段一张表中，其他详情字段放在另一张表中，以提升操作效率
                实现，在任意一方加入外键，关联另外一方的主键，并且设置外键为唯一的（uniqe）
}


。去重语法select distinct

一：连接查询： 2.多表关系-内连接

1.显示内连接
select 字段列表 from 表1 [inner] join 表2 on 连接条件.....;


2.隐式内连接
select 字段列表 from 表1，表2 where 条件.....;


区别：显示内连接可以减少字段的扫描，有更快的执行素的。这种速度优势在3张或更多表连接时比较明显
性能：大多数数据库管理系统在执行时，对隐式和显式内连接的优化是相同的。


3.多表关系-外连接
1.左外连接
 select 字段列表 from 表1 left [outer] join 表2 on 条件....;

相当于查询表1（左表）的所有数据包含表1和表2交集部分的数据

2.右外连接
select 字段列表 from 表1 right [outer] join 表2 on 条件....;

相当于查询表2（右表）的所有数据包含表1和表2交集部分的数据

把left和right交换的相反的


。内连接只会查看交集的部分，外连接才会显示全部

4.多表查询-自连接
1.语法
select 字段列表 from 表a 别名a join 表a 别名b on 条件.....;


二：联合查询：1.union

对于union查询，就是把多次查询的结果合并起来，形成一个新的查询结果集。

select 字段列表 from 表a.....
union[all]
select 字段列表 from 表b,,,,;

注意：如果写all会有重复，若要看交集则删除all，查询的字段必须相同，列数必须保持一致。


三：子查询
称为嵌套查询又称为子查询

select * from t1 where column1 = (select column1 from t2);

子查询外部语句可以是insert/update/delete/select的任何一个

根据子查询结果不同，可分为：
标量子查询（子查询结果为单个值）
列子查询（子查询结果为一列）：例：in ()或者 any（），some（）  注意in不能用关系运算符，他们所代表的是在这些括号里的条件； all()//指括号里的所有条件条件
行子查询（子查询结果为一行）: 例：where(s1,s2)=(s1.s,s2.s)
表子查询（子查询结果为多行多列）:常用操作符：in
```

---

### 事务与隔离级别

```mysql
事务：是一组操作的集合，它是一个不可分割的工作单位。事务会把所有的操作作为一个整体一起向系统提交或者撤销操作请求，即这些操作要么同时成功，要么同时失败。

一..开启事务->抛出异常->回滚事务
        ->提交事务

例子:转账操作（张三给李四转账1000）
1.查询账户的余额
select * from account where name='张三';

-- 2.张三减少1000
update account set money = money - 1000 where name = '张三';

-- 3.李四增加1000
update account set money = money + 1000 where name = '李四';


我们要将这些控制在一个事务内，不然就会出现异常减去钱但没加上之类的。。。


事务操作：
1.查看/设置事务提交方式
select @@autocommit;     //查看是否是自动方式，若是1则是自动提交，0则是手动提交
set @@autocommit = 0;

2.提交事务
commit;

3.回滚事务
rollback;

4.开启事务
start transaction 或 begin;


注意：新版本在上面有修改手动还是自动的选项，不用指令;


二.事务-四大特性(ACID)
原子性(Atomicity):事务是不可分割的最小操作单元，要么全部成功，要么全部失败。
一致性(Consistency):事务完成时，必须使所有的数据都保持一致。
隔离性(Isolation):数据库系统提供的隔离机制，保证事务在不受外部并发操作影响的独立环境下运行。
持久性(Durability):事务一旦提交或回滚，它对数据库中的数据的改变就是永久的。

三.事务-并发事务问题
问题					描述
脏读					一个事务读到另外一个事务还没有提交的数据
不可重复读			  一个事务先后读取同一条记录，但两次读取的数据不同，称之为不可重复读
幻读					一个事务按照条件查询数据时，没有对应的数据行，但是在插入数据时，又发现这行数据已经存									  在，好像出现"幻影"

四.事务-隔离级别(√是允许出现×是不允许出现)
1.隔离级别			脏读				不可重复读			幻读
Read uncommitted      √					√					√
Read committed			×				√					√
Repeatable Read(默认)		×				×					√
Serializable			×				×					×

2.查看当前数据库事务隔离级别：
select @@transaction_isolation
3.设置事务隔离级别(session|global : 客户端当前窗口|所有窗口)：
set [session|global] transaction isolation level {read uncommitted | Read committed| Repeatable Read | Serializable}
```

---

### 用户与权限 DCL

```mysql
DCL-管理用户
1.查询用户

use mysql;
select * from user;

2.创建用户

create user '用户名'@'主机名' identified by '密码';
如果想要任意主机都可以访问这个数据库 把主机名改为'%';

3.修改用户密码
alter user ‘用户名'@'主机名' identified whit mysql_native_password by '要改的密码''

set global validate_password.policy = 0;//修改密码的等级

set global validate_password.lengh = 4;//修改密码的长度

DCL-权限控制
权限						说明
all,all privileges 			所有权限
select					查询权限
insert					插入数据
update					修改数据
delete					删除数据
alter						修改表
drop						删除数据库/表/视图
create					创建数据库/表
usage					没有权限

4.连接myql数据库
mysql -uroot -p
mysql -h远程数据库IP地址 -P端口号 -u指定用户名（root） -p密码
1.查询权限
show grants for  '用户名'@'主机名';

2.授予权限
grant 权限列表 on 数据库名.表名 to '用户名'@'主机名';

3.撤销权限
revoke 权限列表 on 数据库名.表名 from '用户名'@'主机名';
```

---

### 存储引擎

```mysql
InnoDB

    是一种兼顾高可靠性和高性能的通用存储引擎，再mysql5.5之后，InnoDB是默认的MySQL存储引擎。
特点：
    DML操作遵循ACID模型，支持事务；
    行级锁，提高并发访问性能；
    支持外键foreign key约束，保证数据的完整性和正确性；
文件：
    xxx.ibd：xxx代表的是表名，innodb引的每张表都会对应这样一个表空间文件，存储该表的表结构（frm、sdi）、数据和索引。8.0之后都在sdi中了
    参数：innodb_file_per_table


```

![](./mysql/%E8%BF%9B%E9%98%B6/images/innoDB.png)

```mysql
MYISAM

介绍：
    是mysql早期的默认存储引擎
特点：
    不支持事务，不支持外键
    支持锁表，不支持行锁
    发访问速度块
文件：
    xxx.sdi:存储表结构信息
    xxx.MYD:存储数据
    xxx.MYI:存储索引
```

```mysql
Memory

介绍：
    Memory引擎的表数据时存储在内存中的，由于受到硬件问题，或断电问题的影响，智能将这些表作为临时表或缓存使用。
特点：
    内存存放
    hash索引（默认）
文件：
    xxx.sdi:存储表结构信息
```

![](./mysql/%E8%BF%9B%E9%98%B6/images/%E5%AD%98%E5%82%A8%E5%BC%95%E6%93%8E%E7%89%B9%E7%82%B9%E5%8C%BA%E5%88%AB.png)

```mysql
存储引擎的选择：

innoDB：是mysql的默认存储引擎，支持事务、外键。如果应用对事务的完整性有比较高的要求，在并发条件下要求数据的一致性，数据操作除了插入和查询之外，还包含很多的更新、删除操作，那么InnoDB存储引擎是比较合适的
MyISAM：如果应用是以读操作和插入操作为主，只有很少的更新和删除操作，并且对事务的完整性、并发性要求不是很高，那么选择这个存储引擎是非常合适的。
MEMORY：将所有数据保存在内存中访问速度块，通常用于临时表及缓存。MEMORY的缺陷就是对表额大小有限制，太大的无法缓存在内存中，而且无法保证数据的安全性。
```

---

### 索引原理

```mysql
高效获取数据的数据结构(有序);
优缺点：
        优势：提高数据检索的效率，降低数据库的io成本
             通过索引列对数据进行排序，降低数据排序的成本，降级CPU的消耗。
        劣势：索引列也是要占用空间的。
             索引大大提高了查询效率，同时却也降低更新表的速度，如对列表行insert，update，delete，效率降低。//增删改


索引结构：
        是在存储引擎层实现的，不同存储引擎有不同的结构：
        索引结构								描述
        B+Tree索引								最常见的索引类型，大部分引擎都支持B+树索引
        Hash索引									底层数据结构使用哈希表实现的，只有精确匹配索引列的查询才有效，不支持												   范围索引
        R-tree(空间索引)						   是MYISAM引擎的一个特殊索引类型，主要用于地理空间数据类型，通常使用较												 少
        Full-text(全文索引)						   是一种通过建立倒排索引，快速匹配文档的方式，类型与Lucene,Solr,ES


索引					InnoDB 						MylSAM						Memory
B+Tree索引(默认)		支持						  支持						支持
Hash索引				不支持							不支持						支持
R-tree				  不支持						支持						不支持
Full-text				5.6版本之后支持				支持						不支持


索引-结构-Btree
二叉树的缺点：顺序插入时，会形成一个链表，查询性能大大降低。大数据量情况下，层级较深，检索速度慢
红黑树：大数据量情况下，层级较深，检索速度慢。
B-Tree(多路平衡查找树)
以一颗最大度数(max-degree)为5(5阶)的b-tree为例(每个节点最多存储4个key，5个指针):


```

---

### 执行计划与 SQL 优化

#### SQL 进阶（MySQL）

#### 存储引擎（InnoDB / MyISAM / Memory）

```mysql
InnoDB
```

  - 默认存储引擎（MySQL 5.5+）
  - 支持事务（ACID）、行级锁、外键
  - 表空间：xxx.ibd（含表结构/数据/索引，8.0 后结构信息更多在 sdi 中）

MyISAM
  - 早期默认引擎
  - 不支持事务/外键
  - 支持表锁，不支持行锁

Memory
  - 数据在内存中，适合临时表/缓存
  - 默认 Hash 索引
```

![](./mysql/%E8%BF%9B%E9%98%B6/images/innoDB.png)

![](./mysql/%E8%BF%9B%E9%98%B6/images/%E5%AD%98%E5%82%A8%E5%BC%95%E6%93%8E%E7%89%B9%E7%82%B9%E5%8C%BA%E5%88%AB.png)

选择建议：

- 高一致性/高并发更新：InnoDB
- 读多写少、对事务要求不高：MyISAM（现在更多用 InnoDB）
- 临时/缓存：Memory（注意容量和断电丢失）

## 索引（核心概念）

索引：高效获取数据的数据结构（有序）

优势：
  - 提高检索效率，降低 IO
  - 减少排序成本，降低 CPU 消耗

劣势：
  - 占用额外空间
  - 降低写性能（insert/update/delete）

常见结构：
  - B+Tree（最常见）
  - Hash（精确匹配有效，不支持范围）
  - R-Tree（空间索引）
  - Full-text（倒排索引，全文检索）

| 常用指令                             | 作用                                                         | 用法                                                     |
| ------------------------------------ | ------------------------------------------------------------ | -------------------------------------------------------- |
| SHOW STATUS LIKE 'sort_merge_passes' | 看 `sort_merge_passes` 这个状态变量。如果数值增加了说明发生了磁盘外部排序，因为归并排序才会增加这个计数。也可以开启 `optimizer_trace`，能看到排序用了多少内存、有没有溢出。 | 执行 SQL 前后分别 `SHOW STATUS LIKE 'sort_merge_passes'` |
|                                      |                                                              |                                                          |
|                                      |                                                              |                                                          |


## 工具速记：

### EXPLAIN


| 字段            | 含义                   | 典型值 / 示例                                                | 性能提示 / 解析                           | 优化思路                       |
| --------------- | ---------------------- | ------------------------------------------------------------ | ----------------------------------------- | ------------------------------ |
| `id`            | 查询标识 / 执行顺序    | 1, 2, 3                                                      | id 越大越先执行（子查询、联合查询中顺序） | 理解子查询/联合查询顺序        |
| `select_type`   | 查询类型               | SIMPLE, PRIMARY, SUBQUERY, DERIVED, UNION                    | 判断查询是否复杂（子查询/派生表）         | 尽量避免 DERIVED/临时表        |
| `table`         | 当前访问的表           | user, order                                                  | 哪张表正在被访问                          | 确认表是否大、索引使用情况     |
| `type`          | 表访问类型（最重要）   | system, const, eq_ref, ref, range, index, ALL                | 决定查询效率；ALL 最差                    | 添加索引、改写 SQL             |
| `possible_keys` | 可能用的索引           | idx_a, idx_b                                                 | MySQL 认为可用的索引                      | 添加合适索引                   |
| `key`           | 实际使用的索引         | idx_a                                                        | 没有索引则 key=NULL → 性能差              | 确认索引被使用                 |
| `key_len`       | 使用索引的长度（字节） | 4, 8                                                         | 判断联合索引用了哪部分字段                | 确保最左前缀使用               |
| `ref`           | 索引匹配方式           | const, ref, eq_ref                                           | 表示索引用什么匹配条件                    | 判断是否唯一匹配               |
| `rows`          | 估算扫描行数           | 1000, 100000                                                 | 行数越大性能越差                          | 优化条件、索引覆盖             |
| `filtered`      | 估算过滤比例（%）      | 10, 100                                                      | rows × filtered = 实际扫描行数            | 提高过滤条件效率               |
| `Extra`         | 额外信息（关键）       | Using index, Using where, Using filesort, Using temporary, Using index condition | 解释执行计划行为                          | 优化排序、覆盖索引、避免临时表 |


| Extra 值              | 含义             | 性能   | 优化建议            |
| --------------------- | ---------------- | ------ | ------------------- |
| Using index           | 覆盖索引，不回表 | ✅ 最优 | 无需改进            |
| Using index condition | ICP，减少回表    | ✅ 很好 | 使用索引条件下推    |
| Using where           | 需要额外过滤     | ⚠️ 一般 | 改写 SQL 或索引优化 |
| Using filesort        | 需要额外排序     | ❌ 慢   | 联合索引 + 顺序一致 |
| Using temporary       | 使用临时表       | ❌ 慢   | 避免子查询 / 建索引 |

| type   | 含义              | 性能提示 |
| ------ | ----------------- | -------- |
| system | 表只有一行        | ✅ 最好   |
| const  | 主键/唯一索引查询 | ✅ 极佳   |
| eq_ref | 唯一索引匹配      | ✅ 很好   |
| ref    | 普通索引匹配      | ✅ 较好   |
| range  | 范围索引查询      | ⚠️ 一般   |
| index  | 全索引扫描        | ⚠️ 较慢   |
| ALL    | 全表扫描          | ❌ 最差   |

#### 实战口诀（EXPLAIN 看表法）

1. **key 有没有？** → 是否用索引
2. **type 是不是 ALL？** → 是否全表扫描
3. **rows 大不大？** → 扫描量
4. **Extra 有没有 filesort / temporary？** → 排序/临时表性能问题
5. **key_len** → 联合索引是否用全
6. **filtered** → 数据过滤效率


```

---

### 进阶重点复习

#### **MySQL的数据排序是如何实现的？**

- 首先执行order by然后查看是否命中索引
- 如果命中索引那么就按照索引排序
- 若没有命中索引，并且数据量 < sort_buffer_size那么就会走内存排序按照filesort排序，分为两种：
  - 单路排序(全字段)：如果一行的数据 < max_length_for_sort_data,那么就执行单路排序——将select全部放到sort_buffer中进行排序。
  - 并路排序：如果过大，那么就会走并路排序，只讲row_id(行id)和key值排序好，然后根据row_id回表去读取字段。（相比单路多一次IO）

- 如果数据量过大，那么就会用外部的磁盘的临时文件中进行归并排序，将小文件合并为大文件

##### **一条 SQL 语句在 MySQL 中的执行过程？**

- 首先客户端通过**连接器**与数据库建立连接，进行身份校验和权限校验
- （8.0前）通过缓存查询是否存在，若存在该语句直接返回结果。
- 将sql语句注入到**分析器**，将字符串拆分成token然后生成抽象语法树（AST）
- 再通过**优化器**选择最快的索引和最优的执行方式
- 最后通过**执行器**调用存储引擎接口进行数据读写
- 最终由**存储引擎**返回数据，由**执行器**返回给客户端

###### **MySQL 的索引类型有哪些？**

###### 根据数据结构划分：

- B+树索引：多层平衡树结构，叶子节点用链表串起来，既可以快速定位数据位置，又可以全表扫描（InnoDB 和 MyISAM 默认）
- 哈希索引：等值查找的速度是O(1)，不支持范围查找和排序（Memory 引擎，InnoDB引擎有自适应可以自动建）
- 全文索引：将文本分词倒排索引，类似搜索引擎，适合TEXT类型字段做关键词索引，适合文章检索
- 空间索引：基于R树实现，多维数据存储，地理坐标，支持区域查找和距离计算。

###### 根据InnoDB存储划分：

- 聚簇索引：主键索引就是聚簇索引，叶子节点直接存完整的行数据，数据按主键顺序物理存储。一张表只能有一个聚簇索引。
- 非聚簇索引：也叫二级索引，叶子节点只存索引字段值和主键值。查完二级索引还得拿着主键去聚簇索引里再查一遍，这个过程叫回表。

###### 从索引性质来看：

- 主键索引：唯一且非空，每张表只能有一个。InnoDB 里主键索引就是聚簇索引。
- 唯一索引：保证列值不重复，但允许有 NULL，可以有多个 NULL。
- 普通索引：没有唯一约束，纯粹为了加速查询。
- 联合索引：多列组合成一个索引，遵循最左前缀原则，列顺序很重要。
- 全文索引：文本搜索用。
- 空间索引：GIS 数据用。

###### **MySQL 的 Change Buffer 是什么？它有什么作用？**

是Innodb为了优化对非唯一二级索引进行写入操作的速率，当目标索引不在buffer pool中，不会立即读磁盘，则会将写入操作暂时存放在change buffer中，并且记录到redolog中，等该页被访问的时候就会进行merge，从而减少随机I/O，提高写性能。

---

### 远程环境中的 MySQL 操作

终端使用帮助

相关快捷键

终端:
alt 命令历史
ctrl 切换到命令输入框

命令输入框:
alt 命令历史
tab 补全
ctrl 切换到终端

列表窗口:
alt/tab/esc 关闭窗口
上下箭头 选择行

---

### MySQL 安装与连接

检测失败的，后面加 --force --nodeps 不检测依赖，强制安装

rpm -ivh  mysql-community-client-8.0.26-1.el7.x86_64.rpm --force --nodeps

rpm -ivh  mysql-community-client-plugins-8.0.26-1.el7.x86_64.rpm --force --nodeps

rpm -ivh  mysql-community-common-8.0.26-1.el7.x86_64.rpm --force --nodeps

rpm -ivh  mysql-community-devel-8.0.26-1.el7.x86_64.rpm --force --nodeps

 rpm -ivh  mysql-community-embedded-compat-8.0.26-1.el7.x86_64.rpm --force --nodeps

rpm -ivh  mysql-community-libs-8.0.26-1.el7.x86_64.rpm --force --nodeps

rpm -ivh  mysql-community-libs-compat-8.0.26-1.el7.x86_64.rpm --force --nodeps

 rpm -ivh  mysql-community-server-8.0.26-1.el7.x86_64.rpm --force --nodeps

rpm -ivh  mysql-community-test-8.0.26-1.el7.x86_64.rpm --force --nodeps       。

rpm -ivh

 yum install openssl-devel


无法启动试试这条命令，systemctl start mysqld.service

启动mysql服务
systemctl start mysqld  # 启动服务
        restart		//重启
        stop			//关闭


cd /etc/sysconfig/network-scripts

vi ifcfg-ens33  按下"i"或者"insert"键进入编辑模式。

若已经开启了网卡还是存在该问题可以尝试配置下国内的dns。

（1）输入命令 "vi /etc/resolv.conf"

（2）添加 "nameserver 114.114.114.114"

（3）保存后，重启系统或者重启网卡，输入命令 "reboot" 或 "service network restart"。

若上述方法还是无效可以尝试修改CentOS-Base.repo中的地址

（1）进入 "/etc/yum.repos.d" 。

（2）编辑 "vi CentOS-Base.repo" 。

（3）将所有的 "mirrorlist" 注释掉，将所有的 "baseurl" 取消注释。


阿里云镜像源

curl -o /etc/yum.repos.d/CentOS-Base.repo https://mirrors.aliyun.com/repo/Centos-7.repo
wget -O /etc/yum.repos.d/CentOS-Base.repo https://mirrors.aliyun.com/repo/Centos-7.re


perl(Data::Dumper) 被 mysql-community-test-8.0.26-1.el7.x86_64 需要
        perl(JSON) 被 mysql-community-test-8.0.26-1.el7.x86_64 需要
        perl(Test::More) 被 mysql-community-test-8.0.26-1.el7.x86_64 需要

从你提供的信息来看，mysql-community-test 软件包需要一些 Perl 模块作为依赖项，但你的系统似乎缺少这些模块。这些模块包括：

perl(Data::Dumper)
perl(JSON)
perl(Test::More)
要解决这个问题，你可以采取以下步骤来安装所需的 Perl 模块：

1. 使用 YUM 安装缺失的 Perl 模块
在 CentOS 系统上，你可以使用 yum 来安装这些 Perl 模块。可以运行以下命令：

```bash
sudo yum install perl-Data-Dumper perl-JSON perl-Test-More
```
2. 确保 CentOS 仓库已启用
确保你已经启用了 EPEL（Extra Packages for Enterprise Linux）仓库，因为某些 Perl 模块可能在这个仓库中。可以使用以下命令安装 EPEL：

```bash
sudo yum install epel-release
```
之后，再次尝试安装所需的 Perl 模块。

3. 运行 yum update
在安装这些模块之前，确保你的系统是最新的，这样可以减少依赖冲突的可能性。运行：

```bash
sudo yum update
```
4. 检查其他仓库
如果你依然遇到问题，检查你的 /etc/yum.repos.d/ 目录，确认你是否有其他的仓库配置，可能有用来提供这些 Perl 模块的源。

5. 安装 Perl 模块的方法有多种
如果通过 YUM 安装失败，可以使用 CPAN（Comprehensive Perl Archive Network）手动安装 Perl 模块：

```bash
sudo cpan Data::Dumper JSON Test::More
```
6. 验证安装
在完成功能安装之后，你可以通过以下命令来检查这些模块是否存在：

```bash
perl -MData::Dumper -e 'print "Data::Dumper is installed\n";'
perl -MJSON -e 'print "JSON is installed\n";'
perl -MTest::More -e 'print "Test::More is installed\n";'
```
如果这些命令没有返回错误，则表示模块已成功安装。

完成上述步骤后，重新尝试安装或更新 mysql-community-test 软件包。


安装 EPEL 仓库（如果尚未安装）：

```bash
sudo yum install epel-release
```
安装 Perl 和 Test::More 模块：
使用 CPAN 来安装 Test::More：

```bash
sudo cpan Test::More
```
如果你更倾向于使用 YUM，可以尝试：

```bash
sudo yum install perl-Test-Simple
```
Test::More 是 perl-Test-Simple 的一部分，因此安装后应该会解决依赖。

再次尝试安装 MySQL：
依赖安装完成后，重新运行之前的安装命令。


两个命令都可以，执行完成后进入/etc/yum.repos.d

## MySQL 工程实践补充

### 表设计先确定访问模式

建表前回答：核心查询是什么、按什么条件过滤、如何排序、数据保留多久、写入量和增长量多大。索引来自访问模式，不是建完表后随意添加。

```sql
CREATE TABLE orders (
    id             BIGINT UNSIGNED NOT NULL,
    order_no       VARCHAR(32)     NOT NULL,
    user_id        BIGINT UNSIGNED NOT NULL,
    status         TINYINT         NOT NULL,
    payable_amount DECIMAL(12, 2)  NOT NULL,
    version        INT UNSIGNED    NOT NULL DEFAULT 0,
    created_at     DATETIME(3)     NOT NULL,
    updated_at     DATETIME(3)     NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_orders_order_no (order_no),
    KEY idx_orders_user_created (user_id, created_at DESC, id DESC),
    CONSTRAINT ck_orders_amount CHECK (payable_amount >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```

- 主键短、稳定且单调增长通常更利于 InnoDB 聚簇索引。
- 金额使用 `DECIMAL` 或最小货币单位整数，不使用浮点数。
- 时间精度、时区和序列化策略在系统内统一。
- 状态字段要有清晰枚举语义，避免魔法数字散落业务代码。
- `utf8mb4` 支持完整 Unicode，排序规则按大小写和业务需求选择。

### NULL 与默认值

NULL 表示未知或不适用，不等于空字符串和零。是否允许 NULL 由领域语义决定。不要为了“所有字段都非空”填入虚假日期或无意义的 0。

## InnoDB、MVCC 与锁

### MVCC 读视图

InnoDB 通过隐藏事务信息、undo log 和 Read View 为一致性读提供历史版本。普通 `SELECT` 通常是快照读；`SELECT ... FOR UPDATE` 是当前读并加锁。

在可重复读隔离级别中，同一事务内的快照读通常看到一致版本；当前读需要读取最新可见数据并参与锁竞争。不要把“可重复读”误解为所有查询都永远不阻塞。

### 常见锁

- Record Lock：锁索引记录。
- Gap Lock：锁索引区间，不锁具体记录。
- Next-Key Lock：记录锁与间隙锁组合。
- Intention Lock：表级意向锁，表示事务计划加行锁。
- Metadata Lock：保护表结构和访问的一致性。

锁基于索引。条件没有合适索引时，扫描和锁定范围可能远大于预期。

### 转账事务

```sql
START TRANSACTION;

SELECT id, balance
FROM account
WHERE id IN (101, 202)
ORDER BY id
FOR UPDATE;

UPDATE account SET balance = balance - 100.00 WHERE id = 101 AND balance >= 100.00;
UPDATE account SET balance = balance + 100.00 WHERE id = 202;

INSERT INTO transfer_log(transfer_no, from_id, to_id, amount, created_at)
VALUES ('T20260819001', 101, 202, 100.00, NOW(3));

COMMIT;
```

统一加锁顺序可减少死锁，转账号使用唯一约束保证幂等。每条更新都要检查受影响行数。

### 死锁处理

死锁是并发系统正常需要处理的失败类型：

```sql
SHOW ENGINE INNODB STATUS;
```

应用捕获死锁错误后，仅对幂等事务做有限重试并增加随机退避。根因修复通常是统一加锁顺序、缩短事务、补充索引和减少一次事务处理的数据量。

## 索引设计

### 联合索引

联合索引 `(user_id, status, created_at)` 能否使用取决于查询条件、范围和排序。左侧列约束后，后续列更可能继续参与定位或排序；出现范围条件后，后续列通常不能继续缩小扫描范围，但仍可能用于覆盖。

```sql
SELECT id, order_no, payable_amount, created_at
FROM orders
WHERE user_id = ? AND status = ?
ORDER BY created_at DESC, id DESC
LIMIT 20;
```

可考虑索引 `(user_id, status, created_at DESC, id DESC)`，再通过真实数据量和执行计划验证。

### 覆盖索引

查询所需列全部在索引中时，可以减少回表。但把大量宽字段塞入索引会增加空间、写放大和缓存压力。索引不是越“覆盖”越好。

### 低选择性列

单独给布尔或少量状态值建索引往往收益有限。与租户、用户或时间组合后才可能有效。优化器是否选择索引还取决于统计信息和预计行数。

### 前缀与函数

```sql
WHERE DATE(created_at) = '2026-08-19'
```

对索引列做函数运算可能阻止普通索引范围查找，改成：

```sql
WHERE created_at >= '2026-08-19 00:00:00'
  AND created_at <  '2026-08-20 00:00:00'
```

也可根据固定表达式设计生成列或函数索引，但要评估写入成本。

## 执行计划与诊断

### EXPLAIN ANALYZE

MySQL 8 可以执行查询并展示实际耗时和行数：

```sql
EXPLAIN ANALYZE
SELECT user_id, SUM(payable_amount)
FROM orders
WHERE status = 3
  AND created_at >= NOW() - INTERVAL 30 DAY
GROUP BY user_id;
```

重点比较优化器估算行数与实际行数。偏差很大可能来自统计信息过期、数据倾斜、条件相关性或表达式难以估算。

### 诊断顺序

1. 获取慢 SQL、参数范围和业务频率。
2. 确认返回行数是否合理，是否一次取太多数据。
3. 查看执行计划的访问类型、扫描行数、连接顺序和临时表。
4. 检查索引是否匹配过滤、连接和排序。
5. 观察锁等待、磁盘 I/O、Buffer Pool 和并发量。
6. 在接近生产分布的数据上验证改写前后结果和耗时。

只在小测试表上执行一次查询，不能证明生产优化有效。

### 慢查询与 Performance Schema

慢日志适合找到高耗时 SQL；Performance Schema 和 `sys` 库可按总耗时、平均耗时、扫描行数和等待类型聚合。优化优先处理总影响最大的查询，而不是只处理单次最慢的一条。

## 查询优化模式

### Keyset 分页

深分页：

```sql
SELECT id, title
FROM article
ORDER BY created_at DESC, id DESC
LIMIT 100000, 20;
```

数据库仍需跳过大量行。使用上页最后位置：

```sql
SELECT id, title, created_at
FROM article
WHERE (created_at, id) < (?, ?)
ORDER BY created_at DESC, id DESC
LIMIT 20;
```

排序键必须稳定且有对应联合索引。

### 批量操作

大量单行 insert 会产生频繁往返。使用合理批量、预编译和事务，但单批不能过大，否则会增加锁、日志、内存和复制延迟。

### 避免无边界查询

管理后台导出也应分页、异步和限流。`SELECT *` 增加网络、反序列化和回表成本，也使接口依赖不需要的列。

## 复制、备份与恢复

### 复制不是备份

主库误删数据会复制到从库。备份需要独立保存、保留多个时间点并定期恢复演练。

### 备份目标

- RPO：最多允许丢失多少数据。
- RTO：故障后多久恢复服务。
- 全量备份周期与增量/binlog 保留。
- 备份加密、访问权限和异地存储。
- 恢复到指定时间点的步骤与验证。

没有经过恢复演练的备份，只能算“存在一些文件”。

### 读写分离注意事项

复制通常存在延迟。用户写入后立即读取可能在从库看不到。关键读可以走主库、携带一致性标记或等待复制位点；不能简单认为所有 SELECT 都能安全发到从库。

## 生产运行检查

- 连接池总连接数不超过数据库承载能力。
- 事务短小，无长时间空闲事务。
- 慢 SQL、锁等待、死锁和复制延迟有监控。
- Buffer Pool 命中、磁盘延迟和 redo 写入趋势稳定。
- schema 变更使用在线策略并评估锁表风险。
- 账号最小权限，应用不使用 root。
- 备份、binlog 和恢复流程定期演练。

## 综合示例

### 综合示例：订单表设计与聚合查询

```sql
CREATE TABLE orders (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  status VARCHAR(20) NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_created (user_id, created_at)
);

SELECT user_id, COUNT(*) AS order_count, SUM(amount) AS total_amount
FROM orders
WHERE created_at >= '2026-01-01'
  AND status = 'PAID'
GROUP BY user_id
HAVING SUM(amount) >= 1000
ORDER BY total_amount DESC
LIMIT 20;
```

示例要点：

- 金额使用 `DECIMAL`，状态列使用受控值并由业务或约束保证合法。
- 联合索引顺序应结合等值条件、范围条件和排序需求验证。
- 优化前先使用真实数据量和 `EXPLAIN`，不要凭直觉添加索引。

## 常见误区

- 使用 `SELECT *` 作为长期接口契约
- 在索引列上进行不必要的函数或隐式类型转换
- 事务范围过大，并在事务中调用慢速远程接口
- 重复创建高度相似的索引却不检查写入成本

## 练习题

1. 为什么示例索引 `(user_id, created_at)` 不一定适合给定聚合查询？
2. 设计转账事务的关键步骤。
3. `WHERE` 与 `HAVING` 的区别是什么？
4. `EXPLAIN ANALYZE` 中估算行数和实际行数差距很大说明什么？
5. 读写分离场景如何处理“刚写完立即读取”？

## 参考答案

### 1. 为什么示例索引 `(user_id, created_at)` 不一定适合给定聚合查询？

查询没有限定 user_id，无法充分利用最左前缀。应基于查询频率评估 `(status, created_at, user_id)` 等方案，并用 EXPLAIN 和真实数据验证。

### 2. 设计转账事务的关键步骤。

开启事务；按固定顺序锁定账户；校验余额；扣减与增加余额；记录流水；提交。任何异常回滚，并通过唯一业务号保证幂等。

### 3. `WHERE` 与 `HAVING` 的区别是什么？

WHERE 在分组前过滤行；HAVING 在 GROUP BY 后过滤聚合结果。能前置到 WHERE 的条件通常应前置。

### 4. `EXPLAIN ANALYZE` 中估算行数和实际行数差距很大说明什么？

说明优化器对数据分布判断不准，可能是统计信息过期、数据倾斜、条件相关性或表达式难以估算。应更新或检查统计信息、调整查询和索引，再比较新计划。

### 5. 读写分离场景如何处理“刚写完立即读取”？

关键读短时间走主库，或携带写入位点并等待从库追上，也可让接口直接返回写入结果。不能默认异步复制从库具备立即一致性。

## 复习清单

- [ ] 能写出清晰的 CRUD 和多表查询
- [ ] 能设计主键、外键、唯一约束和字段类型
- [ ] 能解释 ACID 与隔离级别
- [ ] 能读取 EXPLAIN 并验证索引效果

## 官方文档与延伸阅读

- [MySQL 8.4 Reference Manual](https://dev.mysql.com/doc/refman/8.4/en/) - SQL、InnoDB 与服务器运维总入口。
- [InnoDB Transaction Model](https://dev.mysql.com/doc/refman/8.4/en/innodb-transaction-model.html) - MVCC、隔离级别和锁。
- [EXPLAIN ANALYZE](https://dev.mysql.com/doc/refman/8.4/en/explain.html) - 执行计划与实际运行统计。
- [Optimization](https://dev.mysql.com/doc/refman/8.4/en/optimization.html) - 索引、查询和服务器优化。
- [Backup and Recovery](https://dev.mysql.com/doc/refman/8.4/en/backup-and-recovery.html) - 备份、恢复与时间点恢复。

## 原始资料索引

- SQL 基础总览：`数据矩阵/mysql/基础/SQL基础.md`
- 数据库与表操作：`数据矩阵/mysql/基础/数据库操作.md`
- 数据定义语言 DDL：`数据矩阵/mysql/基础/DDL.md`
- 数据操作语言 DML：`数据矩阵/mysql/基础/DML.md`
- 数据查询语言 DQL：`数据矩阵/mysql/基础/DQL.md`
- 常用函数：`数据矩阵/mysql/基础/函数.md`
- 约束与数据完整性：`数据矩阵/mysql/基础/约束.md`
- 多表查询：`数据矩阵/mysql/基础/多表查询.md`
- 事务与隔离级别：`数据矩阵/mysql/基础/事务.md`
- 用户与权限 DCL：`数据矩阵/mysql/基础/DCL.md`
- 存储引擎：`数据矩阵/mysql/进阶/存储引擎.md`
- 索引原理：`数据矩阵/mysql/进阶/索引.md`
- 执行计划与 SQL 优化：`数据矩阵/mysql/进阶/SQL进阶.md`
- 进阶重点复习：`数据矩阵/mysql/进阶/重点.md`
- 远程环境中的 MySQL 操作：`数据矩阵/mysql/进阶/finalshell.md`
- MySQL 安装与连接：`数据矩阵/finalshell/安装mysql.md`

> 整理原则：正文保留原笔记知识点，统一标题层级与资源链接；新增示例、练习和答案用于检验理解。遇到版本相关 API 时，应以所用版本的官方文档为准。

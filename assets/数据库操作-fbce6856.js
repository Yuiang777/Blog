const n=`\`\`\`mysql\r
查询所有数据库：\r
show databases；\r
查询当前数据库\r
select database();\r
创建\r
create database [if not exists] 数据库名 [default charset 字符集] 【collate 排序规则];\r
删除\r
drop databases [if exists] 数据库名;\r
使用\r
use 数据库名;\r
\r
\r
\r
mysql -u '数据库用户名' -p\r
\r
注：其中的【】号可以忽略\r
DDL -表查询-查询：\r
查询当前数据库所有表\r
show tables;\r
查询表结构\r
desc表名；\r
查询指定表的建表语句\r
show create table 表名；\r
\r
\r
DDL-表操作-创建\r
create table 表名（\r
 字段1 字段1类型[comment 字段1注释]\r
 字段2 字段2类型[comment 字段2注释]\r
.........\r
字段n 字段n类型[comment 字段n注释]\r
)[commen 表注释]//例如eng设置自增字段的初始值。ine=innodb//修改存储引擎类型;\r
AUTO_INCREMENT=2 //设置自增字段的初始值。\r
DEFAULT CHARSET=utf8mb4 //设置表的默认字符集为 utf8mb4。\r
\r
COLLATE=utf8mb4_bin //设置表的默认排序规则为 utf8mb4_bin\r
_bin 是 “binary” 的缩写，意味着直接按照字符的二进制编码值进行比较和排序。\r
这种排序规则是区分大小写的（'A' != 'a'）和区分重音的（'ü' != 'u'）。\r
另一种常见的规则是 utf8mb4_unicode_ci（ci 表示 Case Insensitive，不区分大小写）。\r
\r
charecter set [编码格式] //设置字段的编码格式\r
\r
\r
DLL-表操作-修改\r
添加字段\r
alter table 表名 add 字段名 类型（长度）【comment‘名称（可加可不加）’】【约束】；\r
修改数据类型\r
alter table 表名modify 字段名 新数据类型（长度）；\r
修改字段名和字段类型\r
alter table 表名 change 旧字段名 新字段名 类型（长度） 【comment  ‘用户名’】【约束】；\r
删除字段\r
alter table 表名 drop 字段名；\r
修改表名\r
alter table 表名 rename to 新表名；\r
\r
\r
DDL-表操作-删除\r
删除表\r
drop table 【if exists】 表名； #其中的【】若有就删除，没有也不报错；\r
删除指定表，并重新创建该表\r
truncate table 表名；  #不管哪个都会删除掉内容， 第二个保留表的结构\r
\r
1.查看变量信息\r
  显示MySQL服务器的配置变量的值，这个命令常在排查问题的时候用到，用于查看mysql实例的参数配置，经常结合like一起使用，用于过滤指定参数。可以使用show global variables或者show session variables查看全局或者会话参数，默认是查看会话参数。\r
2.查看数据表的索引信息\r
  如果我们需要查看某表都创建了哪些索引可以使用show index from table_name的方式查看，默认有主键索引，如果还创建了其他索引通过此方式都可以看到。\r
  \r
  \r
3.使用show grants for user@host 可以查看用户的授权，如果用户的host是任意源可以省略；也可以直接输入show grants查看当前用户的权限。\r
\r
\r
\r
4.查看数据库创建信息\r
  使用show create 可以查看创建数据库、事件、函数、存储过程、触发器、视图等的信息，需要对应的名称。\r
\r
mysql> show create database testdb;\r
SHOW CREATE DATABASE db_name\r
SHOW CREATE EVENT event_name\r
SHOW CREATE FUNCTION func_name\r
SHOW CREATE PROCEDURE proc_name\r
SHOW CREATE TRIGGER trigger_name\r
SHOW CREATE VIEW view_name\r
\r
\r
\r
5、查看最近事件\r
mysql> show events;\r
Empty set (0.00 sec)\r
\r
6、查看最近告警\r
mysql> show warnings;\r
Empty set (0.00 sec)\r
\r
7、查看最近错误\r
mysql> show errors;\r
Empty set (0.00 sec)\r
\r
8、查看引擎状态\r
  查看innodb引擎状态，\r
\r
mysql> SHOW ENGINE innodb status;\r
\r
9、查看已安装的插件\r
mysql>SHOW PLUGINS\r
\r
\r
\r
查看所有打开的表\r
mysql> show open tables;\r
\r
12、查看数据库触发器\r
  我们可以通过show triggers查看所有触发器，也可以show triggers from db_name查看指定数据库的触发器。\r
\r
mysql> show triggers from testdb;\r
\r
13、查看函数或者存储过程状态\r
mysql> SHOW FUNCTION STATUS like ‘%version_patch%’\\G\r
mysql> SHOW PROCEDURE STATUS like ‘table_exists’\\G\r
\r
14、使用profile语句分析sql性能\r
  我们可以使用profile语句分析需要执行的sql执行的性能情况，可以看到sql执行的各阶段的资源消耗，SHOW PROFILE语句支持选择ALL、CPU、BLOCK IO、CONTEXT SWITCH和PAGE FAULTS等来查看具体的明细信息。不过此功能即将被淘汰，在新版本中通过Performance Schema库来分析资源消耗和使用情况。\r
\r
mysql> set profiling=1;\r
mysql> select count(*) from testdb.tb_0001;\r
mysql> show profiles;\r
mysql> show profile for query 1;\r
mysql> show profile cpu for query 1;\r
\r
\r
\r
五、show status常用参数说明\r
  使用SHOW STATUS语句能够获取MySQL服务器的一些状态信息，这些状态信息主要是MySQL数据库的性能参数。SHOW STATUS语句的语法格式如下：\r
\r
SHOW [SESSION | GLOBAL] STATUS LIKE ‘status_name’;\r
\r
  其中，SESSION表示获取当前会话级别的性能参数，GLOBAL表示获取全局级别的性能参数，并且SESSION和GLOBAL可以省略，如果省略不写，默认为SESSION。status_name表示查询的参数值。熟练掌握这些参数的使用，能够更好地了解SQL语句的执行频率。常用参数说明如下：\r
\r
参数值	参数说明\r
Connections	连接MySQL服务器的次数\r
Uptime MySQL	服务器启动后连续工作的时间\r
Slow_queries	慢查询的次数\r
Com insert	插入数据的次数，批量插入多条数据时，只累加1\r
Com delete	删除数据的次数，每次累加1\r
Com update	修改数据的次数，每次累加1\r
Com select	查询数据的次数，一次查询操作累加1\r
Innodb rows read	查询数据时返回的数据行数\r
Innodb rows inserted	插入数据时返回的记录数\r
Innodb rows updated	更新数据时返回的记录数\r
Innodb rows deleted	删除数据时返回的记录数\r
\r
show variables like'innodb_file_per_table'查询innodb存储引擎是否打开;\r
\r
\r
\r
\r
\r
\r
\r
\r
\r
\`\`\`\r
\r
`;export{n as default};

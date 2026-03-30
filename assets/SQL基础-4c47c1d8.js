const n=`# SQL 基础（MySQL）

## 数据库与表（DDL）

\`\`\`mysql
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
\`\`\`

## 数据操作（DML）

\`\`\`mysql
insert into 表名(字段1, 字段2, ...) values(值1, 值2, ...);
insert into 表名 values(值1, 值2, ...);
insert into 表名(字段1, 字段2, ...) values(值1, 值2, ...), (值1, 值2, ...);

update 表名 set 字段1 = 值1, 字段2 = 值2 where 条件;

delete from 表名 where 条件;
\`\`\`

## 查询（DQL）

\`\`\`mysql
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
\`\`\`

执行顺序（记忆版）：

\`\`\`
from -> where -> group by -> having -> select -> order by -> limit
\`\`\`

## 多表查询（Join / Union / 子查询）

\`\`\`mysql
select ... from 表1 join 表2 on 条件;
select ... from 表1 left join 表2 on 条件;
select ... from 表1 right join 表2 on 条件;

select ... from 表a
union [all]
select ... from 表b;

select * from t1 where col = (select col from t2);
\`\`\`

## 约束（Constraints）

- 非空：\`not null\`
- 唯一：\`unique\`
- 主键：\`primary key\`
- 默认：\`default\`
- 检查（8.0.13+）：\`check\`
- 外键：\`foreign key\`
- 自增：\`auto_increment\`

外键（添加 / 删除）：

\`\`\`mysql
alter table 子表 add constraint 外键名
foreign key (子表字段) references 主表(主表字段);

alter table 子表 drop foreign key 外键名;
\`\`\`

级联示例：

\`\`\`mysql
alter table 子表 add constraint 外键名
foreign key (外键字段) references 主表(主表字段)
on update cascade on delete cascade;
\`\`\`

## 事务（ACID / 隔离级别）

\`\`\`mysql
select @@autocommit;
set @@autocommit = 0;

start transaction;
commit;
rollback;

select @@transaction_isolation;
set session transaction isolation level repeatable read;
\`\`\`

并发问题速记：脏读 / 不可重复读 / 幻读

## 用户与权限（DCL）

\`\`\`mysql
use mysql;
select * from user;

create user '用户名'@'主机名' identified by '密码';
show grants for '用户名'@'主机名';

grant 权限列表 on 数据库名.表名 to '用户名'@'主机名';
revoke 权限列表 on 数据库名.表名 from '用户名'@'主机名';
\`\`\`

`;export{n as default};

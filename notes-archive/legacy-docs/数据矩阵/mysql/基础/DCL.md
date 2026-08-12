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


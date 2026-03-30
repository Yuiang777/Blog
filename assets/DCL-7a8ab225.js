const t=`\`\`\`mysql\r
DCL-管理用户\r
1.查询用户\r
\r
use mysql;\r
select * from user;\r
\r
2.创建用户\r
\r
create user '用户名'@'主机名' identified by '密码';\r
如果想要任意主机都可以访问这个数据库 把主机名改为'%';\r
\r
3.修改用户密码\r
alter user ‘用户名'@'主机名' identified whit mysql_native_password by '要改的密码''\r
\r
set global validate_password.policy = 0;//修改密码的等级\r
\r
set global validate_password.lengh = 4;//修改密码的长度\r
\r
DCL-权限控制\r
权限						说明\r
all,all privileges 			所有权限\r
select					查询权限\r
insert					插入数据\r
update					修改数据\r
delete					删除数据\r
alter						修改表\r
drop						删除数据库/表/视图\r
create					创建数据库/表\r
usage					没有权限\r
\r
4.连接myql数据库\r
mysql -uroot -p\r
mysql -h远程数据库IP地址 -P端口号 -u指定用户名（root） -p密码\r
1.查询权限\r
show grants for  '用户名'@'主机名';\r
\r
2.授予权限\r
grant 权限列表 on 数据库名.表名 to '用户名'@'主机名';\r
\r
3.撤销权限\r
revoke 权限列表 on 数据库名.表名 from '用户名'@'主机名';\r
\`\`\`\r
\r
`;export{t as default};

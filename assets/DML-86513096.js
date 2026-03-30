const n=`\`\`\`mysql\r
DML-添加数据\r
\r
1.给指定字段添加数据\r
insert into 表名（字段名1 ， 字段名2 ， ......) values(值1 ， 值2 ， ....);\r
\r
2 . 给全部字段添加数据\r
insert into 表名 values(值1 ， 值2 ， .....）;\r
\r
3.批量添加数据\r
insert into 表名（字段名1 ， 字段名2 ， ......) values(值1 ， 值2 ， ....), (值1 ， 值2，.....); \r
insert into 表名 values(值1 ， 值2 ， .....）,(值1 ， 值2 ， .....）,(值1 ， 值2 ， .....）;\r
\r
注：插入数据的时候， 指定的字段顺序需要与值的顺序是一一对应的。\r
字符串和日期型数据应该包含在引号中。\r
插入的数据大小，应该在字段的规定范围内。\r
\r
\r
DML-修改数据\r
update 表名 set 字段名1 = 值1 ， 字段名2 = 值2，[where 条件];\r
\r
\r
\r
DML-删除数据\r
delete from 表名 [where 条件];\r
\`\`\`\r
\r
`;export{n as default};

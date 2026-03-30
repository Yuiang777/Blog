const t=`\`\`\`mysql\r
事务：是一组操作的集合，它是一个不可分割的工作单位。事务会把所有的操作作为一个整体一起向系统提交或者撤销操作请求，即这些操作要么同时成功，要么同时失败。\r
\r
一..开启事务->抛出异常->回滚事务\r
		->提交事务\r
\r
例子:转账操作（张三给李四转账1000）\r
1.查询账户的余额\r
select * from account where name='张三';\r
\r
-- 2.张三减少1000\r
update account set money = money - 1000 where name = '张三';\r
\r
-- 3.李四增加1000\r
update account set money = money + 1000 where name = '李四';\r
\r
\r
我们要将这些控制在一个事务内，不然就会出现异常减去钱但没加上之类的。。。\r
\r
\r
\r
事务操作：\r
1.查看/设置事务提交方式\r
select @@autocommit;     //查看是否是自动方式，若是1则是自动提交，0则是手动提交\r
set @@autocommit = 0;\r
\r
2.提交事务\r
commit;\r
\r
3.回滚事务\r
rollback;\r
\r
4.开启事务\r
start transaction 或 begin;\r
\r
\r
注意：新版本在上面有修改手动还是自动的选项，不用指令;\r
\r
\r
\r
\r
\r
\r
二.事务-四大特性(ACID)\r
原子性(Atomicity):事务是不可分割的最小操作单元，要么全部成功，要么全部失败。\r
一致性(Consistency):事务完成时，必须使所有的数据都保持一致。\r
隔离性(Isolation):数据库系统提供的隔离机制，保证事务在不受外部并发操作影响的独立环境下运行。\r
持久性(Durability):事务一旦提交或回滚，它对数据库中的数据的改变就是永久的。\r
\r
三.事务-并发事务问题\r
问题					描述\r
脏读					一个事务读到另外一个事务还没有提交的数据\r
不可重复读			  一个事务先后读取同一条记录，但两次读取的数据不同，称之为不可重复读\r
幻读					一个事务按照条件查询数据时，没有对应的数据行，但是在插入数据时，又发现这行数据已经存									  在，好像出现"幻影"\r
\r
四.事务-隔离级别(√是允许出现×是不允许出现)\r
1.隔离级别			脏读				不可重复读			幻读\r
Read uncommitted      √					√					√\r
Read committed			×				√					√\r
Repeatable Read(默认)		×				×					√\r
Serializable			×				×					×\r
\r
2.查看当前数据库事务隔离级别：\r
select @@transaction_isolation		\r
3.设置事务隔离级别(session|global : 客户端当前窗口|所有窗口)：\r
set [session|global] transaction isolation level {read uncommitted | Read committed| Repeatable Read | Serializable}   					\r
\`\`\`\r
\r
`;export{t as default};

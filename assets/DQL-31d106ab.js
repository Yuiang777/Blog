const E=`\`\`\`mysql\r
DQL-基本查询\r
1.查询多个字段\r
select 字段1，字段2，字段3......from 表名;\r
select * from 表名; #*指的是返回所有字段\r
\r
2.设置别名\r
select 字段1 [as 别名1],字段2[as 别名2]......from 表名;\r
\r
3.去除重复记录\r
select distinct 字段列表 from 表名;\r
\r
\r
DQL-条件查询\r
1.语法\r
select 字段列表 from 表名 where 条件列表\r
\r
DQL-聚合函数\r
1.将一列数据作为整体，进行纵向计算\r
\r
2.常见：\r
函数						功能\r
min						最小值\r
max						最大值\r
count					统计数量\r
avg						平均值\r
sum						求和\r
\r
格式：select 聚合函数(其中写入字段列表) from 列表名;\r
注：不计算null值的\r
\r
\r
\r
\r
\r
DQL-分组查询（group by)\r
\r
1. 语法\r
   select 字段列表 from 表名 [where 条件] group by 分组字段名 [having 分组后过滤条件];\r
\r
2. where与having的区别\r
   执行时机不同 ，一个是在分组之前过滤的，第二个是分组之后\r
   判断条件不同：where不能对聚合函数进行判断， having可以\r
\r
\r
\r
DQL-排序查询 (order by)\r
1.语法\r
select 字段列表 from 表名 order by 字段1 排序方式1 ， 字段2 ， 排序方式2；\r
\r
2.排序方式\r
ASC：升序（默认值）\r
DESC：降序\r
注 ： 如果是多字段排序，当第一个字段值相同时，才会根据第二个字段进行排序。\r
\r
\r
\r
\r
DQL-分页查询\r
1.语法\r
select 字段列表 from 表名 limit 起始索引，查询记录数;\r
\r
注 ： 起始索引是从0开始，起始索引 = （查询页码 - 1）*每页显示记录数\r
分页查询是数据库的方言，不同的数据库有不同的实现，mysql中是limit\r
如果查询的是第一页数据，起始索引可以省略，直接简写为limit 10.\r
\r
\r
以上是编写顺序\r
\r
执行顺序：\r
from 表名列表\r
where 条件列表\r
group by 分组字段列表\r
having 分组后条件列表\r
select 字段列表\r
order by 排序字段列表\r
limit 分页参数\r
\r
\r
\`\`\`\r
\r
| 运算符             | 作用                       |                                                              |\r
| ------------------ | -------------------------- | ------------------------------------------------------------ |\r
| +                  | 加法                       |                                                              |\r
| -                  | 减法                       |                                                              |\r
| *                  | 乘法                       |                                                              |\r
| =                  | 等于                       |                                                              |\r
| <>, !=             | 不等于                     |                                                              |\r
| >                  | 大于                       |                                                              |\r
| <                  | 小于                       |                                                              |\r
| <=                 | 小于等于                   |                                                              |\r
| >=                 | 大于等于                   |                                                              |\r
| BETWEEN...AND..... | 在两值之间                 | >=min&&<=max                                                 |\r
| NOT BETWEEN        | 不在两值之间               |                                                              |\r
| IN                 | 在集合中                   |                                                              |\r
| NOT IN             | 不在集合中                 |                                                              |\r
| <=>                | 严格比较两个NULL值是否相等 | 两个操作码均为NULL时，其所得值为1；而当一个操作码为NULL时，其所得值为0 |\r
| LIKE               | 模糊匹配                   | （_匹配单个字符,%匹配任意个字符）                            |\r
| REGEXP 或 RLIKE    | 正则式匹配                 |                                                              |\r
| IS NULL            | 为空                       |                                                              |\r
| IS NOT NULL        | 不为空                     |                                                              |\r
| NOT 或 !           | 逻辑非                     |                                                              |\r
| AND                | 逻辑与                     |                                                              |\r
| OR                 | 逻辑或                     |                                                              |\r
| XOR                | 逻辑异或                   |                                                              |\r
| &                  | 按位与                     |                                                              |\r
| \\|                 | 按位或                     |                                                              |\r
| ^                  | 按位异或                   |                                                              |\r
| !                  | 取反                       |                                                              |\r
| <<                 | 左移                       |                                                              |\r
| >>                 | 右移                       |                                                              |\r
\r
**字符串函数**\r
\r
| 函数                                  | 描述                                                         | 实例                                                         |\r
| ------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |\r
| ASCII(s)                              | 返回字符串 s 的第一个字符的 ASCII 码。                       | 返回 CustomerName 字段第一个字母的 ASCII 码：\`SELECT ASCII(CustomerName) AS NumCodeOfFirstChar FROM Customers;\` |\r
| CHAR_LENGTH(s)                        | 返回字符串 s 的字符数                                        | 返回字符串 RUNOOB 的字符数\`SELECT CHAR_LENGTH("RUNOOB") AS LengthOfString;\` |\r
| CHARACTER_LENGTH(s)                   | 返回字符串 s 的字符数，等同于 CHAR_LENGTH(s)                 | 返回字符串 RUNOOB 的字符数\`SELECT CHARACTER_LENGTH("RUNOOB") AS LengthOfString;\` |\r
| CONCAT(s1,s2...sn)                    | 字符串 s1,s2 等多个字符串合并为一个字符串                    | 合并多个字符串\`SELECT CONCAT("SQL ", "Runoob ", "Gooogle ", "Facebook") AS ConcatenatedString;\` |\r
| CONCAT_WS(x, s1,s2...sn)              | 同 CONCAT(s1,s2,...) 函数，但是每个字符串之间要加上 x，x 可以是分隔符 | 合并多个字符串，并添加分隔符：\`SELECT CONCAT_WS("-", "SQL", "Tutorial", "is", "fun!")AS ConcatenatedString;\` |\r
| FIELD(s,s1,s2...)                     | 返回第一个字符串 s 在字符串列表(s1,s2...)中的位置            | 返回字符串 c 在列表值中的位置：\`SELECT FIELD("c", "a", "b", "c", "d", "e");\` |\r
| FIND_IN_SET(s1,s2)                    | 返回在字符串s2中与s1匹配的字符串的位置                       | 返回字符串 c 在指定字符串中的位置：\`SELECT FIND_IN_SET("c", "a,b,c,d,e");\` |\r
| FORMAT(x,n)                           | 函数可以将数字 x 进行格式化 "#,###.##", 将 x 保留到小数点后 n 位，最后一位四舍五入。 | 格式化数字 "#,###.##" 形式：\`SELECT FORMAT(250500.5634, 2);     -- 输出 250,500.56\` |\r
| INSERT(s1,x,len,s2)                   | 字符串 s2 替换 s1 的 x 位置开始长度为 len 的字符串           | 从字符串第一个位置开始的 6 个字符替换为 runoob：\`SELECT INSERT("google.com", 1, 6, "runoob");  -- 输出：runoob.com\` |\r
| LOCATE(s1,s)                          | 从字符串 s 中获取 s1 的开始位置                              | 获取 b 在字符串 abc 中的位置：\`SELECT LOCATE('st','myteststring');  -- 5\`返回字符串 abc 中 b 的位置：\`SELECT LOCATE('b', 'abc') -- 2\` |\r
| LCASE(s)                              | 将字符串 s 的所有字母变成小写字母                            | 字符串 RUNOOB 转换为小写：\`SELECT LCASE('RUNOOB') -- runoob\` |\r
| LEFT(s,n)                             | 返回字符串 s 的前 n 个字符                                   | 返回字符串 runoob 中的前两个字符：\`SELECT LEFT('runoob',2) -- ru\` |\r
| LOWER(s)                              | 将字符串 s 的所有字母变成小写字母                            | 字符串 RUNOOB 转换为小写：\`SELECT LOWER('RUNOOB') -- runoob\` |\r
| LPAD(s1,len,s2)                       | 在字符串 s1 的开始处填充字符串 s2，使字符串长度达到 len      | 将字符串 xx 填充到 abc 字符串的开始处：\`SELECT LPAD('abc',5,'xx') -- xxabc\` |\r
| LTRIM(s)                              | 去掉字符串 s 开始处的空格                                    | 去掉字符串 RUNOOB开始处的空格：\`SELECT LTRIM("    RUNOOB") AS LeftTrimmedString;-- RUNOOB\` |\r
| MID(s,n,len)                          | 从字符串 s 的 n 位置截取长度为 len 的子字符串，同 SUBSTRING(s,n,len) | 从字符串 RUNOOB 中的第 2 个位置截取 3个 字符：\`SELECT MID("RUNOOB", 2, 3) AS ExtractString; -- UNO\` |\r
| POSITION(s1 IN s)                     | 从字符串 s 中获取 s1 的开始位置                              | 返回字符串 abc 中 b 的位置：\`SELECT POSITION('b' in 'abc') -- 2\` |\r
| REPEAT(s,n)                           | 将字符串 s 重复 n 次                                         | 将字符串 runoob 重复三次：\`SELECT REPEAT('runoob',3) -- runoobrunoobrunoob\` |\r
| REPLACE(s,s1,s2)                      | 将字符串 s2 替代字符串 s 中的字符串 s1                       | 将字符串 abc 中的字符 a 替换为字符 x：\`SELECT REPLACE('abc','a','x') --xbc\` |\r
| REVERSE(s)                            | 将字符串s的顺序反过来                                        | 将字符串 abc 的顺序反过来：\`SELECT REVERSE('abc') -- cba\`    |\r
| RIGHT(s,n)                            | 返回字符串 s 的后 n 个字符                                   | 返回字符串 runoob 的后两个字符：\`SELECT RIGHT('runoob',2) -- ob\` |\r
| RPAD(s1,len,s2)                       | 在字符串 s1 的结尾处添加字符串 s2，使字符串的长度达到 len    | 将字符串 xx 填充到 abc 字符串的结尾处：\`SELECT RPAD('abc',5,'xx') -- abcxx\` |\r
| RTRIM(s)                              | 去掉字符串 s 结尾处的空格                                    | 去掉字符串 RUNOOB 的末尾空格：\`SELECT RTRIM("RUNOOB     ") AS RightTrimmedString;   -- RUNOOB\` |\r
| SPACE(n)                              | 返回 n 个空格                                                | 返回 10 个空格：\`SELECT SPACE(10);\`                          |\r
| STRCMP(s1,s2)                         | 比较字符串 s1 和 s2，如果 s1 与 s2 相等返回 0 ，如果 s1>s2 返回 1，如果 s1<s2 返回 -1 | 比较字符串：\`SELECT STRCMP("runoob", "runoob");  -- 0\`       |\r
| SUBSTR(s, start, length)              | 从字符串 s 的 start 位置截取长度为 length 的子字符串         | 从字符串 RUNOOB 中的第 2 个位置截取 3个 字符：\`SELECT SUBSTR("RUNOOB", 2, 3) AS ExtractString; -- UNO\` |\r
| SUBSTRING(s, start, length)           | 从字符串 s 的 start 位置截取长度为 length 的子字符串，等同于 SUBSTR(s, start, length) | 从字符串 RUNOOB 中的第 2 个位置截取 3个 字符：\`SELECT SUBSTRING("RUNOOB", 2, 3) AS ExtractString; -- UNO\` |\r
| SUBSTRING_INDEX(s, delimiter, number) | 返回从字符串 s 的第 number 个出现的分隔符 delimiter 之后的子串。 如果 number 是正数，返回第 number 个字符左边的字符串。 如果 number 是负数，返回第(number 的绝对值(从右边数))个字符右边的字符串。 | \`SELECT SUBSTRING_INDEX('a*b','*',1) -- a SELECT SUBSTRING_INDEX('a*b','*',-1)  -- b SELECT SUBSTRING_INDEX(SUBSTRING_INDEX('a*b*c*d*e','*',3),'*',-1)  -- c\` |\r
| TRIM(s)                               | 去掉字符串 s 开始和结尾处的空格                              | 去掉字符串 RUNOOB 的首尾空格：\`SELECT TRIM('    RUNOOB    ') AS TrimmedString;\` |\r
| UCASE(s)                              | 将字符串转换为大写                                           | 将字符串 runoob 转换为大写：\`SELECT UCASE("runoob"); -- RUNOOB\` |\r
| UPPER(s)                              | 将字符串转换为大写                                           | 将字符串 runoob 转换为大写：\`SELECT UPPER("runoob"); -- RUNOOB\` |\r
\r
## 数字函数\r
\r
​	\r
\r
| 函数名                             | 描述                                                         | 实例                                                         |\r
| ---------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |\r
| ABS(x)                             | 返回 x 的绝对值                                              | 返回 -1 的绝对值：\`SELECT ABS(-1) -- 返回1\`                  |\r
| ACOS(x)                            | 求 x 的反余弦值（单位为弧度），x 为一个数值                  | \`SELECT ACOS(0.25);\`                                         |\r
| ASIN(x)                            | 求反正弦值（单位为弧度），x 为一个数值                       | \`SELECT ASIN(0.25);\`                                         |\r
| ATAN(x)                            | 求反正切值（单位为弧度），x 为一个数值                       | \`SELECT ATAN(2.5);\`                                          |\r
| ATAN2(n, m)                        | 求反正切值（单位为弧度）                                     | \`SELECT ATAN2(-0.8, 2);\`                                     |\r
| AVG(expression)                    | 返回一个表达式的平均值，expression 是一个字段                | 返回 Products 表中Price 字段的平均值：\`SELECT AVG(Price) AS AveragePrice FROM Products;\` |\r
| CEIL(x)                            | 返回大于或等于 x 的最小整数                                  | \`SELECT CEIL(1.5) -- 返回2\`                                  |\r
| CEILING(x)                         | 返回大于或等于 x 的最小整数                                  | \`SELECT CEILING(1.5); -- 返回2\`                              |\r
| COS(x)                             | 求余弦值(参数是弧度)                                         | \`SELECT COS(2);\`                                             |\r
| COT(x)                             | 求余切值(参数是弧度)                                         | \`SELECT COT(6);\`                                             |\r
| COUNT(expression)                  | 返回查询的记录总数，expression 参数是一个字段或者 * 号       | 返回 Products 表中 products 字段总共有多少条记录：\`SELECT COUNT(ProductID) AS NumberOfProducts FROM Products;\` |\r
| DEGREES(x)                         | 将弧度转换为角度                                             | \`SELECT DEGREES(3.1415926535898) -- 180\`                     |\r
| n DIV m                            | 整除，n 为被除数，m 为除数                                   | 计算 10 除于 5：\`SELECT 10 DIV 5;  -- 2\`                     |\r
| EXP(x)                             | 返回 e 的 x 次方                                             | 计算 e 的三次方：\`SELECT EXP(3) -- 20.085536923188\`          |\r
| FLOOR(x)                           | 返回小于或等于 x 的最大整数                                  | 小于或等于 1.5 的整数：\`SELECT FLOOR(1.5) -- 返回1\`          |\r
| GREATEST(expr1, expr2, expr3, ...) | 返回列表中的最大值                                           | 返回以下数字列表中的最大值：\`SELECT GREATEST(3, 12, 34, 8, 25); -- 34\`返回以下字符串列表中的最大值：\`SELECT GREATEST("Google", "Runoob", "Apple");   -- Runoob\` |\r
| LEAST(expr1, expr2, expr3, ...)    | 返回列表中的最小值                                           | 返回以下数字列表中的最小值：\`SELECT LEAST(3, 12, 34, 8, 25); -- 3\`返回以下字符串列表中的最小值：\`SELECT LEAST("Google", "Runoob", "Apple");   -- Apple\` |\r
| LN                                 | 返回数字的自然对数，以 e 为底。                              | 返回 2 的自然对数：\`SELECT LN(2);  -- 0.6931471805599453\`    |\r
| LOG(x) 或 LOG(base, x)             | 返回自然对数(以 e 为底的对数)，如果带有 base 参数，则 base 为指定带底数。 | \`SELECT LOG(20.085536923188) -- 3 SELECT LOG(2, 4); -- 2\`    |\r
| LOG10(x)                           | 返回以 10 为底的对数                                         | \`SELECT LOG10(100) -- 2\`                                     |\r
| LOG2(x)                            | 返回以 2 为底的对数                                          | 返回以 2 为底 6 的对数：\`SELECT LOG2(6);  -- 2.584962500721156\` |\r
| MAX(expression)                    | 返回字段 expression 中的最大值                               | 返回数据表 Products 中字段 Price 的最大值：\`SELECT MAX(Price) AS LargestPrice FROM Products;\` |\r
| MIN(expression)                    | 返回字段 expression 中的最小值                               | 返回数据表 Products 中字段 Price 的最小值：\`SELECT MIN(Price) AS MinPrice FROM Products;\` |\r
| MOD(x,y)                           | 返回 x 除以 y 以后的余数                                     | 5 除于 2 的余数：\`SELECT MOD(5,2) -- 1\`                      |\r
| PI()                               | 返回圆周率(3.141593）                                        | \`SELECT PI() --3.141593\`                                     |\r
| POW(x,y)                           | 返回 x 的 y 次方                                             | 2 的 3 次方：\`SELECT POW(2,3) -- 8\`                          |\r
| POWER(x,y)                         | 返回 x 的 y 次方                                             | 2 的 3 次方：\`SELECT POWER(2,3) -- 8\`                        |\r
| RADIANS(x)                         | 将角度转换为弧度                                             | 180 度转换为弧度：\`SELECT RADIANS(180) -- 3.1415926535898\`   |\r
| RAND()                             | 返回 0 到 1 的随机数                                         | \`SELECT RAND() --0.93099315644334\`                           |\r
| ROUND(x [,y])                      | 返回离 x 最近的整数，可选参数 y 表示要四舍五入的小数位数，如果省略，则返回整数。 | \`SELECT ROUND(1.23456) --1 SELECT ROUND(345.156, 2) -- 345.16\` |\r
| SIGN(x)                            | 返回 x 的符号，x 是负数、0、正数分别返回 -1、0 和 1          | \`SELECT SIGN(-10) -- (-1)\`                                   |\r
| SIN(x)                             | 求正弦值(参数是弧度)                                         | \`SELECT SIN(RADIANS(30)) -- 0.5\`                             |\r
| SQRT(x)                            | 返回x的平方根                                                | 25 的平方根：\`SELECT SQRT(25) -- 5\`                          |\r
| SUM(expression)                    | 返回指定字段的总和                                           | 计算 OrderDetails 表中字段 Quantity 的总和：\`SELECT SUM(Quantity) AS TotalItemsOrdered FROM OrderDetails;\` |\r
| TAN(x)                             | 求正切值(参数是弧度)                                         | \`SELECT TAN(1.75);  -- -5.52037992250933\`                    |\r
| TRUNCATE(x,y)                      | 返回数值 x 保留到小数点后 y 位的值（与 ROUND 最大的区别是不会进行四舍五入） | \`SELECT TRUNCATE(1.23456,3) -- 1.234\`                        |\r
\r
## 日期函数\r
\r
| 函数名                                            | 描述                                                         | 实例                                                         |\r
| ------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |\r
| ADDDATE(d,n)                                      | 计算起始日期 d 加上 n 天的日期                               | \`SELECT ADDDATE("2017-06-15", INTERVAL 10 DAY); ->2017-06-25\` |\r
| ADDTIME(t,n)                                      | n 是一个时间表达式，时间 t 加上时间表达式 n                  | 加 5 秒：\`SELECT ADDTIME('2011-11-11 11:11:11', 5); ->2011-11-11 11:11:16 (秒)\`添加 2 小时, 10 分钟, 5 秒:\`SELECT ADDTIME("2020-06-15 09:34:21", "2:10:5");  -> 2020-06-15 11:44:26\` |\r
| CURDATE()                                         | 返回当前日期                                                 | \`SELECT CURDATE(); -> 2018-09-19\`                            |\r
| CURRENT_DATE()                                    | 返回当前日期                                                 | \`SELECT CURRENT_DATE(); -> 2018-09-19\`                       |\r
| CURRENT_TIME                                      | 返回当前时间                                                 | \`SELECT CURRENT_TIME(); -> 19:59:02\`                         |\r
| CURRENT_TIMESTAMP()                               | 返回当前日期和时间                                           | \`SELECT CURRENT_TIMESTAMP() -> 2018-09-19 20:57:43\`          |\r
| CURTIME()                                         | 返回当前时间                                                 | \`SELECT CURTIME(); -> 19:59:02\`                              |\r
| DATE()                                            | 从日期或日期时间表达式中提取日期值                           | \`SELECT DATE("2017-06-15");     -> 2017-06-15\`               |\r
| DATEDIFF(d1,d2)                                   | 计算日期 d1->d2 之间相隔的天数                               | \`SELECT DATEDIFF('2001-01-01','2001-02-02') -> -32\`          |\r
| DATE_ADD(d，INTERVAL expr type)                   | 计算起始日期 d 加上一个时间段后的日期，type 值可以是：MICROSECONDSECONDMINUTEHOURDAYWEEKMONTHQUARTERYEARSECOND_MICROSECONDMINUTE_MICROSECONDMINUTE_SECONDHOUR_MICROSECONDHOUR_SECONDHOUR_MINUTEDAY_MICROSECONDDAY_SECONDDAY_MINUTEDAY_HOURYEAR_MONTH | \`SELECT DATE_ADD("2017-06-15", INTERVAL 10 DAY);     -> 2017-06-25 SELECT DATE_ADD("2017-06-15 09:34:21", INTERVAL 15 MINUTE); -> 2017-06-15 09:49:21 SELECT DATE_ADD("2017-06-15 09:34:21", INTERVAL -3 HOUR); ->2017-06-15 06:34:21 SELECT DATE_ADD("2017-06-15 09:34:21", INTERVAL -3 MONTH); ->2017-03-15 09:34:21\` |\r
| DATE_FORMAT(d,f)                                  | 按表达式 f的要求显示日期 d                                   | \`SELECT DATE_FORMAT('2011-11-11 11:11:11','%Y-%m-%d %r') -> 2011-11-11 11:11:11 AM\` |\r
| DATE_SUB(date,INTERVAL expr type)                 | 函数从日期减去指定的时间间隔。                               | Orders 表中 OrderDate 字段减去 2 天：\`SELECT OrderId,DATE_SUB(OrderDate,INTERVAL 2 DAY) AS OrderPayDate FROM Orders\` |\r
| DAY(d)                                            | 返回日期值 d 的日期部分                                      | \`SELECT DAY("2017-06-15");   -> 15\`                          |\r
| DAYNAME(d)                                        | 返回日期 d 是星期几，如 Monday,Tuesday                       | \`SELECT DAYNAME('2011-11-11 11:11:11') ->Friday\`             |\r
| DAYOFMONTH(d)                                     | 计算日期 d 是本月的第几天                                    | \`SELECT DAYOFMONTH('2011-11-11 11:11:11') ->11\`              |\r
| DAYOFWEEK(d)                                      | 日期 d 今天是星期几，1 星期日，2 星期一，以此类推            | \`SELECT DAYOFWEEK('2011-11-11 11:11:11') ->6\`                |\r
| DAYOFYEAR(d)                                      | 计算日期 d 是本年的第几天                                    | \`SELECT DAYOFYEAR('2011-11-11 11:11:11') ->315\`              |\r
| EXTRACT(type FROM d)                              | 从日期 d 中获取指定的值，type 指定返回的值。 type可取值为： MICROSECONDSECONDMINUTEHOURDAYWEEKMONTHQUARTERYEARSECOND_MICROSECONDMINUTE_MICROSECONDMINUTE_SECONDHOUR_MICROSECONDHOUR_SECONDHOUR_MINUTEDAY_MICROSECONDDAY_SECONDDAY_MINUTEDAY_HOURYEAR_MONTH | \`SELECT EXTRACT(MINUTE FROM '2011-11-11 11:11:11')  -> 11\`   |\r
| FROM_DAYS(n)                                      | 计算从 0000 年 1 月 1 日开始 n 天后的日期                    | \`SELECT FROM_DAYS(1111) -> 0003-01-16\`                       |\r
| HOUR(t)                                           | 返回 t 中的小时值                                            | \`SELECT HOUR('1:2:3') -> 1\`                                  |\r
| LAST_DAY(d)                                       | 返回给给定日期的那一月份的最后一天                           | \`SELECT LAST_DAY("2017-06-20"); -> 2017-06-30\`               |\r
| LOCALTIME()                                       | 返回当前日期和时间                                           | \`SELECT LOCALTIME() -> 2018-09-19 20:57:43\`                  |\r
| LOCALTIMESTAMP()                                  | 返回当前日期和时间                                           | \`SELECT LOCALTIMESTAMP() -> 2018-09-19 20:57:43\`             |\r
| MAKEDATE(year, day-of-year)                       | 基于给定参数年份 year 和所在年中的天数序号 day-of-year 返回一个日期 | \`SELECT MAKEDATE(2017, 3); -> 2017-01-03\`                    |\r
| MAKETIME(hour, minute, second)                    | 组合时间，参数分别为小时、分钟、秒                           | \`SELECT MAKETIME(11, 35, 4); -> 11:35:04\`                    |\r
| MICROSECOND(date)                                 | 返回日期参数所对应的微秒数                                   | \`SELECT MICROSECOND("2017-06-20 09:34:00.000023"); -> 23\`    |\r
| MINUTE(t)                                         | 返回 t 中的分钟值                                            | \`SELECT MINUTE('1:2:3') -> 2\`                                |\r
| MONTHNAME(d)                                      | 返回日期当中的月份名称，如 November                          | \`SELECT MONTHNAME('2011-11-11 11:11:11') -> November\`        |\r
| MONTH(d)                                          | 返回日期d中的月份值，1 到 12                                 | \`SELECT MONTH('2011-11-11 11:11:11') ->11\`                   |\r
| NOW()                                             | 返回当前日期和时间                                           | \`SELECT NOW() -> 2018-09-19 20:57:43\`                        |\r
| PERIOD_ADD(period, number)                        | 为 年-月 组合日期添加一个时段                                | \`SELECT PERIOD_ADD(201703, 5);    -> 201708\`                 |\r
| PERIOD_DIFF(period1, period2)                     | 返回两个时段之间的月份差值                                   | \`SELECT PERIOD_DIFF(201710, 201703); -> 7\`                   |\r
| QUARTER(d)                                        | 返回日期d是第几季节，返回 1 到 4                             | \`SELECT QUARTER('2011-11-11 11:11:11') -> 4\`                 |\r
| SECOND(t)                                         | 返回 t 中的秒钟值                                            | \`SELECT SECOND('1:2:3') -> 3\`                                |\r
| SEC_TO_TIME(s)                                    | 将以秒为单位的时间 s 转换为时分秒的格式                      | \`SELECT SEC_TO_TIME(4320) -> 01:12:00\`                       |\r
| STR_TO_DATE(string, format_mask)                  | 将字符串转变为日期                                           | \`SELECT STR_TO_DATE("August 10 2017", "%M %d %Y"); -> 2017-08-10\` |\r
| SUBDATE(d,n)                                      | 日期 d 减去 n 天后的日期                                     | \`SELECT SUBDATE('2011-11-11 11:11:11', 1) ->2011-11-10 11:11:11 (默认是天)\` |\r
| SUBTIME(t,n)                                      | 时间 t 减去 n 秒的时间                                       | \`SELECT SUBTIME('2011-11-11 11:11:11', 5) ->2011-11-11 11:11:06 (秒)\` |\r
| SYSDATE()                                         | 返回当前日期和时间                                           | \`SELECT SYSDATE() -> 2018-09-19 20:57:43\`                    |\r
| TIME(expression)                                  | 提取传入表达式的时间部分                                     | \`SELECT TIME("19:30:10"); -> 19:30:10\`                       |\r
| TIME_FORMAT(t,f)                                  | 按表达式 f 的要求显示时间 t                                  | \`SELECT TIME_FORMAT('11:11:11','%r') 11:11:11 AM\`            |\r
| TIME_TO_SEC(t)                                    | 将时间 t 转换为秒                                            | \`SELECT TIME_TO_SEC('1:12:00') -> 4320\`                      |\r
| TIMEDIFF(time1, time2)                            | 计算时间差值                                                 | \`mysql> SELECT TIMEDIFF("13:10:11", "13:10:10"); -> 00:00:01 mysql> SELECT TIMEDIFF('2000:01:01 00:00:00',    ->                 '2000:01:01 00:00:00.000001');        -> '-00:00:00.000001' mysql> SELECT TIMEDIFF('2008-12-31 23:59:59.000001',    ->                 '2008-12-30 01:01:01.000002');        -> '46:58:57.999999'\` |\r
| TIMESTAMP(expression, interval)                   | 单个参数时，函数返回日期或日期时间表达式；有2个参数时，将参数加和 | \`mysql> SELECT TIMESTAMP("2017-07-23",  "13:10:11"); -> 2017-07-23 13:10:11 mysql> SELECT TIMESTAMP('2003-12-31');        -> '2003-12-31 00:00:00' mysql> SELECT TIMESTAMP('2003-12-31 12:00:00','12:00:00');        -> '2004-01-01 00:00:00'\` |\r
| TIMESTAMPDIFF(unit,datetime_expr1,datetime_expr2) | 计算时间差，返回 datetime_expr2 − datetime_expr1 的时间差    | \`mysql> SELECT TIMESTAMPDIFF(DAY,'2003-02-01','2003-05-01');   // 计算两个时间相隔多少天        -> 89 mysql> SELECT TIMESTAMPDIFF(MONTH,'2003-02-01','2003-05-01');   // 计算两个时间相隔多少月        -> 3 mysql> SELECT TIMESTAMPDIFF(YEAR,'2002-05-01','2001-01-01');    // 计算两个时间相隔多少年        -> -1 mysql> SELECT TIMESTAMPDIFF(MINUTE,'2003-02-01','2003-05-01 12:05:55');  // 计算两个时间相隔多少分钟        -> 128885\` |\r
| TO_DAYS(d)                                        | 计算日期 d 距离 0000 年 1 月 1 日的天数                      | \`SELECT TO_DAYS('0001-01-01 01:01:01') -> 366\`               |\r
| WEEK(d)                                           | 计算日期 d 是本年的第几个星期，范围是 0 到 53                | \`SELECT WEEK('2011-11-11 11:11:11') -> 45\`                   |\r
| WEEKDAY(d)                                        | 日期 d 是星期几，0 表示星期一，1 表示星期二                  | \`SELECT WEEKDAY("2017-06-15"); -> 3\`                         |\r
| WEEKOFYEAR(d)                                     | 计算日期 d 是本年的第几个星期，范围是 0 到 53                | \`SELECT WEEKOFYEAR('2011-11-11 11:11:11') -> 45\`             |\r
| YEAR(d)                                           | 返回年份                                                     | \`SELECT YEAR("2017-06-15"); -> 2017\`                         |\r
| YEARWEEK(date, mode)                              | 返回年份及第几周（0到53），mode 中 0 表示周天，1表示周一，以此类推 | \`SELECT YEARWEEK("2017-06-15"); -> 201724\`                   |\r
\r
## 高级函数\r
\r
| 函数名                                                       | 描述                                                         | 实例                                                         |\r
| ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |\r
| BIN(x)                                                       | 返回 x 的二进制编码，x 为十进制数                            | 15 的 2 进制编码:\`SELECT BIN(15); -- 1111\`                   |\r
| BINARY(s)                                                    | 将字符串 s 转换为二进制字符串                                | \`SELECT BINARY "RUNOOB"; -> RUNOOB\`                          |\r
| \`CASE expression    WHEN condition1 THEN result1    WHEN condition2 THEN result2   ...    WHEN conditionN THEN resultN    ELSE result END\` | CASE 表示函数开始，END 表示函数结束。如果 condition1 成立，则返回 result1, 如果 condition2 成立，则返回 result2，当全部不成立则返回 result，而当有一个成立之后，后面的就不执行了。 | \`SELECT CASE  　WHEN 1 > 0 　THEN '1 > 0' 　WHEN 2 > 0 　THEN '2 > 0' 　ELSE '3 > 0' 　END ->1 > 0\` |\r
| CAST(x AS type)                                              | 转换数据类型                                                 | 字符串日期转换为日期：\`SELECT CAST("2017-08-29" AS DATE); -> 2017-08-29\` |\r
| COALESCE(expr1, expr2, ...., expr_n)                         | 返回参数中的第一个非空表达式（从左向右）                     | \`SELECT COALESCE(NULL, NULL, NULL, 'runoob.com', NULL, 'google.com'); -> runoob.com\` |\r
| CONNECTION_ID()                                              | 返回唯一的连接 ID                                            | \`SELECT CONNECTION_ID(); -> 4292835\`                         |\r
| CONV(x,f1,f2)                                                | 返回 f1 进制数变成 f2 进制数                                 | \`SELECT CONV(15, 10, 2); -> 1111\`                            |\r
| CONVERT(s USING cs)                                          | 函数将字符串 s 的字符集变成 cs                               | \`SELECT CHARSET('ABC') ->utf-8     SELECT CHARSET(CONVERT('ABC' USING gbk)) ->gbk\` |\r
| CURRENT_USER()                                               | 返回当前用户                                                 | \`SELECT CURRENT_USER(); -> guest@%\`                          |\r
| DATABASE()                                                   | 返回当前数据库名                                             | \`SELECT DATABASE();    -> runoob\`                            |\r
| IF(expr,v1,v2)                                               | 如果表达式 expr 成立，返回结果 v1；否则，返回结果 v2。       | \`SELECT IF(1 > 0,'正确','错误')     ->正确\`                  |\r
| [IFNULL(v1,v2)](https://www.runoob.com/mysql/mysql-func-ifnull.html) | 如果 v1 的值不为 NULL，则返回 v1，否则返回 v2。              | \`SELECT IFNULL(null,'Hello Word') ->Hello Word\`              |\r
| ISNULL(expression)                                           | 判断表达式是否为 NULL                                        | \`SELECT ISNULL(NULL); ->1\`                                   |\r
| LAST_INSERT_ID()                                             | 返回最近生成的 AUTO_INCREMENT 值                             | \`SELECT LAST_INSERT_ID(); ->6\`                               |\r
| NULLIF(expr1, expr2)                                         | 比较两个字符串，如果字符串 expr1 与 expr2 相等 返回 NULL，否则返回 expr1 | \`SELECT NULLIF(25, 25); ->\`                                  |\r
| SESSION_USER()                                               | 返回当前用户                                                 | \`SELECT SESSION_USER(); -> guest@%\`                          |\r
| SYSTEM_USER()                                                | 返回当前用户                                                 | \`SELECT SYSTEM_USER(); -> guest@%\`                           |\r
| USER()                                                       | 返回当前用户                                                 | \`SELECT USER(); -> guest@%\`                                  |\r
| VERSION()                                                    | 返回数据库的版本号                                           | \`SELECT VERSION() -> 5.6.34\`                                 |\r
\r
**8.0新增的**\r
\r
| 函数            | 描述                                   | 实例                                                         |\r
| --------------- | -------------------------------------- | ------------------------------------------------------------ |\r
| JSON_OBJECT()   | 将键值对转换为 JSON 对象               | \`SELECT JSON_OBJECT('key1', 'value1', 'key2', 'value2')\`     |\r
| JSON_ARRAY()    | 将值转换为 JSON 数组                   | \`SELECT JSON_ARRAY(1, 2, 'three')\`                           |\r
| JSON_EXTRACT()  | 从 JSON 字符串中提取指定的值           | \`SELECT JSON_EXTRACT('{"name": "John", "age": 30}', '$.name')\` |\r
| JSON_CONTAINS() | 检查一个 JSON 字符串是否包含指定的值   | \`SELECT JSON_CONTAINS('{"name": "John", "age": 30}', 'John', '$.name')\` |\r
| ROW_NUMBER()    | 为查询结果中的每一行分配一个唯一的数字 | \`SELECT ROW_NUMBER() OVER(ORDER BY id) AS row_number, name FROM users\` |\r
| RANK()          | 为查询结果中的每一行分配一个排名       | \`SELECT RANK() OVER(ORDER BY score DESC) AS rank, name, score FROM students\` |\r
\r
`;export{E as default};

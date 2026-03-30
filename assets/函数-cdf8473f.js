const t=`\`\`\`mysql\r
指一段可以直接被另一段程序调用的程序或代码。\r
\r
\r
\r
1.字符串函数\r
函数					功能\r
concat(s1,s2,....sn)		字符串拼接，将s1,s2,...sn拼接成一个字符串\r
lower(str)				将字符串str全部转为小写\r
upper(str)				将字符串str全部转为大写\r
lpad(str,n,pad)			左填充，用字符串pad对str的左边进行填充，达到n个字符串长度\r
rpad(str,n,pad)			右填充，用字符串pad对str的右边进行填充，达到n个字符串长度\r
trim(str)				去掉字符串头部和尾部的空格\r
substring(str,start,len)	返回从字符串str从start位置起的len个长度的字符串\r
\r
格式：select 函数（参数）;\r
\r
\r
\r
2.数值函数\r
函数					功能\r
ceil(x)				向上取整\r
floor(x)				向下取整\r
mod(x,y)				返回x/y的模\r
rand()				返回0~1内的随机数\r
round(x,y)				求参数x的四舍五入的值，保留y位小数\r
\r
\r
3.日期函数\r
函数							功能\r
curdate()						返回当前日期\r
curtime()						返回当前时间\r
now()						返回当前日期和时间\r
tear(date)						获取指定date的年份\r
month(date)					获取指定date的月份\r
day(date)						获取指定date的日期\r
date_add(date,intervalexpr type)	返回一个日期/时间值加上一个时间间隔expr后的时间值\r
datediff(date1,date2)				返回起始时间date1和结束时间date2之间的天数\r
\r
\r
4.流程控制函数\r
函数												功能\r
if(value , t,f)										如果value为true，则返回t否则返回f\r
ifnull(value1,value2)									如果value1不为空，返回value1，否则返回value2\r
case when [val1] then [res1]....else[default]end				如果value1为true则返回res1,.....否则返回default默认值\r
case [expr]when[val1] then [res1].....else[default] end			如果expr的值等于val1，返回res1s...否则返回default默认值\r
\r
\r
\`\`\`\r
\r
`;export{t as default};

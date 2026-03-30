const r=`# 一、简介\r
\r
​	基于内存的key-value结构数据库\r
\r
​	启动服务端：在配置文件中输入\r
\r
\`\`\`\r
redis-server.exe redis.windows.conf\r
\`\`\`\r
\r
​	连接客户端，exit退出客户端，-h 连接的地址，-p 端口号，-a密码\r
\r
\`\`\`\r
redis-cli.exe\r
\`\`\`\r
\r
在 redis.windows.conf 中可以通过 requirepass 配置密码（不要把真实密码写进笔记仓库）。\r
\r
# 二、入门\r
\r
## 1.常见的数据类型\r
\r
### String（字符串）\r
\r
string是redis最基本的类型，你可以理解成与Memcached一模一样的类型，一个key对应一个value。\r
\r
string类型是二进制安全的。意思是redis的string可以包含任何数据。比如jpg图片或者序列化的对象 。\r
\r
string类型是Redis最基本的数据类型，一个键最大能存储512MB。\r
\r
实例\r
\r
\`\`\`\r
redis 127.0.0.1:6379> SET name "redis.net.cn"\r
OK\r
redis 127.0.0.1:6379> GET name\r
"redis.net.cn"\r
\`\`\`\r
\r
在以上实例中我们使用了 Redis 的 **SET** 和 **GET** 命令。键为 name，对应的值为redis.net.cn。\r
\r
**注意：**一个键最大能存储512MB。\r
\r
------\r
\r
### Hash（哈希）\r
\r
Redis hash 是一个键值对集合。\r
\r
Redis hash是一个string类型的field和value的映射表，hash特别适合用于存储对象。\r
\r
实例\r
\r
\`\`\`\r
redis 127.0.0.1:6379> HMSET user:1 username redis.net.cn password redis.net.cn points 200\r
OK\r
redis 127.0.0.1:6379> HGETALL user:1\r
1) "username"\r
2) "redis.net.cn"\r
3) "password"\r
4) "redis.net.cn"\r
5) "points"\r
6) "200"\r
redis 127.0.0.1:6379>\r
\`\`\`\r
\r
以上实例中 hash 数据类型存储了包含用户脚本信息的用户对象。 实例中我们使用了 Redis **HMSET, HEGTALL** 命令，**user:1** 为键值。\r
\r
每个 hash 可以存储 232 - 1 键值对（40多亿）。\r
\r
### List（列表）\r
\r
Redis 列表是简单的字符串列表，按照插入顺序排序。你可以添加一个元素导列表的头部（左边）或者尾部（右边）。\r
\r
实例\r
\r
\`\`\`\r
redis 127.0.0.1:6379> lpush redis.net.cn redis(integer) 1redis 127.0.0.1:6379> lpush redis.net.cn mongodb(integer) 2redis 127.0.0.1:6379> lpush redis.net.cn rabitmq(integer) 3redis 127.0.0.1:6379> lrange redis.net.cn 0 101) "rabitmq"2) "mongodb"3) "redis"redis 127.0.0.1:6379>\r
\`\`\`\r
\r
列表最多可存储 232 - 1 元素 (4294967295, 每个列表可存储40多亿)。\r
\r
### Set（集合）\r
\r
Redis的Set是string类型的无序集合。\r
\r
集合是通过哈希表实现的，所以添加，删除，查找的复杂度都是O(1)。\r
\r
sadd 命令\r
\r
添加一个string元素到,key对应的set集合中，成功返回1,如果元素以及在集合中返回0,key对应的set不存在返回错误。\r
\r
\`\`\`\r
sadd key member\r
\`\`\`\r
\r
实例\r
\r
\`\`\`\r
redis 127.0.0.1:6379> sadd redis.net.cn redis(integer) 1redis 127.0.0.1:6379> sadd redis.net.cn mongodb(integer) 1redis 127.0.0.1:6379> sadd redis.net.cn rabitmq(integer) 1redis 127.0.0.1:6379> sadd redis.net.cn rabitmq(integer) 0redis 127.0.0.1:6379> smembers redis.net.cn 1) "rabitmq"2) "mongodb"3) "redis"\r
\`\`\`\r
\r
**注意：**以上实例中 rabitmq 添加了两次，但根据集合内元素的唯一性，第二次插入的元素将被忽略。\r
\r
集合中最大的成员数为 232 - 1 (4294967295, 每个集合可存储40多亿个成员)。\r
\r
------\r
\r
### zset(sorted set：有序集合)\r
\r
Redis zset 和 set 一样也是string类型元素的集合,且不允许重复的成员。\r
\r
不同的是每个元素都会关联一个double类型的分数。redis正是通过分数来为集合中的成员进行从小到大的排序。\r
\r
zset的成员是唯一的,但分数(score)却可以重复。\r
\r
zadd 命令\r
\r
添加元素到集合，元素在集合中存在则更新对应score\r
\r
\`\`\`\r
zadd key score member \r
\`\`\`\r
\r
实例\r
\r
\`\`\`\r
redis 127.0.0.1:6379> zadd redis.net.cn 0 redis(integer) 1redis 127.0.0.1:6379> zadd redis.net.cn 0 mongodb(integer) 1redis 127.0.0.1:6379> zadd redis.net.cn 0 rabitmq(integer) 1redis 127.0.0.1:6379> zadd redis.net.cn 0 rabitmq(integer) 0redis 127.0.0.1:6379> ZRANGEBYSCORE redis.net.cn 0 1000 1) "redis"2) "mongodb"3) "rabitmq"\r
\`\`\`\r
\r
------\r
\r
## 2.常用命令\r
\r
Redis 命令用于在 redis 服务上执行操作。\r
\r
要在 redis 服务上执行命令需要一个 redis 客户端。Redis 客户端在我们之前下载的的 redis 的安装包中。\r
\r
**语法**\r
\r
Redis 客户端的基本语法为：\r
\r
\`\`\`\r
$ redis-cli\r
\`\`\`\r
\r
**实例**\r
\r
以下实例讲解了如何启动 redis 客户端：\r
\r
启动 redis 客户端，打开终端并输入命令 **redis-cli**。该命令会连接本地的 redis 服务。\r
\r
\`\`\`\r
$redis-cli\r
redis 127.0.0.1:6379>\r
redis 127.0.0.1:6379> PING\r
\r
PONG\r
\`\`\`\r
\r
在以上实例中我们连接到本地的 redis 服务并执行 **PING** 命令，该命令用于检测 redis 服务是否启动。\r
\r
------\r
\r
### 在远程服务上执行命令\r
\r
如果需要在远程 redis 服务上执行命令，同样我们使用的也是 **redis-cli** 命令。\r
\r
语法\r
\r
\`\`\`\r
$ redis-cli -h host -p port -a password\r
\`\`\`\r
\r
**实例**\r
\r
以下实例演示了如何连接到主机为 127.0.0.1，端口为 6379 ，密码为 mypass 的 redis 服务上。\r
\r
\`\`\`\r
$redis-cli -h 127.0.0.1 -p 6379 -a "mypass"\r
redis 127.0.0.1:6379>\r
redis 127.0.0.1:6379> PING\r
\r
PONG\r
\`\`\`\r
\r
------\r
\r
## Redis 键(key)\r
\r
Redis 键命令用于管理 redis 的键。\r
\r
**语法**\r
\r
Redis 键命令的基本语法如下：\r
\r
\`\`\`\r
redis 127.0.0.1:6379> COMMAND KEY_NAME\r
\`\`\`\r
\r
**实例**\r
\r
\`\`\`\r
redis 127.0.0.1:6379> SET w3ckey redis\r
OK\r
redis 127.0.0.1:6379> DEL w3ckey\r
(integer) 1\r
\`\`\`\r
\r
在以上实例中 **DEL** 是一个命令， **w3ckey** 是一个键。 如果键被删除成功，命令执行后输出 **(integer) 1**，否则将输出 **(integer) 0**\r
\r
------\r
\r
Redis keys 命令\r
\r
下表给出了与 Redis 键相关的基本命令：\r
\r
| 序号 | 命令及描述                                                   |\r
| :--- | :----------------------------------------------------------- |\r
| 1    | [DEL key](https://www.redis.net.cn/order/3528.html) 该命令用于在 key 存在是删除 key。 |\r
| 2    | [DUMP key](https://www.redis.net.cn/order/3529.html) 序列化给定 key ，并返回被序列化的值。 |\r
| 3    | [EXISTS key](https://www.redis.net.cn/order/3530.html) 检查给定 key 是否存在。 |\r
| 4    | [EXPIRE key](https://www.redis.net.cn/order/3531.html) seconds 为给定 key 设置过期时间。 |\r
| 5    | [EXPIREAT key timestamp](https://www.redis.net.cn/order/3532.html) EXPIREAT 的作用和 EXPIRE 类似，都用于为 key 设置过期时间。 不同在于 EXPIREAT 命令接受的时间参数是 UNIX 时间戳(unix timestamp)。 |\r
| 6    | [PEXPIRE key milliseconds](https://www.redis.net.cn/order/3533.html) 设置 key 的过期时间亿以毫秒计。 |\r
| 7    | [PEXPIREAT key milliseconds-timestamp](https://www.redis.net.cn/order/3534.html) 设置 key 过期时间的时间戳(unix timestamp) 以毫秒计 |\r
| 8    | [KEYS pattern](https://www.redis.net.cn/order/3535.html) 查找所有符合给定模式( pattern)的 key 。 |\r
| 9    | [MOVE key db](https://www.redis.net.cn/order/3536.html) 将当前数据库的 key 移动到给定的数据库 db 当中。 |\r
| 10   | [PERSIST key](https://www.redis.net.cn/order/3537.html) 移除 key 的过期时间，key 将持久保持。 |\r
| 11   | [PTTL key](https://www.redis.net.cn/order/3538.html) 以毫秒为单位返回 key 的剩余的过期时间。 |\r
| 12   | [TTL key](https://www.redis.net.cn/order/3539.html) 以秒为单位，返回给定 key 的剩余生存时间(TTL, time to live)。 |\r
| 13   | [RANDOMKEY](https://www.redis.net.cn/order/3540.html) 从当前数据库中随机返回一个 key 。 |\r
| 14   | [RENAME key newkey](https://www.redis.net.cn/order/3541.html) 修改 key 的名称 |\r
| 15   | [RENAMENX key newkey](https://www.redis.net.cn/order/3542.html) 仅当 newkey 不存在时，将 key 改名为 newkey 。 |\r
| 16   | [TYPE key](https://www.redis.net.cn/order/3543.html) 返回 key 所储存的值的类型。 |\r
\r
**Pattern有3个通配符** *, ? ,[]\r
\r
*: 通配任意多个字符\r
\r
?: 通配单个字符\r
\r
[]: 通配括号内的某1个字符\r
\r
## Redis 字符串(String)\r
\r
Redis 字符串数据类型的相关命令用于管理 redis 字符串值，基本语法如下：\r
\r
### 语法\r
\r
\`\`\`\r
redis 127.0.0.1:6379> COMMAND KEY_NAME\r
\`\`\`\r
\r
### 实例\r
\r
\`\`\`\r
redis 127.0.0.1:6379> SET w3ckey redis \r
OK \r
redis 127.0.0.1:6379> GET w3ckey \r
"redis"\r
\`\`\`\r
\r
在以上实例中我们使用了 **SET** 和 **GET** 命令，键为 w3ckey。\r
\r
------\r
\r
### Redis 字符串命令\r
\r
下表列出了常用的 redis 字符串命令：\r
\r
| 序号 | 命令及描述                                                   |\r
| :--- | :----------------------------------------------------------- |\r
| 1    | [SET key value](https://www.redis.net.cn/order/3544.html) 设置指定 key 的值 |\r
| 2    | [GET key](https://www.redis.net.cn/order/3545.html) 获取指定 key 的值。 |\r
| 3    | [GETRANGE key start end](https://www.redis.net.cn/order/3546.html) 返回 key 中字符串值的子字符 |\r
| 4    | [GETSET key value](https://www.redis.net.cn/order/3547.html) 将给定 key 的值设为 value ，并返回 key 的旧值(old value)。 |\r
| 5    | [GETBIT key offset](https://www.redis.net.cn/order/3548.html) 对 key 所储存的字符串值，获取指定偏移量上的位(bit)。 |\r
| 6    | [MGET key1 [key2..\\]](https://www.redis.net.cn/order/3549.html) 获取所有(一个或多个)给定 key 的值。 |\r
| 7    | [SETBIT key offset value](https://www.redis.net.cn/order/3550.html) 对 key 所储存的字符串值，设置或清除指定偏移量上的位(bit)。 |\r
| 8    | [SETEX key seconds value](https://www.redis.net.cn/order/3551.html) 将值 value 关联到 key ，并将 key 的过期时间设为 seconds (以秒为单位)。 |\r
| 9    | [SETNX key value](https://www.redis.net.cn/order/3552.html) 只有在 key 不存在时设置 key 的值。 |\r
| 10   | [SETRANGE key offset value](https://www.redis.net.cn/order/3553.html) 用 value 参数覆写给定 key 所储存的字符串值，从偏移量 offset 开始。 |\r
| 11   | [STRLEN key](https://www.redis.net.cn/order/3554.html) 返回 key 所储存的字符串值的长度。 |\r
| 12   | [MSET key value [key value ...\\]](https://www.redis.net.cn/order/3555.html) 同时设置一个或多个 key-value 对。 |\r
| 13   | [MSETNX key value [key value ...\\]](https://www.redis.net.cn/order/3556.html) 同时设置一个或多个 key-value 对，当且仅当所有给定 key 都不存在。 |\r
| 14   | [PSETEX key milliseconds value](https://www.redis.net.cn/order/3557.html) 这个命令和 SETEX 命令相似，但它以毫秒为单位设置 key 的生存时间，而不是像 SETEX 命令那样，以秒为单位。 |\r
| 15   | [INCR key](https://www.redis.net.cn/order/3558.html) 将 key 中储存的数字值增一。 |\r
| 16   | [INCRBY key increment](https://www.redis.net.cn/order/3559.html) 将 key 所储存的值加上给定的增量值（increment） 。 |\r
| 17   | [INCRBYFLOAT key increment](https://www.redis.net.cn/order/3560.html) 将 key 所储存的值加上给定的浮点增量值（increment） 。 |\r
| 18   | [DECR key](https://www.redis.net.cn/order/3561.html) 将 key 中储存的数字值减一。 |\r
| 19   | [DECRBY key decrement](https://www.redis.net.cn/order/3562.html) key 所储存的值减去给定的减量值（decrement） 。 |\r
| 20   | [APPEND key value](https://www.redis.net.cn/order/3563.html) 如果 key 已经存在并且是一个字符串， APPEND 命令将 value 追加到 key 原来的值的末尾。 |\r
\r
## Redis 哈希(Hash)\r
\r
Redis hash 是一个string类型的field和value的映射表，hash特别适合用于存储对象。\r
\r
Redis 中每个 hash 可以存储 232 - 1 键值对（40多亿）。\r
\r
### 实例\r
\r
\`\`\`\r
redis 127.0.0.1:6379> HMSET w3ckey name "redis tutorial" description "redis basic commands for caching" likes 20 visitors 23000\r
OK\r
redis 127.0.0.1:6379> HGETALL w3ckey\r
\r
1) "name"\r
2) "redis tutorial"\r
3) "description"\r
4) "redis basic commands for caching"\r
5) "likes"\r
6) "20"\r
7) "visitors"\r
8) "23000"\r
\`\`\`\r
\r
在以上实例中，我们设置了 redis 的一些描述信息(name, description, likes, visitors) 到哈希表的 w3ckey 中。\r
\r
------\r
\r
### Redis hash 命令\r
\r
下表列出了 redis hash 基本的相关命令：\r
\r
| 序号 | 命令及描述                                                   |\r
| :--- | :----------------------------------------------------------- |\r
| 1    | [HDEL key field2 [field2\\]](https://www.redis.net.cn/order/3564.html) 删除一个或多个哈希表字段 |\r
| 2    | [HEXISTS key field](https://www.redis.net.cn/order/3565.html) 查看哈希表 key 中，指定的字段是否存在。 |\r
| 3    | [HGET key field](https://www.redis.net.cn/order/3566.html) 获取存储在哈希表中指定字段的值/td> |\r
| 4    | [HGETALL key](https://www.redis.net.cn/order/3567.html) 获取在哈希表中指定 key 的所有字段和值 |\r
| 5    | [HINCRBY key field increment](https://www.redis.net.cn/order/3568.html) 为哈希表 key 中的指定字段的整数值加上增量 increment 。 |\r
| 6    | [HINCRBYFLOAT key field increment](https://www.redis.net.cn/order/3569.html) 为哈希表 key 中的指定字段的浮点数值加上增量 increment 。 |\r
| 7    | [HKEYS key](https://www.redis.net.cn/order/3570.html) 获取所有哈希表中的字段 |\r
| 8    | [HLEN key](https://www.redis.net.cn/order/3571.html) 获取哈希表中字段的数量 |\r
| 9    | [HMGET key field1 [field2\\]](https://www.redis.net.cn/order/3572.html) 获取所有给定字段的值 |\r
| 10   | [HMSET key field1 value1 [field2 value2 \\]](https://www.redis.net.cn/order/3573.html) 同时将多个 field-value (域-值)对设置到哈希表 key 中。 |\r
| 11   | [HSET key field value](https://www.redis.net.cn/order/3574.html) 将哈希表 key 中的字段 field 的值设为 value 。 |\r
| 12   | [HSETNX key field value](https://www.redis.net.cn/order/3575.html) 只有在字段 field 不存在时，设置哈希表字段的值。 |\r
| 13   | [HVALS key](https://www.redis.net.cn/order/3576.html) 获取哈希表中所有值 |\r
| 14   | HSCAN key cursor [MATCH pattern] [COUNT count] 迭代哈希表中的键值对。 |\r
\r
## Redis 列表(List)\r
\r
\r
\r
Redis列表是简单的字符串列表，按照插入顺序排序。你可以添加一个元素导列表的头部（左边）或者尾部（右边）\r
\r
一个列表最多可以包含 232 - 1 个元素 (4294967295, 每个列表超过40亿个元素)。\r
\r
### 实例\r
\r
\`\`\`\r
redis 127.0.0.1:6379> LPUSH w3ckey redis\r
(integer) 1\r
redis 127.0.0.1:6379> LPUSH w3ckey mongodb\r
(integer) 2\r
redis 127.0.0.1:6379> LPUSH w3ckey mysql\r
(integer) 3\r
redis 127.0.0.1:6379> LRANGE w3ckey 0 10\r
\r
1) "mysql"\r
2) "mongodb"\r
3) "redis"\r
\`\`\`\r
\r
在以上实例中我们使用了 **LPUSH** 将三个值插入了名为 w3ckey 的列表当中。\r
\r
### Redis 列表命令\r
\r
下表列出了列表相关的基本命令：\r
\r
| 序号 | 命令及描述                                                   |\r
| :--- | :----------------------------------------------------------- |\r
| 1    | [BLPOP key1 [key2 \\] timeout](https://www.redis.net.cn/order/3577.html) 移出并获取列表的第一个元素， 如果列表没有元素会阻塞列表直到等待超时或发现可弹出元素为止。 |\r
| 2    | [BRPOP key1 [key2 \\] timeout](https://www.redis.net.cn/order/3578.html) 移出并获取列表的最后一个元素， 如果列表没有元素会阻塞列表直到等待超时或发现可弹出元素为止。 |\r
| 3    | [BRPOPLPUSH source destination timeout](https://www.redis.net.cn/order/3579.html) 从列表中弹出一个值，将弹出的元素插入到另外一个列表中并返回它； 如果列表没有元素会阻塞列表直到等待超时或发现可弹出元素为止。 |\r
| 4    | [LINDEX key index](https://www.redis.net.cn/order/3580.html) 通过索引获取列表中的元素 |\r
| 5    | [LINSERT key BEFORE\\|AFTER pivot value](https://www.redis.net.cn/order/3581.html) 在列表的元素前或者后插入元素 |\r
| 6    | [LLEN key](https://www.redis.net.cn/order/3582.html) 获取列表长度 |\r
| 7    | [LPOP key](https://www.redis.net.cn/order/3583.html) 移出并获取列表的第一个元素 |\r
| 8    | [LPUSH key value1 [value2\\]](https://www.redis.net.cn/order/3584.html) 将一个或多个值插入到列表头部 |\r
| 9    | [LPUSHX key value](https://www.redis.net.cn/order/3585.html) 将一个或多个值插入到已存在的列表头部 |\r
| 10   | [LRANGE key start stop](https://www.redis.net.cn/order/3586.html) 获取列表指定范围内的元素 |\r
| 11   | [LREM key count value](https://www.redis.net.cn/order/3587.html) 移除列表元素 |\r
| 12   | [LSET key index value](https://www.redis.net.cn/order/3588.html) 通过索引设置列表元素的值 |\r
| 13   | [LTRIM key start stop](https://www.redis.net.cn/order/3589.html) 对一个列表进行修剪(trim)，就是说，让列表只保留指定区间内的元素，不在指定区间之内的元素都将被删除。 |\r
| 14   | [RPOP key](https://www.redis.net.cn/order/3590.html) 移除并获取列表最后一个元素 |\r
| 15   | [RPOPLPUSH source destination](https://www.redis.net.cn/order/3591.html) 移除列表的最后一个元素，并将该元素添加到另一个列表并返回 |\r
| 16   | [RPUSH key value1 [value2\\]](https://www.redis.net.cn/order/3592.html) 在列表中添加一个或多个值 |\r
| 17   | [RPUSHX key value](https://www.redis.net.cn/order/3593.html) 为已存在的列表添加值 |\r
\r
## Redis 集合(Set)\r
\r
Redis的Set是string类型的无序集合。集合成员是唯一的，这就意味着集合中不能出现重复的数据。\r
\r
Redis 中 集合是通过哈希表实现的，所以添加，删除，查找的复杂度都是O(1)。\r
\r
集合中最大的成员数为 232 - 1 (4294967295, 每个集合可存储40多亿个成员)。\r
\r
### 实例\r
\r
\`\`\`\r
redis 127.0.0.1:6379> SADD w3ckey redis\r
(integer) 1\r
redis 127.0.0.1:6379> SADD w3ckey mongodb\r
(integer) 1\r
redis 127.0.0.1:6379> SADD w3ckey mysql\r
(integer) 1\r
redis 127.0.0.1:6379> SADD w3ckey mysql\r
(integer) 0\r
redis 127.0.0.1:6379> SMEMBERS w3ckey\r
\r
1) "mysql"\r
2) "mongodb"\r
3) "redis"\r
\`\`\`\r
\r
在以上实例中我们通过 **SADD** 命令向名为 w3ckey 的集合插入的三个元素。\r
\r
------\r
\r
### Redis 集合命令\r
\r
下表列出了 Redis 集合基本命令：\r
\r
| 序号 | 命令及描述                                                   |\r
| :--- | :----------------------------------------------------------- |\r
| 1    | [SADD key member1 [member2\\]](https://www.redis.net.cn/order/3594.html) 向集合添加一个或多个成员 |\r
| 2    | [SCARD key](https://www.redis.net.cn/order/3595.html) 获取集合的成员数 |\r
| 3    | [SDIFF key1 [key2\\]](https://www.redis.net.cn/order/3596.html) 返回给定所有集合的差集 |\r
| 4    | [SDIFFSTORE destination key1 [key2\\]](https://www.redis.net.cn/order/3597.html) 返回给定所有集合的差集并存储在 destination 中 |\r
| 5    | [SINTER key1 [key2\\]](https://www.redis.net.cn/order/3598.html) 返回给定所有集合的交集 |\r
| 6    | [SINTERSTORE destination key1 [key2\\]](https://www.redis.net.cn/order/3599.html) 返回给定所有集合的交集并存储在 destination 中 |\r
| 7    | [SISMEMBER key member](https://www.redis.net.cn/order/3600.html) 判断 member 元素是否是集合 key 的成员 |\r
| 8    | [SMEMBERS key](https://www.redis.net.cn/order/3601.html) 返回集合中的所有成员 |\r
| 9    | [SMOVE source destination member](https://www.redis.net.cn/order/3602.html) 将 member 元素从 source 集合移动到 destination 集合 |\r
| 10   | [SPOP key](https://www.redis.net.cn/order/3603.html) 移除并返回集合中的一个随机元素 |\r
| 11   | [SRANDMEMBER key [count\\]](https://www.redis.net.cn/order/3604.html) 返回集合中一个或多个随机数 |\r
| 12   | [SREM key member1 [member2\\]](https://www.redis.net.cn/order/3605.html) 移除集合中一个或多个成员 |\r
| 13   | [SUNION key1 [key2\\]](https://www.redis.net.cn/order/3606.html) 返回所有给定集合的并集 |\r
| 14   | [SUNIONSTORE destination key1 [key2\\]](https://www.redis.net.cn/order/3607.html) 所有给定集合的并集存储在 destination 集合中 |\r
| 15   | [SSCAN key cursor [MATCH pattern\\] [COUNT count]](https://www.redis.net.cn/order/3608.html) 迭代集合中的元素 |\r
\r
## Redis 有序集合(sorted set)\r
\r
Redis 有序集合和集合一样也是string类型元素的集合,且不允许重复的成员。\r
\r
不同的是每个元素都会关联一个double类型的分数。redis正是通过分数来为集合中的成员进行从小到大的排序。\r
\r
有序集合的成员是唯一的,但分数(score)却可以重复。\r
\r
集合是通过哈希表实现的，所以添加，删除，查找的复杂度都是O(1)。 集合中最大的成员数为 232 - 1 (4294967295, 每个集合可存储40多亿个成员)。\r
\r
### 实例\r
\r
\`\`\`\r
redis 127.0.0.1:6379> ZADD w3ckey 1 redis\r
(integer) 1\r
redis 127.0.0.1:6379> ZADD w3ckey 2 mongodb\r
(integer) 1\r
redis 127.0.0.1:6379> ZADD w3ckey 3 mysql\r
(integer) 1\r
redis 127.0.0.1:6379> ZADD w3ckey 3 mysql\r
(integer) 0\r
redis 127.0.0.1:6379> ZADD w3ckey 4 mysql\r
(integer) 0\r
redis 127.0.0.1:6379> ZRANGE w3ckey 0 10 WITHSCORES\r
\r
1) "redis"\r
2) "1"\r
3) "mongodb"\r
4) "2"\r
5) "mysql"\r
6) "4"\r
\`\`\`\r
\r
在以上实例中我们通过命令 **ZADD** 向 redis 的有序集合中添加了三个值并关联上分数。\r
\r
------\r
\r
### Redis 有序集合命令\r
\r
下表列出了 redis 有序集合的基本命令:\r
\r
| 序号 | 命令及描述                                                   |\r
| :--- | :----------------------------------------------------------- |\r
| 1    | [ZADD key score1 member1 [score2 member2\\]](https://www.redis.net.cn/order/3609.html) 向有序集合添加一个或多个成员，或者更新已存在成员的分数 |\r
| 2    | [ZCARD key](https://www.redis.net.cn/order/3610.html) 获取有序集合的成员数 |\r
| 3    | [ZCOUNT key min max](https://www.redis.net.cn/order/3611.html) 计算在有序集合中指定区间分数的成员数 |\r
| 4    | [ZINCRBY key increment member](https://www.redis.net.cn/order/3612.html) 有序集合中对指定成员的分数加上增量 increment |\r
| 5    | [ZINTERSTORE destination numkeys key [key ...\\]](https://www.redis.net.cn/order/3613.html) 计算给定的一个或多个有序集的交集并将结果集存储在新的有序集合 key 中 |\r
| 6    | [ZLEXCOUNT key min max](https://www.redis.net.cn/order/3614.html) 在有序集合中计算指定字典区间内成员数量 |\r
| 7    | [ZRANGE key start stop [WITHSCORES\\]](https://www.redis.net.cn/order/3615.html) 通过索引区间返回有序集合成指定区间内的成员 |\r
| 8    | [ZRANGEBYLEX key min max [LIMIT offset count\\]](https://www.redis.net.cn/order/3616.html) 通过字典区间返回有序集合的成员 |\r
| 9    | [ZRANGEBYSCORE key min max [WITHSCORES\\] [LIMIT]](https://www.redis.net.cn/order/3617.html) 通过分数返回有序集合指定区间内的成员 |\r
| 10   | [ZRANK key member](https://www.redis.net.cn/order/3618.html) 返回有序集合中指定成员的索引 |\r
| 11   | [ZREM key member [member ...\\]](https://www.redis.net.cn/order/3619.html) 移除有序集合中的一个或多个成员 |\r
| 12   | [ZREMRANGEBYLEX key min max](https://www.redis.net.cn/order/3620.html) 移除有序集合中给定的字典区间的所有成员 |\r
| 13   | [ZREMRANGEBYRANK key start stop](https://www.redis.net.cn/order/3621.html) 移除有序集合中给定的排名区间的所有成员 |\r
| 14   | [ZREMRANGEBYSCORE key min max](https://www.redis.net.cn/order/3622.html) 移除有序集合中给定的分数区间的所有成员 |\r
| 15   | [ZREVRANGE key start stop [WITHSCORES\\]](https://www.redis.net.cn/order/3623.html) 返回有序集中指定区间内的成员，通过索引，分数从高到底 |\r
| 16   | [ZREVRANGEBYSCORE key max min [WITHSCORES\\]](https://www.redis.net.cn/order/3624.html) 返回有序集中指定分数区间内的成员，分数从高到低排序 |\r
| 17   | [ZREVRANK key member](https://www.redis.net.cn/order/3625.html) 返回有序集合中指定成员的排名，有序集成员按分数值递减(从大到小)排序 |\r
| 18   | [ZSCORE key member](https://www.redis.net.cn/order/3626.html) 返回有序集中，成员的分数值 |\r
| 19   | [ZUNIONSTORE destination numkeys key [key ...\\]](https://www.redis.net.cn/order/3627.html) 计算给定的一个或多个有序集的并集，并存储在新的 key 中 |\r
| 20   | [ZSCAN key cursor [MATCH pattern\\] [COUNT count]](https://www.redis.net.cn/order/3628.html) 迭代有序集合中的元素（包括元素成员和元素分值） |\r
\r
# 三、利用Java spring data redis操作redis\r
\r
## 1.导入\r
\r
​	操作步骤：\r
\r
​		1.导入Spriing data redis的maven的坐标\r
\r
\`\`\`xml\r
<dependency>\r
    <groupId>org.springframework.boot</groupId>\r
    <artifactId>spring-boot-starter-data-redis</artifactId>\r
</dependency>\r
\`\`\`\r
\r
​		2.配置redis数据源\r
\r
\`\`\`yml\r
redis:\r
  host: localhost\r
  port: 6379\r
  password: 123456\r
  database: 0\r
\`\`\`\r
\r
​		3.编写配置类，创建Redis Template对象\r
\r
\`\`\`java\r
package com.sky.config;\r
\r
import lombok.extern.slf4j.Slf4j;\r
import org.springframework.context.annotation.Configuration;\r
import org.springframework.data.redis.RedisConnectionFailureException;\r
import org.springframework.data.redis.connection.RedisConnectionFactory;\r
import org.springframework.data.redis.core.RedisTemplate;\r
import org.springframework.data.redis.serializer.StringRedisSerializer;\r
\r
@Configuration\r
@Slf4j\r
public class RedisConfiguration {\r
    public RedisTemplate redisTemplate(RedisConnectionFactory redisConnectionFactory){\r
        log.info("开始创建RedisTemplate对象...");\r
        RedisTemplate redisTemplate = new RedisTemplate();\r
        //设置Redis连接工厂对象\r
        redisTemplate.setConnectionFactory(redisConnectionFactory);\r
        //设置redis key的序列化方式\r
        redisTemplate.setKeySerializer(new StringRedisSerializer());\r
        return redisTemplate;\r
    }\r
\r
}\r
\`\`\`\r
\r
​		通过RedisTemplate对象操作Redis**\r
\r
在test下新建测试类\r
\r
\`\`\`java\r
package com.sky.test;\r
\r
import org.junit.jupiter.api.Test;\r
import org.springframework.beans.factory.annotation.Autowired;\r
import org.springframework.boot.test.context.SpringBootTest;\r
import org.springframework.data.redis.core.*;\r
\r
@SpringBootTest\r
public class SpringDataRedisTest {\r
    @Autowired\r
    private RedisTemplate redisTemplate;\r
\r
    @Test\r
    public void testRedisTemplate(){\r
        System.out.println(redisTemplate);\r
        //string数据操作\r
        ValueOperations valueOperations = redisTemplate.opsForValue();\r
        //hash类型的数据操作\r
        HashOperations hashOperations = redisTemplate.opsForHash();\r
        //list类型的数据操作\r
        ListOperations listOperations = redisTemplate.opsForList();\r
        //set类型数据操作\r
        SetOperations setOperations = redisTemplate.opsForSet();\r
        //zset类型数据操作\r
        ZSetOperations zSetOperations = redisTemplate.opsForZSet();\r
    }\r
}\r
\`\`\`\r
\r
测试：\r
\r
<img src="F:/Zliao/黑马/1、黑马程序员Java项目《苍穹外卖》企业级开发实战/讲义/讲义/day05/assets/image-20221130205351403.png" alt="image-20221130205351403" style="zoom:50%;" /> \r
\r
说明RedisTemplate对象注入成功，并且通过该RedisTemplate对象获取操作5种数据类型相关对象。\r
\r
上述环境搭建完毕后，接下来，我们就来具体对常见5种数据类型进行操作。\r
\r
\r
\r
## 2.操作常见类型数据\r
\r
**1). 操作字符串类型数据**\r
\r
\`\`\`java\r
	/**\r
     * 操作字符串类型的数据\r
     */\r
    @Test\r
    public void testString(){\r
        // set get setex setnx\r
        redisTemplate.opsForValue().set("name","小明");\r
        String city = (String) redisTemplate.opsForValue().get("name");\r
        System.out.println(city);\r
        redisTemplate.opsForValue().set("code","1234",3, TimeUnit.MINUTES);\r
        redisTemplate.opsForValue().setIfAbsent("lock","1");\r
        redisTemplate.opsForValue().setIfAbsent("lock","2");\r
    }\r
\`\`\`\r
\r
# 三、实战：高并发库存扣减（思路）\r
\r
目标：\r
\r
- 防止超卖（库存不能扣到负数）\r
- 降低锁竞争（避免数据库行锁成为瓶颈）\r
- 分布式可用（多实例部署仍然一致）\r
\r
## 基础方案：原子自增 + 回滚\r
\r
\`\`\`java\r
Integer used = (int) redisUtil.incr(stockKey, 1);\r
if (used > stockCount) {\r
  redisUtil.decr(stockKey, 1);\r
  return "库存不足";\r
}\r
\`\`\`\r
\r
优点：简单、性能高；缺点：后续业务失败会导致“库存浪费”。\r
\r
## 改进方案：占位凭证（token）+ 过期自愈\r
\r
思路：\r
\r
- 每次扣减对应一个库存编号（used）\r
- 再为这个编号加一个 token 锁（setNx）\r
- 业务失败或超时，token 过期自动释放，间接避免长期占用\r
\r
\`\`\`java\r
String tokenKey = "stock:token:" + activityId + ":" + used;\r
boolean ok = redisUtil.setNx(tokenKey, expireMs);\r
if (!ok) {\r
  return "抢占失败";\r
}\r
\`\`\`\r
\r
要点：\r
\r
- 锁粒度按“库存编号”拆分，减少大锁竞争\r
- 过期时间建议结合活动结束时间或合理超时，避免死锁\r
\r
\r
\r
**2). 操作哈希类型数据**\r
\r
\`\`\`java\r
	/**\r
     * 操作哈希类型的数据\r
     */\r
    @Test\r
    public void testHash(){\r
        //hset hget hdel hkeys hvals\r
        HashOperations hashOperations = redisTemplate.opsForHash();\r
\r
        hashOperations.put("100","name","tom");\r
        hashOperations.put("100","age","20");\r
\r
        String name = (String) hashOperations.get("100", "name");\r
        System.out.println(name);\r
\r
        Set keys = hashOperations.keys("100");\r
        System.out.println(keys);\r
\r
        List values = hashOperations.values("100");\r
        System.out.println(values);\r
\r
        hashOperations.delete("100","age");\r
    }\r
\`\`\`\r
\r
\r
\r
**3). 操作列表类型数据**\r
\r
\`\`\`java\r
	/**\r
     * 操作列表类型的数据\r
     */\r
    @Test\r
    public void testList(){\r
        //lpush lrange rpop llen\r
        ListOperations listOperations = redisTemplate.opsForList();\r
\r
        listOperations.leftPushAll("mylist","a","b","c");\r
        listOperations.leftPush("mylist","d");\r
\r
        List mylist = listOperations.range("mylist", 0, -1);\r
        System.out.println(mylist);\r
\r
        listOperations.rightPop("mylist");\r
\r
        Long size = listOperations.size("mylist");\r
        System.out.println(size);\r
    }\r
\`\`\`\r
\r
\r
\r
**4). 操作集合类型数据**\r
\r
\`\`\`java\r
	/**\r
     * 操作集合类型的数据\r
     */\r
    @Test\r
    public void testSet(){\r
        //sadd smembers scard sinter sunion srem\r
        SetOperations setOperations = redisTemplate.opsForSet();\r
\r
        setOperations.add("set1","a","b","c","d");\r
        setOperations.add("set2","a","b","x","y");\r
\r
        Set members = setOperations.members("set1");\r
        System.out.println(members);\r
\r
        Long size = setOperations.size("set1");\r
        System.out.println(size);\r
\r
        Set intersect = setOperations.intersect("set1", "set2");\r
        System.out.println(intersect);\r
\r
        Set union = setOperations.union("set1", "set2");\r
        System.out.println(union);\r
\r
        setOperations.remove("set1","a","b");\r
    }\r
\`\`\`\r
\r
\r
\r
**5). 操作有序集合类型数据**\r
\r
\`\`\`java\r
	/**\r
     * 操作有序集合类型的数据\r
     */\r
    @Test\r
    public void testZset(){\r
        //zadd zrange zincrby zrem\r
        ZSetOperations zSetOperations = redisTemplate.opsForZSet();\r
\r
        zSetOperations.add("zset1","a",10);\r
        zSetOperations.add("zset1","b",12);\r
        zSetOperations.add("zset1","c",9);\r
\r
        Set zset1 = zSetOperations.range("zset1", 0, -1);\r
        System.out.println(zset1);\r
\r
        zSetOperations.incrementScore("zset1","c",10);\r
\r
        zSetOperations.remove("zset1","a","b");\r
    }\r
\`\`\`\r
\r
\r
\r
**6). 通用命令操作**\r
\r
\`\`\`java\r
	/**\r
     * 通用命令操作\r
     */\r
    @Test\r
    public void testCommon(){\r
        //keys exists type del\r
        Set keys = redisTemplate.keys("*");\r
        System.out.println(keys);\r
\r
        Boolean name = redisTemplate.hasKey("name");\r
        Boolean set1 = redisTemplate.hasKey("set1");\r
\r
        for (Object key : keys) {\r
            DataType type = redisTemplate.type(key);\r
            System.out.println(type.name());\r
        }\r
\r
        redisTemplate.delete("mylist");\r
    }\r
\`\`\`\r
\r
`;export{r as default};

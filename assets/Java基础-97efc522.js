const n=`# Java基础

## 数据类型

### 基本数据类型

8种基本数据类型的默认值、位数、取值范围，如下表所示：

| 数据类型 | 占用大小（字节）                | 位数       | 取值范围                                       | 默认值   | 描述                                                         |
| -------- | ------------------------------- | ---------- | ---------------------------------------------- | -------- | ------------------------------------------------------------ |
| byte     | 1                               | 8          | -128                                           | 0        | 是最小的整数类型，适合用于节省内存，例如在处理文件或网络流时存储小范围整数数据。 |
| short    | 2                               | 16         | -32768（-2^15） 到 32767（2^15 - 1）           | 0        | 较少使用，通常用于在需要节省内存且数值范围在该区间的场景。   |
| int      | 4                               | 32         | -2147483648（-2^31） 到 2147483647（2^31 - 1） | 0        | 最常用的整数类型，可满足大多数日常编程中整数计算的需求。     |
| long     | 8                               | 64         | -2147483648（-2^31） 到 2147483647（2^31 - 1） | 0L       | 用于表示非常大的整数，当 \`int\` 类型无法满足需求时使用，定义时数值后需加 \`L\` 或 \`l\`。 |
| float    | 4                               | 32         | 1.4E - 45 到 3.4028235E38                      | 0.0f     | 单精度浮点数，用于表示小数，精度相对较低，定义时数值后需加 \`F\` 或 \`f\`。 |
| double   | 8                               | 64         | 4.9E - 324 到 1.7976931348623157E308           | 0.0d     | 双精度浮点数，精度比 \`float\` 高，是 Java 中表示小数的默认类型。 |
| char     | 2                               | 16         | '\\u0000'（0） 到 '\\uffff'（65535）             | '\\u0000' | 用于表示单个字符，采用 Unicode 编码，可表示各种语言的字符。  |
| boolean  | 无明确字节的大小（理论上是1位） | 五明确位数 | true\` 或 \`false                                | false    | 用于逻辑判断，只有两个取值，常用于条件判断和循环控制等逻辑场景。 |



------



### String

string中内部字符数组被 final 修饰，且没有提供修改内容的方法，因此一旦创建就不能改变，所以在使用**“==”**判断的时候他比对的是地址而不是字符串的真实数据，要使用**“equal**”方法，而String重写了hashcode方法，因为要比对的是值，而hashcode按照默认Obiect实现的，存的是**内存地址**，如果此时的hashcode不同就会存放在不同的**桶**中则会出现不同的位置，而string重写的hashcode则是根据值来配置hashcode

- String 的 hashCode 是缓存的，第一次算， 后面直接返回。
- JDK 8：\`final char[]\`
- JDK 9+：\`final byte[] + coder\`
- 重写的hashcode的本质是一个**多项式哈希**：
  - hash=s[0]∗31n−1+s[1]∗31n−2+...+s[n−1]hash = s[0] * 31^{n-1} + s[1] * 31^{n-2} + ... + s[n-1]hash=s[0]∗31n−1+s[1]∗31n−2+...+s[n−1]
  - 也可以理解为迭代写法：
  - h=31∗h+ch = 31 * h + ch=31∗h+c

### StringBuffer

- 线程安全但性能较低，只有确实需要线程安全时才用
- 相比较string内部加了一个可扩容的数组存字符，比StringBuilder多了synchronized的锁是线程安全，多线程环境下要频繁修改字符串




### StringBuilder

内部加了一个可扩容的数组存字符，单线程下大量拼接操作。

 String 拼接：

\`\`\`
String s = a + b;
\`\`\`

实际上会变成：

\`\`\`
new StringBuilder().append(a).append(b).toString();
\`\`\`



### HashMap

重要组成：

- DEFAULT_INITIAL_CAPACITY（默认初始容量）1<<4
- MAXIMUM_CAPACITY（最大容量）1<<30
- DEFAULT_LOAD_FACTOR（负载因子）0.75
- TREEIFY_THRESHOLD（转换树阈值<桶的容量>）8
- UNTREEIFY_THRESHOLD（变回链表的阈值）6
- MIN_TREEIFY_CAPACITY（转换树的阈值<数组容量>）64

- DEFAULT_INITIAL_CAPACITY：16
- MAXIMUM_CAPACITY：1<<30
- DEFAULT_LOAD_FACTOR：0.75
- TREEIFY_THRESHOLD：8
- UNTREEIFY_THRESHOLD：6
- MIN_TREEIFY_CAPACITY：64

## 多线程

### 一、多线程的实现方式:

#### 	**1.继承Thread类的方式进行实现**

\`\`\`java
public class hello extends Thread{
    @RequestMapping("/hello")
    public String hello(){
        System.out.println("hello,world");
        return "Hello,world~";
    }
    public void run(){
        for(int i = 0 ; i < 50; ++ i)
        System.out.println(getName()+"start");
    }

}
\`\`\`

通过类继承Thread类进行调用Thread的方法，通过定义run方法，在主函数用start()方法进行启动。

\`\`\`java
hello a = new hello();
hello b = new hello();
a.setName("线程1");
b.setName("线程2");
a.start();
b.start();
\`\`\`

Thread类可以直接使用getName方法，因为继承父类可以直接使用。

#### 	**2.实现Runnable接口的方式进行实现**

1.需要自己定义一个类实现Runnable接口
2.重写里面的run方法
3.创建自己的类方法
4.创建一个Thread类的对象，并开启线程

Runnable不可以直接使用getName方法，要使用Thread t = Thread.currentThread();获取传入对象，再用t.getName方法，或者直接Thread.currentThread().getName()

\`\`\`java
public class hello implements Runnable{
    @RequestMapping("/hello")
    public String hello(){
        System.out.println("hello,world");
        return "Hello,world~";
    }
    public void run(){
        for(int i = 0 ; i < 50; ++ i){
        Thread t = Thread.currentThread();
        System.out.println(t.getName() + "Helloworld");
        }
    }

}
\`\`\`

\`\`\`java
hello a = new hello();
Thread t1 = new Thread(a);
Thread t2 = new Thread(a);
t1.setName("线程1");
t2.setName("线程2");
t1.start();
t2.start();
\`\`\`



#### 	**3.利用Callable接口的Future接口方式实现（有返回值）**

\`\`\`java
@RestController
public class hello implements Callable<Integer> {
    @RequestMapping("/hello")
    public String hello(){
        System.out.println("hello,world");
        return "Hello,world~";
    }

    @Override
    public Integer call() throws Exception {
        return 202;
    }

}
\`\`\`

​		可以获取到多线程运行的结果	
​			1.创建一个类hello实现Callable接口范式<>里写返回类型
​			2.重写call（是由返回值的，表示多线程运行的结果）

​			3.创建对象类型为hello（表示多线程要执行的任务）
​			4.创建FutureTask的对象（作用管理多线程的结果）
​			5.创建Thread类的对象，并启动（表示线程）

\`\`\`java
hello a = new hello();
FutureTask<Integer> b = new FutureTask<>(a);
Thread ans = new Thread(b);
ans.start();
Integer an = b.get();
System.out.println(an);
\`\`\`





|                  | 优点                                         | 缺点                                       |
| ---------------- | -------------------------------------------- | ------------------------------------------ |
| 继承Thread类     | 变成比较简单，可以直接使用Thread类中的方法   | 可扩展性较差，不能继承其他的类             |
| 实现Runnable接口 | 扩展性强，实现该接口的同时还可以继承其他的类 | 编程相对复杂，不能直接使用Thread类中的方法 |
| 实现Callable接口 | 扩展性强，实现该接口的同时还可以继承其他的类 | 编程相对复杂，不能直接使用Thread类中的方法 |

### 二、常见的成员方法

| 方法名称                         | 说明                                                         |
| -------------------------------- | ------------------------------------------------------------ |
| String getName()                 | 返回此线程的名称（默认名字，Thread-x(x是序列号）)            |
| void setName(String name)        | 设置线程的名字（构造方法也可以设置名字）                     |
| static Thread currentThread()    | 获取当前线程的对象                                           |
| static void sleep(long time)     | 让线程休眠指定的时间，单位为毫秒                             |
| setPriority(int newPriority)     | 设置线程的优先级（1~10）默认是5(只是概率，不是绝对的，优先级值越小概率越大) |
| final int getPrioity()           | 获取线程的优先级                                             |
| final void setDaemon(boolean on) | 设置为守护线程(非守护线程运行完再开始，注意当修改了优先级就也变成了概率问题) |
| public static voi yield()        | 出让线程/礼让线程（尽可能的）                                |
| public static void join()        | 插入线程/插队线程                                            |

### 三、生命周期

​	首先，创建了线程对象，进入待命状态start()，有了执行资格但是没有执行权（就绪，不停的抢CPU），一旦抢到cpu的执行权，就有了执行权，但是没有了执行资格，如果碰到sleep或者其他阻塞方法，那么就回到待命状态，直到run()执行完毕，线程死亡。（图片缺失：线程的生命周期.png）

### 四、同步代码块

\`\`\`java
while(true){
        synchronized (hello.class){
        if(t < 100){
            try {
                sleep(100);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }t ++;
            System.out.println(getName()+"正在售卖第"+t+"张票");
        }else break;
    }
}
\`\`\`

锁住静态值，用synchronized锁住

### 五、同步方法

​	1.synchronized()里面必须是唯一的，一般用当前类的class如第四项。

​	2.Stringbuilder(单线程推荐)

​	3.Stringbuffer(多线程推荐)

### 六、Lock锁

​	1.Lock实现提供比使用synchronized方法和语句可以获得更广泛的锁定操作

​	2.Lock中提供了获得锁和释放锁的方法

​	3.void lock():获得锁（手动上锁）

​	4.void unlock():释放锁（手动释放锁）

​	5.Lock是接口不能直接实例化，这里采用它的实现类ReentrantLock来实例化ReentrantLock的构造方法

​	6.ReentrantLock():创建一个ReentrantLock的实例

\`\`\`java
while(true){
                lock.lock();
//                synchronized (hello.class){
                    try {
                        if(t == 100) break;
                        else {
                        Thread.sleep(100);
                            t ++;
                            System.out.println(getName()+"正在售卖第"+t+"张票");
                        };
                    } catch (InterruptedException e) {
                        throw new RuntimeException(e);
                    }
                    finally {
                        lock.unlock();
                    }
            }
\`\`\`

------

## CompletableFuture

### 1.解释

**Java 8 引入的异步编程框架**，用于：

- 异步任务
- 并行任务
- 组合多个任务
- 链式任务
- 异常处理
- 回调执行
- 自定义线程池

它相当于：

> **Future + Callback + Promise + ThreadPool + 异步执行框架** 的融合体。

以前用 Future 要 get 阻塞、不能串联，特别难用。
 CompletableFuture 完全解决了。

------



### 2.含义

CompletableFuture 的方法大概可以分为 6 类：

1. **创建任务**（runAsync，supplyAsync）
2. **任务完成的回调**（thenApply，thenAccept，thenRun）
3. **组合两个任务**（thenCombine、thenCompose、allOf、anyOf）
4. **异常处理**（exceptionally，handle，whenComplete）
5. **结果转换**（thenApply）
6. **同步等待结果**（join，get）



### 3.创建异步任务

#### 1.无返回值任务

\`\`\`
CompletableFuture<Void> cf = CompletableFuture.runAsync(() -> {
    System.out.println("异步任务");
});
\`\`\`

#### 2.有返回值任务

\`\`\`
CompletableFuture<String> cf = CompletableFuture.supplyAsync(() -> {
    return "result";
});
\`\`\`

####  3.指定线程池

\`\`\`
supplyAsync(() -> {...}, threadPoolExecutor)
\`\`\`

强烈推荐指定线程池，否则默认使用 **ForkJoinPool.commonPool()**，在生产可能出问题。

------

#### 4、链式操作（把异步任务连起来）

CompletableFuture 的核心就是链式。

##### 1.thenApply —— 接收上一个结果，并返回新结果

\`\`\`
cf.thenApply(result -> result + " OK");
\`\`\`

##### 2. thenAccept —— 接收上一个结果，不返回

\`\`\`
cf.thenAccept(result -> System.out.println(result));
\`\`\`

##### 3.thenRun —— 不关心结果，也不返回

\`\`\`
cf.thenRun(() -> System.out.println("done"));
\`\`\`

三者区别：

| 方法       | 是否接收上一步结果 | 是否返回新结果 |
| ---------- | ------------------ | -------------- |
| thenApply  | ✔                  | ✔              |
| thenAccept | ✔                  | ✘              |
| thenRun    | ✘                  | ✘              |

------

#### 5.组合多个异步任务

这是你现在使用的重点。

------

##### 1. allOf：等待所有任务完成（并行任务）

\`\`\`
CompletableFuture.allOf(cf1, cf2, cf3).join();
\`\`\`

你用了这个：

\`\`\`
CompletableFuture.allOf(accountType01, accountType02)
        .thenRun(() -> {
            ...
        }).join();
\`\`\`

并行执行 → 全部完成 → 回调收集结果。

------

##### 2. anyOf：任意一个完成

\`\`\`
CompletableFuture.anyOf(cf1, cf2).thenAccept(System.out::println);
\`\`\`

适用于“谁快用谁”。

------

##### 3.thenCombine：两个任务都完成后组合结果

\`\`\`
cf1.thenCombine(cf2, (r1, r2) -> r1 + r2);
\`\`\`

------

##### 4. thenCompose：任务依赖另一个任务（flatMap）

\`\`\`
cf.thenCompose(id -> getUserById(id));
\`\`\`

------

#### 6.异常处理

CompletableFuture 非常强大的地方。

------

##### 1. exceptionally —— 类似 catch

\`\`\`
cf.exceptionally(e -> {
    System.out.println(e);
    return "default";
});
\`\`\`

------

##### 2. handle —— 不管成功失败都处理（finally）

\`\`\`
cf.handle((result, ex) -> {
    if (ex != null) return "error";
    return result;
});
\`\`\`

------

##### 3. whenComplete —— 查看结果，不改变结果

\`\`\`
cf.whenComplete((r, e) -> {
    log.info("完成，结果={}，异常={}", r, e);
});
\`\`\`

三者对比：

| 方法          | 是否接收结果 | 是否接收异常 | 是否改变最终结果 |
| ------------- | ------------ | ------------ | ---------------- |
| exceptionally | ✘            | ✔            | ✔                |
| handle        | ✔            | ✔            | ✔                |
| whenComplete  | ✔            | ✔            | ✘                |

------

#### 7.等待结果

##### 1. get() —— 会抛异常

\`\`\`
cf.get();
\`\`\`

##### 2. join() —— 不抛 checked 异常（推荐）

\`\`\`
cf.join();
\`\`\`

##### 3. 带超时时间

\`\`\`
cf.get(3, TimeUnit.SECONDS);
\`\`\`

------

#### 8.CompletableFuture 常用线程池

你代码的 threadPoolExecutor 就是：

\`\`\`
CompletableFuture.supplyAsync(() -> {...}, threadPoolExecutor)
\`\`\`

原因：

默认 ForkJoinPool 线程数 = CPU 核数
 但业务 I/O 操作（数据库、RPC、网络）会大量阻塞，所以 CPU 核数完全不够。

因此生产都会自己创建线程池。

------

#### 9.实际场景

流程如下图：

\`\`\`
      ┌──────────────┐
      │ accountType01 │ ← 异步执行
      └──────────────┘
                \\
                 \\
                  ↓
                allOf → thenRun → 把结果放入 DynamicContext
                 /
                /
      ┌──────────────┐
      │ accountType02 │ ← 异步执行
      └──────────────┘
\`\`\`

这就是典型的 **并行异步加载 + 决策引擎动态上下文**。

------

## synchronized



### 线程创建方式

#### 继承 Thread

\`\`\`java
public class Hello extends Thread {
  @Override
  public void run() {
    for (int i = 0; i < 50; i++) {
      System.out.println(getName() + " start");
    }
  }
}
\`\`\`

#### 实现 Runnable

\`\`\`java
public class Hello implements Runnable {
  @Override
  public void run() {
    for (int i = 0; i < 50; i++) {
      System.out.println(Thread.currentThread().getName() + " hello");
    }
  }
}
\`\`\`

#### 实现 Callable（有返回值）

\`\`\`java
public class Hello implements Callable<Integer> {
  @Override
  public Integer call() {
    return 202;
  }
}
\`\`\`

### 线程常用方法（速查）

| 方法 | 说明 |
| --- | --- |
| getName / setName | 获取/设置线程名 |
| currentThread | 获取当前线程对象 |
| sleep | 休眠 |
| join | 等待线程结束 |
| setDaemon | 设为守护线程 |

### 同步：synchronized / Lock

同步代码块（示例）：

\`\`\`java
while (true) {
  synchronized (Hello.class) {
    if (t < 100) {
      t++;
      System.out.println(Thread.currentThread().getName() + " 正在售卖第 " + t + " 张票");
    } else {
      break;
    }
  }
}
\`\`\`

Lock（示例，记得 finally 释放）：

\`\`\`java
lock.lock();
try {
  // ...
} finally {
  lock.unlock();
}
\`\`\`

### CompletableFuture（常用模式）

- \`runAsync / supplyAsync\`：创建异步任务
- \`thenApply / thenAccept / thenRun\`：链式回调
- \`allOf / anyOf\`：组合多个任务
- \`exceptionally / handle / whenComplete\`：异常处理

示例：

\`\`\`
CompletableFuture.allOf(cf1, cf2).thenRun(() -> { ... }).join();
\`\`\`

通信三要素：ip地址，端口号，协议

引入java.net.InetAdderss

| 所有方法                                                     | 使用方法                                     | 作用                                      |
| ------------------------------------------------------------ | -------------------------------------------- | ----------------------------------------- |
| \`static InetAddress getLocalHost()\`                          | InetAddress ip1 = InetAddress.getLocalHost() | 获取本地ip地址名字和字符串信息            |
| \`String getHostAddress()\`                                    | ip1.getHostAddress()                         | 返回文本表示中的IP地址字符串。            |
| \`String getHostName()\`                                       | ip1.getHostName()                            | 获取此IP地址的主机名。                    |
| \`static InetAddress getByName(String host)\`                  | InetAddress.getByName("www.baidu.com")       | 根据主机名称确定主机的IP地址。            |
| \`static InetAddress\`\`getByAddress(String host,  byte[] addr)\` |                                              | 根据提供的主机名和IP地址创建InetAddress。 |
| \`static InetAddress\`\`getByAddress(byte[] addr)\`              |                                              | 给定原始IP地址返回 \`InetAddress\`对象      |
| \`boolean\`\`isReachable(int timeout)\`                          |                                              | 测试该地址是否可达。                      |
|                                                              |                                              |                                           |
|                                                              |                                              |                                           |
|                                                              |                                              |                                           |
|                                                              |                                              |                                           |

端口分类：

​	周知端口：0~1023，被预先定义的知名应用占用（如：HTTP占用80，FTP占用21）

​	注册端口：1024~49151，分配给用户进程或某些应用程序。

​	动态端口：49152~65535，之所以成为动态端口，是因为它一般不固定分配某些进程，而是动态分配

开发程序一般选择使用注册端口，一个设备不能出现两个相同端口号的程序，容易出错。

**UDP：**

​	无连接，不可靠通信（语音通话或者视频直播）<效率高>

​	不事先建立连接，数据按照包发，一包数据包含：自己的ip，程序端口，目的地ip，程序端口和数据（限制再65kb）等

​	发送方不管对方是否在线，数据在中间丢失也不管，如果接收方收到数据也不返回确认，是不可靠的。

**TCP：**

​	面向连接，可靠通信（网页，文件下载，支付）<效率不高>

​	最终目的：要保证在不可靠的信道上实现可靠的传输。

​	TCP三个步骤：三次握手建立连接，传输数据进行确认，四次挥手断开连接。

​	TCP的三次握手：客户端发送链接请求，服务端返回一个响应，客户端再次发送确认信息，连接建立。

​	四次断开：客服端发出断开链接请求，服务端返回一个响应，稍等，再返回一个响应，确定断开，客户端发出正式确认断开链接





UDP通信：

​	java提供了一个java.net.DatagramSocket来实现UDP通信。

**DatagramSocket用于创建客户端、服务端**

| 构造器                           | 解释                                                         |
| -------------------------------- | ------------------------------------------------------------ |
| \`DatagramSocket()\`               | 构造一个数据报套接字并将其绑定到本地主机上的任何可用端口。（客户端） |
| \`DatagramSocket(int port)\`       | 构造一个数据报套接字并将其绑定到本地主机上的指定端口。 （服务端 |
| **方法**                         | **解释**                                                     |
| \`void send(DatagramPacket p)\`    | 发送数据包                                                   |
| \`void receive(DatagramPacket p)\` | 使用数据包接收数据                                           |

**DatagramPacket:创建数据包**

| 构造器                                                       | 解释                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| \`DatagramPacket(byte[] buf, int offset,  int length, InetAddress address, int port)\` | 构造一个数据报包，用于将长度为 \`length\`且偏移量为  \`ioffset\`的数据包发送到指定主机上的指定端口号。  1.数据包2.数据包的长度3.服务端的ip4.端口号 |
|                                                              |                                                              |


## CollectionUtils

集合（Collections）的操作是非常频繁的。而 \`CollectionUtils\` 类作为 Apache Commons Collections 库中的一个强大工具类，为我们提供了许多便捷的方法来处理集合。

### 1.判断集合是否为空

isEmpty(Collection coll)判断给定的集合是否为空，即集合中没有任何元素或者集合为 \`null\`。

例如：



\`\`\`java
import org.apache.commons.collections4.CollectionUtils;

import java.util.ArrayList;
import java.util.List;

public class CollectionUtilsExample {
    public static void main(String[] args) {
        List<String> list = null;
        System.out.println(CollectionUtils.isEmpty(list)); // true   
list = new ArrayList<>();
    System.out.println(CollectionUtils.isEmpty(list)); // true

    list.add("element");
    System.out.println(CollectionUtils.isEmpty(list)); // false
	}
}
\`\`\`
\`isNotEmpty(Collection coll)\`：与 \`isEmpty\` 方法相反，判断集合是否非空，即集合不为 \`null\` 且至少包含一个元素。



### 2.合并集合

#### 1.allAll

\`addAll(final Collection<C> collection, final C[] elements)\`将多个元素添加到给定的集合中。

例如：



\`\`\`java
import org.apache.commons.collections4.CollectionUtils;

import java.util.ArrayList;
import java.util.List;

public class CollectionUtilsExample {
    public static void main(String[] args) {
        List<String> list1 = new ArrayList<>();
        list1.add("element1");
        list1.add("element2");
    List<String> list2 = new ArrayList<>();
    list2.add("element3");
    list2.add("element4");

    CollectionUtils.addAll(list1, list2.toArray(new String[0]));
    System.out.println(list1); // [element1, element2, element3, element4]
	}
}
\`\`\`
#### 2.addIgnoreNull

将元素添加到给定的集合中，同时忽略 \`null\` 值。

addIgnoreNull(Collection<T> collection, T object)

例如：

\`\`\`java
import org.apache.commons.collections4.CollectionUtils;

import java.util.ArrayList;
import java.util.List;

public class CollectionUtilsExample {
        public static void main(String[] args) {
        List<String> list = new ArrayList<>();
        list.add("element1");

        CollectionUtils.addIgnoreNull(list,  null);
        CollectionUtils.addIgnoreNull(list,  "element2");
        System.out.println(list); // [element1, element2, element3]
    }
}

\`\`\`



### 3.查找集合中的元素

#### 1.containsAny

containsAny(Collection<?> coll1, Collection<?> coll2)：判断第一个集合中是否包含第二个集合中的任何一个元素。

例如

\`\`\`java
import org.apache.commons.collections4.CollectionUtils;

import java.util.ArrayList;
import java.util.List;

public class CollectionUtilsExample {
    public static void main(String[] args) {
        List<String> list1 = new ArrayList<>();
        list1.add("element1");
        list1.add("element2");

        List<String> list2 = new ArrayList<>();
        list2.add("element2");
        list2.add("element3");

        System.out.println(CollectionUtils.containsAny(list1, list2)); // true
    }
}

\`\`\`

#### 2.containsAll

\`containsAll(Collection<?> coll1, Collection<?> coll2)\`：判断第一个集合是否包含第二个集合中的所有元素。

例如：

\`\`\`java
import org.apache.commons.collections4.CollectionUtils;

import java.util.ArrayList;
import java.util.List;

public class CollectionUtilsExample {
    public static void main(String[] args) {
        List<String> list1 = new ArrayList<>();
        list1.add("element1");
        list1.add("element2");
        list1.add("element3");

        List<String> list2 = new ArrayList<>();
        list2.add("element2");
        list2.add("element3");

        System.out.println(CollectionUtils.containsAll(list1, list2)); // true
    }
}

\`\`\`

#### 3.select

\`select(Collection<?> collection, Predicate<? super Object> predicate)\`：根据给定的谓词（Predicate）从集合中选择满足条件的元素，返回一个新的集合。

例如：

\`\`\`java
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.collections4.Predicate;

import java.util.ArrayList;
import java.util.List;

public class CollectionUtilsExample {
    public static void main(String[] args) {
        List<String> list = new ArrayList<>();
        list.add("element1");
        list.add("element2");
        list.add("element3");

        Predicate<String> predicate = new Predicate<String>() {
            @Override
            public boolean evaluate(String object) {
                return object.contains("2");
            }
        };

        List<String> selectedList = (List<String>) CollectionUtils.select(list, predicate);
        System.out.println(selectedList); // [element2]
    }
}

\`\`\`

### 4.过滤集合

\`filter(Collection<?> collection, Predicate<? super Object> predicate)\`：根据给定的谓词过滤集合中的元素，返回一个新的集合，只包含满足谓词条件的元素。

例如：

\`\`\`java
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.collections4.Predicate;

import java.util.ArrayList;
import java.util.List;

public class CollectionUtilsExample {
    public static void main(String[] args) {
        List<String> list = new ArrayList<>();
        list.add("element1");
        list.add("element2");
        list.add("element3");

        Predicate<String> predicate = new Predicate<String>() {
            @Override
            public boolean evaluate(String object) {
                return object.length() > 6;
            }
        };

        List<String> filteredList = (List<String>) CollectionUtils.filter(list, predicate);
        System.out.println(filteredList); // []
    }
}

\`\`\`

### 5.集合的交集、并集和差集

#### 1.retainAll

\`retainAll(Collection<?> coll1, Collection<?> coll2)\`：计算两个集合的交集，即保留第一个集合中也存在于第二个集合中的元素。

例如：

\`\`\`java
import org.apache.commons.collections4.CollectionUtils;

import java.util.ArrayList;
import java.util.List;

public class CollectionUtilsExample {
    public static void main(String[] args) {
        List<String> list1 = new ArrayList<>();
        list1.add("element1");
        list1.add("element2");
        list1.add("element3");

        List<String> list2 = new ArrayList<>();
        list2.add("element2");
        list2.add("element3");
        list2.add("element4");

        System.out.println(CollectionUtils.retainAll(list1, list2)); // [element2, element3]
    }
}

\`\`\`

#### 2.addAll

\`addAll(Collection<C> collection, Iterable<? extends C> iterable)\`：取并集

例如；

\`\`\`java
import org.apache.commons.collections4.CollectionUtils;

import java.util.ArrayList;
import java.util.List;

public class CollectionUtilsExample {
    public static void main(String[] args) {
        List<String> list1 = new ArrayList<>();
        list1.add("element1");
        list1.add("element2");

        List<String> list2 = new ArrayList<>();
        list2.add("element3");
        list2.add("element4");

        CollectionUtils.addAll(list1, list2);
        System.out.println(list1); // [element1, element2, element3, element4]
    }
}

\`\`\`

#### 3.removeAll

\`removeAll(Collection<E> collection, Collection<?> remove)\`：计算两个集合的差集，即删除第一个集合中第二个集合的元素。

例如：

\`\`\`java
import org.apache.commons.collections4.CollectionUtils;

import java.util.ArrayList;
import java.util.List;

public class CollectionUtilsExample {
    public static void main(String[] args) {
        List<String> list1 = new ArrayList<>();
        list1.add("element1");
        list1.add("element2");
        list1.add("element3");

        List<String> list2 = new ArrayList<>();
        list2.add("element2");
        list2.add("element3");
        list2.add("element4");

        System.out.println(CollectionUtils.removeAll(list1, list2)); // [element1]
    }
}

\`\`\`

###  1. Class 类（反射的入口）

你能通过 Class 做的事情就是“**获取结构信息**”。

#### **① 获取类信息**

\`\`\`
getName()
getSimpleName()
getPackage()
getClassLoader()
getModifiers()
\`\`\`

#### **② 创建类实例**

\`\`\`
newInstance()                     // 已废弃
getConstructor().newInstance()    // 推荐方式
\`\`\`

#### **③ 获取字段 Field**

\`\`\`
getFields()              // 获取 public 字段（包括父类）
getDeclaredFields()      // 获取本类所有字段（不含父类）

getField(String name)
getDeclaredField(String name)
\`\`\`

#### **④ 获取方法 Method**

\`\`\`
getMethods()                // public + 继承
getDeclaredMethods()        // 本类所有方法

getMethod(name, paramTypes...)
getDeclaredMethod(name, paramTypes...)
\`\`\`

#### **⑤ 获取构造器 Constructor**

\`\`\`
getConstructors()
getDeclaredConstructors()

getConstructor(paramTypes...)
getDeclaredConstructor(paramTypes...)
\`\`\`

#### **⑥ 获取父类、接口、注解**

\`\`\`
getSuperclass()
getInterfaces()
getAnnotations()
getDeclaredAnnotations()
isAnnotationPresent()
\`\`\`

#### **⑦ 其他判断方法**

\`\`\`
isAnnotation()
isInterface()
isEnum()
isArray()
isAssignableFrom()
\`\`\`

------

### 2. Field 类（字段反射）

字段反射包含 “读取、写入、访问权限”。

#### **① 读取和修改值**

\`\`\`
get(Object obj)
set(Object obj, Object value)
\`\`\`

#### **② 权限相关**

\`\`\`
setAccessible(true / false)
isAccessible()   // 在旧版本可用
\`\`\`

#### **③ 字段元信息**

\`\`\`
getName()
getType()
getDeclaringClass()
getModifiers()
getAnnotations()
isAnnotationPresent()
getAnnotation()
\`\`\`

------

###  3. Method 类（方法反射）

#### **① 调用方法**

\`\`\`
invoke(Object obj, Object... args)
\`\`\`

#### **② 方法信息**

\`\`\`
getName()
getReturnType()
getParameterTypes()
getDeclaringClass()
getModifiers()
getAnnotations()
\`\`\`

#### **③ 权限**

\`\`\`
setAccessible(true)
\`\`\`

------

###  4. Constructor 类（构造器反射）

#### **① 创建对象**

\`\`\`
newInstance(Object... initArgs)
\`\`\`

#### **② 元信息**

\`\`\`
getParameterTypes()
getDeclaringClass()
getModifiers()
\`\`\`

------

###  5. Annotation 反射（注解解析用的）

用于判断一个字段/方法/类是否有某个注解。

\`\`\`
isAnnotationPresent(Class<? extends Annotation> annotation)
getAnnotation(Class<T> annotation)
getAnnotations()
getDeclaredAnnotations()
\`\`\`

所有元素（Class、Field、Method）都支持。

------

### 6. Modifier（访问修饰符）

Class/Field/Method 的权限信息由它提供：

\`\`\`
Modifier.isPublic(int mod)
Modifier.isPrivate(int mod)
Modifier.isProtected(int mod)
Modifier.isStatic(int mod)
Modifier.isFinal(int mod)
...
\`\`\`

------

### 7. AccessibleObject（父类）

Field、Method、Constructor 都继承它
 主要方法：

\`\`\`
setAccessible(boolean)
trySetAccessible()
isAccessible()
\`\`\`

------

###  **总汇：Java 反射全 API（精简图）**

| 模块                 | 功能                                     |
| -------------------- | ---------------------------------------- |
| **Class**            | 获取类 → 字段/方法/构造器/父类/接口/注解 |
| **Field**            | 读取/修改字段值，读取注解                |
| **Method**           | 调用方法，查看参数，读取注解             |
| **Constructor**      | 调用构造器创建对象                       |
| **Annotation**       | 读取注解属性                             |
| **Modifier**         | 判断 public/private/static 等            |
| **AccessibleObject** | setAccessible 控制访问权限               |





## **相关八股文**



###  **1. 什么是 Java 反射？（经典必问）**

####  标准回答：

反射是 Java 在运行时动态获取类的结构（类名、字段、方法、构造器）并对其进行操作（读取字段、调用方法、创建实例）的能力。

#### 深度回答：

反射让 Java 具有“动态语言特性”，允许程序：

- 运行时分析类结构（Class、Field、Method、Constructor）
- 动态创建对象（newInstance / constructor.newInstance）
- 动态调用方法（method.invoke）
- 动态读写字段（field.get / field.set）

常用于框架：Spring、MyBatis、JPA、JSON 序列化等。

------

### 2. Java 反射的底层原理是什么？**

####  标准回答：

反射基于 JVM 在加载类时，将类的结构信息保存到方法区（元空间），并由 Class 对象作为访问入口。反射 API 基于这些元数据进行操作。

####  深度回答：

1. 类加载后 JVM 会在 **方法区/元空间** 保存类结构（字段、方法）。
2. 每个类在 JVM 中有且仅有一个 **Class 对象** 表示它的元数据。
3. 反射 API（Field/Method/Constructor）本质是对元数据的访问。

------

###  **3. 反射有哪些典型应用场景？**

- Spring IOC 自动注入（扫描注解、反射设置字段值）
- Spring AOP（动态代理）
- MyBatis 自动映射
- JSON 序列化、反序列化（Jackson/Gson）
- JDK 动态代理
- RPC 框架（反射调用方法）
- 配置热更新（你的 DCC 也是！）

------

### **4. 如何通过反射创建对象？**

#### 推荐写法（Java 8+）：

\`\`\`
Constructor<User> ctor = User.class.getConstructor();
User user = ctor.newInstance();
\`\`\`

------

###  **5. 如何通过反射调用方法？（99% 会问）**

\`\`\`
Method m = user.getClass().getMethod("setName", String.class);
m.invoke(user, "Sheep");
\`\`\`

------

###  **6. 如何通过反射访问私有字段？（必考）**

\`\`\`
Field field = user.getClass().getDeclaredField("name");
field.setAccessible(true);      // 关键
field.set(user, "AppleSheep");
\`\`\`

------

###  **7. setAccessible(true) 的作用是什么？**

允许访问 **private** 字段/方法，从而绕过 Java 的安全检查。
 框架都靠它来干预对象内部结构。

------

### **8. 反射为什么慢？可以怎么优化？（高级必考）**

####  原因：

1. 需要进行权限检查（setAccessible 可优化）
2. 需要方法查找（method lookup）
3. invoke 是一种“间接调用”，比直接方法调用慢

####  优化方式：

- 尽量缓存 Method/Field，不要重复反射
- 使用 setAccessible(true) 关闭安全检查
- 使用 MethodHandle（Java 7 引入，性能更高）
- 使用代理 + 代码生成（Spring CGLIB）

------

###  **9. 为什么框架都喜欢用反射？**

因为反射可以实现：

- **面向接口编程**
- **运行时动态创建对象**
- **解耦**（不用硬编码类名）
- **支持注解驱动开发**
- **灵活依赖注入（IOC）**

无反射无 Spring，无反射无 MyBatis。

------

###  **10. Class.forName() 和 类加载 new 的区别？**

| new              | Class.forName    |
| ---------------- | ---------------- |
| 创建对象         | 加载类字节码     |
| 不执行静态代码块 | 执行静态代码块   |
| 不加载类         | 会加载并初始化类 |

------

###  **11. 什么是反射的“暴力破解”？**

\`\`\`
field.setAccessible(true);
\`\`\`

就是绕过 private/protected 的安全控制。

------

###  **12. 什么是 AOP 中的反射应用？**

Spring AOP 在代理方法时：

- 通过反射查找目标方法 Method
- 通过 Method.invoke 调用
- 通过注解反射增强逻辑

------

### 13. 反射能获取父类字段吗？**

默认情况下：

- getDeclaredField → **只能获取本类字段**
- getField → **能获取父类 public 字段**

------

###  **14. Java 反射有哪些风险？（高频）**

- 性能损耗
- 破坏封装性
- 安全风险（可访问 private）
- 代码可读性差

------

###  **15. 动态代理与反射是什么关系？**

- JDK 动态代理中，通过 **反射调用目标方法**：

\`\`\`
method.invoke(target, args)
\`\`\`

- CGLIB 则是通过生成字节码，但内部也需反射分析。

------

###  **16. 什么是 MethodHandle？它比反射快吗？（高级面试题）**

MethodHandle 是 Java 7 引入的 **轻量级方法引用机制**。

- 性能比反射 Method 快
- 更接近直接方法调用
- 用于 JVM 动态语言支持（invokeDynamic）

------

###  **17. 注解与反射的关系？**

注解本质是放在 Class 的元数据上
 反射用于：

- 判断类/字段/方法是否有注解
- 获取注解的值

示例：

\`\`\`
field.isAnnotationPresent(DCCValue.class)
field.getAnnotation(DCCValue.class)
\`\`\`

------

###  **18. 如何获取泛型参数？**

\`\`\`
Field f = clazz.getDeclaredField("list");
ParameterizedType type = (ParameterizedType) f.getGenericType();
Type t = type.getActualTypeArguments()[0];
\`\`\`

------

###  总结一句话背诵：

> **反射 = 运行时操作类结构，通过 Class → Field/Method/Constructor，实现动态创建对象、调用方法、注入依赖，是 Spring 等框架的基础。**

`;export{n as default};

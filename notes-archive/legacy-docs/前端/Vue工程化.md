## 简介

### 工程化

模块化：项目划分若干模块，单独开发、维护、提高效率

组件化：将页面的各个组件部分封装为一个一个的组件，提高复用

规范发：提供标准统一的目录结构、编码规范、开发流程

自动化：项目的构建、开发、测试、打包、部署

### create-vue

官方提供的最新的脚手架工具，用于快速生成一个工程化的Vue项目

**create-vue提供的功能如下：**

​	统一的目录结构

​	本地部署

​	热部署

​	单元测试

​	集成打包上线

**依赖环境**：NodeJS

### NodeJS

**1). 验证NodeJS的环境变量**

NodeJS 安装完毕后，会自动配置好环境变量，我们验证一下是否安装成功，通过： `node -v`

**2). 配置npm的全局安装路径**

使用 **管理员身份** 运行命令行，在命令行中，执行如下指令：

```Java
npm config set prefix "D:\develop\NodeJS"
```

**注意：D:\develop\NodeJS 这个目录是NodeJS的安装目录 !!!!!**

**注意：D:\develop\NodeJS 这个目录是NodeJS的安装目录 !!!!!**

**注意：D:\develop\NodeJS 这个目录是NodeJS的安装目录 !!!!!**

**3). 切换为淘宝镜像，加速下载：**

```Java
npm config set registry https://registry.npmmirror.com
```

------

## Vue项目——创建

@后面是版本号，没添加默认是最新的。

![](../img/Vue创建.png)

### 项目结构

![](../img/Vue项目结构.png)

启动

![](../img/页面.png)

![](../img/页面2.png)

------

## API风格

### 选项式API

可以用包含多个选项的对象来描述组件的逻辑，如：data，methods，mounted等。选项定义的属性都会暴露在函数内部的this上，它会指向当前的组件实例。

![](../img/选项式API.png)

### 组合式API

是Vue3提供的一种基于函数的组件编写方式，通过使用函数来组织和复用组件的逻辑。它提供了一种更灵活，更可组合的方式来编写组件。

在Vue中的组合式API使用时，是没有this对象的，this对象是undefined。

![](../img/组合式API.png)

```vue
<script setup>//setup预处理操作，高偶素Vue需要进行一些处理，让我们更简洁的使用组合式API
//引入ref函数，接受一个内部值，返回一个响应式的ref对象，此对象只有一个指向内部值的属性value。
import {ref, onMounted} from 'vue';

//定义一个响应式变量
const count = ref(0);

//定义一个函数，用于增加count的值
function increment(){
    count.value++;
}

//钩子函数，注册一个回调函数，在组件挂载完成后执行。
onMounted(()=>{
    console.log('组件挂载完成');
})
</script>

<template>
    <button @click="increment">count:{{count}}</button>
</template>

<style scoped>/* scoped表示样式只作用于当前组件 */



</style>

```

------

## Router

组成：

​	Router实例：路由实例，基于createRouter函数创建，维护了应用的路由信息。

​	<router-link>:路由链接组件，浏览器会解析成<a>。

​	<router-view>:动态视图组件，用来渲染展示与路由路径对应的组件。

![](../img/Vue路由.png)

```js
//router/index.js
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: '/',
    //   name: 'home',
    //   component: HomeView
    // },
    // {
    //   path: '/about',
    //   name: 'about',
    //   component: () => import('../views/AboutView.vue')
    // }
  ]
})

export default router

```

```vue
//index.vue
<!-- 首页菜单 -->
<router-link to="/index">
  <el-menu-item index="/index">
    <el-icon><Promotion /></el-icon> 首页
  </el-menu-item>
</router-link>
```

如果用el-menu组件则可以不用这种方式，直接启用vue-router模式通过index跳转。

### **1.实例**

```vue
        <!-- 左侧菜单栏 -->
<el-menu router="true">
  <!-- 首页菜单 -->
  <el-menu-item index="/index">
    <el-icon><Promotion /></el-icon> 首页
  </el-menu-item>
  
  <!-- 班级管理菜单 -->
  <el-sub-menu index="/manage">
    <template #title>
      <el-icon><School /></el-icon>班级学员管理
    </template>
    <el-menu-item index="/clazz">
      <el-icon><HomeFilled /></el-icon>班级管理
    </el-menu-item>
    <el-menu-item index="/stu">
      <el-icon><UserFilled /></el-icon>学员管理
    </el-menu-item>
  </el-sub-menu>
  
  <!-- 系统信息管理 -->
  <el-sub-menu index="/system">
    <template #title>
      <el-icon><Tools /></el-icon>系统信息管理
    </template>
    <el-menu-item index="/dept">
      <el-icon><HelpFilled /></el-icon>部门管理
    </el-menu-item>
    <el-menu-item index="/emp">
      <el-icon><Avatar /></el-icon>员工管理
    </el-menu-item>
  </el-sub-menu>

  <!-- 数据统计管理 -->
  <el-sub-menu index="/report">
    <template #title>
      <el-icon><Histogram /></el-icon>数据统计管理
    </template>
    <el-menu-item index="/empReport">
      <el-icon><InfoFilled /></el-icon>员工信息统计
    </el-menu-item>
    <el-menu-item index="/stuReport">
      <el-icon><Share /></el-icon>学员信息统计
    </el-menu-item>
    <el-menu-item index="/log">
      <el-icon><Document /></el-icon>日志信息统计
    </el-menu-item>
  </el-sub-menu>
</el-menu>
```

inde.js的路由配置路径

### **2.路由链接组件**

```js
import { createRouter, createWebHistory } from 'vue-router'

import IndexView from '@/views/index/index.vue'
import ClazzView from '@/views/clazz/index.vue'
import DeptView from '@/views/dept/index.vue'
import EmpView from '@/views/emp/index.vue'
import LayoutView from '@/views/layout/index.vue'
import LogView from '@/views/log/index.vue'
import EmpReportView from '@/views/report/emp/index.vue'
import StuReportView from '@/views/report/stu/index.vue'
import StuView from '@/views/stu/index.vue'
import LoginView from '@/views/login/index.vue'





const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {path: '/index',name: 'index',component: IndexView},
    {path: '/clazz',name: 'clazz',component: ClazzView},
    {path: '/dept',name: 'dept',component: DeptView},
    {path: '/emp',name: 'emp',component: EmpView},
    {path: '/layout',name: 'layout',component: LayoutView},
    {path: '/log',name: 'log',component: LogView},
    {path: '/empReport',name: 'empReport',component: EmpReportView},
    {path: '/stuReport',name: 'stuReport',component: StuReportView},
    {path: '/stu',name: 'stu',component: StuView},
    {path: '/login',name: 'login',component: LoginView}, 
  ]
})

export default router

```

### 3.动态视图组件

```vue
<el-main>
        <router-view></router-view>
</el-main>
```

------

### **嵌套路由**

```js
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {path: '/',
    name: '',
    component: LayoutView,
    redirect: '/index',
    children: [
    {path: '/index',name: 'index',component: IndexView},
    {path: '/clazz',name: 'clazz',component: ClazzView},
    {path: '/dept',name: 'dept',component: DeptView},
    {path: '/emp',name: 'emp',component: EmpView},
    {path: '/log',name: 'log',component: LogView},
    {path: '/empReport',name: 'empReport',component: EmpReportView},
    {path: '/stuReport',name: 'stuReport',component: StuReportView},
    {path: '/stu',name: 'stu',component: StuView},]
  },
    {path: '/login',name: 'login',component: LoginView}
]
  
})
```

**children**相当于一个数组，存储**子组件**，先判断/根组件，如果后面没有路径则会是**redirect重定向的路径**，如果为子组件的路径，则会路由在基础的**根路径**的组件中显示继续路由，如果为**/login**则不会在该**layout**路径中显示。

![](../img/嵌套路由.png)

------

## 程序优化

通过定义一个请求处理的工具类将请求的路径统一处理，根据定义的request.js。

```js
import axios from 'axios'

//创建axios实例对象
const request = axios.create({
  baseURL: 'hettp://localhost:8080',
  timeout: 600000
})

//axios的响应 response 拦截器
request.interceptors.response.use(
  (response) => { //成功回调
    return response.data
  },
  (error) => { //失败回调
    return Promise.reject(error)
  }
)

export default request
```

与服务端进行异步交互的逻辑，通常会封装到一个单独的api中，如：dept.js。

```js
import request from '@/utils/request';


//查询全部部门数据
export function queryAllApi() { return request.get('/depts'
)}
```

```vue
import {queryAllApi} from '@/api/dept'
//查询
const search = async () =>{
  const result = await queryAllApi();
  deptList.value = result.data;
}

const deptList = ref([])
```

### 反向代理服务器

![](../img/代理服务器.png)

```js
erver: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')//将api替换为空串
      }
    }
  }
```

------

## Watch侦听

作用：侦听一个或多个响应式数据源，并在数据源变化时调用传入的回调函数。

用法：

​	导入watch函数

​	执行watch函数，传入要侦听的响应式数据源（ref对象）和回调函数；

![](../img/watch侦听.png)

一旦a发生变化就执行后面的函数，newVal存储的新值，oldVal存入的旧值

深度侦听：在最后加,{deep:true}：是否侦听该对象所有属性的改变

立即侦听：immediate(boolean)：是否在侦听创建时立即触发回调函数

侦听单个属性：指定响应式对象其中一个属性的值

------

## 登录校验

![](../img/登录校验.png)

携带令牌范围跟服务端

![](../img/axios拦截器.png)


<script>
    new Vue({
        el:"#id",
        data:{
            url = "www.baidu.com"
            age :65
            addres:["1",“2”,“3”]
        },
    })
</script>



data:

1.v-bind 添加绑定属性

​	<a v-bind:href="url"></a>
​	<a :href="url"></a>

2.v-model 在表单元素上创建双向数据绑定

​	<input type = "text" v-model="url"></input>

条件渲染：

3.v-if /v-else-if / v-else 如果判定为true就渲染，否则不渲染

<span v-if = "age <= 35">young</span>
<span v-else-if = "age >= 35 && age <= 60">mid-old</span>
<span v-else >young</span>

4.v-show 如果判定不为true，仍会渲染，要设置css格式的display属性的值来设置是否显示

5.v-for 列表渲染，遍历容器的元素或者对象的属性

<div v-for = "addr in addres">({addr})</div>
<div v-for ="(addr,index) in addres" >
    ({index}),({addr})
</div>
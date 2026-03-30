const n=`## 简介\r
\r
### 工程化\r
\r
模块化：项目划分若干模块，单独开发、维护、提高效率\r
\r
组件化：将页面的各个组件部分封装为一个一个的组件，提高复用\r
\r
规范发：提供标准统一的目录结构、编码规范、开发流程\r
\r
自动化：项目的构建、开发、测试、打包、部署\r
\r
### create-vue\r
\r
官方提供的最新的脚手架工具，用于快速生成一个工程化的Vue项目\r
\r
**create-vue提供的功能如下：**\r
\r
​	统一的目录结构\r
\r
​	本地部署\r
\r
​	热部署\r
\r
​	单元测试\r
\r
​	集成打包上线\r
\r
**依赖环境**：NodeJS\r
\r
### NodeJS\r
\r
**1). 验证NodeJS的环境变量**\r
\r
NodeJS 安装完毕后，会自动配置好环境变量，我们验证一下是否安装成功，通过： \`node -v\`\r
\r
**2). 配置npm的全局安装路径**\r
\r
使用 **管理员身份** 运行命令行，在命令行中，执行如下指令：\r
\r
\`\`\`Java\r
npm config set prefix "D:\\develop\\NodeJS"\r
\`\`\`\r
\r
**注意：D:\\develop\\NodeJS 这个目录是NodeJS的安装目录 !!!!!**\r
\r
**注意：D:\\develop\\NodeJS 这个目录是NodeJS的安装目录 !!!!!**\r
\r
**注意：D:\\develop\\NodeJS 这个目录是NodeJS的安装目录 !!!!!**\r
\r
**3). 切换为淘宝镜像，加速下载：**\r
\r
\`\`\`Java\r
npm config set registry https://registry.npmmirror.com\r
\`\`\`\r
\r
------\r
\r
## Vue项目——创建\r
\r
@后面是版本号，没添加默认是最新的。\r
\r
![](../img/Vue创建.png)\r
\r
### 项目结构\r
\r
![](../img/Vue项目结构.png)\r
\r
启动\r
\r
![](../img/页面.png)\r
\r
![](../img/页面2.png)\r
\r
------\r
\r
## API风格\r
\r
### 选项式API\r
\r
可以用包含多个选项的对象来描述组件的逻辑，如：data，methods，mounted等。选项定义的属性都会暴露在函数内部的this上，它会指向当前的组件实例。\r
\r
![](../img/选项式API.png)\r
\r
### 组合式API\r
\r
是Vue3提供的一种基于函数的组件编写方式，通过使用函数来组织和复用组件的逻辑。它提供了一种更灵活，更可组合的方式来编写组件。\r
\r
在Vue中的组合式API使用时，是没有this对象的，this对象是undefined。\r
\r
![](../img/组合式API.png)\r
\r
\`\`\`vue\r
<script setup>//setup预处理操作，高偶素Vue需要进行一些处理，让我们更简洁的使用组合式API\r
//引入ref函数，接受一个内部值，返回一个响应式的ref对象，此对象只有一个指向内部值的属性value。\r
import {ref, onMounted} from 'vue';\r
\r
//定义一个响应式变量\r
const count = ref(0);\r
\r
//定义一个函数，用于增加count的值\r
function increment(){\r
    count.value++;\r
}\r
\r
//钩子函数，注册一个回调函数，在组件挂载完成后执行。\r
onMounted(()=>{\r
    console.log('组件挂载完成');\r
})\r
<\/script>\r
\r
<template>\r
    <button @click="increment">count:{{count}}</button>\r
</template>\r
\r
<style scoped>/* scoped表示样式只作用于当前组件 */\r
\r
\r
\r
</style>\r
\r
\`\`\`\r
\r
------\r
\r
## Router\r
\r
组成：\r
\r
​	Router实例：路由实例，基于createRouter函数创建，维护了应用的路由信息。\r
\r
​	<router-link>:路由链接组件，浏览器会解析成<a>。\r
\r
​	<router-view>:动态视图组件，用来渲染展示与路由路径对应的组件。\r
\r
![](../img/Vue路由.png)\r
\r
\`\`\`js\r
//router/index.js\r
import { createRouter, createWebHistory } from 'vue-router'\r
\r
const router = createRouter({\r
  history: createWebHistory(`/`),\r
  routes: [\r
    // {\r
    //   path: '/',\r
    //   name: 'home',\r
    //   component: HomeView\r
    // },\r
    // {\r
    //   path: '/about',\r
    //   name: 'about',\r
    //   component: () => import('../views/AboutView.vue')\r
    // }\r
  ]\r
})\r
\r
export default router\r
\r
\`\`\`\r
\r
\`\`\`vue\r
//index.vue\r
<!-- 首页菜单 -->\r
<router-link to="/index">\r
  <el-menu-item index="/index">\r
    <el-icon><Promotion /></el-icon> 首页\r
  </el-menu-item>\r
</router-link>\r
\`\`\`\r
\r
如果用el-menu组件则可以不用这种方式，直接启用vue-router模式通过index跳转。\r
\r
### **1.实例**\r
\r
\`\`\`vue\r
        <!-- 左侧菜单栏 -->\r
<el-menu router="true">\r
  <!-- 首页菜单 -->\r
  <el-menu-item index="/index">\r
    <el-icon><Promotion /></el-icon> 首页\r
  </el-menu-item>\r
  \r
  <!-- 班级管理菜单 -->\r
  <el-sub-menu index="/manage">\r
    <template #title>\r
      <el-icon><School /></el-icon>班级学员管理\r
    </template>\r
    <el-menu-item index="/clazz">\r
      <el-icon><HomeFilled /></el-icon>班级管理\r
    </el-menu-item>\r
    <el-menu-item index="/stu">\r
      <el-icon><UserFilled /></el-icon>学员管理\r
    </el-menu-item>\r
  </el-sub-menu>\r
  \r
  <!-- 系统信息管理 -->\r
  <el-sub-menu index="/system">\r
    <template #title>\r
      <el-icon><Tools /></el-icon>系统信息管理\r
    </template>\r
    <el-menu-item index="/dept">\r
      <el-icon><HelpFilled /></el-icon>部门管理\r
    </el-menu-item>\r
    <el-menu-item index="/emp">\r
      <el-icon><Avatar /></el-icon>员工管理\r
    </el-menu-item>\r
  </el-sub-menu>\r
\r
  <!-- 数据统计管理 -->\r
  <el-sub-menu index="/report">\r
    <template #title>\r
      <el-icon><Histogram /></el-icon>数据统计管理\r
    </template>\r
    <el-menu-item index="/empReport">\r
      <el-icon><InfoFilled /></el-icon>员工信息统计\r
    </el-menu-item>\r
    <el-menu-item index="/stuReport">\r
      <el-icon><Share /></el-icon>学员信息统计\r
    </el-menu-item>\r
    <el-menu-item index="/log">\r
      <el-icon><Document /></el-icon>日志信息统计\r
    </el-menu-item>\r
  </el-sub-menu>\r
</el-menu>\r
\`\`\`\r
\r
inde.js的路由配置路径\r
\r
### **2.路由链接组件**\r
\r
\`\`\`js\r
import { createRouter, createWebHistory } from 'vue-router'\r
\r
import IndexView from '@/views/index/index.vue'\r
import ClazzView from '@/views/clazz/index.vue'\r
import DeptView from '@/views/dept/index.vue'\r
import EmpView from '@/views/emp/index.vue'\r
import LayoutView from '@/views/layout/index.vue'\r
import LogView from '@/views/log/index.vue'\r
import EmpReportView from '@/views/report/emp/index.vue'\r
import StuReportView from '@/views/report/stu/index.vue'\r
import StuView from '@/views/stu/index.vue'\r
import LoginView from '@/views/login/index.vue'\r
\r
\r
\r
\r
\r
const router = createRouter({\r
  history: createWebHistory(`/`),\r
  routes: [\r
    {path: '/index',name: 'index',component: IndexView},\r
    {path: '/clazz',name: 'clazz',component: ClazzView},\r
    {path: '/dept',name: 'dept',component: DeptView},\r
    {path: '/emp',name: 'emp',component: EmpView},\r
    {path: '/layout',name: 'layout',component: LayoutView},\r
    {path: '/log',name: 'log',component: LogView},\r
    {path: '/empReport',name: 'empReport',component: EmpReportView},\r
    {path: '/stuReport',name: 'stuReport',component: StuReportView},\r
    {path: '/stu',name: 'stu',component: StuView},\r
    {path: '/login',name: 'login',component: LoginView}, \r
  ]\r
})\r
\r
export default router\r
\r
\`\`\`\r
\r
### 3.动态视图组件\r
\r
\`\`\`vue\r
<el-main>\r
        <router-view></router-view>\r
</el-main>\r
\`\`\`\r
\r
------\r
\r
### **嵌套路由**\r
\r
\`\`\`js\r
const router = createRouter({\r
  history: createWebHistory(`/`),\r
  routes: [\r
    {path: '/',\r
    name: '',\r
    component: LayoutView,\r
    redirect: '/index',\r
    children: [\r
    {path: '/index',name: 'index',component: IndexView},\r
    {path: '/clazz',name: 'clazz',component: ClazzView},\r
    {path: '/dept',name: 'dept',component: DeptView},\r
    {path: '/emp',name: 'emp',component: EmpView},\r
    {path: '/log',name: 'log',component: LogView},\r
    {path: '/empReport',name: 'empReport',component: EmpReportView},\r
    {path: '/stuReport',name: 'stuReport',component: StuReportView},\r
    {path: '/stu',name: 'stu',component: StuView},]\r
  },\r
    {path: '/login',name: 'login',component: LoginView}\r
]\r
  \r
})\r
\`\`\`\r
\r
**children**相当于一个数组，存储**子组件**，先判断/根组件，如果后面没有路径则会是**redirect重定向的路径**，如果为子组件的路径，则会路由在基础的**根路径**的组件中显示继续路由，如果为**/login**则不会在该**layout**路径中显示。\r
\r
![](../img/嵌套路由.png)\r
\r
------\r
\r
## 程序优化\r
\r
通过定义一个请求处理的工具类将请求的路径统一处理，根据定义的request.js。\r
\r
\`\`\`js\r
import axios from 'axios'\r
\r
//创建axios实例对象\r
const request = axios.create({\r
  baseURL: 'hettp://localhost:8080',\r
  timeout: 600000\r
})\r
\r
//axios的响应 response 拦截器\r
request.interceptors.response.use(\r
  (response) => { //成功回调\r
    return response.data\r
  },\r
  (error) => { //失败回调\r
    return Promise.reject(error)\r
  }\r
)\r
\r
export default request\r
\`\`\`\r
\r
与服务端进行异步交互的逻辑，通常会封装到一个单独的api中，如：dept.js。\r
\r
\`\`\`js\r
import request from '@/utils/request';\r
\r
\r
//查询全部部门数据\r
export function queryAllApi() { return request.get('/depts'\r
)}\r
\`\`\`\r
\r
\`\`\`vue\r
import {queryAllApi} from '@/api/dept'\r
//查询\r
const search = async () =>{\r
  const result = await queryAllApi();\r
  deptList.value = result.data;\r
}\r
\r
const deptList = ref([])\r
\`\`\`\r
\r
### 反向代理服务器\r
\r
![](../img/代理服务器.png)\r
\r
\`\`\`js\r
erver: {\r
    proxy: {\r
      '/api': {\r
        target: 'http://localhost:8080',\r
        changeOrigin: true,\r
        rewrite: (path) => path.replace(/^\\/api/, '')//将api替换为空串\r
      }\r
    }\r
  }\r
\`\`\`\r
\r
------\r
\r
## Watch侦听\r
\r
作用：侦听一个或多个响应式数据源，并在数据源变化时调用传入的回调函数。\r
\r
用法：\r
\r
​	导入watch函数\r
\r
​	执行watch函数，传入要侦听的响应式数据源（ref对象）和回调函数；\r
\r
![](../img/watch侦听.png)\r
\r
一旦a发生变化就执行后面的函数，newVal存储的新值，oldVal存入的旧值\r
\r
深度侦听：在最后加,{deep:true}：是否侦听该对象所有属性的改变\r
\r
立即侦听：immediate(boolean)：是否在侦听创建时立即触发回调函数\r
\r
侦听单个属性：指定响应式对象其中一个属性的值\r
\r
------\r
\r
## 登录校验\r
\r
![](../img/登录校验.png)\r
\r
携带令牌范围跟服务端\r
\r
![](../img/axios拦截器.png)\r
\r
\r
<script>\r
    new Vue({\r
        el:"#id",\r
        data:{\r
            url = "www.baidu.com"\r
            age :65\r
            addres:["1",“2”,“3”]\r
        },\r
    })\r
<\/script>\r
\r
\r
\r
data:\r
\r
1.v-bind 添加绑定属性\r
\r
​	<a v-bind:href="url"></a>\r
​	<a :href="url"></a>\r
\r
2.v-model 在表单元素上创建双向数据绑定\r
\r
​	<input type = "text" v-model="url"></input>\r
\r
条件渲染：\r
\r
3.v-if /v-else-if / v-else 如果判定为true就渲染，否则不渲染\r
\r
<span v-if = "age <= 35">young</span>\r
<span v-else-if = "age >= 35 && age <= 60">mid-old</span>\r
<span v-else >young</span>\r
\r
4.v-show 如果判定不为true，仍会渲染，要设置css格式的display属性的值来设置是否显示\r
\r
5.v-for 列表渲染，遍历容器的元素或者对象的属性\r
\r
<div v-for = "addr in addres">({addr})</div>\r
<div v-for ="(addr,index) in addres" >\r
    ({index}),({addr})\r
</div>`;export{n as default};

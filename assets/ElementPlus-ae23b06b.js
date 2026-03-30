const n=`官网：https://element-plus.org/zh-CN/\r
\r
准备工作：\r
\r
1.创建vue项目\r
\r
2.安装element plus组件库：npm install elemenet-plus@2.4.4 --save\r
\r
3.main.js中引入element plus组件库（官方文档）\r
\r
\`\`\`vue\r
main.js//引入ElementPlus\r
import ElementPlus from 'element-plus'\r
import 'element-plus/ist/index.css'\r
\r
createApp(App).use(ElementPlus).mount('#app')\r
\`\`\`\r
\r
\`\`\`vue\r
main.js//引用中文语言包\r
import zhCn from 'element-plus/es/locale/lang/zh-cn'\r
\r
createApp(App).use(ElementPlus,{ locale: zhCn}).mount('#app')\r
\r
\r
\r
\`\`\`\r
\r
### 表单校验\r
\r
![](./img/Element表单校验.png)
`;export{n as default};

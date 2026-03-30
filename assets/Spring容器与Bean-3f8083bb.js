const n=`# Spring 容器与 Bean（整理版）

## IoC / DI（一句话）

- IoC：把对象创建与管理交给容器
- DI：容器把依赖注入到对象里

## BeanDefinition 与 BeanFactory

### BeanDefinition

Bean 的“说明书”（元信息），描述：

- 类型
- 作用域（singleton/prototype）
- 依赖关系
- 初始化/销毁回调

### DefaultListableBeanFactory（常用实现）

内部常见结构（速记）：

- \`beanDefinitionMap\`：保存所有 BeanDefinition
- 单例缓存：
  - \`singletonObjects\`：完全初始化的单例
  - \`earlySingletonObjects\`：早期单例（解决循环依赖）
  - \`singletonFactories\`：单例工厂（AOP 代理等场景）

## 运行时动态注册与删除（提示）

动态注册：把 BeanDefinition 注册进容器。

动态删除：Spring 不允许删除已创建的单例对象，但可以删除 BeanDefinition，使其不再能被获取与注入。

\`\`\`java
public void removeBean(String beanName) {
  DefaultListableBeanFactory beanFactory =
    (DefaultListableBeanFactory) context.getAutowireCapableBeanFactory();
  if (beanFactory.containsBeanDefinition(beanName)) {
    beanFactory.removeBeanDefinition(beanName);
  }
}
\`\`\`

## ApplicationContext（更高级容器）

在 BeanFactory 基础上提供：

- 国际化
- 事件机制
- 资源加载
- 自动装配与更多扩展点

## 扩展点（常用）

- BeanPostProcessor：Bean 实例级增强（AOP、注解处理等）
- BeanFactoryPostProcessor：BeanDefinition 级增强（影响实例化前的定义）

`;export{n as default};

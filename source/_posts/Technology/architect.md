---
title: 互联网大厂面试题
date: '2023/04/11 08:00:00'
excerpt: >-
  互联网大厂面试题 
alias:
  - post/Technology/Architect/index.html 
---



# 什么是Spring框架

轻量级javaee 框架
主要解决企业应用中的复杂问题
loc  aop  数据访问/集成层
ioc 提供了一种横向关注点的处理：比如 事物管理  安全检查  缓存等
数据访问层 提供了不同数据库持久化技术的实现，比如jdbc  orm nosql
模块： 
数据集成  ： jdbc orm oxm jms 事物
web ： websocket servlet  web  portiet
aop  aspect ..
Beans Core  Content  Spel
生态  基石

# spring有哪些优点？
轻量级：Spring在大小和透明性方面绝对属于轻量级的，基础版本的Spring框架大約只有2MB。
控制反转（IOC）：Spring使用控制反转技术实现了松耦合。依赖被注入到对象，而不是创建或寻找依赖对象。
面向切面编程（AOP）：Spring支持面向切面编程，同时把应用的业务逻辑与系统的服务分离开来。
容器：Spring包含并管理应用程序对象的配置及生命周期。
MVC框架：Spring的web框架是一个设计优良的web MVC框架，很好的取代了一些web框架。
事务管理：Spring对下至本地业务上至全局业务（JAT）j提供了统一的事务管理接口。
异常处理：Spring提供一个方便的AP\将特定技术的异常（由）DBC, Hibernate，或DO抛出）化为一致的、
Unchecked异常。
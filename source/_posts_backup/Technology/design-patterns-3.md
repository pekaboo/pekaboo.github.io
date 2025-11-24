---
title: 工厂模式和策略模式区别
date: '2023/04/11 08:00:00'
excerpt: >-
  互联网大厂面试题  
---
我为你解释策略模式和工厂模式的区别。  
这两种模式虽然都用于处理对象创建和使用,但它们的目的和应用场景是不同的。  
策略模式和工厂模式的区别:  
工厂模式:  
工厂模式是一种创建型设计模式,它提供了一种创建对象的方式,而无需指定具体的类。  
工厂模式通常用于创建对象,而不需要关心对象的具体实现。  
工厂模式可以分为简单工厂模式、工厂方法模式和抽象工厂模式。  
工厂模式的主要优点是提高了代码的灵活性和可扩展性,缺点是增加了类的数量。  
策略模式:  
策略模式是一种行为型设计模式,它允许在运行时选择不同的算法或行为。  
策略模式通常用于在运行时动态地选择不同的行为。  
策略模式可以分为策略接口、具体策略和上下文。  
策略模式的主要优点是提高了代码的灵活性和可扩展性,缺点是增加了类的数量。  
让我们用一个简单的例子来说明这两种模式的区别:  
假设我们有一个计算器应用,需要支持不同的运算操作。  
工厂模式的实现:  

```
// 运算接口
public interface Operation {
    double calculate(double num1, double num2);
}

// 具体运算类
public class Addition implements Operation {
    public double calculate(double num1, double num2) {
        return num1 + num2;
    }
}

public class Subtraction implements Operation {
    public double calculate(double num1, double num2) {
        return num1 - num2;
    }
}

// 工厂类
public class OperationFactory {
    public static Operation getOperation(String operationType) {
        if ("add".equals(operationType)) {
            return new Addition();
        } else if ("subtract".equals(operationType)) {
            return new Subtraction();
        }
        return null;
    }
}

// 使用
Operation operation = OperationFactory.getOperation("add");
double result = operation.calculate(5, 3);
```

策略模式的实现:

```
// 策略接口
public interface CalculateStrategy {
    double calculate(double num1, double num2);
}

// 具体策略类
public class AdditionStrategy implements CalculateStrategy {
    public double calculate(double num1, double num2) {
        return num1 + num2;
    }
}

public class SubtractionStrategy implements CalculateStrategy {
    public double calculate(double num1, double num2) {
        return num1 - num2;
    }
}

// 上下文类
public class Calculator {
    private CalculateStrategy strategy;

    public void setStrategy(CalculateStrategy strategy) {
        this.strategy = strategy;
    }

    public double executeStrategy(double num1, double num2) {
        return strategy.calculate(num1, num2);
    }
}

// 使用
Calculator calculator = new Calculator();
calculator.setStrategy(new AdditionStrategy());
double result = calculator.executeStrategy(5, 3);
```

主要区别:
工厂模式关注于对象的创建,而策略模式关注于算法的封装和选择。  
2. 工厂模式通常在创建对象时就决定了使用哪个具体类,而策略模式允许在运行时动态切换不同的策略。  
工厂模式的客户端代码通常只需要知道工厂类和产品接口,而策略模式的客户端需要知道所有的具体策略类。  
这两种模式都有其适用的场景,选择使用哪种模式取决于你的具体需求  
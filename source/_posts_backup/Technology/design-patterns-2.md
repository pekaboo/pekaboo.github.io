---
title: 计算器场景中用到了哪些设计模式
date: '2023/04/11 08:00:00'
excerpt: >-
  互联网大厂面试题 
alias:
  - post/Technology/design-patterns/index.html 
---

# 单例模式
通过**静态属性**来实现每次 getInstance 返回同一个计算器实例
```
public class Calculator {
    private static Calculator instance;
    
    private Calculator() {}
    
    public static Calculator getInstance() {
        if (instance == null) {
            instance = new Calculator();
        }
        return instance;
    }
    
    public double calculate(double num1, double num2, String operation) {
        // 计算逻辑
    }
}

// 使用
Calculator calc = Calculator.getInstance();
double result = calc.calculate(5, 3, "add");
```
# 工厂模式:
通过 **interface** ，工厂里面创建具体的实例(根据 code )
 
```
public interface Operation {
    double calculate(double num1, double num2);
} 
public class Addition implements Operation {
    public double calculate(double num1, double num2) {
        return num1 + num2;
    }
}

public class OperationFactory {
    public static Operation getOperation(String type) {
        if ("add".equals(type)) {
            return new Addition();
        }
        // 其他操作...
        return null;
    }
}

// 使用
Operation op = OperationFactory.getOperation("add");
double result = op.calculate(5, 3);
```

# 策略模式的实现:
通过 **interface** ，传入策略实例
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


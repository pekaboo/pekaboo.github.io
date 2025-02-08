---
title: spring中用到了哪些设计模式
date: '2023/04/11 08:00:00'
excerpt: >-
  互联网大厂面试题 
alias:
  - post/Technology/design-patterns/index.html 
---
 
# spring中用到了哪些设计模式
1.单例模式：spring中的bean默认是单例的，通过singleton属性来控制
场景:假设我们有一个学校类,我们希望整个应用中只有一个学校实例。
```
@Component
public class School {
    private String name = "快乐小学";
    
    public String getName() {
        return name;
    }
}

// 使用:
@Autowired
private School school;
```
2.工厂模式：spring中的bean是通过工厂模式来创建的，通过bean的id来获取bean，如果id相同，则返回同一个bean
场景:我们有不同类型的学生(小学生、中学生),我们想根据类型创建学生。
工厂类通过 ApplicationContext getBean 获取到学生实例
```
public interface Student {
    void study();
}

public class PrimaryStudent implements Student {
    public void study() {
        System.out.println("小学生在学习");
    }
}

public class MiddleStudent implements Student {
    public void study() {
        System.out.println("中学生在学习");
    }
}

@Component
public class StudentFactory {
    @Autowired
    private ApplicationContext context;
    
    public Student getStudent(String type) {
        if ("primary".equals(type)) {
            return context.getBean(PrimaryStudent.class);
        } else if ("middle".equals(type)) {
            return context.getBean(MiddleStudent.class);
        }
        return null;
    }
}
```
3.代理模式：spring中的aop是通过代理模式来实现的，通过jdk动态代理或cglib代理来实现
场景:我们想在学生学习前后记录日志。
```
@Aspect
@Component
public class StudentProxy {
    @Around("execution(* com.example.Student.study())")
    public void aroundStudy(ProceedingJoinPoint joinPoint) throws Throwable {
        System.out.println("开始学习");
        joinPoint.proceed();
        System.out.println("结束学习");
    }
}
```
4.适配器模式：spring中的适配器模式主要用于将spring的api适配为其他框架的api
场景:我们有一个旧的成绩系统,我们想让它适配新的学生管理系统。 
```
public interface NewGradeSystem {
    void recordGrade(String studentName, int grade);
}

public class OldGradeSystem {
    public void saveScore(String name, double score) {
        System.out.println("旧系统保存成绩: " + name + " - " + score);
    }
}

@Component
public class GradeSystemAdapter implements NewGradeSystem {
    private OldGradeSystem oldSystem = new OldGradeSystem();
    
    public void recordGrade(String studentName, int grade) {
        oldSystem.saveScore(studentName, grade);
    }
}
```

5.装饰器模式：spring中的装饰器模式主要用于在运行时动态地向对象添加行为
场景:我们想给学生添加额外的技能,比如唱歌。
```
public interface Student {
    void study();
}

@Component
public class NormalStudent implements Student {
    public void study() {
        System.out.println("学习基础知识");
    }
}

@Component
public class SingingStudent implements Student {
    @Autowired
    private Student student;
    
    public void study() {
        student.study();
        System.out.println("学习唱歌");
    }
}
```    
6.观察者模式：spring中的观察者模式主要用于事件驱动模型，通过ApplicationListener接口来实现
场景:当新学生加入学校时,我们想通知所有的老师。
通过继承 ApplicationEvent 类来创建事件，通过 ApplicationListener 接口来监听事件。
``` 
// 定义事件
public class NewStudentEvent extends ApplicationEvent {
    private String studentName;
    
    public NewStudentEvent(Object source, String studentName) {
        super(source);
        this.studentName = studentName;
    }
    
    public String getStudentName() {
        return studentName;
    }
}
// 定义事件监听器
@Component
public class TeacherListener implements ApplicationListener<NewStudentEvent> {
    @Override
    public void onApplicationEvent(NewStudentEvent event) {
        System.out.println("老师收到通知: 新学生 " + event.getStudentName() + " 加入了学校");
    }
}
// 发布事件
@Autowired
private ApplicationEventPublisher publisher;

public void addNewStudent(String name) {
    // 添加学生的逻辑
    publisher.publishEvent(new NewStudentEvent(this, name));
}
```
7.策略模式：spring中的策略模式主要用于在运行时选择不同的算法或行为
场景:我们有不同的考试评分策略(比如按百分比或按等级)。
``` 
public interface GradingStrategy {
    String grade(int score);
}

@Component
public class PercentageStrategy implements GradingStrategy {
    public String grade(int score) {
        return score + "%";
    }
}

@Component
public class LetterGradeStrategy implements GradingStrategy {
    public String grade(int score) {
        if (score >= 90) return "A";
        else if (score >= 80) return "B";
        else if (score >= 70) return "C";
        else return "D";
    }
}

@Component
public class GradingService {
    @Autowired
    private Map<String, GradingStrategy> strategies;
    
    public String gradeExam(int score, String strategyName) {
        GradingStrategy strategy = strategies.get(strategyName);
        return strategy.grade(score);
    }
}
```
策略模式 工厂模式 区别： 
工厂模式：
1. 工厂模式是一种创建型设计模式，它提供了一种创建对象的方式，而无需指定具体的类。
2. 工厂模式通常用于创建对象，而不需要关心对象的具体实现。
3. 工厂模式可以分为简单工厂模式、工厂方法模式和抽象工厂模式。
4. 工厂模式的主要优点是提高了代码的灵活性和可扩展性，缺点是增加了类的数量。

策略模式：
1. 策略模式是一种行为型设计模式，它允许在运行时选择不同的算法或行为。
2. 策略模式通常用于在运行时动态地选择不同的行为。
3. 策略模式可以分为策略接口、具体策略和上下文。
4. 策略模式的主要优点是提高了代码的灵活性和可扩展性，缺点是增加了类的数量。  

8.模板方法模式：spring中的模板方法模式主要用于在运行时动态地向对象添加行为 （通过虚基类，定义一个模板流程，子类继承后，可以重写模板中的虚方法）
场景:我们有一个通用的考试流程,但不同科目可能有特殊的准备或收尾工作。
```
public abstract class ExamTemplate {
    public final void conductExam() {
        prepareExam();
        distributeQuestions();
        collectAnswers();
        gradeExam();
        publishResults();
    }
    
    protected abstract void prepareExam();
    
    private void distributeQuestions() {
        System.out.println("分发试卷");
    }
    
    private void collectAnswers() {
        System.out.println("收集答卷");
    }
    
    protected abstract void gradeExam();
    
    private void publishResults() {
        System.out.println("公布成绩");
    }
}

@Component
public class MathExam extends ExamTemplate {
    protected void prepareExam() {
        System.out.println("准备数学考试");
    }
    
    protected void gradeExam() {
        System.out.println("批改数学试卷");
    }
}
```
9.工厂方法模式：spring中的工厂方法模式主要用于在运行时动态地向对象添加行为
场景:我们想创建不同类型的课程,但具体创建过程由子类决定。
```
public abstract class CourseFactory {
    public final Course createCourse() {
        Course course = createSpecificCourse();
        course.setSchedule();
        course.assignTeacher();
        return course;
    }
    
    protected abstract Course createSpecificCourse();
}

@Component
public class MathCourseFactory extends CourseFactory {
    protected Course createSpecificCourse() {
        return new MathCourse();
    }
}

@Component
public class EnglishCourseFactory extends CourseFactory {
    protected Course createSpecificCourse() {
        return new EnglishCourse();
    }
}
```
10. 原型模式：
    场景:我们想快速复制一个学生对象,包括他的所有信息。
```
@Component
@Scope("prototype")
public class Student implements Cloneable {
    private String name;
    private int age;

    // 构造函数、getter和setter省略

    @Override
    public Student clone() {
        try {
            return (Student) super.clone();
        } catch (CloneNotSupportedException e) {
            return new Student(this.name, this.age);
        }
    }
}

// 使用:
@Autowired
private ApplicationContext context;

public Student copyStudent(Student original) {
    Student copy = context.getBean(Student.class);
    copy.setName(original.getName());
    copy.setAge(original.getAge());
    return copy;
}
```
11. 组合模式: 
场景:我们想表示学校的组织结构,包括学校、年级和班级。
```
public interface SchoolComponent {
    void display();
}

public class School implements SchoolComponent {
    private List<SchoolComponent> components = new ArrayList<>();

    public void addComponent(SchoolComponent component) {
        components.add(component);
    }

    public void display() {
        System.out.println("学校");
        for (SchoolComponent component : components) {
            component.display();
        }
    }
}

public class Grade implements SchoolComponent {
    private String name;
    private List<SchoolComponent> classes = new ArrayList<>();

    // 构造函数省略

    public void addClass(SchoolComponent clazz) {
        classes.add(clazz);
    }

    public void display() {
        System.out.println("年级: " + name);
        for (SchoolComponent clazz : classes) {
            clazz.display();
        }
    }
}

public class Class implements SchoolComponent {
    private String name;

    // 构造函数省略

    public void display() {
        System.out.println("班级: " + name);
    }
}
```
12 责任链模式:
场景:我们想处理学生的请假申请,不同级别的请假需要不同级别的老师批准。
```
public abstract class LeaveHandler {
    protected LeaveHandler nextHandler;

    public void setNextHandler(LeaveHandler nextHandler) {
        this.nextHandler = nextHandler;
    }

    public abstract void handleRequest(int leaveDays);
}

@Component
public class ClassTeacher extends LeaveHandler {
    public void handleRequest(int leaveDays) {
        if (leaveDays <= 2) {
            System.out.println("班主任批准了" + leaveDays + "天的请假");
        } else if (nextHandler != null) {
            nextHandler.handleRequest(leaveDays);
        }
    }
}

@Component
public class GradeLeader extends LeaveHandler {
    public void handleRequest(int leaveDays) {
        if (leaveDays <= 5) {
            System.out.println("年级主任批准了" + leaveDays + "天的请假");
        } else if (nextHandler != null) {
            nextHandler.handleRequest(leaveDays);
        }
    }
}

@Component
public class Principal extends LeaveHandler {
    public void handleRequest(int leaveDays) {
        if (leaveDays <= 10) {
            System.out.println("校长批准了" + leaveDays + "天的请假");
        } else {
            System.out.println("请假天数太多,不予批准");
        }
    }
}

// 使用:
@Configuration
public class LeaveHandlerConfig {
    @Bean
    public LeaveHandler leaveHandler(ClassTeacher classTeacher, GradeLeader gradeLeader, Principal principal) {
        classTeacher.setNextHandler(gradeLeader);
        gradeLeader.setNextHandler(principal);
        return classTeacher;
    }
}
``` 
13.  享元模式：
场景:我们想创建大量相似的对象,但希望节省内存。在学校的场景中,我们可以用这个模式来管理不同颜色的圆形徽章。
```
public interface Shape {
    void draw();
}

public class Circle implements Shape {
    private String color;

    public Circle(String color) {
        this.color = color;
    }

    public void draw() {
        System.out.println("画了一个" + color + "的圆形徽章");
    }
}

@Component
public class ShapeFactory {
    private static final Map<String, Shape> circleMap = new HashMap<>();

    public static Shape getCircle(String color) {
        Circle circle = (Circle) circleMap.get(color);
        if (circle == null) {
            circle = new Circle(color);
            circleMap.put(color, circle);
            System.out.println("创建了一个" + color + "的圆形徽章");
        }
        return circle;
    }
}

// 使用:
@Autowired
private ShapeFactory shapeFactory;

public void drawBadges() {
    String[] colors = {"红", "蓝", "绿", "黄", "紫"};
    for (int i = 0; i < 20; i++) {
        String color = colors[i % colors.length];
        Shape circle = shapeFactory.getCircle(color);
        circle.draw();
    }
}
```
 
在这个例子中:
1. Shape 是一个接口,定义了徽章的绘制方法。
Circle 类实现了 Shape 接口,代表一个特定颜色的圆形徽章。
ShapeFactory 是一个享元工厂,它维护了一个 Map,用于存储已创建的圆形徽章对象。
当我们需要一个特定颜色的圆形徽章时,工厂首先检查是否已经创建过这种颜色的徽章。如果已经创建过,就直接返回已有的对象;如果没有,才创建一个新的对象并存储起来。
5. 在使用时,即使我们需要画20个徽章,实际上只会创建5个不同颜色的 Circle 对象,大大节省了内存使用。
享元模式的核心思想是共享细粒度对象,从而有效地支持大量细粒度对象的复用。这在Spring框架中特别有用,因为Spring经常需要管理大量的对象。通过使用享元模式,Spring可以更有效地管理这些对象,减少内存使用,提高应用程序的性能。
记住,享元模式主要用于当需要创建大量相似对象时。如果你的应用不需要创建大量对象,或者对象之间差异很大,那么使用享元模式可能并不合适。如果你有任何疑问,随时问我哦!


14 策略模式 工厂模式 区别：
好的,让我为你解释策略模式和工厂模式的区别。这两种模式虽然都用于处理对象创建和使用,但它们的目的和应用场景是不同的。
策略模式和工厂模式的区别:
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
 
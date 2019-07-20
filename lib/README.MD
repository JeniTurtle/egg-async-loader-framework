## 框架介绍

------

### 功能说明：
对egg生命周期中的configWillLoad方法做了同步处理，支持异步获取远程配置文件之后，动态修改配置文件，然后再继续执行configDidLoad，并且在configDidLoad之前会加载所有插件addSingleton的creator方法。

如果有的插件没使用addSingleton方法创建实例，需要在获取配置文件之后，手动调用。


### 注意事项：
注意：egg框架的loader设定 willReady、didReady、serverDidReady这几个生命周期，强制在同步之前执行，所以willReady不会等待前面的生命周期执行完，而是在configWillLoader执行同步操作的同时去执行，这时同步操作并没有执行完，而且插件也没有开始加载，所以这里导致生命周期跟egg框架有出入，但是没得办法。。。核心代码无法被重写，这里只能强行获取Symbol私有属性，去覆盖之前的逻辑。


### 使用方法

#### 一、安装

```
npm install egg-async-loader-framework
```

#### 二、引用

修改引用项目的package.json文件，在文件中加入：

```
...
"egg": {
    ...
    "framework": "egg-async-loader-framework"
  },
...
```
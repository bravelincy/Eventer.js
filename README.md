# Javascript事件订阅发布系统
![logo](https://cloud.githubusercontent.com/assets/11400674/18985210/745bb1fe-8729-11e6-899e-fb56113891e1.png)
> 这是一个基于观察者模式实现的可以订阅、取消订阅和发布事件的系统。

## 基本用法

订阅一个事件
``` javascript
function onLogin(event) {
    var user = event.data;
    // do something
}

Eventer.on('login', onLogin);
```

发布一个事件
``` javascript
Eventer.fire('login', {
    username: 'joenil'
});
```

取消订阅一个事件
``` javascript
Eventer.off('login', onLogin);
```

订阅一次性有效的事件
``` javascript
Eventer.one('login', function() {
    // do something
});
```

取消订阅所有事件
``` javascript
Eventer.offAll();
```

发布所有事件
``` javascript
Eventer.fireAll({
    data: []
});
```

## 高级用法

传入一个事件列表对象
``` javascript
Eventer.on({
    ready: function() {
        // do something
    },
    login: function() {
        // do something
    }
});
```

订阅多个事件使用同一个事件处理程序
``` javascript
Eventer.on('ready login', function(event) {
    console.log(event.type);
});
```

可以将上述两种方式结合
``` javascript
Eventer.on({
    'ready login': function() {
        // do something
    },
    'mouseover mouseenter': function() {
        // do something
    }
});
```

取消订阅和发布事件也可以这么用
``` javascript
// subscribe a group listenrs
Eventer.off('ready login', foo);

Eventer.off({
    ready: foo,
    login: bar
});

// fire a group listeners
Eventer.fire('ready login', {
    username: 'joenil'
});

Eventer.fire({
    login: {
        username: 'joenil'
    },
    ready: {
        data: []
    }
});
```

## 事件实例
使用Eventer静态方法操作的事件数据都是共享的，有时候需要将事件独立出来，可以使用生成实例的方式
``` javascript
var myEventer = new Eventer();
myEventer.on('login', function() {
    // do something
});

var otherEventer = new Eventer({
    login: function() {
        // do something
    }
});

// only fire their own listener
myEventer.fire('login');
otherEventer.fire('login');
```

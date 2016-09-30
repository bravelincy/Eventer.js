# Javascript事件系统
> 这是一个基于观察者模式实现的可以订阅、取消订阅和发布事件的系统。

## 基本用法

订阅一个事件
``` javascript
function onLogin(event) {
    var user = event.data;
    // do someting
}

Observer.on('login', onLogin);
```

发布一个事件
``` javascript
Observer.fire('login', {
    username: 'joenil'
});
```

取消订阅一个事件
``` javascript
Observer.off('login', onLogin);
```

订阅一次性有效的事件
``` javascript
Observer.one('login', function() {
    // do something
});
```

## 高级用法

传入一个事件列表对象
``` javascript
Observer.on({
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
Observer.on('ready login', function(event) {
    console.log(event.type);
});
```

可以将上述两种方式结合
``` javascript
Observer.on({
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
Observer.off('ready login', foo);

Observer.off({
    ready: foo,
    login: bar
});

// fire a group listeners
Observer.fire('ready login', {
    username: 'joenil'
});

Observer.fire({
    login: {
        username: 'joenil'
    },
    ready: {
        data: []
    }
});
```

## 事件实例
使用Observer静态方法操作的事件数据都是共享的，有时候需要将事件独立出来，可以使用生成实例的方式
``` javascript
var myObserver = new Observer();
myObserver.on('login', function() {
    // do something
});

var otherObserver = new Observer({
    login: function() {
        // do something
    }
});

// only fire their own listener
myObserver.fire('login');
otherObserver.fire('login');
```
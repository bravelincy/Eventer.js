;(function(window) {
    'use strict';

    var isArray = Array.isArray,

        isObject = function(value) {
            return value !== null && typeof value === 'object';
        },

        each = function(obj, iterator) {
            for (var key in obj) {
                iterator(key, obj[key]);
            }
        },

        slice = function(arrayLike) {
            return [].slice.call(arrayLike);
        };

    var commonAPI = {
        on: function(evtName, handler, isOnce) {
            var handlers = this._listeners[evtName],
                that = this,
                isAlreadyOn = false,
                handlerItem = {
                    handler: handler,
                    isOnce: !!isOnce
                };

            if (handlers) {
                isAlreadyOn = handlers.some(function(item) {
                    return item.handler === handlerItem.handle;
                });

                !isAlreadyOn && handlers.push(handlerItem);
            } else{
                this._listeners[evtName] = [handlerItem];
            }
        },

        one: function(evtName, handler) {
            var args = slice(arguments);
            args.push(true);
            this.on.apply(this, args);
        },

        off: function(evtName, handler) {
            var handlers = this._listeners[evtName],
                that = this,
                index;

            if (!handlers) return;
            if (handler) {
                index = handlers.findIndex(function(item) {
                    return item.handler === handler;
                });

                if (index > -1) {
                    handlers.splice(index, 1);
                    handlers.length === 0 && deleteListener();
                }
            } else {
                deleteListener();
            }

            function deleteListener() {
                delete that._listeners[evtName];
            }
        },

        fire: function(evtName, data) {
            var handlers = this._listeners[evtName],
                that = this;

            if (handlers) {
                handlers.forEach(function(item) {
                    item.handler.call(this, {
                        type: evtName,
                        data: data
                    });

                    if (item.isOnce) {
                        that.off(evtName, item.handler);
                    }
                });
            }
        }
    };

    function Observer() {
        this._listeners = {};

        if (arguments.length) {
            this.on.apply(this, arguments);
        }
    }

    Observer.prototype = {};
    each(commonAPI, function(apiName, fn) {
        Observer.prototype[apiName] = function(names, handlerOrData) {
            var args = slice(arguments),
                that = this,
                paramsMap;

            if (isObject(names)) {
                paramsMap = names;
                each(paramsMap, function(key, value) {
                    names = key;
                    handlerOrData = value;
                    splitNames(args.slice(1));
                });
            } else {
                splitNames(args.slice(2));
            }

            function splitNames(extraArgs) {
                names.split(' ').forEach(function(evtName) {
                    var applyArgs = [evtName, handlerOrData];
                    fn.apply(that, applyArgs.concat(extraArgs));
                });
            }
        };
    })

    // for static usage
    Observer._listeners = {};
    each(Observer.prototype, function(apiName, fn) {
        Observer[apiName] = fn;
    });

    window.Observer = Observer;
})(window);
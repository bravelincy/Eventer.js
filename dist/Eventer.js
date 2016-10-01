/**
 * @author joenillam@gmail.com
 */

(function (window) {
    'use strict';

    var isArray = Array.isArray;

    function isObject(value) {
        return value !== null && typeof value === 'object';
    }

    function isString(value) {
        return typeof value === 'string';
    }

    function isFunction(value) {
        return typeof value === 'function';
    }

    function createMap() {
        return Object.create(null);
    }

    function each(obj, iterator) {
        for (var key in obj) {
            isFunction(iterator) && iterator(key, obj[key]);
        }
    }

    function slice(arrayLike, index) {
        return [].slice.call(arrayLike, index);
    }

    var rawAPI = {
        on: function on(evtName, handler, isOnce) {
            var handlers = this._listeners[evtName],
                isAlreadyOn = false,
                handlerItem = {
                    handler: handler,
                    isOnce: !!isOnce
                };

            if (handlers) {
                isAlreadyOn = handlers.some(
                    function (item) { return item.handler === handlerItem.handler; }
                );
                !isAlreadyOn && handlers.push(handlerItem);
            } else {
                this._listeners[evtName] = [handlerItem];
            }
        },

        one: function one() {
            var args = slice(arguments);
            args.push(true);
            this.on.apply(this, args);
        },

        off: function off(evtName, handler) {
            var this$1 = this;

            var index,
                handlers = this._listeners[evtName],
                deleteListener = function () {
                    delete this$1._listeners[evtName];
                };

            if (handler && isArray(handlers)) {
                index = handlers.findIndex(
                    function (item) { return item.handler === handler; }
                );

                if (index > -1) {
                    handlers.splice(index, 1);
                    handlers.length === 0 && deleteListener();
                }
            } else {
                deleteListener();
            }
        },

        fire: function fire(evtName, data) {
            var this$1 = this;

            var handlers = this._listeners[evtName];

            if (handlers) {
                handlers.forEach(function (item) {
                    var $event = {
                        type: evtName,
                        data: data
                    };

                    isFunction(item.handler) && item.handler.call(this$1, $event);

                    if (item.isOnce) {
                        this$1.off(evtName, item.handler);
                    }
                });
            }
        }
    };

    function Eventer() {
        this._listeners = createMap();
        if (arguments.length) {
            this.on.apply(this, arguments);
        }
    }

    Eventer.prototype = {
        offAll: function offAll() {
            this._listeners = createMap();
        },

        fireAll: function fireAll(data) {
            var this$1 = this;

            each(this._listeners, function (evtName) {
                this$1.fire(evtName, data);
            });
        }
    };

    // more sugary
    each(rawAPI, function (apiName, fn) {
        Eventer.prototype[apiName] = function(names) {
            var this$1 = this;

            var evtsMap,
                extraArgs = slice(arguments, 1),
                splitNames = function (extraArgs) {
                    names.split(' ').forEach(function (evtName) {
                        var applyArgs = [evtName].concat(extraArgs);
                        fn.apply(this$1, applyArgs);
                    });
                };

            if (isObject(names)) {
                evtsMap = names;
                each(evtsMap, function (key, value) {
                    names = key;
                    splitNames([value].concat(extraArgs));
                });
            } else if (isString(names)) {
                splitNames(extraArgs);
            }
        };
    });

    // for static usage
    Eventer._listeners = createMap();
    each(Eventer.prototype, function (apiName, fn) {
        Eventer[apiName] = fn;
    });

    window.Eventer = Eventer;

}(window));

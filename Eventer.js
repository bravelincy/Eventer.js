;(function(window) {
    'use strict';

    var isArray = Array.isArray,

        isObject = function(value) {
            return value !== null && typeof value === 'object';
        },

        isString = function(value) {
            return typeof value === 'string';
        },

        isFunction = function(value) {
            return typeof value === 'function';
        },

        createMap = function() {
            return Object.create(null);
        },

        each = function(obj, iterator, context) {
            for (var key in obj) {
                iterator.call(context, key, obj[key]);
            }
        },

        slice = function(arrayLike, index) {
            return [].slice.call(arrayLike, index);
        };

    var rawAPI = {
        on: function(evtName, handler, isOnce) {
            var handlers = this._listeners[evtName],
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
            } else {
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

            if (handler && isArray(handlers)) {
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
                    var $event = {
                        type: evtName,
                        data: data
                    };

                    isFunction(item.handler) && item.handler.call(this, $event);

                    if (item.isOnce) {
                        that.off(evtName, item.handler);
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
        offAll: function() {
            this._listeners = createMap();
        },

        fireAll: function(data) {
            each(this._listeners, function(evtName) {
                this.fire(evtName, data);
            }, this);
        }
    };

    // more sugary
    each(rawAPI, function(apiName, fn) {
        Eventer.prototype[apiName] = function(names) {
            var extraArgs = slice(arguments, 1),
                that = this,
                evtsMap;

            if (isObject(names)) {
                evtsMap = names;
                each(evtsMap, function(key, value) {
                    names = key;
                    splitNames([value].concat(extraArgs));
                });
            } else if (isString(names)) {
                splitNames(extraArgs);
            }

            function splitNames(extraArgs) {
                names.split(' ').forEach(function(evtName) {
                    var applyArgs = [evtName].concat(extraArgs);
                    fn.apply(that, applyArgs);
                });
            }
        };
    });

    // for static usage
    Eventer._listeners = createMap();
    each(Eventer.prototype, function(apiName, fn) {
        Eventer[apiName] = fn;
    });

    window.Eventer = Eventer;
})(window);
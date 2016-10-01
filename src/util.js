const isArray = Array.isArray;

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

export {isArray, isObject, isString, isFunction, createMap, each, slice};
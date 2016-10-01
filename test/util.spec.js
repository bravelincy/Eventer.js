import {isArray, isObject, isString, isFunction, createMap, each, slice} from '../src/util';
import {expect} from 'chai';

describe('test util functions', () => {
    it('test isArray', () => {
        expect(isArray([])).to.equal(true);
        expect(isArray([1, 2])).to.equal(true);
        expect(isArray(null)).to.equal(false);
    });
    
    it('test isObject', () => {
        expect(isObject({})).to.equal(true);
        expect(isObject(null)).to.equal(false);
    });
    
    it('test isString', () => {
        expect(isString('hi')).to.equal(true);
        expect(isString('')).to.equal(true);
        expect(isString(1)).to.equal(false);
        expect(isString({})).to.equal(false);
    });
    
    it('test isFunction', () => {
        let noop = function() {};
        
        expect(isFunction(expect)).to.equal(true);
        expect(isFunction(noop)).to.equal(true);
        expect(isFunction({})).to.equal(false);
    });
    
    it('test createMap', () => {
        let map = createMap();
        
        expect(map.__proto__).to.equal(undefined);
        expect(Object.keys(map)).to.have.lengthOf(0);
    });
    
    it('test each', () => {
        let map = {
            a: 1,
            b: 2
        };
        let resultMap = {};
        
        each(map, (key, value) => {
            resultMap[key] = value;
        });
        
        expect(resultMap.a).to.equal(map.a);
        expect(resultMap.b).to.equal(map.b);
    });
    
    it('test slice', () => {
        var fn1 = function() {
            return slice(arguments);
        };
        var fn2 = function() {
            return slice(arguments, 1);
        };
        
        expect(fn1(1, 2).join()).to.equal([1, 2].join());
        expect(fn2(1, 2, 3).join()).to.equal([2, 3].join());
    });
});
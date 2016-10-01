import Eventer from '../src/eventer';
import {expect} from 'chai';

describe('test eventer', () => {
    beforeEach(() => {
        Eventer._listeners = {};
    });
    
    describe('test on listener', () => {
        var handler = function() {};
        var otherHandler = function() {};
        
        it('should on listener', () => {
            Eventer.on('login', handler);
            Eventer.on({
                login: handler
            });
            
            expect(Eventer._listeners.login).to.be.lengthOf(1);
            expect(Eventer._listeners.login[0].handler).to.equal(handler);
            
            Eventer.on({
                logout: handler
            });
            Eventer.on({
                'logout ready': handler,
                ready: otherHandler,
                load: handler
            });
            
            expect(Eventer._listeners.logout).to.be.lengthOf(1);
            expect(Eventer._listeners.logout[0].handler).to.equal(handler);
            expect(Eventer._listeners.ready).to.be.lengthOf(2);
            expect(Eventer._listeners.ready[0].handler).to.equal(handler);
            expect(Eventer._listeners.load).to.be.lengthOf(1);
            expect(Eventer._listeners.load[0].handler).to.equal(handler);
        });
        
        it('should on listener use one', () => {
            Eventer.one('login', handler);
            Eventer.one({
                login: handler
            });
            
            expect(Eventer._listeners.login).to.be.lengthOf(1);
            expect(Eventer._listeners.login[0].handler).to.equal(handler);
            
            Eventer.one({
                logout: handler
            });
            Eventer.one({
                'logout ready': handler,
                ready: handler,
                load: handler
            });
            
            expect(Eventer._listeners.logout).to.be.lengthOf(1);
            expect(Eventer._listeners.logout[0].handler).to.equal(handler);
            expect(Eventer._listeners.ready).to.be.lengthOf(1);
            expect(Eventer._listeners.ready[0].handler).to.equal(handler);
            expect(Eventer._listeners.load).to.be.lengthOf(1);
            expect(Eventer._listeners.load[0].handler).to.equal(handler);
        });
    });
    
    describe('test fire listener', () => {
        let data = {
            username: 'joenil'
        };
        let fireTimes = 0;
        let isMatchedData = false;
        let handler = function(event) {
            fireTimes++;
            isMatchedData = event.data === data;
        };
        
        beforeEach(() => {
            Eventer.on('login logout ready', handler);
            fireTimes = 0;
            isMatchedData = false;
        });
        
        it('should fire all listenrs of one type', () => {
            Eventer.on('login', function anotherHandler() {
                fireTimes++;
            });
            Eventer.fire('login');
            
            expect(fireTimes).to.be.equal(2);
        });
        
        it('should fire listener twice and one with data', () => {
            Eventer.fire('login');
            Eventer.fire({
                login: data
            });
            
            expect(fireTimes).to.be.equal(2);
            expect(isMatchedData).to.be.equal(true);
        });
        
        it('should fire listener twice without data', () => {
            Eventer.fire('login logout');
            
            expect(fireTimes).to.be.equal(2);
            expect(isMatchedData).to.be.equal(false);
        });
        
        it('should fire listener only once', () => {
            Eventer.one('load', handler);
            Eventer.fire('load');
            Eventer.fire('load', data);
            
            expect(fireTimes).to.be.equal(1);
            expect(isMatchedData).to.be.equal(false);
            expect(Eventer._listeners.load).to.be.equal(undefined);
        });
        
        it('should fire all listener', () => {
            Eventer.fireAll(data);
            
            expect(fireTimes).to.be.equal(3);
            expect(isMatchedData).to.be.equal(true);
        });
    });
    
    describe('test off listener', () => {
        let handler = function() {};
        let anotherHandler = function() {};
        
        beforeEach(() => {
            Eventer.on('login logout', handler);
            Eventer.on('login logout', anotherHandler);
        });
        
        it('should off one listener of one type', () => {
            Eventer.off({
                login: handler
            });
            
            expect(Eventer._listeners.login).to.be.lengthOf(1);
            expect(Eventer._listeners.login[0].handler).to.be.equal(anotherHandler);
        });
        
        it('should off all listener of one type', () => {
            Eventer.off('login');
            
            expect(Eventer._listeners.login).to.be.equal(undefined);
        });
        
        it('should off all listener of muliple type', () => {
            Eventer.off('login logout');
            
            expect(Eventer._listeners.login).to.be.equal(undefined);
            expect(Eventer._listeners.logout).to.be.equal(undefined);
        });
        
        it('should off one listener of muliple type', () => {
            Eventer.off('login logout', anotherHandler);
            
            expect(Eventer._listeners.login).to.be.lengthOf(1);
            expect(Eventer._listeners.login[0].handler).to.be.equal(handler);
            expect(Eventer._listeners.logout).to.be.lengthOf(1);
            expect(Eventer._listeners.logout[0].handler).to.be.equal(handler);
        });
        
        it('should off all listenrs of all types', () => {
            Eventer.offAll();
            
            expect(Object.keys(Eventer._listeners)).to.be.lengthOf(0);
        });
    });
    
    it('should setup listeners parallelly', () => {
        let result = {};
        let myEventer = new Eventer();
        let anotherEventer = new Eventer({
            login(event) {
                result.anotherLoginDone = true;
            }
        });
        
        myEventer.on('login', function(event) {
            result.myLoginDone = true;
        });
        
        myEventer.fire('login');
        expect(result.myLoginDone).to.be.equal(true);
        expect(result.anotherLoginDone).to.be.equal(undefined);
        
        result = {};
        
        anotherEventer.fire('login');
        expect(result.anotherLoginDone).to.be.equal(true);
        expect(result.myLoginDone).to.be.equal(undefined);
    });
});


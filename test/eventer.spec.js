import Eventer from '../src/eventer';
import {expect} from 'chai';

describe('test eventer', () => {
    beforeEach(() => {
        Eventer._listeners = {};
    });
    
    it('should on listener', () => {
        var handler = function() {};
        
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
    
    describe('should fire listener', () => {
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
        
        it('should fire listener', () => {
            Eventer.fire('login');
            Eventer.fire({
                login: data
            });
            
            expect(fireTimes).to.be.equal(2);
            expect(isMatchedData).to.be.equal(true);
        });
        
        it('should fire listener', () => {
            Eventer.fire('login logout');
            
            expect(fireTimes).to.be.equal(2);
            expect(isMatchedData).to.be.equal(false);
        });
        
        it('should fire all listener', () => {
            Eventer.fireAll(data);
            
            expect(fireTimes).to.be.equal(3);
            expect(isMatchedData).to.be.equal(true);
        });
    });
});


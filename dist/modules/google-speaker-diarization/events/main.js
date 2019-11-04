"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const EventEmitter3 = require('eventemitter3');
class Main {
    constructor() {
        this.eventListObject = {};
        this.emitter = new EventEmitter3.EventEmitter();
        const myEmitter = new events_1.EventEmitter();
        myEmitter.on('eventOne', this.c1);
    }
    c1() { console.log('an event occurred!'); }
}
exports.Main = Main;
//# sourceMappingURL=main.js.map
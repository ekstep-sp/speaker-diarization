"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
let GcRawService = class GcRawService {
    constructor() {
        this.COMMA_WORDS = `,"words"`;
    }
    processString(rawString) {
        const partialJson = rawString.replace(/\bdata\b/g, `"data" :`).replace(/\bstart_time\b/g, `"start_time" :`).replace(/\bwords\b/g, `,"words" :`).replace(/\bend_time\b/g, `,"end_time" :`).replace(/\bnanos\b/g, `,"nanos"`).replace(/\bword\b/g, `, "word"`).replace(/\bspeaker_tag\b/g, `, "speaker_tag"`).replace(/\bseconds\b/g, `" seconds"`);
        const indexOfCommaWords = partialJson.indexOf(this.COMMA_WORDS);
        console.log('first index of comma words', indexOfCommaWords);
        const firstHalf = partialJson.substring(0, indexOfCommaWords + this.COMMA_WORDS.length + 1);
        const secondHalf = partialJson.slice(firstHalf.length - 1);
        const correctWords = firstHalf.replace(`,"words"`, `"words"`);
        console.log('first half now is ', firstHalf + firstHalf.length);
        console.log('correct words now is ', correctWords + correctWords.length);
        const compconsteJSON = correctWords + secondHalf;
        let finalString = `{ ${compconsteJSON} }`;
        return finalString;
    }
};
GcRawService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [])
], GcRawService);
exports.GcRawService = GcRawService;
//# sourceMappingURL=gc-raw.service.js.map
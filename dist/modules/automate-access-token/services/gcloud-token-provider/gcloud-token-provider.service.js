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
const process_1 = require("process");
let GcloudTokenProviderService = class GcloudTokenProviderService {
    constructor() { }
    setAuthKey(newKey) {
        console.log('setting new auth key');
        this._auth_key = this.cleanKey(newKey);
        process_1.env['PROCESS_TOKEN_AUTH_KEY'] = this._auth_key.toString();
        console.log(process_1.env['PROCESS_TOKEN_AUTH_KEY']);
    }
    get process_token() {
        return process_1.env['PROCESS_TOKEN_AUTH_KEY'];
    }
    cleanKey(keyString) {
        const newKey = keyString.replace('\n', '').replace('\r', '');
        return newKey;
    }
    makeIncorrect(keyString) {
        const newKey = keyString.replace('c', 'x');
        return newKey;
    }
};
GcloudTokenProviderService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [])
], GcloudTokenProviderService);
exports.GcloudTokenProviderService = GcloudTokenProviderService;
//# sourceMappingURL=gcloud-token-provider.service.js.map
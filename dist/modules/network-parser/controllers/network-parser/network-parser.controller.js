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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const google_cloud_parser_service_1 = require("../../services/google-cloud-parser/google-cloud-parser.service");
let NetworkParserController = class NetworkParserController {
    constructor(gcpSrvc) {
        this.gcpSrvc = gcpSrvc;
    }
    async googleCloud(request, response) {
        console.log('POST : network-parser/googlecloud');
        return await this.gcpSrvc.parseData(request, response);
    }
    async googleCloud2(request, response) {
        console.log('POST : network-parser/googlecloud2');
        return await this.gcpSrvc.parseData2(request, response);
    }
};
__decorate([
    common_1.Post('googlecloud'),
    __param(0, common_1.Req()), __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], NetworkParserController.prototype, "googleCloud", null);
__decorate([
    common_1.Post('googlecloud2'),
    __param(0, common_1.Req()), __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], NetworkParserController.prototype, "googleCloud2", null);
NetworkParserController = __decorate([
    common_1.Controller('network-parser'),
    __metadata("design:paramtypes", [google_cloud_parser_service_1.GoogleCloudParserService])
], NetworkParserController);
exports.NetworkParserController = NetworkParserController;
//# sourceMappingURL=network-parser.controller.js.map
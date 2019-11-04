"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const network_parser_controller_1 = require("./controllers/network-parser/network-parser.controller");
const google_cloud_parser_service_1 = require("./services/google-cloud-parser/google-cloud-parser.service");
const common_request_validator_service_1 = require("../../services/shared/common-request-validator/common-request-validator.service");
let NetworkParserModule = class NetworkParserModule {
};
NetworkParserModule = __decorate([
    common_1.Module({
        controllers: [network_parser_controller_1.NetworkParserController],
        providers: [google_cloud_parser_service_1.GoogleCloudParserService, common_request_validator_service_1.CommonRequestValidatorService],
    })
], NetworkParserModule);
exports.NetworkParserModule = NetworkParserModule;
//# sourceMappingURL=network-parser.module.js.map
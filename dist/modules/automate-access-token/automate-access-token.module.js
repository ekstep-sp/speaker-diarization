"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const access_token_generator_service_1 = require("./services/access-token-generator/access-token-generator.service");
const gcloud_token_provider_service_1 = require("./services/gcloud-token-provider/gcloud-token-provider.service");
let AutomateAccessTokenModule = class AutomateAccessTokenModule {
};
AutomateAccessTokenModule = __decorate([
    common_1.Module({
        providers: [access_token_generator_service_1.AccessTokenGeneratorService, gcloud_token_provider_service_1.GcloudTokenProviderService],
        exports: [access_token_generator_service_1.AccessTokenGeneratorService]
    })
], AutomateAccessTokenModule);
exports.AutomateAccessTokenModule = AutomateAccessTokenModule;
//# sourceMappingURL=automate-access-token.module.js.map
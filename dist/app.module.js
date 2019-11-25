"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const network_parser_module_1 = require("./modules/network-parser/network-parser.module");
const common_request_validator_service_1 = require("./services/shared/common-request-validator/common-request-validator.service");
const google_speaker_diarization_module_1 = require("./modules/google-speaker-diarization/google-speaker-diarization.module");
const read_db_module_1 = require("./modules/read-db/read-db.module");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
const automate_access_token_module_1 = require("./modules/automate-access-token/automate-access-token.module");
const async_reader_module_1 = require("./modules/async-reader/async-reader.module");
const speaker_merger_module_1 = require("./modules/speaker-merger/speaker-merger.module");
const zoom_parser_module_1 = require("./modules/zoom-parser/zoom-parser.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    common_1.Module({
        imports: [
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: path_1.join(__dirname, '..', 'src', 'static'),
            }),
            network_parser_module_1.NetworkParserModule,
            google_speaker_diarization_module_1.GoogleSpeakerDiarizationModule,
            automate_access_token_module_1.AutomateAccessTokenModule,
            read_db_module_1.ReadDbModule,
            speaker_merger_module_1.SpeakerMergerModule,
            async_reader_module_1.AsyncReaderModule,
            zoom_parser_module_1.ZoomParserModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, common_request_validator_service_1.CommonRequestValidatorService],
        exports: [common_request_validator_service_1.CommonRequestValidatorService],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map
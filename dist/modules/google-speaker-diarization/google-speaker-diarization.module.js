"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const diarization_beta_controller_1 = require("./controllers/diarization-beta/diarization-beta.controller");
const diarization_speaker_service_1 = require("./services/diarization-speaker/diarization-speaker.service");
const google_speaker_diarization_event_handler_service_1 = require("./event-handler/google-speaker-diarization-event-handler/google-speaker-diarization-event-handler.service");
const initiate_diarization_handler_service_1 = require("./event-handler/services/initiate-diarization-handler/initiate-diarization-handler.service");
const write_converted_data_to_json_service_1 = require("./event-handler/services/write-converted-data-to-json/write-converted-data-to-json.service");
const gcloud_token_provider_service_1 = require("../automate-access-token/services/gcloud-token-provider/gcloud-token-provider.service");
const access_token_generator_service_1 = require("../automate-access-token/services/access-token-generator/access-token-generator.service");
let GoogleSpeakerDiarizationModule = class GoogleSpeakerDiarizationModule {
};
GoogleSpeakerDiarizationModule = __decorate([
    common_1.Module({
        imports: [common_1.HttpModule],
        controllers: [diarization_beta_controller_1.DiarizationBetaController],
        providers: [diarization_speaker_service_1.DiarizationSpeakerService, initiate_diarization_handler_service_1.InitiateDiarizationHandlerService, google_speaker_diarization_event_handler_service_1.GoogleSpeakerDiarizationEventHandlerService, write_converted_data_to_json_service_1.WriteConvertedDataToJsonService, gcloud_token_provider_service_1.GcloudTokenProviderService, access_token_generator_service_1.AccessTokenGeneratorService],
    })
], GoogleSpeakerDiarizationModule);
exports.GoogleSpeakerDiarizationModule = GoogleSpeakerDiarizationModule;
//# sourceMappingURL=google-speaker-diarization.module.js.map
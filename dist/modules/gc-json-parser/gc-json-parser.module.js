"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const gc_raw_to_json_controller_1 = require("./controllers/gc-raw-to-json/gc-raw-to-json.controller");
const gc_raw_service_1 = require("./services/gc-raw/gc-raw.service");
let GcJsonParserModule = class GcJsonParserModule {
};
GcJsonParserModule = __decorate([
    common_1.Module({
        controllers: [gc_raw_to_json_controller_1.GcRawToJsonController],
        providers: [gc_raw_service_1.GcRawService],
    })
], GcJsonParserModule);
exports.GcJsonParserModule = GcJsonParserModule;
//# sourceMappingURL=gc-json-parser.module.js.map
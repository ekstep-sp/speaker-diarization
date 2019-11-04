"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const fs = require("fs");
const path = require("path");
let DatabseCommonService = class DatabseCommonService {
    constructor() {
        this.DB_URL = path.resolve(__dirname, '../../../../../../src/assets/vis_db');
    }
    readJSONdb() {
        const fileUrl = path.join(this.DB_URL, 'vis_db.json');
        const fileData = fs.readFileSync(fileUrl, { encoding: 'utf-8' });
        return fileData;
    }
};
DatabseCommonService = __decorate([
    common_1.Injectable()
], DatabseCommonService);
exports.DatabseCommonService = DatabseCommonService;
//# sourceMappingURL=databse-common.service.js.map
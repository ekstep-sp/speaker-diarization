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
const os_1 = require("os");
const childProcess = require("child_process");
const fs = require("fs");
const path = require("path");
const gcloud_token_provider_service_1 = require("../gcloud-token-provider/gcloud-token-provider.service");
let AccessTokenGeneratorService = class AccessTokenGeneratorService {
    constructor(gctproviderSrvc) {
        this.gctproviderSrvc = gctproviderSrvc;
        this.PLATFORM = '';
    }
    initiate() {
        this.detectPlatForm();
        this.gcloudConfig = this.getGcloudConfig();
        if (this.gcloudConfig) {
            this.getAuthKey()
                .then(response => {
                console.log('auth key generated as ', response);
                this.gctproviderSrvc.setAuthKey(response);
            }).catch(err => {
                console.log('error occured while generating auth key ', err);
            });
        }
        else {
            console.error('gcloud config not loaded, cannot prevent the 401 error while diarization');
        }
    }
    detectPlatForm() {
        const os = os_1.platform();
        if (os === 'win32') {
            console.log('os is windows7/8/10');
            this.PLATFORM = 'windows';
        }
        else if (os === 'linux') {
            console.log('os is linux');
            this.PLATFORM = 'linux';
        }
    }
    getGcloudConfig() {
        const url = path.resolve(__dirname, '../../../../../src', 'config', 'gcloud_config.json');
        try {
            const gcConfig = fs.readFileSync(url, { encoding: 'utf-8' });
            return JSON.parse(gcConfig);
        }
        catch (e) {
            console.log('An error occured while reading config.json for gcloud config');
            console.log(e);
            return null;
        }
    }
    getAuthKey() {
        return new Promise((resolve, reject) => {
            console.log('initiate execute', this.gcloudConfig);
            childProcess.exec('gcloud auth application-default print-access-token', {
                cwd: this.gcloudConfig['gcloud_installation_path'],
                env: {
                    GOOGLE_APPLICATION_CREDENTIALS: this.gcloudConfig['env']['GCLOUD_APPLICATION_CREDENTIAL_FILE_PATH'],
                },
            }, (err, stdout, stderr) => {
                if (err == null) {
                    if (!!stdout) {
                        console.log('resolved');
                        resolve(stdout);
                    }
                    else {
                        const errMsg = 'did not recieve any auth key after execution, check manually';
                        reject(errMsg);
                    }
                }
                else {
                    const errMsg = 'An error occured while executing the command to generate new auth key';
                    console.log(err);
                    reject(errMsg);
                }
                if (stderr) {
                    const errMsg = 'An error occured after execuing the command for generating a new auth key';
                    console.log(stderr);
                    reject(errMsg);
                }
            });
        });
    }
    async refreshAuthKey() {
        let isRefreshed = false;
        if (!this.gcloudConfig) {
            this.gcloudConfig = this.getGcloudConfig();
            if (!this.gcloudConfig) {
                isRefreshed = await Promise.resolve(false);
            }
        }
        isRefreshed = await this.getAuthKey()
            .then(response => {
            console.log('refreshed auth key generated as ', response);
            this.gctproviderSrvc.setAuthKey(response);
            return Promise.resolve(true);
        }).catch(err => {
            console.log('error occured while refreshing auth key ', err);
            return Promise.resolve(false);
        });
        return Promise.resolve(isRefreshed);
    }
};
AccessTokenGeneratorService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [gcloud_token_provider_service_1.GcloudTokenProviderService])
], AccessTokenGeneratorService);
exports.AccessTokenGeneratorService = AccessTokenGeneratorService;
//# sourceMappingURL=access-token-generator.service.js.map
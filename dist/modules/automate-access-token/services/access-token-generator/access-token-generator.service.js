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
        this.commandToExecute = 'gcloud auth application-default print-access-token';
    }
    initiate() {
        this.gcloudConfig = this.getGcloudConfig();
        if (this.gcloudConfig) {
            if (fs.existsSync(this.gcloudConfig.google_cloud_installation_path)) {
                console.log('gcloud path is verified');
                this.getAuthKey()
                    .then(response => {
                    console.log('auth key generated as ', response);
                    this.gctproviderSrvc.setAuthKey(response);
                }).catch(err => {
                    console.log('error occured while generating auth key ', err);
                });
            }
            else {
                console.log('\n[ERROR] ---> gcloud installation path provided in gcloud_config.json is not valid, check the file manually\n');
            }
        }
        else {
            console.error('gcloud config not loaded, cannot prevent the 401 error while diarization');
        }
    }
    detectPlatForm() {
        const os = os_1.platform();
        if (os === 'win32') {
            this.PLATFORM = 'windows';
            this.commandToExecute = 'gcloud auth application-default print-access-token';
        }
        else if (os === 'linux') {
            this.PLATFORM = 'linux';
            this.commandToExecute = './gcloud auth application-default print-access-token';
        }
        console.log('PLATFORM DETECTED AS ---> ', this.PLATFORM);
        console.log('command to be executed for accessing tokens in gcloud will be ---> ', this.commandToExecute);
    }
    getGcloudConfig() {
        const gcloud_config_url = path.resolve(__dirname, '../../../../../src', 'config', 'gcloud_config.json');
        let global_config = {
            google_cloud_installation_path: '',
            google_cloud_authentication_file_path: '',
        };
        global_config = this.getGCLOUD_INSTALLATION_PATH(gcloud_config_url, global_config);
        console.log('gcloud config after installation path detection is ', global_config);
        if (!!global_config) {
            global_config = this.getGCLOUD_CREDENTIAL_FILE_PATH(gcloud_config_url, global_config);
            if (!!global_config) {
                return global_config;
            }
            else {
                return null;
            }
        }
        else {
            return null;
        }
    }
    getGCLOUD_INSTALLATION_PATH(gcloud_config_url, global_config) {
        if (!process.env.GCLOUD_CUSTOM_INSTALLATION_PATH) {
            console.log('env variable for gcloud installation path is not present, looking in static file');
            if (fs.existsSync(gcloud_config_url)) {
                console.log('picking gcloud installation path from gcloud_config.json');
                try {
                    let gcConfig = fs.readFileSync(gcloud_config_url, { encoding: 'utf-8' });
                    gcConfig = JSON.parse(gcConfig);
                    global_config.google_cloud_installation_path = gcConfig['gcloud_installation_path'];
                    if (!!global_config.google_cloud_installation_path && global_config.google_cloud_installation_path.length > 0) {
                        console.log('custom installation path set successfully');
                        return global_config;
                    }
                    else {
                        console.log('did not find google_cloud_installation_path key in the gcloud_config.json, aborting');
                        return null;
                    }
                }
                catch (e) {
                    console.log('An error occured while reading config.json at ' + gcloud_config_url + ' for gcloud config, maybe it is missing or empty');
                    console.log(e);
                    return null;
                }
            }
            else {
                console.log('gcloud_config.json does not exist at ' + gcloud_config_url + ', check manually');
                return null;
            }
        }
        else {
            console.log('picking gcloud installation path from env variable GCLOUD_CUSTOM_INSTALLATION_PATH as ', process.env.GCLOUD_CUSTOM_INSTALLATION_PATH);
            global_config.google_cloud_installation_path = process.env.GCLOUD_CUSTOM_INSTALLATION_PATH;
            return global_config;
        }
    }
    getGCLOUD_CREDENTIAL_FILE_PATH(gcloud_config_url, global_config) {
        if (!process.env.GOOGLE_AUTHENTICATION_CREDENTIALS) {
            console.log('env variable for gcloud credential file path is not present, looking in static file');
            if (fs.existsSync(gcloud_config_url)) {
                console.log('picking gcloud credential file path from gcloud_config.json');
                try {
                    let gcConfig = fs.readFileSync(gcloud_config_url, { encoding: 'utf-8' });
                    gcConfig = JSON.parse(gcConfig);
                    global_config.google_cloud_authentication_file_path = gcConfig['env']['GOOGLE_AUTHENTICATION_CREDENTIALS'];
                    if (!!global_config.google_cloud_authentication_file_path && global_config.google_cloud_authentication_file_path.length > 0) {
                        console.log('custom installation path set successfully');
                        return global_config;
                    }
                    else {
                        console.log('did not find google_cloud_authentication_file_path key in the gcloud_config.json, aborting');
                        return null;
                    }
                }
                catch (e) {
                    console.log('An error occured while reading config.json at ' + gcloud_config_url + ' for gcloud config, maybe it is missing or empty');
                    console.log(e);
                    return null;
                }
            }
            else {
                console.log('gcloud_config.json does not exist at ' + gcloud_config_url + ', check manually');
                return null;
            }
        }
        else {
            console.log('picking gcloud installation path from env variable google_cloud_authentication_file_path as ', process.env.GOOGLE_AUTHENTICATION_CREDENTIALS);
            global_config.google_cloud_authentication_file_path = process.env.GOOGLE_AUTHENTICATION_CREDENTIALS;
            return global_config;
        }
    }
    getAuthKey() {
        return new Promise((resolve, reject) => {
            console.log('initiate execute', this.gcloudConfig);
            this.detectPlatForm();
            childProcess.exec(this.commandToExecute, {
                cwd: this.gcloudConfig.google_cloud_installation_path,
                env: {
                    GOOGLE_APPLICATION_CREDENTIALS: this.gcloudConfig.google_cloud_authentication_file_path,
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
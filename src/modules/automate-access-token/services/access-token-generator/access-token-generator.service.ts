import { Injectable } from '@nestjs/common';
import { platform } from 'os';
import * as childProcess from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { GcloudTokenProviderService } from '../gcloud-token-provider/gcloud-token-provider.service';

@Injectable()
export class AccessTokenGeneratorService {
    private PLATFORM = '';
    private gcloudConfig;
    constructor(private gctproviderSrvc: GcloudTokenProviderService) {
    }

    initiate() {
        // detect platform
        this.detectPlatForm();

        // detect the config
        this.gcloudConfig = this.getGcloudConfig();

        if (this.gcloudConfig) {
            this.getAuthKey()
                .then(response => {
                    console.log('auth key generated as ', response);
                    // this.gctproviderSrvc.setAuthKey(response);
                    this.gctproviderSrvc.setAuthKey('ya29.c.Kl6pB33xOESV7FvMG8yfbp6R_D8fF75QtVAdyuCyMysqCWKwPywiySl_0vu-IwUARjFYI3lGcpW-EIT_qXcl2pkR3b8XuMvzKWHIX9v4T2hI4LJ3on9y8W75NrEXFFm2');
                }).catch(err => {
                    console.log('error occured while generating auth key ', err);
                });
        } else {
            console.error('gcloud config not loaded, cannot prevent the 401 error while diarization');
        }
    }

    detectPlatForm() {
        const os = platform();
        if (os === 'win32') {
            console.log('os is windows7/8/10');
            this.PLATFORM = 'windows';

        } else if (os === 'linux') {
            console.log('os is linux');
            this.PLATFORM = 'linux';
        }
    }

    getGcloudConfig() {
        // to load the config file needed for generating the access token
        const url = path.resolve(__dirname, '../../../../../src', 'config', 'gcloud_config.json');
        try {
            const gcConfig = fs.readFileSync(url, { encoding: 'utf-8' });
            return JSON.parse(gcConfig);
        } catch (e) {
            console.log('An error occured while reading config.json for gcloud config');
            console.log(e);
            return null;
        }
    }

    getAuthKey(): Promise<string> {
        return new Promise((resolve, reject) => {
            console.log('initiate execute', this.gcloudConfig);
            childProcess.exec(
                'gcloud auth application-default print-access-token',
                {
                    cwd: this.gcloudConfig['gcloud_installation_path'],
                    env: {
                        GOOGLE_APPLICATION_CREDENTIALS: this.gcloudConfig['env']['GCLOUD_APPLICATION_CREDENTIAL_FILE_PATH'],
                    },
                }, (err, stdout, stderr) => {
                    if (err == null) {
                        if (!!stdout) {
                            console.log('resolved');
                            resolve(stdout);
                        } else {
                            const errMsg = 'did not recieve any auth key after execution, check manually';
                            reject(errMsg);
                        }
                    } else {
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

    async refreshAuthKey(): Promise<boolean> {
        let isRefreshed = false;
        if (!this.gcloudConfig) {
            // detect the config
            this.gcloudConfig = this.getGcloudConfig();
            if (!this.gcloudConfig) {
                isRefreshed = await Promise.resolve(false);
            }
        }
        // config is ready, proceed further
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
}

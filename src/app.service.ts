import { Injectable } from '@nestjs/common';
import { AccessTokenGeneratorService } from './modules/automate-access-token/services/access-token-generator/access-token-generator.service';

@Injectable()
export class AppService {
  constructor(private atgSrvc: AccessTokenGeneratorService) {
    // inititating a new token process
    this.atgSrvc.initiate();
  }
  getServerStatus(): string {
    return 'Server is burning HOT !!!';
  }
}

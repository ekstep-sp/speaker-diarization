import { Injectable } from '@nestjs/common';

@Injectable()
export class GcloudDiarizationOperationTrackerService {

    validateoperationsBody(dataToValidate): boolean {
        // to make sure if the object supplied has operationsID key and it is of array type with atleast one operation ID
        let isValidated = false;
        if (!!dataToValidate &&  dataToValidate instanceof Object) {
            // variable is object
            if (Object.keys(dataToValidate).length > 0 && dataToValidate.hasOwnProperty('operationIDs')) {
                // operationIDs is present
                if (Array.isArray(dataToValidate.operationIDs) && dataToValidate.operationIDs.length > 0) {
                    // validated properly
                    isValidated = true;
                } else {
                    console.log('validateoperationsBody failed as operationIDs is not an Array / has atleast one operation ID in it');
                }
            } else {
                console.log('validateoperationsBody failed as variable does not have operationIDs key');
            }
        } else {
            console.log('validateoperationsBody failed as variable is not an object');
        }
        return isValidated;
    }

    startMultipleIDPolling(IDsToPoll: Array<string>) {
        console.log('multiple id polling   started');
        
    }
}

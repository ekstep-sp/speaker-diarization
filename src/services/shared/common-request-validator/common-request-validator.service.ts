// tslint:disable: no-console
import { Injectable } from '@nestjs/common';

@Injectable()
export class CommonRequestValidatorService {

    constructor() {}

    /**
     * Validates body object
     * @param bodyObject The body of the request to validate
     * @description The function will check for validation on the request.body object on the following parameters
     * 1. The data supplied is of object type
     * 2. The object is not empty and has atleast one key
     * @returns True if validation passes, false otherwise
     */
    validateBodyObject(bodyObject: any): boolean {
        let isValid = false;
        if (!!bodyObject && bodyObject.constructor === Object) {
            // the variable is of constructor type
            if (Object.keys(bodyObject).length) {
                console.log('Body Object Validation passed');
                isValid = true;
            } else {
                console.log('Body object validation failed : No keys present inside the body object');
            }
        } else {
            console.log('Body object validation failed : Body is not of object type');
        }
        return isValid;
    }
}

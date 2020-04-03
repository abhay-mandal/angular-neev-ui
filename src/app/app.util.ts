import { FormGroup } from '@angular/forms';
import { AbstractControl } from '@angular/forms';

import UIMessagesJson from '@assets/configs/uiMessages.json';
import { AppConstants } from './app.constants';

/**
 * This is the util class to define static methods which are used accross application.
 */
export class AppUtil {

    /**
    * This method parses UI messages json and returns the only message object based on the param sent.
    * @param code String - Message code Eg: CMP-001
    * @return message - Matched message object in format {'shortMessage': '', 'longMessage': ''}
    */
    static getMessageByCode(code) {
        let message = { 'shortMessage': '', 'longMessage': '' };
        const messages = UIMessagesJson.payload.messages.compass;
        const matchedMessage = messages.find(message => message.code == code);
        if (matchedMessage != undefined) {
            message = { 'shortMessage': matchedMessage.shortDesc, 'longMessage': matchedMessage.longDesc };
        }
        return message;
    }

    static mustMatch(controlName: string, matchingControlName: string) {
        return (formGroup: FormGroup) => {
            const control = formGroup.controls[controlName];
            const matchingControl = formGroup.controls[matchingControlName];

            if (matchingControl.errors && !matchingControl.errors.mustMatch) {
                // return if another validator has already found an error on the matchingControl
                return;
            }
            // set error on matchingControl if validation fails
            if (control.value !== matchingControl.value) {
                matchingControl.setErrors({ mustMatch: true });
            } else {
                matchingControl.setErrors(null);
            }
        }
    }

    /**
     * This method validates whether passed value contains only alphabet.
     * @param control AbstractControl Object of form field
     * @return Error object {'alphabet': true} if validation fails else null.
     */
    static alphabetsValidator(control: AbstractControl): { [key: string]: boolean } | null {
        const onlyAlphabetsRegex = /^[a-zA-Z ]*$/;
        if (onlyAlphabetsRegex.test(control.value)) {
            return null;
        } else {
            return { 'alphabet': true };
        }
    }

    /**
     * This method validates whether passed value contains alphaNumeric value.
     * @param control AbstractControl Object of form field
     * @return Error object {'alphaNumeric': true} if validation fails else null.
     */
    static alphaNumericValidator(control: AbstractControl): { [key: string]: boolean } | null {
        const alphaNumericRegex = /^[a-zA-Z0-9 ]*$/;
        //Pattern regex = Pattern.compile("[^A-Za-z0-9]");
        if (alphaNumericRegex.test(control.value)) {
            return null;
        } else {
            return { 'alphaNumeric': true };
        }
    }

    /**
     * This method validates whether passed value contains country except select.
     * @param countryDefaultLabel string Default country label
     * @param control AbstractControl Object of form field
     * @return Error object {'country': true} if validation fails else null.
     */
    static countryValidator = (countryDefaultLabel: string) => {
        return (control: AbstractControl) => {
            if (control.value != countryDefaultLabel) {
                return null;
            } else {
                return { 'country': true };
            }
        }
    }

    /**
     * This method validates whether passed value contains only space.
     * @param control AbstractControl Object of form field
     * @return Error object {'space': true} if validation fails else null.
     */
    static spaceValidator(control: AbstractControl): { [key: string]: boolean } | null {
        if (control.value.trim().length != 0) {
            return null;
        } else {
            return { 'space': true };
        }
    }

    /**
     * This method validates whether passed value is a valid contact number with country code.
     * @param control AbstractControl Object of form field
     * @return Error object {'contact': true} if validation fails else null.
     */
    static contactNumberValidator(control: AbstractControl): { [key: string]: boolean } | null {
        var contactNumberRegex = /[+][0-9]{2,7}[0-9]{4,15}/;
        if (contactNumberRegex.test(control.value)) {
            return null;
        } else {
            return { 'contact': true };
        }
    }

    /**
  * This method replaces space with plus in the passed param if space exists.
  * NOTE: //In URL encoding, '+' gets replaced with space(%20) so to add '+' again, replacement is done. 
  * @param stringParam @String in which replace needs to be done.
  * @return @String Replaced string. 
  */
    static replaceSpaceWithPlus(stringParam) {
        return stringParam.trim().split(' ').join('+');
    }

    /**
   * This method returns color "green", "orange" or "red" based the on the strength of the password "strong", "medium" or 
   * "weak" respectively. 
   * @param value @String Password value
   * @return Color @String Color based on the strength of password
   */
    static getPaswordStrengthColor(value) {
        const strongRegex = new RegExp(
            '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[=/\()%ยง!@#$%^&*])(?=.{8,})'
        ),
            mediumRegex = new RegExp(
                '^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})'
            );
        if (strongRegex.test(value)) {
            return AppConstants.PASSWORD_STRENGTH_COLORS.STRONG_PASSWORD_COLOR;
        } else if (mediumRegex.test(value)) {
            return AppConstants.PASSWORD_STRENGTH_COLORS.MEDIUM_PASSWORD_COLOR;
        } else {
            return AppConstants.PASSWORD_STRENGTH_COLORS.WEAK_PASSWORD_COLOR;
        }
    }
}
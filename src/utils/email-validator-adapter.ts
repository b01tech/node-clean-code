import { EmailValidator } from "../presentation/protocols";
import validator from "validator";

export class EmailValidatorAdapter implements EmailValidator {
  isValid(email: string): boolean {
    if (!email) return false;
    return validator.isEmail(email);
  }
}

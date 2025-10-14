import { EmailValidatorAdapter } from "./email-validator-adapter";
import validator from "validator";

jest.mock("validator", () => ({
  isEmail(): boolean {
    return true;
  },
}));

describe("EmailValidatorAdapter", () => {
  test("Should return false if validator returns false", () => {
    const sut = new EmailValidatorAdapter();
    jest.spyOn(validator, "isEmail").mockImplementationOnce(() => false);
    const isValid = sut.isValid("invalid_email.com");
    expect(isValid).toBe(false);
  });
  test("Should return true if validator returns true", () => {
    const sut = new EmailValidatorAdapter();
    const isValid = sut.isValid("valid_email@domain.com");
    expect(isValid).toBe(true);
  });
});

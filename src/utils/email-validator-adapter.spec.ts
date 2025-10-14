import { EmailValidatorAdapter } from "./email-validator-adapter";
import validator from "validator";

jest.mock("validator", () => ({
  isEmail(): boolean {
    return true;
  },
}));

const createSut = () => new EmailValidatorAdapter();

describe("EmailValidatorAdapter", () => {
  test("Should return false if validator returns false", () => {
    const sut = createSut();
    jest.spyOn(validator, "isEmail").mockImplementationOnce(() => false);
    const isValid = sut.isValid("invalid_email.com");
    expect(isValid).toBe(false);
  });
  test("Should return true if validator returns true", () => {
    const sut = createSut();
    const isValid = sut.isValid("valid_email@domain.com");
    expect(isValid).toBe(true);
  });
  test("Should call validator with correct email", () => {
    const sut = createSut();
    const isEmailSpy = jest.spyOn(validator, "isEmail");
    sut.isValid("valid_email@domain.com");
    expect(isEmailSpy).toHaveBeenCalledWith("valid_email@domain.com");
  });
});

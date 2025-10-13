import { InvalidParamsError } from "../error/invalid-params-error";
import { MissingParamsError } from "../error/missing-params-error";
import { EmailValidator } from "../protocols/email-validator";
import { SignupController } from "./signup";

class EmailValidatorStub implements EmailValidator {
  constructor(private returnIsValid: boolean) {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isValid(email: string): boolean {
    return this.returnIsValid;
  }
}

const createEmailValidator = (
  returnIsValid: boolean = true
): EmailValidator => {
  return new EmailValidatorStub(returnIsValid);
};

const createSignupController = (
  returnIsValid: boolean = true
): SignupController => {
  const emailValidatorStub = createEmailValidator(returnIsValid);
  return new SignupController(emailValidatorStub);
};

describe("SignupController", () => {
  test("Should return 400 if no name is provided", async () => {
    const signupController = createSignupController();
    const request = {
      body: {
        email: "test@test.com",
        password: "123456",
        confirmPassword: "123456",
      },
    };
    const response = signupController.handle(request);
    expect(response.status).toBe(400);
    expect(response.body).toEqual(new MissingParamsError("name"));
  });
  test("Should return 400 if no email is provided", async () => {
    const signupController = createSignupController();
    const request = {
      body: {
        name: "Test User",
        password: "123456",
        confirmPassword: "123456",
      },
    };
    const response = signupController.handle(request);
    expect(response.status).toBe(400);
    expect(response.body).toEqual(new MissingParamsError("email"));
  });
  test("Should return 400 if no password is provided", async () => {
    const signupController = createSignupController();
    const request = {
      body: {
        name: "Test User",
        email: "test@test.com",
        confirmPassword: "123456",
      },
    };
    const response = signupController.handle(request);
    expect(response.status).toBe(400);
    expect(response.body).toEqual(new MissingParamsError("password"));
  });
  test("Should return 400 if no confirmPassword is provided", async () => {
    const signupController = createSignupController();
    const request = {
      body: {
        name: "Test User",
        email: "test@test.com",
        password: "123456",
      },
    };
    const response = signupController.handle(request);
    expect(response.status).toBe(400);
    expect(response.body).toEqual(new MissingParamsError("confirmPassword"));
  });
  test("Should return 400 if an invalid email is provided", async () => {
    const isEmailValid = false;
    const signupController = createSignupController(isEmailValid);
    const request = {
      body: {
        name: "Test User",
        email: "test.com",
        password: "123456",
        confirmPassword: "123456",
      },
    };
    const response = signupController.handle(request);
    expect(response.status).toBe(400);
    expect(response.body).toEqual(new InvalidParamsError("email"));
  });
});

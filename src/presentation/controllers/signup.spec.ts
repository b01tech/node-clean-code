import { InvalidParamsError, MissingParamsError, ServerError } from "../error";
import { EmailValidator } from "../protocols";
import { SignupController } from "./signup";

class EmailValidatorStub implements EmailValidator {
  constructor(private returnIsValid: boolean) {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isValid(email: string): boolean {
    return this.returnIsValid;
  }
}
const createEmailValidatorWithError = (): EmailValidator => {
  return {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isValid: (_email: string): boolean => {
      throw new ServerError();
    },
  };
};

const createEmailValidator = (
  returnIsValid: boolean = true
): EmailValidator => {
  return new EmailValidatorStub(returnIsValid);
};

const createSignupController = (
  emailValidator: EmailValidator
): SignupController => {
  return new SignupController(emailValidator);
};

describe("SignupController", () => {
  test("Should return 400 if no name is provided", async () => {
    const emailValidator = createEmailValidator();
    const signupController = createSignupController(emailValidator);
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
    const emailValidator = createEmailValidator();
    const signupController = createSignupController(emailValidator);
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
    const emailValidator = createEmailValidator();
    const signupController = createSignupController(emailValidator);
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
    const emailValidator = createEmailValidator();
    const signupController = createSignupController(emailValidator);
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
    const emailValidator = createEmailValidator(isEmailValid);
    const signupController = createSignupController(emailValidator);
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
  test("Should return 500 if emailValidator throws", async () => {
    const emailValidator = createEmailValidatorWithError();
    const signupController = createSignupController(emailValidator);
    const request = {
      body: {
        name: "Test User",
        email: "test.com",
        password: "123456",
        confirmPassword: "123456",
      },
    };
    const response = signupController.handle(request);
    expect(response.status).toBe(500);
    expect(response.body).toEqual(new ServerError());
  });
});

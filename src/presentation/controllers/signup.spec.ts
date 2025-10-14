import { AccountModel } from "../../domain/models/account";
import { AddAccount, AddAccountModel } from "../../domain/usecases/add-account";
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

const createAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add(account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: "123",
        name: account.name,
        email: account.email,
        password: account.password,
      };
      return new Promise((resolve) => resolve(fakeAccount));
    }
  }
  return new AddAccountStub();
};

const createEmailValidator = (
  returnIsValid: boolean = true
): EmailValidator => {
  return new EmailValidatorStub(returnIsValid);
};

const createSignupController = (
  emailValidator: EmailValidator,
  addAccount: AddAccount
): SignupController => {
  return new SignupController(emailValidator, addAccount);
};

interface SignupControllerParams {
  signupController: SignupController;
  emailValidator: EmailValidator;
  addAccount: AddAccount;
}

const setupSignup = (): SignupControllerParams => {
  const emailValidator = createEmailValidator();
  const addAccount = createAddAccount();
  const signupController = createSignupController(emailValidator, addAccount);
  return {
    signupController,
    emailValidator,
    addAccount,
  };
};

describe("SignupController", () => {
  test("Should return 400 if no name is provided", async () => {
    const { signupController } = setupSignup();
    const request = {
      body: {
        email: "test@test.com",
        password: "123456",
        confirmPassword: "123456",
      },
    };
    const response = await signupController.handle(request);
    expect(response.status).toBe(400);
    expect(response.body).toEqual(new MissingParamsError("name"));
  });
  test("Should return 400 if no email is provided", async () => {
    const { signupController } = setupSignup();
    const request = {
      body: {
        name: "Test User",
        password: "123456",
        confirmPassword: "123456",
      },
    };
    const response = await signupController.handle(request);
    expect(response.status).toBe(400);
    expect(response.body).toEqual(new MissingParamsError("email"));
  });
  test("Should return 400 if no password is provided", async () => {
    const { signupController } = setupSignup();
    const request = {
      body: {
        name: "Test User",
        email: "test@test.com",
        confirmPassword: "123456",
      },
    };
    const response = await signupController.handle(request);
    expect(response.status).toBe(400);
    expect(response.body).toEqual(new MissingParamsError("password"));
  });
  test("Should return 400 if no confirmPassword is provided", async () => {
    const { signupController } = setupSignup();
    const request = {
      body: {
        name: "Test User",
        email: "test@test.com",
        password: "123456",
      },
    };
    const response = await signupController.handle(request);
    expect(response.status).toBe(400);
    expect(response.body).toEqual(new MissingParamsError("confirmPassword"));
  });
  test("Should return 400 if password and confirmPassword do not match", async () => {
    const { signupController } = setupSignup();
    const request = {
      body: {
        name: "Test User",
        email: "test@test.com",
        password: "123456",
        confirmPassword: "654321",
      },
    };
    const response = await signupController.handle(request);
    expect(response.status).toBe(400);
    expect(response.body).toEqual(new InvalidParamsError("confirmPassword"));
  });
  test("Should return 400 if an invalid email is provided", async () => {
    const isEmailValid = false;
    const { signupController, emailValidator: emailValidatorStub } =
      setupSignup();
    jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(isEmailValid);
    const request = {
      body: {
        name: "Test User",
        email: "test.com",
        password: "123456",
        confirmPassword: "123456",
      },
    };
    const response = await signupController.handle(request);
    expect(response.status).toBe(400);
    expect(response.body).toEqual(new InvalidParamsError("email"));
  });
  test("Should return 500 if emailValidator throws", async () => {
    const { signupController, emailValidator: emailValidatorStub } =
      setupSignup();
    jest.spyOn(emailValidatorStub, "isValid").mockImplementationOnce(() => {
      throw new ServerError();
    });
    const request = {
      body: {
        name: "Test User",
        email: "test.com",
        password: "123456",
        confirmPassword: "123456",
      },
    };
    const response = await signupController.handle(request);
    expect(response.status).toBe(500);
    expect(response.body).toEqual(new ServerError());
  });
  test("Should call addAccount with correct values", async () => {
    const { signupController, addAccount: addAccountStub } = setupSignup();
    const addSpy = jest.spyOn(addAccountStub, "add");
    const request = {
      body: {
        name: "Test User",
        email: "test@test.com",
        password: "123456",
        confirmPassword: "123456",
      },
    };
    signupController.handle(request);
    expect(addSpy).toHaveBeenCalledWith({
      name: "Test User",
      email: "test@test.com",
      password: "123456",
    });
  });
  test("Should return 500 if addAccount throws", async () => {
    const { signupController, addAccount: addAccountStub } = setupSignup();
    jest.spyOn(addAccountStub, "add").mockImplementationOnce(() => {
      throw new ServerError();
    });
    const request = {
      body: {
        name: "Test User",
        email: "test.com",
        password: "123456",
        confirmPassword: "123456",
      },
    };
    const response = await signupController.handle(request);
    expect(response.status).toBe(500);
    expect(response.body).toEqual(new ServerError());
  });
  test("Should return 201 if valid data is provided", async () => {
    const { signupController } = setupSignup();
    const request = {
      body: {
        name: "Test User",
        email: "test@test.com",
        password: "123456",
        confirmPassword: "123456",
      },
    };
    const response = await signupController.handle(request);
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      id: "123",
      name: "Test User",
      email: "test@test.com",
      password: "123456",
    });
  });
});

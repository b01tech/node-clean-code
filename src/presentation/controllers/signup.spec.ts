import { MissingParamsError } from "../error/missing-params-error";
import { SignupController } from "./signup";

const createSignupController = () => new SignupController();

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
});

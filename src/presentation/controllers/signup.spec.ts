import { SignupController } from "./signup";

describe("SignupController", () => {
  test("Should return 400 if no name is provided", async () => {
    const signupController = new SignupController();
    const request = {
      body: {
        email: "test@test.com",
        password: "123456",
        confirmPassword: "123456",
      },
    };
    const response = signupController.handle(request);
    expect(response.status).toBe(400);
    expect(response.body).toEqual(new Error("No name provided"));
  });
});

import { InvalidParamsError } from "../error/invalid-params-error";
import { MissingParamsError } from "../error/missing-params-error";
import { badRequest, serverError } from "../helpers/http-helper";
import { Controller } from "../protocols/controller";
import { EmailValidator } from "../protocols/email-validator";
import { httpRequest, httpResponse } from "../protocols/http";

export class SignupController implements Controller {
  constructor(private readonly emailValidator: EmailValidator) {}
  handle(request: httpRequest): httpResponse {
    try {
      const requiredParams = ["name", "email", "password", "confirmPassword"];
      for (const param of requiredParams) {
        if (!request.body[param]) {
          return badRequest(new MissingParamsError(param));
        }
      }
      const isValidEmail = this.emailValidator.isValid(request.body.email);
      if (!isValidEmail) {
        return badRequest(new InvalidParamsError("email"));
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return serverError();
    }
    return {
      status: 200,
      body: {
        message: "Success",
      },
    };
  }
}

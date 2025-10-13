import { InvalidParamsError, MissingParamsError } from "../error";
import { badRequest, serverError } from "../helpers/http-helper";
import {
  Controller,
  HttpRequest,
  HttpResponse,
  EmailValidator,
} from "../protocols";

export class SignupController implements Controller {
  constructor(private readonly emailValidator: EmailValidator) {}
  handle(request: HttpRequest): HttpResponse {
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
      if (request.body.password !== request.body.confirmPassword) {
        return badRequest(new InvalidParamsError("confirmPassword"));
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

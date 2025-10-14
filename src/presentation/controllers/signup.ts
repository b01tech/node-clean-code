import { AddAccount } from "../../domain/usecases/add-account";
import { InvalidParamsError, MissingParamsError } from "../error";
import { badRequest, serverError } from "../helpers/http-helper";
import {
  Controller,
  HttpRequest,
  HttpResponse,
  EmailValidator,
} from "../protocols";

export class SignupController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount
  ) {}
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
      const account = this.addAccount.add({
        name: request.body.name,
        email: request.body.email,
        password: request.body.password,
      });
      this.addAccount.add(account);
      return {
        status: 201,
        body: {
          message: "Success",
        },
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return serverError();
    }
  }
}

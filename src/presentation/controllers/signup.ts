import { AddAccount } from "../../domain/usecases/add-account";
import { InvalidParamsError, MissingParamsError } from "../error";
import { badRequest, created, serverError } from "../helpers/http-helper";
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
  async handle(request: HttpRequest): Promise<HttpResponse> {
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
      const account = await this.addAccount.add({
        name: request.body.name,
        email: request.body.email,
        password: request.body.password,
      });
      return created(account);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return serverError();
    }
  }
}

import { MissingParamsError } from "../error/missing-params-error";
import { badRequest } from "../helpers/http-helper";
import { Controller } from "../protocols/controller";
import { httpRequest, httpResponse } from "../protocols/http";

export class SignupController implements Controller {
  handle(request: httpRequest): httpResponse {
    const requiredParams = ["name", "email", "password", "confirmPassword"];
    for (const param of requiredParams) {
      if (!request.body[param]) {
        return badRequest(new MissingParamsError(param));
      }
    }
    return {
      status: 200,
      body: {
        message: "Success",
      },
    };
  }
}

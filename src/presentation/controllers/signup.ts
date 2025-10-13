import { MissingParamsError } from "../error/missing-params-error";
import { badRequest } from "../helpers/http-helper";
import { httpRequest } from "../protocols/http";
import { httpResponse } from "../protocols/http";

export class SignupController {
  handle(request: httpRequest): httpResponse {
    const requiredParams = ["name", "email"];
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

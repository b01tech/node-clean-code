import { MissingParamsError } from "../error/missing-params-error";
import { badRequest } from "../helpers/http-helper";
import { httpRequest } from "../protocols/http";
import { httpResponse } from "../protocols/http";

export class SignupController {
  handle(request: httpRequest): httpResponse {
    if (!request.body.name) {
      return badRequest(new MissingParamsError("name"));
    }
    if (!request.body.email) {
      return badRequest(new MissingParamsError("email"));
    } else {
      return {
        status: 200,
        body: {
          message: "Success",
        },
      };
    }
  }
}

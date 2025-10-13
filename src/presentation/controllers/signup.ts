import { MissingParamsError } from "../error/missing-params-error";
import { httpRequest } from "../protocols/http";
import { httpResponse } from "../protocols/http";

export class SignupController {
  handle(request: httpRequest): httpResponse {
    if (!request.body.name) {
      return {
        status: 400,
        body: new MissingParamsError("name"),
      };
    }
    if (!request.body.email) {
      return {
        status: 400,
        body: new MissingParamsError("email"),
      };
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

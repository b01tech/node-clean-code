import { httpRequest } from "../protocols/http";
import { httpResponse } from "../protocols/http";

export class SignupController {
  handle(request: httpRequest): httpResponse {
    if (!request.body.name) {
      return {
        status: 400,
        body: new Error("No name provided"),
      };
    }
    if (!request.body.email) {
      return {
        status: 400,
        body: new Error("No email provided"),
      };
    }
  }
}

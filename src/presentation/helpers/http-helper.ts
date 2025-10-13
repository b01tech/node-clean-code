import { ServerError } from "../error/server-error";
import { httpResponse } from "../protocols/http";

export const badRequest = (error: Error): httpResponse => ({
  status: 400,
  body: error,
});
export const serverError = (): httpResponse => ({
  status: 500,
  body: new ServerError(),
});

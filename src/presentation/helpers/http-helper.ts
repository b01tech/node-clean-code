import { ServerError } from "../error/server-error";
import { HttpResponse } from "../protocols/http";

export const badRequest = (error: Error): HttpResponse => ({
  status: 400,
  body: error,
});
export const serverError = (): HttpResponse => ({
  status: 500,
  body: new ServerError(),
});

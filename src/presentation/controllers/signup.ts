export class SignupController {
  handle(request: any): any {
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

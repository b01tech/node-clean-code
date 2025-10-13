export class SignupController {
  handle(request: any): any {
    return {
      status: 400,
      body: new Error("No name provided"),
    };
  }
}

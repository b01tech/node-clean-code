export class SignupController {
  handle(request: any): any {
    return {
      status: 400,
      body: {
        message: "No name provided",
      },
    };
  }
}

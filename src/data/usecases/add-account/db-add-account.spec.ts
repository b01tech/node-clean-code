import { DbAddAccount } from "./db-add-account";

class EncrypterStub {
  async encrypt(): Promise<string> {
    return new Promise((resolve) => resolve("hashed_password"));
  }
}

describe("DbAddAccount UseCase", () => {
  test("Should call Encrypter with correct password", async () => {
    const encrypterStub = new EncrypterStub();
    const sut = new DbAddAccount(encrypterStub);
    const encryptSpy = jest.spyOn(encrypterStub, "encrypt");

    const accountData = {
      name: "any_name",
      email: "any_email@mail.com",
      password: "any_password",
    };
    await sut.add(accountData);
    expect(encryptSpy).toHaveBeenCalledWith("any_password");
  });

  test("Should throw if Encrypter throws", async () => {
    const encrypterStub = new EncrypterStub();
    const sut = new DbAddAccount(encrypterStub);
    jest
      .spyOn(encrypterStub, "encrypt")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const accountData = {
      name: "any_name",
      email: "any_email@mail.com",
      password: "any_password",
    };
    const promise = sut.add(accountData);
    await expect(promise).rejects.toThrow();
  });
});

export default function UserValidatePasswordCommand(password: unknown): password is string {
  return typeof password === "string" && password.length >= 6 && password.length <= 255;
}

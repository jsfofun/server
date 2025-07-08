export class APIRedirect {
  constructor(public status: number, public url: string) {}
}

export default function redirect(status: number, url: string): never {
  throw new APIRedirect(status, url);
}

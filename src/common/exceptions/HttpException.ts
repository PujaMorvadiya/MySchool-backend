export class HttpException extends Error {
  public status: number;
  public message: string;
  public toast: boolean;

  constructor(status: number, message: string, toast: boolean = undefined) {
    super(message);
    this.status = status;
    this.message = message;
    this.toast = toast;
  }
}

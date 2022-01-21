export class HandleResult {
  statusCode: number = 200;
  message: string = '';
  data: any = {};
  success: boolean = true;

  private result() {
    return {
      statusCode: this.statusCode,
      message: this.message,
      data: this.data,
      success: this.success,
    };
  }

  public ErrorNotFound(message: string) {
    this.statusCode = 404;
    this.message = message;
    this.success = false;
    return this.result();
  }

  public IncorrectInstance(statusCode: number = 400, message: string) {
    this.statusCode = statusCode;
    this.message = message;
    this.success = false;
    return this.result();
  }
}

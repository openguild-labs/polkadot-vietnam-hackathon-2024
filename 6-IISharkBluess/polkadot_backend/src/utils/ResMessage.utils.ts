class ResponseMessage {
    success: boolean = true;
    statusCode: number;
    message?: string;
    error?: string | null = null;
    metadata: any;
  
    constructor(
      statusCode: number,
      message: string,
      metadata: any,
      error?: string,
    ) {
      this.statusCode = statusCode;
      this.message = message;
      this.metadata = metadata;
      this.error = error;
    }
  }
  
  export { ResponseMessage };
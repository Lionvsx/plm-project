export type ServerActionResult<Result> = Promise<
    | {
          success: true;
          data: Result;
      }
    | {
          success: false;
          error: string;
      }
>;

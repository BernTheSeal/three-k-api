import { z } from "zod";
import { Request, Response, NextFunction } from "express";
import { ValidateError } from "../errors";

export const validate = (
  schema: z.ZodObject<{
    body?: z.ZodTypeAny;
    query?: z.ZodTypeAny;
    params?: z.ZodTypeAny;
  }>,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const requestData = {
        body: req.body,
        query: req.query,
        params: req.params,
      };

      const validatedData = schema.parse(requestData) as {
        body?: Record<string, unknown>;
        query?: Record<string, string>;
        params?: Record<string, string>;
      };

      res.locals.validatedData = validatedData;

      next();
    } catch (err) {
      if (err instanceof z.ZodError) {
        const formattedErrors = err.issues.map((issue) => ({
          message: issue.message,
          path: issue.path.slice(1).join("."),
          location: issue.path[0] as "body" | "query" | "params",
        }));

        throw new ValidateError({ message: "Some fields are invalid!", code: "VALIDATE_ERROR", details: formattedErrors });
      }
      throw err;
    }
  };
};

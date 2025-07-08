import { APIError } from "$/shared/utils/fail";
import { TypeBoxError } from "@sinclair/typebox";
import type { ErrorRequestHandler, Response } from "express";

export const errorAsResponse = (res: Response, error: unknown) => {
  // Verification errors
  if (error instanceof TypeBoxError) res.send(error);
  // else if (error instanceof MulterError) {
  //     res.status(422).send({
  //         error: {
  //             message: error.message,
  //             field: error.field,
  //             code: error.code,
  //         },
  //     });
  // }
  // Custom API errors
  else if (error instanceof APIError) {
    res.status(error.status).send({ error: error.message });
  }
  // Other errors that doesn't handled
  else {
    log.error(error);
    res.status(500).send({ error: "Internal Server Error!" });
  }
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  errorAsResponse(res, err);
};

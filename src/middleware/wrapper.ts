import { type TSchema, type Static, type SchemaOptions } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";
import type { Request, Response } from "express";
import { ParseErrorAsResponse } from "./error-handler";
import * as table from "$/shared/db/schema";
import fail from "$/shared/utils/fail";
export const sessionCookieName = "auth-session";
import UserSessionAuth from "$/modules/users/services/auth";
import { APIRedirect } from "$/shared/utils/redirect";

export const verifySchemaData = <T extends TSchema>(schema: T, options?: SchemaOptions) => {
  return Value.Parse<T>(schema, options);
};

function parseSchema<Type extends TSchema | undefined>(
  schema: Type,
  data: unknown
): IfIsExists<Exclude<Type, undefined>> {
  if (!schema) return <IfIsExists<Exclude<Type, undefined>>>undefined;
  return <IfIsExists<Exclude<Type, undefined>>>verifySchemaData(schema, data!);
}

type IfIsExists<Schema extends TSchema | undefined> = Schema extends TSchema
  ? Static<Schema>
  : undefined;

export interface RequestHandler<
  Body extends TSchema | undefined,
  Query extends TSchema | undefined,
  Params extends TSchema | undefined,
  User extends table.User | undefined
> {
  (args: {
    /** Parsed Body Schema Value */
    body: IfIsExists<Body>;

    /** Parsed Query Schema Value */
    query: IfIsExists<Query>;

    /** Returns `User` if set in `authRequired` in `params` */
    user: User;
    session: table.Session | undefined;

    /** Parsed Route Params Schema Value  */
    response: Response;
    params: IfIsExists<Params>;

    /** Function to set status code */
    status: (status: number) => void;
  }): any | Promise<any>;
}

const UseRoute = function <
  Body extends TSchema,
  Query extends TSchema,
  Params extends TSchema,
  UserAuthRequired extends boolean = true
>(
  cb: RequestHandler<
    Body,
    Query,
    Params,
    UserAuthRequired extends true ? table.User : undefined | table.User
  >,
  options?: {
    /** Body Schema */
    body?: Body;

    /** Query Schema */
    query?: Query;

    /** Params Schema */
    params?: Params;

    /** Response Schema */
    response?: TSchema;

    /** Whenever route is requires  */
    authRequired?: UserAuthRequired;
  }
) {
  const {
    authRequired = true,
    body: bodySchema,
    query: querySchema,
    params: paramsSchema,
    response: responseSchema,
  } = options ?? {};

  return async (req: Request, res: Response) => {
    try {
      const sessionToken = req.cookies[sessionCookieName];
      const result = await UserSessionAuth.validateSessionToken(sessionToken);

      if (authRequired && !result) fail(401, "Unauthorized!");

      const { session, user } = result ?? {};

      // Update users token after successfully check
      if (session) UserSessionAuth.setSessionTokenCookie(res, sessionToken, session.expires_at);
      else UserSessionAuth.deleteSessionTokenCookie(res);
      // If Route requires user authorization
      if (authRequired && !user) fail(401, "Unauthorized!");

      res.locals.user = user;
      res.locals.session = session;

      // Response status
      let status = 200;

      const response = await cb({
        body: parseSchema(bodySchema, req.body),
        query: parseSchema(querySchema, req.query),
        params: parseSchema(paramsSchema, req.params),
        response: res,
        status: (set: number) => {
          status = set;
        },
        user: user as UserAuthRequired extends true ? table.User : undefined,
        session: session as UserAuthRequired extends true ? table.Session : undefined,
      });

      res.status(status);

      // If response schema type in the options - parse callback value
      if (response instanceof APIRedirect) res.redirect(response.url);
      else if (responseSchema) res.send(verifySchemaData(responseSchema, response));
      // Otherwise just return
      else res.send(response);
    } catch (err) {
      ParseErrorAsResponse(res, err);
    }
  };
};

export default UseRoute;

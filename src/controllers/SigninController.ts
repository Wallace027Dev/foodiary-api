import { HttpRequest, HttpResponse } from "../types/http";
import { ok } from "../utils/http";
import { z } from "zod";

const schema = z.object({ email: z.email(), password: z.string().min(8) });

export class SignInController {
  static async handle(request: HttpRequest): Promise<HttpResponse> {
    return ok({ accessCode: "Token de acesso..." });
  }

}

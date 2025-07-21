import { HttpRequest, HttpResponse } from "../types/http";
import { badRequest, created } from "../utils/http";
import { z } from "zod";

const schema = z.object({
  goal: z.enum(["lose", "maintain", "gain"]),
  gender: z.enum(["male", "female"]),
  birthDate: z.iso.date(),
  height: z.number().int().positive(),
  weight: z.number().int().positive(),
  activityLevel: z.number().min(1).max(5),
  account: z.object({
    name: z.string().min(3),
    email: z.email(),
    password: z.string().min(8),
  }),
});

export class SignUpController {
  static async handle(request: HttpRequest): Promise<HttpResponse> {
    const { success, error, data } = schema.safeParse(request.body);

    if (!success) {
      return badRequest({ error: error.issues });
    }

    return created({ data });
  }
}

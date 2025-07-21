import { eq } from "drizzle-orm";
import { db } from "../db";
import { HttpRequest, HttpResponse } from "../types/http";
import { badRequest, conflict, created } from "../utils/http";
import { z } from "zod";
import { usersTable } from "../db/schema";
const { hash } = require("bcryptjs");

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

    const userAlreadyExists = await db.query.usersTable.findFirst({
      columns: {
        email: true,
      },
      where: eq(usersTable.email, data.account.email),
    });

    if (userAlreadyExists) {
      return conflict({ error: "User already exists" });
    }

    const { account, ...rest } = data;

    const hashedPassword = await hash(account.password, 8);

    const [user] = await db
      .insert(usersTable)
      .values({
        ...rest,
        ...account,
        password: hashedPassword,
        calories: 0,
        proteins: 0,
        carbohydrates: 0,
        fats: 0,
      })
      .returning({
        id: usersTable.id,
      });

    return created({ userId: user.id });
  }
}

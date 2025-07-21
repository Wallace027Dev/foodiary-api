import { APIGatewayProxyEventV2 } from "aws-lambda";
import { HttpRequest } from "../types/http";

// Desacoplando o código de regras de negócio da infraestrutura
export function parseEvent(event: APIGatewayProxyEventV2): HttpRequest {
  const body = JSON.parse(event.body ?? "{}");
  const params = event.pathParameters ?? {}; // (ex: /user/:id)
  const queryParams = event.queryStringParameters ?? {}; // (ex: ?page=1)

  return {
    body,
    queryParams,
    params,
  };
}

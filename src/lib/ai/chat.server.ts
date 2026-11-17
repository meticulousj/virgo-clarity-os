import type { ModelMessage } from "ai";

import { createResponsesCall } from "./responses.server.ts";

export function streamGatewayChat(
  request: Request,
  config: { baseURL: string; apiKey: string; model: string },
  messages: ModelMessage[],
  instructions?: string,
) {
  return createResponsesCall(request, config, messages, instructions).response();
}

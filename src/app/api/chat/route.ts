import { mastra } from "@/mastra";
import { NextResponse } from "next/server";
import { toAISdkFormat } from "@mastra/ai-sdk";
import { convertMessages } from "@mastra/core/agent";
import { createUIMessageStreamResponse } from "ai";

const myAgent = mastra.getAgent("weatherAgent");

export async function POST(req: Request) {
  const { messages } = await req.json();

  const stream = await myAgent.stream(messages, {
    memory: {
      thread: "example-user-id",
      resource: "weather-chat",
    },
  });

  return createUIMessageStreamResponse({
    stream: toAISdkFormat(stream, { from: "agent" }),
  })
}

export async function GET() {
  const memory = await myAgent.getMemory();
  const response = await memory?.query({
    threadId: "example-user-id",
    resourceId: "weather-chat",
  });

  const uiMessages = convertMessages(response?.uiMessages ?? []).to("AIV5.UI");
  return NextResponse.json(uiMessages);
}

import { discover } from "@osaurus/sdk";
import OpenAI from "openai";

async function streamExample() {
  try {
    const instance = await discover();

    const client = new OpenAI({
      baseURL: `${instance.url}/v1`,
      apiKey: "not-needed",
    });

    const models = await client.models.list();
    const modelIds = Array.from(models.data).map((m) => m.id);

    if (modelIds.length === 0) {
      console.error("No models available");
      return;
    }

    const selectedModel = modelIds[0];
    if (!selectedModel) {
      console.error("No model available");
      return;
    }
    console.log(`Using model: ${selectedModel}\n`);

    const stream = await client.chat.completions.create({
      model: selectedModel,
      messages: [{ role: "user", content: "Tell me a joke in one sentence." }],
      stream: true,
    });

    process.stdout.write("Response: ");
    for await (const chunk of stream) {
      process.stdout.write(chunk.choices[0]?.delta?.content || "");
    }
    console.log("\n\nStream complete!");
  } catch (error) {
    console.error("Error:", error);
  }
}

streamExample();

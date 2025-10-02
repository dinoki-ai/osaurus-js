import { discover } from "@osaurus/sdk";
import OpenAI from "openai";

async function main() {
  try {
    const instance = await discover();
    console.log(`Connecting to Osaurus at ${instance.url}`);

    const client = new OpenAI({
      baseURL: `${instance.url}/v1`,
      apiKey: "not-needed-for-local",
    });

    const models = await client.models.list();
    const modelIds = Array.from(models.data).map((m) => m.id);
    console.log("Available models:", modelIds);

    if (modelIds.length === 0) {
      console.error("No models available");
      return;
    }

    const selectedModel = modelIds[0];
    if (!selectedModel) {
      console.error("No model available");
      return;
    }
    console.log(`\nUsing model: ${selectedModel}`);

    const completion = await client.chat.completions.create({
      model: selectedModel,
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Say hello in one sentence." },
      ],
      temperature: 0.7,
      max_tokens: 50,
    });

    console.log("\nResponse:", completion.choices[0]?.message?.content);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error:", error.message);
    }
  }
}

main();

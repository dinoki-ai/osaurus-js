import { discover, type OsaurusInstance } from "@osaurus/sdk";

async function main() {
  try {
    const instance: OsaurusInstance = await discover();
    console.log("Found Osaurus at:", instance.url);
    console.log("Instance ID:", instance.instanceId);
    console.log("Network exposed:", instance.exposeToNetwork);

    const response = await fetch(`${instance.url}/v1/models`);
    const models = await response.json();
    console.log("\nAvailable models:", models);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error:", error.message);
    }
  }
}

main();

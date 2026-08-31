import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({ path: ".env.local" });

async function main() {
  /*
   * IMPORTANT:
   * mongoose.ts checks MONGODB_URI while it is imported,
   * so it must be imported AFTER dotenv loads .env.local.
   */
  const { connectDB } = await import("../../../src/lib/mongoose");
  const { inspectIdState } = await import("./state");

  await connectDB();

  const entityTypes = [
    "hero",
    "event",
    "battle",
    "kingdom",
    "source",
    "image",
    "place",
    "quote",
    "book",
    "historicalPersonality",
    "historicalPeriod",
  ];

  console.log("");
  console.log("========================================");
  console.log("VEERBHARAT DATABASE ID STATE");
  console.log("========================================");

  for (const entityType of entityTypes) {
    const state = await inspectIdState(entityType);

    console.log(
      `${entityType.padEnd(24)} ` +
      `highest=${String(state.highestId ?? "NONE").padEnd(12)} ` +
      `next=${state.nextId.padEnd(12)} ` +
      `counter=${String(state.counterValue ?? "NONE").padEnd(5)} ` +
      `${state.counterStatus}`
    );
  }

  await mongoose.disconnect();

  console.log("");
  console.log("ID STATE CHECK COMPLETE");
}

main().catch(async (error) => {
  console.error("");
  console.error("ID STATE CHECK FAILED");
  console.error(error);

  try {
    await mongoose.disconnect();
  } catch {}

  process.exit(1);
});

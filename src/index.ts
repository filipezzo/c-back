import { app } from "./app.js";

const fastify = app();

fastify.get("/healthcheck", async () => {
  return { status: "ok" };
});

async function main() {
  try {
    const host = await fastify.listen({ port: 3000, host: "0.0.0.0" });
    console.log(`server ready at ${host}`);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

main();

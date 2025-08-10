import type { FastifyInstance } from "fastify";
import { handlerUserRegister } from "./user-controller.js";

export async function userRoutes(fastity: FastifyInstance) {
  fastity.post("/", handlerUserRegister);
}

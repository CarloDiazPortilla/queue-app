import "dotenv/config";
import env from "env-var"

export class EnvironmentAdapter {
  static readonly envs = {
    PORT: env.get("PORT").required().asPortNumber(),
  }
}
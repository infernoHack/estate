import type { VercelRequest, VercelResponse } from "@vercel/node";
import app from "../src/index";

export default function (request: VercelRequest, response: VercelResponse) {
  return app(request, response);
}

import { jsonOk } from "@/lib/api";

export function GET() {
  return jsonOk({
    ok: true,
    service: "mystic-ai-studio",
    timestamp: new Date().toISOString()
  });
}

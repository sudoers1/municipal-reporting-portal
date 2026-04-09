import { auth } from "@/lib/auth"; //point to your auth file (when we merge auth files this will point to the merged one)
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);
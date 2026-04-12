console.log("DEBUG ID:", process.env.LINKEDIN_CLIENT_ID);

import {auth} from "../../../../lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
export const { GET, POST } = toNextJsHandler(auth);
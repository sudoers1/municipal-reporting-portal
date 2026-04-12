import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient(); //this never changes regardless of the provider

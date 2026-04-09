import { betterAuth } from "better-auth";
import Database from "better-sqlite3";

export const auth = betterAuth({
  database: new Database("./database.db"),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,    // 70557103088-3mlrhdagdp00foasfsccmq45oenah1i6.apps.googleusercontent.com
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
});
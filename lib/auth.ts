import { betterAuth } from "better-auth";
import Database from "better-sqlite3";

export const auth = betterAuth({
    database: new Database("./database.db"), //same as above
  socialProviders: {
    github: {
      //change to your provider (clientId and clientSecret is all we need i think)
clientId: process.env.OAUTH_GITHUB_CLIENT_ID!,
clientSecret: process.env.OAUTH_GITHUB_CLIENT_SECRET!,
    },
  },
});

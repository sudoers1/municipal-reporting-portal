import { betterAuth } from "better-auth";
import Database from "better-sqlite3"; //this will change once we get the postgres server up

export const auth = betterAuth({
  database: new Database("./database.db"), //same as above
  socialProviders: {
    facebook: {
      //change to your provider (clientId and clientSecret is all we need i think)
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    },
  },
});

import { betterAuth } from "better-auth";

export const auth = betterAuth({
  socialProviders: {
    discord: {
      //change to your provider (clientId and clientSecret is all we need i think)
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    },
  },
});
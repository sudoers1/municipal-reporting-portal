import { betterAuth } from "better-auth";
import { customSession } from 'better-auth/plugins';
import { getUserRole, setResident } from "./db/users";
import { neon } from "@neondatabase/serverless";
import { Pool } from "pg"; //this will change once we get the postgres server up

export const auth = betterAuth({

  database: new Pool({
    connectionString: process.env.NEON_CONNECTION_STRING,
  }), //same as above
  socialProviders: {
    facebook: {
      //change to your provider (clientId and clientSecret is all we need i think)
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    },
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    },
    linkedin: {
      clientId: process.env.LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.LINKEDIN_SECRET!,
    },
    github: {
      //change to your provider (clientId and clientSecret is all we need i think)
      clientId: process.env.OAUTH_GITHUB_CLIENT_ID!,
      clientSecret: process.env.OAUTH_GITHUB_CLIENT_SECRET!,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await setResident(user.id);
        },
      },
    },
  },
  plugins: [
    customSession(async ({ user, session }) => {
      const role = await getUserRole(user.id);
      return {
        user: {
          ...user,
          role,
        },
        session,
      };
    }),
  ],
  session: {
    expiresIn: 60 * 60 * 2, // 2 hours
    updateAge: 60 * 60 * 2,     // refresh session every 2h
    cookie: {
      // name: "muni-session",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    },
  },
});



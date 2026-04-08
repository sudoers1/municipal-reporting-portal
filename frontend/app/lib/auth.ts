console.log("CHECKING ENV:", process.env.LINKEDIN_CLIENT_ID ? "LOADED" : "MISSING");

import { betterAuth} from "better-auth";
import { nextCookies } from "better-auth/next-js";
import Database from "better-sqlite3";

export const auth = betterAuth({
    database: new Database("./sqlite.db"),
    socialProviders: {
        linkedin: { 
            clientId:  "77b02c8qyuphu2",
            clientSecret: "WPL_AP1.WQanKtpVCvkCFYXE.m9FAVg==", 
        }, 
    },
    plugins: [nextCookies()] 
})

// types/next-auth.d.ts
import { Session } from "next-auth";
import { JwtPayload } from "jsonwebtoken";

declare module "next-auth" {
    interface Session {
        id_token?: string;
        access_token?: string;
        decodedToken?: JwtPayload; // Add the decoded token to the session type
    }
}

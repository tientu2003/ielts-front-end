// types/next-auth.d.ts
import { Session } from "next-auth";

declare module "next-auth" {
    interface Session {
        id_token?: string; // Add the id_token property to the session
    }
}

import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth-options";

export async function getSessionUser() {
    const session = await getServerSession(authOptions);
    return session?.decodedToken?.sub; // user contains `id`, `email`, etc.
}

export async function getAccessToken() {
    const session = await getServerSession(authOptions);
    return session?.access_token;
}

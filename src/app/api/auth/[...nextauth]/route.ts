import NextAuth from "next-auth"

import {authOptions} from "@/components/util/auth-options"; // Import jsonwebtoken to decode the JWT

const handler = NextAuth(authOptions);


export { handler as GET, handler as POST }
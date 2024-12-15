import NextAuth from "next-auth"
import KeycloakProvider from "next-auth/providers/keycloak";

const handler = NextAuth({
    providers: [
        KeycloakProvider({
            clientId: process.env.KEYCLOAK_ID as string,
            clientSecret: process.env.KEYCLOAK_SECRET as string,
            issuer: process.env.KEYCLOAK_ISSUER,
        })
    ],
    callbacks: {
        async jwt({ token, account }) {
            if (account && account.id_token) {
                token.id_token = account.id_token; // Store the id_token in the session JWT
            }
            return token;
        },
        async session({ session, token }) {
            session.id_token = token.id_token as string; // Attach the id_token to the session object
            return session;
        },
    },
})

export { handler as GET, handler as POST }
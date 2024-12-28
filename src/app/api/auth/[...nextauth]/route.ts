import NextAuth, {Session} from "next-auth"
import KeycloakProvider from "next-auth/providers/keycloak";
import jwt,{JwtPayload} from "jsonwebtoken"; // Import jsonwebtoken to decode the JWT
export const authOptions = {
    providers: [
        KeycloakProvider({
            clientId: process.env.KEYCLOAK_ID as string,
            clientSecret: process.env.KEYCLOAK_SECRET as string,
            issuer: process.env.KEYCLOAK_ISSUER,
        }),
    ],
    callbacks: {
        async jwt({ token , account }:{token:any, account:any}) {
            if (account && account.id_token) {
                token.id_token = account.id_token; // Store the id_token in the session JWT
            }

            if (account && account.access_token) {
                token.access_token = account.access_token;
                token.decoded_token = jwt.decode(account.access_token);
            }

            return token;
        },
        async session({ session, token }:{session:Session, token:any}) {
            session.id_token = token.id_token as string; // Attach the id_token to the session object
            session.access_token = token.access_token as string;
            session.decodedToken = token.decoded_token as JwtPayload;
            return session;
        },
    },
};

const handler = NextAuth(authOptions);


export { handler as GET, handler as POST }
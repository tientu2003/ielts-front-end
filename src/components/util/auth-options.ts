import KeycloakProvider from "next-auth/providers/keycloak";
import jwt, {JwtPayload} from "jsonwebtoken";
import {Session} from "next-auth";

export const authOptions = {
    providers: [
        KeycloakProvider({
            clientId: process.env.KEYCLOAK_ID as string,
            clientSecret: process.env.KEYCLOAK_SECRET as string,
            issuer: process.env.KEYCLOAK_ISSUER,
        }),
    ],
    callbacks: {
        async jwt({token, account}: { token: any, account: any }) {
            if (account && account.id_token) {
                token.id_token = account.id_token;
            }

            if (account && account.access_token) {
                token.access_token = account.access_token;
                token.refresh_token = account.refresh_token;
                token.decoded_token = jwt.decode(account.access_token);

                // Check if access token is expired
                const decodedToken = token.decoded_token as JwtPayload;
                if (decodedToken && decodedToken.exp) {
                    const expirationTime = decodedToken.exp * 1000; // Convert to milliseconds
                    const currentTime = Date.now();

                    if (currentTime >= expirationTime) {
                        try {
                            // Token is expired, attempt to refresh
                            const response = await fetch(`${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/token`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/x-www-form-urlencoded',
                                },
                                body: new URLSearchParams({
                                    grant_type: 'refresh_token',
                                    client_id: process.env.KEYCLOAK_ID as string,
                                    client_secret: process.env.KEYCLOAK_SECRET as string,
                                    refresh_token: token.refresh_token
                                })
                            });

                            const tokens = await response.json();

                            if (!response.ok) throw new Error('Failed to refresh token');

                            // Update token with new values
                            token.access_token = tokens.access_token;
                            token.refresh_token = tokens.refresh_token;
                            token.decoded_token = jwt.decode(tokens.access_token);
                        } catch (error) {
                            console.error('Error refreshing token:', error);
                            return null; // Force re-authentication
                        }
                    }
                }
            }
            return token;
        },
        async session({session, token}: { session: Session, token: any }) {
            session.id_token = token.id_token as string;
            session.access_token = token.access_token as string;
            session.decodedToken = token.decoded_token as JwtPayload;
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};
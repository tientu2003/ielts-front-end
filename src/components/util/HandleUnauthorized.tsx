'use client';

import { toaster } from "@/components/ui/toaster";
import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";

export default function HandleUnauthorized() {
    const { data: session } = useSession();

    useEffect(() => {
        toaster.create({
            description: `You should relogin to see result of this exam.`,
            type: "error",
        });

        const idToken = session?.id_token;
        if (idToken) {
            signOut({
                redirect: false
            }).then(() => {
                const logoutUrl = process.env.NEXT_PUBLIC_KEYCLOAK_LOGOUT_URL;
                window.location.href = `${logoutUrl}?id_token_hint=${idToken}&post_logout_redirect_uri=${window.location.origin}`;
            });
            window.location.href = '/auth/login';
        } else {
            console.error("ID Token not found");
        }
    }, []);

    return null;
}
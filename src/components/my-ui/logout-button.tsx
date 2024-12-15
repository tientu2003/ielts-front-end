import { signOut, useSession } from "next-auth/react";
import {Button} from "@chakra-ui/react";

const LogoutButton = () => {

    const { data: session } = useSession();
    const idToken = session?.id_token;

    const handleLogout = () => {
        // Ensure this is the actual ID token
        if (idToken) {
            signOut({
                redirect: false // Prevent default NextAuth redirect
            }).then(() => {
                const logoutUrl = process.env.NEXT_PUBLIC_KEYCLOAK_LOGOUT_URL;
                window.location.href = `${logoutUrl}?id_token_hint=${idToken}&post_logout_redirect_uri=${window.location.origin}`;
            });
        } else {
            console.error("ID Token not found");
        }
    }

    return  <Button onClick={()=>
        handleLogout()}
                    variant={"surface"}
                    minWidth={"sm"}
                    colorPalette={"blue"}>
        Logout
    </Button>
}


export default LogoutButton;
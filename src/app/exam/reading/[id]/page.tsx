import { getServerSession } from "next-auth";
import {authOptions} from "@/components/util/auth-options"; // Import jsonwebtoken to decode the JWT
import {AbsoluteCenter, Box, Heading} from "@chakra-ui/react";
import ReadingExamComponent from "@/components/my-ui/reading/reading-exam";
import HandleUnauthorized from "@/components/util/HandleUnauthorized";
const ReadingExamPage = async ({params,}:
                         { params: Promise<{ id: string }>})  =>{
    const id = (await params).id

    const session = await getServerSession(authOptions)

    if(!session){
        return (<Box>
            <AbsoluteCenter>
                <Heading>
                    Please login to access the practice exam!!
                </Heading>
            </AbsoluteCenter>
        </Box>)

    }
    try{
        const response = await fetch(`${process.env.NEXT_PUBLIC_READING_SERVICE_URL}/api/reading/data/${id}`, {
            method: 'GET',  // Change to 'POST', 'PUT', or other methods as needed
            headers: {
                'Content-Type': 'application/json',  // Ensure the server knows you're sending JSON
                'Authorization': `Bearer ${session.access_token}`,  // Add Bearer token to the request headers
            }
        });

        if(response.status === 401){
            return <AbsoluteCenter>
                Login is expired, please login again.
                <HandleUnauthorized />
            </AbsoluteCenter>
        }

        const data = await response.json();
        return <ReadingExamComponent data={data.passages as any} />

    }catch (error){
        console.log(error)
        return (<Box>
            <AbsoluteCenter>
                <Heading>
                    Internal Error!!
                </Heading>
            </AbsoluteCenter>
        </Box>)
    }


}

export default ReadingExamPage;
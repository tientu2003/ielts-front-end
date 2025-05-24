import { getServerSession } from "next-auth";
import { authOptions } from "@/components/util/auth-options";
import { AbsoluteCenter, Box, Heading } from "@chakra-ui/react";
import SpeakingExamComponent from "@/components/my-ui/speaking/speaking-exam";
import HandleUnauthorized from "@/components/util/HandleUnauthorized";

const SpeakingExamPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <Box>
        <AbsoluteCenter>
          <Heading>
            Please login to access the speaking exam!!
          </Heading>
        </AbsoluteCenter>
      </Box>
    );
  }

  try {
    'use server'
    const response = await fetch(`${process.env.NEXT_PUBLIC_SPEAKING_SERVICE_URL}/api/speaking/data/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      }
    });

    if (response.status === 401) {
      return (
        <AbsoluteCenter>
          Login is expired, please login again.
          <HandleUnauthorized />
        </AbsoluteCenter>
      );
    }

    const data = await response.json();
    
    return (
      <SpeakingExamComponent 
        data={data} 
        userId={session.decodedToken?.sub || ''} 
        accessToken={session.access_token as string}
        speakingServiceUrl={process.env.NEXT_PUBLIC_SPEAKING_SERVICE_URL!}
      />
    );
  } catch (error) {
    console.error(error);
    return (
      <Box>
        <AbsoluteCenter>
          <Heading>
            Internal Error!!
            {error instanceof Error ? error.message : 'Unknown error occurred'}
          </Heading>
        </AbsoluteCenter>
      </Box>
    );
  }
};

export default SpeakingExamPage;
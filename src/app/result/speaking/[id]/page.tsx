import { getServerSession } from "next-auth";
import { authOptions } from "@/components/util/auth-options";
import { AbsoluteCenter, Box, Heading } from "@chakra-ui/react";
import SpeakingResult from "@/components/my-ui/speaking/speaking-result";
import HandleUnauthorized from "@/components/util/HandleUnauthorized";
import {SpeakingDetailResult} from "@/components/util/speaking-types";

const SpeakingResultPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <Box>
        <AbsoluteCenter>
          <Heading>
            Please login to access the speaking exam result!!
          </Heading>
        </AbsoluteCenter>
      </Box>
    );
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SPEAKING_SERVICE_URL}/api/speaking/user/answer/${id}`, {
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

    const data: SpeakingDetailResult = await response.json();
    
    return (
      <SpeakingResult 
        data={data}
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

export default SpeakingResultPage;
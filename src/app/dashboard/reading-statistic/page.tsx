import {
    AbsoluteCenter,
    Box,
    Heading
} from "@chakra-ui/react";
import {getServerSession} from "next-auth";
import {authOptions} from "@/components/util/auth-options";
import React from "react";

const ReadingStatisticPage = async () => {
    const session = await getServerSession(authOptions)

    if (!session) {
        return (<Box>
            <AbsoluteCenter>
                <Heading>
                    Please login to access the progress tracking!!
                </Heading>
            </AbsoluteCenter>
        </Box>)
    }

    try {
        return <Box>
            Reading Statistic
        </Box>
    } catch (e) {
        return (<AbsoluteCenter>
            Internal Error
        </AbsoluteCenter>)
    }
}

export default ReadingStatisticPage;
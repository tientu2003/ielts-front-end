import {Stack,   Skeleton, SkeletonText} from "@chakra-ui/react";
import React from "react";



const DashBoardLoading =  () => {
    return <Stack>
        <Skeleton h={'40vh'}/>
        <SkeletonText />
        <Skeleton h={'40vh'}/>
    </Stack>
}

export default DashBoardLoading;
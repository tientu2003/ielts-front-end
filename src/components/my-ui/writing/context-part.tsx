import {Card, Center, Heading, HStack, Text} from "@chakra-ui/react";
import Image from "next/image";
import {IoInformationCircleSharp} from "react-icons/io5";

interface IProps {
    task:number,
    context:string,
    name:string,
    url:string,
}

const ContextPart = ({task, context, url, name}:IProps) =>{

    return <Card.Root h={'100%'} shadow={'lg'}>
        <Card.Header>
            <Card.Title fontSize="2xl">
                Writing Task {task == 1? "1":"2"}
            </Card.Title>
            <Text>
                You should spend about {task == 1? "20" : "40"} minutes on this task.
            </Text>
            <Text fontWeight={'semibold'}  fontSize="2xl" color={'green.600'}>{name}</Text>

            <Text>
                {context}
            </Text>
        </Card.Header>
        <Card.Body>
            <Center>
                {url && <Image src={url} alt={"logo"} width={600} height={600}/>}
            </Center>
        </Card.Body>
        <Card.Footer>
            <HStack bgColor={"gray.100"}
                    rounded={'2xs'}
                    borderRadius={'xl'}
                    p={2}
                    mr={'5'}
                    w={'full'}
                    display={'flex'}>
                <IoInformationCircleSharp size={22.5}/>
                <Text>Write at least {task == 1? "150" : "250"} words</Text>
            </HStack>
        </Card.Footer>
    </Card.Root>
}

export default ContextPart;
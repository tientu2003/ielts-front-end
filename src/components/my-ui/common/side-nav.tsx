import {Button, Card, Center, Text, VStack} from "@chakra-ui/react";
import {Avatar} from "@/components/ui/avatar";
import {MdManageAccounts} from "react-icons/md";
import {LuHistory} from "react-icons/lu";
import {FaAssistiveListeningSystems, FaBookReader} from "react-icons/fa";
import {TbWriting} from "react-icons/tb";
import React from "react";


interface SideNavProps {
    name:string,
}

const SideNav = ({name}:SideNavProps) => {
    return   <Card.Root shadow={'lg'} variant={'elevated'} position="sticky" top="20px">
        <Card.Header>
            <Center>
                <Avatar size={'2xl'} name={name}/>
            </Center>
            <Center>
                <Text fontWeight={'bold'} fontSize={'xl'}>{name}</Text>
            </Center>
        </Card.Header>
        <Card.Body>
            <VStack>
                <a href={'/dashboard/account'} style={{width: '100%', justifyContent: 'left'}}>
                    <Button variant={"ghost"}
                            fontWeight={'bold'}
                            fontSize={'xl'}
                            w={'full'}
                            colorPalette={'green'}
                            justifyContent={'left'}>
                        <MdManageAccounts/>
                        Account
                    </Button>
                </a>
                <a href={'/dashboard/history'} style={{width: '100%', justifyContent: 'left'}}>
                    <Button
                        variant={"ghost"}
                        fontWeight={'bold'}
                        fontSize={'xl'}
                        w={'full'}
                        colorPalette={'green'}
                        justifyContent={'left'}>
                        <LuHistory/>
                        History
                    </Button>
                </a>
                <a href={'/dashboard/listening-statistic'}
                   style={{width: '100%', justifyContent: 'left'}}>
                    <Button
                        variant={"ghost"}
                        fontWeight={'bold'}
                        fontSize={'xl'} w={'full'}
                        colorPalette={'green'}
                        justifyContent={'left'}>
                        <FaAssistiveListeningSystems/>
                        Listening Statistic
                    </Button>
                </a>
                <a href={'/dashboard/reading-statistic'}
                   style={{width: '100%', justifyContent: 'left'}}>
                    <Button
                        variant={"ghost"}
                        fontWeight={'bold'}
                        fontSize={'xl'}
                        w={'full'}
                        colorPalette={'green'}
                        justifyContent={'left'}>
                        <FaBookReader/>
                        Reading Statistic
                    </Button>
                </a>
                <a href={'/dashboard/writing-statistic'}
                   style={{width: '100%', justifyContent: 'left'}}>
                    <Button
                        variant={"ghost"}
                        fontWeight={'bold'}
                        fontSize={'xl'}
                        w={'full'}
                        colorPalette={'green'}
                        justifyContent={'left'}>
                        <TbWriting/>
                        Writing Statistic
                    </Button>
                </a>
            </VStack>
        </Card.Body>
    </Card.Root>

}

export default SideNav;
import React from "react";
import {Box, GridItem, SimpleGrid, Card, Button, Center, VStack, Text} from "@chakra-ui/react";
import TopNav from "@/components/my-ui/top-nav";
import {Avatar} from "@/components/ui/avatar";
import {getServerSession} from "next-auth";
import {authOptions} from "@/components/util/auth-options";
import {MdManageAccounts} from "react-icons/md";
import {LuHistory} from "react-icons/lu";
import {FaAssistiveListeningSystems} from "react-icons/fa";
import {FaBookReader} from "react-icons/fa";
import {TbWriting} from "react-icons/tb";

export default async function ProcessLayout({children,}: Readonly<{ children: React.ReactNode; }>) {
    const session = await getServerSession(authOptions)
    return (
        <Box>
            <TopNav/>
            <SimpleGrid columns={4} gap={'5%'} mt={'5%'} ml={'5%'} mr={'5%'}>
                <GridItem colSpan={1}>
                    <Card.Root shadow={'lg'} variant={'elevated'} position="sticky" top="20px">
                        <Card.Header>
                            <Center>
                                <Avatar size={'2xl'} name={session?.user?.name as string}/>
                            </Center>
                            <Center>
                                <Text fontWeight={'bold'} fontSize={'xl'}>{session?.user?.name}</Text>
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
                </GridItem>
                <GridItem colSpan={3}>
                    {children}
                </GridItem>
            </SimpleGrid>
        </Box>
    );
}
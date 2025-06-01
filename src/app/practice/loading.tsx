import TopNav from "@/components/my-ui/top-nav";
import {
    Box,
    CheckboxGroup,
    Fieldset,
    GridItem,
    Heading,
    HStack,
    Input,
    SimpleGrid
} from "@chakra-ui/react";
import {Flex, Skeleton} from "@chakra-ui/react"
import {InputGroup} from "@/components/ui/input-group";
import {LuSearch} from "react-icons/lu";
import {Checkbox} from "@/components/ui/checkbox";


export default function Loading() {
    return     <Box>
        <TopNav/>
        <Flex pt={4} pl={10} pr={10} justify="space-between">
            <Heading fontSize={'4xl'}>
                Practice Exam Library
            </Heading>
            <HStack gap="10" width="350px">
                <InputGroup shadow={'md'}
                            flex="1"
                            startElement={<LuSearch/>}
                >
                    <Input placeholder="Search practice test..." disabled={true} />
                </InputGroup>
            </HStack>
        </Flex>
        <SimpleGrid h={'70%'} w={'100%'} columns={5} gap={3} pl={10} pr={10} pt={5} pb={5}>
            <GridItem colSpan={1}>
                <Box bg="bg" shadow="md" borderRadius="md" p={10}>
                    <Fieldset.Root>
                        <CheckboxGroup
                            defaultValue={[]}
                            name="Types"
                            disabled={true}
                        >
                            <Fieldset.Legend fontSize="2xl" mb="2" fontWeight="bold">
                                Select types
                            </Fieldset.Legend>
                            <Fieldset.Content>
                                <Checkbox value="listening" colorPalette={'blue'} variant={'subtle'}>
                                    Listening
                                </Checkbox>
                                <Checkbox value="reading" colorPalette={'green'} variant={'subtle'}>
                                    Reading
                                </Checkbox>
                                <Checkbox value="writing" colorPalette={'purple'} variant={'subtle'}>
                                    Writing
                                </Checkbox>
                                <Checkbox value="speaking" colorPalette={'orange'} variant={'subtle'}>
                                    Speaking
                                </Checkbox>
                            </Fieldset.Content>
                        </CheckboxGroup>
                    </Fieldset.Root>
                </Box>
            </GridItem>
            <GridItem colSpan={4}>
                <SimpleGrid columns={3} gap={5}>
                    {[0,1,2,3,4,5].map( (index) =>{
                        return <Skeleton key={index}
                                         variant="shine"
                                         height={'30vh'}
                                         loading={true}
                        />
                    })}
                </SimpleGrid>
            </GridItem>
        </SimpleGrid>
    </Box>
}
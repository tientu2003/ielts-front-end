'use client'
import PracticeTestList, {BasicExamData} from "@/components/my-ui/practice/practice-test-list";
import {useState} from "react";
import {
    Box,
    Center,
    CheckboxGroup,
    Fieldset,
    Flex,
    GridItem,
    Heading,
    HStack,
    Input,
    SimpleGrid
} from "@chakra-ui/react";
import TopNav from "@/components/my-ui/top-nav";
import {InputGroup} from "@/components/ui/input-group";
import {LuSearch} from "react-icons/lu";
import {Checkbox} from "@/components/ui/checkbox";
import {
    PaginationItems,
    PaginationNextTrigger,
    PaginationPrevTrigger,
    PaginationRoot
} from "@/components/ui/pagination";
const pageSize = 6;

function ClientPracticePageComponent({initialData}: { initialData: BasicExamData[] }) {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

    const handleCheckboxChange = (values: string[]) => {
        setSelectedTypes(values);
        setPage(1);
    };

    const filteredData = initialData.filter((item) => {
        const matchesSearch = item.testName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = selectedTypes.length === 0 || selectedTypes.includes(item.type);
        return matchesSearch && matchesType;
    });

    const count = filteredData.length;
    const startRange = (page - 1) * pageSize;
    const endRange = startRange + pageSize;
    const displayData = filteredData.slice(startRange, endRange);

    return (<Box>
        <TopNav/>
        <Flex pt={4} pl={10} pr={10} justify="space-between">
            <Heading fontSize={'4xl'}>
                Practice Exam Library
            </Heading>
            <Flex justify={'flex-end'}>
                <HStack gap="10" width="350px">
                    <InputGroup shadow={'md'}
                                flex="1"
                                startElement={<LuSearch/>}
                    >
                        <Input placeholder="Search practice test..." value={searchTerm}
                               onChange={(e) => setSearchTerm(e.target.value)}/>
                    </InputGroup>
                </HStack>
            </Flex>
        </Flex>
        <SimpleGrid h={'70%'} w={'100%'} columns={5} gap={3} pl={10} pr={10} pt={5} pb={5}>
            <GridItem colSpan={1}>
                <Box bg="bg" shadow="md" borderRadius="md" p={10}>
                    <Fieldset.Root>
                        <CheckboxGroup
                            defaultValue={[]}
                            name="Types"
                            value={selectedTypes}
                            onValueChange={handleCheckboxChange}
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
            <PracticeTestList practiceData={displayData}/>
            </GridItem>
        </SimpleGrid>
        {displayData.length !== 0 && <Center>
            <PaginationRoot count={count} pageSize={pageSize} defaultPage={1} onPageChange={(e) => setPage(e.page)}>
                <HStack>
                    <PaginationPrevTrigger/>
                    <PaginationItems/>
                    <PaginationNextTrigger/>
                </HStack>
            </PaginationRoot>
        </Center>}
    </Box>)
}

export default ClientPracticePageComponent;
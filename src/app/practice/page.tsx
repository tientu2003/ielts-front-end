'use client'
import {
    Box,
    Flex,
    Heading,
    HStack,
    Input,
    GridItem,
    SimpleGrid, Center,
    CheckboxGroup, Fieldset
} from "@chakra-ui/react";
import TopNav from "@/components/my-ui/top-nav";
import '@fontsource/dancing-script'; // Import the Dancing Script font
import '@fontsource/lexend';
import {InputGroup} from "@/components/ui/input-group";
import {LuSearch} from "react-icons/lu";
import {
    PaginationItems,
    PaginationNextTrigger,
    PaginationPrevTrigger,
    PaginationRoot,
} from "@/components/ui/pagination"
import { Checkbox } from "@/components/ui/checkbox"
import PracticeTestList, {PracticeTestData} from "@/components/my-ui/practice-test-list";
import {useState, useEffect} from "react";
const pageSize = 6

interface ReadingListResponse {
    id: string;
    name: string;
}
interface ListeningListResponse {
    id: string;
    testName: string;
}

const PracticePage = () =>{

    const [data, setData] = useState<PracticeTestData[]>([])

    useEffect(() => {
        async function fetchData() {
            const readRes = await fetch(`${process.env.NEXT_PUBLIC_READING_SERVICE_URL}/public/api/reading/list`)
            const readData:ReadingListResponse[] = await readRes.json()
            let resData:PracticeTestData[] = []
            readData.map(d => {
                resData.push({id:d.id, name:d.name, type:"reading"})
            })
            const listRes = await fetch(`${process.env.NEXT_PUBLIC_LISTENING_SERVICE_URL}/public/api/listening/list`)
            const listenData:ListeningListResponse[] = await listRes.json()
            listenData.map(d => {
                resData.push({id:d.id, name:d.testName, type:"listening"})
            })
            setData(resData)
        }
        fetchData().then(r => console.log(r))

    }, [])

    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState(""); // State for search input
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]); // State for selected types in checkbox

    // Handle checkbox changes
    const handleCheckboxChange = (values: string[]) => {
        setSelectedTypes(values);
        setPage(1); // Reset page when filters change
    };

    // Filter data based on search term and selected types
    const filteredData = data.filter((item) => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = selectedTypes.length === 0 || selectedTypes.includes(item.type);
        return matchesSearch && matchesType;
    });

    const count = filteredData.length;

    // Paginate the filtered data
    const startRange = (page - 1) * pageSize;
    const endRange = startRange + pageSize;
    const displayData = filteredData.slice(startRange, endRange);

    return (<Box>
        <TopNav/>
        <Flex padding={10} justify="space-between">
            <Heading fontSize={'4xl'}>
                Practice Exam Library
            </Heading>
            <Flex justify={'flex-end'}>
                <HStack gap="10" width="350px">
                    <InputGroup
                        flex="1"
                        startElement={<LuSearch />}
                    >
                        <Input placeholder="Search practice test..." value={searchTerm}
                               onChange={(e) => setSearchTerm(e.target.value)} />
                    </InputGroup>
                </HStack>
            </Flex>
        </Flex>
        <SimpleGrid h={'2xl'} w={'100%'} columns={5} gap={3} p={10}>
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
                <PracticeTestList practiceData={displayData} />
            </GridItem>
        </SimpleGrid>
        <Center>
            <PaginationRoot count={count} pageSize={pageSize} defaultPage={1} onPageChange={(e) => setPage(e.page)}>
                <HStack>
                    <PaginationPrevTrigger />
                    <PaginationItems />
                    <PaginationNextTrigger />
                </HStack>
            </PaginationRoot>
        </Center>

    </Box>)
}

export default PracticePage;
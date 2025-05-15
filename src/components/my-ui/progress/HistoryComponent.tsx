'use client'
import {HistoryData} from "@/app/dashboard/history/page";
import React, {useState} from "react";
import {
    Box,
    Input,
    Portal,
    Select,
    SimpleGrid,
    Field,
    Text,
    VStack,
    createListCollection,
    Pagination,
    ButtonGroup,
    Flex,
    Button,
    Center, IconButton,
} from "@chakra-ui/react";
import HistoryRecord from "@/components/my-ui/progress/HistoryRecord";
import {HiChevronLeft, HiChevronRight} from "react-icons/hi2";
import {HiChevronDown, HiChevronUp} from "react-icons/hi";

interface HistoryRecordProps {
    data: HistoryData[];
}

const HistoryComponent = ({data}: HistoryRecordProps) => {
    const pageSize = 10;
    const [searchName, setSearchName] = useState("");
    const [searchScore, setSearchScore] = useState<string[]>(["10"]);
    const [searchType, setSearchType] = useState<string[]>(['all']);
    const [searchTopic, setSearchTopic] = useState("");
    const [sortOrder, setSortOrder] = useState<string[]>(["desc"]);
    const [page, setPage] = useState(1)
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const filteredData = data.filter(item => {
        const nameMatch = item.name.toLowerCase().includes(searchName.toLowerCase());
        const scoreMatch = searchScore.includes("10") || searchScore.includes(item.score.toString());
        const typeMatch = searchType.includes('all') || searchType.includes(item.type);
        const topicMatch = !searchTopic || item.topics.some(t =>
            t.toLowerCase().includes(searchTopic.toLowerCase())
        );

        const itemDate = parseCustomDate(item.date);
        const dateMatch = (!startDate || itemDate >= new Date(startDate)) &&
            (!endDate || itemDate <= new Date(endDate));

        return nameMatch && scoreMatch && typeMatch && topicMatch && dateMatch;
    }).sort((a, b) => {
        const dateA = parseCustomDate(a.date).getTime();
        const dateB = parseCustomDate(b.date).getTime();
        return sortOrder.includes("desc") ? dateB - dateA : dateA - dateB;
    });

    // Calculate pagination values
    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / pageSize);

    // Get current page data
    const paginatedData = filteredData.slice(
        (page - 1) * pageSize,
        page * pageSize
    );

    return <Box shadow={'md'} p={'2%'} mb={'2%'}>
        <SimpleGrid columns={{sm:1, md:3}} gap={'2.5%'}>
            <Field.Root>
                <Field.Label>Name</Field.Label>
                <Input
                    placeholder="Search by name"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                />
            </Field.Root>
            <Select.Root collection={typeOptions}
                         value={searchType}
                         onValueChange={(target) => {
                             setSearchType(target.value);
                         }}>
                <Select.HiddenSelect/>
                <Select.Label>Search Skill</Select.Label>
                <Select.Control>
                    <Select.Trigger>
                        <Select.ValueText placeholder="Select skill"/>
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                        <Select.Indicator/>
                    </Select.IndicatorGroup>
                </Select.Control>
                <Portal>
                    <Select.Positioner>
                        <Select.Content>
                            {typeOptions.items.map((skill) => (
                                <Select.Item item={skill} key={skill.label}>
                                    {skill.label}
                                    <Select.ItemIndicator/>
                                </Select.Item>
                            ))}
                        </Select.Content>
                    </Select.Positioner>
                </Portal>
            </Select.Root>
            <Select.Root collection={scoreOptions}
                         value={searchScore}
                         onValueChange={(target) => {
                             setSearchScore(target.value);
                         }}>
                <Select.HiddenSelect/>
                <Select.Label>Search Score</Select.Label>
                <Select.Control>
                    <Select.Trigger>
                        <Select.ValueText placeholder="Select score"/>
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                        <Select.Indicator/>
                    </Select.IndicatorGroup>
                </Select.Control>
                <Portal>
                    <Select.Positioner>
                        <Select.Content>
                            {scoreOptions.items.map((score) => (
                                <Select.Item item={score} key={score.label}>
                                    {score.label}
                                    <Select.ItemIndicator/>
                                </Select.Item>
                            ))}
                        </Select.Content>
                    </Select.Positioner>
                </Portal>
            </Select.Root>
            <Field.Root>
                <Field.Label>Topic</Field.Label>
                <Input
                    placeholder="Search by topic"
                    value={searchTopic}
                    onChange={(e) => setSearchTopic(e.target.value)}
                />
            </Field.Root>
            <Field.Root>
                <Field.Label>From Date</Field.Label>
                <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
            </Field.Root>
            <Field.Root>
                <Field.Label>To Date</Field.Label>
                <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
            </Field.Root>

        </SimpleGrid>
        <Flex justifyContent={'right'} mt={2}>
            <Button  variant={"ghost"} w={'20%'}
                     onClick={() => { sortOrder.includes('asc')? setSortOrder(['desc']): setSortOrder(['asc'])}}
            >
                {sortOrder.includes('asc')?  'Sort Ascending' :'Sort Descending'}

                {sortOrder.includes('asc')?  <HiChevronUp/> :  <HiChevronDown/>}
            </Button >
        </Flex>

        <VStack mt={1}>
            {filteredData.length > 0 ? (
                paginatedData.map(record => (
                    <HistoryRecord key={record.id} {...record} />
                ))
            ) : (
                <Text>No records found</Text>
            )}

        </VStack>
        <Center mt={5}>
            {filteredData.length > 0 && (
                <Pagination.Root
                    count={totalItems}
                    pageSize={pageSize}
                    page={page}
                    onPageChange={(e) => setPage(e.page)}
                >
                    <ButtonGroup variant="ghost" size="sm">
                        <Pagination.PrevTrigger asChild>
                            <IconButton aria-label="Previous page">
                                <HiChevronLeft/>
                            </IconButton>
                        </Pagination.PrevTrigger>

                        <Pagination.Items
                            render={(page: { type: "page"; value: number; isSelected?: boolean }) => (
                                <IconButton
                                    key={page.value}
                                    aria-label={`Page ${page.value}`}
                                    variant={page.isSelected ? "outline" : "ghost"}
                                >
                                    {page.value}
                                </IconButton>
                            )}
                        />

                        <Pagination.NextTrigger asChild>
                            <IconButton aria-label="Next page">
                                <HiChevronRight/>
                            </IconButton>
                        </Pagination.NextTrigger>
                    </ButtonGroup>
                </Pagination.Root>
            )}
        </Center>

    </Box>
}

const typeOptions = createListCollection({
    items: [
        {label: "All", value: 'all'},
        {label: "Listening", value: "listening"},
        {label: "Reading", value: "reading"},
        {label: "Writing", value: "writing"},
        {label: "Speaking", value: "speaking"},
    ],
})

const scoreOptions = createListCollection({
    items: [
        {label: "All", value: "10"},
        {label: "4", value: "4"},
        {label: "4.5", value: "4.5"},
        {label: "5", value: "5"},
        {label: "5.5", value: "5.5"},
        {label: "6", value: "6"},
        {label: "6.5", value: "6.5"},
        {label: "7", value: "7"},
        {label: "7.5", value: "7.5"},
        {label: "8", value: "8"},
        {label: "8.5", value: "8.5"},
        {label: "9", value: "9"}]
})


function parseCustomDate(dateStr: string): Date {
    const [datePart, timePart] = dateStr.split(' ');
    const [day, month, year] = datePart.split('/');
    const [hours, minutes] = timePart.split(':');

    return new Date(
        parseInt(year),
        parseInt(month) - 1, // Months are 0-based in JavaScript
        parseInt(day),
        parseInt(hours),
        parseInt(minutes)
    );
}

export default HistoryComponent;
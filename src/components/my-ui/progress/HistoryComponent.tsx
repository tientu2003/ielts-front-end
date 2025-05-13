'use client'
import {HistoryData} from "@/app/dashboard/history/page";
import React, {useState} from "react";
import {Box, Input, Portal, Select, SimpleGrid, Field, Text, VStack, createListCollection} from "@chakra-ui/react";
import HistoryRecord from "@/components/my-ui/progress/HistoryRecord";

interface HistoryRecordProps {
    data: HistoryData[];
}

const HistoryComponent = ({data}: HistoryRecordProps) => {

    const [searchName, setSearchName] = useState("");
    const [searchScore, setSearchScore] = useState<string[]>(["10"]);
    const [searchType, setSearchType] = useState<string[]>([]);
    const [searchTopic, setSearchTopic] = useState("");
    const [sortOrder, setSortOrder] = useState<string[]>(["desc"]);


    const filteredData = data.filter(item => {
        const nameMatch = item.name.toLowerCase().includes(searchName.toLowerCase());
        const scoreMatch = searchScore.includes("10") || searchScore.includes(item.score.toString());
        const typeMatch = searchType.includes('all') || searchType.includes(item.type);
        const topicMatch = !searchTopic || item.topics.some(t =>
            t.toLowerCase().includes(searchTopic.toLowerCase())
        );
        return nameMatch && scoreMatch && typeMatch && topicMatch;
    }).sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortOrder.includes("desc") ? dateB - dateA : dateA - dateB;
    });
    return <Box shadow={'md'} p={'2%'}>
        <SimpleGrid columns={5} gap={'2.5%'}>
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
                         onValueChange={(target) => {setSearchType(target.value);
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
                         onValueChange={(target) => {setSearchScore(target.value);
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
            <Select.Root collection={orderOptions}
                         value={sortOrder}
                         onValueChange={(target) => {setSortOrder(target.value);
                         }}>
                <Select.HiddenSelect/>
                <Select.Label>Order By</Select.Label>
                <Select.Control>
                    <Select.Trigger>
                        <Select.ValueText placeholder="Select Sort Order"/>
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                        <Select.Indicator/>
                    </Select.IndicatorGroup>
                </Select.Control>
                <Portal>
                    <Select.Positioner>
                        <Select.Content>
                            {orderOptions.items.map((order) => (
                                <Select.Item item={order} key={order.label}>
                                    {order.label}
                                    <Select.ItemIndicator/>
                                </Select.Item>
                            ))}
                        </Select.Content>
                    </Select.Positioner>
                </Portal>
            </Select.Root>
        </SimpleGrid>

        <VStack>
            {filteredData.length > 0 ? (
                filteredData.map(record => (
                    <HistoryRecord key={record.id} {...record} />
                ))
            ) : (
                <Text>No records found</Text>
            )}
        </VStack>
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

const orderOptions = createListCollection({
    items: [
        {label: "Ascending", value: "asc"},
        {label: "Descending", value: "desc"},
    ],
})

export default HistoryComponent;
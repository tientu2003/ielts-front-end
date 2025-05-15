'use client'
import {
    Box,
    ButtonGroup,
    Center,
    IconButton,
    Pagination,
    SimpleGrid,
    Select,
    Text,
    Portal,
    createListCollection
} from "@chakra-ui/react";
import {HiChevronLeft, HiChevronRight} from "react-icons/hi2";
import React, {useState} from "react";
import {SkillLanguageProficiency} from "@/components/util/type-def";
import TpiComponent from "@/components/my-ui/progress/TpiComponent";


interface TopicsComponentProps {
    topics: string[],
    tpi: SkillLanguageProficiency[],
    skill: string
}

const TopicsComponent = ({topics, tpi, skill}: TopicsComponentProps) => {
    const pageSize = 6;
    const [searchTopic, setSearchTopic] = useState("");
    const [page, setPage] = useState(1);
    const topicsOptions = createListCollection({
        items: [{label: "All topics", value: ""}, ...topics.map(topic => ({label: topic, value: topic}))]
    })
    const filteredData = Array.isArray(tpi) ? tpi.filter(item => {
        return !searchTopic || item.topic.toLowerCase().includes(searchTopic.toLowerCase());
    }) : [];

    const totalItems = filteredData.length;
    const paginatedData = filteredData.slice((page - 1) * pageSize, page * pageSize);

    return <Box shadow={'md'} p={'2%'} mb={'2%'} mt={'2.5%'}>
        <Select.Root
            value={[searchTopic]}
            onValueChange={(target) => setSearchTopic(target.value[0])}
            collection={topicsOptions}>
            <Select.HiddenSelect/>
            <Select.Label>Topic</Select.Label>
            <Select.Control>
                <Select.Trigger>
                    <Select.ValueText placeholder="Select topic"/>
                </Select.Trigger>
                <Select.IndicatorGroup>
                    <Select.Indicator/>
                </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
                <Select.Positioner>
                    <Select.Content>
                        <Select.Item item={{label: "All topics", value: ""}}>
                            All topics
                            <Select.ItemIndicator/>
                        </Select.Item>
                        {topics.map((topic, index) => (
                            <Select.Item key={index} item={{label: topic, value: topic}}>
                                {topic}
                                <Select.ItemIndicator/>
                            </Select.Item>
                        ))}
                    </Select.Content>
                </Select.Positioner>
            </Portal>
        </Select.Root>

        <SimpleGrid mt={'2.5%'} columns={{sm:1, md:3}} gap={5}>
            {filteredData.length > 0 ? (
                paginatedData.map((item, index) => (
                        <TpiComponent key={index} data={item} skill={skill} size={'100%'}/>
                ))
            ) : (
                <Text>No topics found</Text>
            )}
        </SimpleGrid>

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


export default TopicsComponent;
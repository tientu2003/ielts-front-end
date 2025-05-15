// cefr-level.tsx
import { Box, Text } from "@chakra-ui/react";

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

const CEFR_CONFIG: Record<CEFRLevel, { color: string }> = {
    'A1': {color: 'purple.400'},
    'A2': {color: 'blue.400'},
    'B1': {color: 'cyan.400'},
    'B2': {color: 'green.400'},
    'C1': {color: 'yellow.400'},
    'C2': {color: 'red'}
};

interface CEFRLevelDisplayProps {
    currentLevel: CEFRLevel;
}

const CEFRLevelDisplay = ({currentLevel }: CEFRLevelDisplayProps) => {
    return (
        <Box
            w="30px"
            h="30px"
            borderRadius="full"
            bg={CEFR_CONFIG[currentLevel].color}
            display="flex"
            alignItems="center"
            justifyContent="center"
        >
            <Text
                fontSize="sm"
                fontWeight="bold"
                color="white"
            >
                {currentLevel}
            </Text>
        </Box>
    );
};

export default CEFRLevelDisplay;
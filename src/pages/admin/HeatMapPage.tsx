import React, { useMemo, useState, useEffect } from 'react';
import {
  Box,
  Tooltip,
  Grid,
  GridItem,
  VStack,
  Text,
  Spinner,
  Center,
  HStack,
  useBreakpointValue,
  Input,
  Button,
} from '@chakra-ui/react';
import { useHeatmapColor } from '../../hooks/useHeatmapColor';
import { TEN_MINUTES, DAY, formatDate } from '../../localization';
import { getSignupTimeline } from '../../services/interview';
import { RawSignup } from '../../types';
import { useNavigate } from 'react-router-dom';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { AxiosError } from 'axios';

const INCREMENTS_PER_DAY = 144;

const tsForBucket = (bucket: number) => bucket * TEN_MINUTES;

interface DayTimelineProps {
  signups: RawSignup[];
  selectedDay: number;
  height: number;
}

const SignupsDetails: React.FC<{
  signups: RawSignup[];
  bucketIdx: number;
  startTime: number;
}> = ({ signups, bucketIdx, startTime }) => {
  const bucketStart = tsForBucket(bucketIdx) + startTime;
  const bucketEnd = tsForBucket(bucketIdx + 1) + startTime;

  const signupsInBucket = signups.filter(
    ({ timestamp }) => timestamp >= bucketStart && timestamp < bucketEnd
  );
  return (
    <Box>
      {signupsInBucket.map(({ timestamp, username, user_id }) => (
        <Text key={`${timestamp}-${user_id}`} fontSize="sm">
          {formatDate(timestamp, true, true)} - {username} ({user_id})
        </Text>
      ))}
    </Box>
  );
};

const DayTimeline: React.FC<DayTimelineProps> = ({
  signups,
  selectedDay,
  height,
}) => {
  const barWidth = useBreakpointValue({ base: '4px', md: '6px' });
  const [selectedBucket, setSelectedBucket] = useState<number>();

  const processedData = useMemo(() => {
    const dayStart = Math.floor(selectedDay / DAY) * DAY;
    const dayEnd = dayStart + DAY;

    const buckets = new Array(INCREMENTS_PER_DAY).fill(0);

    signups.forEach(({ timestamp }) => {
      if (timestamp >= dayStart && timestamp < dayEnd) {
        const index = Math.floor((timestamp - dayStart) / TEN_MINUTES);
        buckets[index]++;
      }
    });

    const maxCount = Math.max(...buckets, 1);
    return { buckets, maxCount };
  }, [signups, selectedDay]);

  const getColor = useHeatmapColor(processedData.maxCount);
  return (
    <Box
      bg="white"
      borderRadius="lg"
      p={[2, 4]}
      width="100%"
      height="fit-content"
    >
      <Text fontSize={['xs', 'sm']} mb={[2, 4]}>
        {formatDate(new Date(selectedDay), false, true)}
      </Text>
      <Box position="relative" height={`${height}px`}>
        <HStack spacing={0} height="100%">
          {processedData.buckets.map((count, i) => (
            <Tooltip
              key={i}
              label={`${Math.round(count)} signups at ${formatDate(
                tsForBucket(i) + selectedDay,
                true,
                true
              )}`}
              hasArrow
            >
              <Box
                width={barWidth}
                height="100%"
                bg={getColor(count)}
                transition="all 0.2s"
                _hover={{ transform: 'scaleY(1.1)', zIndex: 1 }}
                cursor="pointer"
                onClick={() => setSelectedBucket(i)}
                outline={selectedBucket === i ? '2px solid' : 'none'}
              />
            </Tooltip>
          ))}
        </HStack>
      </Box>
      {selectedBucket && (
        <Box mt={4}>
          <SignupsDetails
            signups={signups}
            bucketIdx={selectedBucket}
            startTime={selectedDay}
          />
        </Box>
      )}
    </Box>
  );
};

interface DayGridProps {
  signups: RawSignup[];
  daysDisplayed: number;
  cellSize?: number;
  onSelectDay: (timestamp: number) => void;
  selectedDay: number;
}

const DayGrid: React.FC<DayGridProps> = ({
  signups,
  daysDisplayed,
  cellSize = 32,
  onSelectDay,
  selectedDay,
}) => {
  const gridGap = useBreakpointValue({ base: '8px', md: '16px' });
  const processedData = useMemo(() => {
    const now = Date.now();
    const startDate = now - daysDisplayed * DAY;
    const buckets = new Map<number, number>();

    signups.forEach(({ timestamp }) => {
      if (timestamp >= startDate && timestamp <= now) {
        const dayStart = Math.floor(timestamp / DAY) * DAY;
        buckets.set(dayStart, (buckets.get(dayStart) || 0) + 1);
      }
    });

    const maxCount = Math.max(...buckets.values(), 1);
    return { buckets, maxCount };
  }, [signups, daysDisplayed]);

  const getColor = useHeatmapColor(processedData.maxCount);

  const days = useMemo(() => {
    const now = Date.now();
    return Array.from({ length: daysDisplayed }, (_, i) => {
      const timestamp = Math.floor((now - i * DAY) / DAY) * DAY;
      return { timestamp, count: processedData.buckets.get(timestamp) || 0 };
    }).reverse();
  }, [processedData.buckets, daysDisplayed]);

  return (
    <Box>
      <Grid
        templateColumns={`repeat(7, ${cellSize}px)`}
        autoRows={`${cellSize}px`}
        gap={gridGap}
        bg="white"
        p={[2, 4]}
        borderRadius="lg"
      >
        {days.map((day) => (
          <Tooltip
            key={day.timestamp}
            label={`${day.count} signups on ${formatDate(
              day.timestamp,
              false,
              true
            )}`}
            hasArrow
          >
            <GridItem
              w={`${cellSize}px`}
              h={`${cellSize}px`}
              bg={getColor(day.count)}
              borderRadius="md"
              transition="all 0.2s"
              cursor="pointer"
              onClick={() => onSelectDay(day.timestamp)}
              outline={day.timestamp === selectedDay ? '2px solid' : 'none'}
              outlineColor="blue.500"
            />
          </Tooltip>
        ))}
      </Grid>
    </Box>
  );
};

export const HeatMapPage: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState(
    Math.floor(Date.now() / DAY) * DAY
  );
  const [signups, setSignups] = useState<RawSignup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [daysInput, setDaysInput] = useState<number>();
  const [daysDisplayed, setDaysDisplayed] = useState(14);
  const navigate = useNavigate();
  const fetchData = async () => {
    setIsLoading(true);
    getSignupTimeline(daysDisplayed)
      .then((data: RawSignup[]) => setSignups(data))
      .catch((err: AxiosError) => setError(err.message))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [daysDisplayed]);

  if (isLoading) {
    return (
      <Center h="200px">
        <Spinner size="xl" color="blue.500" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center h="200px">
        <Text color="red.500">{error}</Text>
      </Center>
    );
  }

  return (
    <Box maxW="1200px" mx="auto" p={[4, 8]}>
      <VStack spacing={[4, 8]} align="stretch">
        <Button
          colorScheme="blue"
          onClick={() => navigate('/admin')}
          alignSelf="flex-start"
          leftIcon={<ArrowBackIcon />}
        >
          Go back
        </Button>
        <Text fontSize={['xl', '2xl']} fontWeight="bold">
          Current pool signup timeline
        </Text>
        <form
          onSubmit={(e) => {
            if (!daysInput) return;
            e.preventDefault();
            setDaysDisplayed(daysInput);
          }}
        >
          <HStack>
            <Input
              type="number"
              placeholder="Enter number of days to display (default 14)"
              value={daysInput}
              onChange={(e) =>
                setDaysInput(Math.max(1, Number(e.target.value)))
              }
            />
            <Button type="submit" colorScheme="blue">
              Refresh
            </Button>
          </HStack>
        </form>
        <DayGrid
          signups={signups}
          daysDisplayed={daysDisplayed}
          onSelectDay={setSelectedDay}
          selectedDay={selectedDay}
        />
        <Box overflowX="auto" width="100%">
          <DayTimeline
            signups={signups}
            selectedDay={selectedDay}
            height={120}
          />
        </Box>
      </VStack>
    </Box>
  );
};

export default HeatMapPage;

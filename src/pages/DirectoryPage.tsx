import React, { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import {
  Container,
  Input,
  VStack,
  Heading,
  Stack,
  FormControl,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
} from '@chakra-ui/react';
import { Eye, SearchIcon } from 'lucide-react';
import { searchMembers, getRecommendedMembers } from '../services/directory';
import { Member } from '../types';
import MemberList from '../components/MemberList';
import { devPrint } from '../components/utils/RandomUtils';

const MINIMUM_LOADING_TIME = 1000;

const DirectoryPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebounce(query, 300);
  const [members, setMembers] = useState<Member[]>([]);
  const [recommended, setRecommended] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const results = await getRecommendedMembers(true);
        setRecommended(results);
      } catch (error) {
        devPrint('Error fetching recommendations:', error);
      }
    };

    fetchRecommended();
  }, []);

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      const startTime = Date.now();

      try {
        const response = await searchMembers(
          debouncedQuery,
          currentPage,
          20,
          true
        );

        const elapsedTime = Date.now() - startTime;

        if (elapsedTime < MINIMUM_LOADING_TIME) {
          await new Promise((resolve) =>
            setTimeout(resolve, MINIMUM_LOADING_TIME - elapsedTime)
          );
        }

        setMembers(response.results);
        setTotalCount(response.count);
      } catch (error) {
        devPrint('Error searching members:', error);
        setMembers([]);
        setTotalCount(0);

        const elapsedTime = Date.now() - startTime;
        if (elapsedTime < MINIMUM_LOADING_TIME) {
          await new Promise((resolve) =>
            setTimeout(resolve, MINIMUM_LOADING_TIME - elapsedTime)
          );
        }
      }

      setLoading(false);
    };

    fetchMembers();
  }, [debouncedQuery, currentPage]);

  const totalPages = Math.ceil(totalCount / 20);

  return (
    <Container maxW="container.lg" py={8}>
      <VStack spacing={8} align="stretch">
        <Stack spacing={4}>
          <Heading as="h1" size="lg">
            Member Directory
          </Heading>
          <FormControl>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <SearchIcon size={20} />
              </InputLeftElement>
              <Input
                placeholder="Search members..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                bg={bgColor}
                borderColor={borderColor}
              />
            </InputGroup>
          </FormControl>
        </Stack>

        <Tabs variant="enclosed">
          <TabList>
            <Tab>{query === '' ? 'All Members' : 'Results'}</Tab>
            <Tab>
              <Stack direction="row" align="center" spacing={2}>
                <Eye />
                <span>Discover</span>
              </Stack>
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel px={0}>
              <MemberList
                members={members}
                loading={loading}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </TabPanel>
            <TabPanel px={0}>
              <MemberList
                members={recommended}
                loading={false}
                showPagination={false}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Container>
  );
};

export default DirectoryPage;

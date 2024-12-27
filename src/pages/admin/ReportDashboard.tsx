import { useEffect, useState } from 'react';
import {
  Input,
  Select,
  Spinner,
  Text,
  VStack,
  Box,
  Heading,
  Button,
  useToast,
  HStack,
  Code,
} from '@chakra-ui/react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { getAllReport } from '../../services/report';
import { Report, ReportType } from '../../types';
import { devPrint } from '../../components/utils/RandomUtils';
import { Link } from 'react-router-dom';
import { formatDate } from '../../localization';
import { ReportView } from '../../components/admin/ReportView';

const JsonDisplay = ({ data }: { data: string }) => (
  <Box
    bg="gray.900"
    color="gray.50"
    p={4}
    borderRadius="md"
    overflow="auto"
    maxH="400px"
    width="100%"
  >
    <pre>
      <Code display="block" whiteSpace="pre" bg="transparent" color="gray.50">
        {JSON.stringify(JSON.parse(data), null, 2)}
      </Code>
    </pre>
  </Box>
);

const ReportDashboard = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterType, setFilterType] = useState<ReportType>();
  const [filterUserId, setFilterUserId] = useState<number>();
  const [expandedReportId, setExpandedReportId] = useState<string>();
  const [expandedJsonId, setExpandedJsonId] = useState<string>();
  const toast = useToast();

  useEffect(() => {
    setLoading(true);
    getAllReport()
      .then((res) => {
        setReports(res);
        devPrint(res);
      })
      .catch((error) => {
        devPrint(error);
        toast({
          title: 'Error',
          description: 'Failed to fetch reports',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [toast]);

  const filteredReports = reports.filter((report) => {
    return (
      (!filterType || report.type === filterType) &&
      (!filterUserId || report.reporter.id === filterUserId) &&
      report.reason.toLowerCase().includes(searchKeyword.toLowerCase())
    );
  });

  return (
    <VStack spacing={6} align="stretch">
      <Box borderWidth={1} borderRadius="lg" p={6} boxShadow="md">
        <VStack spacing={4} align="stretch">
          <Heading size="lg">Report Dashboard</Heading>
          <Input
            placeholder="Search by reason"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
          <Select
            placeholder="Filter by category"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as ReportType)}
          >
            <option value="interview">Interview</option>
            <option value="question">Question</option>
            <option value="member">Member</option>
          </Select>
          <Input
            placeholder="Filter by user ID"
            value={filterUserId}
            onChange={(e) =>
              setFilterUserId(
                e.target.value ? parseInt(e.target.value) : undefined
              )
            }
          />
          {loading ? (
            <Spinner />
          ) : (
            filteredReports.map((report) => (
              <ReportView key={report.reportId} {...report} />
            ))
          )}
        </VStack>
      </Box>
    </VStack>
  );
};

export default ReportDashboard;

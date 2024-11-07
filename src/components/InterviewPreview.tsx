import {
  Box,
  Text,
  Badge,
  Flex,
  Avatar,
  useColorModeValue,
  Center,
  Spinner,
} from '@chakra-ui/react';
import { Interview, Member } from '../types';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getMemberById } from '../services/directory';

interface InterviewPreviewProps {
  interview: Interview;
}

export const InterviewPreview: React.FC<InterviewPreviewProps> = ({
  interview,
}) => {
  const [interviewer, setInterviewer] = useState<Member>();
  const [interviewee, setInterviewee] = useState<Member>();

  const navigate = useNavigate();
  const bgColor = useColorModeValue('gray.100', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.800', 'gray.200');

  useEffect(() => {
    const fetchMembers = async () => {
      const [fetchedInterviewer, fetchedInterviewee] = await Promise.all([
        getMemberById(interview.interviewer, true),
        getMemberById(interview.interviewee, true),
      ]);
      setInterviewer(fetchedInterviewer);
      setInterviewee(fetchedInterviewee);
    };

    fetchMembers();
  }, [interview.interviewer, interview.interviewee]);

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      p={4}
      mb={4}
      bg={bgColor}
      borderColor={borderColor}
      cursor="pointer"
      onClick={() => navigate(`/interviews/${interview.interviewId}`)}
      transition="all 0.2s"
      _hover={{ boxShadow: 'md' }}
    >
      {interviewer && interviewee ? (
        <>
          <Flex justifyContent="space-between" alignItems="center">
            <Flex alignItems="center">
              <Avatar size="md" name={interviewer.firstName} mr={3} />
              <Box>
                <Text fontWeight="bold" color={textColor}>
                  {`${interviewer.firstName} ${interviewer.lastName}` ||
                    'Loading...'}
                </Text>
                <Badge colorScheme="blue">Interviewer</Badge>
              </Box>
            </Flex>
            <Flex alignItems="center">
              <Box textAlign="right" mr={3}>
                <Text fontWeight="bold" color={textColor}>
                  {`${interviewee.firstName} ${interviewee.lastName}` ||
                    'Loading...'}
                </Text>
                <Badge colorScheme="green">Interviewee</Badge>
              </Box>
              <Avatar size="md" name={interviewee.firstName} />
            </Flex>
          </Flex>
          <Flex mt={4} justifyContent="space-between">
            <Text fontSize="sm" color={textColor}>
              Date: {new Date(interview.dateEffective).toLocaleDateString()}
            </Text>
          </Flex>
        </>
      ) : (
        <Center h={20}>
          <Spinner />
        </Center>
      )}
    </Box>
  );
};

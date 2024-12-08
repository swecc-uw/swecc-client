import {
  Box,
  VStack,
  Spinner,
  Grid,
  GridItem,
  Heading,
  Text,
  Badge,
  Avatar,
  Divider,
  Card,
  CardHeader,
  CardBody,
  HStack,
  useColorModeValue,
  useDisclosure,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Button,
  Flex,
} from '@chakra-ui/react';
import { Calendar, Clock, User, Book, Flag } from 'lucide-react';
import { HydratedInterview, Member } from '../types';
import { resolveName } from '../components/utils/RandomUtils';
import ReportPopUp from '../components/ReportPopUp';
import { useAuth } from '../hooks/useAuth';
import TechnicalQuestionCard from '../components/TechnicalQuestionCard';
import { useState } from 'react';
import { DISABLE_INTERVIEW_STATUS_FLAG } from '../feature-flag';

const InterviewView = ({ interview }: { interview: HydratedInterview }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { member } = useAuth();

  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const bgColor = useColorModeValue('white', 'gray.800');
  const subtleColor = useColorModeValue('gray.600', 'gray.400');
  const cardBg = useColorModeValue('gray.50', 'gray.700');
  const [expandedQuestionId, setExpandedQuestionId] = useState<string>();

  const {
    interviewer,
    interviewee,
    technicalQuestions = [],
    behavioralQuestions = [],
    dateEffective,
    dateCompleted,
    status,
  } = interview;

  const statusColors = {
    active: 'green',
    pending: 'yellow',
    inactive: 'gray',
  };

  const startDateStr = new Date(dateEffective).toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const endDate = new Date(dateEffective);
  endDate.setDate(endDate.getDate() + 7);
  const endDateStr = endDate.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <VStack
      spacing={6}
      align="stretch"
      bg={bgColor}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="lg"
      p={6}
    >
      <Modal
        isCentered
        motionPreset="slideInBottom"
        isOpen={isOpen}
        size="xl"
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent maxH="800px" maxW="700px">
          <ModalCloseButton />
          <ReportPopUp
            title="Report Interview"
            badgeColorScheme="red"
            reasonPlaceholder="Enter reason for reporting this interview"
            associatedId={interview.interviewId}
            reporterUserId={member?.id}
            onClose={onClose}
            type="interview"
          />
        </ModalContent>
      </Modal>

      <Flex width="100%" align="flex-start" justify="space-between">
        <Box flex="1">
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
            <GridItem>
              <HStack>
                <Calendar size={16} />
                <Text fontSize="sm" color={subtleColor}>
                  scheduled for
                </Text>
              </HStack>
              <Text fontSize="lg" fontWeight="medium">
                {startDateStr} to
              </Text>
              <Text fontSize="lg" fontWeight="medium">
                {endDateStr}
              </Text>
            </GridItem>
            {dateCompleted && (
              <GridItem>
                <HStack>
                  <Clock size={16} />
                  <Text fontSize="sm" color={subtleColor}>
                    completed on
                  </Text>
                </HStack>
                <Text fontSize="lg" fontWeight="medium">
                  {new Date(dateCompleted).toLocaleDateString(undefined, {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Text>
              </GridItem>
            )}
          </Grid>
        </Box>

        <Flex gap={4} align="flex-start">
          {!DISABLE_INTERVIEW_STATUS_FLAG && (
            <Badge
              colorScheme={statusColors[status]}
              fontSize="md"
              px={3}
              py={1}
            >
              {status.toUpperCase()}
            </Badge>
          )}
          <Flag size={20} />
          <Button
            leftIcon={<Flag size={16} />}
            colorScheme="red"
            variant="ghost"
            size="sm"
            onClick={onOpen}
          >
            Report Interview
          </Button>
        </Flex>
      </Flex>

      <Divider />

      <VStack align="stretch" spacing={4}>
        <HStack>
          <User size={16} />
          <Heading size="md">participants</Heading>
        </HStack>
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
          <ParticipantCard
            participant={interviewer}
            role="Interviewer"
            cardBg={cardBg}
            subtleColor={subtleColor}
          />
          <ParticipantCard
            participant={interviewee}
            role="Interviewee"
            cardBg={cardBg}
            subtleColor={subtleColor}
          />
        </Grid>
      </VStack>

      <Divider />

      <VStack align="stretch" spacing={4}>
        <HStack>
          <Book size={16} />
          <Heading size="md">questions</Heading>
        </HStack>
        {technicalQuestions.length > 0 && (
          <VStack align="stretch" spacing={3}>
            {technicalQuestions.map((q) => (
              <TechnicalQuestionCard
                key={q.questionId}
                question={q}
                isExpanded={expandedQuestionId === q.questionId}
                onToggleExpand={() => {
                  setExpandedQuestionId(
                    expandedQuestionId === q.questionId
                      ? undefined
                      : q.questionId
                  );
                }}
              />
            ))}
          </VStack>
        )}
        {technicalQuestions.length === 0 &&
          behavioralQuestions.length === 0 && (
            <Text color={subtleColor} textAlign="center" py={4}>
              no questions assigned yet
            </Text>
          )}
      </VStack>
    </VStack>
  );
};

export const ViewInterviewPage = ({
  interview,
}: {
  interview: HydratedInterview;
}) => {
  if (!interview) {
    return (
      <Box>
        <Spinner />
      </Box>
    );
  }

  return (
    <Box maxWidth="1000px" margin="auto" p={4}>
      <InterviewView interview={interview} />
    </Box>
  );
};

const ParticipantCard = ({
  participant,
  role,
  cardBg,
  subtleColor,
}: {
  participant: Member;
  role: string;
  cardBg: string;
  subtleColor: string;
}) => (
  <Card bg={cardBg}>
    <CardHeader pb={2}>
      <HStack spacing={4}>
        <Avatar
          size="lg"
          name={resolveName(participant)}
          src={participant.profilePictureUrl}
        />
        <Box>
          <Text fontWeight="bold" fontSize="lg">
            {resolveName(participant)}
          </Text>
          <Badge colorScheme={role === 'Interviewer' ? 'blue' : 'green'}>
            {role}
          </Badge>
        </Box>
      </HStack>
    </CardHeader>
    <CardBody pt={2}>
      <Grid templateColumns="auto 1fr" gap={2} fontSize="sm">
        {participant.role && (
          <>
            <Text color={subtleColor}>role:</Text>
            <Text>{participant.role}</Text>
          </>
        )}
        {participant.major && (
          <>
            <Text color={subtleColor}>major:</Text>
            <Text>{participant.major}</Text>
          </>
        )}
        {participant.gradDate && (
          <>
            <Text color={subtleColor}>graduation:</Text>
            <Text>{new Date(participant.gradDate).toLocaleDateString()}</Text>
          </>
        )}
      </Grid>
    </CardBody>
  </Card>
);

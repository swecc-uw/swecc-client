import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import ChakraUIRenderer from 'chakra-ui-markdown-renderer';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Badge,
  Card,
  CardHeader,
  CardBody,
  Divider,
  useColorModeValue,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
} from '@chakra-ui/react';
import { ChevronDown, ChevronUp, Edit2, Flag } from 'lucide-react';
import type { TechnicalQuestion } from '../types';
import { useAuth } from '../hooks/useAuth';
import ReportPopUp from './ReportPopUp';

interface TechnicalQuestionCardProps {
  question: TechnicalQuestion;
  isExpanded: boolean;
  onToggleExpand: (questionId: string) => void;
}

const TechnicalQuestionCard = ({
  question,
  isExpanded,
  onToggleExpand,
}: TechnicalQuestionCardProps) => {
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const bgColor = useColorModeValue('white', 'gray.800');
  const expandedBg = useColorModeValue('gray.50', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const { isAdmin, member } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
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
            title="Report Question"
            badgeColorScheme="red"
            reasonPlaceholder="Enter reason for reporting this question"
            associatedId={question.questionId}
            reporterUserId={member?.id}
            onClose={onClose}
            type="question"
          />
        </ModalContent>
      </Modal>

      <Card
        variant="outline"
        bg={bgColor}
        borderColor={borderColor}
        transition="all 0.2s"
        _hover={{ shadow: 'md' }}
      >
        <CardHeader>
          <HStack justify="space-between" spacing={4}>
            <HStack spacing={4} flex={1}>
              <VStack align="flex-start" spacing={2}>
                <Box>
                  <ReactMarkdown components={ChakraUIRenderer()} skipHtml>
                    {question.title || question.prompt}
                  </ReactMarkdown>
                </Box>
                <Badge colorScheme="purple" px={2} py={1} borderRadius="full">
                  {question.topicName}
                </Badge>
              </VStack>
            </HStack>
            <HStack spacing={2}>
              <Button
                leftIcon={<Flag size={16} />}
                colorScheme="red"
                variant="ghost"
                size="sm"
                onClick={onOpen}
              >
                Report Question
              </Button>
              {isAdmin && (
                <Button
                  as={Link}
                  to={`/questions/technical/edit/${question.questionId}`}
                  variant="ghost"
                  size="sm"
                  leftIcon={<Edit2 size={16} />}
                  _hover={{ bg: hoverBg }}
                >
                  Edit
                </Button>
              )}
              <Button
                onClick={() => onToggleExpand(question.questionId)}
                variant="ghost"
                size="sm"
                rightIcon={
                  isExpanded ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )
                }
                _hover={{ bg: hoverBg }}
              >
                {isExpanded ? 'Hide Details' : 'Show Details'}
              </Button>
            </HStack>
          </HStack>
        </CardHeader>

        {isExpanded && (
          <CardBody pt={0}>
            <Divider my={4} />
            <VStack spacing={6} align="stretch">
              <Box>
                <Text fontWeight="semibold" mb={2}>
                  prompt
                </Text>
                <Box p={4} bg={expandedBg} borderRadius="md">
                  <ReactMarkdown components={ChakraUIRenderer()} skipHtml>
                    {question.prompt}
                  </ReactMarkdown>
                </Box>
              </Box>

              {question.solution && (
                <Box>
                  <Text fontWeight="semibold" mb={2}>
                    solution
                  </Text>
                  <Box p={4} bg={expandedBg} borderRadius="md">
                    <ReactMarkdown components={ChakraUIRenderer()} skipHtml>
                      {question.solution}
                    </ReactMarkdown>
                  </Box>
                </Box>
              )}

              {question.followUps && (
                <Box>
                  <Text fontWeight="semibold" mb={2}>
                    follow-up questions
                  </Text>
                  <Box p={4} bg={expandedBg} borderRadius="md">
                    <ReactMarkdown components={ChakraUIRenderer()} skipHtml>
                      {question.followUps}
                    </ReactMarkdown>
                  </Box>
                </Box>
              )}

              {question.source && (
                <Box>
                  <Text fontWeight="semibold" mb={2}>
                    source
                  </Text>
                  <Box p={4} bg={expandedBg} borderRadius="md">
                    <ReactMarkdown components={ChakraUIRenderer()} skipHtml>
                      {question.source}
                    </ReactMarkdown>
                  </Box>
                </Box>
              )}
            </VStack>
          </CardBody>
        )}
      </Card>
    </>
  );
};

export default TechnicalQuestionCard;

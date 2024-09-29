import React, { useEffect, useState } from 'react';
import {
  Container,
  VStack,
  Heading,
  Spinner,
  Center,
  HStack,
  Button,
} from '@chakra-ui/react';
import { TechnicalQuestion } from '../../types';
import { devPrint } from '../../components/utils/RandomUtils';
import QuestionList from '../../components/admin/TechnicalQuestionList';
import { getTechnicalQuestions } from '../../services/question';
import { Link } from 'react-router-dom';

const TechnicalQuestionsPage: React.FC = () => {
  const [questions, setQuestions] = useState<TechnicalQuestion[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getTechnicalQuestions()
      .then((questions) => {
        setQuestions(questions);
        setLoading(false);
      })
      .catch((err) => {
        devPrint('Failed to search members:', err);
        setLoading(false);
      });
  }, []);

  return (
    <Container maxW="container.lg" py={8}>
      <VStack spacing={4} align="stretch">
        <HStack justify="space-between" align="center">
          <Heading as="h1" size="lg">
            Technical Questions
          </Heading>
          <Link to={`/questions/technical/create`}>
            <Button size="sm" colorScheme="brand">
              Create new
            </Button>
          </Link>
        </HStack>
        {loading ? (
          <Center mt={10}>
            <Spinner />
          </Center>
        ) : (
          <QuestionList questions={questions} />
        )}
      </VStack>
    </Container>
  );
};

export default TechnicalQuestionsPage;

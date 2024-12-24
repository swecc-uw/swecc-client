import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Text,
  Button,
  VStack,
  Icon,
} from '@chakra-ui/react';
import { Code, Users, List, MessageSquare, Terminal } from 'lucide-react';

interface AdminCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  primaryAction: {
    label: string;
    to: string;
  };
  secondaryActions?: Array<{
    label: string;
    to: string;
  }>;
}

const AdminCard: React.FC<AdminCardProps> = ({
  title,
  description,
  icon,
  primaryAction,
  secondaryActions,
}) => (
  <Card height="full">
    <CardHeader>
      <VStack align="start" spacing={4}>
        <Icon as={icon} boxSize={6} />
        <Heading size="md">{title}</Heading>
      </VStack>
    </CardHeader>
    <CardBody>
      <Text color="gray.600">{description}</Text>
    </CardBody>
    <CardFooter>
      <VStack width="full" spacing={2}>
        <Button
          as={Link}
          to={primaryAction.to}
          colorScheme="blue"
          width="full"
          leftIcon={<Icon as={List} />}
        >
          {primaryAction.label}
        </Button>
        {secondaryActions?.map((action, index) => (
          <Button
            key={index}
            as={Link}
            to={action.to}
            variant="outline"
            width="full"
          >
            {action.label}
          </Button>
        ))}
      </VStack>
    </CardFooter>
  </Card>
);

export default function AdminDashboard() {
  const sections: AdminCardProps[] = [
    {
      title: 'Technical Questions',
      description:
        'Manage technical interview questions, create new ones, and organize the question queue.',
      icon: Code,
      primaryAction: {
        label: 'View All Questions',
        to: '/questions/technical/',
      },
      secondaryActions: [
        {
          label: 'Create New Question',
          to: '/questions/technical/create',
        },
        {
          label: 'Manage Queue',
          to: '/questions/queue/technical',
        },
      ],
    },
    {
      title: 'Behavioral Questions',
      description:
        'Organize behavioral interview questions and manage the question queue.',
      icon: MessageSquare,
      primaryAction: {
        label: 'Manage Queue',
        to: '/questions/queue/behavioral',
      },
    },
    {
      title: 'Pairing',
      description: 'Run pairing jobs',
      icon: Users,
      primaryAction: {
        label: 'View Pairing Dashboard',
        to: '/pairing',
      },
      secondaryActions: [
        {
          label: 'View Signup Heatmap',
          to: '/signups',
        },
      ],
    },
    {
      title: 'Reports',
      description: 'View and Manage User Reports',
      icon: Users,
      primaryAction: {
        label: 'View Reports',
        to: '/reports',
      },
    },
    {
      title: 'Utils',
      description: 'Miscellaneous utilities',
      icon: Terminal,
      secondaryActions: [
        {
          label: 'View Protected Page',
          to: '/protected',
        },
      ],
      primaryAction: {
        label: 'Open API Client',
        to: '/admin/api-client',
      },
    },
    {
      title: 'Admin Console',
      description: 'Access the admin console',
      icon: List,
      primaryAction: {
        label: 'Open Console',
        to: '/admin/console',
      },
    },
  ];

  return (
    <Box p={8}>
      <VStack align="stretch" spacing={8}>
        <Heading size="lg">Admin Dashboard</Heading>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {sections.map((section, index) => (
            <AdminCard key={index} {...section} />
          ))}
        </SimpleGrid>
      </VStack>
    </Box>
  );
}

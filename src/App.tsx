import { ChakraProvider } from '@chakra-ui/react';
import { Routes, Route, HashRouter, Navigate } from 'react-router-dom';
import InterviewSignupPage from './pages/InterviewSignupPage';
import Layout from './components/Layout';

import MemberProfilePage from './pages/MemberProfilePage';
import JoinPage from './pages/JoinPage';
import { ViewInterviewsPage } from './pages/ViewInterviewsPage';
import ProtectedRoute from './components/ProtectedRoute';
import ProtectedPage from './pages/TestPage';
import DevRoute from './components/debug/DevRoute';
import DirectoryPage from './pages/DirectoryPage';
import MemberProfile from './pages/MemberProfile';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import { theme } from './theme';
import TechnicalQuestionsPage from './pages/admin/TechnicalQuestionsPage';
import AdminRoute from './components/admin/AdminRoute';
import TechnicalQuestionCreateEditPage from './pages/admin/TechnicalQuestionCreateEditPage';
import PairInterviewDashboard from './pages/admin/PairingDashboard';
import QuestionQueueDashboard from './pages/admin/QuestionQueueDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import APIClient from './pages/admin/APIClient';
import { QuestionType } from './types';
import ReportDashboard from './pages/admin/ReportDashboard';
import ResetPasswordForm from './pages/ResetPassword';
import AdminConsolePage from './pages/admin/AdminConsolePage';

const App: React.FC = () => {
  return (
    <ChakraProvider theme={theme}>
      <HashRouter>
        <Layout>
          <Routes>
            <Route
              path="/interview-signup"
              element={
                <ProtectedRoute>
                  <InterviewSignupPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/interviews"
              element={
                <ProtectedRoute>
                  <ViewInterviewsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/interviews/:interviewId"
              element={
                <ProtectedRoute>
                  <ViewInterviewsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <MemberProfilePage />
                </ProtectedRoute>
              }
            />
            <Route path="/join" element={<JoinPage />} />
            <Route
              path="/password-reset-confirm/:uid/:token"
              element={<ResetPasswordForm />}
            />
            <Route path="/auth" element={<AuthPage />} />
            <Route
              path="/directory"
              element={
                <ProtectedRoute>
                  <DirectoryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/directory/:userId"
              element={
                <ProtectedRoute>
                  <MemberProfile />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="*" element={<div>Not Found</div>} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/protected"
              element={
                <ProtectedRoute>
                  <DevRoute>
                    <ProtectedPage />
                  </DevRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/questions/queue/technical"
              element={
                <ProtectedRoute>
                  <AdminRoute>
                    <QuestionQueueDashboard
                      questionType={QuestionType.Technical}
                    />
                  </AdminRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/questions/queue/behavioral"
              element={
                <ProtectedRoute>
                  <AdminRoute>
                    <QuestionQueueDashboard
                      questionType={QuestionType.Behavioral}
                    />
                  </AdminRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/questions/technical/"
              element={
                <ProtectedRoute>
                  <AdminRoute>
                    <TechnicalQuestionsPage />
                  </AdminRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/questions/technical/create"
              element={
                <ProtectedRoute>
                  <AdminRoute>
                    <TechnicalQuestionCreateEditPage />
                  </AdminRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/questions/technical/edit/:id"
              element={
                <ProtectedRoute>
                  <AdminRoute>
                    <TechnicalQuestionCreateEditPage />
                  </AdminRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/pairing"
              element={
                <ProtectedRoute>
                  <AdminRoute>
                    <PairInterviewDashboard />
                  </AdminRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <AdminRoute>
                    <ReportDashboard />
                  </AdminRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/api-client"
              element={
                <ProtectedRoute>
                  <AdminRoute>
                    <APIClient />
                  </AdminRoute>
                </ProtectedRoute>
              }
            />
            <Route path="/admin/console" element={<AdminConsolePage />} />
          </Routes>
        </Layout>
      </HashRouter>
    </ChakraProvider>
  );
};

export default App;

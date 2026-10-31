import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import FreelancerLayout from './layouts/FreelancerLayout';
import ClientLayout from './layouts/ClientLayout';

// Protection Guards
import ProtectedRoute from './components/ProtectedRoute';
import RoleRoute from './components/RoleRoute';

// Pages
import Home from './pages/Home';
import ChooseAccountType from './pages/ChooseAccountType';
import FreelancerRegister from './pages/FreelancerRegister';
import ClientRegister from './pages/ClientRegister';
import Login from './pages/Login';
import FreelancerDashboard from './pages/FreelancerDashboard';
import ClientDashboard from './pages/ClientDashboard';
import ExploreProjects from './pages/ExploreProjects';
import FindFreelancers from './pages/FindFreelancers';
import FreelancerProfile from './pages/FreelancerProfile';
import ProjectDetails from './pages/ProjectDetails';
import PostProject from './pages/PostProject';
import SubmitProposal from './pages/SubmitProposal';
import MyProposals from './pages/MyProposals';
import MyProjects from './pages/MyProjects';
import WorkVerification from './pages/WorkVerification';
import Notifications from './pages/Notifications';
import ProfileSettings from './pages/ProfileSettings';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public & Shared Routes (using PublicLayout) */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/choose-role" element={<ChooseAccountType />} />
            <Route path="/register" element={<Navigate to="/choose-role" replace />} />
            <Route path="/register/freelancer" element={<FreelancerRegister />} />
            <Route path="/register/client" element={<ClientRegister />} />
            <Route path="/login" element={<Login />} />
            <Route path="/projects" element={<ExploreProjects />} />
            <Route path="/projects/:id" element={<ProjectDetails />} />
            <Route
              path="/projects/:id/apply"
              element={
                <RoleRoute allowedRole="freelancer">
                  <SubmitProposal />
                </RoleRoute>
              }
            />
            <Route path="/freelancers" element={<FindFreelancers />} />
            <Route path="/freelancers/:id" element={<FreelancerProfile />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            {/* Authenticated Shared Pages */}
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <ProfileSettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/work-verification"
              element={
                <ProtectedRoute>
                  <WorkVerification />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Dedicated Freelancer Portal Workspace */}
          <Route path="/freelancer" element={<FreelancerLayout />}>
            <Route path="dashboard" element={<FreelancerDashboard />} />
            <Route path="proposals" element={<MyProposals />} />
            <Route path="projects" element={<MyProjects />} />
          </Route>

          {/* Dedicated Client Portal Workspace */}
          <Route path="/client" element={<ClientLayout />}>
            <Route path="dashboard" element={<ClientDashboard />} />
            <Route path="post-project" element={<PostProject />} />
            <Route path="projects" element={<MyProjects />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

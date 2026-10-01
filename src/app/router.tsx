import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { DashboardPage } from '../pages/DashboardPage';
import { MembersPage } from '../pages/MembersPage';
import { MemberDetailPage } from '../pages/MemberDetailPage';
import { MembershipsPage } from '../pages/MembershipsPage';
import { AttendancePage } from '../pages/AttendancePage';
import { PaymentsPage } from '../pages/PaymentsPage';
import { TrainersPage } from '../pages/TrainersPage';
import { WorkoutsPage } from '../pages/WorkoutsPage';
import { ReportsPage } from '../pages/ReportsPage';
import { SettingsPage } from '../pages/SettingsPage';

import { LoginPage } from '../pages/LoginPage';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'members',
        element: <MembersPage />,
      },
      {
        path: 'members/:id',
        element: <MemberDetailPage />,
      },
      {
        path: 'memberships',
        element: <MembershipsPage />,
      },
      {
        path: 'attendance',
        element: <AttendancePage />,
      },
      {
        path: 'payments',
        element: <PaymentsPage />,
      },
      {
        path: 'trainers',
        element: <TrainersPage />,
      },
      {
        path: 'workouts',
        element: <WorkoutsPage />,
      },
      {
        path: 'reports',
        element: <ReportsPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
      {
        path: '*',
        element: <DashboardPage />,
      }
    ],
  },
]);

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from '@/app/page';
import StandingsPage from '@/app/standings/page';
import SchedulePage from '@/app/schedule/page';
import R16Page from '@/app/r16/page';
import TeamsPage from '@/app/teams/page';
import TeamPage from '@/app/team/[id]/page';
import KetentuanPage from '@/app/ketentuan/page';
import AdminPage from '@/app/admin/page';
import NotFound from '@/app/not-found';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/standings" element={<StandingsPage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/r16" element={<R16Page />} />
        <Route path="/teams" element={<TeamsPage />} />
        <Route path="/team/:id" element={<TeamPage />} />
        <Route path="/ketentuan" element={<KetentuanPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

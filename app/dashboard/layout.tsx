import DashboardClient from '@/components/dashboard/DashboardClient';
import React from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardClient>
      {children}
    </DashboardClient>
  );
}

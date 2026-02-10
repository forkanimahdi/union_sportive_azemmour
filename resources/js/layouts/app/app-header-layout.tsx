import { AppContent } from '@/components/app-content';
import { AppHeader } from '@/components/app-header';
import { AppShell } from '@/components/app-shell';
import { dashboard } from '@/routes';
import { type BreadcrumbItem, type NavItem } from '@/types';
import { LayoutGrid, Trophy, Users, UserCircle, Medal, Swords, CalendarDays, ShoppingBag } from 'lucide-react';
import type { PropsWithChildren } from 'react';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Saisons',
        href: '/admin/seasons',
        icon: Trophy,
    },
    {
        title: 'Équipes',
        href: '/admin/teams',
        icon: Users,
    },
    {
        title: 'Joueuses',
        href: '/admin/players',
        icon: UserCircle,
    },
    {
        title: 'Classement',
        href: '/admin/classment',
        icon: Medal,
    },
    {
        title: 'Calendrier',
        href: '/admin/fixtures',
        icon: CalendarDays,
    },
    {
        title: 'Adversaires',
        href: '/admin/opponent-teams',
        icon: Swords,
    },
    {
        title: 'Boutique',
        href: '/admin/products',
        icon: ShoppingBag,
    },
];

export default function AppHeaderLayout({ children, breadcrumbs }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    return (
        <AppShell>
            <AppHeader breadcrumbs={breadcrumbs} mainNavItems={mainNavItems} />
            <AppContent>{children}</AppContent>
        </AppShell>
    );
}

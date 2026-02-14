import { AppContent } from '@/components/app-content';
import { AppHeader } from '@/components/app-header';
import { AppShell } from '@/components/app-shell';
import { dashboard } from '@/routes';
import { type BreadcrumbItem, type NavItem } from '@/types';
import { LayoutGrid, Trophy, Users, UserCircle, CalendarDays, ShoppingBag, Megaphone } from 'lucide-react';
import type { PropsWithChildren } from 'react';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: "/admin/dashboard",
        icon: LayoutGrid,
    },
    {
        title: 'Saisons',
        href: '/admin/seasons',
        icon: Trophy,
    },
    {
        title: 'Équipes',
        href: '#',
        icon: Users,
        children: [
            { title: 'Nos équipes', href: '/admin/teams' },
            { title: 'Adversaires', href: '/admin/opponent-teams' },
        ],
    },
    {
        title: 'Joueuses',
        href: '/admin/players',
        icon: UserCircle,
    },
    {
        title: 'Compétition',
        href: '#',
        icon: CalendarDays,
        children: [
            { title: 'Classement', href: '/admin/classment' },
            { title: 'Calendrier', href: '/admin/fixtures' },
        ],
    },
    {
        title: 'Boutique',
        href: '#',
        icon: ShoppingBag,
        children: [
            { title: 'Boutique', href: '/admin/products' },
            { title: 'Commandes', href: '/admin/orders' },
        ],
    },
    {
        title: 'Communications',
        href: '#',
        icon: Megaphone,
        children: [
            { title: 'Articles', href: '/admin/articles' },
            { title: 'Partenaires & Sponsors', href: '/admin/sponsors' },
            { title: 'Histoires', href: '/admin/histoires' },
        ],
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

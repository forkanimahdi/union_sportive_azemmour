import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { 
    LayoutDashboard, 
    Users, 
    Calendar, 
    Trophy, 
    FileText, 
    Image, 
    Shield, 
    Package,
    UserCog,
    BookOpen,
    Folder
} from 'lucide-react';
import AppLogo from './app-logo';

export function AppSidebar() {
    const { auth } = usePage().props as any;
    const userRole = auth?.user?.role || 'president';

    // Define all menu items with their required roles
    const allNavItems: NavItem[] = [
        {
            title: 'Tableau de bord',
            href: '/admin/dashboard',
            icon: LayoutDashboard,
            roles: ['admin', 'technical_director', 'coach', 'physiotherapist', 'communication', 'president'],
        },
        {
            title: 'Saisons',
            href: '/admin/seasons',
            icon: Trophy,
            roles: ['admin', 'technical_director'],
        },
        {
            title: 'Équipes',
            href: '/admin/teams',
            icon: Users,
            roles: ['admin', 'technical_director', 'coach'],
        },
        {
            title: 'Joueuses',
            href: '/admin/players',
            icon: UserCog,
            roles: ['admin', 'technical_director', 'coach'],
        },
        {
            title: 'Entraînements',
            href: '/admin/trainings',
            icon: Calendar,
            roles: ['admin', 'technical_director', 'coach'],
        },
        {
            title: 'Matchs',
            href: '/admin/matches',
            icon: Trophy,
            roles: ['admin', 'technical_director', 'coach'],
        },
        {
            title: 'Convocations',
            href: '/admin/convoctions',
            icon: FileText,
            roles: ['admin', 'technical_director', 'coach'],
        },
        {
            title: 'Blessures',
            href: '/admin/injuries',
            icon: Shield,
            roles: ['admin', 'technical_director', 'physiotherapist'],
        },
        {
            title: 'Discipline',
            href: '/admin/discipline',
            icon: Shield,
            roles: ['admin', 'technical_director', 'coach'],
        },
        {
            title: 'Médias',
            href: '/admin/media',
            icon: Image,
            roles: ['admin', 'technical_director', 'communication'],
        },
        {
            title: 'Droit à l\'Image',
            href: '/admin/image-rights',
            icon: Shield,
            roles: ['admin', 'technical_director', 'communication'],
        },
        {
            title: 'Staff',
            href: '/admin/staff',
            icon: UserCog,
            roles: ['admin', 'technical_director'],
        },
        {
            title: 'Matériel',
            href: '/admin/equipment',
            icon: Package,
            roles: ['admin', 'technical_director'],
        },
    ];

    // Filter menu items based on user role
    const mainNavItems = allNavItems.filter(item => 
        item.roles?.includes(userRole)
    );

    const footerNavItems: NavItem[] = [
        {
            title: 'Repository',
            href: 'https://github.com/laravel/react-starter-kit',
            icon: Folder,
        },
        {
            title: 'Documentation',
            href: 'https://laravel.com/docs/starter-kits#react',
            icon: BookOpen,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/admin/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

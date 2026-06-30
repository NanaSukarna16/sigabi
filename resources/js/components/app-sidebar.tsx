import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarGroup,
    SidebarGroupLabel,
} from '@/components/ui/sidebar';

import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Building2, Users, UserCheck, GraduationCap, Percent, Smile, Calendar, Wallet, Calculator, Coins, DollarSign } from 'lucide-react';
import AppLogo from './app-logo';
import { resolveUrl } from '@/lib/utils';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
];

const masterNavItems: NavItem[] = [
    {
        title: 'Unit biMBA',
        href: '/units',
        icon: Building2,
    },
    {
        title: 'Kategori Murid',
        href: '/kategori-murid',
        icon: GraduationCap,
    },
    {
        title: 'Murid biMBA',
        href: '/murid',
        icon: Smile,
    },
    {
        title: 'Aturan Potongan',
        href: '/aturan-potongan',
        icon: Percent,
    },
    {
        title: 'Konversi Poin',
        href: '/aturan-konversi-poin',
        icon: Coins,
    },
    {
        title: 'Tarif Flat',
        href: '/aturan-tarif-flat',
        icon: DollarSign,
    },
];

const karyawanNavItems: NavItem[] = [
    {
        title: 'Guru',
        href: '/users?role=guru',
        icon: Users,
    },
    {
        title: 'Kepala Unit',
        href: '/users?role=kepala_unit',
        icon: UserCheck,
    },
    {
        title: 'Kehadiran',
        href: '/kehadiran',
        icon: Calendar,
    },
];
const penggajianNavItems: NavItem[] = [
    {
        title: 'Hitung Gaji',
        href: '/penggajian/calculate',
        icon: Calculator,
    },
    {
        title: 'Riwayat Gaji',
        href: '/penggajian',
        icon: Wallet,
    },
];

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

export function AppSidebar() {
    const page = usePage();
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />

                <SidebarGroup className="px-2 py-2">
                    <SidebarGroupLabel>Karyawan</SidebarGroupLabel>
                    <SidebarMenu>
                        {karyawanNavItems.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={page.url === resolveUrl(item.href)}
                                    tooltip={{ children: item.title }}
                                >
                                    <Link href={item.href} prefetch>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>

                <SidebarGroup className="px-2 py-2">
                    <SidebarGroupLabel>Penggajian</SidebarGroupLabel>
                    <SidebarMenu>
                        {penggajianNavItems.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={page.url === resolveUrl(item.href)}
                                    tooltip={{ children: item.title }}
                                >
                                    <Link href={item.href} prefetch>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>

                <SidebarGroup className="px-2 py-2">
                    <SidebarGroupLabel>Master Data</SidebarGroupLabel>
                    <SidebarMenu>
                        {masterNavItems.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={page.url.startsWith(resolveUrl(item.href))}
                                    tooltip={{ children: item.title }}
                                >
                                    <Link href={item.href} prefetch>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>


            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

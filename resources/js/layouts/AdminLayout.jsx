import AppLayout from '@/layouts/app-layout';



export default function AdminLayout({ children, breadcrumbs = [] }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            {children}
        </AppLayout>
    );
}

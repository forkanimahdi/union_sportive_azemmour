import React from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';

export default function HistoiresIndex() {
    return (
        <AdminLayout>
            <Head title="Histoires" />
            <div className="space-y-6">
                <h1 className="text-2xl font-bold">Histoires</h1>
                <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">
                        Module Histoires à venir.
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}

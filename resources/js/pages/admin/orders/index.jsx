import React from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';

export default function AdminOrdersIndex() {
    return (
        <AdminLayout>
            <Head title="Commandes" />
            <div className="space-y-6">
                <h1 className="text-2xl font-bold">Commandes</h1>
                <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">
                        Gestion des commandes à venir.
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}

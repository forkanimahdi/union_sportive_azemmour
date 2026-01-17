import React from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';

export default function TrainingsIndex({ trainings = { data: [] } }) {
    return (
        <AdminLayout>
            <Head title="Entraînements" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black uppercase italic text-dark">Entraînements</h1>
                        <p className="text-gray-600 mt-1">Gestion des entraînements</p>
                    </div>
                    <Link href="/admin/trainings/create">
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Nouvel Entraînement
                        </Button>
                    </Link>
                </div>
                <Card>
                    <CardContent className="py-12 text-center">
                        <p className="text-gray-500">Module en développement</p>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}












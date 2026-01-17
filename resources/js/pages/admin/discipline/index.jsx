import React from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';

export default function DisciplineIndex({ discipline = { data: [] } }) {
    return (
        <AdminLayout>
            <Head title="Discipline" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black uppercase italic text-dark">Discipline</h1>
                        <p className="text-gray-600 mt-1">Gestion de la discipline</p>
                    </div>
                    <Link href="/admin/discipline/create">
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Nouvelle Action
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












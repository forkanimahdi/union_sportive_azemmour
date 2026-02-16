import React, { useState } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Phone, Mail, User } from 'lucide-react';

const STATUS_OPTIONS = [
    { value: 'pending', label: 'En attente' },
    { value: 'confirmed', label: 'Confirmée' },
    { value: 'paid', label: 'Payée' },
    { value: 'sold', label: 'Vendue / Expédiée' },
    { value: 'refund', label: 'Remboursée' },
];

export default function AdminOrdersIndex({ orders = [], statusLabels = {} }) {
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredOrders = statusFilter === 'all'
        ? orders
        : orders.filter((o) => o.status === statusFilter);

    const updateStatus = (orderId, newStatus) => {
        router.patch(`/admin/orders/${orderId}/status`, { status: newStatus });
    };

    const formatDate = (iso) => {
        const d = new Date(iso);
        return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    const getStatusBadgeClass = (status) => {
        const map = {
            pending: 'bg-amber-100 text-amber-800',
            confirmed: 'bg-blue-100 text-blue-800',
            paid: 'bg-green-100 text-green-800',
            sold: 'bg-emerald-100 text-emerald-800',
            refund: 'bg-gray-100 text-gray-700',
        };
        return map[status] || 'bg-gray-100 text-gray-700';
    };

    return (
        <AdminLayout>
            <Head title="Commandes" />
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold">Commandes</h1>
                    <p className="text-sm text-muted-foreground">Gérer les commandes de la boutique.</p>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex flex-wrap gap-4 items-center">
                            <span className="text-sm font-medium text-muted-foreground">Statut :</span>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Toutes</SelectItem>
                                    {STATUS_OPTIONS.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {filteredOrders.length === 0 ? (
                            <div className="py-12 text-center text-muted-foreground">
                                Aucune commande{statusFilter !== 'all' ? ' pour ce statut' : ''}.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-3 px-2 font-semibold">Date</th>
                                            <th className="text-left py-3 px-2 font-semibold">Produit</th>
                                            <th className="text-left py-3 px-2 font-semibold">Client</th>
                                            <th className="text-left py-3 px-2 font-semibold">Taille / Qté</th>
                                            <th className="text-left py-3 px-2 font-semibold">Statut</th>
                                            <th className="text-left py-3 px-2 font-semibold">Notes</th>
                                            <th className="text-left py-3 px-2 font-semibold">Changer statut</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredOrders.map((order) => (
                                            <tr key={order.id} className="border-b hover:bg-muted/30 transition-colors">
                                                <td className="py-3 px-2 whitespace-nowrap text-muted-foreground">
                                                    {formatDate(order.created_at)}
                                                </td>
                                                <td className="py-3 px-2">
                                                    <span className="font-medium">{order.product_name || '–'}</span>
                                                </td>
                                                <td className="py-3 px-2">
                                                    <div className="space-y-0.5">
                                                        {order.customer_name && (
                                                            <div className="flex items-center gap-1.5">
                                                                <User className="w-3.5 h-3.5 text-muted-foreground" />
                                                                <span>{order.customer_name}</span>
                                                            </div>
                                                        )}
                                                        <div className="flex items-center gap-1.5">
                                                            <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                                                            <a href={`mailto:${order.email}`} className="text-primary hover:underline">{order.email}</a>
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                                                            <a href={`tel:${order.phone}`} className="text-primary hover:underline">{order.phone}</a>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-2">
                                                    <span className="font-medium">{order.size}</span>
                                                    <span className="text-muted-foreground"> × {order.quantity}</span>
                                                </td>
                                                <td className="py-3 px-2">
                                                    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${getStatusBadgeClass(order.status)}`}>
                                                        {statusLabels[order.status] ?? order.status}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-2">
                                                    <span className="text-muted-foreground text-xs max-w-[120px] truncate block" title={order.notes || ''}>
                                                        {order.notes ? order.notes : '–'}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-2">
                                                    <Select
                                                        value={order.status}
                                                        onValueChange={(value) => updateStatus(order.id, value)}
                                                    >
                                                        <SelectTrigger className="w-[160px] h-8 text-xs">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {STATUS_OPTIONS.map((opt) => (
                                                                <SelectItem key={opt.value} value={opt.value}>
                                                                    {opt.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}

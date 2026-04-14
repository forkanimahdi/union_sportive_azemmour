import React, { useState, useCallback, useEffect } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Eye, Bell, Trash2, Search, User, MapPin, FileSpreadsheet } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const STATUS_OPTIONS = [
    { value: 'pending', label: 'En attente' },
    { value: 'confirmed', label: 'Confirmée' },
    { value: 'paid', label: 'Payée' },
    { value: 'sold', label: 'Vendue / Expédiée' },
    { value: 'refund', label: 'Remboursée' },
];

const NOTIFY_STATUS_OPTIONS = STATUS_OPTIONS.filter((o) => o.value !== 'pending');

export default function AdminOrdersIndex({ orders = [], statusLabels = {}, filters = {}, exportColumns = [] }) {
    const { flash } = usePage().props;
    const [searchInput, setSearchInput] = useState(filters.search ?? '');
    const [statusFilter, setStatusFilter] = useState(filters.status ?? 'all');

    useEffect(() => {
        setSearchInput(filters.search ?? '');
        setStatusFilter(filters.status ?? 'all');
    }, [filters.search, filters.status]);
    const [detailOrder, setDetailOrder] = useState(null);
    const [notifyOrder, setNotifyOrder] = useState(null);
    const [notifyStatus, setNotifyStatus] = useState('confirmed');
    const [sendingNotify, setSendingNotify] = useState(false);
    const [deleteOrder, setDeleteOrder] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const [exportOpen, setExportOpen] = useState(false);
    const [exportSearch, setExportSearch] = useState('');
    const [exportDateFrom, setExportDateFrom] = useState('');
    const [exportDateTo, setExportDateTo] = useState('');
    const [exportStatuses, setExportStatuses] = useState(() => STATUS_OPTIONS.map((o) => o.value));
    const [exportSelectedColumns, setExportSelectedColumns] = useState([]);

    const openExportModal = () => {
        setExportSearch(searchInput);
        setExportDateFrom('');
        setExportDateTo('');
        if (statusFilter === 'all') {
            setExportStatuses(STATUS_OPTIONS.map((o) => o.value));
        } else {
            setExportStatuses([statusFilter]);
        }
        setExportSelectedColumns(exportColumns.length ? exportColumns.map((c) => c.key) : []);
        setExportOpen(true);
    };

    const toggleExportStatus = (value) => {
        setExportStatuses((prev) => (prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value]));
    };

    const toggleExportColumn = (key) => {
        setExportSelectedColumns((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
    };

    const downloadExport = () => {
        if (exportSelectedColumns.length === 0 || exportStatuses.length === 0) return;
        const params = new URLSearchParams();
        if (exportSearch.trim()) params.set('search', exportSearch.trim());
        exportStatuses.forEach((s) => params.append('statuses[]', s));
        if (exportDateFrom) params.set('date_from', exportDateFrom);
        if (exportDateTo) params.set('date_to', exportDateTo);
        exportSelectedColumns.forEach((c) => params.append('columns[]', c));
        window.location.assign(`/admin/orders/export?${params.toString()}`);
    };

    const applyFilters = useCallback(
        (overrides = {}) => {
            const search = overrides.search !== undefined ? overrides.search : searchInput;
            const status = overrides.status !== undefined ? overrides.status : statusFilter;
            router.get('/admin/orders', { search: search || undefined, status: status === 'all' ? undefined : status }, { preserveState: true });
        },
        [searchInput, statusFilter]
    );

    const handleSearchChange = (e) => {
        setSearchInput(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e?.preventDefault?.();
        applyFilters({ search: searchInput });
    };

    const handleStatusFilterChange = (value) => {
        setStatusFilter(value);
        router.get('/admin/orders', { search: searchInput || undefined, status: value === 'all' ? undefined : value }, { preserveState: true });
    };

    const updateStatus = (orderId, newStatus) => {
        router.patch(`/admin/orders/${orderId}/status`, { status: newStatus });
    };

    const openNotify = (order) => {
        setNotifyOrder(order);
        setNotifyStatus(order.status === 'pending' ? 'confirmed' : order.status);
    };

    const sendNotification = () => {
        if (!notifyOrder) return;
        setSendingNotify(true);
        router.post(`/admin/orders/${notifyOrder.id}/send-status-notification`, { status: notifyStatus }, {
            preserveScroll: true,
            onFinish: () => setSendingNotify(false),
            onSuccess: () => setNotifyOrder(null),
        });
    };

    const confirmDelete = () => {
        if (!deleteOrder) return;
        setDeleting(true);
        router.delete(`/admin/orders/${deleteOrder.id}`, {
            preserveScroll: true,
            onFinish: () => setDeleting(false),
            onSuccess: () => setDeleteOrder(null),
        });
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

    const clientSummary = (order) => {
        if (order.customer_name) return order.customer_name;
        return order.email || order.phone || '–';
    };

    return (
        <AdminLayout>
            <Head title="Commandes" />
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold">Commandes</h1>
                    <p className="text-sm text-muted-foreground">Gérer les commandes de la boutique.</p>
                </div>

                {(flash?.success || flash?.error) && (
                    <div className={`rounded-lg px-4 py-2 text-sm ${flash.error ? 'bg-destructive/10 text-destructive' : 'bg-green-500/10 text-green-700'}`}>
                        {flash.success || flash.error}
                    </div>
                )}

                <Card>
                    <CardHeader>
                        <div className="flex flex-wrap gap-4 items-center justify-between">
                            <div className="flex flex-wrap gap-4 items-center">
                            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
                                <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                                <Input
                                    type="search"
                                    placeholder="Rechercher (client, email, téléphone, produit…)"
                                    value={searchInput}
                                    onChange={handleSearchChange}
                                    onBlur={() => applyFilters({ search: searchInput })}
                                    className="w-[280px] sm:w-[320px] h-9"
                                />
                                <Button type="submit" variant="secondary" size="sm">Rechercher</Button>
                            </form>
                            <span className="text-sm font-medium text-muted-foreground">Statut :</span>
                            <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
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
                            <Button type="button" variant="outline" size="sm" className="gap-2 shrink-0" onClick={openExportModal}>
                                <FileSpreadsheet className="w-4 h-4" />
                                Exporter Excel
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {orders.length === 0 ? (
                            <div className="py-12 text-center text-muted-foreground">
                                Aucune commande{statusFilter !== 'all' || searchInput ? ' pour ces critères' : ''}.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-3 px-2 font-semibold">Date</th>
                                            <th className="text-left py-3 px-2 font-semibold">Produit</th>
                                            <th className="text-left py-3 px-2 font-semibold">Client</th>
                                            <th className="text-left py-3 px-2 font-semibold">Statut</th>
                                            <th className="text-right py-3 px-2 font-semibold">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map((order) => (
                                            <tr key={order.id} className="border-b hover:bg-muted/30 transition-colors">
                                                <td className="py-3 px-2 whitespace-nowrap text-muted-foreground">
                                                    {formatDate(order.created_at)}
                                                </td>
                                                <td className="py-3 px-2">
                                                    <span className="font-medium">{order.product_name || '–'}</span>
                                                </td>
                                                <td className="py-3 px-2">
                                                    <span className="text-muted-foreground">{clientSummary(order)}</span>
                                                </td>
                                                <td className="py-3 px-2">
                                                    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${getStatusBadgeClass(order.status)}`}>
                                                        {statusLabels[order.status] ?? order.status}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-2 text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                            onClick={() => setDetailOrder(order)}
                                                            title="Voir le détail"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                        <Select
                                                            value={order.status}
                                                            onValueChange={(value) => updateStatus(order.id, value)}
                                                        >
                                                            <SelectTrigger className="w-[140px] h-8 text-xs">
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
                                                        {order.status !== 'pending' && (
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8"
                                                                onClick={() => openNotify(order)}
                                                                title="Notifier le client par email"
                                                            >
                                                                <Bell className="w-4 h-4" />
                                                            </Button>
                                                        )}
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-destructive hover:text-destructive"
                                                            onClick={() => setDeleteOrder(order)}
                                                            title="Supprimer la commande"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
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

            {/* Detail modal */}
            <Dialog open={!!detailOrder} onOpenChange={(open) => !open && setDetailOrder(null)}>
                <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
                    <DialogHeader>
                        <DialogTitle>Détail de la commande</DialogTitle>
                    </DialogHeader>
                    {detailOrder && (
                        <div className="overflow-y-auto space-y-4 pr-2">
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                                <span className="text-muted-foreground">Date</span>
                                <span>{formatDate(detailOrder.created_at)}</span>
                                <span className="text-muted-foreground">Produit</span>
                                <span className="font-medium">{detailOrder.product_name || '–'}</span>
                                <span className="text-muted-foreground">Statut</span>
                                <span>
                                    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${getStatusBadgeClass(detailOrder.status)}`}>
                                        {statusLabels[detailOrder.status] ?? detailOrder.status}
                                    </span>
                                </span>
                                <span className="text-muted-foreground">Quantité</span>
                                <span>{detailOrder.quantity}</span>
                                <span className="text-muted-foreground">Taille(s)</span>
                                <span>
                                    {Array.isArray(detailOrder.sizes) && detailOrder.sizes.length === detailOrder.quantity
                                        ? detailOrder.sizes.join(', ')
                                        : detailOrder.size}
                                </span>
                            </div>
                            <div className="border-t pt-4">
                                <div className="flex items-center gap-2 text-muted-foreground font-medium mb-2">
                                    <User className="w-4 h-4" /> Client
                                </div>
                                <div className="space-y-1 text-sm pl-6">
                                    {detailOrder.customer_name && <p><strong>Nom :</strong> {detailOrder.customer_name}</p>}
                                    <p><strong>Email :</strong> <a href={`mailto:${detailOrder.email}`} className="text-primary hover:underline">{detailOrder.email}</a></p>
                                    <p><strong>Tél :</strong> <a href={`tel:${detailOrder.phone}`} className="text-primary hover:underline">{detailOrder.phone}</a></p>
                                </div>
                            </div>
                            {(detailOrder.address_street || detailOrder.address_city) && (
                                <div className="border-t pt-4">
                                    <div className="flex items-center gap-2 text-muted-foreground font-medium mb-2">
                                        <MapPin className="w-4 h-4" /> Adresse de livraison
                                    </div>
                                    <p className="text-sm pl-6">
                                        {[detailOrder.address_street, detailOrder.address_postal_code, detailOrder.address_city, detailOrder.address_country].filter(Boolean).join(', ')}
                                    </p>
                                </div>
                            )}
                            {(detailOrder.delivery_fee != null) && (
                                <div className="text-sm">
                                    <span className="text-muted-foreground">Frais de livraison : </span>
                                    {detailOrder.delivery_fee > 0 ? `${detailOrder.delivery_fee} DH` : 'Gratuit'}
                                </div>
                            )}
                            {detailOrder.notes && (
                                <div className="border-t pt-4">
                                    <p className="text-muted-foreground font-medium mb-1">Notes</p>
                                    <p className="text-sm">{detailOrder.notes}</p>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Notify modal */}
            <Dialog open={!!notifyOrder} onOpenChange={(open) => !open && setNotifyOrder(null)}>
                <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
                    <DialogHeader>
                        <DialogTitle>Notifier le client par email</DialogTitle>
                        <p className="text-sm text-muted-foreground">
                            Choisissez le statut pour lequel envoyer l’email, consultez l’aperçu puis confirmez l’envoi.
                        </p>
                    </DialogHeader>
                    {notifyOrder && (
                        <>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-muted-foreground">Statut à notifier :</span>
                                <Select value={notifyStatus} onValueChange={setNotifyStatus}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {NOTIFY_STATUS_OPTIONS.map((opt) => (
                                            <SelectItem key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="border rounded-lg overflow-hidden flex-1 min-h-0 flex flex-col">
                                <p className="text-xs text-muted-foreground px-3 py-2 border-b bg-muted/50">Aperçu de l’email</p>
                                <div className="flex-1 min-h-[280px] bg-white">
                                    <iframe
                                        key={`${notifyOrder.id}-${notifyStatus}`}
                                        src={`/admin/orders/${notifyOrder.id}/status-email-preview?status=${notifyStatus}`}
                                        title="Aperçu email"
                                        className="w-full h-full min-h-[280px] border-0"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setNotifyOrder(null)}>
                                    Annuler
                                </Button>
                                <Button onClick={sendNotification} disabled={sendingNotify}>
                                    {sendingNotify ? 'Envoi…' : 'Envoyer l’email au client'}
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* Export Excel */}
            <Dialog open={exportOpen} onOpenChange={setExportOpen}>
                <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
                    <DialogHeader>
                        <DialogTitle>Exporter les commandes (Excel)</DialogTitle>
                        <p className="text-sm text-muted-foreground">
                            Choisissez les filtres et les colonnes à inclure dans le fichier Excel (.xlsx).
                        </p>
                    </DialogHeader>
                    <div className="overflow-y-auto space-y-6 pr-1">
                        <div className="space-y-3">
                            <p className="text-sm font-semibold text-foreground">Filtres</p>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="space-y-1.5 sm:col-span-2">
                                    <Label htmlFor="export-search">Recherche (comme la liste)</Label>
                                    <Input
                                        id="export-search"
                                        value={exportSearch}
                                        onChange={(e) => setExportSearch(e.target.value)}
                                        placeholder="Client, email, téléphone, produit…"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="export-from">Date à partir du</Label>
                                    <Input
                                        id="export-from"
                                        type="date"
                                        value={exportDateFrom}
                                        onChange={(e) => setExportDateFrom(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="export-to">Date jusqu&apos;au</Label>
                                    <Input
                                        id="export-to"
                                        type="date"
                                        value={exportDateTo}
                                        onChange={(e) => setExportDateTo(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-muted-foreground mb-2">Statuts à inclure</p>
                                <div className="flex flex-wrap gap-3">
                                    {STATUS_OPTIONS.map((opt) => (
                                        <label key={opt.value} className="flex items-center gap-2 text-sm cursor-pointer">
                                            <Checkbox
                                                checked={exportStatuses.includes(opt.value)}
                                                onCheckedChange={() => toggleExportStatus(opt.value)}
                                            />
                                            {opt.label}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="space-y-3 border-t pt-4">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <p className="text-sm font-semibold text-foreground">Colonnes</p>
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 text-xs"
                                        onClick={() => setExportSelectedColumns(exportColumns.map((c) => c.key))}
                                    >
                                        Tout
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 text-xs"
                                        onClick={() => setExportSelectedColumns([])}
                                    >
                                        Rien
                                    </Button>
                                </div>
                            </div>
                            <div className="grid gap-2 sm:grid-cols-2 max-h-[220px] overflow-y-auto pr-1">
                                {exportColumns.map((col) => (
                                    <label key={col.key} className="flex items-start gap-2 text-sm cursor-pointer rounded-md border border-border/60 p-2 hover:bg-muted/40">
                                        <Checkbox
                                            className="mt-0.5"
                                            checked={exportSelectedColumns.includes(col.key)}
                                            onCheckedChange={() => toggleExportColumn(col.key)}
                                        />
                                        <span>{col.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button type="button" variant="outline" onClick={() => setExportOpen(false)}>
                            Fermer
                        </Button>
                        <Button
                            type="button"
                            onClick={downloadExport}
                            disabled={exportSelectedColumns.length === 0 || exportStatuses.length === 0}
                        >
                            Télécharger .xlsx
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete confirmation modal */}
            <Dialog open={!!deleteOrder} onOpenChange={(open) => !open && setDeleteOrder(null)}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Supprimer la commande</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-muted-foreground">
                        Êtes-vous sûr de vouloir supprimer cette commande ? Cette action est irréversible.
                    </p>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setDeleteOrder(null)}>
                            Annuler
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete} disabled={deleting}>
                            {deleting ? 'Suppression…' : 'Supprimer'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}

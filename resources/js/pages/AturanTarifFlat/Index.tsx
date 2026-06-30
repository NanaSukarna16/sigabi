import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Plus, Pencil, Trash2, DollarSign, Search, BadgePercent } from 'lucide-react';

interface Tariff {
    id: number;
    jenis_murid: string;
    nominal_insentif: string;
}

interface IndexProps {
    tariffs: Tariff[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Tarif Flat',
        href: '/aturan-tarif-flat',
    },
];

export default function Index({ tariffs }: IndexProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [editingTariff, setEditingTariff] = useState<Tariff | null>(null);

    const { data, setData, post, put, delete: destroy, errors, reset, processing } = useForm({
        jenis_murid: 'dhuafa',
        nominal_insentif: '0',
    });

    const openAddDialog = () => {
        setEditingTariff(null);
        setData({ jenis_murid: 'dhuafa', nominal_insentif: '0' });
        setIsOpen(true);
    };

    const openEditDialog = (tariff: Tariff) => {
        setEditingTariff(tariff);
        setData({
            jenis_murid: tariff.jenis_murid,
            nominal_insentif: String(parseFloat(tariff.nominal_insentif)),
        });
        setIsOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingTariff) {
            put(`/aturan-tarif-flat/${editingTariff.id}`, {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                },
            });
        } else {
            post('/aturan-tarif-flat', {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus aturan tarif flat ini?')) {
            destroy(`/aturan-tarif-flat/${id}`);
        }
    };

    const filteredTariffs = tariffs.filter((t) =>
        t.jenis_murid.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatRupiah = (value: string | number) => {
        const num = typeof value === 'string' ? parseFloat(value) : value;
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(num);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tarif Flat" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                            <DollarSign className="size-6 text-indigo-600 dark:text-indigo-400" />
                            Aturan Tarif Flat Murid Khusus
                        </h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            Kelola insentif flat per murid khusus (dhuafa, trial, baru)
                        </p>
                    </div>
                    <Button onClick={openAddDialog} className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2">
                        <Plus className="size-4" />
                        Tambah Tarif
                    </Button>
                </div>

                {/* Filter and Search */}
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
                    <Input
                        type="text"
                        placeholder="Cari jenis murid (dhuafa, trial, baru)..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
                                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Jenis Murid</th>
                                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Nominal Tarif Flat</th>
                                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                                {filteredTariffs.length > 0 ? (
                                    filteredTariffs.map((t) => (
                                        <tr key={t.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                                            <td className="p-4 font-semibold text-neutral-900 dark:text-neutral-100 capitalize">
                                                <span className={`px-2.5 py-1 rounded text-xs font-bold font-mono ${
                                                    t.jenis_murid === 'dhuafa'
                                                        ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400'
                                                        : t.jenis_murid === 'trial'
                                                        ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400'
                                                        : 'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400'
                                                }`}>
                                                    {t.jenis_murid}
                                                </span>
                                            </td>
                                            <td className="p-4 font-bold text-indigo-600 dark:text-indigo-400">
                                                <div className="flex items-center gap-1.5">
                                                    <BadgePercent className="size-4 text-indigo-600 dark:text-indigo-400" />
                                                    <span>{formatRupiah(t.nominal_insentif)} / murid</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => openEditDialog(t)}
                                                        className="text-neutral-600 hover:text-indigo-600 dark:text-neutral-400 dark:hover:text-indigo-400"
                                                    >
                                                        <Pencil className="size-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDelete(t.id)}
                                                        className="text-neutral-600 hover:text-red-600 dark:text-neutral-400 dark:hover:text-red-400"
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="p-8 text-center text-neutral-500 dark:text-neutral-400">
                                            Belum ada aturan tarif flat dikonfigurasi.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Dialog Form */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                            <DollarSign className="size-5 text-indigo-600 dark:text-indigo-400" />
                            {editingTariff ? 'Edit Tarif Flat' : 'Tambah Tarif Flat'}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="jenis_murid">Jenis Murid Khusus</Label>
                            <Select
                                disabled={editingTariff !== null}
                                value={data.jenis_murid}
                                onValueChange={(val) => setData('jenis_murid', val)}
                            >
                                <SelectTrigger id="jenis_murid">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="dhuafa">Dhuafa (Subsidi)</SelectItem>
                                    <SelectItem value="trial">Trial (Percobaan)</SelectItem>
                                    <SelectItem value="baru">Baru (Pendaftaran)</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.jenis_murid && (
                                <p className="text-xs text-red-500">{errors.jenis_murid}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="nominal_insentif">Nominal Insentif Flat (Rp)</Label>
                            <Input
                                id="nominal_insentif"
                                type="number"
                                min="0"
                                placeholder="Contoh: 50000"
                                value={data.nominal_insentif}
                                onChange={(e) => setData('nominal_insentif', e.target.value)}
                                className={errors.nominal_insentif ? 'border-red-500' : ''}
                            />
                            {errors.nominal_insentif && (
                                <p className="text-xs text-red-500">{errors.nominal_insentif}</p>
                            )}
                        </div>

                        <DialogFooter className="pt-4 flex gap-2">
                            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={processing} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                {processing ? 'Menyimpan...' : 'Simpan'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}

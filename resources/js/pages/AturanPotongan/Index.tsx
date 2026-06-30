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
import { Plus, Pencil, Trash2, Percent, Search, ShieldAlert } from 'lucide-react';

interface Aturan {
    id: number;
    jenis_potongan: string;
    nominal_potongan: string;
    created_at: string;
}

interface IndexProps {
    rules: Aturan[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Aturan Potongan',
        href: '/aturan-potongan',
    },
];

export default function Index({ rules }: IndexProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [editingRule, setEditingRule] = useState<Aturan | null>(null);

    const { data, setData, post, put, delete: destroy, errors, reset, processing } = useForm({
        jenis_potongan: '',
        nominal_potongan: '0',
    });

    const openAddDialog = () => {
        setEditingRule(null);
        setData({ jenis_potongan: '', nominal_potongan: '0' });
        setIsOpen(true);
    };

    const openEditDialog = (rule: Aturan) => {
        setEditingRule(rule);
        setData({
            jenis_potongan: rule.jenis_potongan,
            nominal_potongan: String(parseFloat(rule.nominal_potongan)),
        });
        setIsOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingRule) {
            put(`/aturan-potongan/${editingRule.id}`, {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                },
            });
        } else {
            post('/aturan-potongan', {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus aturan potongan ini?')) {
            destroy(`/aturan-potongan/${id}`);
        }
    };

    const filteredRules = rules.filter((rule) =>
        rule.jenis_potongan.toLowerCase().includes(searchTerm.toLowerCase())
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
            <Head title="Aturan Potongan" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                            <Percent className="size-6 text-indigo-600 dark:text-indigo-400" />
                            Aturan Potongan Gaji
                        </h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            Kelola aturan dan nominal pemotongan gaji (misal: absen, terlambat, dsb.)
                        </p>
                    </div>
                    <Button onClick={openAddDialog} className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2">
                        <Plus className="size-4" />
                        Tambah Aturan
                    </Button>
                </div>

                {/* Filter and Search */}
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
                    <Input
                        type="text"
                        placeholder="Cari jenis potongan..."
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
                                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Jenis Potongan</th>
                                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Nominal Potongan</th>
                                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                                {filteredRules.length > 0 ? (
                                    filteredRules.map((rule) => (
                                        <tr key={rule.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                                            <td className="p-4 font-semibold text-neutral-900 dark:text-neutral-100">
                                                {rule.jenis_potongan}
                                            </td>
                                            <td className="p-4 font-medium text-neutral-900 dark:text-neutral-100">
                                                <div className="flex items-center gap-1.5">
                                                    <ShieldAlert className="size-4 text-red-500 dark:text-red-400" />
                                                    <span className="text-red-600 dark:text-red-400">{formatRupiah(rule.nominal_potongan)}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => openEditDialog(rule)}
                                                        className="text-neutral-600 hover:text-indigo-600 dark:text-neutral-400 dark:hover:text-indigo-400"
                                                    >
                                                        <Pencil className="size-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDelete(rule.id)}
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
                                            Tidak ada aturan potongan ditemukan.
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
                            <Percent className="size-5 text-indigo-600 dark:text-indigo-400" />
                            {editingRule ? 'Edit Aturan Potongan' : 'Tambah Aturan Potongan'}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="jenis_potongan">Jenis Potongan</Label>
                            <Input
                                id="jenis_potongan"
                                placeholder="Contoh: Terlambat, Absen Tanpa Kabar"
                                value={data.jenis_potongan}
                                onChange={(e) => setData('jenis_potongan', e.target.value)}
                                className={errors.jenis_potongan ? 'border-red-500' : ''}
                            />
                            {errors.jenis_potongan && (
                                <p className="text-xs text-red-500">{errors.jenis_potongan}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="nominal_potongan">Nominal Potongan (Rp)</Label>
                            <Input
                                id="nominal_potongan"
                                type="number"
                                min="0"
                                placeholder="Contoh: 10000"
                                value={data.nominal_potongan}
                                onChange={(e) => setData('nominal_potongan', e.target.value)}
                                className={errors.nominal_potongan ? 'border-red-500' : ''}
                            />
                            {errors.nominal_potongan && (
                                <p className="text-xs text-red-500">{errors.nominal_potongan}</p>
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

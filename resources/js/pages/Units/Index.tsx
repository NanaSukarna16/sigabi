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
import { Plus, Pencil, Trash2, Building2, MapPin, Search } from 'lucide-react';

interface Unit {
    id: number;
    nama_unit: string;
    alamat: string | null;
    created_at: string;
}

interface IndexProps {
    units: Unit[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Master Unit',
        href: '/units',
    },
];

export default function Index({ units }: IndexProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [editingUnit, setEditingUnit] = useState<Unit | null>(null);

    const { data, setData, post, put, delete: destroy, errors, reset, processing } = useForm({
        nama_unit: '',
        alamat: '',
    });

    const openAddDialog = () => {
        setEditingUnit(null);
        setData({ nama_unit: '', alamat: '' });
        setIsOpen(true);
    };

    const openEditDialog = (unit: Unit) => {
        setEditingUnit(unit);
        setData({
            nama_unit: unit.nama_unit,
            alamat: unit.alamat || '',
        });
        setIsOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingUnit) {
            put(`/units/${editingUnit.id}`, {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                },
            });
        } else {
            post('/units', {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus unit ini?')) {
            destroy(`/units/${id}`);
        }
    };

    const filteredUnits = units.filter((unit) =>
        unit.nama_unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (unit.alamat && unit.alamat.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Master Unit" />
            
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                            <Building2 className="size-6 text-indigo-600 dark:text-indigo-400" />
                            Data Unit biMBA
                        </h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            Kelola semua unit operasional biMBA AIUEO
                        </p>
                    </div>
                    <Button onClick={openAddDialog} className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2">
                        <Plus className="size-4" />
                        Tambah Unit
                    </Button>
                </div>

                {/* Filter and Search */}
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
                    <Input
                        type="text"
                        placeholder="Cari unit berdasarkan nama atau alamat..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Table Container */}
                <div className="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
                                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Nama Unit</th>
                                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Alamat</th>
                                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Tanggal Dibuat</th>
                                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                                {filteredUnits.length > 0 ? (
                                    filteredUnits.map((unit) => (
                                        <tr key={unit.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                                            <td className="p-4 font-medium text-neutral-900 dark:text-neutral-100">
                                                <div className="flex items-center gap-2">
                                                    <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                                                        <Building2 className="size-4" />
                                                    </div>
                                                    {unit.nama_unit}
                                                </div>
                                            </td>
                                            <td className="p-4 text-neutral-600 dark:text-neutral-400">
                                                <div className="flex items-center gap-1.5">
                                                    <MapPin className="size-4 shrink-0 text-neutral-400" />
                                                    <span className="truncate max-w-xs sm:max-w-md">{unit.alamat || '-'}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-sm text-neutral-500 dark:text-neutral-400">
                                                {new Date(unit.created_at).toLocaleDateString('id-ID', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => openEditDialog(unit)}
                                                        className="text-neutral-600 hover:text-indigo-600 dark:text-neutral-400 dark:hover:text-indigo-400"
                                                    >
                                                        <Pencil className="size-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDelete(unit.id)}
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
                                        <td colSpan={4} className="p-8 text-center text-neutral-500 dark:text-neutral-400">
                                            Tidak ada unit ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Form Dialog */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                            <Building2 className="size-5 text-indigo-600 dark:text-indigo-400" />
                            {editingUnit ? 'Edit Unit biMBA' : 'Tambah Unit biMBA'}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="nama_unit">Nama Unit</Label>
                            <Input
                                id="nama_unit"
                                placeholder="Masukkan nama unit (misal: Unit Tomang)"
                                value={data.nama_unit}
                                onChange={(e) => setData('nama_unit', e.target.value)}
                                className={errors.nama_unit ? 'border-red-500' : ''}
                            />
                            {errors.nama_unit && (
                                <p className="text-xs text-red-500">{errors.nama_unit}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="alamat">Alamat</Label>
                            <Input
                                id="alamat"
                                placeholder="Masukkan alamat lengkap unit"
                                value={data.alamat}
                                onChange={(e) => setData('alamat', e.target.value)}
                                className={errors.alamat ? 'border-red-500' : ''}
                            />
                            {errors.alamat && (
                                <p className="text-xs text-red-500">{errors.alamat}</p>
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

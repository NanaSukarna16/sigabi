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
import { Plus, Pencil, Trash2, GraduationCap, Search, Award } from 'lucide-react';

interface Kategori {
    id: number;
    kode_kategori: string;
    nama_kategori: string | null;
    poin_progress: string;
    created_at: string;
}

interface IndexProps {
    categories: Kategori[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Kategori Murid',
        href: '/kategori-murid',
    },
];

export default function Index({ categories }: IndexProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Kategori | null>(null);

    const { data, setData, post, put, delete: destroy, errors, reset, processing } = useForm({
        kode_kategori: '',
        nama_kategori: '',
        poin_progress: '0',
    });

    const openAddDialog = () => {
        setEditingCategory(null);
        setData({ kode_kategori: '', nama_kategori: '', poin_progress: '0' });
        setIsOpen(true);
    };

    const openEditDialog = (category: Kategori) => {
        setEditingCategory(category);
        setData({
            kode_kategori: category.kode_kategori,
            nama_kategori: category.nama_kategori || '',
            poin_progress: String(parseFloat(category.poin_progress)),
        });
        setIsOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingCategory) {
            put(`/kategori-murid/${editingCategory.id}`, {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                },
            });
        } else {
            post('/kategori-murid', {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
            destroy(`/kategori-murid/${id}`);
        }
    };

    const filteredCategories = categories.filter((cat) =>
        cat.kode_kategori.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (cat.nama_kategori && cat.nama_kategori.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kategori Murid" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                            <GraduationCap className="size-6 text-indigo-600 dark:text-indigo-400" />
                            Kategori Tingkatan Murid
                        </h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            Kelola kategori/tingkatan belajar anak beserta bobot poin progress untuk penggajian
                        </p>
                    </div>
                    <Button onClick={openAddDialog} className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2">
                        <Plus className="size-4" />
                        Tambah Kategori
                    </Button>
                </div>

                {/* Filter and Search */}
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
                    <Input
                        type="text"
                        placeholder="Cari kode atau nama tingkatan..."
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
                                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Kode Tingkatan</th>
                                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Nama Kategori</th>
                                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Poin Progress</th>
                                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                                {filteredCategories.length > 0 ? (
                                    filteredCategories.map((cat) => (
                                        <tr key={cat.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                                            <td className="p-4 font-semibold text-neutral-900 dark:text-neutral-100">
                                                <span className="px-2.5 py-1 rounded bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-mono">
                                                    {cat.kode_kategori}
                                                </span>
                                            </td>
                                            <td className="p-4 text-neutral-700 dark:text-neutral-300">
                                                {cat.nama_kategori || '-'}
                                            </td>
                                            <td className="p-4 font-medium text-neutral-900 dark:text-neutral-100">
                                                <div className="flex items-center gap-1">
                                                    <Award className="size-4 text-indigo-600 dark:text-indigo-400" />
                                                    <span>{parseFloat(cat.poin_progress)} Poin</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => openEditDialog(cat)}
                                                        className="text-neutral-600 hover:text-indigo-600 dark:text-neutral-400 dark:hover:text-indigo-400"
                                                    >
                                                        <Pencil className="size-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDelete(cat.id)}
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
                                            Tidak ada kategori murid ditemukan.
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
                            <GraduationCap className="size-5 text-indigo-600 dark:text-indigo-400" />
                            {editingCategory ? 'Edit Kategori Murid' : 'Tambah Kategori Murid'}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="kode_kategori">Kode Kategori / Tingkatan</Label>
                            <Input
                                id="kode_kategori"
                                placeholder="Contoh: S3, S4, K1"
                                value={data.kode_kategori}
                                onChange={(e) => setData('kode_kategori', e.target.value)}
                                className={errors.kode_kategori ? 'border-red-500' : ''}
                            />
                            {errors.kode_kategori && (
                                <p className="text-xs text-red-500">{errors.kode_kategori}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="nama_kategori">Nama Kategori (Opsional)</Label>
                            <Input
                                id="nama_kategori"
                                placeholder="Contoh: Tingkat Dasar 3"
                                value={data.nama_kategori}
                                onChange={(e) => setData('nama_kategori', e.target.value)}
                                className={errors.nama_kategori ? 'border-red-500' : ''}
                            />
                            {errors.nama_kategori && (
                                <p className="text-xs text-red-500">{errors.nama_kategori}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="poin_progress">Bobot Poin Progress</Label>
                            <Input
                                id="poin_progress"
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="Contoh: 1.00"
                                value={data.poin_progress}
                                onChange={(e) => setData('poin_progress', e.target.value)}
                                className={errors.poin_progress ? 'border-red-500' : ''}
                            />
                            {errors.poin_progress && (
                                <p className="text-xs text-red-500">{errors.poin_progress}</p>
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

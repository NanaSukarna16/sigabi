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
import { Plus, Pencil, Trash2, Coins, Search, Award } from 'lucide-react';

interface Conversion {
    id: number;
    role: 'guru' | 'kepala_unit';
    poin_minimal: string;
    poin_maksimal: string;
    nominal_insentif: string;
}

interface IndexProps {
    conversions: Conversion[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Konversi Poin',
        href: '/aturan-konversi-poin',
    },
];

export default function Index({ conversions }: IndexProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [editingConversion, setEditingConversion] = useState<Conversion | null>(null);

    const { data, setData, post, put, delete: destroy, errors, reset, processing } = useForm({
        role: 'guru',
        poin_minimal: '0',
        poin_maksimal: '0',
        nominal_insentif: '0',
    });

    const openAddDialog = () => {
        setEditingConversion(null);
        setData({ role: 'guru', poin_minimal: '0', poin_maksimal: '0', nominal_insentif: '0' });
        setIsOpen(true);
    };

    const openEditDialog = (conv: Conversion) => {
        setEditingConversion(conv);
        setData({
            role: conv.role,
            poin_minimal: String(parseFloat(conv.poin_minimal)),
            poin_maksimal: String(parseFloat(conv.poin_maksimal)),
            nominal_insentif: String(parseFloat(conv.nominal_insentif)),
        });
        setIsOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingConversion) {
            put(`/aturan-konversi-poin/${editingConversion.id}`, {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                },
            });
        } else {
            post('/aturan-konversi-poin', {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus aturan konversi poin ini?')) {
            destroy(`/aturan-konversi-poin/${id}`);
        }
    };

    const filteredConversions = conversions.filter((c) =>
        c.role.toLowerCase().replace('_', ' ').includes(searchTerm.toLowerCase())
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
            <Head title="Konversi Poin" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                            <Coins className="size-6 text-indigo-600 dark:text-indigo-400" />
                            Aturan Konversi Poin Progress
                        </h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            Kelola rentang akumulasi poin bulanan beserta nilai insentif rupiah untuk Guru dan Kepala Unit
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
                        placeholder="Cari role (guru, kepala unit)..."
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
                                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Role Karyawan</th>
                                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Rentang Poin</th>
                                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Nominal Insentif</th>
                                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                                {filteredConversions.length > 0 ? (
                                    filteredConversions.map((conv) => (
                                        <tr key={conv.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                                            <td className="p-4 font-semibold text-neutral-900 dark:text-neutral-100 uppercase text-xs tracking-wider">
                                                <span className={`px-2 py-0.5 rounded-full font-bold ${
                                                    conv.role === 'guru'
                                                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400'
                                                        : 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400'
                                                }`}>
                                                    {conv.role.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="p-4 font-mono font-medium text-neutral-700 dark:text-neutral-300">
                                                {parseFloat(conv.poin_minimal)} - {parseFloat(conv.poin_maksimal)} Poin
                                            </td>
                                            <td className="p-4 font-bold text-green-600 dark:text-green-400">
                                                <div className="flex items-center gap-1">
                                                    <Award className="size-4 text-green-600 dark:text-green-400" />
                                                    <span>{formatRupiah(conv.nominal_insentif)}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => openEditDialog(conv)}
                                                        className="text-neutral-600 hover:text-indigo-600 dark:text-neutral-400 dark:hover:text-indigo-400"
                                                    >
                                                        <Pencil className="size-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDelete(conv.id)}
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
                                            Belum ada aturan konversi poin dikonfigurasi.
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
                            <Coins className="size-5 text-indigo-600 dark:text-indigo-400" />
                            {editingConversion ? 'Edit Konversi Poin' : 'Tambah Konversi Poin'}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="role">Role Karyawan</Label>
                            <Select
                                value={data.role}
                                onValueChange={(val: any) => setData('role', val)}
                            >
                                <SelectTrigger id="role">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="guru">Guru</SelectItem>
                                    <SelectItem value="kepala_unit">Kepala Unit</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.role && (
                                <p className="text-xs text-red-500">{errors.role}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="poin_minimal">Poin Minimal</Label>
                                <Input
                                    id="poin_minimal"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.poin_minimal}
                                    onChange={(e) => setData('poin_minimal', e.target.value)}
                                    className={errors.poin_minimal ? 'border-red-500' : ''}
                                />
                                {errors.poin_minimal && (
                                    <p className="text-xs text-red-500">{errors.poin_minimal}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="poin_maksimal">Poin Maksimal</Label>
                                <Input
                                    id="poin_maksimal"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.poin_maksimal}
                                    onChange={(e) => setData('poin_maksimal', e.target.value)}
                                    className={errors.poin_maksimal ? 'border-red-500' : ''}
                                />
                                {errors.poin_maksimal && (
                                    <p className="text-xs text-red-500">{errors.poin_maksimal}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="nominal_insentif">Nominal Insentif (Rp)</Label>
                            <Input
                                id="nominal_insentif"
                                type="number"
                                min="0"
                                placeholder="Contoh: 200000"
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

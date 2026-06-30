import { useState, useEffect } from 'react';
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
import { Plus, Pencil, Trash2, Smile, Search, GraduationCap, Building2, User } from 'lucide-react';

interface Unit {
    id: number;
    nama_unit: string;
}

interface Guru {
    id: number;
    name: string;
}

interface Kategori {
    id: number;
    kode_kategori: string;
    poin_progress: string;
}

interface Murid {
    id: number;
    nama_murid: string;
    user_id: number | null;
    user?: Guru | null;
    unit_id: number | null;
    unit?: Unit | null;
    kategori_murid_id: number | null;
    kategori?: Kategori | null;
    jenis_murid: 'reguler' | 'dhuafa' | 'trial' | 'baru';
    status: 'aktif' | 'nonaktif';
    created_at: string;
}

interface IndexProps {
    murids: Murid[];
    units: Unit[];
    gurus: Guru[];
    categories: Kategori[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Murid biMBA',
        href: '/murid',
    },
];

export default function Index({ murids, units, gurus, categories }: IndexProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [editingMurid, setEditingMurid] = useState<Murid | null>(null);

    const { data, setData, post, put, delete: destroy, errors, reset, processing } = useForm({
        nama_murid: '',
        user_id: '',
        unit_id: '',
        kategori_murid_id: '',
        jenis_murid: 'reguler',
        status: 'aktif',
    });

    // If jenis_murid is not reguler, clear kategori_murid_id
    useEffect(() => {
        if (data.jenis_murid !== 'reguler') {
            setData('kategori_murid_id', '');
        }
    }, [data.jenis_murid]);

    const openAddDialog = () => {
        setEditingMurid(null);
        setData({
            nama_murid: '',
            user_id: '',
            unit_id: '',
            kategori_murid_id: '',
            jenis_murid: 'reguler',
            status: 'aktif',
        });
        setIsOpen(true);
    };

    const openEditDialog = (murid: Murid) => {
        setEditingMurid(murid);
        setData({
            nama_murid: murid.nama_murid,
            user_id: murid.user_id ? String(murid.user_id) : '',
            unit_id: murid.unit_id ? String(murid.unit_id) : '',
            kategori_murid_id: murid.kategori_murid_id ? String(murid.kategori_murid_id) : '',
            jenis_murid: murid.jenis_murid,
            status: murid.status,
        });
        setIsOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingMurid) {
            put(`/murid/${editingMurid.id}`, {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                },
            });
        } else {
            post('/murid', {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus murid ini?')) {
            destroy(`/murid/${id}`);
        }
    };

    const filteredMurids = murids.filter((m) =>
        m.nama_murid.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.user && m.user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (m.unit && m.unit.nama_unit.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Murid biMBA" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                            <Smile className="size-6 text-indigo-600 dark:text-indigo-400" />
                            Data Murid biMBA
                        </h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            Kelola data murid, pendaftaran tingkat belajar, guru pembimbing, dan unit operasional
                        </p>
                    </div>
                    <Button onClick={openAddDialog} className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2">
                        <Plus className="size-4" />
                        Tambah Murid
                    </Button>
                </div>

                {/* Filter and Search */}
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
                    <Input
                        type="text"
                        placeholder="Cari nama murid, guru, unit..."
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
                                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Nama Murid</th>
                                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Unit</th>
                                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Guru Pembimbing</th>
                                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Tingkat Akademik</th>
                                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Jenis & Status</th>
                                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                                {filteredMurids.length > 0 ? (
                                    filteredMurids.map((murid) => (
                                        <tr key={murid.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                                            <td className="p-4 font-semibold text-neutral-900 dark:text-neutral-100">
                                                {murid.nama_murid}
                                            </td>
                                            <td className="p-4 text-neutral-600 dark:text-neutral-400">
                                                {murid.unit ? (
                                                    <span className="flex items-center gap-1">
                                                        <Building2 className="size-3 text-neutral-400" /> {murid.unit.nama_unit}
                                                    </span>
                                                ) : '-'}
                                            </td>
                                            <td className="p-4 text-neutral-600 dark:text-neutral-400">
                                                {murid.user ? (
                                                    <span className="flex items-center gap-1">
                                                        <User className="size-3 text-neutral-400" /> {murid.user.name}
                                                    </span>
                                                ) : '-'}
                                            </td>
                                            <td className="p-4">
                                                {murid.jenis_murid === 'reguler' ? (
                                                    murid.kategori ? (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-mono font-medium text-xs">
                                                            <GraduationCap className="size-3" /> {murid.kategori.kode_kategori}
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs text-red-500 font-medium">Kategori Kosong</span>
                                                    )
                                                ) : (
                                                    <span className="text-xs text-neutral-400 italic">Bukan Poin</span>
                                                )}
                                            </td>
                                            <td className="p-4 space-y-1">
                                                <div className="flex gap-1.5 flex-wrap">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold uppercase ${
                                                        murid.jenis_murid === 'reguler'
                                                            ? 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/50'
                                                            : murid.jenis_murid === 'dhuafa'
                                                            ? 'bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-900/50'
                                                            : murid.jenis_murid === 'trial'
                                                            ? 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50'
                                                            : 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-900/50'
                                                    }`}>
                                                        {murid.jenis_murid}
                                                    </span>
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                                                        murid.status === 'aktif'
                                                            ? 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-900/50'
                                                            : 'bg-neutral-100 text-neutral-700 border border-neutral-200 dark:bg-neutral-800/50 dark:text-neutral-400 dark:border-neutral-700'
                                                    }`}>
                                                        {murid.status === 'aktif' ? 'Aktif' : 'Nonaktif'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => openEditDialog(murid)}
                                                        className="text-neutral-600 hover:text-indigo-600 dark:text-neutral-400 dark:hover:text-indigo-400"
                                                    >
                                                        <Pencil className="size-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDelete(murid.id)}
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
                                        <td colSpan={6} className="p-8 text-center text-neutral-500 dark:text-neutral-400">
                                            Tidak ada data murid ditemukan.
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
                            <Smile className="size-5 text-indigo-600 dark:text-indigo-400" />
                            {editingMurid ? 'Edit Data Murid' : 'Tambah Murid Baru'}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="nama_murid">Nama Lengkap Murid</Label>
                            <Input
                                id="nama_murid"
                                placeholder="Nama Lengkap Anak"
                                value={data.nama_murid}
                                onChange={(e) => setData('nama_murid', e.target.value)}
                                className={errors.nama_murid ? 'border-red-500' : ''}
                            />
                            {errors.nama_murid && (
                                <p className="text-xs text-red-500">{errors.nama_murid}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="jenis_murid">Skema / Jenis Murid</Label>
                                <Select
                                    value={data.jenis_murid}
                                    onValueChange={(val: any) => setData('jenis_murid', val)}
                                >
                                    <SelectTrigger id="jenis_murid">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="reguler">Reguler (Poin)</SelectItem>
                                        <SelectItem value="dhuafa">Dhuafa (Subsidi)</SelectItem>
                                        <SelectItem value="trial">Trial (Percobaan)</SelectItem>
                                        <SelectItem value="baru">Baru (Pendaftaran)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status">Status Murid</Label>
                                <Select
                                    value={data.status}
                                    onValueChange={(val: any) => setData('status', val)}
                                >
                                    <SelectTrigger id="status">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="aktif">Aktif</SelectItem>
                                        <SelectItem value="nonaktif">Nonaktif</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="kategori_murid_id">Tingkat Akademik (S3-S6, K1-K2)</Label>
                            <Select
                                disabled={data.jenis_murid !== 'reguler'}
                                value={data.kategori_murid_id}
                                onValueChange={(val) => setData('kategori_murid_id', val)}
                            >
                                <SelectTrigger id="kategori_murid_id">
                                    <SelectValue placeholder={data.jenis_murid !== 'reguler' ? 'Bukan Murid Poin' : 'Pilih Tingkat'} />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.id} value={String(cat.id)}>
                                            {cat.kode_kategori} ({parseFloat(cat.poin_progress)} Poin)
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.kategori_murid_id && (
                                <p className="text-xs text-red-500">{errors.kategori_murid_id}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="user_id">Guru Pembimbing</Label>
                            <Select
                                value={data.user_id}
                                onValueChange={(val) => setData('user_id', val)}
                            >
                                <SelectTrigger id="user_id">
                                    <SelectValue placeholder="Pilih Guru" />
                                </SelectTrigger>
                                <SelectContent>
                                    {gurus.map((guru) => (
                                        <SelectItem key={guru.id} value={String(guru.id)}>
                                            {guru.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.user_id && (
                                <p className="text-xs text-red-500">{errors.user_id}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="unit_id">Unit Operasional</Label>
                            <Select
                                value={data.unit_id}
                                onValueChange={(val) => setData('unit_id', val)}
                            >
                                <SelectTrigger id="unit_id">
                                    <SelectValue placeholder="Pilih Unit" />
                                </SelectTrigger>
                                <SelectContent>
                                    {units.map((unit) => (
                                        <SelectItem key={unit.id} value={String(unit.id)}>
                                            {unit.nama_unit}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.unit_id && (
                                <p className="text-xs text-red-500">{errors.unit_id}</p>
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

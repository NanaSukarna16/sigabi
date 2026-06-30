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
import {
    Plus,
    Pencil,
    Trash2,
    Eye,
    Users,
    UserCheck,
    Mail,
    Phone,
    MapPin,
    Building2,
    Search,
    CreditCard,
} from 'lucide-react';

interface Unit {
    id: number;
    nama_unit: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    unit_id: number | null;
    unit?: Unit | null;
    no_hp: string | null;
    alamat: string | null;
    role: 'superadmin' | 'guru' | 'kepala_unit';
    gaji_pokok: string;
    tunjangan_kesehatan: string;
    tunjangan_transport: string;
    tunjangan_kerajinan: string;
    status: 'aktif' | 'nonaktif';
    created_at: string;
}

interface IndexProps {
    users: User[];
    units: Unit[];
    currentRole: 'guru' | 'kepala_unit' | 'superadmin';
}

export default function Index({ users, units, currentRole }: IndexProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [viewingUser, setViewingUser] = useState<User | null>(null);

    const titleText = currentRole === 'guru' ? 'Guru biMBA' : 'Kepala Unit';
    const IconComponent = currentRole === 'guru' ? Users : UserCheck;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Karyawan',
            href: `/users?role=${currentRole}`,
        },
        {
            title: titleText,
            href: `/users?role=${currentRole}`,
        },
    ];

    const { data, setData, post, put, delete: destroy, errors, reset, processing } = useForm({
        name: '',
        email: '',
        password: '',
        unit_id: '',
        no_hp: '',
        alamat: '',
        role: currentRole,
        gaji_pokok: '0',
        tunjangan_kesehatan: '0',
        tunjangan_transport: '0',
        tunjangan_kerajinan: '0',
        status: 'aktif',
    });

    // Automatically set role based on active page role context
    useEffect(() => {
        setData('role', currentRole);
    }, [currentRole]);

    const openAddDialog = () => {
        setEditingUser(null);
        setData({
            name: '',
            email: '',
            password: '',
            unit_id: '',
            no_hp: '',
            alamat: '',
            role: currentRole,
            gaji_pokok: '0',
            tunjangan_kesehatan: '0',
            tunjangan_transport: '0',
            tunjangan_kerajinan: '0',
            status: 'aktif',
        });
        setIsOpen(true);
    };

    const openEditDialog = (user: User) => {
        setEditingUser(user);
        setData({
            name: user.name,
            email: user.email,
            password: '',
            unit_id: user.unit_id ? String(user.unit_id) : '',
            no_hp: user.no_hp || '',
            alamat: user.alamat || '',
            role: user.role,
            gaji_pokok: String(parseFloat(user.gaji_pokok || '0')),
            tunjangan_kesehatan: String(parseFloat(user.tunjangan_kesehatan || '0')),
            tunjangan_transport: String(parseFloat(user.tunjangan_transport || '0')),
            tunjangan_kerajinan: String(parseFloat(user.tunjangan_kerajinan || '0')),
            status: user.status,
        });
        setIsOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingUser) {
            put(`/users/${editingUser.id}`, {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                },
            });
        } else {
            post('/users', {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus karyawan ini?')) {
            destroy(`/users/${id}`);
        }
    };

    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.no_hp && user.no_hp.includes(searchTerm)) ||
        (user.unit && user.unit.nama_unit.toLowerCase().includes(searchTerm.toLowerCase()))
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
            <Head title={`Master ${titleText}`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                            <IconComponent className="size-6 text-indigo-600 dark:text-indigo-400" />
                            Data {titleText}
                        </h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            Kelola data {titleText.toLowerCase()} beserta detail penggajiannya
                        </p>
                    </div>
                    <Button onClick={openAddDialog} className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2">
                        <Plus className="size-4" />
                        Tambah {titleText}
                    </Button>
                </div>

                {/* Filter and Search */}
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
                    <Input
                        type="text"
                        placeholder={`Cari nama, email, unit...`}
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
                                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Nama / Kontak</th>
                                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Unit Kerja</th>
                                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Gaji Pokok</th>
                                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Status</th>
                                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                                            <td className="p-4">
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-neutral-900 dark:text-neutral-100">{user.name}</span>
                                                    <span className="text-xs text-neutral-500 flex items-center gap-1 mt-0.5">
                                                        <Mail className="size-3" /> {user.email}
                                                    </span>
                                                    {user.no_hp && (
                                                        <span className="text-xs text-neutral-500 flex items-center gap-1">
                                                            <Phone className="size-3" /> {user.no_hp}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                {user.unit ? (
                                                    <div className="flex items-center gap-1.5 text-neutral-700 dark:text-neutral-300">
                                                        <Building2 className="size-4 text-neutral-400" />
                                                        <span>{user.unit.nama_unit}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-neutral-400">Belum Ditugaskan</span>
                                                )}
                                            </td>
                                            <td className="p-4 font-medium text-neutral-900 dark:text-neutral-100">
                                                {formatRupiah(user.gaji_pokok)}
                                            </td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                                    user.status === 'aktif'
                                                        ? 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-900/50'
                                                        : 'bg-neutral-100 text-neutral-700 border border-neutral-200 dark:bg-neutral-800/50 dark:text-neutral-400 dark:border-neutral-700'
                                                }`}>
                                                    {user.status === 'aktif' ? 'Aktif' : 'Nonaktif'}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => setViewingUser(user)}
                                                        className="text-neutral-600 hover:text-indigo-600 dark:text-neutral-400 dark:hover:text-indigo-400"
                                                    >
                                                        <Eye className="size-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => openEditDialog(user)}
                                                        className="text-neutral-600 hover:text-indigo-600 dark:text-neutral-400 dark:hover:text-indigo-400"
                                                    >
                                                        <Pencil className="size-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDelete(user.id)}
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
                                        <td colSpan={5} className="p-8 text-center text-neutral-500 dark:text-neutral-400">
                                            Tidak ada data {titleText.toLowerCase()} ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Dialog Form Tambah / Edit */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                            <IconComponent className="size-5 text-indigo-600 dark:text-indigo-400" />
                            {editingUser ? `Edit Data ${titleText}` : `Tambah ${titleText} Baru`}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-6 py-2">
                        {/* Section 1: Personal info */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 pb-1 border-b border-neutral-100 dark:border-neutral-800">
                                Informasi Profil & Kontak
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="name">Nama Lengkap</Label>
                                    <Input
                                        id="name"
                                        placeholder="Nama Lengkap"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className={errors.name ? 'border-red-500' : ''}
                                    />
                                    {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="nama@email.com"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className={errors.email ? 'border-red-500' : ''}
                                    />
                                    {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="password">Password {editingUser && '(Kosongkan jika tidak diubah)'}</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className={errors.password ? 'border-red-500' : ''}
                                    />
                                    {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="no_hp">No. HP / WhatsApp</Label>
                                    <Input
                                        id="no_hp"
                                        placeholder="08123456789"
                                        value={data.no_hp}
                                        onChange={(e) => setData('no_hp', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="alamat">Alamat Lengkap</Label>
                                <Input
                                    id="alamat"
                                    placeholder="Alamat tempat tinggal sekarang"
                                    value={data.alamat}
                                    onChange={(e) => setData('alamat', e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Section 2: Penugasan & Status (Role select removed, automatically assigned) */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 pb-1 border-b border-neutral-100 dark:border-neutral-800">
                                Penugasan & Status Kerja
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="unit_id">Unit Kerja</Label>
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
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="status">Status</Label>
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
                        </div>

                        {/* Section 3: Payroll Settings */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 pb-1 border-b border-neutral-100 dark:border-neutral-800 flex items-center gap-1.5">
                                <CreditCard className="size-4" /> Detail Gaji & Tunjangan Bulanan
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="gaji_pokok">Gaji Pokok</Label>
                                    <Input
                                        id="gaji_pokok"
                                        type="number"
                                        min="0"
                                        value={data.gaji_pokok}
                                        onChange={(e) => setData('gaji_pokok', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="tunjangan_kesehatan">Tunj. Kesehatan</Label>
                                    <Input
                                        id="tunjangan_kesehatan"
                                        type="number"
                                        min="0"
                                        value={data.tunjangan_kesehatan}
                                        onChange={(e) => setData('tunjangan_kesehatan', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="tunjangan_transport">Tunj. Transport</Label>
                                    <Input
                                        id="tunjangan_transport"
                                        type="number"
                                        min="0"
                                        value={data.tunjangan_transport}
                                        onChange={(e) => setData('tunjangan_transport', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="tunjangan_kerajinan">Tunj. Kerajinan</Label>
                                    <Input
                                        id="tunjangan_kerajinan"
                                        type="number"
                                        min="0"
                                        value={data.tunjangan_kerajinan}
                                        onChange={(e) => setData('tunjangan_kerajinan', e.target.value)}
                                    />
                                </div>
                            </div>
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

            {/* Dialog Detail Karyawan */}
            <Dialog open={!!viewingUser} onOpenChange={() => setViewingUser(null)}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                            <IconComponent className="size-5 text-indigo-600 dark:text-indigo-400" />
                            Detail Karyawan ({titleText})
                        </DialogTitle>
                    </DialogHeader>
                    {viewingUser && (
                        <div className="space-y-6 py-4">
                            {/* Personal Info */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 rounded-full bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400">
                                        <IconComponent className="size-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">{viewingUser.name}</h4>
                                        <p className="text-sm text-indigo-600 dark:text-indigo-400 capitalize">{viewingUser.role.replace('_', ' ')}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800 text-sm">
                                    <div className="flex justify-between py-1">
                                        <span className="text-neutral-500">Email:</span>
                                        <span className="font-medium text-neutral-900 dark:text-neutral-100">{viewingUser.email}</span>
                                    </div>
                                    <div className="flex justify-between py-1">
                                        <span className="text-neutral-500">No. HP / WA:</span>
                                        <span className="font-medium text-neutral-900 dark:text-neutral-100">{viewingUser.no_hp || '-'}</span>
                                    </div>
                                    <div className="flex justify-between py-1">
                                        <span className="text-neutral-500">Unit Penugasan:</span>
                                        <span className="font-medium text-neutral-900 dark:text-neutral-100">
                                            {viewingUser.unit ? viewingUser.unit.nama_unit : 'Belum Ditugaskan'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between py-1">
                                        <span className="text-neutral-500">Status Kepegawaian:</span>
                                        <span className="font-medium capitalize text-neutral-900 dark:text-neutral-100">{viewingUser.status}</span>
                                    </div>
                                    <div className="flex flex-col gap-1 py-1">
                                        <span className="text-neutral-500">Alamat:</span>
                                        <span className="font-medium text-neutral-900 dark:text-neutral-100">{viewingUser.alamat || '-'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Payroll Details */}
                            <div className="space-y-3 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                                <h4 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
                                    <CreditCard className="size-4 text-indigo-600 dark:text-indigo-400" />
                                    Struktur Gaji & Tunjangan Bulanan
                                </h4>
                                <div className="grid grid-cols-1 gap-2 text-sm">
                                    <div className="flex justify-between py-1 bg-neutral-50 dark:bg-neutral-900/50 px-2.5 rounded">
                                        <span className="text-neutral-600 dark:text-neutral-400">Gaji Pokok:</span>
                                        <span className="font-bold text-neutral-900 dark:text-neutral-100">{formatRupiah(viewingUser.gaji_pokok)}</span>
                                    </div>
                                    <div className="flex justify-between py-1 px-2.5">
                                        <span className="text-neutral-600 dark:text-neutral-400">Tunjangan Kesehatan:</span>
                                        <span className="font-medium text-neutral-900 dark:text-neutral-100">{formatRupiah(viewingUser.tunjangan_kesehatan)}</span>
                                    </div>
                                    <div className="flex justify-between py-1 px-2.5">
                                        <span className="text-neutral-600 dark:text-neutral-400">Tunjangan Transportasi:</span>
                                        <span className="font-medium text-neutral-900 dark:text-neutral-100">{formatRupiah(viewingUser.tunjangan_transport)}</span>
                                    </div>
                                    <div className="flex justify-between py-1 px-2.5">
                                        <span className="text-neutral-600 dark:text-neutral-400">Tunjangan Kerajinan:</span>
                                        <span className="font-medium text-neutral-900 dark:text-neutral-100">{formatRupiah(viewingUser.tunjangan_kerajinan)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter className="pt-2">
                        <Button type="button" onClick={() => setViewingUser(null)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                            Tutup
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}

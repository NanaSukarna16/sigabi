import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Wallet, Printer, Trash2, Calendar, Eye } from 'lucide-react';

interface Employee {
    id: number;
    name: string;
    role: string;
    unit_id: number | null;
}

interface SalaryRecord {
    id: number;
    user_id: number;
    user?: Employee | null;
    bulan: number;
    tahun: number;
    gaji_pokok: string;
    tunjangan_kesehatan: string;
    tunjangan_transport: string;
    tunjangan_kerajinan: string;
    gaji_progress: string;
    total_potongan: string;
    total_gaji: string;
    status: string;
    created_at: string;
}

interface IndexProps {
    salaries: SalaryRecord[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Riwayat Penggajian',
        href: '/penggajian',
    },
];

const BULAN_NAMES = [
    '', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export default function Index({ salaries }: IndexProps) {
    const [selectedSalary, setSelectedSalary] = useState<SalaryRecord | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus slip gaji ini?')) {
            router.delete(`/penggajian/${id}`);
        }
    };

    const handleViewDetails = (salary: SalaryRecord) => {
        setSelectedSalary(salary);
        setIsOpen(true);
    };

    const formatRupiah = (value: string | number) => {
        const num = typeof value === 'string' ? parseFloat(value) : value;
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(num);
    };

    const handlePrint = () => {
        const printContent = document.getElementById('printable-slip');
        if (printContent) {
            const originalContent = document.body.innerHTML;
            document.body.innerHTML = printContent.innerHTML;
            window.print();
            document.body.innerHTML = originalContent;
            window.location.reload(); // Reload to restore React bindings
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Riwayat Penggajian" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                            <Wallet className="size-6 text-indigo-600 dark:text-indigo-400" />
                            Riwayat & Slip Gaji Bulanan
                        </h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            Daftar rekap pembayaran gaji bulanan guru dan staf biMBA
                        </p>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
                                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Karyawan / Staf</th>
                                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Periode</th>
                                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Gaji Pokok & Tunjangan</th>
                                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Insentif & Potongan</th>
                                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Gaji Bersih</th>
                                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                                {salaries.length > 0 ? (
                                    salaries.map((sal) => (
                                        <tr key={sal.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                                            <td className="p-4">
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-neutral-900 dark:text-neutral-100">{sal.user ? sal.user.name : '-'}</span>
                                                    <span className="text-[10px] uppercase font-bold text-neutral-400 dark:text-neutral-500">
                                                        {sal.user ? sal.user.role.replace('_', ' ') : '-'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-neutral-600 dark:text-neutral-400 font-medium">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="size-4 text-neutral-400" />
                                                    <span>{BULAN_NAMES[sal.bulan]} {sal.tahun}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 space-y-0.5 text-neutral-700 dark:text-neutral-300">
                                                <div>Pokok: {formatRupiah(sal.gaji_pokok)}</div>
                                                <div className="text-xs text-neutral-400">
                                                    Tunjangan: {formatRupiah(parseFloat(sal.tunjangan_kesehatan) + parseFloat(sal.tunjangan_transport) + parseFloat(sal.tunjangan_kerajinan))}
                                                </div>
                                            </td>
                                            <td className="p-4 space-y-0.5">
                                                <div className="text-green-600 dark:text-green-400">+ Insentif: {formatRupiah(sal.gaji_progress)}</div>
                                                <div className="text-red-500 text-xs">- Potongan: {formatRupiah(sal.total_potongan)}</div>
                                            </td>
                                            <td className="p-4 font-bold text-neutral-900 dark:text-neutral-100">
                                                {formatRupiah(sal.total_gaji)}
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleViewDetails(sal)}
                                                        className="text-neutral-600 hover:text-indigo-600 dark:text-neutral-400 dark:hover:text-indigo-400"
                                                    >
                                                        <Eye className="size-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDelete(sal.id)}
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
                                            Tidak ada riwayat slip gaji ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* View Slip Detail Dialog */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                            <Wallet className="size-5 text-indigo-600 dark:text-indigo-400" />
                            Detail Slip Gaji Karyawan
                        </DialogTitle>
                    </DialogHeader>

                    {selectedSalary && (
                        <div className="space-y-6 py-4">
                            {/* Slip Format for Screen & Printing */}
                            <div id="printable-slip" className="p-6 border border-neutral-200 dark:border-neutral-800 rounded-xl space-y-6 bg-white text-neutral-900">
                                <div className="text-center border-b pb-4">
                                    <h2 className="text-lg font-bold uppercase tracking-wider">biMBA AI-UEO</h2>
                                    <p className="text-xs text-neutral-500">SLIP GAJI KARYAWAN & GURU</p>
                                    <p className="text-xs font-semibold text-neutral-500 mt-1">
                                        Periode: {BULAN_NAMES[selectedSalary.bulan]} {selectedSalary.tahun}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 text-xs gap-2 border-b pb-4">
                                    <div>
                                        <span className="font-semibold text-neutral-500">Nama Penerima:</span>
                                        <p className="font-bold text-neutral-900 text-sm mt-0.5">{selectedSalary.user?.name}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="font-semibold text-neutral-500">Jabatan / Role:</span>
                                        <p className="font-bold text-neutral-900 text-sm capitalize mt-0.5">
                                            {selectedSalary.user?.role.replace('_', ' ')}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 border-b pb-1">Penghasilan</h3>
                                        <div className="divide-y text-sm">
                                            <div className="flex justify-between py-2">
                                                <span>Gaji Pokok</span>
                                                <span className="font-medium">{formatRupiah(selectedSalary.gaji_pokok)}</span>
                                            </div>
                                            <div className="flex justify-between py-2">
                                                <span>Tunjangan Kesehatan</span>
                                                <span className="font-medium">{formatRupiah(selectedSalary.tunjangan_kesehatan)}</span>
                                            </div>
                                            <div className="flex justify-between py-2">
                                                <span>Tunjangan Transport</span>
                                                <span className="font-medium">{formatRupiah(selectedSalary.tunjangan_transport)}</span>
                                            </div>
                                            <div className="flex justify-between py-2">
                                                <span>Tunjangan Kerajinan</span>
                                                <span className="font-medium">{formatRupiah(selectedSalary.tunjangan_kerajinan)}</span>
                                            </div>
                                            <div className="flex justify-between py-2">
                                                <span>Total Insentif (Progress & Khusus)</span>
                                                <span className="font-medium text-green-600">{formatRupiah(selectedSalary.gaji_progress)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 border-b pb-1">Potongan</h3>
                                        <div className="divide-y text-sm">
                                            <div className="flex justify-between py-2 text-red-600">
                                                <span>Potongan Kehadiran / Terlambat</span>
                                                <span className="font-medium">-{formatRupiah(selectedSalary.total_potongan)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-neutral-50 p-4 rounded-lg flex justify-between items-center text-neutral-900 border border-neutral-200">
                                        <span className="text-sm font-bold uppercase">Gaji Bersih (Take Home Pay)</span>
                                        <span className="text-lg font-bold text-indigo-700">{formatRupiah(selectedSalary.total_gaji)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                                    Tutup
                                </Button>
                                <Button onClick={handlePrint} className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2">
                                    <Printer className="size-4" />
                                    Cetak Slip
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}

import { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Calculator, ShieldAlert, Award, FileText, ChevronRight } from 'lucide-react';

interface PotonganDetail {
    jenis: string;
    qty: number;
    nominal: number;
    subtotal: number;
}

interface ProgressDetail {
    nama_murid: string;
    jenis: string;
    nominal: number;
}

interface CalculatedSalary {
    user_id: number;
    name: string;
    role: string;
    gaji_pokok: number;
    tunjangan_kesehatan: number;
    tunjangan_transport: number;
    tunjangan_kerajinan: number;
    tunjangan_jabatan: number;
    total_points: number;
    insentif_poin: number;
    insentif_flat: number;
    insentif_baru: number;
    total_insentif: number;
    total_potongan: number;
    gaji_bersih: number;
    potongan_details: PotonganDetail[];
    progress_details: ProgressDetail[];
    kehadiran_summary: {
        hadir: number;
        tidak_hadir: number;
        telat: number;
    } | null;
}

interface CalculateProps {
    previewData: CalculatedSalary[];
    currentBulan: number;
    currentTahun: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Hitung Gaji',
        href: '/penggajian/calculate',
    },
];

const BULAN_OPTIONS = [
    { value: 1, label: 'Januari' },
    { value: 2, label: 'Februari' },
    { value: 3, label: 'Maret' },
    { value: 4, label: 'April' },
    { value: 5, label: 'Mei' },
    { value: 6, label: 'Juni' },
    { value: 7, label: 'Juli' },
    { value: 8, label: 'Agustus' },
    { value: 9, label: 'September' },
    { value: 10, label: 'Oktober' },
    { value: 11, label: 'November' },
    { value: 12, label: 'Desember' },
];

const TAHUN_OPTIONS = Array.from({ length: 7 }, (_, i) => 2024 + i);

export default function Calculate({ previewData, currentBulan, currentTahun }: CalculateProps) {
    const [selectedBulan, setSelectedBulan] = useState(currentBulan);
    const [selectedTahun, setSelectedTahun] = useState(currentTahun);
    const [inspectedSalary, setInspectedSalary] = useState<CalculatedSalary | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    const { post, processing } = useForm({
        bulan: currentBulan,
        tahun: currentTahun,
        salaries: previewData.map((p) => ({
            user_id: p.user_id,
            gaji_pokok: p.gaji_pokok,
            tunjangan_kesehatan: p.tunjangan_kesehatan,
            tunjangan_transport: p.tunjangan_transport,
            tunjangan_kerajinan: p.tunjangan_kerajinan,
            total_insentif: p.total_insentif,
            total_potongan: p.total_potongan,
            gaji_bersih: p.gaji_bersih,
        })),
    });

    const handleFilterChange = (newBulan: number, newTahun: number) => {
        setSelectedBulan(newBulan);
        setSelectedTahun(newTahun);
        router.get('/penggajian/calculate', { bulan: newBulan, tahun: newTahun }, {
            preserveState: false,
        });
    };

    const handleInspect = (sal: CalculatedSalary) => {
        setInspectedSalary(sal);
        setIsDetailsOpen(true);
    };

    const formatRupiah = (value: string | number) => {
        const num = typeof value === 'string' ? parseFloat(value) : value;
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(num);
    };

    const handleSaveSalaries = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/penggajian', {
            bulan: selectedBulan,
            tahun: selectedTahun,
            salaries: previewData.map((p) => ({
                user_id: p.user_id,
                gaji_pokok: p.gaji_pokok,
                tunjangan_kesehatan: p.tunjangan_kesehatan,
                tunjangan_transport: p.tunjangan_transport,
                tunjangan_kerajinan: p.tunjangan_kerajinan,
                total_insentif: p.total_insentif,
                total_potongan: p.total_potongan,
                gaji_bersih: p.gaji_bersih,
            })),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kalkulasi Gaji" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                            <Calculator className="size-6 text-indigo-600 dark:text-indigo-400" />
                            Kalkulasi Gaji Bulanan
                        </h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            Pratinjau, hitung otomatis, dan simpan slip gaji seluruh guru dan staf biMBA
                        </p>
                    </div>
                </div>

                {/* Filter Month and Year */}
                <div className="flex flex-wrap items-end gap-4 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
                    <div className="space-y-1.5 w-48">
                        <Label htmlFor="bulan-filter">Pilih Bulan</Label>
                        <Select
                            value={String(selectedBulan)}
                            onValueChange={(val) => handleFilterChange(Number(val), selectedTahun)}
                        >
                            <SelectTrigger id="bulan-filter">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {BULAN_OPTIONS.map((opt) => (
                                    <SelectItem key={opt.value} value={String(opt.value)}>
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1.5 w-36">
                        <Label htmlFor="tahun-filter">Pilih Tahun</Label>
                        <Select
                            value={String(selectedTahun)}
                            onValueChange={(val) => handleFilterChange(selectedBulan, Number(val))}
                        >
                            <SelectTrigger id="tahun-filter">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {TAHUN_OPTIONS.map((yr) => (
                                    <SelectItem key={yr} value={String(yr)}>
                                        {yr}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Payroll Preview List */}
                <form onSubmit={handleSaveSalaries} className="space-y-6">
                    <div className="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
                                        <th className="p-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Guru / Staff</th>
                                        <th className="p-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Gaji Pokok & Tunjangan</th>
                                        <th className="p-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Poin & Insentif</th>
                                        <th className="p-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Deduction (Potongan)</th>
                                        <th className="p-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Gaji Bersih</th>
                                        <th className="p-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 text-right">Rincian</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                                    {previewData.length > 0 ? (
                                        previewData.map((preview) => (
                                            <tr key={preview.user_id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                                                <td className="p-4">
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-neutral-900 dark:text-neutral-100">{preview.name}</span>
                                                        <span className="text-[10px] uppercase font-bold text-indigo-500">{preview.role.replace('_', ' ')}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 space-y-0.5 text-neutral-700 dark:text-neutral-300">
                                                    <div>Pokok: {formatRupiah(preview.gaji_pokok)}</div>
                                                    <div className="text-xs text-neutral-400">Tunjangan: {formatRupiah(preview.tunjangan_jabatan)}</div>
                                                </td>
                                                <td className="p-4 space-y-0.5">
                                                    <div className="flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400">
                                                        <Award className="size-3.5" />
                                                        <span>{preview.total_points} Poin</span>
                                                    </div>
                                                    <div className="text-xs text-green-600 dark:text-green-400">
                                                        + {formatRupiah(preview.total_insentif)}
                                                    </div>
                                                </td>
                                                <td className="p-4 text-red-500 font-medium">
                                                    {preview.total_potongan > 0 ? (
                                                        <span className="flex items-center gap-1">
                                                            <ShieldAlert className="size-3.5" />
                                                            <span>-{formatRupiah(preview.total_potongan)}</span>
                                                        </span>
                                                    ) : (
                                                        <span className="text-neutral-400">Rp 0</span>
                                                    )}
                                                </td>
                                                <td className="p-4 font-bold text-neutral-900 dark:text-neutral-100">
                                                    {formatRupiah(preview.gaji_bersih)}
                                                </td>
                                                <td className="p-4 text-right">
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        onClick={() => handleInspect(preview)}
                                                        className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 flex items-center gap-1 ml-auto"
                                                    >
                                                        <span>Inspeksi</span>
                                                        <ChevronRight className="size-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="p-8 text-center text-neutral-500 dark:text-neutral-400">
                                                Tidak ada data guru/staf aktif untuk dikalkulasi.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="flex justify-end pt-2">
                        <Button
                            type="submit"
                            disabled={processing || previewData.length === 0}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 px-6"
                        >
                            <Calculator className="size-4" />
                            {processing ? 'Menyimpan Gaji...' : 'Simpan & Posting Gaji'}
                        </Button>
                    </div>
                </form>
            </div>

            {/* Inspeksi Rincian Dialog */}
            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <DialogContent className="sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                            <FileText className="size-5 text-indigo-600 dark:text-indigo-400" />
                            Rincian Perhitungan Gaji: {inspectedSalary?.name}
                        </DialogTitle>
                    </DialogHeader>

                    {inspectedSalary && (
                        <div className="space-y-6 py-2">
                            {/* Kehadiran */}
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 border-b pb-1">Kehadiran Bulanan</h3>
                                {inspectedSalary.kehadiran_summary ? (
                                    <div className="grid grid-cols-3 gap-4 text-sm pt-2">
                                        <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border border-green-100">
                                            <span className="text-[10px] uppercase font-bold text-green-600">Kehadiran</span>
                                            <p className="text-lg font-bold">{inspectedSalary.kehadiran_summary.hadir} Hari</p>
                                        </div>
                                        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border border-red-100">
                                            <span className="text-[10px] uppercase font-bold text-red-600">Alpa/Izin</span>
                                            <p className="text-lg font-bold">{inspectedSalary.kehadiran_summary.tidak_hadir} Hari</p>
                                        </div>
                                        <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border border-amber-100">
                                            <span className="text-[10px] uppercase font-bold text-amber-600">Terlambat</span>
                                            <p className="text-lg font-bold">{inspectedSalary.kehadiran_summary.telat} Kali</p>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-xs text-red-500 pt-2 font-medium">Data Kehadiran belum diinput bulan ini!</p>
                                )}
                            </div>

                            {/* Potongan */}
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 border-b pb-1">Rincian Potongan Gaji</h3>
                                <div className="divide-y text-sm">
                                    {inspectedSalary.potongan_details.length > 0 ? (
                                        inspectedSalary.potongan_details.map((pot, idx) => (
                                            <div key={idx} className="flex justify-between py-2 text-red-600">
                                                <span>{pot.jenis} ({pot.qty} x {formatRupiah(pot.nominal)})</span>
                                                <span className="font-semibold">-{formatRupiah(pot.subtotal)}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-neutral-400 py-2">Tidak ada potongan gaji bulan ini.</p>
                                    )}
                                </div>
                            </div>

                            {/* Insentif */}
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 border-b pb-1">Rincian Insentif Murid</h3>
                                <div className="divide-y text-sm space-y-1 pt-2">
                                    <div className="flex justify-between py-2 border-b">
                                        <div>
                                            <span className="font-semibold text-neutral-900 dark:text-neutral-100">Progress Murid Reguler</span>
                                            <p className="text-xs text-neutral-400">Total akumulasi: {inspectedSalary.total_points} Poin</p>
                                        </div>
                                        <span className="font-bold text-green-600 dark:text-green-400">{formatRupiah(inspectedSalary.insentif_poin)}</span>
                                    </div>

                                    {inspectedSalary.progress_details.length > 0 ? (
                                        inspectedSalary.progress_details.map((prog, idx) => (
                                            <div key={idx} className="flex justify-between py-2 text-xs text-neutral-600 dark:text-neutral-400">
                                                <span className="capitalize">{prog.nama_murid} ({prog.jenis})</span>
                                                <span className="font-medium">{formatRupiah(prog.nominal)}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-[11px] text-neutral-400 py-1">Tidak ada insentif murid khusus / flat.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}

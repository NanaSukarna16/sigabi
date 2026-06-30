import { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Calendar, Save, Percent, Users, UserCheck } from 'lucide-react';

interface TeacherAttendance {
    user_id: number;
    name: string;
    role: string;
    jumlah_hadir: number;
    jumlah_tidak_hadir: number;
    jumlah_telat: number;
    persentase_kehadiran: number;
}

interface IndexProps {
    teachersData: TeacherAttendance[];
    currentBulan: number;
    currentTahun: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Kehadiran Karyawan',
        href: '/kehadiran',
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

export default function Index({ teachersData, currentBulan, currentTahun }: IndexProps) {
    const [selectedBulan, setSelectedBulan] = useState(currentBulan);
    const [selectedTahun, setSelectedTahun] = useState(currentTahun);

    const { data, setData, post, processing } = useForm({
        bulan: currentBulan,
        tahun: currentTahun,
        attendance: teachersData.map((t) => ({
            user_id: t.user_id,
            jumlah_hadir: t.jumlah_hadir,
            jumlah_tidak_hadir: t.jumlah_tidak_hadir,
            jumlah_telat: t.jumlah_telat,
        })),
    });

    const handleFilterChange = (newBulan: number, newTahun: number) => {
        setSelectedBulan(newBulan);
        setSelectedTahun(newTahun);
        router.get('/kehadiran', { bulan: newBulan, tahun: newTahun }, {
            preserveState: false,
        });
    };

    const handleInputChange = (index: number, field: string, value: string) => {
        const numValue = Math.max(0, parseInt(value) || 0);
        const updatedAttendance = [...data.attendance];
        updatedAttendance[index] = {
            ...updatedAttendance[index],
            [field]: numValue,
        };
        setData('attendance', updatedAttendance);
    };

    const calculatePercentage = (hadir: number, tidakHadir: number) => {
        const total = hadir + tidakHadir;
        return total > 0 ? ((hadir / total) * 100).toFixed(2) : '0.00';
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/kehadiran');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kehadiran Guru" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                            <Calendar className="size-6 text-indigo-600 dark:text-indigo-400" />
                            Rekap & Input Kehadiran Bulanan
                        </h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            Masukkan data kehadiran, absensi, dan keterlambatan guru bulanan untuk perhitungan potongan gaji
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

                {/* Bulk Input Table */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
                                        <th className="p-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Nama Guru / Staff</th>
                                        <th className="p-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 w-32">Jumlah Hadir</th>
                                        <th className="p-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 w-32">Alpa / Izin</th>
                                        <th className="p-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 w-32">Terlambat</th>
                                        <th className="p-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 text-right w-40">Persentase</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                                    {teachersData.length > 0 ? (
                                        teachersData.map((teacher, index) => {
                                            const item = data.attendance[index] || {
                                                jumlah_hadir: 0,
                                                jumlah_tidak_hadir: 0,
                                                jumlah_telat: 0,
                                            };
                                            return (
                                                <tr key={teacher.user_id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                                                    <td className="p-4 font-semibold text-neutral-900 dark:text-neutral-100">
                                                        <div className="flex items-center gap-2">
                                                            <div className="p-2 rounded bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
                                                                {teacher.role === 'guru' ? (
                                                                    <Users className="size-4" />
                                                                ) : (
                                                                    <UserCheck className="size-4" />
                                                                )}
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span>{teacher.name}</span>
                                                                <span className="text-[10px] uppercase tracking-wider font-semibold text-indigo-500">
                                                                    {teacher.role.replace('_', ' ')}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            value={item.jumlah_hadir}
                                                            onChange={(e) => handleInputChange(index, 'jumlah_hadir', e.target.value)}
                                                            className="w-24 text-center"
                                                        />
                                                    </td>
                                                    <td className="p-4">
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            value={item.jumlah_tidak_hadir}
                                                            onChange={(e) => handleInputChange(index, 'jumlah_tidak_hadir', e.target.value)}
                                                            className="w-24 text-center border-red-200 dark:border-red-900/40 focus-visible:ring-red-500"
                                                        />
                                                    </td>
                                                    <td className="p-4">
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            value={item.jumlah_telat}
                                                            onChange={(e) => handleInputChange(index, 'jumlah_telat', e.target.value)}
                                                            className="w-24 text-center border-amber-200 dark:border-amber-900/40 focus-visible:ring-amber-500"
                                                        />
                                                    </td>
                                                    <td className="p-4 text-right font-mono font-bold text-neutral-700 dark:text-neutral-300">
                                                        <span className="inline-flex items-center gap-0.5">
                                                            {calculatePercentage(item.jumlah_hadir, item.jumlah_tidak_hadir)}
                                                            <Percent className="size-3" />
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="p-8 text-center text-neutral-500 dark:text-neutral-400">
                                                Tidak ada data guru aktif ditemukan.
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
                            disabled={processing || teachersData.length === 0}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 px-6"
                        >
                            <Save className="size-4" />
                            {processing ? 'Menyimpan...' : 'Simpan Semua Kehadiran'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

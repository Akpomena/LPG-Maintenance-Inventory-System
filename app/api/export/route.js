import { all } from '@/lib/db';
export const dynamic = 'force-dynamic';
export async function GET() {
  const rows = await all();
  const k = ['tag', 'name', 'category', 'location', 'manufacturer', 'model', 'serial_no', 'install_date', 'status', 'interval_days', 'last_done', 'due', 'services', 'cost'];
  const q = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const csv = [k.join(','), ...rows.map(r => k.map(c => q(r[c])).join(','))].join('\n');
  return new Response(csv, { headers: { 'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename=rainoil-lpg-equipment.csv' } });
}

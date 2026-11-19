'use server';
import { sql, init } from '@/lib/db';
import { redirect } from 'next/navigation';
const f = (d, k) => String(d.get(k) ?? '').trim() || null;
export async function save(d) {
  await init();
  let id = d.get('id');
  const [tag, name, category, location, manufacturer, model, serial_no, install_date, status, notes] =
    ['tag', 'name', 'category', 'location', 'manufacturer', 'model', 'serial_no', 'install_date', 'status', 'notes'].map(k => f(d, k));
  const days = Math.max(1, +d.get('interval_days') || 90);
  if (id) await sql`update equipment set tag=${tag}, name=${name}, category=${category}, location=${location}, manufacturer=${manufacturer}, model=${model}, serial_no=${serial_no}, install_date=${install_date}, status=${status}, interval_days=${days}, notes=${notes} where id=${id}`;
  else [{ id }] = await sql`insert into equipment(tag,name,category,location,manufacturer,model,serial_no,install_date,status,interval_days,notes) values(${tag},${name},${category},${location},${manufacturer},${model},${serial_no},${install_date},${status},${days},${notes}) returning id`;
  redirect(`/equipment/${id}`);
}
export async function log(d) {
  const id = d.get('id');
  await sql`insert into maintenance(equipment_id,performed_on,type,technician,cost,description) values(${id},${d.get('performed_on')},${f(d, 'type')},${f(d, 'technician')},${+d.get('cost') || 0},${f(d, 'description')})`;
  await sql`update equipment set status='Active' where id=${id} and status='Under Maintenance'`;
  redirect(`/equipment/${id}`);
}
export async function delLog(d) { await sql`delete from maintenance where id=${d.get('mid')}`; redirect(`/equipment/${d.get('id')}`); }
export async function remove(d) { await sql`delete from equipment where id=${d.get('id')}`; redirect('/equipment'); }

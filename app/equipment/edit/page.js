import { all } from '@/lib/db';
import { CATS } from '@/lib/ui';
import { save } from '@/app/actions';
export default async function Edit({ searchParams: { id } }) {
  const e = (id && (await all()).find(x => x.id == id)) || {};
  const F = (n, l, p = {}) => <label>{l}<input name={n} defaultValue={e[n] ?? ''} {...p} /></label>;
  return <>
    <h1>{e.id ? 'Edit equipment' : 'Add equipment'}</h1>
    <form action={save} className="grid panel">
      {e.id && <input type="hidden" name="id" value={e.id} />}
      {F('tag', 'Asset tag', { required: true })}{F('name', 'Equipment name', { required: true })}
      <label>Category<select name="category" defaultValue={e.category}>{CATS.map(c => <option key={c}>{c}</option>)}</select></label>
      {F('location', 'Location')}{F('manufacturer', 'Manufacturer')}{F('model', 'Model')}{F('serial_no', 'Serial number')}
      {F('install_date', 'Date installed', { type: 'date' })}
      {F('interval_days', 'Routine maintenance every (days)', { type: 'number', min: 1, required: true, defaultValue: e.interval_days ?? 90 })}
      <label>Status<select name="status" defaultValue={e.status || 'Active'}><option>Active</option><option>Under Maintenance</option><option>Out of Service</option></select></label>
      <label className="wide">Notes<textarea name="notes" defaultValue={e.notes ?? ''} /></label>
      <button className="btn">Save equipment</button>
    </form>
  </>;
}

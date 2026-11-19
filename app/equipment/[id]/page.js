import { notFound } from 'next/navigation';
import { all, history } from '@/lib/db';
import { Badge } from '@/lib/ui';
import { log, delLog, remove } from '@/app/actions';
export default async function Detail({ params: { id } }) {
  const e = (await all()).find(x => x.id == id);
  if (!e) notFound();
  const h = (await history()).filter(m => m.equipment_id == id);
  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Africa/Lagos' });
  const kv = [['Asset tag', e.tag], ['Category', e.category], ['Location', e.location], ['Manufacturer', e.manufacturer], ['Model', e.model], ['Serial number', e.serial_no], ['Date installed', e.install_date], ['Routine interval', `${e.interval_days} days`], ['Last serviced', e.last_done || 'Never'], ['Next due', e.due]];
  return <>
    <h1>{e.name} <Badge e={e} /></h1>
    <div className="panel kv">{kv.map(([k, v]) => <div key={k}><small>{k}</small><br />{v || 'Not set'}</div>)}</div>
    {e.notes && <div className="panel">{e.notes}</div>}
    <div className="noprint">
      <a className="btn" href={`/equipment/edit?id=${id}`}>Edit details</a> <a className="btn alt" href={`/report?id=${id}`}>Equipment report</a>
      <details><summary>Delete this equipment</summary><form action={remove}><input type="hidden" name="id" value={id} /><p>This also deletes its maintenance history.</p><button className="btn del">Delete permanently</button></form></details>
    </div>
    <h2>Log maintenance</h2>
    <form action={log} className="grid panel">
      <input type="hidden" name="id" value={id} />
      <label>Date done<input type="date" name="performed_on" defaultValue={today} required /></label>
      <label>Type<select name="type">{['Routine', 'Inspection', 'Repair', 'Calibration', 'Replacement'].map(t => <option key={t}>{t}</option>)}</select></label>
      <label>Technician<input name="technician" /></label>
      <label>Cost (₦)<input type="number" name="cost" min="0" step="any" /></label>
      <label className="wide">Work done<textarea name="description" /></label>
      <button className="btn">Save record</button>
    </form>
    <h2>Maintenance history</h2>
    <div className="tl">{h.length ? h.map(m => <div key={m.id}>
      <b>{m.performed_on}</b> {m.type}{m.technician && `, ${m.technician}`}{m.cost > 0 && `, ₦${m.cost.toLocaleString()}`}
      {m.description && <p>{m.description}</p>}
      <form action={delLog}><input type="hidden" name="mid" value={m.id} /><input type="hidden" name="id" value={id} /><button className="lnk">Remove record</button></form>
    </div>) : <p>No maintenance recorded yet.</p>}</div>
  </>;
}

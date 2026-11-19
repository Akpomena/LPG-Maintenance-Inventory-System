import { all, history } from '@/lib/db';
import { Badge, EqTable } from '@/lib/ui';
import Print from '../print';
const Sec = ({ e, h }) => (
  <section className="rep">
    <h3>{e.name} ({e.tag}) <Badge e={e} /></h3>
    <p>{[e.category, e.location, e.manufacturer, e.model, e.serial_no && `S/N ${e.serial_no}`].filter(Boolean).join(', ')}.<br />
      Installed {e.install_date || 'date not set'}. Routine maintenance every {e.interval_days} days. Last serviced {e.last_done || 'never'}. Next due {e.due}.</p>
    <table><thead><tr><th>Date</th><th>Type</th><th>Technician</th><th>Cost (₦)</th><th>Work done</th></tr></thead>
      <tbody>{h.length ? h.map(m => <tr key={m.id}><td>{m.performed_on}</td><td>{m.type}</td><td>{m.technician}</td><td>{m.cost.toLocaleString()}</td><td>{m.description}</td></tr>) : <tr><td colSpan="5">No maintenance recorded.</td></tr>}</tbody></table>
  </section>
);
export default async function Report({ searchParams: { id } }) {
  const eq = await all(), h = await history();
  const rows = id ? eq.filter(e => e.id == id) : eq;
  const over = rows.filter(e => e.status !== 'Out of Service' && e.days_left < 0).length;
  const cost = rows.reduce((s, e) => s + e.cost, 0);
  return <>
    <div className="rhead"><img src="/logo.jpg" height="70" alt="Rainoil" />
      <div><h1>LPG Department: {id ? 'Equipment Report' : 'Equipment Register and Maintenance Report'}</h1><small>Generated {new Date().toLocaleString('en-GB', { timeZone: 'Africa/Lagos' })}</small></div><Print /></div>
    <p><b>{rows.length}</b> equipment, <b>{over}</b> overdue, total maintenance cost <b>₦{cost.toLocaleString()}</b>.</p>
    {!id && <EqTable rows={rows} />}
    {rows.map(e => <Sec key={e.id} e={e} h={h.filter(m => m.equipment_id === e.id)} />)}
  </>;
}

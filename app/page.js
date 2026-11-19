import { all, recent } from '@/lib/db';
import { EqTable, SOON } from '@/lib/ui';
export default async function Home() {
  const eq = await all(), act = eq.filter(e => e.status !== 'Out of Service');
  const over = act.filter(e => e.days_left < 0), soon = act.filter(e => e.days_left >= 0 && e.days_left <= SOON);
  const rec = await recent();
  const K = ({ n, l, c = '' }) => <div className={`card ${c}`}><h2>{n}</h2><small>{l}</small></div>;
  return <>
    <h1>Dashboard</h1>
    <div className="cards"><K n={eq.length} l="Total equipment" /><K n={over.length} l="Overdue maintenance" c="k-red" /><K n={soon.length} l={`Due within ${SOON} days`} c="k-orange" /><K n={eq.length - act.length} l="Out of service" c="k-grey" /></div>
    <h2>Maintenance due</h2>
    <EqTable rows={[...over, ...soon]} />
    <h2>Recent maintenance</h2>
    <div className="tl">{rec.length ? rec.map(m => <div key={m.id}><b>{m.performed_on}</b> {m.type} on <a href={`/equipment/${m.eid}`}>{m.name} ({m.tag})</a>{m.technician && ` by ${m.technician}`}</div>) : <p>No maintenance logged yet.</p>}</div>
  </>;
}

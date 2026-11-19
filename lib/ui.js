export const CATS = ['Storage Tank', 'Compressor', 'Pump', 'Dispenser / Skid', 'Weighing Scale', 'Cylinder', 'Valve / Regulator', 'Pipeline', 'Safety / Fire', 'Vehicle', 'Other'];
export const SOON = 14; // days before due date to start warning
export const state = e => e.status === 'Out of Service' ? ['Out of service', 'grey'] : e.days_left < 0 ? [`Overdue ${-e.days_left}d`, 'red'] : e.days_left <= SOON ? [`Due in ${e.days_left}d`, 'orange'] : ['OK', 'green'];
export const Badge = ({ e }) => { const [t, c] = state(e); return <span className={`tag ${c}`}>{t}</span>; };
export const EqTable = ({ rows }) => (
  <table><thead><tr><th>Tag</th><th>Equipment</th><th>Location</th><th>Last serviced</th><th>Next due</th><th>Status</th></tr></thead>
    <tbody>{rows.length ? rows.map(e => <tr key={e.id}>
      <td><a href={`/equipment/${e.id}`}>{e.tag}</a></td><td>{e.name}<br /><small>{e.category}</small></td><td>{e.location}</td>
      <td>{e.last_done || 'Never'}</td><td>{e.due}</td><td><Badge e={e} /></td></tr>) : <tr><td colSpan="6">Nothing to show.</td></tr>}</tbody></table>
);

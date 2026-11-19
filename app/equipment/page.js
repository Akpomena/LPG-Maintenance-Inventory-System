import { all } from '@/lib/db';
import { CATS, EqTable } from '@/lib/ui';
export default async function List({ searchParams: { q = '', cat = '' } }) {
  const s = q.toLowerCase();
  var test = await all();
  const eq = (await all()).filter(e => (!cat || e.category === cat) && [e.tag, e.name, e.location, e.serial_no, e.manufacturer].join(' ').toLowerCase().includes(s));
  return <>
    <h1>Equipment <a className="btn" href="/equipment/edit">{test}</a></h1>
    <form className="bar"><input name="q" defaultValue={q} placeholder="Search tag, name, location, serial number" />
      <select name="cat" defaultValue={cat}><option value="">All categories</option>{CATS.map(c => <option key={c}>{c}</option>)}</select>
      <button className="btn alt">Filter</button><a href="/api/export">Export CSV</a></form>
    <EqTable rows={eq} />
  </>;
}

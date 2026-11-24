import { neon } from '@neondatabase/serverless';

export const sql = neon(process.env.DATABASE_URL || process.env.POSTGRES_URL);

let ready;
export const init = () =>
  (ready ||= (async () => {
    await sql`create table if not exists equipment(id serial primary key, tag text unique not null, name text not null, category text, location text, manufacturer text, model text, serial_no text, install_date date, status text default 'Active', interval_days int default 90, notes text, created_at timestamptz default now())`;
    await sql`create table if not exists maintenance(id serial primary key, equipment_id int references equipment(id) on delete cascade, performed_on date not null, type text, technician text, cost numeric default 0, description text)`;
  })().catch((e) => {
    ready = undefined; // allow retry after a failure
    throw e;
  }));

export async function all() {
  await init();
  return await sql`select e.id, e.tag, e.name, e.category, e.location, e.manufacturer, e.model, e.serial_no, e.status, e.interval_days, e.notes,
    e.install_date::text as install_date, l.lastd::text as last_done,
    (b.base + e.interval_days)::text as due, (b.base + e.interval_days - current_date)::int as days_left,
    coalesce(l.n,0)::int as services, coalesce(l.cost,0)::float as cost
    from equipment e
    left join (select equipment_id, max(performed_on) as lastd, count(*) as n, sum(cost) as cost from maintenance group by equipment_id) l on l.equipment_id = e.id
    cross join lateral (select coalesce(l.lastd, e.install_date, e.created_at::date) as base) b
    order by days_left, e.tag`;
}
export async function history() {
  await init();
  return sql`select id, equipment_id, type, technician, cost::float as cost, description, performed_on::text as performed_on from maintenance order by performed_on desc, id desc`;
}
export async function recent() {
  await init();
  return sql`select m.id, m.type, m.technician, m.performed_on::text as performed_on, e.id as eid, e.name, e.tag from maintenance m join equipment e on e.id = m.equipment_id order by m.performed_on desc, m.id desc limit 6`;
}

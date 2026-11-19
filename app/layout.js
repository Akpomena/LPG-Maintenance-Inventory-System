import './globals.css';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Rainoil LPG Equipment Manager' };
export default function Root({ children }) {
  return (<html lang="en"><body>
    <header className="top"><a href="/"><img src="/logo.jpg" alt="Rainoil" /></a><b>LPG Equipment Manager</b>
      <nav><a href="/">Dashboard</a><a href="/equipment">Equipment</a><a href="/report">Reports</a></nav></header>
    <main>{children}</main></body></html>);
}

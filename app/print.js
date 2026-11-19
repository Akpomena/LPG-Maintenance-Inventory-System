'use client';
export default function Print() { return <button className="btn noprint" onClick={() => window.print()}>Print or save as PDF</button>; }

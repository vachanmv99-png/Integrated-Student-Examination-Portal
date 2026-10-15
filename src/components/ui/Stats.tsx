export function Stats({ items }: { items: [string, string, string][] }) {
  return <div className="stats">{items.map(([value, label, icon]) => <article key={label}><span className="stat-icon">{icon}</span><div><b>{value}</b><small>{label}</small></div></article>)}</div>;
}

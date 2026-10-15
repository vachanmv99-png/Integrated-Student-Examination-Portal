export function Badge({ children }: { children: string }) {
  return (
    <span className={'badge ' + children.toLowerCase().replaceAll(' ', '-')}>
      {children}
    </span>
  );
}

export function HeroGraphic() {
  return (
    <svg
      viewBox="0 0 400 260"
      className="h-full w-full"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="400" height="260" rx="16" className="fill-secondary" />
      <path d="M0 190 L200 70 L400 190 Z" className="fill-primary/10" />
      <rect x="20" y="188" width="360" height="10" rx="2" className="fill-muted-foreground/20" />

      {[40, 90, 140, 190, 240, 290, 340].map((x) => (
        <g key={x}>
          <rect x={x - 3} y={148} width="6" height="42" rx="2" className="fill-primary" />
          <rect x={x - 3} y={128} width="6" height="6" rx="2" className="fill-primary" />
        </g>
      ))}
      <rect x="30" y="150" width="320" height="6" rx="3" className="fill-primary" />
      <rect x="30" y="170" width="320" height="6" rx="3" className="fill-primary" />
    </svg>
  );
}

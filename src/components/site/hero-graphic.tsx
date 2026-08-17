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

      {[50, 100, 150, 200, 250, 300, 350].map((x) => (
        <rect
          key={x}
          x={x - 3}
          y={148}
          width="4"
          height="42"
          rx="2"
          className="fill-primary"
        />
      ))}
      <rect x="40" y="150" width="320" height="3" rx="3" className="fill-primary" />
      <rect x="40" y="170" width="320" height="3" rx="3" className="fill-primary" />
    </svg>
  );
}

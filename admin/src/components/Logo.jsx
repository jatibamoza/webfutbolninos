export default function Logo() {
  return (
    <div
      style={{
        width: 40,
        height: 40,
        background: 'var(--color-foreground)',
        borderRadius: '50% 50% 50% 50% / 35% 35% 65% 65%',
        display: 'grid',
        placeItems: 'center',
        color: 'var(--color-marker)',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 22,
        flexShrink: 0,
      }}
    >
      M
    </div>
  );
}

export default function SocialCalendarPage() {
  return (
    <div style={{ maxWidth: 720, margin: '40px auto', textAlign: 'center' }}>
      <div
        className="card-paper"
        style={{ padding: '40px 32px', borderStyle: 'dashed' }}
      >
        <div className="stamp">Próximamente</div>
        <h1 style={{ marginTop: 12, marginBottom: 8, fontSize: 24 }}>
          Social Calendar
        </h1>
        <p style={{ color: 'var(--color-foreground-muted)', fontSize: 14 }}>
          La portación desde Astro llega en el siguiente PR (Wave 2).
          Mientras tanto puedes editar <code>content/social/calendar.json</code>{' '}
          en Git y consultarlo en la página Astro <code>/admin/social/</code>.
        </p>
      </div>
    </div>
  );
}

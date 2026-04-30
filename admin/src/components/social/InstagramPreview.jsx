import { socialAssetUrl } from '../../services/socialAPI.js';

const ASPECT_BY_FORMAT = {
  single_image: '1 / 1',
  carousel: '1 / 1',
  reel: '9 / 16',
  video: '9 / 16',
  story: '9 / 16',
  text: '1 / 1',
};

function fmtTime(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
}

function fmtDay(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function InstagramPreview({ post }) {
  const firstAsset = post.media?.[0];
  if (!firstAsset) return null;

  const aspect = ASPECT_BY_FORMAT[post.format] || '1 / 1';
  const imgUrl = post.assetReady ? socialAssetUrl(firstAsset.path) : null;

  return (
    <div className="ig-mock">
      <div className="ig-mock__hdr">
        <div className="ig-mock__avatar">M</div>
        <div className="ig-mock__user">
          <div className="ig-mock__name">minigolclub</div>
          <div className="ig-mock__loc">MiniGol Club · Programado</div>
        </div>
        <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ color: '#262626' }}>
          <circle cx="12" cy="12" r="1" />
          <circle cx="19" cy="12" r="1" />
          <circle cx="5" cy="12" r="1" />
        </svg>
      </div>

      {imgUrl ? (
        <div className="ig-mock__media" style={{ aspectRatio: aspect }}>
          <img src={imgUrl} alt={firstAsset.alt || ''} loading="lazy" />
          {post.format === 'carousel' && (
            <span className="ig-mock__badge">
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
              1/1
            </span>
          )}
          {(post.format === 'reel' || post.format === 'video') && (
            <span className="ig-mock__badge">
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              Reel
            </span>
          )}
        </div>
      ) : (
        <div className="ig-mock__media ig-mock__media--missing" style={{ aspectRatio: aspect }}>
          <svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
            <line x1="2" y1="2" x2="22" y2="22" />
            <path d="M10.41 10.41a2 2 0 1 1-2.83-2.83" />
            <line x1="13.5" y1="13.5" x2="6" y2="21" />
            <line x1="18" y1="12" x2="21" y2="9" />
            <path d="M3.59 3.59A1.99 1.99 0 0 0 3 5v14a2 2 0 0 0 2 2h14c.55 0 1.05-.22 1.41-.59" />
            <path d="M21 15V5a2 2 0 0 0-2-2H9" />
          </svg>
          <span style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
            Falta el asset: {firstAsset.path}
          </span>
        </div>
      )}

      <div className="ig-mock__actions">
        <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
        <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
        <span className="ig-mock__spacer" />
        <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
      </div>

      <div className="ig-mock__body">
        <p className="ig-mock__caption">
          <strong>minigolclub</strong>{' '}
          <span style={{ whiteSpace: 'pre-line' }}>{post.caption}</span>
        </p>
        {post.hashtags && post.hashtags.length > 0 && (
          <p className="ig-mock__tags">
            {post.hashtags.map((h) => '#' + h).join(' ')}
          </p>
        )}
        <p className="ig-mock__meta">
          Programado para {fmtDay(post.scheduled_at)} · {fmtTime(post.scheduled_at)}
        </p>
      </div>
    </div>
  );
}

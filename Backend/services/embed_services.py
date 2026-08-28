from flask import make_response, request
from config.database import mysql

EMBED_CSS = """
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
body.ts-dark { background: #111827; color: #f3f4f6; }
body.ts-light { background: transparent; color: #111827; }

.ts-container { padding: 16px; }

.ts-header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
.ts-header img { width: 36px; height: 36px; border-radius: 8px; object-fit: contain; }
.ts-header h2 { font-size: 18px; font-weight: 600; }

.ts-card {
    border-radius: 12px; padding: 20px; border: 1px solid;
    break-inside: avoid; margin-bottom: 16px;
}
body.ts-light .ts-card { background: #fff; border-color: #e5e7eb; }
body.ts-dark .ts-card { background: #1f2937; border-color: #374151; }

.ts-reviewer { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
.ts-avatar {
    width: 40px; height: 40px; border-radius: 50%; object-fit: cover;
}
.ts-avatar-placeholder {
    width: 40px; height: 40px; border-radius: 50%;
    background: #3b82f6; color: #fff; display: flex;
    align-items: center; justify-content: center;
    font-weight: 700; font-size: 14px;
}
.ts-name { font-size: 14px; font-weight: 600; }

.ts-stars { display: flex; gap: 2px; }
.ts-star { width: 16px; height: 16px; color: #facc15; }

.ts-review-wrap { position: relative; margin-bottom: 12px; }
.ts-review { font-size: 14px; line-height: 1.6; }
.ts-review.ts-clamped { display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden; }
body.ts-light .ts-review { color: #4b5563; }
body.ts-dark .ts-review { color: #d1d5db; }
.ts-show-more {
    background: none; border: none; cursor: pointer; padding: 0;
    font-size: 13px; font-weight: 600; margin-top: 4px;
}
body.ts-light .ts-show-more { color: #3b82f6; }
body.ts-dark .ts-show-more { color: #60a5fa; }
.ts-show-more:hover { text-decoration: underline; }

.ts-video { width: 100%; border-radius: 8px; margin-bottom: 12px; }

.ts-images { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; }
.ts-images img { width: 80px; height: 80px; border-radius: 6px; object-fit: cover; }

.ts-date { font-size: 12px; }
body.ts-light .ts-date { color: #9ca3af; }
body.ts-dark .ts-date { color: #6b7280; }

/* Carousel */
.ts-carousel-wrapper { position: relative; }
.ts-carousel {
    display: flex; gap: 16px; overflow-x: auto; padding: 4px 8px 16px;
    scroll-snap-type: x mandatory; scrollbar-width: none;
    align-items: flex-start;
}
.ts-carousel::-webkit-scrollbar { display: none; }
.ts-carousel .ts-card { width: 400px; flex-shrink: 0; scroll-snap-align: start; margin-bottom: 0; }
.ts-arrow {
    position: absolute; top: 50%; transform: translateY(-50%);
    width: 32px; height: 32px; border-radius: 50%; border: none;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; z-index: 10; box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}
body.ts-light .ts-arrow { background: #fff; color: #374151; }
body.ts-dark .ts-arrow { background: #374151; color: #fff; }
.ts-arrow-left { left: -4px; }
.ts-arrow-right { right: -4px; }

/* Grid */
.ts-grid {
    display: grid; gap: 16px;
    grid-template-columns: 1fr;
}
@media (min-width: 640px) { .ts-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px) { .ts-grid { grid-template-columns: repeat(3, 1fr); } }
@media (min-width: 1400px) { .ts-grid { grid-template-columns: repeat(4, 1fr); } }
.ts-grid .ts-card { margin-bottom: 0; }

.ts-footer { text-align: center; margin-top: 20px; }
.ts-footer a { font-size: 12px; text-decoration: none; }
body.ts-light .ts-footer a { color: #9ca3af; }
body.ts-dark .ts-footer a { color: #6b7280; }
body.ts-light .ts-footer a:hover { color: #6b7280; }
body.ts-dark .ts-footer a:hover { color: #9ca3af; }
"""

STAR_SVG = '<svg class="ts-star" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>'

ARROW_LEFT_SVG = '<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>'
ARROW_RIGHT_SVG = '<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>'


def _render_card(t):
    """Render a single testimonial card as HTML string."""
    # Avatar
    if t['reviewer_image']:
        avatar = f'<img class="ts-avatar" src="{t["reviewer_image"]}" alt="{t["reviewer_name"]}">'
    else:
        initial = t['reviewer_name'][0].upper() if t['reviewer_name'] else '?'
        avatar = f'<div class="ts-avatar-placeholder">{initial}</div>'

    # Stars
    stars = f'<div class="ts-stars">{"".join([STAR_SVG] * int(t["rating"]))}</div>'

    # Review text with show more
    review_html = ''
    if t.get('review'):
        card_id = f'review-{t["id"]}'
        review_html = f'''<div class="ts-review-wrap">
        <p class="ts-review ts-clamped" id="{card_id}">{t["review"]}</p>
        <button class="ts-show-more" data-target="{card_id}" style="display:none;">Show more</button>
    </div>'''

    # Video
    video_html = f'<video class="ts-video" src="{t["video"]}" controls controlslist="nodownload"></video>' if t.get('video') else ''

    # Attached images
    images_html = ''
    if t.get('attached_images') and len(t['attached_images']) > 0 and t['attached_images'][0]:
        imgs = ''.join([f'<img src="{url}" alt="attached">' for url in t['attached_images']])
        images_html = f'<div class="ts-images">{imgs}</div>'

    # Date
    created = t.get('created_at', '')
    if created:
        from datetime import datetime
        if isinstance(created, str):
            try:
                dt = datetime.strptime(created, '%Y-%m-%d %H:%M:%S')
            except ValueError:
                dt = None
        else:
            dt = created
        date_str = dt.strftime('%b %d, %Y') if dt else str(created)
    else:
        date_str = ''

    return f'''<div class="ts-card">
    <div class="ts-reviewer">
        {avatar}
        <div>
            <p class="ts-name">{t["reviewer_name"]}</p>
            {stars}
        </div>
    </div>
    {review_html}
    {video_html}
    {images_html}
    <p class="ts-date">{date_str}</p>
</div>'''


def _fetch_space_and_testimonials(space_id, testimonial_id=None):
    """Fetch space info and testimonials from DB."""
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT id, spaceName, companyLogo FROM spaces WHERE id = %s", (space_id,))
    space_row = cursor.fetchone()
    if not space_row:
        cursor.close()
        return None, []

    space = {'id': space_row[0], 'spaceName': space_row[1], 'companyLogo': space_row[2]}

    if testimonial_id:
        cursor.execute("SELECT * FROM testimonials WHERE id = %s AND space_id = %s", (testimonial_id, space_id))
    else:
        cursor.execute("SELECT * FROM testimonials WHERE space_id = %s ORDER BY created_at DESC", (space_id,))

    results = cursor.fetchall()
    cursor.close()

    testimonials = []
    for row in results:
        testimonials.append({
            'id': row[0], 'rating': row[1], 'reviewer_name': row[2],
            'reviewer_email': row[3], 'reviewer_image': row[4],
            'review': row[5],
            'attached_images': row[6].split(',') if row[6] else [],
            'video': row[7], 'created_at': row[8],
            'space_id': row[9], 'type': row[10]
        })

    return space, testimonials


SHOW_MORE_JS = """
<script>
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.ts-show-more').forEach(function(btn) {
        var target = document.getElementById(btn.dataset.target);
        if (target && target.scrollHeight > target.clientHeight) {
            btn.style.display = 'inline';
        }
        btn.addEventListener('click', function() {
            if (target.classList.contains('ts-clamped')) {
                target.classList.remove('ts-clamped');
                btn.textContent = 'Show less';
            } else {
                target.classList.add('ts-clamped');
                btn.textContent = 'Show more';
            }
        });
    });
});
</script>
"""


def _build_page(body_content, theme, extra_js=''):
    """Wrap content in a full HTML page."""
    return f'''<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>{EMBED_CSS}</style>
</head>
<body class="ts-{theme}">
{body_content}
<script src="/static/js/iframeResizer.contentWindow.min.js"></script>
{SHOW_MORE_JS}
{extra_js}
</body>
</html>'''


def render_wall_of_love(space_id):
    theme = request.args.get('theme', 'light')
    layout = request.args.get('layout', 'carousel')
    if theme not in ('light', 'dark'):
        theme = 'light'
    if layout not in ('carousel', 'grid'):
        layout = 'carousel'

    space, testimonials = _fetch_space_and_testimonials(space_id)
    if not space:
        html = _build_page('<p style="text-align:center;padding:40px;">Space not found</p>', theme)
        response = make_response(html, 404)
        response.headers['Content-Type'] = 'text/html'
        return response

    if not testimonials:
        html = _build_page('<p style="text-align:center;padding:40px;color:#9ca3af;">No testimonials yet</p>', theme)
        response = make_response(html)
        response.headers['Content-Type'] = 'text/html'
        return response

    # Header
    logo_html = f'<img src="{space["companyLogo"]}" alt="{space["spaceName"]}">' if space['companyLogo'] else ''
    header = f'<div class="ts-header">{logo_html}<h2>{space["spaceName"]}</h2></div>'

    # Cards
    cards_html = ''.join([_render_card(t) for t in testimonials])

    # Layout wrapper
    if layout == 'carousel':
        content = f'''<div class="ts-carousel-wrapper">
    <button class="ts-arrow ts-arrow-left" onclick="document.getElementById('ts-scroll').scrollBy({{left:-320,behavior:'smooth'}})">{ARROW_LEFT_SVG}</button>
    <div class="ts-carousel" id="ts-scroll">{cards_html}</div>
    <button class="ts-arrow ts-arrow-right" onclick="document.getElementById('ts-scroll').scrollBy({{left:320,behavior:'smooth'}})">{ARROW_RIGHT_SVG}</button>
</div>'''
    else:
        content = f'<div class="ts-grid">{cards_html}</div>'

    footer = '<div class="ts-footer"><a href="/" target="_blank" rel="noopener noreferrer">Powered by TrustSphere</a></div>'

    body = f'<div class="ts-container">{header}{content}{footer}</div>'
    html = _build_page(body, theme)

    response = make_response(html)
    response.headers['Content-Type'] = 'text/html'
    return response


def render_single_testimonial(space_id, testimonial_id):
    theme = request.args.get('theme', 'light')
    if theme not in ('light', 'dark'):
        theme = 'light'

    space, testimonials = _fetch_space_and_testimonials(space_id, testimonial_id)
    if not space or not testimonials:
        html = _build_page('<p style="text-align:center;padding:40px;">Testimonial not found</p>', theme)
        response = make_response(html, 404)
        response.headers['Content-Type'] = 'text/html'
        return response

    card_html = _render_card(testimonials[0])
    footer = '<div class="ts-footer"><a href="/" target="_blank" rel="noopener noreferrer">Powered by TrustSphere</a></div>'
    body = f'<div class="ts-container">{card_html}{footer}</div>'
    html = _build_page(body, theme)

    response = make_response(html)
    response.headers['Content-Type'] = 'text/html'
    return response

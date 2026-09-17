# Scrolling Wall embeds

In **Embed & Scripts**, select a space, choose **Wall of Love**, then select
**Scrolling Wall**. Choose a theme, enable or disable auto-scroll, and choose
Slow (16 px/second) or Normal (28 px/second). Copy the updated snippet.
Deploy the frontend and backend, including Backend/static/js/scrolling-wall.js.
Existing grid and carousel snippets keep their selected layouts.

The embed URL accepts `layout=scrolling&animation=on&speed=slow`.
Unknown speed values default to slow; `animation=off` disables motion.

The wall uses three columns on desktop and two on tablets, based on the embed's
available width. Mobile, reduced-motion preferences, fewer than six reviews,
and disabled animation use static masonry. Without JavaScript the cards remain
readable. Collections with insufficient height for a loop also stay static.
The moving viewport is capped at 560px and may be shorter for short collections.

There is no visible Pause/Play button. Hovering, focusing a card,
expanding a review, or playing a video pauses movement. Keyboard focus and expanded
reviews allow scrolling within columns to reach their full content. Videos use
native controls, do not autoplay, and preload metadata only. Background tabs and
walls outside the viewport stop animation work.

Loops move original cards instead of cloning reviews, avoiding duplicate IDs,
repeated tab stops, and duplicate video players. The footer remains stationary.
These changes do not add testimonial curation, ordering, or generated video posters.

Verification: backend route tests cover option parsing, safe text rendering, and
existing embed layouts. Browser checks with sample reviews cover motion, automatic pauses,
keyboard expansion, desktop/tablet/mobile layouts, and reduced motion. Live data
and third-party video delivery were not required for these checks.

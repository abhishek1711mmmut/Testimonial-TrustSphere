/* Progressive enhancement: original cards stay readable without JavaScript. */
document.addEventListener('DOMContentLoaded', function () {
    const wall = document.querySelector('.ts-scrolling-wall');
    if (!wall) return;
    const cards = Array.from(wall.children);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let columns = [], hovered = false, visible = true, previous = 0;
    let frame = 0;
    const speed = wall.dataset.speed === 'normal' ? 28 : 16;
    function interacting() {
        return hovered || wall.contains(document.activeElement) ||
            !!wall.querySelector('[aria-expanded="true"]') ||
            Array.from(wall.querySelectorAll('video')).some(v => !v.paused && !v.ended);
    }
    function tick(time) {
        if (!interacting() && wall.classList.contains("ts-reading")) {
            wall.classList.remove("ts-reading");
            columns.forEach(c => c.viewport.scrollTop = 0);
        }
        const delta = previous ? Math.min(time - previous, 50) / 1000 : 0;
        previous = time;
        if (!interacting()) columns.forEach(column => {
            column.offset += delta * speed;
            const first = column.track.firstElementChild;
            const distance = first.getBoundingClientRect().height + 16;
            if (column.offset >= distance) {
                column.offset -= distance;
                column.track.append(first);
            }
            column.track.style.transform = `translateY(-${column.offset}px)`;
        });
        frame = requestAnimationFrame(tick);
    }
    function schedule() {
        cancelAnimationFrame(frame);
        previous = 0;
        if (columns.length && visible && !document.hidden) frame = requestAnimationFrame(tick);
    }
    function build() {
        cancelAnimationFrame(frame);
        columns = [];
        wall.replaceChildren(...cards);
        wall.classList.remove('ts-moving');
        const count = wall.clientWidth >= 960 ? 3 : 2;
        if (wall.clientWidth < 600 || reduced.matches || wall.dataset.animation === 'off' || cards.length < 6) return;
        const minHeight = 250;
        const maxHeight = 560;
        for (let columnCount = count; columnCount >= 2; columnCount--) {
            wall.replaceChildren(...cards);
            columns = [];
            for (let i = 0; i < columnCount; i++) {
                const viewport = document.createElement('div');
                const track = document.createElement('div');
                viewport.className = 'ts-wall-column';
                track.className = 'ts-wall-track';
                cards.filter((_, index) => index % columnCount === i).forEach(card => track.append(card));
                viewport.append(track);
                wall.append(viewport);
                columns.push({ viewport, track, offset: 0 });
            }
            wall.classList.add('ts-moving');
            // Reserve the tallest card so cycling never exposes an empty gap.
            const height = Math.min(maxHeight, ...columns.map(c => c.track.scrollHeight - Math.max(...Array.from(c.track.children).map(card => card.offsetHeight + 16))));
            if (height >= minHeight) {
                columns.forEach(c => c.viewport.style.height = height + 'px');
                schedule();
                return;
            }
        }
        // Neither arrangement supports a readable loop; keep every review visible.
        wall.replaceChildren(...cards);
        wall.classList.remove('ts-moving');
        columns = [];
    }
    wall.addEventListener('mouseenter', () => hovered = true);
    wall.addEventListener('mouseleave', () => hovered = false);
    // A focused card must be fully reachable even when it was outside the moving viewport.
    wall.addEventListener('focusin', () => {
        columns.forEach(c => { c.offset = 0; c.track.style.transform = ''; });
        wall.classList.add('ts-reading');
    });
    wall.addEventListener('focusout', () => {
        setTimeout(() => {
            if (!wall.contains(document.activeElement) && !interacting()) wall.classList.remove('ts-reading');
        }, 0);
    });
    wall.addEventListener('click', () => {
        if (wall.querySelector('[aria-expanded="true"]')) wall.classList.add('ts-reading');
        else if (!wall.contains(document.activeElement)) wall.classList.remove('ts-reading');
    });
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(build, 150);
    });
    reduced.addEventListener('change', build);
    document.addEventListener('visibilitychange', schedule);
    if ('IntersectionObserver' in window) new IntersectionObserver(entries => {
        visible = entries[0].isIntersecting;
        schedule();
    }).observe(wall);
    build();
});

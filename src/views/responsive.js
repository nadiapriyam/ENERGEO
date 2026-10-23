// Draw an SVG at its real pixel width (viewBox width = rendered width), so text and strokes keep
// their true size on a phone instead of shrinking with a fixed drawing. `draw(W)` rebuilds the content.

export function responsiveSvg(svg, height, draw, { min = 300 } = {}) {
  let W = 0;
  let ready = false;
  const measure = () => Math.max(min, Math.round(svg.getBoundingClientRect().width || svg.parentElement?.getBoundingClientRect().width || 640));
  const redraw = () => {
    if (!ready) return;
    W = measure();
    svg.setAttribute('viewBox', `0 0 ${W} ${height}`);
    draw(W);
  };
  const ro = new ResizeObserver(() => {
    if (Math.abs(measure() - W) > 2) redraw();
  });
  ro.observe(svg);
  svg.setAttribute('viewBox', `0 0 640 ${height}`);
  return {
    /** Call after new data arrives. */
    render() {
      ready = true;
      redraw();
    },
    width: () => W || 640,
  };
}

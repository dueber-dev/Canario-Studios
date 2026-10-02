// Opera adds its own video toolbar independently of HTML media controls.
// Draw the film as a decorative canvas there; other browsers retain native video.
export function createVideoSurface(video: HTMLVideoElement) {
  if (!/\b(OPR|Opera)\//.test(navigator.userAgent)) return () => {};
  const canvas = document.createElement("canvas");
  canvas.className = "video-surface";
  canvas.setAttribute("aria-hidden", "true");
  const context = canvas.getContext("2d", { alpha: false });
  if (!context) return () => {};
  video.after(canvas);
  video.hidden = true;
  let frame = 0;
  let lastTime = -1;
  let lastDraw = 0;

  function draw(now: number) {
    if (video.paused || video.ended || document.hidden) { frame = 0; return; }
    // Bound canvas work to 30 fps and 1280 source pixels across.
    if (video.readyState >= 2 && video.currentTime !== lastTime && now - lastDraw >= 32) {
      const width = Math.min(video.videoWidth, 1280);
      const height = Math.round(width * video.videoHeight / video.videoWidth);
      if (width && height) {
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
        }
        context!.drawImage(video, 0, 0, width, height);
        canvas.classList.add("is-ready");
        lastTime = video.currentTime;
        lastDraw = now;
      }
    }
    frame = requestAnimationFrame(draw);
  }
  const start = () => { if (!frame) frame = requestAnimationFrame(draw); };
  const reset = () => canvas.classList.remove("is-ready");
  video.addEventListener("playing", start);
  video.addEventListener("emptied", reset);
  video.addEventListener("error", reset);
  if (!video.paused) start();
  return () => {
    cancelAnimationFrame(frame);
    video.removeEventListener("playing", start);
    video.removeEventListener("emptied", reset);
    video.removeEventListener("error", reset);
    video.hidden = false;
    canvas.remove();
  };
}

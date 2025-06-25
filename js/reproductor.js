document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const videoId = urlParams.get("video") || "TnGl01FkMMo";
  const title = urlParams.get("title") || "Video";

  // Configurar video
  const videoPlayer = document.getElementById("video-player");
  videoPlayer.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;

  // Configurar título
  document.getElementById("video-title").textContent =
    decodeURIComponent(title);
});

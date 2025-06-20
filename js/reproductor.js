// 📺 REPRODUCTOR DE EPISODIOS - CILA MOVIES

function obtenerParametroURL(nombre) {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get(nombre)
}

function extraerIdYouTube(url) {
  const regex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
  const match = url.match(regex)
  return match ? match[1] : "dQw4w9WgXcQ"
}

function cargarReproductor() {
  const serieId = obtenerParametroURL("serie")
  const temporada = obtenerParametroURL("temporada") || "1"
  const capitulo = obtenerParametroURL("capitulo") || "1"

  const serie = window.catalogoCompleto.series.find((s) => s.id === serieId)

  if (!serie) {
    document.getElementById("reproductor-container").innerHTML = `
      <div style="text-align: center; padding: 50px; color: white;">
        <h2>Serie no encontrada</h2>
        <a href="../index.html" style="color: #233dff;">Volver al inicio</a>
      </div>
    `
    return
  }

  const videoId = extraerIdYouTube(serie.trailer)

  document.getElementById("reproductor-container").innerHTML = `
    <div style="background: #000; padding: 20px;">
      <div style="margin-bottom: 20px;">
        <a href="detalleSerie.html?id=${serieId}" style="color: #233dff; text-decoration: none;">
          ← Volver a ${serie.titulo}
        </a>
      </div>
      
      <div style="text-align: center; color: white; margin-bottom: 20px;">
        <h1>${serie.titulo}</h1>
        <h2>Temporada ${temporada} - Capítulo ${capitulo}</h2>
      </div>
      
      <div style="position: relative; width: 100%; height: 0; padding-bottom: 56.25%;">
        <iframe 
          style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
          src="https://www.youtube.com/embed/${videoId}?autoplay=1"
          title="${serie.titulo}"
          allowfullscreen
          allow="autoplay">
        </iframe>
      </div>
    </div>
  `

  document.getElementById("page-title").textContent = `CILA Movies - ${serie.titulo} T${temporada}E${capitulo}`
}

document.addEventListener("DOMContentLoaded", cargarReproductor)

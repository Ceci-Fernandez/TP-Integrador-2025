// auth-utils.js - Sistema de autenticación y navegación dinámica ACTUALIZADO

// 🔍 Función para verificar si hay usuario logueado
function estaLogueado() {
  try {
    const usuarioLogueado = localStorage.getItem("usuarioLogueado")
    return usuarioLogueado !== null && usuarioLogueado !== "null" && usuarioLogueado !== ""
  } catch (error) {
    console.error("Error verificando login:", error)
    return false
  }
}

// 🔍 Función para obtener datos del usuario logueado
function obtenerUsuarioLogueado() {
  try {
    const usuarioData = localStorage.getItem("usuarioLogueado")
    return usuarioData ? JSON.parse(usuarioData) : null
  } catch (error) {
    console.error("Error obteniendo usuario logueado:", error)
    return null
  }
}

// 🔍 Función para obtener la página actual
function obtenerPaginaActual() {
  const path = window.location.pathname
  const pagina = path.split("/").pop() || "index.html"
  return pagina
}

// 🎬 Función para obtener el último contenido visto (preparado para favoritos)
function obtenerUltimoContenidoVisto() {
  try {
    const usuarioLogueado = obtenerUsuarioLogueado()
    if (!usuarioLogueado) return null

    // 🆕 PREPARADO: Buscar en favoritos del usuario
    const favoritos = JSON.parse(localStorage.getItem(`favoritos_${usuarioLogueado.email}`)) || {
      peliculas: [],
      series: [],
    }

    // 🆕 PREPARADO: Buscar último visto en historial (para implementar después)
    const historial = JSON.parse(localStorage.getItem(`historial_${usuarioLogueado.email}`)) || []

    // 🎯 Por ahora, devolver el primer favorito o contenido por defecto
    if (favoritos.series.length > 0) {
      return {
        tipo: "serie",
        titulo: favoritos.series[0].titulo,
        url: `/html/detalleSerie.html?id=${favoritos.series[0].id}`,
      }
    }

    if (favoritos.peliculas.length > 0) {
      return {
        tipo: "pelicula",
        titulo: favoritos.peliculas[0].titulo,
        url: `/html/detallePelicula.html?id=${favoritos.peliculas[0].id}`,
      }
    }

    // 🎯 Si no hay favoritos, devolver contenido por defecto (El Eternauta)
    return {
      tipo: "serie",
      titulo: "El Eternauta",
      url: "/html/detalleSerie.html?id=eternauta",
    }
  } catch (error) {
    console.error("Error obteniendo último contenido:", error)
    // Contenido por defecto en caso de error
    return {
      tipo: "serie",
      titulo: "El Eternauta",
      url: "/html/detalleSerie.html?id=eternauta",
    }
  }
}

// 🎯 Función para actualizar header según estado de login
function actualizarHeader() {
  console.log("Actualizando header...")

  // Buscar el botón en el header
  const btnHeader =
    document.querySelector("#btnCerrarSesion") ||
    document.querySelector("#btnIniciarSesion") ||
    document.querySelector("a[href*='login.html']") ||
    document.querySelector(".header__li-btn") ||
    document.querySelector(".header__li.btn a")

  if (btnHeader) {
    const logueado = estaLogueado()
    console.log("Estado login:", logueado)

    if (logueado) {
      // 👤 Usuario logueado - mostrar "Perfil"
      btnHeader.textContent = "Perfil"
      btnHeader.href = "/html/perfilUsuario.html"
      btnHeader.id = "btnPerfil"

      // 🔄 Si ya estamos en el perfil, cambiar a "Cerrar sesión"
      const paginaActual = obtenerPaginaActual()
      if (paginaActual === "perfilUsuario.html") {
        btnHeader.textContent = "Cerrar sesión"
        btnHeader.href = "#"
        btnHeader.id = "btnCerrarSesion"

        // Agregar evento para cerrar sesión
        btnHeader.onclick = (e) => {
          e.preventDefault()
          cerrarSesion()
        }
      }
    } else {
      // 🚪 Usuario no logueado - mostrar "Iniciar sesión"
      btnHeader.textContent = "Iniciar Sesion"
      btnHeader.href = "/html/login.html"
      btnHeader.id = "btnIniciarSesion"
      btnHeader.className = "header__li-btn"
      btnHeader.onclick = null // Limpiar eventos previos
    }

    console.log("Header actualizado:", btnHeader.textContent)
  } else {
    console.warn("No se encontró botón en el header")
  }
}

// 🎯 NUEVO: Función para actualizar botón del banner (solo en index.html)
function actualizarBannerHero() {
  const paginaActual = obtenerPaginaActual()

  // Solo ejecutar en index.html
  if (paginaActual !== "index.html" && window.location.pathname !== "/" && paginaActual !== "") {
    return
  }

  console.log("Actualizando banner hero...")

  // Buscar el botón del hero
  const btnHero = document.querySelector(".hero__btn") || document.querySelector("a[href*='registroUsuario.html']")

  if (btnHero) {
    const logueado = estaLogueado()

    if (logueado) {
      // 👤 Usuario logueado - cambiar a "Seguir viendo"
      const ultimoContenido = obtenerUltimoContenidoVisto()

      btnHero.textContent = "Seguir viendo"
      btnHero.href = ultimoContenido.url
      btnHero.className = "hero__btn hero__btn--continuar"

      // 🆕 PREPARADO: Agregar data attributes para futuras funcionalidades
      btnHero.setAttribute("data-tipo", ultimoContenido.tipo)
      btnHero.setAttribute("data-titulo", ultimoContenido.titulo)

      console.log(`Banner actualizado: "Seguir viendo" → ${ultimoContenido.titulo}`)
    } else {
      // 🚪 Usuario no logueado - mostrar "Suscribete"
      btnHero.textContent = "Suscribete"
      btnHero.href = "/html/registroUsuario.html"
      btnHero.className = "hero__btn"

      // Limpiar data attributes
      btnHero.removeAttribute("data-tipo")
      btnHero.removeAttribute("data-titulo")

      console.log('Banner actualizado: "Suscribete"')
    }
  } else {
    console.warn("No se encontró botón del hero")
  }
}

// 🎯 Función para actualizar footer según estado de login
function actualizarFooter() {
  console.log("Actualizando footer...")

  const paginaActual = obtenerPaginaActual()
  const logueado = estaLogueado()

  // 🔍 Buscar la columna Home en el footer
  const columnaHome =
    document.querySelector(".columna_footer:nth-child(2) ul") || document.querySelector(".columna_footer ul")

  if (columnaHome) {
    // 🔍 Buscar si ya existe el link dinámico
    let linkDinamico = columnaHome.querySelector(".link-dinamico")

    // 🆕 Si no existe, crearlo
    if (!linkDinamico) {
      linkDinamico = document.createElement("li")
      linkDinamico.className = "link-dinamico"
      columnaHome.appendChild(linkDinamico)
    }

    // 🎯 Determinar qué mostrar según estado y página
    if (logueado) {
      // 👤 Usuario logueado - siempre mostrar "Cerrar sesión"
      linkDinamico.innerHTML = '<a href="#" onclick="cerrarSesionFooter(event)">Cerrar sesión</a>'
    } else {
      // 🚪 Usuario no logueado - mostrar según página
      if (paginaActual === "index.html" || paginaActual === "" || window.location.pathname === "/") {
        // 📝 En index.html - mostrar "Suscribirse"
        linkDinamico.innerHTML = '<a href="/html/registroUsuario.html">Suscribirse</a>'
      } else if (paginaActual === "detalleSerie.html" || paginaActual === "detallePelicula.html") {
        // 🎬 En páginas de detalle - mostrar "Suscribirse"
        linkDinamico.innerHTML = '<a href="/html/registroUsuario.html">Suscribirse</a>'
      } else {
        // 🏠 En otras páginas - mostrar "Home"
        linkDinamico.innerHTML = '<a href="/index.html">Home</a>'
      }
    }

    console.log("Footer actualizado:", linkDinamico.innerHTML)
  } else {
    console.warn("No se encontró columna Home en el footer")
  }
}

// 🚪 Función para cerrar sesión desde footer
function cerrarSesionFooter(event) {
  event.preventDefault()
  console.log("Cerrando sesión desde footer...")
  cerrarSesion()
}

// 🚪 Función principal para cerrar sesión
function cerrarSesion() {
  try {
    // 🗑️ Limpiar datos de sesión
    localStorage.removeItem("usuarioLogueado")
    localStorage.removeItem("tarjetaSeleccionada")
    localStorage.removeItem("cambioDePlan")

    console.log("Sesión cerrada exitosamente")

    // 🔄 Redirigir al login
    window.location.href = "/html/login.html"
  } catch (error) {
    console.error("Error cerrando sesión:", error)
    alert("Error al cerrar sesión")
  }
}

// 🎯 Función principal para actualizar toda la interfaz
function actualizarInterfazSegunLogin() {
  console.log("=== ACTUALIZANDO INTERFAZ SEGÚN LOGIN ===")
  console.log("Página actual:", obtenerPaginaActual())
  console.log("Usuario logueado:", estaLogueado())

  actualizarHeader()
  actualizarBannerHero() // 🆕 NUEVO: Actualizar banner del hero
  actualizarFooter()

  console.log("=== INTERFAZ ACTUALIZADA ===")
}

// 🎯 Función para actualizar interfaz cuando cambia el estado de login
function actualizarDespuesDeLogin(email) {
  console.log("Usuario logueado:", email)
  // Pequeño delay para asegurar que localStorage se actualizó
  setTimeout(() => {
    actualizarInterfazSegunLogin()
  }, 100)
}

// 🎯 Función para actualizar interfaz cuando se cierra sesión
function actualizarDespuesDeLogout() {
  console.log("Sesión cerrada")
  actualizarInterfazSegunLogin()
}

// 🆕 NUEVO: Función para actualizar cuando se agregan favoritos
function actualizarDespuesDeFavoritos() {
  console.log("Favoritos actualizados")
  // Solo actualizar el banner si estamos en index
  const paginaActual = obtenerPaginaActual()
  if (paginaActual === "index.html" || window.location.pathname === "/" || paginaActual === "") {
    actualizarBannerHero()
  }
}

// 🔄 Auto-ejecutar cuando se carga el DOM
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM cargado - inicializando auth-utils")

  // Pequeño delay para asegurar que otros scripts se cargaron
  setTimeout(() => {
    actualizarInterfazSegunLogin()
  }, 100)
})

// 🔄 También ejecutar cuando se enfoca la ventana (por si cambió el login en otra pestaña)
window.addEventListener("focus", () => {
  actualizarInterfazSegunLogin()
})

// 🔄 Ejecutar cuando cambia el localStorage (para sincronizar pestañas)
window.addEventListener("storage", (e) => {
  if (e.key === "usuarioLogueado" || e.key?.startsWith("favoritos_")) {
    console.log("Cambio detectado en localStorage:", e.key)
    actualizarInterfazSegunLogin()
  }
})

// 🆕 Funciones globales para usar en otros scripts
window.actualizarInterfazDespuesDeLogin = actualizarDespuesDeLogin
window.actualizarDespuesDeFavoritos = actualizarDespuesDeFavoritos
window.estaLogueado = estaLogueado
window.obtenerUsuarioLogueado = obtenerUsuarioLogueado
window.cerrarSesion = cerrarSesion

console.log("auth-utils.js cargado correctamente con funcionalidad de banner")

// 🆕 COMENTARIOS SOBRE LA NUEVA FUNCIONALIDAD:
/*
NUEVA FUNCIONALIDAD DEL BANNER:

🎯 BOTÓN DEL HERO (solo en index.html):
- Sin login: "Suscribete" → /html/registroUsuario.html
- Con login: "Seguir viendo" → último contenido visto/favorito

🔮 PREPARADO PARA FAVORITOS:
- obtenerUltimoContenidoVisto() busca en favoritos del usuario
- Si no hay favoritos, usa contenido por defecto (El Eternauta)
- Se actualiza automáticamente cuando cambian los favoritos
- Data attributes preparados para futuras funcionalidades

🎬 LÓGICA DE CONTENIDO:
1. Busca series favoritas primero
2. Si no hay, busca películas favoritas
3. Si no hay favoritos, usa El Eternauta por defecto
4. Incluye ID para navegación específica

🔄 SINCRONIZACIÓN:
- Se actualiza cuando cambian los favoritos
- Funciona solo en index.html
- Compatible con sistema existente

EJEMPLO DE USO FUTURO:
Cuando implementes favoritos, solo llama:
window.actualizarDespuesDeFavoritos()
*/

// 🎬 PÁGINA PRINCIPAL CON CATÁLOGO DINÁMICO - CILA MOVIES

document.addEventListener("DOMContentLoaded", () => {
  console.log("=== PÁGINA PRINCIPAL INICIADA ===")

  // 🎯 ELEMENTOS DEL DOM
  const inputBusqueda = document.getElementById("busqueda")
  const btnBuscarPrincipal = document.getElementById("btnBuscarPrincipal")
  const selectCategoria = document.getElementById("categoria")
  const selectGenero = document.getElementById("genero")
  const btnLimpiarFiltros = document.getElementById("btnLimpiarFiltros")
  const catalogoGrid = document.getElementById("catalogoGrid")
  const tendenciasGrid = document.getElementById("tendenciasGrid")
  const tituloResultados = document.getElementById("tituloResultados")
  const contadorResultados = document.getElementById("contadorResultados")
  const resultadosInfo = document.getElementById("resultadosInfo")
  const sinResultados = document.getElementById("sinResultados")
  const btnMostrarTodo = document.getElementById("btnMostrarTodo")
  const indicadorCarga = document.getElementById("indicadorCarga")

  // 🎯 VARIABLES GLOBALES
  let contenidoCompleto = []
  let contenidoFiltrado = []
  let filtrosActivos = {
    busqueda: "",
    categoria: "",
    genero: "",
  }

  // 🚀 INICIALIZACIÓN
  function inicializar() {
    console.log("Inicializando página principal...")

    // Verificar que el catálogo externo esté cargado
    if (typeof window.catalogoCompleto === "undefined") {
      console.error("Error: catalogoCompleto no está disponible. Asegúrate de cargar catalogo-datos.js primero.")
      mostrarErrorCarga()
      return
    }

    // Cargar datos del catálogo externo
    cargarDatosCatalogo()

    // Configurar event listeners
    configurarEventListeners()

    // Cargar contenido inicial
    cargarContenidoInicial()

    console.log("Página principal inicializada correctamente")
  }

  // 📚 CARGAR DATOS DEL CATÁLOGO EXTERNO
  function cargarDatosCatalogo() {
    // Combinar películas y series del catálogo externo
    contenidoCompleto = [
      ...window.catalogoCompleto.peliculas.map((p) => ({ ...p, tipo: "pelicula" })),
      ...window.catalogoCompleto.series.map((s) => ({ ...s, tipo: "serie" })),
    ]

    contenidoFiltrado = [...contenidoCompleto]
    console.log(`Cargado: ${contenidoCompleto.length} elementos del catálogo externo`)
  }

  // 🚨 MOSTRAR ERROR DE CARGA
  function mostrarErrorCarga() {
    catalogoGrid.innerHTML = `
      <div class="error-carga">
        <h3>Error al cargar el catálogo</h3>
        <p>No se pudo cargar el archivo de datos. Verifica que catalogo-datos.js esté incluido.</p>
        <button onclick="location.reload()" class="btn-reintentar">Reintentar</button>
      </div>
    `
  }

  // 🎯 CONFIGURAR EVENT LISTENERS
  function configurarEventListeners() {
    // Búsqueda
    inputBusqueda.addEventListener("input", debounce(manejarBusqueda, 300))
    btnBuscarPrincipal.addEventListener("click", ejecutarBusqueda)
    inputBusqueda.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        ejecutarBusqueda()
      }
    })

    // Filtros
    selectCategoria.addEventListener("change", manejarFiltroCategoria)
    selectGenero.addEventListener("change", manejarFiltroGenero)

    // Limpiar filtros
    btnLimpiarFiltros.addEventListener("click", limpiarTodosFiltros)
    btnMostrarTodo.addEventListener("click", limpiarTodosFiltros)

    // Navegación del header
    document.getElementById("peliculas").addEventListener("click", () => filtrarPorCategoria("peliculas"))
    document.getElementById("series").addEventListener("click", () => filtrarPorCategoria("series"))
    document.getElementById("home").addEventListener("click", limpiarTodosFiltros)

    console.log("Event listeners configurados")
  }

  // 🎬 CARGAR CONTENIDO INICIAL
  function cargarContenidoInicial() {
    // Mostrar todo el catálogo inicialmente
    mostrarCatalogo(contenidoCompleto)

    // Cargar las 5 tendencias (contenido mejor calificado)
    cargarTendencias()

    // Ocultar info de resultados inicialmente
    resultadosInfo.style.display = "none"
  }

  // 🔥 CARGAR TENDENCIAS
  function cargarTendencias() {
    // Obtener los 5 elementos mejor calificados
    const tendencias = [...contenidoCompleto].sort((a, b) => b.calificacion - a.calificacion).slice(0, 5)

    tendenciasGrid.innerHTML = tendencias.map((item, index) => crearTarjetaTendencia(item, index + 1)).join("")

    console.log("Tendencias cargadas:", tendencias.length)
  }

  // 🔍 MANEJO DE BÚSQUEDA
  function manejarBusqueda() {
    filtrosActivos.busqueda = inputBusqueda.value.toLowerCase().trim()
    aplicarFiltros()
  }

  function ejecutarBusqueda() {
    manejarBusqueda()
    console.log("Búsqueda ejecutada:", filtrosActivos.busqueda)
  }

  // 🎭 MANEJO DE FILTROS
  function manejarFiltroCategoria() {
    filtrosActivos.categoria = selectCategoria.value
    aplicarFiltros()
    console.log("Filtro categoría:", filtrosActivos.categoria)
  }

  function manejarFiltroGenero() {
    filtrosActivos.genero = selectGenero.value
    aplicarFiltros()
    console.log("Filtro género:", filtrosActivos.genero)
  }

  function filtrarPorCategoria(categoria) {
    selectCategoria.value = categoria
    filtrosActivos.categoria = categoria
    aplicarFiltros()

    // Scroll al catálogo
    document.getElementById("catalogo").scrollIntoView({ behavior: "smooth" })
  }

  // 🔄 APLICAR FILTROS
  function aplicarFiltros() {
    mostrarIndicadorCarga()

    // Simular delay de búsqueda para mejor UX
    setTimeout(() => {
      contenidoFiltrado = contenidoCompleto.filter((item) => {
        // Filtro por búsqueda (título, género, actores)
        const coincideBusqueda =
          filtrosActivos.busqueda === "" ||
          item.titulo.toLowerCase().includes(filtrosActivos.busqueda) ||
          item.genero.some((g) => g.toLowerCase().includes(filtrosActivos.busqueda)) ||
          (item.actores && item.actores.some((a) => a.nombre.toLowerCase().includes(filtrosActivos.busqueda)))

        // Filtro por categoría
        const coincideCategoria =
          filtrosActivos.categoria === "" ||
          filtrosActivos.categoria === "todos" ||
          (filtrosActivos.categoria === "peliculas" && item.tipo === "pelicula") ||
          (filtrosActivos.categoria === "series" && item.tipo === "serie")

        // Filtro por género
        const coincideGenero =
          filtrosActivos.genero === "" ||
          item.genero.some((g) => g.toLowerCase().includes(filtrosActivos.genero.replace("-", " ").toLowerCase()))

        return coincideBusqueda && coincideCategoria && coincideGenero
      })

      mostrarCatalogo(contenidoFiltrado)
      actualizarInfoResultados()
      ocultarIndicadorCarga()

      console.log(`Filtros aplicados: ${contenidoFiltrado.length} resultados`)
    }, 300)
  }

  // 🎬 MOSTRAR CATÁLOGO
  function mostrarCatalogo(contenido) {
    if (contenido.length === 0) {
      catalogoGrid.style.display = "none"
      sinResultados.style.display = "block"
      return
    }

    catalogoGrid.style.display = "grid"
    sinResultados.style.display = "none"

    catalogoGrid.innerHTML = contenido.map((item) => crearTarjetaCatalogo(item)).join("")
  }

  // 🎨 CREAR TARJETA DE CATÁLOGO
  function crearTarjetaCatalogo(item) {
    const tipoUrl = item.tipo === "serie" ? "detalleSerie" : "detallePelicula"

    return `
      <a href="/html/${tipoUrl}.html?id=${item.id}" class="pelicula" data-id="${item.id}" data-tipo="${item.tipo}">
        <img src="${item.imagen}" alt="${item.titulo}" loading="lazy" />
        <div class="pelicula-info">
          <h4>${item.titulo}</h4>
          <p>${item.año}</p>
          <span class="calificacion">⭐ ${item.calificacion}</span>
        </div>
      </a>
    `
  }

  // 🔥 CREAR TARJETA DE TENDENCIA
  function crearTarjetaTendencia(item, numero) {
    const tipoUrl = item.tipo === "serie" ? "detalleSerie" : "detallePelicula"

    return `
      <a href="/html/${tipoUrl}.html?id=${item.id}" class="tendencia" data-id="${item.id}" data-tipo="${item.tipo}">
        <img src="${item.imagen}" alt="${item.titulo}" loading="lazy" />
        <span class="numero">${numero}</span>
        <div class="tendencia-info">
          <h4>${item.titulo}</h4>
          <p>⭐ ${item.calificacion}</p>
        </div>
      </a>
    `
  }

  // 📊 ACTUALIZAR INFO DE RESULTADOS
  function actualizarInfoResultados() {
    const hayFiltrosActivos =
      filtrosActivos.busqueda !== "" || filtrosActivos.categoria !== "" || filtrosActivos.genero !== ""

    if (hayFiltrosActivos) {
      resultadosInfo.style.display = "block"

      let titulo = "Resultados"
      if (filtrosActivos.busqueda) {
        titulo = `Resultados para "${filtrosActivos.busqueda}"`
      } else if (filtrosActivos.categoria === "peliculas") {
        titulo = "Películas"
      } else if (filtrosActivos.categoria === "series") {
        titulo = "Series"
      } else if (filtrosActivos.genero) {
        const generoFormateado = filtrosActivos.genero.replace("-", " ")
        titulo = `Género: ${generoFormateado.charAt(0).toUpperCase() + generoFormateado.slice(1)}`
      }

      tituloResultados.textContent = titulo
      contadorResultados.textContent = `${contenidoFiltrado.length} resultado${contenidoFiltrado.length !== 1 ? "s" : ""}`
    } else {
      resultadosInfo.style.display = "none"
    }
  }

  // 🔄 LIMPIAR FILTROS
  function limpiarTodosFiltros() {
    filtrosActivos = {
      busqueda: "",
      categoria: "",
      genero: "",
    }

    inputBusqueda.value = ""
    selectCategoria.value = ""
    selectGenero.value = ""

    contenidoFiltrado = [...contenidoCompleto]
    mostrarCatalogo(contenidoFiltrado)
    actualizarInfoResultados()

    console.log("Filtros limpiados")
  }

  // ⏳ INDICADORES DE CARGA
  function mostrarIndicadorCarga() {
    if (indicadorCarga) {
      indicadorCarga.style.display = "block"
    }
  }

  function ocultarIndicadorCarga() {
    if (indicadorCarga) {
      indicadorCarga.style.display = "none"
    }
  }

  // 🛠️ UTILIDADES
  function debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }

  // 🚀 INICIAR LA APLICACIÓN
  inicializar()

  console.log("=== PÁGINA PRINCIPAL LISTA ===")
})

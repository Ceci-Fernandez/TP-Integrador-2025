// perfilUsuario.js - MODIFICADO para nueva estructura con desplegables

document.addEventListener("DOMContentLoaded", () => {
  // 🎯 ELEMENTOS DEL DOM - Actualizados según nueva estructura
  const nombreUsuario = document.getElementById("nombreUsuario")
  const emailUsuario = document.getElementById("emailUsuario")
  const planActual = document.getElementById("planActual")
  const proximaFactura = document.getElementById("proximaFactura")
  const tarjetaActual = document.getElementById("tarjetaActual")
  const planesContainer = document.getElementById("planesContainer")
  const metodosPago = document.getElementById("metodosPago")

  // 🆕 NUEVO: Botones separados según nueva estructura
  const btnGuardarContrasenia = document.getElementById("btnGuardarContrasenia")
  const btnGuardarPlan = document.getElementById("btnGuardarPlan")
  const btnGuardarPago = document.getElementById("btnGuardarPago")

  // 🆕 NUEVO: Elementos del desplegable de método de pago
  const btnCambiarPago = document.getElementById("btnCambiarPago")
  const btnCancelarPago = document.getElementById("btnCancelarPago")
  const formularioPago = document.getElementById("formularioPago")

  // Elementos de contraseña
  const nuevaContrasenia = document.getElementById("nuevaContrasenia")
  const confirmar = document.getElementById("confirmar_perfil")

  // Elementos de tarjeta
  const numTarjeta = document.getElementById("num-tarjeta")
  const vencimiento = document.getElementById("vencimineto_tarjeta_perfil")
  const cod = document.getElementById("cod")
  const nombreTarjeta = document.getElementById("nombre_tarjeta_perfil")



  // 🔁 Reutilizamos expresiones y funciones del registro
  const passwordRegex = /^(?=(?:.*[A-Za-z]){2,})(?=(?:.*\d){2,})(?=(?:.*[^A-Za-z\d]){2,}).{8,}$/

  const mostrarError = (input, mensaje) => {
    let error = input.nextElementSibling
    if (!error || !error.classList.contains("error")) {
      error = document.createElement("div")
      error.className = "error"
      error.style.color = "red"
      input.parentNode.insertBefore(error, input.nextSibling)
    }
    error.textContent = mensaje
  }

  const limpiarError = (input) => {
    const error = input.nextElementSibling
    if (error && error.classList.contains("error")) {
      error.remove()
    }
  }

  // 🔧 MODIFICADO: Validación de contraseña para botón específico
  function validarPassword() {
    const passwordValida = passwordRegex.test(nuevaContrasenia.value)
    const coinciden = nuevaContrasenia.value === confirmar.value
    const hayContenido = nuevaContrasenia.value.length > 0

    if (nuevaContrasenia.value && !passwordValida) {
      mostrarError(nuevaContrasenia, "Debe tener min 8 caracteres, 2 letras, 2 números y 2 símbolos")
    } else {
      limpiarError(nuevaContrasenia)
    }

    if (confirmar.value && !coinciden) {
      mostrarError(confirmar, "Las contraseñas no coinciden")
    } else {
      limpiarError(confirmar)
    }

    // 🔧 CORREGIDO: Solo habilitar botón de contraseña si hay cambios válidos
    if (btnGuardarContrasenia) {
      btnGuardarContrasenia.disabled = !(passwordValida && coinciden && hayContenido)
    }
  }

  // 🔧 MODIFICADO: Validación de tarjeta para botón específico
  function validarTarjeta() {
    let valida = true
    limpiarError(numTarjeta)
    limpiarError(cod)
    limpiarError(nombreTarjeta)

    if (!/^\d{16}$/.test(numTarjeta.value)) {
      mostrarError(numTarjeta, "La tarjeta debe tener 16 dígitos")
      valida = false
    } else {
      const numeros = numTarjeta.value.split("").map(Number)
      const suma = numeros.slice(0, 15).reduce((acc, n) => acc + n, 0)
      const ultimo = numeros[15]
      if ((suma % 2 === 0 && ultimo % 2 === 0) || (suma % 2 === 1 && ultimo % 2 === 1)) {
        mostrarError(numTarjeta, "El último número no cumple la regla par/impar")
        valida = false
      }
    }

    if (!/^[1-9]\d{2}$/.test(cod.value)) {
      mostrarError(cod, "CVV inválido. No puede ser 000")
      valida = false
    }

    if (nombreTarjeta.value.trim() === "") {
      mostrarError(nombreTarjeta, "Campo requerido")
      valida = false
    }

    // 🔧 CORREGIDO: Validar también que hay tarjeta seleccionada
    const tarjetaSeleccionadaValida = tarjetaSeleccionada !== null

    if (btnGuardarPago) {
      btnGuardarPago.disabled = !(valida && tarjetaSeleccionadaValida)
    }
  }

  // Event listeners para validaciones
  if (nuevaContrasenia && confirmar) {
    nuevaContrasenia.addEventListener("input", validarPassword)
    confirmar.addEventListener("input", validarPassword)
  }

  if (numTarjeta && cod && nombreTarjeta) {
    numTarjeta.addEventListener("input", validarTarjeta)
    cod.addEventListener("input", validarTarjeta)
    nombreTarjeta.addEventListener("input", validarTarjeta)
  }

  // ✅ Planes disponibles
  const planes = [
    { nombre: "Básico", precio: 3000 },
    { nombre: "Estándar", precio: 5000 },
    { nombre: "Premium", precio: 8000, popular: true },
  ]

  // 🆕 NUEVO: Obtener usuario actual de forma más robusta
  const usuariosGuardados = JSON.parse(localStorage.getItem("usuarioRegistrado")) || []
  const usuarioLogueado = JSON.parse(localStorage.getItem("usuarioLogueado"))
  let usuario

  if (usuarioLogueado && usuarioLogueado.email) {
    usuario = usuariosGuardados.find((u) => u.datosPersonales?.email === usuarioLogueado.email)
    console.log("Usuario encontrado por login:", usuario)
  } else {
    usuario = usuariosGuardados[usuariosGuardados.length - 1]
    console.log("Usuario usando fallback (último):", usuario)
  }

  // ✅ Cargar datos del usuario en la interfaz
  if (usuario) {
    nombreUsuario.textContent = usuario.datosPersonales?.nombre || "Usuario"
    emailUsuario.textContent = usuario.datosPersonales?.email || "email@ejemplo.com"
  }

  // ✅ Mostrar datos de tarjeta actual
  if (usuario && usuario.datosTarjeta?.numTarjeta) {
    const ultimos4 = usuario.datosTarjeta.numTarjeta.slice(-4)
    tarjetaActual.textContent += ultimos4
  } else {
    tarjetaActual.textContent += "No configurada"
  }

  // ✅ Mostrar plan actual y próxima factura
  if (usuario && usuario.planContratado) {
    planActual.textContent = usuario.planContratado
    const plan = planes.find((p) => p.nombre === usuario.planContratado)
    proximaFactura.textContent += plan ? plan.precio : "0"
  } else {
    planActual.textContent = "Sin plan"
    proximaFactura.textContent += "0"
  }

  // 🆕 NUEVO: Variable para almacenar el plan seleccionado
  let cambioDePlan = null

  // ✅ Generar planes disponibles
  planes.forEach((plan) => {
    const div = document.createElement("div")
    div.className = "registro__plan" + (plan.popular ? " plan-premium" : "")
    div.innerHTML = `
      <h4>${plan.nombre}</h4>
      <p>$${plan.precio}/mes</p>
      <input type="radio" name="plan" value="${plan.nombre}">
    `
    div.addEventListener("click", () => {
      document.querySelectorAll(".registro__plan").forEach((t) => t.classList.remove("seleccionado"))
      div.classList.add("seleccionado")
      cambioDePlan = plan
      console.log("Plan seleccionado:", cambioDePlan)

      // 🆕 NUEVO: Habilitar botón de guardar plan cuando se selecciona
      if (btnGuardarPlan) {
        btnGuardarPlan.disabled = false
      }
    })
    planesContainer.appendChild(div)
  })

  // 🆕 NUEVO: Evento para guardar cambios de CONTRASEÑA
  if (btnGuardarContrasenia) {
    btnGuardarContrasenia.addEventListener("click", () => {
      console.log("=== GUARDANDO CAMBIO DE CONTRASEÑA ===")

      if (!usuario) {
        alert("Error: No hay usuario cargado")
        return
      }

      const nuevaPassword = nuevaContrasenia.value
      const confirmarPassword = confirmar.value

      if (nuevaPassword !== confirmarPassword) {
        alert("Las contraseñas no coinciden")
        return
      }

      if (!passwordRegex.test(nuevaPassword)) {
        alert("La contraseña no cumple con los requisitos")
        return
      }

      // Actualizar contraseña en localStorage
      const todosLosUsuarios = JSON.parse(localStorage.getItem("usuarioRegistrado")) || []
      const emailUsuarioActual = usuario.datosPersonales.email
      const indiceUsuario = todosLosUsuarios.findIndex((u) => u.datosPersonales?.email === emailUsuarioActual)

      if (indiceUsuario !== -1) {
        todosLosUsuarios[indiceUsuario].datosPersonales.password = nuevaPassword
        localStorage.setItem("usuarioRegistrado", JSON.stringify(todosLosUsuarios))

        // Limpiar campos
        nuevaContrasenia.value = ""
        confirmar.value = ""
        btnGuardarContrasenia.disabled = true

        alert("Contraseña actualizada correctamente")
 
      } else {
        alert("Error: No se pudo actualizar la contraseña")
      }
    })
  }

  // 🆕 NUEVO: Evento para guardar cambios de PLAN
  if (btnGuardarPlan) {
    btnGuardarPlan.addEventListener("click", () => {


      if (!cambioDePlan) {
        alert("Por favor selecciona un plan")
        return
      }

      if (!usuario) {
        alert("Error: No hay usuario cargado")
        return
      }

      const todosLosUsuarios = JSON.parse(localStorage.getItem("usuarioRegistrado")) || []
      const emailUsuarioActual = usuario.datosPersonales.email
      const indiceUsuario = todosLosUsuarios.findIndex((u) => u.datosPersonales?.email === emailUsuarioActual)



      if (indiceUsuario !== -1) {
        todosLosUsuarios[indiceUsuario].planContratado = cambioDePlan.nombre
        localStorage.setItem("usuarioRegistrado", JSON.stringify(todosLosUsuarios))

        // Actualizar variable local
        usuario.planContratado = cambioDePlan.nombre

        // Actualizar interfaz
        planActual.textContent = cambioDePlan.nombre
        proximaFactura.textContent = "Próxima factura: $" + cambioDePlan.precio

        // Limpiar selección
        document.querySelectorAll(".registro__plan").forEach((p) => p.classList.remove("seleccionado"))
        cambioDePlan = null
        btnGuardarPlan.disabled = true

        // Mostrar mensaje de éxito
        const mensajeExito = document.getElementById("mensajeExito")
        if (mensajeExito) {
          mensajeExito.style.display = "block"
          setTimeout(() => {
            mensajeExito.style.display = "none"
          }, 3000)
        }

      } else {
        alert("Error: No se pudo actualizar el plan")
      }
    })
  }

  // 🆕 NUEVO: Funcionalidad del desplegable de método de pago
  let formularioVisible = false

  if (btnCambiarPago && formularioPago) {
    btnCambiarPago.addEventListener("click", () => {
      formularioVisible = !formularioVisible

      if (formularioVisible) {
        formularioPago.style.display = "block"
        btnCambiarPago.textContent = "Cancelar cambio"
        
      } else {
        formularioPago.style.display = "none"
        btnCambiarPago.textContent = "Cambiar método de pago"
        limpiarFormularioPago()

      }
    })
  }

  // 🆕 NUEVO: Botón cancelar dentro del desplegable
  if (btnCancelarPago) {
    btnCancelarPago.addEventListener("click", () => {
      formularioPago.style.display = "none"
      btnCambiarPago.textContent = "Cambiar método de pago"
      formularioVisible = false
      limpiarFormularioPago()

    })
  }

  // 🆕 NUEVO: Función para limpiar formulario de pago
  function limpiarFormularioPago() {
    if (numTarjeta) numTarjeta.value = ""
    if (cod) cod.value = ""
    if (nombreTarjeta) nombreTarjeta.value = ""
    if (vencimiento) vencimiento.value = ""

    // Limpiar selección de tarjetas
    document.querySelectorAll(".img_tarjeta").forEach((t) => t.classList.remove("seleccionada"))
    tarjetaSeleccionada = null

    if (btnGuardarPago) {
      btnGuardarPago.disabled = true
    }

    // Limpiar errores
    document.querySelectorAll(".error").forEach((error) => error.remove())
  }

  // ✅ Generar métodos de pago (dentro del desplegable)
  const tarjetas = ["cabal", "cabaldebit", "maestro", "mastercard", "naranja", "visa", "visadebit"]
  let tarjetaSeleccionada = null

  tarjetas.forEach((marca) => {
    const img = document.createElement("img")
    img.src = `/img/img-tarjetas/${marca}.png`
    img.style.cursor = "pointer"
    img.className = "img_tarjeta"

    img.addEventListener("click", () => {
      document.querySelectorAll(".img_tarjeta").forEach((t) => t.classList.remove("seleccionada"))
      img.classList.add("seleccionada")
      tarjetaSeleccionada = marca

      // Revalidar formulario cuando se selecciona tarjeta
      validarTarjeta()
    })

    if (metodosPago) {
      metodosPago.appendChild(img)
    }
  })

  // 🆕 NUEVO: Evento para guardar método de PAGO
  if (btnGuardarPago) {
    btnGuardarPago.addEventListener("click", () => {
  

      if (!usuario) {
        alert("Error: No hay usuario cargado")
        return
      }

      if (!tarjetaSeleccionada) {
        alert("Por favor selecciona un tipo de tarjeta")
        return
      }

      // Validar campos de tarjeta
      if (!numTarjeta.value || !cod.value || !nombreTarjeta.value || !vencimiento.value) {
        alert("Por favor completa todos los campos de la tarjeta")
        return
      }

      // Guardar datos de tarjeta
      const todosLosUsuarios = JSON.parse(localStorage.getItem("usuarioRegistrado")) || []
      const emailUsuarioActual = usuario.datosPersonales.email
      const indiceUsuario = todosLosUsuarios.findIndex((u) => u.datosPersonales?.email === emailUsuarioActual)

      if (indiceUsuario !== -1) {
        todosLosUsuarios[indiceUsuario].datosTarjeta = {
          numTarjeta: numTarjeta.value,
          vencimiento: vencimiento.value,
          cvv: cod.value,
          nombre: nombreTarjeta.value,
          tipo: tarjetaSeleccionada,
        }

        localStorage.setItem("usuarioRegistrado", JSON.stringify(todosLosUsuarios))

        // Actualizar variable local
        usuario.datosTarjeta = todosLosUsuarios[indiceUsuario].datosTarjeta

        // Actualizar interfaz
        const ultimos4 = numTarjeta.value.slice(-4)
        tarjetaActual.textContent = "Tarjeta actual terminada en: " + ultimos4

        // Ocultar formulario
        formularioPago.style.display = "none"
        btnCambiarPago.textContent = "Cambiar método de pago"
        formularioVisible = false

        alert("Método de pago actualizado correctamente")
    
      } else {
        alert("Error: No se pudo actualizar el método de pago")
      }
    })
  }

  // ✅ Función para cerrar sesión
  function cerrarSesion() {
    localStorage.removeItem("usuarioLogueado")
    window.location.href = "/html/login.html"
  }

  // ✅ Agregar evento al botón cerrar sesión
  const btnCerrarSesion = document.getElementById("btnCerrarSesion")
  if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener("click", (e) => {
      e.preventDefault()
      cerrarSesion()
    })
  }

  // 🆕 NUEVO: Funcionalidad de cancelar suscripción
const btnCancelarSub = document.getElementById("btnCancelarSub")
if (btnCancelarSub) {
  btnCancelarSub.addEventListener("click", (e) => {
    e.preventDefault()
    
    // Confirmación doble
    const confirmar1 = confirm("¿Estás seguro de que deseas cancelar tu suscripción?")
    if (!confirmar1) return
    
    const confirmar2 = confirm("Esta acción eliminará permanentemente tu cuenta. ¿Continuar?")
    if (!confirmar2) return
    
    cancelarSuscripcion()
  })
}

function cancelarSuscripcion() {
 
  if (!usuario) {
    alert("Error: No hay usuario para cancelar")
    return
  }
  
  try {
    // Obtener todos los usuarios
    const todosLosUsuarios = JSON.parse(localStorage.getItem("usuarioRegistrado")) || []
    const emailUsuarioActual = usuario.datosPersonales.email
    
    // Filtrar para eliminar el usuario actual
    const usuariosFiltrados = todosLosUsuarios.filter(u => 
      u.datosPersonales?.email !== emailUsuarioActual
    )
    
    
    // Guardar array sin el usuario cancelado
    localStorage.setItem("usuarioRegistrado", JSON.stringify(usuariosFiltrados))
    
    // Limpiar sesión actual
    localStorage.removeItem("usuarioLogueado")
    
    // Limpiar otros datos relacionados si existen
    localStorage.removeItem("tarjetaSeleccionada")
    localStorage.removeItem("cambioDePlan")
    
    alert("Suscripción cancelada exitosamente. Lamentamos verte partir.")
    
    // Redirigir al login
    window.location.href = "/html/login.html"
    
  } catch (error) {
        alert("Error al cancelar la suscripción. Intenta nuevamente.")
  }
}

//guardar pelis y series favoritas

// 💖 SISTEMA DE FAVORITOS PARA EL PERFIL - ACTUALIZADO

// 🎯 Función para cargar y mostrar favoritos en el perfil
function cargarFavoritosEnPerfil() {
  console.log("=== CARGANDO FAVORITOS EN PERFIL ===")

  // 🔍 Verificar si estamos en la página de perfil
  const contenedorFavoritos = document.querySelector(".favoritos__perfil")
  if (!contenedorFavoritos) {
    console.log("No estamos en la página de perfil")
    return
  }

  // 🔍 Obtener usuario logueado
  const usuarioLogueado = JSON.parse(localStorage.getItem("usuarioLogueado"))
  if (!usuarioLogueado || !usuarioLogueado.email) {
    contenedorFavoritos.innerHTML = `
      <h3>Mis favoritos</h3>
      <div class="favoritos-vacio">
        <p>Debes <a href="/html/login.html">iniciar sesión</a> para ver tus favoritos</p>
      </div>
    `
    return
  }

  // 📚 Obtener favoritos del usuario
  const claveUsuario = `favoritos_${usuarioLogueado.email}`
  const favoritosUsuario = JSON.parse(localStorage.getItem(claveUsuario)) || {
    peliculas: [],
    series: [],
  }

  console.log("Favoritos del usuario:", favoritosUsuario)

  // 🎬 Renderizar favoritos
  renderizarFavoritos(contenedorFavoritos, favoritosUsuario)
}

// 🎨 Función para renderizar los favoritos en el HTML
function renderizarFavoritos(contenedor, favoritos) {
  const totalFavoritos = favoritos.peliculas.length + favoritos.series.length

  // 🎯 HTML base con título
  let htmlFavoritos = `<h3>Mis favoritos (${totalFavoritos})</h3>`

  // 📭 Si no hay favoritos
  if (totalFavoritos === 0) {
    htmlFavoritos += `
      <div class="favoritos-vacio">
        <div class="icono-vacio">💔</div>
        <p>Aún no tienes favoritos</p>
        <p class="texto-secundario">Explora nuestro catálogo y agrega contenido a tus favoritos</p>
        <a href="/index.html" class="btn-explorar">Explorar catálogo</a>
      </div>
    `
    contenedor.innerHTML = htmlFavoritos
    return
  }

  // 🎬 Sección de películas
  if (favoritos.peliculas.length > 0) {
    htmlFavoritos += `
      <div class="seccion-favoritos">
        <h4 class="subtitulo-favoritos">🎬 Películas (${favoritos.peliculas.length})</h4>
        <div class="grid-favoritos">
          ${favoritos.peliculas.map((pelicula) => crearTarjetaFavorito(pelicula, "pelicula")).join("")}
        </div>
      </div>
    `
  }

  // 📺 Sección de series
  if (favoritos.series.length > 0) {
    htmlFavoritos += `
      <div class="seccion-favoritos">
        <h4 class="subtitulo-favoritos">📺 Series (${favoritos.series.length})</h4>
        <div class="grid-favoritos">
          ${favoritos.series.map((serie) => crearTarjetaFavorito(serie, "serie")).join("")}
        </div>
      </div>
    `
  }

  contenedor.innerHTML = htmlFavoritos
}

// 🎨 Función para crear tarjeta individual de favorito
function crearTarjetaFavorito(item, tipo) {
  return `
    <div class="tarjeta-favorito" data-id="${item.id}" data-tipo="${tipo}">
      <div class="imagen-favorito">
        <img src="${item.imagen || "/placeholder.svg?height=200&width=150"}" alt="${item.titulo}" loading="lazy">
        <div class="overlay-favorito">
          <button class="btn-reproducir-favorito" onclick="reproducirFavorito('${item.id}', '${tipo}')">
            ▶ Ver
          </button>
          <button class="btn-quitar-favorito" onclick="quitarFavorito('${item.id}', '${tipo}')" title="Quitar de favoritos">
            ❌
          </button>
        </div>
      </div>
      <div class="info-favorito">
        <h5 class="titulo-favorito">${item.titulo}</h5>
        <p class="año-favorito">${item.año}</p>
        <p class="genero-favorito">${item.genero}</p>
      </div>
    </div>
  `
}

// 🎬 Función para reproducir desde favoritos
function reproducirFavorito(id, tipo) {
  console.log(`Reproduciendo ${tipo}: ${id}`)
  // Redirigir a la página de detalle correspondiente
  if (tipo === "serie") {
    window.location.href = `/html/detalle-serie.html?id=${id}`
  } else {
    window.location.href = `/html/detalle-pelicula.html?id=${id}`
  }
}

// ❌ Función para quitar favorito desde el perfil
function quitarFavorito(id, tipo) {
  console.log(`Quitando ${tipo}: ${id}`)

  // 🔍 Confirmar acción
  if (!confirm("¿Estás seguro de que quieres quitar este contenido de tus favoritos?")) {
    return
  }

  // 🔍 Obtener usuario logueado
  const usuarioLogueado = JSON.parse(localStorage.getItem("usuarioLogueado"))
  if (!usuarioLogueado || !usuarioLogueado.email) {
    alert("Error: No hay usuario logueado")
    return
  }

  // 📚 Obtener y actualizar favoritos
  const claveUsuario = `favoritos_${usuarioLogueado.email}`
  const favoritosUsuario = JSON.parse(localStorage.getItem(claveUsuario)) || {
    peliculas: [],
    series: [],
  }

  const tipoContenido = tipo === "serie" ? "series" : "peliculas"
  const indiceItem = favoritosUsuario[tipoContenido].findIndex((item) => item.id === id)

  if (indiceItem !== -1) {
    const itemEliminado = favoritosUsuario[tipoContenido][indiceItem]
    favoritosUsuario[tipoContenido].splice(indiceItem, 1)

    // 💾 Guardar cambios
    localStorage.setItem(claveUsuario, JSON.stringify(favoritosUsuario))

    // 🔄 Recargar favoritos en la interfaz
    cargarFavoritosEnPerfil()

    // 💬 Mostrar mensaje
    window.mostrarMensajeFavorito(`"${itemEliminado.titulo}" eliminado de favoritos`, "info")

    // 🔄 Actualizar otras interfaces si existen
    if (typeof window.actualizarDespuesDeFavoritos === "function") {
      window.actualizarDespuesDeFavoritos()
    }

    console.log("Favorito eliminado exitosamente")
  } else {
    console.error("No se encontró el favorito para eliminar")
  }
}

// 🔄 Función para actualizar favoritos cuando se modifiquen desde otras páginas
function actualizarFavoritosDesdeOtraPagina() {
  console.log("Actualizando favoritos desde otra página")
  cargarFavoritosEnPerfil()
}

// 🚀 Inicializar cuando se carga la página

  console.log("Sistema de favoritos del perfil cargado")

  // Cargar favoritos si estamos en la página de perfil
  cargarFavoritosEnPerfil()

  // 🔄 Escuchar cambios en localStorage para sincronizar pestañas
  window.addEventListener("storage", (e) => {
    if (e.key && e.key.startsWith("favoritos_")) {
      console.log("Cambio detectado en favoritos desde otra pestaña")
      cargarFavoritosEnPerfil()
    }
  })

  // 🔄 Escuchar evento personalizado para actualizaciones inmediatas
  window.addEventListener("favoritosActualizados", () => {
    console.log("Evento de favoritos actualizados recibido")
    cargarFavoritosEnPerfil()
  })
})

// 🌐 Exportar funciones para uso global
window.cargarFavoritosEnPerfil = cargarFavoritosEnPerfil
window.quitarFavorito = quitarFavorito
window.reproducirFavorito = reproducirFavorito
window.actualizarFavoritosDesdeOtraPagina = actualizarFavoritosDesdeOtraPagina

console.log("favoritos-perfil.js cargado correctamente")




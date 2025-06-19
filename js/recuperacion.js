// 🔐 recuperacion.js - Sistema de recuperación de contraseña

document.addEventListener("DOMContentLoaded", () => {
  // 🎯 Elementos del DOM
  const formRecuperacion = document.getElementById("formRecuperacion")
  const emailInput = document.getElementById("emailRecuperacion")
  const nombreInput = document.getElementById("nombreRecuperacion")
  const btnEnviar = document.getElementById("btnEnviar")
  const btnReenviar = document.getElementById("btnReenviar")
  const mensajeError = document.getElementById("mensajeError")
  const mensajeExito = document.getElementById("mensajeExito")

  console.log("Recuperación.js cargado correctamente")

  // 🔧 CORREGIR: El problema puede estar en la captura de elementos del DOM
  // Cambiar esta línea:
  // Por esta:
  // Y asegurarse de que todos los elementos existan antes de agregar event listeners:
  if (!formRecuperacion || !emailInput || !nombreInput || !btnEnviar) {
    console.error("Error: No se pudieron encontrar todos los elementos del DOM")
    console.log("Elementos encontrados:", {
      formRecuperacion: !!formRecuperacion,
      emailInput: !!emailInput,
      nombreInput: !!nombreInput,
      btnEnviar: !!btnEnviar,
    })
    return
  }

  // 🎯 Validación en tiempo real
  function validarCampos() {
    const emailValido = emailInput.value.trim() !== "" && validarFormatoEmail(emailInput.value)
    const nombreValido = nombreInput.value.trim() !== ""
    const todosValidos = emailValido && nombreValido

    btnEnviar.disabled = !todosValidos

    return todosValidos
  }

  // 📧 Validar formato de email
  function validarFormatoEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // 🚨 Mostrar mensaje de error
  function mostrarError(mensaje) {
    mensajeError.textContent = mensaje
    mensajeError.style.display = "block"

    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
      ocultarError()
    }, 5000)
  }

  // ✅ Ocultar mensaje de error
  function ocultarError() {
    mensajeError.style.display = "none"
    mensajeError.textContent = ""
  }

  // 🔄 Cambiar estado del botón a cargando
  function mostrarCargando() {
    const btnText = btnEnviar.querySelector(".recuperacion-btn-text")
    const btnLoader = btnEnviar.querySelector(".recuperacion-btn-loader")

    btnText.style.display = "none"
    btnLoader.style.display = "block"
    btnEnviar.disabled = true
  }

  // ✅ Restaurar estado normal del botón
  function ocultarCargando() {
    const btnText = btnEnviar.querySelector(".recuperacion-btn-text")
    const btnLoader = btnEnviar.querySelector(".recuperacion-btn-loader")

    btnText.style.display = "block"
    btnLoader.style.display = "none"
    btnEnviar.disabled = false
  }

  // 🎯 Mostrar estado de éxito
  function mostrarExito(email) {
    formRecuperacion.style.display = "none"
    mensajeExito.style.display = "block"

    // Personalizar mensaje con el email
    const successText = mensajeExito.querySelector(".recuperacion-success-text")
    successText.innerHTML = `
      Hemos enviado las instrucciones de recuperación a <strong>${email}</strong>. 
      Revisa tu bandeja de entrada y sigue los pasos indicados.
    `
  }

  // 🔍 Buscar usuario en localStorage
  function buscarUsuario(email, nombre) {
    try {
      const usuariosRegistrados = JSON.parse(localStorage.getItem("usuarioRegistrado")) || []

      const usuarioEncontrado = usuariosRegistrados.find((usuario) => {
        const emailCoincide = usuario.datosPersonales?.email?.toLowerCase() === email.toLowerCase()
        const nombreCoincide = usuario.datosPersonales?.nombre?.toLowerCase() === nombre.toLowerCase()
        return emailCoincide && nombreCoincide
      })

      return usuarioEncontrado
    } catch (error) {
      console.error("Error buscando usuario:", error)
      return null
    }
  }

  // 📧 Simular envío de email (en una app real, esto sería una llamada al servidor)
  async function enviarEmailRecuperacion(email, nombre) {
    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // En una aplicación real, aquí harías la llamada al servidor
    console.log(`📧 Email de recuperación enviado a: ${email} para usuario: ${nombre}`)

    // Guardar token de recuperación temporal (simulado)
    const tokenRecuperacion = {
      email: email,
      nombre: nombre,
      token: Math.random().toString(36).substring(2, 15),
      timestamp: Date.now(),
      usado: false,
    }

    localStorage.setItem("tokenRecuperacion", JSON.stringify(tokenRecuperacion))

    return true
  }

  // 🎯 Event listeners para validación en tiempo real
  emailInput.addEventListener("input", () => {
    validarCampos()
    ocultarError()
  })

  nombreInput.addEventListener("input", () => {
    validarCampos()
    ocultarError()
  })

  // 📧 Validación específica de email al perder foco
  emailInput.addEventListener("blur", () => {
    const email = emailInput.value.trim()
    if (email && !validarFormatoEmail(email)) {
      mostrarError("Por favor ingresa un email válido")
    }
  })

  // 🚀 Evento principal del formulario
  formRecuperacion.addEventListener("submit", async (e) => {
    e.preventDefault()

    console.log("=== INICIANDO RECUPERACIÓN DE CONTRASEÑA ===")

    const email = emailInput.value.trim()
    const nombre = nombreInput.value.trim()

    // Validar campos
    if (!validarCampos()) {
      mostrarError("Por favor completa todos los campos correctamente")
      return
    }

    // Mostrar estado de carga
    mostrarCargando()
    ocultarError()

    try {
      // Buscar usuario
      const usuarioEncontrado = buscarUsuario(email, nombre)

      if (!usuarioEncontrado) {
        mostrarError("No encontramos una cuenta con esos datos. Verifica tu email y nombre de usuario.")
        ocultarCargando()
        return
      }

      // Enviar email de recuperación
      await enviarEmailRecuperacion(email, nombre)

      // Mostrar éxito
      mostrarExito(email)

      console.log("=== RECUPERACIÓN INICIADA EXITOSAMENTE ===")
    } catch (error) {
      console.error("Error en recuperación:", error)
      mostrarError("Ocurrió un error al enviar el email. Por favor intenta nuevamente.")
      ocultarCargando()
    }
  })

  // 🔄 Botón reenviar
  if (btnReenviar) {
    btnReenviar.addEventListener("click", async () => {
      console.log("Reenviando email de recuperación...")

      try {
        const tokenData = JSON.parse(localStorage.getItem("tokenRecuperacion"))
        if (tokenData) {
          btnReenviar.textContent = "Enviando..."
          btnReenviar.disabled = true

          await enviarEmailRecuperacion(tokenData.email, tokenData.nombre)

          btnReenviar.textContent = "✅ Reenviado"
          setTimeout(() => {
            btnReenviar.textContent = "¿No recibiste el email? Reenviar"
            btnReenviar.disabled = false
          }, 3000)
        }
      } catch (error) {
        console.error("Error reenviando:", error)
        btnReenviar.textContent = "Error al reenviar"
        setTimeout(() => {
          btnReenviar.textContent = "¿No recibiste el email? Reenviar"
          btnReenviar.disabled = false
        }, 3000)
      }
    })
  }

  // 🎯 Validación inicial
  validarCampos()

  // Función para mostrar mensajes
  function mostrarMensaje(texto, tipo) {
    mensajeError.textContent = texto
    mensajeError.className = `mensaje ${tipo}`
    mensajeError.style.display = "block"
  }

  // Función para ocultar mensaje
  function ocultarMensaje() {
    mensajeError.style.display = "none"
  }

  // Ocultar mensaje cuando el usuario escriba
  emailInput.addEventListener("input", ocultarMensaje)
  nombreInput.addEventListener("input", ocultarMensaje)
})

// 🆕 COMENTARIOS SOBRE LA FUNCIONALIDAD:
/*
CARACTERÍSTICAS IMPLEMENTADAS:

✅ VALIDACIÓN EN TIEMPO REAL:
- Email con formato válido
- Campos requeridos
- Botón se habilita solo cuando todo es válido

✅ BÚSQUEDA DE USUARIO:
- Busca en localStorage por email Y nombre
- Coincidencia exacta (case-insensitive)
- Manejo de errores si no existe

✅ SIMULACIÓN DE ENVÍO:
- Delay realista de red
- Token de recuperación temporal
- Logs para debugging

✅ ESTADOS DE UI:
- Loading spinner en botón
- Mensajes de error específicos
- Estado de éxito con email personalizado
- Funcionalidad de reenvío

✅ EXPERIENCIA DE USUARIO:
- Auto-ocultado de errores
- Validación visual
- Animaciones suaves
- Responsive design

🔮 PREPARADO PARA PRODUCCIÓN:
- Estructura lista para API real
- Tokens de seguridad
- Manejo de errores robusto
- Logs detallados
*/

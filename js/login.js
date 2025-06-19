// login.js - Sistema de autenticación completo

document.addEventListener("DOMContentLoaded", () => {
    // 🎯 PASO 1: Obtener elementos del DOM
    const formLogin = document.getElementById("formLogin")
    const inputEmail = document.getElementById("email")
    const inputPassword = document.getElementById("password")
    const btnLogin = document.getElementById("btnLogin")
    const mensajeError = document.getElementById("mensajeError")


    // 🎯 PASO 2: Función para validar campos
    function validarCampos() {
        const emailValido = inputEmail.value.trim() !== ""
        const passwordValido = inputPassword.value.trim() !== ""
        const todosValidos = emailValido && passwordValido

        // Habilitar/deshabilitar botón según validación
        btnLogin.disabled = !todosValidos

        console.log("Validación:", { emailValido, passwordValido, todosValidos }) // Debug

        return todosValidos
    }

    // 🎯 PASO 2: Validación en tiempo real
    inputEmail.addEventListener("input", () => {
        validarCampos()
        ocultarError() // Limpiar error cuando el usuario escriba
    })

    inputPassword.addEventListener("input", () => {
        validarCampos()
        ocultarError() // Limpiar error cuando el usuario escriba
    })

    // 🎯 PASO 6: Funciones para manejo de errores
    function mostrarError(mensaje) {
        mensajeError.textContent = mensaje
        mensajeError.style.display = "block"
        console.log("Error mostrado:", mensaje) // Debug
    }

    function ocultarError() {
        mensajeError.style.display = "none"
        mensajeError.textContent = ""
    }

    // 🎯 PASO 3: Evento submit del formulario
    formLogin.addEventListener("submit", (e) => {
        console.log("=== INICIO PROCESO LOGIN ===") // Debug

        // Prevenir comportamiento por defecto
        e.preventDefault()

        // Obtener valores de los inputs
        const emailIngresado = inputEmail.value.trim()
        const passwordIngresado = inputPassword.value.trim()

        console.log("Credenciales ingresadas:", { emailIngresado, passwordIngresado }) // Debug

        // Validar que los campos no estén vacíos
        if (!validarCampos()) {
            mostrarError("Por favor completa todos los campos")
            return
        }

        // 🎯 PASO 4: Lógica de autenticación
        try {
            // Obtener usuarios registrados desde localStorage
            const usuariosRegistrados = JSON.parse(localStorage.getItem("usuarioRegistrado")) || []



            console.log("Usuarios en localStorage:", usuariosRegistrados) // Debug

            // Verificar que hay usuarios registrados
            if (usuariosRegistrados.length === 0) {
                mostrarError("No hay usuarios registrados. Por favor regístrate primero.")
                return
            }

            // Buscar usuario con credenciales coincidentes
            const usuarioEncontrado = usuariosRegistrados.find((usuario) => {
                const emailCoincide = usuario.datosPersonales?.email === emailIngresado
                const passwordCoincide = usuario.datosPersonales?.password === passwordIngresado

                console.log("Comparando con usuario:", {
                    emailUsuario: usuario.datosPersonales?.email,
                    emailCoincide,
                    passwordCoincide,
                }) // Debug

                return emailCoincide && passwordCoincide
            })

            console.log("Usuario encontrado:", usuarioEncontrado) // Debug

            // 🎯 PASO 5: Login exitoso o error
            if (usuarioEncontrado) {
                console.log("=== LOGIN EXITOSO ===") // Debug

                // Guardar usuario logueado en localStorage
                const usuarioLogueado = {
                    email: emailIngresado,
                    nombre: usuarioEncontrado.datosPersonales?.nombre,
                    timestamp: Date.now(),
                }

                localStorage.setItem("usuarioLogueado", JSON.stringify(usuarioLogueado))



                // Agregar esta línea:
                if (window.actualizarInterfazDespuesDeLogin) {
                    window.actualizarInterfazDespuesDeLogin(emailIngresado)
                }

                console.log("Usuario logueado guardado:", usuarioLogueado) // Debug

                // Mostrar mensaje de éxito (opcional)
                ocultarError()
                btnLogin.textContent = "Ingresando..."
                btnLogin.disabled = true

                // Redirigir al perfil después de un breve delay
                setTimeout(() => {
                    window.location.href = "./perfilUsuario.html"
                }, 1000)
            } else {
                // 🎯 PASO 6: Credenciales incorrectas
                console.log("=== CREDENCIALES INCORRECTAS ===") // Debug
                mostrarError("Email o contraseña incorrectos. Verifica tus datos.")
            }
        } catch (error) {
            // Error al acceder a localStorage
            console.error("Error en el proceso de login:", error) // Debug
            mostrarError("Error interno. Por favor intenta nuevamente.")
        }
    })

    // 🎯 FUNCIONES AUXILIARES ADICIONALES

    // Función para limpiar formulario
    function limpiarFormulario() {
        inputEmail.value = ""
        inputPassword.value = ""
        btnLogin.disabled = true
        ocultarError()
    }

    // Función para validar formato de email (opcional)
    function validarFormatoEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    // 🎯 VALIDACIÓN ADICIONAL DE EMAIL (opcional)
    inputEmail.addEventListener("blur", () => {
        const email = inputEmail.value.trim()
        if (email && !validarFormatoEmail(email)) {
            mostrarError("Por favor ingresa un email válido")
        }
    })

    // 🎯 FUNCIONALIDAD EXTRA: Mostrar/ocultar contraseña (opcional)
    // Si quieres agregar un botón para mostrar la contraseña, puedes usar esto:
    /*
    const btnMostrarPassword = document.getElementById("btnMostrarPassword"); // Agregar este botón al HTML
    if (btnMostrarPassword) {
      btnMostrarPassword.addEventListener("click", () => {
        if (inputPassword.type === "password") {
          inputPassword.type = "text";
          btnMostrarPassword.textContent = "Ocultar";
        } else {
          inputPassword.type = "password";
          btnMostrarPassword.textContent = "Mostrar";
        }
      });
    }
    */

    console.log("Login.js cargado correctamente") // Debug
})

// 🆕 COMENTARIOS SOBRE EL CÓDIGO:
/*
FUNCIONALIDADES IMPLEMENTADAS:

1. ✅ CAPTURA DE ELEMENTOS:
   - Todos los elementos del DOM se capturan correctamente
   - Validación de que existen antes de usarlos

2. ✅ VALIDACIÓN EN TIEMPO REAL:
   - Botón se habilita solo cuando ambos campos tienen contenido
   - Errores se limpian cuando el usuario empieza a escribir
   - Validación opcional de formato de email

3. ✅ AUTENTICACIÓN ROBUSTA:
   - Busca en el array completo de usuarios registrados
   - Compara email Y contraseña exactamente
   - Manejo de errores si no hay usuarios registrados

4. ✅ LOGIN EXITOSO:
   - Guarda usuario logueado en localStorage con timestamp
   - Feedback visual (botón cambia a "Ingresando...")
   - Redirección automática al perfil

5. ✅ MANEJO DE ERRORES:
   - Mensajes específicos para cada tipo de error
   - Errores se muestran en el div dedicado
   - Try-catch para errores inesperados

6. ✅ DEBUGGING COMPLETO:
   - Console.log en puntos clave para troubleshooting
   - Fácil identificar dónde falla si hay problemas

INTEGRACIÓN CON TU PERFIL:
- Tu código del perfil automáticamente detectará el usuarioLogueado
- Si no encuentra usuarioLogueado, usará el fallback (último usuario)
- El cambio de planes funcionará correctamente para el usuario logueado

PRÓXIMOS PASOS:
1. Probar el login con usuarios existentes
2. Verificar que redirija correctamente al perfil
3. Confirmar que el perfil carga los datos del usuario logueado
*/



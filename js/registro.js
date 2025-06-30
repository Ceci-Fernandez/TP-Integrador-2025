document.addEventListener("DOMContentLoaded", () => {
   
    let paymentMethodSelected = null;
    let paymentConfirmed = false;
    const form = document.getElementById("registro-form");
    const registroBtn = document.getElementById("registro-btn");
    const confirmPaymentBtn = document.getElementById("confirm-payment-btn");

 
    const planes = [
        {
            value: "basico",
            nombre: "Básico",
            precio: "$3.000",
            dispositivos: "1 dispositivo",
            calidad: "HD"
        },
        {
            value: "estandar",
            nombre: "Estándar",
            precio: "$5.000",
            dispositivos: "2 dispositivos",
            calidad: "Full HD"
        },
        {
            value: "premium",
            nombre: "Premium",
            precio: "$7.000",
            dispositivos: "4 dispositivos",
            calidad: "4K Ultra HD"
        }
    ];

    
    const planesContainer = document.getElementById("planes-container");
    planes.forEach(plan => {
        const planElement = document.createElement("label");
        planElement.className = "registro__plan";
        if (plan.value === "premium") planElement.classList.add("plan-premium");
        
        planElement.innerHTML = `
            <input type="radio" name="plan" value="${plan.value}" required>
            <span class="registro__plan-label">
                <strong>${plan.nombre}</strong><br>
                ${plan.precio}/mes<br>
                ${plan.dispositivos}<br>
                ${plan.calidad}
            </span>
        `;
        planesContainer.appendChild(planElement);
    });

    const tarjetas = [
        { value: "naranja", name: "Tarjeta Naranja", image: "../img/img-tarjetas/naranja.png" },
        { value: "mastercard", name: "Mastercard", image: "../img/img-tarjetas/mastercard.png" },
        { value: "visa", name: "Visa", image: "../img/img-tarjetas/visa.png" },
        { value: "cabal", name: "Cabal", image: "../img/img-tarjetas/cabal.png" }
    ];

    
    const tarjetasContainer = document.getElementById("tarjetas-container");
    tarjetas.forEach(tarjeta => {
        const tarjetaElement = document.createElement("label");
        tarjetaElement.className = "registro__tarjeta";
        tarjetaElement.innerHTML = `
            <input type="radio" name="tarjeta" value="${tarjeta.value}">
            <img src="${tarjeta.image}" alt="${tarjeta.name}">
        `;
        tarjetasContainer.appendChild(tarjetaElement);
    });

    
    const inputs = {
        nombre: document.getElementById("nombre"),
        apellido: document.getElementById("apellido"),
        email: document.getElementById("email"),
        usuario: document.getElementById("usuario"),
        password: document.getElementById("password"),
        confirmarPassword: document.getElementById("confirmarPassword"),
        numeroTarjeta: document.getElementById("numeroTarjeta"),
        cvv: document.getElementById("cvv"),
        nombreTarjeta: document.getElementById("nombreTarjeta"),
        vencimiento: document.getElementById("vencimiento")
    };

    const errors = {
        nombre: document.getElementById("nombre-error"),
        apellido: document.getElementById("apellido-error"),
        email: document.getElementById("email-error"),
        usuario: document.getElementById("usuario-error"),
        password: document.getElementById("password-error"),
        confirmar: document.getElementById("confirmar-error"),
        tarjeta: document.getElementById("tarjeta-error"),
        cvv: document.getElementById("cvv-error")
    };

  
    function validateName(name) {
        return /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(name);
    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function validateUser(user) {
        return /^[a-zA-Z0-9]+$/.test(user);
    }

    function validatePassword(password) {
        const hasLetters = (password.match(/[a-zA-Z]/g) || []).length >= 2;
        const hasNumbers = (password.match(/[0-9]/g) || []).length >= 2;
        const hasSpecialChars = (password.match(/[^a-zA-Z0-9]/g) || []).length >= 2;
        return password.length >= 8 && hasLetters && hasNumbers && hasSpecialChars;
    }

    function validateCard(cardNumber) {
        if (!/^\d{16}$/.test(cardNumber)) return false;

        const digits = cardNumber.split("").map(Number);
        const lastDigit = digits[15];
        const sumWithoutLast = digits.slice(0, 15).reduce((sum, digit) => sum + digit, 0);

        return (sumWithoutLast % 2 === 0 && lastDigit % 2 === 1) || (sumWithoutLast % 2 === 1 && lastDigit % 2 === 0);
    }

    function validateCVV(cvv) {
        return /^\d{3}$/.test(cvv) && cvv !== "000";
    }

    function validateExpiryDate(date) {
        if (!date) return false;
        const today = new Date();
        const expiryDate = new Date(date);
        return expiryDate > today;
    }

    function showError(field, message) {
        errors[field].textContent = message;
        errors[field].classList.remove("hidden");
    }

    function hideError(field) {
        errors[field].classList.add("hidden");
    }


    function toggleCardFields(show) {
        const cardFields = ['numeroTarjeta', 'vencimiento', 'cvv', 'nombreTarjeta'];
        cardFields.forEach(field => {
            const input = document.getElementById(field);
            input.required = show;
            input.disabled = !show;
            if (!show) input.value = '';
        });
    }

  
    function generateAlternativePayments() {
        const container = document.getElementById("alternative-payments");
        container.innerHTML = "<h4>Otros métodos de pago</h4>";

        const metodosAlternativos = [
            {
                type: "transferencia",
                name: "Transferencia Bancaria",
                data: {
                    cbu: "0170329940000012345678",
                    alias: "CILA.MOVIES.PAGO",
                    titular: "CILA MOVIES S.A.",
                    cuit: "30-12345678-9",
                    banco: "Banco Nación"
                }
            },
            {
                type: "cupon",
                name: "Cupón de Pago",
                options: [
                    { value: "pagofacil", name: "Pago Fácil", image: "../img/img-tarjetas/pagofacil.png" },
                    { value: "rapipago", name: "Rapipago", image: "../img/img-tarjetas/rapipago.png" }
                ]
            }
        ];

        metodosAlternativos.forEach((method) => {
            const methodDiv = document.createElement("div");
            methodDiv.className = "metodo-pago";

            if (method.type === "transferencia") {
                methodDiv.innerHTML = `
                    <label class="registro__metodo-pago">
                        <input type="radio" name="payment-method" value="transferencia" 
                               onchange="toggleCardFields(false)">
                        <span>${method.name}</span>
                    </label>
                    <div class="transferencia-info" id="transfer-info" style="display: none;">
                        <p><strong>CBU:</strong> ${method.data.cbu}</p>
                        <p><strong>Alias:</strong> ${method.data.alias}</p>
                        <p><strong>Titular:</strong> ${method.data.titular}</p>
                        <p><strong>CUIT:</strong> ${method.data.cuit}</p>
                        <p><strong>Banco:</strong> ${method.data.banco}</p>
                        <p><strong>Estado:</strong> <span id="transfer-status">Pendiente</span></p>
                    </div>
                `;
            } else if (method.type === "cupon") {
                let optionsHTML = "";
                method.options.forEach((option) => {
                    optionsHTML += `
                        <label class="registro__metodo-pago">
                            <input type="radio" name="coupon-type" value="${option.value}" 
                                   onchange="generateCoupon('${option.value}')">
                            <img src="${option.image}" alt="${option.name}" style="width: 60px; height: 30px;">
                            <span>${option.name}</span>
                        </label>
                    `;
                });

                methodDiv.innerHTML = `
                    <label class="registro__metodo-pago">
                        <input type="radio" name="payment-method" value="cupon" 
                               onchange="toggleCardFields(false)">
                        <span>${method.name}</span>
                    </label>
                    <div class="cupon-options" id="coupon-options" style="display: none;">
                        <h5>Selecciona dónde pagar:</h5>
                        ${optionsHTML}
                        <div class="cupon-info" id="coupon-info" style="display: none;">
                            <p><strong>Código de pago:</strong> <span id="coupon-code"></span></p>
                            <p><strong>Lugar de pago:</strong> <span id="coupon-place"></span></p>
                            <p><strong>Monto:</strong> $7.000,00</p>
                            <p><strong>Vencimiento:</strong> <span id="coupon-expiry"></span></p>
                            <p><strong>Estado:</strong> <span id="coupon-status">Pendiente</span></p>
                        </div>
                    </div>
                `;
            }

            container.appendChild(methodDiv);
        });

     
        document.querySelectorAll('input[name="payment-method"]').forEach(input => {
            input.addEventListener('change', function() {
                paymentMethodSelected = this.value;
                paymentConfirmed = false;
                confirmPaymentBtn.style.display = "block";
                registroBtn.disabled = true;

                if (this.value === "transferencia") {
                    document.getElementById("transfer-info").style.display = "block";
                    document.getElementById("coupon-options").style.display = "none";
                    document.getElementById("coupon-info").style.display = "none";
                    document.getElementById("card-data-section").style.display = "none";
+                    document.querySelectorAll('input[name="tarjeta"]').forEach(t => t.checked = false);
                } else if (this.value === "cupon") {
                    document.getElementById("coupon-options").style.display = "block";
                    document.getElementById("coupon-info").style.display = "block";
                    document.getElementById("transfer-info").style.display = "none";
                    document.getElementById("card-data-section").style.display = "none";
                    document.querySelectorAll('input[name="tarjeta"]').forEach(t => t.checked = false);
                    const firstOption = document.querySelector('input[name="coupon-type"]');
                    if (firstOption) {
                        firstOption.checked = true;
                        generateCoupon(firstOption.value);
                    }
                }
            });
        });

        document.querySelectorAll('input[name="tarjeta"]').forEach(input => {
            input.addEventListener('change', function() {
                paymentMethodSelected = "tarjeta";
                paymentConfirmed = true; // Con tarjeta no necesita confirmación aparte
                confirmPaymentBtn.style.display = "none";
                document.getElementById("card-data-section").style.display = "block";
                document.getElementById("transfer-info").style.display = "none";
                document.getElementById("coupon-options").style.display = "none";
                document.getElementById("coupon-info").style.display = "none";
                document.querySelectorAll('input[name="payment-method"]').forEach(radio => {
                    radio.checked = false;
                });
                toggleCardFields(true);
                validateForm();
            });
        });

        document.querySelectorAll('input[name="coupon-type"]').forEach(input => {
            input.addEventListener('change', function() {
                generateCoupon(this.value);
            });
        });
    }

    function generateCoupon(type) {
        const couponCode = "CP-" + Math.floor(Math.random() * 1000000);
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 7);
        
        document.getElementById("coupon-code").textContent = couponCode;
        document.getElementById("coupon-place").textContent = type === "pagofacil" ? "Pago Fácil" : "Rapipago";
        document.getElementById("coupon-expiry").textContent = expiryDate.toLocaleDateString();
        document.getElementById("coupon-info").style.display = "block";
        document.getElementById("coupon-status").textContent = "Pendiente";
    }

    function validateForm() {
        let isValid = true;

        if (!inputs.nombre.value || !validateName(inputs.nombre.value)) {
            showError("nombre", "El nombre solo puede contener letras");
            isValid = false;
        } else {
            hideError("nombre");
        }

        if (!inputs.apellido.value || !validateName(inputs.apellido.value)) {
            showError("apellido", "El apellido solo puede contener letras");
            isValid = false;
        } else {
            hideError("apellido");
        }

        if (!inputs.email.value || !validateEmail(inputs.email.value)) {
            showError("email", "Email inválido");
            isValid = false;
        } else {
            hideError("email");
        }

        if (!inputs.usuario.value || !validateUser(inputs.usuario.value)) {
            showError("usuario", "El usuario solo puede contener letras y números");
            isValid = false;
        } else {
            hideError("usuario");
        }

        if (!inputs.password.value || !validatePassword(inputs.password.value)) {
            showError("password", "La contraseña debe tener mínimo 8 caracteres, 2 letras, 2 números y 2 caracteres especiales");
            isValid = false;
        } else {
            hideError("password");
        }

        if (!inputs.confirmarPassword.value || inputs.password.value !== inputs.confirmarPassword.value) {
            showError("confirmar", "Las contraseñas no coinciden");
            isValid = false;
        } else {
            hideError("confirmar");
        }

        if (!document.querySelector('input[name="plan"]:checked')) {
            isValid = false;
        }

        if (paymentMethodSelected === "tarjeta") {
            if (!inputs.numeroTarjeta.value || !validateCard(inputs.numeroTarjeta.value)) {
                showError("tarjeta", "Número de tarjeta inválido");
                isValid = false;
            } else {
                hideError("tarjeta");
            }

            if (!inputs.cvv.value || !validateCVV(inputs.cvv.value)) {
                showError("cvv", "CVV inválido (3 dígitos distintos de 000)");
                isValid = false;
            } else {
                hideError("cvv");
            }

            if (!inputs.vencimiento.value || !validateExpiryDate(inputs.vencimiento.value)) {
                showError("tarjeta", "La tarjeta está vencida");
                isValid = false;
            }
        } 
        else if (paymentMethodSelected === "transferencia" || paymentMethodSelected === "cupon") {
            if (!paymentConfirmed) {
                isValid = false;
            }
        } 
        else {
            isValid = false;
        }

        registroBtn.disabled = !(
            isValid && 
            paymentMethodSelected && 
            (paymentMethodSelected === "tarjeta" || paymentConfirmed)
        );

        return isValid;
    }

 
    confirmPaymentBtn.addEventListener("click", function() {
        if (paymentMethodSelected === "transferencia") {
            document.getElementById("transfer-status").textContent = "Pagado";
            paymentConfirmed = true;
            alert("¡Pago por transferencia confirmado!");
        } else if (paymentMethodSelected === "cupon") {
            document.getElementById("coupon-status").textContent = "Pagado";
            paymentConfirmed = true;
            alert("¡Pago por cupón confirmado!");
        }
        
        registroBtn.disabled = false;
        this.style.display = "none";
    });

    Object.values(inputs).forEach((input) => {
        input.addEventListener("input", validateForm);
    });

    document.querySelectorAll('input[name="plan"]').forEach((radio) => {
        radio.addEventListener("change", validateForm);
    });

   
    generateAlternativePayments();


    form.addEventListener("submit", (e) => {
        e.preventDefault();

        if (registroBtn.disabled) return;

        const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
        if (users.some((user) => user.email === inputs.email.value)) {
            showError("email", "Este email ya está registrado");
            return;
        }

        const newUser = {
            nombre: inputs.nombre.value,
            apellido: inputs.apellido.value,
            email: inputs.email.value,
            usuario: inputs.usuario.value,
            password: inputs.password.value,
            plan: document.querySelector('input[name="plan"]:checked').value,
            paymentMethod: paymentMethodSelected === "tarjeta" ? {
                type: "tarjeta",
                cardType: document.querySelector('input[name="tarjeta"]:checked').value,
                numero: inputs.numeroTarjeta.value,
                vencimiento: inputs.vencimiento.value,
                cvv: inputs.cvv.value,
                nombre: inputs.nombreTarjeta.value,
                status: "Pagado"
            } : paymentMethodSelected === "transferencia" ? {
                type: "transferencia",
                status: "Pagado",
                cbu: "0170329940000012345678",
                alias: "CILA.MOVIES.PAGO"
            } : {
                type: "cupon",
                couponType: document.querySelector('input[name="coupon-type"]:checked').value,
                status: "Pagado",
                couponCode: document.getElementById("coupon-code").textContent
            },
            fechaRegistro: new Date().toISOString(),
        };

        users.push(newUser);
        localStorage.setItem("registeredUsers", JSON.stringify(users));

        alert("Registro exitoso! Ahora podés iniciar sesión.");
        window.location.href = "login.html";
    });
});
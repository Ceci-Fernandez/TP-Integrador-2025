const avatars = {
    avatar1: '../img/avatars/avatar1.jpg',
    avatar2: '../img/avatars/avatar2.jpg',
    avatar3: '../img/avatars/avatar3.jpg',
    avatar4: '../img/avatars/avatar4.jpg'
};

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

let currentUser = null;

document.addEventListener("DOMContentLoaded", () => {
    const user = localStorage.getItem("currentUser");
    if (!user) {
        window.location.href = "login.html";
        return;
    }

    currentUser = JSON.parse(user);
    generatePlans();
    generateDynamicCards();
    generateAlternativePayments();
    loadUserData();
    loadFavorites();
    setupEventListeners();

    document.getElementById("numeroTarjeta").addEventListener("input", validateCardFields);
    document.getElementById("cvv").addEventListener("input", validateCardFields);
    document.getElementById("vencimiento").addEventListener("change", validateCardFields);
});

function generatePlans() {
    const container = document.getElementById("planes-container");
    container.innerHTML = "";

    planes.forEach(plan => {
        const planElement = document.createElement("label");
        planElement.className = "registro__plan";
        if (plan.value === "premium") planElement.classList.add("plan-premium");
        
        planElement.innerHTML = `
            <input type="radio" name="plan" value="${plan.value}" 
                   ${currentUser.plan === plan.value ? 'checked' : ''}>
            <span class="registro__plan-label">
                <strong>${plan.nombre}</strong><br>
                ${plan.precio}/mes<br>
                ${plan.dispositivos}<br>
                ${plan.calidad}
            </span>
        `;
        container.appendChild(planElement);
    });
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

function validateCardFields() {
    const numeroTarjeta = document.getElementById("numeroTarjeta").value;
    const cvv = document.getElementById("cvv").value;
    const vencimiento = document.getElementById("vencimiento").value;
    const tarjetaError = document.getElementById("tarjeta-error");
    const cvvError = document.getElementById("cvv-error");

    if (numeroTarjeta && !validateCard(numeroTarjeta)) {
        tarjetaError.textContent = "Número de tarjeta inválido";
        tarjetaError.classList.remove("hidden");
    } else {
        tarjetaError.classList.add("hidden");
    }

    if (cvv && !validateCVV(cvv)) {
        cvvError.textContent = "CVV inválido (3 dígitos distintos de 000)";
        cvvError.classList.remove("hidden");
    } else {
        cvvError.classList.add("hidden");
    }

    if (vencimiento && !validateExpiryDate(vencimiento)) {
        tarjetaError.textContent = "La tarjeta está vencida";
        tarjetaError.classList.remove("hidden");
    } else if (!numeroTarjeta) {
        tarjetaError.classList.add("hidden");
    }
}

function generateDynamicCards() {
    const cardsContainer = document.getElementById("dynamic-cards");
    cardsContainer.innerHTML = "";

    const tarjetas = [
        { value: "naranja", name: "Tarjeta Naranja", image: "../img/img-tarjetas/naranja.png" },
        { value: "mastercard", name: "Mastercard", image: "../img/img-tarjetas/mastercard.png" },
        { value: "visa", name: "Visa", image: "../img/img-tarjetas/visa.png" },
        { value: "cabal", name: "Cabal", image: "../img/img-tarjetas/cabal.png" }
    ];

    tarjetas.forEach((card) => {
        const cardElement = document.createElement("label");
        cardElement.className = "registro__tarjeta";
        const isCurrentCard = currentUser.paymentMethod?.cardType === card.value;
        cardElement.innerHTML = `
            <input type="radio" name="tarjeta" value="${card.value}" 
                   ${isCurrentCard ? 'checked' : ''} 
                   onchange="showCardDataSection()">
            <img src="${card.image}" alt="${card.name}">
        `;
        cardsContainer.appendChild(cardElement);
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
            const isCurrent = currentUser.paymentMethod?.type === "transferencia";
            const transferStatus = isCurrent ? (currentUser.paymentMethod?.status || "Pendiente") : "Pendiente";

            methodDiv.innerHTML = `
                <label class="registro__metodo-pago">
                    <input type="radio" name="payment-method" value="transferencia" 
                           ${isCurrent ? 'checked' : ''}
                           onchange="showTransferData(); toggleCardFields(false);">
                    <span>${method.name}</span>
                </label>
                <div class="transferencia-info" id="transfer-info" style="display: ${isCurrent ? 'block' : 'none'};">
                    <p><strong>CBU:</strong> ${method.data.cbu}</p>
                    <p><strong>Alias:</strong> ${method.data.alias}</p>
                    <p><strong>Titular:</strong> ${method.data.titular}</p>
                    <p><strong>CUIT:</strong> ${method.data.cuit}</p>
                    <p><strong>Banco:</strong> ${method.data.banco}</p>
                    <p><strong>Estado:</strong> <span id="transfer-status">${transferStatus}</span></p>
                    ${transferStatus === "Pendiente" ? '<button type="button" class="btn" id="confirm-transfer" onclick="confirmTransferPayment()">Ya realicé el pago</button>' : ''}
                </div>
            `;
        } else if (method.type === "cupon") {
            const isCurrent = currentUser.paymentMethod?.type === "cupon";
            let optionsHTML = "";
            method.options.forEach((option) => {
                const isCurrentOption = currentUser.paymentMethod?.couponType === option.value;
                optionsHTML += `
                    <label class="registro__metodo-pago">
                        <input type="radio" name="coupon-type" value="${option.value}" 
                               ${isCurrentOption ? 'checked' : ''}
                               onchange="generateCoupon('${option.value}')">
                        <img src="${option.image}" alt="${option.name}" style="width: 60px; height: 30px;">
                        <span>${option.name}</span>
                    </label>
                `;
            });

            const couponStatus = isCurrent ? (currentUser.paymentMethod?.status || "Pendiente") : "Pendiente";
            
            methodDiv.innerHTML = `
                <label class="registro__metodo-pago">
                    <input type="radio" name="payment-method" value="cupon" 
                           ${isCurrent ? 'checked' : ''}
                           onchange="showCouponOptions(); toggleCardFields(false);">
                    <span>${method.name}</span>
                </label>
                <div class="cupon-options" id="coupon-options" style="display: ${isCurrent ? 'block' : 'none'};">
                    <h5>Selecciona dónde pagar:</h5>
                    ${optionsHTML}
                    <div class="cupon-info" id="coupon-info" style="display: ${isCurrent ? 'block' : 'none'};">
                        <p><strong>Código de pago:</strong> <span id="coupon-code">${isCurrent ? (currentUser.paymentMethod?.couponCode || 'CP-' + Math.floor(Math.random() * 1000000)) : ''}</span></p>
                        <p><strong>Lugar de pago:</strong> <span id="coupon-place">${isCurrent ? (currentUser.paymentMethod?.couponType === "pagofacil" ? "Pago Fácil" : "Rapipago") : ''}</span></p>
                        <p><strong>Monto:</strong> $7.000,00</p>
                        <p><strong>Vencimiento:</strong> <span id="coupon-expiry">${new Date(new Date().setDate(new Date().getDate() + 7)).toLocaleDateString()}</span></p>
                        <p><strong>Estado:</strong> <span id="coupon-status">${couponStatus}</span></p>
                        ${couponStatus === "Pendiente" ? '<button type="button" class="btn" id="confirm-coupon" onclick="confirmCouponPayment()">Ya realicé el pago</button>' : ''}
                    </div>
                </div>
            `;
        }

        container.appendChild(methodDiv);
    });
}

function generateCouponHTML(paymentMethod) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);
    
    return `
        <div class="cupon-info" id="coupon-info" style="display: block;">
            <p><strong>Código de pago:</strong> <span id="coupon-code">${paymentMethod.couponCode || 'CP-' + Math.floor(Math.random() * 1000000)}</span></p>
            <p><strong>Lugar de pago:</strong> <span id="coupon-place">${paymentMethod.couponType === "pagofacil" ? "Pago Fácil" : "Rapipago"}</span></p>
            <p><strong>Monto:</strong> $7.000,00</p>
            <p><strong>Vencimiento:</strong> <span id="coupon-expiry">${expiryDate.toLocaleDateString()}</span></p>
            <p><strong>Estado:</strong> <span id="coupon-status">${paymentMethod.status || "Pendiente"}</span></p>
            <button type="button" class="btn" id="confirm-coupon" onclick="confirmCouponPayment()">Ya realicé el pago</button>
        </div>
    `;
}

function loadUserData() {
    document.getElementById("user-name").textContent = `${currentUser.nombre} ${currentUser.apellido}`;
    document.getElementById("user-email").textContent = `E-mail: ${currentUser.email}`;
    document.getElementById("user-usuario").textContent = `Usuario: ${currentUser.usuario}`;
    
    if (currentUser.avatar) {
        document.getElementById("user-avatar").src = currentUser.avatar;
    }

    const currentPlan = planes.find(plan => plan.value === currentUser.plan);
    if (currentPlan) {
        document.getElementById("current-plan-name").textContent = currentPlan.nombre;
        document.getElementById("current-plan-price").textContent = `${currentPlan.precio}/mes`;
        document.getElementById("current-plan-devices").textContent = currentPlan.dispositivos;
        document.getElementById("current-plan-quality").textContent = currentPlan.calidad;
    }

    updatePaymentMethodDisplay();
}

function updatePaymentMethodDisplay() {
    const paymentMethod = currentUser.paymentMethod;
    const paymentDisplay = document.getElementById("current-card");
    
    if (!paymentMethod) {
        paymentDisplay.textContent = "Método de pago no registrado";
        return;
    }

    switch(paymentMethod.type) {
        case "tarjeta":
            const lastFour = paymentMethod.numero ? paymentMethod.numero.slice(-4) : "****";
            paymentDisplay.textContent = `Tarjeta que termina en ${lastFour}`;
            break;
        case "transferencia":
            paymentDisplay.textContent = "Transferencia Bancaria - " + (paymentMethod.status || "Pendiente");
            break;
        case "cupon":
            const couponType = paymentMethod.couponType === "pagofacil" ? "Pago Fácil" : "Rapipago";
            paymentDisplay.textContent = `Cupón ${couponType} - ${paymentMethod.status || "Pendiente"}`;
            break;
        default:
            paymentDisplay.textContent = "Método de pago no reconocido";
    }
}

function loadFavorites() {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "{}");
    const userFavorites = favorites[currentUser.email] || [];

    const favoriteMovies = allMovies.filter(movie => userFavorites.includes(movie.id) && movie.type === "pelicula");
    const favoriteSeries = allMovies.filter(movie => userFavorites.includes(movie.id) && movie.type === "serie");

    const moviesGrid = document.getElementById("favorite-movies");
    moviesGrid.innerHTML = "";

    if (favoriteMovies.length === 0) {
        moviesGrid.innerHTML = "<p>No tenés películas favoritas</p>";
    } else {
        favoriteMovies.forEach(movie => {
            const movieElement = document.createElement("div");
            movieElement.className = "favorito-item";
            movieElement.innerHTML = `
                <a href="detalle-pelicula.html?id=${movie.id}">
                    <img src="${movie.image}" alt="${movie.title}">
                </a>
                <span class="favorite-heart active" onclick="removeFromFavorites(${movie.id})">♥</span>
                <p>${movie.title}</p>
            `;
            moviesGrid.appendChild(movieElement);
        });
    }

    const seriesGrid = document.getElementById("favorite-series");
    seriesGrid.innerHTML = "";

    if (favoriteSeries.length === 0) {
        seriesGrid.innerHTML = "<p>No tenés series favoritas</p>";
    } else {
        favoriteSeries.forEach(serie => {
            const serieElement = document.createElement("div");
            serieElement.className = "favorito-item";
            serieElement.innerHTML = `
                <a href="detalle-serie.html?id=${serie.id}">
                    <img src="${serie.image}" alt="${serie.title}">
                </a>
                <span class="favorite-heart active" onclick="removeFromFavorites(${serie.id})">♥</span>
                <p>${serie.title}</p>
            `;
            seriesGrid.appendChild(serieElement);
        });
    }
}

function removeFromFavorites(movieId) {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "{}");
    let userFavorites = favorites[currentUser.email] || [];

    userFavorites = userFavorites.filter(id => id !== movieId);
    favorites[currentUser.email] = userFavorites;
    localStorage.setItem("favorites", JSON.stringify(favorites));

    loadFavorites();
    alert("Eliminado de favoritos");
}

function setupEventListeners() {
    document.getElementById("perfil-form").addEventListener("submit", (e) => {
        e.preventDefault();
        updatePassword();
    });

    document.getElementById("plan-form").addEventListener("submit", (e) => {
        e.preventDefault();
        updatePlanAndPayment();
    });

    document.getElementById("change-avatar-btn").addEventListener("click", function(e) {
        e.preventDefault();
        e.stopPropagation();
        const selectionDiv = document.getElementById("avatar-selection");
        selectionDiv.style.display = selectionDiv.style.display === "none" ? "block" : "none";
    });

    document.querySelectorAll(".avatar-option").forEach(option => {
        option.addEventListener("click", function() {
            const avatarKey = this.getAttribute("data-avatar");
            const avatarPath = avatars[avatarKey];
            
            document.getElementById("user-avatar").src = avatarPath;
            document.getElementById("avatar-selection").style.display = "none";
            
            if (currentUser) {
                currentUser.avatar = avatarPath;
                const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
                const userIndex = users.findIndex(u => u.email === currentUser.email);
                if (userIndex !== -1) {
                    users[userIndex].avatar = avatarPath;
                    localStorage.setItem("registeredUsers", JSON.stringify(users));
                }
                localStorage.setItem("currentUser", JSON.stringify(currentUser));
            }
        });
    });

    document.getElementById("nuevaPassword").addEventListener("input", validatePassword);
    document.getElementById("confirmarPassword").addEventListener("input", validatePassword);

    document.addEventListener("click", function(e) {
        if (!e.target.closest(".avatar-container")) {
            document.getElementById("avatar-selection").style.display = "none";
        }
    });
}

function validatePassword() {
    const password = document.getElementById("nuevaPassword").value;
    const confirmPassword = document.getElementById("confirmarPassword").value;
    const passwordError = document.getElementById("password-error");
    const confirmarError = document.getElementById("confirmar-error");

    if (password && !isValidPassword(password)) {
        passwordError.textContent = "La contraseña debe tener mínimo 8 caracteres, 2 letras, 2 números y 2 caracteres especiales";
        passwordError.classList.remove("hidden");
    } else {
        passwordError.classList.add("hidden");
    }

    if (confirmPassword && password !== confirmPassword) {
        confirmarError.textContent = "Las contraseñas no coinciden";
        confirmarError.classList.remove("hidden");
    } else {
        confirmarError.classList.add("hidden");
    }
}

function isValidPassword(password) {
    const hasLetters = (password.match(/[a-zA-Z]/g) || []).length >= 2;
    const hasNumbers = (password.match(/[0-9]/g) || []).length >= 2;
    const hasSpecialChars = (password.match(/[^a-zA-Z0-9]/g) || []).length >= 2;
    return password.length >= 8 && hasLetters && hasNumbers && hasSpecialChars;
}

function updatePassword() {
    const newPassword = document.getElementById("nuevaPassword").value;
    const confirmPassword = document.getElementById("confirmarPassword").value;

    if (!newPassword) {
        alert("No hay cambios para guardar");
        return;
    }

    if (!isValidPassword(newPassword)) {
        alert("La contraseña no cumple con los requisitos");
        return;
    }

    if (newPassword !== confirmPassword) {
        alert("Las contraseñas no coinciden");
        return;
    }

    const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
    const userIndex = users.findIndex(u => u.email === currentUser.email);

    if (userIndex !== -1) {
        users[userIndex].password = newPassword;
        localStorage.setItem("registeredUsers", JSON.stringify(users));
        localStorage.setItem("currentUser", JSON.stringify(users[userIndex]));
        currentUser = users[userIndex];

        alert("Contraseña actualizada exitosamente");
        document.getElementById("nuevaPassword").value = "";
        document.getElementById("confirmarPassword").value = "";
    }
}

function updatePlanAndPayment() {
    const selectedPlan = document.querySelector('input[name="plan"]:checked');
    const selectedCard = document.querySelector('input[name="tarjeta"]:checked');
    const selectedPaymentMethod = document.querySelector('input[name="payment-method"]:checked');
    const numeroTarjeta = document.getElementById("numeroTarjeta").value;
    const cvv = document.getElementById("cvv").value;
    const vencimiento = document.getElementById("vencimiento").value;

    const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
    const userIndex = users.findIndex(u => u.email === currentUser.email);

    if (userIndex === -1) return;

    let updated = false;

    // Actualizar plan si cambió
    if (selectedPlan && selectedPlan.value !== currentUser.plan) {
        users[userIndex].plan = selectedPlan.value;
        updated = true;
    }

    // Solo validar y actualizar método de pago si se seleccionó uno nuevo
    const currentPaymentType = currentUser.paymentMethod?.type;
    const newPaymentType = selectedPaymentMethod?.value || (selectedCard ? "tarjeta" : null);

    if (newPaymentType && newPaymentType !== currentPaymentType) {
        if (selectedCard) {
            if (!numeroTarjeta || !validateCard(numeroTarjeta)) {
                alert("Número de tarjeta inválido");
                return;
            }
            if (!cvv || !validateCVV(cvv)) {
                alert("CVV inválido (3 dígitos distintos de 000)");
                return;
            }
            if (!vencimiento || !validateExpiryDate(vencimiento)) {
                alert("La tarjeta está vencida");
                return;
            }

            users[userIndex].paymentMethod = {
                type: "tarjeta",
                cardType: selectedCard.value,
                numero: numeroTarjeta,
                vencimiento: vencimiento,
                cvv: cvv,
                nombre: document.getElementById("nombreTarjeta").value,
                status: "Pagado"
            };
            updated = true;
        } else if (selectedPaymentMethod?.value === "transferencia") {
            users[userIndex].paymentMethod = {
                type: "transferencia",
                status: document.getElementById("transfer-status")?.textContent || "Pendiente",
                cbu: "0170329940000012345678",
                alias: "CILA.MOVIES.PAGO"
            };
            updated = true;
        } else if (selectedPaymentMethod?.value === "cupon") {
            const selectedCouponType = document.querySelector('input[name="coupon-type"]:checked');
            if (selectedCouponType) {
                users[userIndex].paymentMethod = {
                    type: "cupon",
                    couponType: selectedCouponType.value,
                    couponCode: document.getElementById("coupon-code")?.textContent || 'CP-' + Math.floor(Math.random() * 1000000),
                    status: document.getElementById("coupon-status")?.textContent || "Pendiente"
                };
                updated = true;
            }
        }
    }

    if (updated) {
        localStorage.setItem("registeredUsers", JSON.stringify(users));
        localStorage.setItem("currentUser", JSON.stringify(users[userIndex]));
        currentUser = users[userIndex];
        loadUserData();
        alert("Cambios guardados exitosamente");
    } else {
        alert("No hay cambios para guardar");
    }
}

function showCardDataSection() {
    document.getElementById("card-data-section").style.display = "block";
    document.getElementById("transfer-info").style.display = "none";
    document.getElementById("coupon-options").style.display = "none";
    document.getElementById("coupon-info").style.display = "none";
    document.querySelectorAll('input[name="payment-method"]').forEach(radio => {
        radio.checked = false;
    });
    toggleCardFields(true);
}

function showTransferData() {
    document.getElementById("transfer-info").style.display = "block";
    document.getElementById("card-data-section").style.display = "none";
    document.getElementById("coupon-options").style.display = "none";
    document.getElementById("coupon-info").style.display = "none";
    document.querySelectorAll('input[name="tarjeta"]').forEach(t => t.checked = false);
    toggleCardFields(false);
}

function showCouponOptions() {
    document.getElementById("coupon-options").style.display = "block";
    document.getElementById("coupon-info").style.display = "block";
    document.getElementById("card-data-section").style.display = "none";
    document.getElementById("transfer-info").style.display = "none";
    document.querySelectorAll('input[name="tarjeta"]').forEach(t => t.checked = false);
    toggleCardFields(false);
    
    if (!document.querySelector('input[name="coupon-type"]:checked')) {
        const firstOption = document.querySelector('input[name="coupon-type"]');
        if (firstOption) {
            firstOption.checked = true;
            generateCoupon(firstOption.value);
        }
    }
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
    document.getElementById("confirm-coupon").style.display = "block";
}

function confirmTransferPayment() {
    document.getElementById("transfer-status").textContent = "Pagado";
    const confirmBtn = document.getElementById("confirm-transfer");
    if (confirmBtn) confirmBtn.style.display = "none";

    if (currentUser.paymentMethod?.type === "transferencia") {
        currentUser.paymentMethod.status = "Pagado";
        localStorage.setItem("currentUser", JSON.stringify(currentUser));

        const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
        const userIndex = users.findIndex(u => u.email === currentUser.email);
        if (userIndex !== -1) {
            users[userIndex].paymentMethod.status = "Pagado";
            localStorage.setItem("registeredUsers", JSON.stringify(users));
        }
    }
    
    alert("¡Pago por transferencia confirmado!");
}

function confirmCouponPayment() {
    document.getElementById("coupon-status").textContent = "Pagado";
    const confirmBtn = document.getElementById("confirm-coupon");
    if (confirmBtn) confirmBtn.style.display = "none";
    
    if (currentUser.paymentMethod?.type === "cupon") {
        currentUser.paymentMethod.status = "Pagado";
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
        
        const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
        const userIndex = users.findIndex(u => u.email === currentUser.email);
        if (userIndex !== -1) {
            users[userIndex].paymentMethod.status = "Pagado";
            localStorage.setItem("registeredUsers", JSON.stringify(users));
        }
    }
    
    alert("¡Pago por cupón confirmado!");
}

function toggleTarjetaSection() {
    const section = document.getElementById("tarjeta-section");
    section.classList.toggle("active");
}

function toggleCardFields(show) {
    const cardFields = ['numeroTarjeta', 'vencimiento', 'cvv', 'nombreTarjeta'];
    cardFields.forEach(field => {
        const input = document.getElementById(field);
        if (input) {
            input.required = show;
            input.disabled = !show;
            if (!show) input.value = '';
        }
    });
}

function cancelSubscription() {
    if (confirm("¿Estás seguro de que querés cancelar tu suscripción?")) {
        const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
        const filteredUsers = users.filter(u => u.email !== currentUser.email);
        localStorage.setItem("registeredUsers", JSON.stringify(filteredUsers));

        const favorites = JSON.parse(localStorage.getItem("favorites") || "{}");
        delete favorites[currentUser.email];
        localStorage.setItem("favorites", JSON.stringify(favorites));
        
        const userName = encodeURIComponent(currentUser.nombre);
        localStorage.removeItem("currentUser");
        window.location.href = `cancelacion.html?name=${userName}`;
    }
}

function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "../index.html";
}
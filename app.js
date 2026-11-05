// Логика слайдера
let currentSlide = 0;
window.moveSlide = function(step) {
    if (!currentCar || !currentCar.images) return;
    const total = currentCar.images.length;
    currentSlide = (currentSlide + step + total) % total;
    document.getElementById('slider-tracks').style.transform = `translateX(-${currentSlide * 100}%)`;
};

// Словники перекладу
const Dictionary = {
    trans: { a: 'Автомат', m: 'Механіка' },
    drive: { fwd: 'Передній', rwd: 'Задній', awd: 'Повний' },
    fuel: { gas: 'Бензин', diesel: 'Дизель', electricity: 'Електро', hybrid: 'Гібрид' },
    cls: { suv: 'Позашляховик', sedan: 'Седан', coupe: 'Купе' }
};

// Зручні функції для роботи з DOM
const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);

// Функції форматування
const formatMoney = num => new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num);
const formatKm = num => num.toLocaleString('uk-UA') + ' км';

// Глобальний стан фільтрів
const State = {
    query: '',
    make: '',
    fuel: '',
    trans: '',
    maxPrice: 140000,
    sort: 'new',
    prefillMessage: null
};

// Функції сортування
const sorters = {
    new: (a, b) => b.year - a.year || a.price - b.price,
    cheap: (a, b) => a.price - b.price,
    exp: (a, b) => b.price - a.price,
    km: (a, b) => a.mileage - b.mileage
};

// Унікальні марки авто для селекта
const uniqueMakes = [...new Set(cars.map(car => car.make))];

// Генерація HTML для картинки та картки
const generateImageHTML = car => `<img src="${car.images[0]}" alt="${car.make} ${car.model}" loading="lazy" onerror="this.onerror=null; this.src=fallbackImage;">`;

const generateCardHTML = car => `
    <a class="card" href="#/car/${car.id}">
        <div class="ph">
            ${generateImageHTML(car)}
            <span class="yr">${car.year}</span>
        </div>
        <div class="cb">
            <h3>${car.make} ${car.model}</h3>
            <div class="pr">${formatMoney(car.price)}</div>
            <ul class="sp">
                <li><i class="fa-solid fa-gauge-high"></i> ${formatKm(car.mileage)}</li>
                <li><i class="fa-solid fa-gas-pump"></i> ${Dictionary.fuel[car.fuel_type]}</li>
                <li><i class="fa-solid fa-gear"></i> ${Dictionary.trans[car.transmission]}</li>
                <li><i class="fa-solid ${car.cylinders ? 'fa-wrench' : 'fa-bolt'}"></i> ${car.cylinders ? car.cylinders + ' цил.' : 'Електро'}</li>
            </ul>
        </div>
    </a>
`;

// --- ЛОГІКА ГОЛОВНОЇ СТОРІНКИ ---
$('#q-make').innerHTML = '<option value="">Усі марки</option>' + uniqueMakes.map(make => `<option>${make}</option>`).join('');

const updateQuickCount = () => {
    const selectedMake = $('#q-make').value;
    const maxBudget = +$('#q-max').value || 1000000000;
    const count = cars.filter(car => (!selectedMake || car.make === selectedMake) && car.price <= maxBudget).length;
    $('#q-count').textContent = count;
};

$('#q-make').addEventListener('change', updateQuickCount);
$('#q-max').addEventListener('change', updateQuickCount);

$('#quick').addEventListener('submit', event => {
    event.preventDefault();
    State.make = $('#q-make').value;
    State.maxPrice = +$('#q-max').value || 140000;
    State.query = '';
    State.fuel = '';
    State.trans = '';
    location.hash = '#/catalog';
});

// Виводимо обрані авто на головній
$('#featured').innerHTML = cars.filter(car => [1, 7, 8].includes(car.id)).map(generateCardHTML).join('');

// --- ЛОГІКА КАТАЛОГУ ---
function renderCatalog() {
    const filteredCars = cars.filter(car => {
        const matchMake = !State.make || car.make === State.make;
        const matchFuel = !State.fuel || car.fuel_type === State.fuel;
        const matchTrans = !State.trans || car.transmission === State.trans;
        const matchPrice = car.price <= State.maxPrice;
        const searchString = (car.make + ' ' + car.model).toLowerCase();
        const matchQuery = searchString.includes(State.query);

        return matchMake && matchFuel && matchTrans && matchPrice && matchQuery;
    }).sort(sorters[State.sort]);

    $('#count').textContent = filteredCars.length;
    $('#f-max-o').textContent = formatMoney(State.maxPrice);
    
    const allMakesOptions = ['', ...uniqueMakes];
    $('#chips').innerHTML = allMakesOptions.map(make => 
        `<button class="${State.make === make ? 'on' : ''}" data-m="${make}">${make || 'Усі марки'}</button>`
    ).join('');

    if (filteredCars.length > 0) {
        $('#grid').innerHTML = filteredCars.map(generateCardHTML).join('');
    } else {
        $('#grid').innerHTML = `
            <div class="empty">
                <h3>Нічого не знайдено</h3>
                <p>Збільште бюджет або приберіть частину фільтрів.</p>
                <button class="btn" id="reset">Скинути фільтри</button>
            </div>
        `;
    }
}

// Прив'язка подій для фільтрів
const bindFilterInput = (id, stateKey, isNumber) => {
    $(id).addEventListener('input', event => {
        State[stateKey] = isNumber ? +event.target.value : event.target.value.trim().toLowerCase();
        renderCatalog();
    });
};

bindFilterInput('#f-q', 'query', false);
bindFilterInput('#f-max', 'maxPrice', true);

['fuel', 'trans', 'sort'].forEach(key => {
    $(`#f-${key}`).addEventListener('change', event => {
        State[key] = event.target.value;
        renderCatalog();
    });
});

$('#chips').addEventListener('click', event => {
    if (event.target.dataset.m !== undefined) {
        State.make = event.target.dataset.m;
        renderCatalog();
    }
});

$('#grid').addEventListener('click', event => {
    if (event.target.id === 'reset') {
        State.query = '';
        State.make = '';
        State.fuel = '';
        State.trans = '';
        State.maxPrice = 140000;
        syncCatalogUI();
    }
});

function syncCatalogUI() {
    $('#f-q').value = State.query;
    $('#f-fuel').value = State.fuel;
    $('#f-trans').value = State.trans;
    $('#f-max').value = State.maxPrice;
    $('#f-sort').value = State.sort;
    renderCatalog();
}

// --- СТОРІНКА АВТО ТА КАЛЬКУЛЯТОР ---
let currentCar;

function showCarDetails(id) {
    currentCar = cars.find(car => car.id === id);
    
    if (!currentCar) {
        location.hash = '#/catalog';
        return;
    }
    
    currentSlide = 0; // Сбрасываем слайдер при открытии новой машины
    
    const car = currentCar;
    const litersPer100km = car.fuel_type === 'electricity' ? '—' : (235.215 / car.highway_mpg).toFixed(1) + ' л/100 км';
    
    $('#p-car').innerHTML = `
        <a class="back" href="#/catalog">← До каталогу</a>
        <div class="car">
            <div class="ph slider">
                <div class="slides" id="slider-tracks">
                    ${car.images.map(img => `<img src="${img}" alt="${car.make} ${car.model}" onerror="this.onerror=null; this.src=fallbackImage;">`).join('')}
                </div>
                <button class="sl-btn prev" onclick="moveSlide(-1)"><i class="fa-solid fa-chevron-left"></i></button>
                <button class="sl-btn next" onclick="moveSlide(1)"><i class="fa-solid fa-chevron-right"></i></button>
                <span class="yr">${car.year}</span>
            </div>
            <div>
                <h1>${car.make} ${car.model}</h1>
                <p class="cl">${Dictionary.cls[car.class]}</p>
                <div class="big">${formatMoney(car.price)}</div>
                <p class="ds">${car.description}</p>
                
                <div class="spec">
                    <div><small>ПРОБІГ</small><b><i class="fa-solid fa-gauge-high"></i> ${formatKm(car.mileage)}</b></div>
                    <div><small>ПАЛЬНЕ</small><b><i class="fa-solid fa-gas-pump"></i> ${Dictionary.fuel[car.fuel_type]}</b></div>
                    <div><small>КОРОБКА</small><b><i class="fa-solid fa-gear"></i> ${Dictionary.trans[car.transmission]}</b></div>
                    <div><small>ПРИВІД</small><b><i class="fa-solid fa-gears"></i> ${Dictionary.drive[car.drive]}</b></div>
                    <div><small>ДВИГУН</small><b><i class="fa-solid ${car.cylinders ? 'fa-wrench' : 'fa-bolt'}"></i> ${car.cylinders ? car.cylinders + ' циліндрів' : 'Електро'}</b></div>
                    <div><small>ВИТРАТА В ТРАСІ</small><b><i class="fa-solid fa-road"></i> ${litersPer100km}</b></div>
                </div>
                
                <div class="calc">
                    <h3>Орієнтовний платіж у кредит</h3>
                    <label>Перший внесок <span id="dpo"></span></label>
                    <input type="range" id="dp" min="0" max="70" step="5" value="30">
                    <label>Термін <span id="tmo"></span></label>
                    <input type="range" id="tm" min="12" max="84" step="12" value="48">
                    <div class="m" id="mo"></div>
                    <small>Розрахунок умовний, ставка 12% річних. Точні умови підбере менеджер.</small>
                </div>
                
                <button class="btn" id="req">Записатись на тест-драйв</button>
            </div>
        </div>
    `;
    
    $('#dp').addEventListener('input', calculateLoan);
    $('#tm').addEventListener('input', calculateLoan);
    calculateLoan();
    
    $('#req').addEventListener('click', () => {
        State.prefillMessage = `Цікавить ${car.make} ${car.model}, ${car.year} р. Хочу записатись на тест-драйв.`;
        location.hash = '#/contacts';
    });
}

function calculateLoan() {
    if (!currentCar) return;
    const downPaymentPercent = +$('#dp').value;
    const months = +$('#tm').value;
    const monthlyRate = 0.12 / 12; // 12% річних
    const loanAmount = currentCar.price * (1 - downPaymentPercent / 100);
    const downPaymentAmount = currentCar.price * downPaymentPercent / 100;
    
    $('#dpo').textContent = `${downPaymentPercent}% (${formatMoney(downPaymentAmount)})`;
    $('#tmo').textContent = months + ' міс.';
    
    const monthlyPayment = loanAmount * monthlyRate / (1 - Math.pow(1 + monthlyRate, -months));
    $('#mo').textContent = formatMoney(monthlyPayment) + ' / міс.';
}

// --- СТОРІНКА КОНТАКТІВ ---
function prefillContactForm() {
    if (State.prefillMessage) {
        $('#l-msg').value = State.prefillMessage;
        $('#l-sub').value = 'Запис на тест-драйв';
        State.prefillMessage = null;
    }
}

$('#lead').addEventListener('submit', event => {
    event.preventDefault();
    const name = event.target.n.value.trim();
    event.target.innerHTML = `
        <div class="thanks">
            <h3>Дякуємо, ${name.replace(/</g, '&lt;')}!</h3>
            <p>Заявку отримано. Менеджер зв’яжеться з вами найближчим часом.</p>
        </div>
    `;
});

// --- МАРШРУТИЗАЦІЯ (SPA ROUTING) ---
function route() {
    const hashParts = (location.hash.slice(2) || 'home').split('/');
    const pageId = hashParts[0];
    const itemId = hashParts[1];
    
    const validPages = ['home', 'catalog', 'car', 'contacts'];
    const activePage = validPages.includes(pageId) ? pageId : 'home';
    
    // Показуємо потрібну секцію
    $$('.page').forEach(section => {
        section.hidden = section.id !== 'p-' + activePage;
    });
    
    // Оновлюємо активне посилання в меню
    $$('.top nav a').forEach(link => {
        const linkRoute = link.dataset.r;
        const targetRoute = activePage === 'car' ? 'catalog' : activePage;
        link.classList.toggle('on', linkRoute === targetRoute);
    });
    
    if (activePage === 'catalog') syncCatalogUI();
    if (activePage === 'car') showCarDetails(+itemId);
    if (activePage === 'contacts') prefillContactForm();
    
    window.scrollTo(0, 0);
}

window.addEventListener('hashchange', route);
route();

// --- МОБІЛЬНЕ БУРГЕР МЕНЮ ---
const burgerBtn = document.getElementById('burger');
const navMenu = document.getElementById('nav');

burgerBtn.addEventListener('click', () => {
    burgerBtn.classList.toggle('open');
    navMenu.classList.toggle('open');
});

// Закриваємо меню при кліку на будь-яке посилання
$$('#nav a').forEach(link => {
    link.addEventListener('click', () => {
        burgerBtn.classList.remove('open');
        navMenu.classList.remove('open');
    });
});
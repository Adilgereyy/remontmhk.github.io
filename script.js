// Маппинг для перевода значений услуги в понятные названия и их цены
const serviceData = {
    whitewash: { name: "Побелка стен", price: 150 },
    paint_ceiling: { name: "Покраска потолка", price: 200 },
    tile_floor: { name: "Плитка на пол", price: 300 },
    wallpaper: { name: "Обои", price: 250 }
};

// Получаем элементы
const form = document.getElementById('calcForm');
const serviceSelect = document.getElementById('service');
const areaInput = document.getElementById('area');
const resultDiv = document.getElementById('result');
const serviceName = document.getElementById('serviceName');
const totalPrice = document.getElementById('totalPrice');
const pricesList = document.getElementById('pricesList');
const disclaimer = document.getElementById('disclaimer');

// Отображаем цены
function displayPrices() {
    let list = '<ul>';
    for (const key in serviceData) {
        list += `<li>${serviceData[key].name}: ${serviceData[key].price} руб/м²</li>`;
    }
    list += '</ul>';
    pricesList.innerHTML = list;
    disclaimer.style.display = 'block';
}

// Обработчик формы
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const service = serviceSelect.value;
    let area = areaInput.value.trim().replace(',', '.');

    area = parseFloat(area);
    if (!area || area <= 0) {
        alert('Площадь должна быть больше нуля.');
        return;
    }

    const selectedService = serviceData[service];
    const total = selectedService.price * area;

    serviceName.textContent = `Услуга: ${selectedService.name}`;
    totalPrice.textContent = `Общая стоимость: ${total.toFixed(2)} руб`;
    resultDiv.style.display = 'block';
});

// Инициализация
displayPrices();
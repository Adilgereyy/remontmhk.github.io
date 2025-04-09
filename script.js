// Маппинг для перевода значений услуги в понятные названия
const serviceNames = {
    whitewash: "Побелка стен",
    paint_ceiling: "Покраска потолка",
    tile_floor: "Плитка на пол",
    wallpaper: "Обои"
};

// Получаем доступ к элементам страницы
const form = document.getElementById('calcForm');
const serviceSelect = document.getElementById('service');
const areaInput = document.getElementById('area');
const resultDiv = document.getElementById('result');
const serviceName = document.getElementById('serviceName');
const totalPrice = document.getElementById('totalPrice');
const pricesList = document.getElementById('pricesList');
const disclaimer = document.getElementById('disclaimer');  // Элемент для отображения уведомления

// Функция для получения цен с сервера
async function getPrices() {
    try {
        const response = await fetch('http://127.0.0.1:8000/prices');
        const prices = await response.json();

        // Отображаем доступные цены
        pricesList.innerHTML = `
            <ul>
                <li>Побелка стен: ${prices.whitewash} руб/м²</li>
                <li>Покраска потолка: ${prices.paint_ceiling} руб/м²</li>
                <li>Плитка на пол: ${prices.tile_floor} руб/м²</li>
                <li>Обои: ${prices.wallpaper} руб/м²</li>
            </ul>
        `;
        
        // Добавляем уведомление о примерных ценах
        disclaimer.style.display = 'block';  // Показываем уведомление
    } catch (error) {
        console.error('Ошибка при получении цен:', error);
    }
}

// Обработчик отправки формы
form.addEventListener('submit', async (e) => {
    e.preventDefault();  // Отменяем стандартное поведение формы

    let service = serviceSelect.value;
    let area = areaInput.value;

    // Заменяем запятую на точку, если таковая есть
    area = area.replace(',', '.');

    // Преобразуем в число (без дополнительных проверок)
    area = parseFloat(area);

    // Если площадь не положительная, показываем ошибку
    if (!area || area <= 0) {
        alert('Площадь должна быть больше нуля.');
        return;
    }

    try {
        const response = await fetch('http://127.0.0.1:8000/calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                service: service,
                area: area,  // отправляем значение площади как число
            }),
        });

        const data = await response.json();

        // Если ошибка в расчёте
        if (data.error) {
            alert(data.error);
        } else {
            // Показываем результат с понятным названием услуги
            const humanReadableService = serviceNames[data.service];
            serviceName.textContent = `Услуга: ${humanReadableService}`;
            totalPrice.textContent = `Общая стоимость: ${data.total_price.toFixed(2)} руб`;  // Округляем до 2 знаков
            resultDiv.style.display = 'block';
        }
    } catch (error) {
        console.error('Ошибка при расчёте:', error);
    }
});

// Загружаем доступные цены при загрузке страницы
getPrices();
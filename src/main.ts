import './scss/main.scss';
import { API_URL, API_KEY } from './../env';
import { Car } from './interfaces/Car';

const carData: Car[] = [];
const carCardsContainer = document.querySelector('.car-cards');

const loadData = async () => {
	const response = await fetch(API_URL, {
		headers: {
			'X-Master-Key': API_KEY,
			'Content-Type': 'application/json'
		}
	});
	const result = await response.json();
	const records = result.record.records;
	carData.push(...records);
	renderCarCards(carData);
};

const renderCarCards = (cars: Car[]) => {
	if (!carCardsContainer) {
		console.error('Контейнер .car-cards не знайдено в DOM.');
		return;
	}

	carCardsContainer.innerHTML = '';

	cars.forEach((car) => {
		const cardWrapper = document.createElement('div');
		cardWrapper.classList.add('card_wrapper');

		const img = document.createElement('img');
		img.classList.add('card_img');
		img.src = car.car_view_img;
		img.alt = car.car_name;

		const title = document.createElement('h2');
		title.classList.add('card_title');
		title.textContent = `${car.car_model}`;

		const price = document.createElement('p');
		price.classList.add('card_price');
		price.textContent = `${car.car_price} грн/доб`;

		const infoButton = document.createElement('a');
		infoButton.classList.add('card_button');
		infoButton.href = `./../../carinfo.html?id=${car.id}`;
		infoButton.textContent = 'Info';

		cardWrapper.appendChild(img);
		cardWrapper.appendChild(title);
		cardWrapper.appendChild(price);
		cardWrapper.appendChild(infoButton);

		carCardsContainer.appendChild(cardWrapper);
	});
};

const filterCars = (e: any) => {
	const carListItem = document.querySelectorAll('.card_wrapper');
	if (e.target.value.length === 0) {
		carListItem.forEach((item) => {
			item.classList.remove('hidden');
		});
		return;
	}
	carListItem.forEach((item) => {
		const title = item.querySelector('.card_title');
		if (title?.textContent?.startsWith(e.target.value)) {
			item.classList.remove('hidden');
		} else {
			item.classList.add('hidden');
		}
	});
	console.log(e.target.value);
};

loadData();
document.querySelector('.search-input')?.addEventListener('keyup', filterCars);

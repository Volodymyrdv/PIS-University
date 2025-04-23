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

const applyFilters = () => {
	const searchValue = (
		document.querySelector('.search-input') as HTMLInputElement
	)?.value.toLowerCase();
	const selectedBrand = (document.querySelector('#brand') as HTMLSelectElement)?.value;
	const filteredCars = carData.filter((car) => {
		const matchesSearch = !searchValue || car.car_model.toLowerCase().startsWith(searchValue);
		const matchesBrand = !selectedBrand || car.car_name === selectedBrand;
		return matchesSearch && matchesBrand;
	});

	renderCarCards(filteredCars);
};

loadData();
document.querySelector('.search-input')?.addEventListener('keyup', applyFilters);
document.querySelector('#brand')?.addEventListener('change', applyFilters);

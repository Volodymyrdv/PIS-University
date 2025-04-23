import './scss/main.scss';
import { API_URL, API_KEY } from './../env';
import { BookedCar } from './interfaces/BookedCar';

const bookedCarData: BookedCar[] = [];
const bookedCarCardsContainer = document.querySelector('.car-cards_car');
const searchForm = document.querySelector('.search-form') as HTMLFormElement;
searchForm.classList.add('hidden');

const loadData = async () => {
	const response = await fetch(API_URL, {
		headers: {
			'X-Master-Key': API_KEY,
			'Content-Type': 'application/json'
		}
	});
	const result = await response.json();
	const records = result.record.booked_cars;
	bookedCarData.push(...records);
	renderBookedCarCards(bookedCarData);
};

const renderBookedCarCards = (cars: BookedCar[]) => {
	if (!bookedCarCardsContainer) {
		console.error('Контейнер .car-cards_car не знайдено в DOM.');
		return;
	}

	bookedCarCardsContainer.innerHTML = '';

	cars.forEach((car) => {
		const cardWrapper = document.createElement('div');
		cardWrapper.classList.add('card_wrapper_car');

		const img = document.createElement('img');
		img.classList.add('card_img');
		img.src = car.car_view_img;
		img.alt = car.car_name;

		const title = document.createElement('h2');
		title.classList.add('card_title');
		title.textContent = `${car.car_model}`;

		const startDate = document.createElement('p');
		startDate.classList.add('card_date_start');
		startDate.textContent = `з: ${car.startDate}`;

		const endDate = document.createElement('p');
		endDate.classList.add('card_date_end');
		endDate.textContent = `по: ${car.endDate}`;

		const price = document.createElement('p');
		price.classList.add('card_cost_for_book');
		price.textContent = `Вартість: ${car.car_price} грн`;

		cardWrapper.appendChild(img);
		cardWrapper.appendChild(title);
		cardWrapper.appendChild(startDate);
		cardWrapper.appendChild(endDate);
		cardWrapper.appendChild(price);

		bookedCarCardsContainer.appendChild(cardWrapper);
	});
};

loadData();

import './scss/main.scss';

export interface Car {
	id: number;
	car_model: string;
	car_name: string;
	car_price: number;
	car_color: string;
	car_description: string;
	car_view_img: string;
	car_full_img: string;
	dates_bookest: any[];
}

const carData: Car[] = [];
const API_URL = 'https://api.jsonbin.io/v3/b/6803948c8960c979a58896d5';

const carCardsContainer = document.querySelector('.car-cards');

const loadData = async () => {
	const response = await fetch(API_URL);
	const result = await response.json();
	const records = result.record;
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

loadData();

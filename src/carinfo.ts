import './scss/main.scss';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Ukrainian } from 'flatpickr/dist/l10n/uk.js';
import { Car } from './main';

interface BookedDate {
	start_date: string;
	end_date: string;
}

const API_URL = 'https://api.jsonbin.io/v3/b/6803948c8960c979a58896d5';
document.addEventListener('DOMContentLoaded', async () => {
	const urlParams = new URLSearchParams(window.location.search);
	const carId = urlParams.get('id');
	if (carId) {
		const numericCarId = parseInt(carId, 10);
		const selectedCar = await loadData();
		const car: Car = selectedCar.find((car: Car) => car.id === numericCarId);
		if (car) {
			displayCarDetails(car);
			const bookedDates = getBookedDatesArray(car.dates_bookest);
			console.log(bookedDates);
			flatpickr('.calender', {
				inline: true,
				locale: Ukrainian,
				dateFormat: 'Y-m-d',
				disable: bookedDates,
				clickOpens: false,
				onDayCreate: function (_dObj, _dStr, fp, dayElem) {
					const date = dayElem.dateObj.toLocaleDateString('sv-SE');
					if (bookedDates.includes(date)) {
						dayElem.classList.add('booked-circle');
					}
				}
			});
		}
	}
});

const loadData = async () => {
	const response = await fetch(API_URL);
	const result = await response.json();
	return result.record;
};

const displayCarDetails = (car: Car) => {
	const carInfoImage = document.querySelector('.carinfo-image') as HTMLImageElement;
	const carInfoTitle = document.querySelector('.carinfo-title') as HTMLHeadingElement;
	const carInfoSubtitle = document.querySelector('.carinfo-subtitle') as HTMLHeadingElement;

	carInfoImage.src = car.car_full_img;
	carInfoTitle.textContent = car.car_name + ' ' + car.car_model;
	carInfoSubtitle.textContent = car.car_description;
};

const getBookedDatesArray = (dates: BookedDate[]): string[] => {
	const allDates: string[] = [];

	dates.forEach((dateRange) => {
		const startDate = new Date(dateRange.start_date);
		const endDate = new Date(dateRange.end_date);

		while (startDate <= endDate) {
			allDates.push(startDate.toISOString().split('T')[0]);
			startDate.setDate(startDate.getDate() + 1);
		}
	});

	return allDates;
};

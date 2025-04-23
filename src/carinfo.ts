import './scss/main.scss';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Ukrainian } from 'flatpickr/dist/l10n/uk.js';
import { Car } from './interfaces/Car';
import { BookedDate } from './interfaces/BookedDate';
import { BookedCar } from './interfaces/BookedCar';
import { API_URL, API_KEY } from './../env';

document.addEventListener('DOMContentLoaded', async () => {
	const form = document.querySelector('.form') as HTMLFormElement;
	const carId = new URLSearchParams(window.location.search).get('id');

	if (!carId) return;

	const numericCarId = parseInt(carId, 10);
	const { records: allCars, booked_cars: bookedCars } = await fetchData();
	const selectedCar = allCars.find((car: Car) => car.id === numericCarId);

	if (!selectedCar) return;

	displayCarDetails(selectedCar);
	initializeFormEvents(form, selectedCar, allCars, bookedCars, numericCarId);
	initFlatpickr(selectedCar.dates_bookest);
});

const fetchData = async () => {
	const response = await fetch(API_URL, {
		headers: {
			'X-Master-Key': API_KEY,
			'Content-Type': 'application/json'
		}
	});
	const { record } = await response.json();
	return record;
};

const displayCarDetails = (car: Car) => {
	(document.querySelector('.carinfo-image') as HTMLImageElement).src = car.car_full_img;
	(
		document.querySelector('.carinfo-title') as HTMLHeadingElement
	).textContent = `${car.car_name} ${car.car_model}`;
	(document.querySelector('.carinfo-subtitle') as HTMLHeadingElement).textContent =
		car.car_description;
};

const getBookedDatesArray = (dates: BookedDate[]): string[] => {
	return dates.flatMap(({ start_date, end_date }) => {
		const dates: string[] = [];
		let current = new Date(start_date);
		const end = new Date(end_date);

		while (current <= end) {
			dates.push(current.toISOString().split('T')[0]);
			current.setDate(current.getDate() + 1);
		}
		return dates;
	});
};

const initFlatpickr = (bookedDatesRaw: BookedDate[]) => {
	const bookedDates = getBookedDatesArray(bookedDatesRaw);

	flatpickr('.calender', {
		inline: true,
		locale: Ukrainian,
		dateFormat: 'Y-m-d',
		disable: bookedDates,
		clickOpens: false,
		onDayCreate: (_, __, ___, dayElem) => {
			const date = dayElem.dateObj.toLocaleDateString('sv-SE');
			if (bookedDates.includes(date)) {
				dayElem.classList.add('booked-circle');
			}
		}
	});
};

const initializeFormEvents = (
	form: HTMLFormElement,
	car: Car,
	allCars: Car[],
	bookedCars: BookedCar[],
	carId: number
) => {
	const startInput = document.getElementById('start_date') as HTMLInputElement;
	const endInput = document.getElementById('end_date') as HTMLInputElement;
	const priceForBooking = document.querySelector('.payment-cost') as HTMLInputElement;

	const updatePrice = () => {
		const startDate = startInput.value;
		console.log(startDate);
		const endDate = endInput.value;
		console.log(endDate);

		if (startDate && endDate) {
			const total = calculatePayment(startDate, endDate, car.car_price);
			console.log(priceForBooking);
			priceForBooking.textContent = `Вартість бронювання: ${total} грн`;
		} else {
			priceForBooking.textContent = 'Вартість бронювання: 0 грн';
		}
	};

	startInput.addEventListener('change', updatePrice);
	endInput.addEventListener('change', updatePrice);

	form.addEventListener('submit', async (e) => {
		e.preventDefault();

		const startDate = startInput.value;
		const endDate = endInput.value;

		if (!startDate || !endDate) return;

		car.dates_bookest.push({ start_date: startDate, end_date: endDate });

		const updatedCars = allCars.map((c) =>
			c.id === carId ? { ...c, dates_bookest: car.dates_bookest } : c
		);

		bookedCars.push({
			id: car.id,
			car_model: car.car_model,
			car_name: car.car_name,
			car_price: parseInt(priceForBooking.textContent!.replace(/\D/g, ''), 10),
			car_view_img: car.car_view_img,
			startDate,
			endDate
		});

		await updateData(updatedCars, bookedCars);
		form.reset();
	});
};

const updateData = async (cars: Car[], booked: BookedCar[]) => {
	await fetch(API_URL, {
		method: 'PUT',
		headers: {
			'X-Master-Key': API_KEY,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ records: cars, booked_cars: booked })
	});
};

const calculatePayment = (startDate: string, endDate: string, price: number): number => {
	const start = new Date(startDate);
	const end = new Date(endDate);
	const days = Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 3600 * 24));
	return days * price;
};

import { BookedDate } from './BookedDate';

export interface Car {
	id: number;
	car_model: string;
	car_name: string;
	car_price: number;
	car_color: string;
	car_description: string;
	car_view_img: string;
	car_full_img: string;
	dates_bookest: BookedDate[];
}

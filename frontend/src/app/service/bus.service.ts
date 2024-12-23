import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import emailjs from '@emailjs/browser';
import { Bus } from '../model/bus.model';
import { Booking } from '../model/booking.model';
import { url } from '../config';
import { BusResponse } from '../model/bus-response.model';

@Injectable({
  providedIn: 'root',
})
export class BusService {
  private busbookapi: string = `${url}booking/`;
  private apiurl: string = `${url}routes/`;
  private rateurl: string = `${url}`;

  constructor(private http: HttpClient) {}

  GETBUSDETAILS(depart: string, arrival: string, date: string): Observable<BusResponse> {
    const url = `${this.apiurl}${depart}/${arrival}/${date}`;
    return this.http.get<BusResponse>(url);
  }
  addbusmongo(myBooking: any): Observable<Booking> {
    return this.http.post<Booking>(this.busbookapi, myBooking);
  }

  sendBookingEmail(bookingDetails: any): void {
    const emailParams = {
      to_name: bookingDetails.customerName,
       // Customer's name
      reply_to: bookingDetails.email, // Customer's email for reply-to
      booking_date: bookingDetails.bookingDate, // Booking date
      departure_location: bookingDetails.departureLocation, // Departure location
      arrival_location: bookingDetails.arrivalLocation, // Arrival location
      seat_numbers: bookingDetails.seats.join(', '), // Seat numbers
      price: `${bookingDetails.price * bookingDetails.seats.length} Rs.`, // Total fare
      from_name:'TedBus',
    };

    emailjs
      .send(
        'service_vluuipu', // Replace with your EmailJS service ID
        'template_211ebhs', // Replace with your EmailJS template ID
        emailParams,
        '8Ha4qNitJWpGg91_c' // Replace with your EmailJS public key
      )
      .then(
        (response) => {
          console.log('Email sent successfully!', response.status, response.text);
        },
        (error) => {
          console.error('Error sending email:', error);
        }
      );
  }

  getbusmongo(id: string): Observable<Booking[]> {
    const url = `${this.busbookapi}${id}`;
    return this.http.get<Booking[]>(url);
  }

  storeRating(busId: string, rating: number): Observable<any> {
  const url = `${this.rateurl}rate`; // Backend endpoint
  const payload = { busId, rating };
  return this.http.post(url, payload);
}
}

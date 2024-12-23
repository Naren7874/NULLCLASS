import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BusService } from '../../../../service/bus.service';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css'],
})
export class ReviewsComponent implements OnInit {
  stars = [1, 2, 3, 4, 5];
  currentRating = 0;
  buses: any[] = [];
  selectedBus: any = null;

  constructor(private busService: BusService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.fetchBusesFromParams();
  }

  fetchBusesFromParams(): void {
    // Get query params from URL
    const departure = this.route.snapshot.queryParamMap.get('departure') || '';
    const arrival = this.route.snapshot.queryParamMap.get('arrival') || '';
    const date = this.route.snapshot.queryParamMap.get('date') || '';

    if (departure && arrival && date) {
      this.fetchBuses(departure, arrival, date);
    } else {
      console.error('Missing query parameters in URL.');
    }
  }

  fetchBuses(departure: string, arrival: string, date: string): void {
    this.busService.GETBUSDETAILS(departure, arrival, date).subscribe(
      (response) => {
        if (response && Array.isArray(response.matchedBuses)) {
          this.buses = response.matchedBuses; // Use matchedBuses array
        } else {
          console.error('Unexpected API response:', response);
          this.buses = [];
        }
      },
      (error) => {
        console.error('Error fetching buses:', error);
        this.buses = [];
      }
    );
  }

  rateBus(busId: string, rating: number): void {
    this.currentRating = rating;

    this.busService.storeRating(busId, rating).subscribe(
      (response) => {
        console.log('Rating stored successfully:', response);

        if (this.selectedBus && this.selectedBus._id === busId) {
          this.selectedBus.averageRating = response.bus.averageRating;
        }
      },
      (error) => {
        console.error('Error storing rating:', error);
      }
    );
  }

  selectBus(bus: any): void {
    this.selectedBus = bus;
  }
}

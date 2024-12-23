import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataserviceService } from '../../service/dataservice.service';
import { BusService } from '../../service/bus.service';

@Component({
  selector: 'app-payment-page',
  templateUrl: './payment-page.component.html',
  styleUrls: ['./payment-page.component.css'],
})
export class PaymentPageComponent implements OnInit {
  passseatarray: any[] = [];
  passfare: number = 0;
  routedetails: any = [];
  busdepauturetime: number = 0;
  busarrivaltime: number = 0;
  customerid: any = {};
  operatorname: string = '';
  passengerdetails: any = [];
  email: string = '';
  busid: string = '';
  phonenumber: string = '';
  isbuisnesstravel: boolean = false;
  isinsurance: boolean = false;
  iscoviddonated: Boolean = false;
  bookingdate: string = new Date().toISOString().split('T')[0];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataservice: DataserviceService,
    private busservice: BusService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const passSeatsArray = params['selectedseat'];
      this.passseatarray = passSeatsArray.split(',').map((seat: string) => parseInt(seat, 10));
      this.email = params['passemail']; // Passenger email
      this.phonenumber = params['passphn'];
      this.isbuisnesstravel = params['passisbuisness'];
      this.isinsurance = params['passinsurance'];
      this.passfare = params['seatprice'];
      this.busid = params['busid'];
      this.busarrivaltime = params['busarrivaltime'];
      this.busdepauturetime = params['busdeparturetime'];
      this.iscoviddonated = params['passiscoviddonate'];
      this.operatorname = params['operatorname'];

      this.getloggedinuser();
    });

    this.dataservice.currentdata.subscribe((data) => {
      this.routedetails = data;
    });

    this.dataservice.passdata.subscribe((data) => {
      this.passengerdetails = data;
    });
  }
  getloggedinuser(): any {
    const loggedinuserjson = sessionStorage.getItem('Loggedinuser');
    if (loggedinuserjson) {
      this.customerid = JSON.parse(loggedinuserjson);
    } else {
      alert('Please login to continue');
      this.router.navigate(['/login']);
    }
    return null;
  }

  makepayment(): void {
    const myBooking: any = {
      customerId: this.customerid._id,
      passengerDetails: this.passengerdetails,
      email: this.customerid.email, // Use logged-in user email by default
      phoneNumber: this.phonenumber,
      fare: this.passfare,
      status: 'upcoming',
      busId: this.busid,
      bookingDate: this.bookingdate,
      seats: this.passseatarray,
      departureDetails: {
        city: this.routedetails.departureLocation?.name || 'Unknown',
        time: this.busdepauturetime,
        date: this.bookingdate,
      },
      arrivalDetails: {
        city: this.routedetails.arrivalLocation?.name || 'Unknown',
        time: this.busarrivaltime,
        date: this.bookingdate,
      },
      duration: this.routedetails.duration,
      isBusinessTravel: this.isbuisnesstravel,
      isInsurance: this.isinsurance,
      isCovidDonated: this.iscoviddonated,
    };

    this.busservice.addbusmongo(myBooking).subscribe({
      next: (response) => {
        console.log('Booking added successfully:', response);

        // Send email after successful booking
        this.busservice.sendBookingEmail({
          customerName: this.passengerdetails[0]?.name || 'Customer',
          email: this.email, // Fallback to logged-in user email
          bookingDate: myBooking.bookingDate,
          departureLocation: myBooking.departureDetails.city,
          arrivalLocation: myBooking.arrivalDetails.city,
          seats: myBooking.seats,
          price: this.passfare ,
        });

        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Failed to book ticket:', error);
      },
    });
  }
}

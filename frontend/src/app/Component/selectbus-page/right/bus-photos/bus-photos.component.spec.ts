import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusPhotosComponent } from './bus-photos.component';

describe('BusPhotosComponent', () => {
  let component: BusPhotosComponent;
  let fixture: ComponentFixture<BusPhotosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BusPhotosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BusPhotosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

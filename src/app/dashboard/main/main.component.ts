import { Component } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
  // Mock data for demonstration
  stats = {
    products: {
      published: 50,
      inactive: 15,
      draft: 25,
      total: 150
    },
    orders: {
      today: 24,
      week: 128,
      pending: 18
    },
    users: {
      month: 42,
      total: 1200,
      active: 980
    },
    promoCodes: {
      active: 8,
      total: 15,
      usage: 320
    },
    contacts: {
      new: 12,
      total: 450,
      resolved: 420
    }
  };
}
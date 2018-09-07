import { Component } from '@angular/core';
import { AppInsights } from 'applicationinsights-js';
@Component({
  selector: 'app-root',
  template: `
    <h1>
      Cute Puppies
    </h1>
    <div class="header-bar"></div>
    <app-puppies></app-puppies>
  `
})
export class AppComponent {
  constructor() {
    AppInsights.downloadAndSetup({
      instrumentationKey: '5001ca1b-2402-43ea-b667-4bc179ed5128'
    });

    AppInsights.trackPageView(
      'main' /* (optional) page name */,
      null /* (optional) page url if available */,
      123 /* page view duration in milliseconds */
    );
  }
}

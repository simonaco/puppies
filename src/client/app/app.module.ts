import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { PuppyService } from './puppy.service';
import { PuppiesComponent } from './puppies.component';

@NgModule({
  declarations: [AppComponent, PuppiesComponent],
  imports: [BrowserModule, FormsModule, HttpClientModule],
  providers: [PuppyService],
  bootstrap: [AppComponent]
})
export class AppModule {}

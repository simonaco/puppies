import { Component, OnInit } from '@angular/core';

import { PuppyService } from './puppy.service';
import { Puppy } from './puppy';

@Component({
  selector: 'app-puppies',
  templateUrl: './puppies.component.html'
})
export class PuppiesComponent implements OnInit {
  addingPuppy = false;
  puppies: any = [];
  selectedPuppy: Puppy;

  constructor(private puppyService: PuppyService) {}

  ngOnInit() {
    this.getPuppies();
  }

  cancel() {
    this.addingPuppy = false;
    this.selectedPuppy = null;
  }

  deletePuppy(puppy: Puppy) {
    this.puppyService.deletePuppy(puppy).subscribe(res => {
      this.puppies = this.puppies.filter(h => h !== puppy);
      if (this.selectedPuppy === puppy) {
        this.selectedPuppy = null;
      }
    });
  }

  getPuppies() {
    return this.puppyService.getPuppies().subscribe(puppies => {
      this.puppies = puppies;
    });
  }

  enableAddMode() {
    this.addingPuppy = true;
    this.selectedPuppy = new Puppy();
  }

  onSelect(puppy: Puppy) {
    this.addingPuppy = false;
    this.selectedPuppy = puppy;
  }

  save() {
    if (this.addingPuppy) {
      this.puppyService.addPuppy(this.selectedPuppy).subscribe(puppy => {
        this.addingPuppy = false;
        this.selectedPuppy = null;
        this.puppies.push(puppy);
      });
    } else {
      this.puppyService.updatePuppy(this.selectedPuppy).subscribe(puppy => {
        this.addingPuppy = false;
        this.selectedPuppy = null;
      });
    }
  }
}

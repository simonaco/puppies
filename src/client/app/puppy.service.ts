import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Puppy } from './puppy';

const api = '/api';

@Injectable()
export class PuppyService {
  constructor(private http: HttpClient) {}

  getPuppies() {
    return this.http.get<Array<Puppy>>(`${api}/puppies`);
  }

  deletePuppy(puppy: Puppy) {
    return this.http.delete(`${api}/puppy/${puppy.id}`);
  }

  addPuppy(puppy: Puppy) {
    return this.http.post<Puppy>(`${api}/puppy/`, puppy);
  }

  updatePuppy(puppy: Puppy) {
    return this.http.put<Puppy>(`${api}/puppy/${puppy.id}`, puppy);
  }
}

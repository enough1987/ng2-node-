
import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch';


@Injectable()
export class StorageService {

  constructor(private http: Http) {}

  private in_map_func(res) {
      return res.json() || {} ;
  };

  select(url) {
    return this.http.get(url).
      map( this.in_map_func );
  }; 

  insert(url, data = {}) {
    let stringified_data = JSON.stringify(data);
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(url, stringified_data, {headers}).
      map( this.in_map_func );
  };
  
  update(url, data = {}) {
    let stringified_data = JSON.stringify(data);
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put(url, stringified_data, {headers}).
      map( this.in_map_func );
  };

  delete(url, id) {
    let new_url = `${url}?id=${id}`;
    return this.http.delete(new_url).
      map( this.in_map_func );    
  };


};

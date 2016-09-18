
import { Pipe } from '@angular/core';


@Pipe({ name: 'sortBy' })
export class sortByPipe {
  transform (value, args) {
    var arr = [];

    console.log( value, args );

    return value;
  }
}
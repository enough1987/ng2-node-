
import { Pipe } from '@angular/core';


@Pipe({ name: 'sortByGroup' })
export class sortByGroupPipe {
  transform (value, args) {

    if ( !args ) return value;
    let arr = [];
    value.forEach(function(el){
        if ( el.group == args ) arr = [ ...arr , el ];
    });
    return arr;
    
  }
}
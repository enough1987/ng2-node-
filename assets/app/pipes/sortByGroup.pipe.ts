
import { Pipe } from '@angular/core';


@Pipe({ name: 'sortByGroup' })
export class sortByGroupPipe {
  transform ( value, args ) {

    //console.log( args );

    if ( !args || !args.sort || !args.view || args.view == 'all' ) return value;

    //console.log( ' aFTER IF 'el.group , args.sort  );

    let arr = [];
    value.forEach(function(el){
        if ( el.group == args.sort ) arr = [ ...arr , el ];
    });
    return arr;
    
  }
}
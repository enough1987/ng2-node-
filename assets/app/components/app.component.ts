import { Component } from '@angular/core';

import {StorageService} from "../services/storage.service";
import {ObjectToArrayPipe} from "../pipes/objectToArray.pipe";

@Component({
    moduleId: module.id, 
    selector: 'my-app',
    templateUrl: 'app.template.html',
    styleUrls: ['app.style.css'],
    providers: [StorageService],
    pipes: [ObjectToArrayPipe]
})
export class AppComponent {
    public new_component = this.init_new_component();
    public components = [];
    public field_editable = [];

    constructor(public storageService: StorageService) {}

    ngOnInit() {
        console.log('ngOnInit');
        this.get_all_components();
    };

    init_new_component(mutability = ''){
        return {
            mutability : mutability
        };
    };

    set_new_component_mutability(mutability){
        this.new_component =  this.init_new_component( mutability );
    };


    get_all_components() {
        this.storageService.select('/api/components' ).
            subscribe( res => {
                console.log( 'get - ' , res );
                if( !res.error ) this.components = res.components;
            });
    };

    create_component(){
        console.log( this.components );
        if ( !this.new_component.name ) {
            console.log( ' no name was provided ');
            return ;
        }
        if ( this.exist_component_whith_this_name() ) {
            console.log( ' component with such name exists ' );
            return;
        }
        this.storageService.insert('/api/components', {
            name : this.new_component.name,
            group : this.new_component.group || '',
            mutability : this.new_component.mutability,
            body : []
         }).
            subscribe( res => {
                console.log( 'post - ' , res );
                console.log( res.msg );
                if ( !res.error ) {
                    this.components = res.components;
                    this.new_component = this.init_new_component(this.new_component.mutability);
                }
        });

    };

    change_component(component){
        if ( !component.new_name ) {
            console.log('no name was provided ');
            return;
        }
        if( this.exist_component_whith_this_name(component.new_name) ){
            console.log( ' component with such name exists ' );
            return;
        }
        this.storageService.update('/api/components',{
            id : component._id,
            name : component.new_name,
            group : component.group,
            mutability : this.new_component.mutability,
            body : component.body
        }).
            subscribe( res => {
                console.log( 'put - ' , res );
                if ( !res.error ) this.components = res.components;
        });
    };

    copy_component(component) {
        if ( !component.new_name ) {
            console.log( 'no name was provided ' );
            return;
        }
        if( this.exist_component_whith_this_name(component.new_name) ){
            console.log( ' component with such name exists ' );
            return;
        }
        this.storageService.insert('/api/components', {
            name : component.new_name,
            group : component.group,
            mutability : component.mutability,
            body : component.body
         }).
            subscribe( res => {
                console.log( 'post - ' , res );
                console.log( res.msg );
                if ( !res.error ) this.components = res.components;
         });
    };

    delete_component(id) {
        if ( !id ) {
            console.log('no id was provided ');
            return;
        }
        this.storageService.delete('/api/components', id).
            subscribe( res => {
                console.log( 'delete - ' , res );
                if ( !res.error ) this.components = res.components;
            });
    };

    exist_component_whith_this_name(name = this.new_component.name){
        if(
            this.components.find(el => { return el.name === name ? true : false })
            ) return true;
        return false;
    };

    edit_fields_component(component){
        this.field_editable = component;
    };

    show_fields_component(component){
        console.log( this.field_editable , component );
        if (  this.field_editable &&
              this.field_editable._id === component._id 
        ) return true;
    }; 


    

    // return unique id
    create_guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
 	    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
               s4() + '-' + s4() + s4() + s4();
    };

    //  Returns a deep copy of the object
    deepCopy(oldObj: any) {
        let newObj = oldObj;
        if (oldObj && typeof oldObj === "object") {
            newObj = Object.prototype.toString.call(oldObj) === "[object Array]" ? [] : {};
            for (var i in oldObj) {
                newObj[i] = this.deepCopy(oldObj[i]);
            }
        }
        return newObj;
    };




}

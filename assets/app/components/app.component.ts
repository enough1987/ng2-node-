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
    public component_editable = [];
    public new_field = { type: "string" };     

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
        this.new_field = { type: "string" };   
        this.component_editable = component;
    };

    show_fields_component(component){
        if (  this.component_editable &&
              this.component_editable._id === component._id 
        ) return true;
    }; 

    add_field( component, new_field = {} ){
        //console.log( component, new_field );
        if ( this.exist_field_with_this_name(component, new_field.name) ) return ;
        this.new_field = { type: "string" }; 
        new_field._id = this.create_guid();
        component.body = [ ... component.body , new_field ];
        //console.log( component.body );
        this.storageService.update('/api/components',{
            id : component._id,
            name : component.name,
            group : component.group,
            mutability : component.mutability,
            body : component.body
        }).
            subscribe( res => {
                console.log( 'put - ' , res );
                if ( !res.error ) this.components = res.components;
        });

    };

    change_field( component, field = {} ){
        //console.log(component, field);
        if ( this.exist_field_with_this_name(component, field.edit_name ) ) return;
        field.name = field.edit_name;
        delete field.edit_name;

        this.storageService.update('/api/components',{
            id : component._id,
            name : component.name,
            group : component.group,
            mutability : component.mutability,
            body : component.body
        }).
            subscribe( res => {
                console.log( 'put - ' , res );
                if ( !res.error ) this.components = res.components;
        });
        
    };

    copy_field(component, field){
        //console.log(component, field);
        if ( this.exist_field_with_this_name(component, field.edit_name ) ) return;
        let new_field = this.deepCopy(field);
        new_field.name = new_field.edit_name;
        delete new_field.edit_name;
        console.log( new_field );
    };

    delete_field(component, field){
        console.log(component, field);
    };

    exist_field_with_this_name(component, field_name){
        if ( !component ||
             !component.body ||
             !field_name 
        ) {
            console.log(' fields was not provided ');
            return true;
        }
        if(
            component.body.find(el => { return el.name === field_name ? true : false })
        ) {
            console.log(  ' field with such name exists ' );
            return true;
        }
        return false;
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

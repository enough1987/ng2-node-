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
    //public new_component = this.init_new_component();
    public components = [];
    //public component_editable = [];
    //public new_field = { type: "string" };   
    //public new_group = [];
    public components_current_view = 'all';
    public new_component = [];
    //public create_component_group = '';

    constructor(public storageService: StorageService) {}

    ngOnInit() {
        console.log('ngOnInit');
        this.get_all_components();
    };

    get_all_components() {
        this.storageService.select('/api/components' ).
            subscribe( res => {
                console.log( 'get - ' , res );
                if( !res.error ) this.components = res.components;
            });
    };

    set_current_view( view ){
        this.current_view = view;
    };
    set_components_current_view( view ) {
        if ( view == 'all') document.getElementById('group_select').value = 'none';
        this.components_current_view = view;
        console.log( ' components_current_view ', this.components_current_view );       
    };

    set_new_component_group_select( value ) {
        this.new_component.group = value;
    };

    change_new_component_group() {
        //console.log( 'keyup val ', this.create_component_group );
        let res = [1,2,3,4].find( el => el == this.new_component.group) || 'none' ;
        document.getElementById('new_component_group_select').value = res;
        console.log( 'new_component_group_select ', res ); 
    };

    choosen_menu( a, b ){
        if ( a == b ) return true;
    };

    set_error_msg( error_msg ){
        this.error_msg = error_msg;
        setTimeout( ()=> this.error_msg = '', 3000 );
    };

    is_component_exist(name){
        let res = this.components.find( comp => comp.name == name);
        return !!res;
    };

    set_edit_component( edit_comp ) {
        this.component_editable = edit_comp;
        this.component_editable.new_name = this.component_editable.name;
    };

    create_component(){
        if ( ! this.new_component.name ) {
            this.set_error_msg( ' No name was provided ' );
            console.log( 'No name was provided ' );
            return false;
        }
        if ( this.is_component_exist(this.new_component.name) ) {
            this.set_error_msg( ' Some component has this name ' ); 
            console.log( 'Some component has this name' );
            return false;           
        }

        if ( ! this.new_component.group ) this.new_component.group = 'none' ;
        let body = [];
        if ( this.new_component.group !== 'none' ){
            let res = this.components.find( comp => comp.group == this.new_component.group);
            if ( res ) body = res.body ;
        }
        console.log(
            this.new_component.name,
            ' ',
            this.new_component.group,
            ' ',
            body
        );


        this.storageService.insert('/api/components', {
            name : this.new_component.name,
            group : this.new_component.group || 'none',
            body : []
         }).
            subscribe( res => {
                console.log( 'post - ' , res );
                if ( !res.error ) {
                    this.components = res.components;
                    let edit_comp = this.components.find( comp => comp.name == this.new_component.name);
                    if ( edit_comp ) {
                        this.set_components_current_view('edit-component');
                        this.set_edit_component( edit_comp );
                    }
                }
        });
    };


/*

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
        console.log( this.component_editable, component );
        if ( this.component_editable._id != component._id)  { 
            this.component_editable = component;
        } else {
            this.component_editable = [];
        }

    };

    show_fields_component(component){
        if (  this.component_editable &&
              this.component_editable._id === component._id 
        ) return true;
    }; 

    add_field( component, new_field = {} ){
        //console.log( component, new_field );
        if ( !new_field.name ) return;
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

    if_number_field(val){
        val = Number(val);
        return val ? val : 0 ;
    };

    if_component_field(component, val){
        let res = [];
        //console.log(component, val);
        this.components.find(el => { 
            //console.log( el.name );
            if ( el.name === val &&
               component.name !== val ) {
                   //console.log( 'res ', el );
                   res =  el;
               }
               //console.log( ' //////////////// ');                
        })
        return res;
    };

    change_field( settings = {} ){
        let component = settings.component;
        let field = settings.field;

        //console.log(component, field);
        if ( this.exist_field_with_this_name(component, field.edit_name, field._id ) ) return;
        if ( settings.type == 'number' ) {
            field.edit_value = this.if_number_field(field.edit_value_name);
        }
        if ( settings.type == 'component' ) {
            field.component_value = this.if_component_field(component, field.edit_value);
        }
        field.name = field.edit_name || field.name;
        field.value = field.edit_value;
        delete field.edit_name;
        delete field.edit_value;
        delete field.assignment;

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

    copy_field( settings = {} ){
        let component = settings.component;
        let field = settings.field;
        console.log(component, field);
        if ( !field.edit_name ) return;
        if ( this.exist_field_with_this_name(component, field.edit_name, field._id ) ) return;
        let new_field = this.deepCopy(field);
        new_field._id = this.create_guid();
        new_field.name = new_field.edit_name;
        new_field.value = '';
        if ( settings.type == 'number' ) {
            new_field.value= this.if_number_field(new_field.value);
        }
        if ( settings.type == 'component' ) {
            this.if_component_field(component, new_field.value);
        }
        delete new_field.edit_name;
        delete new_field.edit_value;
        delete new_field.assignment;
        component.body = [ ... component.body , new_field ];
        //console.log( new_field );
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

    delete_field( settings = {} ){
        let component = settings.component;
        let field = settings.field;
        //console.log(component, field);
        if ( !component || !field ) {
            console.log( 'no component or field');
            return;
        }
        component.body.forEach( (el, idx, arr) => { 
            if(el._id === field._id ) {
                arr.splice(idx, 1);
                //console.log( arr, idx );
            } 
        });
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

    value_assignment(field){
        if (  !field.assignment ){
            if ( field.type == 'component' ) {
                field.component_value = field.component_value || [];
            }
            field.edit_value = field.value;
            field.assignment = true;
        }
        return true;
    };

    exist_field_with_this_name(component, field_name, field_id ){
        if ( !component ||
             !component.body 
        ) {
            console.log(' fields was not provided ');
            return true;
        }
        if(
            component.body.find(el => { return (el.name === field_name &&
               el._id !== field_id ) ? true : false })
        ) {
            console.log(  ' field with such name exists ' );
            return true;
        }
        return false;
    };
    
*/

    

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

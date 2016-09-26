"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var storage_service_1 = require("../services/storage.service");
var objectToArray_pipe_1 = require("../pipes/objectToArray.pipe");
var sortByGroup_pipe_1 = require("../pipes/sortByGroup.pipe");
var AppComponent = (function () {
    function AppComponent(storageService) {
        this.storageService = storageService;
        //public new_component = this.init_new_component();
        this.components = [];
        this.pages = [];
        this.part_current_view = 'all';
        //public component_editable = [];
        this.new_field = { type: "string" };
        //public new_group = [];
        this.new_component = [];
        //public create_component_group = '';
        this.error_msg = [];
        this.new_page = [];
        this.new_page_field = {};
    }
    AppComponent.prototype.ngOnInit = function () {
        console.log('ngOnInit');
        this.get_all_components();
        this.get_all_pages();
    };
    ;
    AppComponent.prototype.get_all_components = function () {
        var _this = this;
        this.storageService.select('/api/components').
            subscribe(function (res) {
            console.log('get - ', res);
            if (!res.error)
                _this.components = res.components;
        });
    };
    ;
    AppComponent.prototype.get_all_pages = function () {
        var _this = this;
        this.storageService.select('/api/pages').
            subscribe(function (res) {
            console.log('get - ', res);
            if (!res.error)
                _this.pages = res.pages;
        });
    };
    ;
    AppComponent.prototype.set_current_view = function (view) {
        this.current_view = view;
        this.part_current_view = "all";
    };
    ;
    AppComponent.prototype.set_part_current_view = function (view) {
        if (view == 'all') {
            document.getElementById('group_select') ?
                document.getElementById('group_select').value = 'none' : '';
            document.getElementById('collection_select') ?
                document.getElementById('collection_select').value = 'none' : '';
        }
        this.part_current_view = view;
        console.log(' part_current_view ', this.part_current_view);
    };
    ;
    AppComponent.prototype.set_sorted_part_current_view = function (sort) {
        this.part_current_view = 'sorted_view';
        this.sorted_by_value = sort;
        console.log(this.sorted_by_value);
    };
    ;
    AppComponent.prototype.set_new_component_group_select = function (value) {
        this.new_component.group = value;
    };
    ;
    AppComponent.prototype.change_new_component_group = function () {
        var _this = this;
        //console.log( 'keyup val ', this.create_component_group );
        //console.log( 'a l l ', this.all_groups_name() );
        var res = this.all_groups_name().find(function (el) { return el == _this.new_component.group; }) || 'none';
        document.getElementById('new_component_group_select').value = res;
        console.log('new_component_group_select ', res);
    };
    ;
    AppComponent.prototype.choosen_menu = function (a, b) {
        if (a == b)
            return true;
    };
    ;
    AppComponent.prototype.set_error_msg = function (error_msg, location) {
        var _this = this;
        if (location === void 0) { location = 'global'; }
        this.error_msg[location] = error_msg;
        setTimeout(function () { return _this.error_msg[location] = ''; }, 3000);
    };
    ;
    AppComponent.prototype.is_component_exist = function (name) {
        var res = this.components.find(function (comp) { return comp.name == name; });
        //console.log(res);
        return res;
    };
    ;
    AppComponent.prototype.set_edit_component = function (edit_comp) {
        this.component_editable = edit_comp;
        this.component_editable.new_name = this.component_editable.name;
    };
    ;
    AppComponent.prototype.set_new_field_type = function (value) {
        this.new_field.type = value;
    };
    ;
    AppComponent.prototype.show_if_type_field_exist = function (type) {
        return this.component_editable.body.find(function (field) { return field.type == type; });
    };
    ;
    AppComponent.prototype.is_field_exist = function (name) {
        return this.component_editable.body.find(function (field) { return field.name == name; });
    };
    ;
    AppComponent.prototype.all_components_name = function () {
        var comp_names = [];
        this.components.forEach(function (el) {
            comp_names = comp_names.concat([el.name]);
        });
        //console.log( comp_names );
        return comp_names;
    };
    ;
    AppComponent.prototype.all_groups_name = function (data) {
        if (data === void 0) { data = this.components; }
        //console.log( data );
        var groups_names = [];
        data.forEach(function (el) {
            if (groups_names.indexOf(el.group) === -1 &&
                el.group &&
                el.group != 'none') {
                groups_names = groups_names.concat([el.group]);
            }
        });
        //console.log( groups_names );
        return groups_names;
    };
    ;
    AppComponent.prototype.show_group_select = function (selected) {
        var arr = this.all_groups_name(selected);
        //console.log( selected, ' ' , arr , ' ' , arr.length );
        return arr.length;
    };
    ;
    AppComponent.prototype.add_new_field = function () {
        //console.log( this.new_field,  this.component_editable );
        var _this = this;
        if (!this.new_field.name) {
            this.set_error_msg(' No field name was provided ', 'new_field');
            console.log('No name was provided ');
            return false;
        }
        if (this.is_field_exist(this.new_field.name)) {
            this.set_error_msg('One field has this name ', 'new_field');
            console.log('One filed has this name');
            return false;
        }
        this.new_field._id = this.create_guid();
        //document.getElementById('new-field-id').value = this.new_field.type;
        this.component_editable.body = this.component_editable.body.concat([this.new_field]);
        if (this.component_editable.group != 'none') {
            this.add_new_field_to_group();
            this.new_field = { type: this.new_field.type };
            return false;
        }
        this.new_field = { type: this.new_field.type };
        //console.log(  this.component_editable.body );
        this.storageService.update('/api/components', {
            id: this.component_editable._id,
            name: this.component_editable.name,
            group: this.component_editable.group,
            body: this.component_editable.body
        }).
            subscribe(function (res) {
            console.log('put - ', res);
            if (!res.error)
                _this.components = res.components;
            console.log(' b ', _this.component_editable.body);
        });
    };
    ;
    AppComponent.prototype.add_new_field_to_group = function () {
        var _this = this;
        this.storageService.update('/api/components/group/add', {
            group: this.component_editable.group,
            field: this.new_field
        }).
            subscribe(function (res) {
            console.log('all put - ', res);
            if (!res.error)
                _this.components = res.components;
        });
    };
    ;
    AppComponent.prototype.delete_field = function (id) {
        var _this = this;
        //console.log( this.component_editable.body );
        this.component_editable.body.forEach(function (el, idx, arr) {
            if (el._id === id) {
                _this.component_editable.body.splice(idx, 1);
            }
        });
        if (this.component_editable.group != 'none') {
            this.delete_field_to_group(id);
            return false;
        }
        //console.log( this.component_editable.body ) ;      
        this.storageService.update('/api/components', {
            id: this.component_editable._id,
            name: this.component_editable.name,
            group: this.component_editable.group,
            body: this.component_editable.body
        }).
            subscribe(function (res) {
            console.log('put - ', res);
            if (!res.error)
                _this.components = res.components;
        });
    };
    ;
    AppComponent.prototype.delete_field_to_group = function (id) {
        var _this = this;
        //console.log( this.component_editable.body ) ;      
        this.storageService.update('/api/components/group/delete', {
            group: this.component_editable.group,
            id: id
        }).
            subscribe(function (res) {
            console.log('put - ', res);
            if (!res.error)
                _this.components = res.components;
        });
    };
    ;
    AppComponent.prototype.set_component_field_value = function (field, name) {
        var _this = this;
        var comp = this.components.find(function (comp) { return comp.name === name && _this.component_editable.name !== name; });
        field.value = comp;
    };
    ;
    AppComponent.prototype.show_json_of_edit_component = function () {
        this.json_of_edit_component_is_visible = !this.json_of_edit_component_is_visible;
    };
    ;
    AppComponent.prototype.create_component = function () {
        var _this = this;
        if (!this.new_component.name) {
            this.set_error_msg(' No name was provided ');
            console.log('No name was provided ');
            return false;
        }
        if (this.is_component_exist(this.new_component.name)) {
            this.set_error_msg('One component has this name ');
            console.log('One component has this name');
            return false;
        }
        if (!this.new_component.group)
            this.new_component.group = 'none';
        var body = [];
        if (this.new_component.group !== 'none') {
            var res = this.components.find(function (comp) { return comp.group == _this.new_component.group; });
            if (res)
                body = res.body;
        }
        this.storageService.insert('/api/components', {
            name: this.new_component.name,
            group: this.new_component.group || 'none',
            body: body
        }).
            subscribe(function (res) {
            console.log('post - ', res);
            if (!res.error) {
                _this.components = res.components;
                var edit_comp = _this.components.find(function (comp) { return comp.name == _this.new_component.name; });
                if (edit_comp) {
                    _this.new_component = [];
                    _this.set_part_current_view('edit-component');
                    _this.set_edit_component(edit_comp);
                }
            }
        });
    };
    ;
    AppComponent.prototype.change_component = function (component) {
        var _this = this;
        if (this.component_editable.new_name != this.component_editable.name &&
            this.is_component_exist(this.component_editable.new_name)) {
            this.set_error_msg('One component has this name ', 'edit-component');
            console.log('One component has this name');
            return false;
        }
        if (this.component_editable.new_name != this.component_editable.name) {
            this.component_editable.name = this.component_editable.new_name;
        }
        this.storageService.update('/api/components', {
            id: this.component_editable._id,
            name: this.component_editable.name,
            group: this.component_editable.group,
            body: this.component_editable.body
        }).
            subscribe(function (res) {
            console.log('put - ', res);
            if (!res.error)
                _this.components = res.components;
        });
    };
    ;
    AppComponent.prototype.copy_component = function () {
        var _this = this;
        if (!this.component_editable.new_name ||
            this.component_editable.name == this.component_editable.new_name) {
            this.set_error_msg('No new name was provided ', 'edit-component');
            console.log('No new name was provided ');
            return false;
        }
        if (this.is_component_exist(this.component_editable.new_name)) {
            this.set_error_msg('One component has this name ', 'edit-component');
            console.log('One component has this name');
            return;
        }
        this.storageService.insert('/api/components', {
            id: this.component_editable._id,
            name: this.component_editable.new_name,
            group: this.component_editable.group,
            body: this.component_editable.body
        }).
            subscribe(function (res) {
            console.log('post - ', res);
            if (!res.error)
                _this.components = res.components;
        });
    };
    ;
    AppComponent.prototype.delete_component = function () {
        var _this = this;
        this.storageService.delete('/api/components', this.component_editable._id).
            subscribe(function (res) {
            console.log('delete - ', res);
            if (!res.error) {
                _this.components = res.components;
                _this.set_part_current_view('all');
            }
        });
    };
    ;
    AppComponent.prototype.all_pages_name = function () {
        var page_names = [];
        this.pages.forEach(function (el) {
            page_names = page_names.concat([el.name]);
        });
        //console.log( comp_names );
        return page_names;
    };
    ;
    AppComponent.prototype.set_new_page_group_select = function (value) {
        this.new_page.group = value;
    };
    ;
    AppComponent.prototype.change_new_page_group = function () {
        var _this = this;
        var res = this.all_groups_name(this.page).find(function (el) { return el == _this.new_page.group; }) || 'none';
        document.getElementById('new_page_group_select') ?
            document.getElementById('new_page_group_select').value = res : '';
        console.log('new_page_group_select ', res);
    };
    ;
    AppComponent.prototype.is_page_exist = function (name) {
        var res = this.pages.find(function (page) { return page.name == name; });
        return res;
    };
    ;
    AppComponent.prototype.set_edit_page = function (edit_page) {
        this.page_editable = edit_page;
        this.page_editable.new_name = this.page_editable.name;
    };
    ;
    AppComponent.prototype.change_new_page_field_value = function (value) {
        this.new_page_field.value = value;
    };
    ;
    AppComponent.prototype.is_page_field_name_exist = function (name) {
        return this.page_editable.body.find(function (field) { return console.log(field.name); });
    };
    ;
    AppComponent.prototype.set_new_page_field_value = function (page_editable, new_page_field) {
        //console.log(' tttttttt ', page_editable, new_page_field);
        var comp = this.components.find(function (el) { return el.name === new_page_field.value ? true : false; });
        //console.log( ' comp ', comp );
        new_page_field.value = comp;
    };
    ;
    AppComponent.prototype.add_new_page_field = function () {
        var _this = this;
        console.log(this.new_page_field);
        if (this.is_page_field_name_exist(this.new_page_field.name)) {
            this.set_error_msg('One field has this name ', 'new_page_field');
            console.log(' no name was provided ');
            return;
        }
        ;
        if (this.new_page_field.value == 'none')
            this.new_page_field.value = '';
        if (this.new_page_field.value) {
            this.set_new_page_field_value(this.page_editable, this.new_page_field);
        }
        this.new_page_field._id = this.create_guid();
        this.page_editable.body = this.page_editable.body.concat([this.new_page_field]);
        this.new_page_field = {};
        document.getElementById('new_page_field_value_select') ?
            document.getElementById('new_page_field_value_select').value = 'none' : '';
        return console.log(' end ');
        this.storageService.update('/api/components', {
            id: this.component_editable._id,
            name: this.component_editable.name,
            group: this.component_editable.group,
            body: this.component_editable.body
        }).
            subscribe(function (res) {
            console.log('put - ', res);
            if (!res.error)
                _this.components = res.components;
            console.log(' b ', _this.component_editable.body);
        });
    };
    ;
    AppComponent.prototype.create_page = function () {
        var _this = this;
        if (!this.new_page.name) {
            this.set_error_msg(' No name was provided ');
            console.log('No name was provided ');
            return false;
        }
        if (this.is_page_exist(this.new_page.name)) {
            this.set_error_msg('One page has this name ');
            console.log('One page has this name');
            return false;
        }
        if (!this.new_page.group)
            this.new_page.group = 'none';
        var body = [];
        if (this.new_page.group !== 'none') {
            var res = this.pages.find(function (page) { return page.group == _this.new_page.group; });
            if (res)
                body = res.body;
        }
        this.storageService.insert('/api/pages', {
            name: this.new_page.name,
            group: this.new_page.group || 'none',
            body: body
        }).
            subscribe(function (res) {
            console.log('post - ', res);
            if (!res.error) {
                _this.pages = res.pages;
                var edit_page = _this.pages.find(function (page) { return page.name == _this.new_page.name; });
                if (edit_page) {
                    _this.new_page = [];
                    _this.set_part_current_view('edit-page');
                    _this.set_edit_page(edit_page);
                }
            }
        });
    };
    ;
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
    AppComponent.prototype.create_guid = function () {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    };
    ;
    //  Returns a deep copy of the object
    AppComponent.prototype.deepCopy = function (oldObj) {
        var newObj = oldObj;
        if (oldObj && typeof oldObj === "object") {
            newObj = Object.prototype.toString.call(oldObj) === "[object Array]" ? [] : {};
            for (var i in oldObj) {
                newObj[i] = this.deepCopy(oldObj[i]);
            }
        }
        return newObj;
    };
    ;
    AppComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'my-app',
            templateUrl: 'app.template.html',
            styleUrls: ['app.style.css'],
            providers: [storage_service_1.StorageService],
            pipes: [objectToArray_pipe_1.ObjectToArrayPipe, sortByGroup_pipe_1.sortByGroupPipe]
        }), 
        __metadata('design:paramtypes', [storage_service_1.StorageService])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
/*


let cvt_r_n = (() => {

  var nut = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  var rom = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];
  var all = {I:1,V:5,X:10,L:50,C:100,D:500,M:1000};

  var cvt_r_n_to_roman = (arabic) => {
    let res = '';
    nut.forEach( (el, idx, arr ) =>{
        while ( arabic >= nut[idx] ) {
            res += rom[idx];
            arabic -= nut[idx];
        }
    });
    return res;
  };

  var cvt_r_n_form_roman = (roman) => {
      let res = 0;
      let l = roman.length;
      while (l--) {
        if ( all[roman[l]] < all[roman[l+1]] ) {
            res -= all[roman[l]];
        } else {
            res += all[roman[l]]
        }
      }
      
      return res;
  };

  return (num) => {
    if ( typeof num === 'number') return cvt_r_n_to_roman( num );
    if ( typeof num === 'string') return cvt_r_n_form_roman( num.toUpperCase() );
  };

})();


console.log( cvt_r_n(3003) );
console.log( cvt_r_n(443) );
console.log( cvt_r_n(69) );
console.log( cvt_r_n(2) );
console.log( cvt_r_n(99) );
console.log( cvt_r_n(34) );
console.log( cvt_r_n(456) );

console.log('-------------------');

console.log( cvt_r_n('MMMIII') );
console.log( cvt_r_n('CDXLIII') );
console.log( cvt_r_n('LXIX') );
console.log( cvt_r_n('II') );
console.log( cvt_r_n('XCIX') );
console.log( cvt_r_n('XXXIV') );
console.log( cvt_r_n('CDLVI') );

*/ 

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvYXBwLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEscUJBQTBCLGVBQWUsQ0FBQyxDQUFBO0FBRTFDLGdDQUE2Qiw2QkFBNkIsQ0FBQyxDQUFBO0FBRTNELG1DQUFnQyw2QkFBNkIsQ0FBQyxDQUFBO0FBQzlELGlDQUE4QiwyQkFBMkIsQ0FBQyxDQUFBO0FBVTFEO0lBZ0JJLHNCQUFtQixjQUE4QjtRQUE5QixtQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7UUFmakQsbURBQW1EO1FBQzVDLGVBQVUsR0FBRyxFQUFFLENBQUM7UUFDaEIsVUFBSyxHQUFHLEVBQUUsQ0FBQztRQUNYLHNCQUFpQixHQUFHLEtBQUssQ0FBQztRQUNqQyxpQ0FBaUM7UUFDMUIsY0FBUyxHQUFHLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxDQUFDO1FBQ3RDLHdCQUF3QjtRQUVqQixrQkFBYSxHQUFHLEVBQUUsQ0FBQztRQUMxQixxQ0FBcUM7UUFDOUIsY0FBUyxHQUFHLEVBQUUsQ0FBQztRQUNmLGFBQVEsR0FBRyxFQUFFLENBQUM7UUFDZCxtQkFBYyxHQUFHLEVBQUUsQ0FBQztJQUd5QixDQUFDO0lBRXJELCtCQUFRLEdBQVI7UUFDSSxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3hCLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1FBQzFCLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUN6QixDQUFDOztJQUVELHlDQUFrQixHQUFsQjtRQUFBLGlCQU1DO1FBTEcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUU7WUFDMUMsU0FBUyxDQUFFLFVBQUEsR0FBRztZQUNWLE9BQU8sQ0FBQyxHQUFHLENBQUUsUUFBUSxFQUFHLEdBQUcsQ0FBRSxDQUFDO1lBQzlCLEVBQUUsQ0FBQSxDQUFFLENBQUMsR0FBRyxDQUFDLEtBQU0sQ0FBQztnQkFBQyxLQUFJLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUM7UUFDdEQsQ0FBQyxDQUFDLENBQUM7SUFDWCxDQUFDOztJQUVELG9DQUFhLEdBQWI7UUFBQSxpQkFNQztRQUxHLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBRTtZQUNyQyxTQUFTLENBQUUsVUFBQSxHQUFHO1lBQ1YsT0FBTyxDQUFDLEdBQUcsQ0FBRSxRQUFRLEVBQUcsR0FBRyxDQUFFLENBQUM7WUFDOUIsRUFBRSxDQUFBLENBQUUsQ0FBQyxHQUFHLENBQUMsS0FBTSxDQUFDO2dCQUFDLEtBQUksQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQztRQUM1QyxDQUFDLENBQUMsQ0FBQztJQUNYLENBQUM7O0lBRUQsdUNBQWdCLEdBQWhCLFVBQWtCLElBQUk7UUFDbEIsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7UUFDekIsSUFBSSxDQUFDLGlCQUFpQixHQUFHLEtBQUssQ0FBQztJQUNuQyxDQUFDOztJQUVELDRDQUFxQixHQUFyQixVQUF1QixJQUFJO1FBQ3ZCLEVBQUUsQ0FBQyxDQUFFLElBQUksSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ2pCLFFBQVEsQ0FBQyxjQUFjLENBQUMsY0FBYyxDQUFDO2dCQUNuQyxRQUFRLENBQUMsY0FBYyxDQUFDLGNBQWMsQ0FBQyxDQUFDLEtBQUssR0FBRyxNQUFNLEdBQUcsRUFBRSxDQUFDO1lBQ2hFLFFBQVEsQ0FBQyxjQUFjLENBQUMsbUJBQW1CLENBQUM7Z0JBQ3hDLFFBQVEsQ0FBQyxjQUFjLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxLQUFLLEdBQUcsTUFBTSxHQUFHLEVBQUUsQ0FBQztRQUN6RSxDQUFDO1FBQ0QsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQztRQUM5QixPQUFPLENBQUMsR0FBRyxDQUFFLHFCQUFxQixFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBRSxDQUFDO0lBQ2pFLENBQUM7O0lBRUQsbURBQTRCLEdBQTVCLFVBQThCLElBQUk7UUFDOUIsSUFBSSxDQUFDLGlCQUFpQixHQUFHLGFBQWEsQ0FBQztRQUN2QyxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQztRQUM1QixPQUFPLENBQUMsR0FBRyxDQUFFLElBQUksQ0FBQyxlQUFlLENBQUUsQ0FBQztJQUN4QyxDQUFDOztJQUVELHFEQUE4QixHQUE5QixVQUFnQyxLQUFLO1FBQ2pDLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztJQUNyQyxDQUFDOztJQUVELGlEQUEwQixHQUExQjtRQUFBLGlCQU1DO1FBTEcsMkRBQTJEO1FBQzNELGtEQUFrRDtRQUNsRCxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUMsSUFBSSxDQUFFLFVBQUEsRUFBRSxJQUFJLE9BQUEsRUFBRSxJQUFJLEtBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUE5QixDQUE4QixDQUFDLElBQUksTUFBTSxDQUFFO1FBQ3hGLFFBQVEsQ0FBQyxjQUFjLENBQUMsNEJBQTRCLENBQUMsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDO1FBQ2xFLE9BQU8sQ0FBQyxHQUFHLENBQUUsNkJBQTZCLEVBQUUsR0FBRyxDQUFFLENBQUM7SUFDdEQsQ0FBQzs7SUFFRCxtQ0FBWSxHQUFaLFVBQWMsQ0FBQyxFQUFFLENBQUM7UUFDZCxFQUFFLENBQUMsQ0FBRSxDQUFDLElBQUksQ0FBRSxDQUFDO1lBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztJQUM5QixDQUFDOztJQUVELG9DQUFhLEdBQWIsVUFBZSxTQUFTLEVBQUUsUUFBbUI7UUFBN0MsaUJBR0M7UUFIeUIsd0JBQW1CLEdBQW5CLG1CQUFtQjtRQUN6QyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxHQUFHLFNBQVMsQ0FBQztRQUNyQyxVQUFVLENBQUUsY0FBSyxPQUFBLEtBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxFQUE3QixDQUE2QixFQUFFLElBQUksQ0FBRSxDQUFDO0lBQzNELENBQUM7O0lBRUQseUNBQWtCLEdBQWxCLFVBQW1CLElBQUk7UUFDbkIsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUUsVUFBQSxJQUFJLElBQUksT0FBQSxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksRUFBakIsQ0FBaUIsQ0FBQyxDQUFDO1FBQzNELG1CQUFtQjtRQUNuQixNQUFNLENBQUMsR0FBRyxDQUFDO0lBQ2YsQ0FBQzs7SUFFRCx5Q0FBa0IsR0FBbEIsVUFBb0IsU0FBUztRQUN6QixJQUFJLENBQUMsa0JBQWtCLEdBQUcsU0FBUyxDQUFDO1FBQ3BDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQztJQUNwRSxDQUFDOztJQUVELHlDQUFrQixHQUFsQixVQUFvQixLQUFLO1FBQ3JCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztJQUNoQyxDQUFDOztJQUVELCtDQUF3QixHQUF4QixVQUEwQixJQUFJO1FBQ3pCLE1BQU0sQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBRSxVQUFBLEtBQUssSUFBSSxPQUFBLEtBQUssQ0FBQyxJQUFJLElBQUksSUFBSSxFQUFsQixDQUFrQixDQUFFLENBQUM7SUFDN0UsQ0FBQzs7SUFFRCxxQ0FBYyxHQUFkLFVBQWUsSUFBSTtRQUNmLE1BQU0sQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBRSxVQUFBLEtBQUssSUFBSSxPQUFBLEtBQUssQ0FBQyxJQUFJLElBQUksSUFBSSxFQUFsQixDQUFrQixDQUFFLENBQUM7SUFDNUUsQ0FBQzs7SUFFRCwwQ0FBbUIsR0FBbkI7UUFDSSxJQUFJLFVBQVUsR0FBRyxFQUFFLENBQUM7UUFDcEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsVUFBUyxFQUFFO1lBQy9CLFVBQVUsR0FBTyxVQUFVLFNBQUUsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQzNDLENBQUMsQ0FBQyxDQUFDO1FBQ0gsNEJBQTRCO1FBQzVCLE1BQU0sQ0FBQyxVQUFVLENBQUM7SUFDdEIsQ0FBQzs7SUFHRCxzQ0FBZSxHQUFmLFVBQWtCLElBQXNCO1FBQXRCLG9CQUFzQixHQUF0QixPQUFPLElBQUksQ0FBQyxVQUFVO1FBQ3BDLHNCQUFzQjtRQUN0QixJQUFJLFlBQVksR0FBRyxFQUFFLENBQUM7UUFDdEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFTLEVBQUU7WUFDcEIsRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNyQyxFQUFFLENBQUMsS0FBSztnQkFDUixFQUFFLENBQUMsS0FBSyxJQUFJLE1BQU8sQ0FBQyxDQUFBLENBQUM7Z0JBQ3JCLFlBQVksR0FBUSxZQUFZLFNBQUUsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ2pELENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUNILDhCQUE4QjtRQUM5QixNQUFNLENBQUMsWUFBWSxDQUFDO0lBQ3hCLENBQUM7O0lBRUQsd0NBQWlCLEdBQWpCLFVBQW1CLFFBQVE7UUFDdkIsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBRSxRQUFRLENBQUUsQ0FBQztRQUMzQyx3REFBd0Q7UUFDeEQsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUM7SUFDdEIsQ0FBQzs7SUFFRCxvQ0FBYSxHQUFiO1FBQ0ksMERBQTBEO1FBRDlELGlCQW9DQztRQWpDRyxFQUFFLENBQUMsQ0FBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSyxDQUFDLENBQUMsQ0FBQztZQUN6QixJQUFJLENBQUMsYUFBYSxDQUFFLDhCQUE4QixFQUFFLFdBQVcsQ0FBRSxDQUFDO1lBQ2xFLE9BQU8sQ0FBQyxHQUFHLENBQUUsdUJBQXVCLENBQUUsQ0FBQztZQUN2QyxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ2pCLENBQUM7UUFDRCxFQUFFLENBQUMsQ0FBRSxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzdDLElBQUksQ0FBQyxhQUFhLENBQUUsMEJBQTBCLEVBQUUsV0FBVyxDQUFFLENBQUM7WUFDOUQsT0FBTyxDQUFDLEdBQUcsQ0FBRSx5QkFBeUIsQ0FBRSxDQUFDO1lBQ3pDLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDakIsQ0FBQztRQUVELElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUN4QyxzRUFBc0U7UUFDdEUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksR0FBTyxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxTQUFFLElBQUksQ0FBQyxTQUFTLEVBQUMsQ0FBQztRQUVqRixFQUFFLENBQUMsQ0FBRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsS0FBSyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDdkMsSUFBSSxDQUFDLHNCQUFzQixFQUFFLENBQUM7WUFDOUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQy9DLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDckIsQ0FBQztRQUNELElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUMvQywrQ0FBK0M7UUFDL0MsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsaUJBQWlCLEVBQUM7WUFDekMsRUFBRSxFQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHO1lBQ2hDLElBQUksRUFBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSTtZQUNuQyxLQUFLLEVBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEtBQUs7WUFDckMsSUFBSSxFQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJO1NBQ3RDLENBQUM7WUFDRSxTQUFTLENBQUUsVUFBQSxHQUFHO1lBQ1YsT0FBTyxDQUFDLEdBQUcsQ0FBRSxRQUFRLEVBQUcsR0FBRyxDQUFFLENBQUM7WUFDOUIsRUFBRSxDQUFDLENBQUUsQ0FBQyxHQUFHLENBQUMsS0FBTSxDQUFDO2dCQUFDLEtBQUksQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQztZQUNuRCxPQUFPLENBQUMsR0FBRyxDQUFFLEtBQUssRUFBRSxLQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFFLENBQUM7UUFDM0QsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDOztJQUVELDZDQUFzQixHQUF0QjtRQUFBLGlCQVNDO1FBUlcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsMkJBQTJCLEVBQUM7WUFDL0MsS0FBSyxFQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLO1lBQ3JDLEtBQUssRUFBRyxJQUFJLENBQUMsU0FBUztTQUM3QixDQUFDO1lBQ0YsU0FBUyxDQUFFLFVBQUEsR0FBRztZQUNOLE9BQU8sQ0FBQyxHQUFHLENBQUUsWUFBWSxFQUFHLEdBQUcsQ0FBRSxDQUFDO1lBQ2xDLEVBQUUsQ0FBQyxDQUFFLENBQUMsR0FBRyxDQUFDLEtBQU0sQ0FBQztnQkFBQyxLQUFJLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUM7UUFDM0QsQ0FBQyxDQUFDLENBQUM7SUFDZixDQUFDOztJQUVELG1DQUFZLEdBQVosVUFBYyxFQUFFO1FBQWhCLGlCQXlCQztRQXhCRyw4Q0FBOEM7UUFDOUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUUsVUFBQyxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUc7WUFDL0MsRUFBRSxDQUFBLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxFQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNoQixLQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDaEQsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLENBQUUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEtBQUssSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ3ZDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUMvQixNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ3JCLENBQUM7UUFFRCxxREFBcUQ7UUFDckQsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsaUJBQWlCLEVBQUM7WUFDekMsRUFBRSxFQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHO1lBQ2hDLElBQUksRUFBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSTtZQUNuQyxLQUFLLEVBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEtBQUs7WUFDckMsSUFBSSxFQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJO1NBQ3RDLENBQUM7WUFDRSxTQUFTLENBQUUsVUFBQSxHQUFHO1lBQ1YsT0FBTyxDQUFDLEdBQUcsQ0FBRSxRQUFRLEVBQUcsR0FBRyxDQUFFLENBQUM7WUFDOUIsRUFBRSxDQUFDLENBQUUsQ0FBQyxHQUFHLENBQUMsS0FBTSxDQUFDO2dCQUFDLEtBQUksQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQztRQUMzRCxDQUFDLENBQUMsQ0FBQztJQUVQLENBQUM7O0lBRUQsNENBQXFCLEdBQXJCLFVBQXNCLEVBQUU7UUFBeEIsaUJBVUM7UUFURyxxREFBcUQ7UUFDckQsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsOEJBQThCLEVBQUM7WUFDdEQsS0FBSyxFQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLO1lBQ3JDLEVBQUUsRUFBRSxFQUFFO1NBQ1QsQ0FBQztZQUNFLFNBQVMsQ0FBRSxVQUFBLEdBQUc7WUFDVixPQUFPLENBQUMsR0FBRyxDQUFFLFFBQVEsRUFBRyxHQUFHLENBQUUsQ0FBQztZQUM5QixFQUFFLENBQUMsQ0FBRSxDQUFDLEdBQUcsQ0FBQyxLQUFNLENBQUM7Z0JBQUMsS0FBSSxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDO1FBQzNELENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQzs7SUFJRCxnREFBeUIsR0FBekIsVUFBMkIsS0FBSyxFQUFFLElBQUk7UUFBdEMsaUJBR0M7UUFGRyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBRSxVQUFBLElBQUksSUFBSSxPQUFBLElBQUksQ0FBQyxJQUFJLEtBQUssSUFBSSxJQUFJLEtBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLEtBQUssSUFBSSxFQUEzRCxDQUEyRCxDQUFFLENBQUM7UUFDdkcsS0FBSyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7SUFDdkIsQ0FBQzs7SUFFRCxrREFBMkIsR0FBM0I7UUFDSSxJQUFJLENBQUMsaUNBQWlDLEdBQUcsQ0FBQyxJQUFJLENBQUMsaUNBQWlDLENBQUM7SUFDckYsQ0FBQzs7SUFJRCx1Q0FBZ0IsR0FBaEI7UUFBQSxpQkFvQ0M7UUFuQ0csRUFBRSxDQUFDLENBQUUsQ0FBRSxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUssQ0FBQyxDQUFDLENBQUM7WUFDOUIsSUFBSSxDQUFDLGFBQWEsQ0FBRSx3QkFBd0IsQ0FBRSxDQUFDO1lBQy9DLE9BQU8sQ0FBQyxHQUFHLENBQUUsdUJBQXVCLENBQUUsQ0FBQztZQUN2QyxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ2pCLENBQUM7UUFDRCxFQUFFLENBQUMsQ0FBRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUUsQ0FBQyxDQUFDLENBQUM7WUFDckQsSUFBSSxDQUFDLGFBQWEsQ0FBRSw4QkFBOEIsQ0FBRSxDQUFDO1lBQ3JELE9BQU8sQ0FBQyxHQUFHLENBQUUsNkJBQTZCLENBQUUsQ0FBQztZQUM3QyxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ2pCLENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBRSxDQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBTSxDQUFDO1lBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFFO1FBQ3JFLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUNkLEVBQUUsQ0FBQyxDQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxLQUFLLE1BQU8sQ0FBQyxDQUFBLENBQUM7WUFDdkMsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUUsVUFBQSxJQUFJLElBQUksT0FBQSxJQUFJLENBQUMsS0FBSyxJQUFJLEtBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUF0QyxDQUFzQyxDQUFDLENBQUM7WUFDaEYsRUFBRSxDQUFDLENBQUUsR0FBSSxDQUFDO2dCQUFDLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFFO1FBQ2hDLENBQUM7UUFFRCxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsRUFBRTtZQUMxQyxJQUFJLEVBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJO1lBQzlCLEtBQUssRUFBRyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssSUFBSSxNQUFNO1lBQzFDLElBQUksRUFBRyxJQUFJO1NBQ2IsQ0FBQztZQUNDLFNBQVMsQ0FBRSxVQUFBLEdBQUc7WUFDVixPQUFPLENBQUMsR0FBRyxDQUFFLFNBQVMsRUFBRyxHQUFHLENBQUUsQ0FBQztZQUMvQixFQUFFLENBQUMsQ0FBRSxDQUFDLEdBQUcsQ0FBQyxLQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNmLEtBQUksQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQztnQkFDakMsSUFBSSxTQUFTLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUUsVUFBQSxJQUFJLElBQUksT0FBQSxJQUFJLENBQUMsSUFBSSxJQUFJLEtBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFwQyxDQUFvQyxDQUFDLENBQUM7Z0JBQ3BGLEVBQUUsQ0FBQyxDQUFFLFNBQVUsQ0FBQyxDQUFDLENBQUM7b0JBQ2QsS0FBSSxDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUM7b0JBQ3hCLEtBQUksQ0FBQyxxQkFBcUIsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO29CQUM3QyxLQUFJLENBQUMsa0JBQWtCLENBQUUsU0FBUyxDQUFFLENBQUM7Z0JBQ3pDLENBQUM7WUFDTCxDQUFDO1FBQ1QsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDOztJQUVELHVDQUFnQixHQUFoQixVQUFpQixTQUFTO1FBQTFCLGlCQXFCQztRQW5CRyxFQUFFLENBQUMsQ0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJO1lBQ2hFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsUUFBUSxDQUFFLENBQUMsQ0FBQyxDQUFDO1lBQy9ELElBQUksQ0FBQyxhQUFhLENBQUUsOEJBQThCLEVBQUUsZ0JBQWdCLENBQUUsQ0FBQztZQUN2RSxPQUFPLENBQUMsR0FBRyxDQUFFLDZCQUE2QixDQUFFLENBQUM7WUFDN0MsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNqQixDQUFDO1FBQ0QsRUFBRSxDQUFBLENBQUUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSyxDQUFDLENBQUMsQ0FBQztZQUNwRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLENBQUM7UUFDcEUsQ0FBQztRQUNELElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLGlCQUFpQixFQUFDO1lBQ3pDLEVBQUUsRUFBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsR0FBRztZQUNoQyxJQUFJLEVBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUk7WUFDbkMsS0FBSyxFQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLO1lBQ3JDLElBQUksRUFBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSTtTQUN0QyxDQUFDO1lBQ0UsU0FBUyxDQUFFLFVBQUEsR0FBRztZQUNWLE9BQU8sQ0FBQyxHQUFHLENBQUUsUUFBUSxFQUFHLEdBQUcsQ0FBRSxDQUFDO1lBQzlCLEVBQUUsQ0FBQyxDQUFFLENBQUMsR0FBRyxDQUFDLEtBQU0sQ0FBQztnQkFBQyxLQUFJLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUM7UUFDM0QsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDOztJQUVELHFDQUFjLEdBQWQ7UUFBQSxpQkF1QkM7UUF0QkcsRUFBRSxDQUFDLENBQUUsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsUUFBUTtZQUNoQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxRQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ3RFLElBQUksQ0FBQyxhQUFhLENBQUUsMkJBQTJCLEVBQUUsZ0JBQWdCLENBQUUsQ0FBQztZQUNwRSxPQUFPLENBQUMsR0FBRyxDQUFFLDJCQUEyQixDQUFFLENBQUM7WUFDM0MsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNqQixDQUFDO1FBQ0QsRUFBRSxDQUFBLENBQUUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLENBQ3hELENBQUMsQ0FBQSxDQUFDO1lBQ0YsSUFBSSxDQUFDLGFBQWEsQ0FBRSw4QkFBOEIsRUFBRSxnQkFBZ0IsQ0FBRSxDQUFDO1lBQ3ZFLE9BQU8sQ0FBQyxHQUFHLENBQUUsNkJBQTZCLENBQUUsQ0FBQztZQUM3QyxNQUFNLENBQUM7UUFDWCxDQUFDO1FBQ0QsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsaUJBQWlCLEVBQUU7WUFDMUMsRUFBRSxFQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHO1lBQ2hDLElBQUksRUFBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsUUFBUTtZQUN2QyxLQUFLLEVBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEtBQUs7WUFDckMsSUFBSSxFQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJO1NBQ3JDLENBQUM7WUFDQyxTQUFTLENBQUUsVUFBQSxHQUFHO1lBQ1YsT0FBTyxDQUFDLEdBQUcsQ0FBRSxTQUFTLEVBQUcsR0FBRyxDQUFFLENBQUM7WUFDL0IsRUFBRSxDQUFDLENBQUUsQ0FBQyxHQUFHLENBQUMsS0FBTSxDQUFDO2dCQUFDLEtBQUksQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQztRQUMxRCxDQUFDLENBQUMsQ0FBQztJQUNSLENBQUM7O0lBR0QsdUNBQWdCLEdBQWhCO1FBQUEsaUJBU0M7UUFSRyxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsRUFBRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsR0FBRyxDQUFDO1lBQ3RFLFNBQVMsQ0FBRSxVQUFBLEdBQUc7WUFDVixPQUFPLENBQUMsR0FBRyxDQUFFLFdBQVcsRUFBRyxHQUFHLENBQUUsQ0FBQztZQUNqQyxFQUFFLENBQUMsQ0FBRSxDQUFDLEdBQUcsQ0FBQyxLQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNmLEtBQUksQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQztnQkFDakMsS0FBSSxDQUFDLHFCQUFxQixDQUFFLEtBQUssQ0FBRSxDQUFDO1lBQ3hDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNYLENBQUM7O0lBR0QscUNBQWMsR0FBZDtRQUNJLElBQUksVUFBVSxHQUFHLEVBQUUsQ0FBQztRQUNwQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFTLEVBQUU7WUFDMUIsVUFBVSxHQUFPLFVBQVUsU0FBRSxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDM0MsQ0FBQyxDQUFDLENBQUM7UUFDSCw0QkFBNEI7UUFDNUIsTUFBTSxDQUFDLFVBQVUsQ0FBQztJQUN0QixDQUFDOztJQUdELGdEQUF5QixHQUF6QixVQUEyQixLQUFLO1FBQzVCLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztJQUNoQyxDQUFDOztJQUdELDRDQUFxQixHQUFyQjtRQUFBLGlCQUtDO1FBSkcsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFFLFVBQUEsRUFBRSxJQUFJLE9BQUEsRUFBRSxJQUFJLEtBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUF6QixDQUF5QixDQUFDLElBQUksTUFBTSxDQUFFO1FBQzVGLFFBQVEsQ0FBQyxjQUFjLENBQUMsdUJBQXVCLENBQUM7WUFDNUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLEtBQUssR0FBRyxHQUFHLEdBQUcsRUFBRSxDQUFFO1FBQ3ZFLE9BQU8sQ0FBQyxHQUFHLENBQUUsd0JBQXdCLEVBQUUsR0FBRyxDQUFFLENBQUM7SUFDakQsQ0FBQzs7SUFFRCxvQ0FBYSxHQUFiLFVBQWMsSUFBSTtRQUNkLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFFLFVBQUEsSUFBSSxJQUFJLE9BQUEsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLEVBQWpCLENBQWlCLENBQUMsQ0FBQztRQUN0RCxNQUFNLENBQUMsR0FBRyxDQUFDO0lBQ2YsQ0FBQzs7SUFHRCxvQ0FBYSxHQUFiLFVBQWUsU0FBUztRQUNwQixJQUFJLENBQUMsYUFBYSxHQUFHLFNBQVMsQ0FBQztRQUMvQixJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQztJQUMxRCxDQUFDOztJQUVELGtEQUEyQixHQUEzQixVQUE2QixLQUFLO1FBQzlCLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztJQUN0QyxDQUFDOztJQUVELCtDQUF3QixHQUF4QixVQUF5QixJQUFJO1FBQ3pCLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUUsVUFBQSxLQUFLLElBQUksT0FBQSxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBdkIsQ0FBdUIsQ0FBRSxDQUFDO0lBQzVFLENBQUM7O0lBRUQsK0NBQXdCLEdBQXhCLFVBQXlCLGFBQWEsRUFBRSxjQUFjO1FBQ2xELDJEQUEyRDtRQUMzRCxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxVQUFBLEVBQUUsSUFBTSxNQUFNLENBQUMsRUFBRSxDQUFDLElBQUksS0FBSyxjQUFjLENBQUMsS0FBSyxHQUFHLElBQUksR0FBRyxLQUFLLENBQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsRyxnQ0FBZ0M7UUFDaEMsY0FBYyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7SUFDaEMsQ0FBQzs7SUFFRCx5Q0FBa0IsR0FBbEI7UUFBQSxpQkFrQ0M7UUFqQ0csT0FBTyxDQUFDLEdBQUcsQ0FBRSxJQUFJLENBQUMsY0FBYyxDQUFFLENBQUM7UUFDbkMsRUFBRSxDQUFBLENBQUUsSUFBSSxDQUFDLHdCQUF3QixDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzNELElBQUksQ0FBQyxhQUFhLENBQUUsMEJBQTBCLEVBQUUsZ0JBQWdCLENBQUUsQ0FBQztZQUNuRSxPQUFPLENBQUMsR0FBRyxDQUFFLHdCQUF3QixDQUFFLENBQUM7WUFDeEMsTUFBTSxDQUFDO1FBQ1gsQ0FBQztRQUFBLENBQUM7UUFFRixFQUFFLENBQUEsQ0FBRSxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssSUFBSSxNQUFPLENBQUM7WUFBQyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7UUFDekUsRUFBRSxDQUFBLENBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFNLENBQUMsQ0FBQyxDQUFDO1lBQzdCLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUMzRSxDQUFDO1FBRUQsSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQzdDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxHQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxTQUFFLElBQUksQ0FBQyxjQUFjLEVBQUMsQ0FBQztRQUU1RSxJQUFJLENBQUMsY0FBYyxHQUFHLEVBQUUsQ0FBQztRQUN6QixRQUFRLENBQUMsY0FBYyxDQUFDLDZCQUE2QixDQUFDO1lBQ2xELFFBQVEsQ0FBQyxjQUFjLENBQUMsNkJBQTZCLENBQUMsQ0FBQyxLQUFLLEdBQUcsTUFBTSxHQUFHLEVBQUUsQ0FBRTtRQUdoRixNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBRSxPQUFPLENBQUUsQ0FBQztRQUU5QixJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsRUFBQztZQUN6QyxFQUFFLEVBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEdBQUc7WUFDaEMsSUFBSSxFQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJO1lBQ25DLEtBQUssRUFBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsS0FBSztZQUNyQyxJQUFJLEVBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUk7U0FDdEMsQ0FBQztZQUNFLFNBQVMsQ0FBRSxVQUFBLEdBQUc7WUFDVixPQUFPLENBQUMsR0FBRyxDQUFFLFFBQVEsRUFBRyxHQUFHLENBQUUsQ0FBQztZQUM5QixFQUFFLENBQUMsQ0FBRSxDQUFDLEdBQUcsQ0FBQyxLQUFNLENBQUM7Z0JBQUMsS0FBSSxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDO1lBQ25ELE9BQU8sQ0FBQyxHQUFHLENBQUUsS0FBSyxFQUFFLEtBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUUsQ0FBQztRQUMzRCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7O0lBRUQsa0NBQVcsR0FBWDtRQUFBLGlCQW9DQztRQW5DRyxFQUFFLENBQUMsQ0FBRSxDQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSyxDQUFDLENBQUMsQ0FBQztZQUN6QixJQUFJLENBQUMsYUFBYSxDQUFFLHdCQUF3QixDQUFFLENBQUM7WUFDL0MsT0FBTyxDQUFDLEdBQUcsQ0FBRSx1QkFBdUIsQ0FBRSxDQUFDO1lBQ3ZDLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDakIsQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUUsQ0FBQyxDQUFDLENBQUM7WUFDM0MsSUFBSSxDQUFDLGFBQWEsQ0FBRSx5QkFBeUIsQ0FBRSxDQUFDO1lBQ2hELE9BQU8sQ0FBQyxHQUFHLENBQUUsd0JBQXdCLENBQUUsQ0FBQztZQUN4QyxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ2pCLENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBRSxDQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBTSxDQUFDO1lBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFFO1FBQzNELElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUNkLEVBQUUsQ0FBQyxDQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxLQUFLLE1BQU8sQ0FBQyxDQUFBLENBQUM7WUFDbEMsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUUsVUFBQSxJQUFJLElBQUksT0FBQSxJQUFJLENBQUMsS0FBSyxJQUFJLEtBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFqQyxDQUFpQyxDQUFDLENBQUM7WUFDdEUsRUFBRSxDQUFDLENBQUUsR0FBSSxDQUFDO2dCQUFDLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFFO1FBQ2hDLENBQUM7UUFFRCxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUU7WUFDckMsSUFBSSxFQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSTtZQUN6QixLQUFLLEVBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLElBQUksTUFBTTtZQUNyQyxJQUFJLEVBQUcsSUFBSTtTQUNiLENBQUM7WUFDQyxTQUFTLENBQUUsVUFBQSxHQUFHO1lBQ1YsT0FBTyxDQUFDLEdBQUcsQ0FBRSxTQUFTLEVBQUcsR0FBRyxDQUFFLENBQUM7WUFDL0IsRUFBRSxDQUFDLENBQUUsQ0FBQyxHQUFHLENBQUMsS0FBTSxDQUFDLENBQUMsQ0FBQztnQkFDZixLQUFJLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUM7Z0JBQ3ZCLElBQUksU0FBUyxHQUFHLEtBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFFLFVBQUEsSUFBSSxJQUFJLE9BQUEsSUFBSSxDQUFDLElBQUksSUFBSSxLQUFJLENBQUMsUUFBUSxDQUFDLElBQUksRUFBL0IsQ0FBK0IsQ0FBQyxDQUFDO2dCQUMxRSxFQUFFLENBQUMsQ0FBRSxTQUFVLENBQUMsQ0FBQyxDQUFDO29CQUNkLEtBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO29CQUNuQixLQUFJLENBQUMscUJBQXFCLENBQUMsV0FBVyxDQUFDLENBQUM7b0JBQ3hDLEtBQUksQ0FBQyxhQUFhLENBQUUsU0FBUyxDQUFFLENBQUM7Z0JBQ3BDLENBQUM7WUFDTCxDQUFDO1FBQ1QsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDOztJQUlMOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01Bb1NFO0lBSUUsbUJBQW1CO0lBQ25CLGtDQUFXLEdBQVg7UUFDSTtZQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQztpQkFDM0MsUUFBUSxDQUFDLEVBQUUsQ0FBQztpQkFDWixTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEIsQ0FBQztRQUNILE1BQU0sQ0FBQyxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsR0FBRyxHQUFHLEdBQUcsRUFBRSxFQUFFLEdBQUcsR0FBRyxHQUFHLEVBQUUsRUFBRSxHQUFHLEdBQUc7WUFDekMsRUFBRSxFQUFFLEdBQUcsR0FBRyxHQUFHLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDO0lBQzNDLENBQUM7O0lBRUQscUNBQXFDO0lBQ3JDLCtCQUFRLEdBQVIsVUFBUyxNQUFXO1FBQ2hCLElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNwQixFQUFFLENBQUMsQ0FBQyxNQUFNLElBQUksT0FBTyxNQUFNLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztZQUN2QyxNQUFNLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLGdCQUFnQixHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUM7WUFDL0UsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDbkIsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDekMsQ0FBQztRQUNMLENBQUM7UUFDRCxNQUFNLENBQUMsTUFBTSxDQUFDO0lBQ2xCLENBQUM7O0lBanhCTDtRQUFDLGdCQUFTLENBQUM7WUFDUCxRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7WUFDbkIsUUFBUSxFQUFFLFFBQVE7WUFDbEIsV0FBVyxFQUFFLG1CQUFtQjtZQUNoQyxTQUFTLEVBQUUsQ0FBQyxlQUFlLENBQUM7WUFDNUIsU0FBUyxFQUFFLENBQUMsZ0NBQWMsQ0FBQztZQUMzQixLQUFLLEVBQUUsQ0FBQyxzQ0FBaUIsRUFBRSxrQ0FBZSxDQUFDO1NBQzlDLENBQUM7O29CQUFBO0lBK3dCRixtQkFBQztBQUFELENBOXdCQSxBQTh3QkMsSUFBQTtBQTl3Qlksb0JBQVksZUE4d0J4QixDQUFBO0FBR0Q7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQTRERSIsImZpbGUiOiJjb21wb25lbnRzL2FwcC5jb21wb25lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbmltcG9ydCB7U3RvcmFnZVNlcnZpY2V9IGZyb20gXCIuLi9zZXJ2aWNlcy9zdG9yYWdlLnNlcnZpY2VcIjtcclxuXHJcbmltcG9ydCB7T2JqZWN0VG9BcnJheVBpcGV9IGZyb20gXCIuLi9waXBlcy9vYmplY3RUb0FycmF5LnBpcGVcIjtcclxuaW1wb3J0IHtzb3J0QnlHcm91cFBpcGV9IGZyb20gXCIuLi9waXBlcy9zb3J0QnlHcm91cC5waXBlXCI7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICAgIG1vZHVsZUlkOiBtb2R1bGUuaWQsIFxyXG4gICAgc2VsZWN0b3I6ICdteS1hcHAnLFxyXG4gICAgdGVtcGxhdGVVcmw6ICdhcHAudGVtcGxhdGUuaHRtbCcsXHJcbiAgICBzdHlsZVVybHM6IFsnYXBwLnN0eWxlLmNzcyddLFxyXG4gICAgcHJvdmlkZXJzOiBbU3RvcmFnZVNlcnZpY2VdLFxyXG4gICAgcGlwZXM6IFtPYmplY3RUb0FycmF5UGlwZSwgc29ydEJ5R3JvdXBQaXBlXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgQXBwQ29tcG9uZW50IHtcclxuICAgIC8vcHVibGljIG5ld19jb21wb25lbnQgPSB0aGlzLmluaXRfbmV3X2NvbXBvbmVudCgpO1xyXG4gICAgcHVibGljIGNvbXBvbmVudHMgPSBbXTtcclxuICAgIHB1YmxpYyBwYWdlcyA9IFtdO1xyXG4gICAgcHVibGljIHBhcnRfY3VycmVudF92aWV3ID0gJ2FsbCc7XHJcbiAgICAvL3B1YmxpYyBjb21wb25lbnRfZWRpdGFibGUgPSBbXTtcclxuICAgIHB1YmxpYyBuZXdfZmllbGQgPSB7IHR5cGU6IFwic3RyaW5nXCIgfTsgICBcclxuICAgIC8vcHVibGljIG5ld19ncm91cCA9IFtdO1xyXG5cclxuICAgIHB1YmxpYyBuZXdfY29tcG9uZW50ID0gW107XHJcbiAgICAvL3B1YmxpYyBjcmVhdGVfY29tcG9uZW50X2dyb3VwID0gJyc7XHJcbiAgICBwdWJsaWMgZXJyb3JfbXNnID0gW107XHJcbiAgICBwdWJsaWMgbmV3X3BhZ2UgPSBbXTtcclxuICAgIHB1YmxpYyBuZXdfcGFnZV9maWVsZCA9IHt9OyAgXHJcblxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBzdG9yYWdlU2VydmljZTogU3RvcmFnZVNlcnZpY2UpIHt9XHJcblxyXG4gICAgbmdPbkluaXQoKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ25nT25Jbml0Jyk7XHJcbiAgICAgICAgdGhpcy5nZXRfYWxsX2NvbXBvbmVudHMoKTtcclxuICAgICAgICB0aGlzLmdldF9hbGxfcGFnZXMoKTtcclxuICAgIH07XHJcblxyXG4gICAgZ2V0X2FsbF9jb21wb25lbnRzKCkge1xyXG4gICAgICAgIHRoaXMuc3RvcmFnZVNlcnZpY2Uuc2VsZWN0KCcvYXBpL2NvbXBvbmVudHMnICkuXHJcbiAgICAgICAgICAgIHN1YnNjcmliZSggcmVzID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCAnZ2V0IC0gJyAsIHJlcyApO1xyXG4gICAgICAgICAgICAgICAgaWYoICFyZXMuZXJyb3IgKSB0aGlzLmNvbXBvbmVudHMgPSByZXMuY29tcG9uZW50cztcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGdldF9hbGxfcGFnZXMoKSB7XHJcbiAgICAgICAgdGhpcy5zdG9yYWdlU2VydmljZS5zZWxlY3QoJy9hcGkvcGFnZXMnICkuXHJcbiAgICAgICAgICAgIHN1YnNjcmliZSggcmVzID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCAnZ2V0IC0gJyAsIHJlcyApO1xyXG4gICAgICAgICAgICAgICAgaWYoICFyZXMuZXJyb3IgKSB0aGlzLnBhZ2VzID0gcmVzLnBhZ2VzO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgc2V0X2N1cnJlbnRfdmlldyggdmlldyApe1xyXG4gICAgICAgIHRoaXMuY3VycmVudF92aWV3ID0gdmlldztcclxuICAgICAgICB0aGlzLnBhcnRfY3VycmVudF92aWV3ID0gXCJhbGxcIjtcclxuICAgIH07XHJcbiAgICBcclxuICAgIHNldF9wYXJ0X2N1cnJlbnRfdmlldyggdmlldyApIHtcclxuICAgICAgICBpZiAoIHZpZXcgPT0gJ2FsbCcpIHtcclxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dyb3VwX3NlbGVjdCcpID8gXHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ3JvdXBfc2VsZWN0JykudmFsdWUgPSAnbm9uZScgOiAnJztcclxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbGxlY3Rpb25fc2VsZWN0JykgPyBcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb2xsZWN0aW9uX3NlbGVjdCcpLnZhbHVlID0gJ25vbmUnIDogJyc7ICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucGFydF9jdXJyZW50X3ZpZXcgPSB2aWV3O1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCAnIHBhcnRfY3VycmVudF92aWV3ICcsIHRoaXMucGFydF9jdXJyZW50X3ZpZXcgKTsgICAgICAgXHJcbiAgICB9O1xyXG5cclxuICAgIHNldF9zb3J0ZWRfcGFydF9jdXJyZW50X3ZpZXcoIHNvcnQgKXtcclxuICAgICAgICB0aGlzLnBhcnRfY3VycmVudF92aWV3ID0gJ3NvcnRlZF92aWV3JztcclxuICAgICAgICB0aGlzLnNvcnRlZF9ieV92YWx1ZSA9IHNvcnQ7IFxyXG4gICAgICAgIGNvbnNvbGUubG9nKCB0aGlzLnNvcnRlZF9ieV92YWx1ZSApOyBcclxuICAgIH07XHJcblxyXG4gICAgc2V0X25ld19jb21wb25lbnRfZ3JvdXBfc2VsZWN0KCB2YWx1ZSApIHtcclxuICAgICAgICB0aGlzLm5ld19jb21wb25lbnQuZ3JvdXAgPSB2YWx1ZTtcclxuICAgIH07XHJcblxyXG4gICAgY2hhbmdlX25ld19jb21wb25lbnRfZ3JvdXAoKSB7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyggJ2tleXVwIHZhbCAnLCB0aGlzLmNyZWF0ZV9jb21wb25lbnRfZ3JvdXAgKTtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKCAnYSBsIGwgJywgdGhpcy5hbGxfZ3JvdXBzX25hbWUoKSApO1xyXG4gICAgICAgIGxldCByZXMgPSB0aGlzLmFsbF9ncm91cHNfbmFtZSgpLmZpbmQoIGVsID0+IGVsID09IHRoaXMubmV3X2NvbXBvbmVudC5ncm91cCkgfHwgJ25vbmUnIDtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmV3X2NvbXBvbmVudF9ncm91cF9zZWxlY3QnKS52YWx1ZSA9IHJlcztcclxuICAgICAgICBjb25zb2xlLmxvZyggJ25ld19jb21wb25lbnRfZ3JvdXBfc2VsZWN0ICcsIHJlcyApOyBcclxuICAgIH07XHJcblxyXG4gICAgY2hvb3Nlbl9tZW51KCBhLCBiICl7XHJcbiAgICAgICAgaWYgKCBhID09IGIgKSByZXR1cm4gdHJ1ZTtcclxuICAgIH07XHJcblxyXG4gICAgc2V0X2Vycm9yX21zZyggZXJyb3JfbXNnLCBsb2NhdGlvbiA9ICdnbG9iYWwnICl7XHJcbiAgICAgICAgdGhpcy5lcnJvcl9tc2dbbG9jYXRpb25dID0gZXJyb3JfbXNnO1xyXG4gICAgICAgIHNldFRpbWVvdXQoICgpPT4gdGhpcy5lcnJvcl9tc2dbbG9jYXRpb25dID0gJycsIDMwMDAgKTtcclxuICAgIH07XHJcblxyXG4gICAgaXNfY29tcG9uZW50X2V4aXN0KG5hbWUpe1xyXG4gICAgICAgIGxldCByZXMgPSB0aGlzLmNvbXBvbmVudHMuZmluZCggY29tcCA9PiBjb21wLm5hbWUgPT0gbmFtZSk7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhyZXMpO1xyXG4gICAgICAgIHJldHVybiByZXM7XHJcbiAgICB9O1xyXG5cclxuICAgIHNldF9lZGl0X2NvbXBvbmVudCggZWRpdF9jb21wICkge1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50X2VkaXRhYmxlID0gZWRpdF9jb21wO1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLm5ld19uYW1lID0gdGhpcy5jb21wb25lbnRfZWRpdGFibGUubmFtZTtcclxuICAgIH07XHJcblxyXG4gICAgc2V0X25ld19maWVsZF90eXBlKCB2YWx1ZSApIHtcclxuICAgICAgICB0aGlzLm5ld19maWVsZC50eXBlID0gdmFsdWU7XHJcbiAgICB9O1xyXG5cclxuICAgIHNob3dfaWZfdHlwZV9maWVsZF9leGlzdCggdHlwZSApIHtcclxuICAgICAgICAgcmV0dXJuIHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLmJvZHkuZmluZCggZmllbGQgPT4gZmllbGQudHlwZSA9PSB0eXBlICk7XHJcbiAgICB9O1xyXG5cclxuICAgIGlzX2ZpZWxkX2V4aXN0KG5hbWUpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZS5ib2R5LmZpbmQoIGZpZWxkID0+IGZpZWxkLm5hbWUgPT0gbmFtZSApO1xyXG4gICAgfTsgIFxyXG5cclxuICAgIGFsbF9jb21wb25lbnRzX25hbWUgKCl7XHJcbiAgICAgICAgbGV0IGNvbXBfbmFtZXMgPSBbXTtcclxuICAgICAgICB0aGlzLmNvbXBvbmVudHMuZm9yRWFjaChmdW5jdGlvbihlbCl7XHJcbiAgICAgICAgICAgIGNvbXBfbmFtZXMgPSBbLi4uY29tcF9uYW1lcywgZWwubmFtZSBdO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coIGNvbXBfbmFtZXMgKTtcclxuICAgICAgICByZXR1cm4gY29tcF9uYW1lczsgXHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICBhbGxfZ3JvdXBzX25hbWUgKCBkYXRhID0gdGhpcy5jb21wb25lbnRzICl7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyggZGF0YSApO1xyXG4gICAgICAgIGxldCBncm91cHNfbmFtZXMgPSBbXTtcclxuICAgICAgICBkYXRhLmZvckVhY2goZnVuY3Rpb24oZWwpe1xyXG4gICAgICAgICAgICBpZiAoZ3JvdXBzX25hbWVzLmluZGV4T2YoZWwuZ3JvdXApID09PSAtMSAmJlxyXG4gICAgICAgICAgICAgICAgZWwuZ3JvdXAgJiYgXHJcbiAgICAgICAgICAgICAgICBlbC5ncm91cCAhPSAnbm9uZScgKXtcclxuICAgICAgICAgICAgICAgIGdyb3Vwc19uYW1lcyA9IFsgLi4uZ3JvdXBzX25hbWVzLCBlbC5ncm91cCBdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyggZ3JvdXBzX25hbWVzICk7XHJcbiAgICAgICAgcmV0dXJuIGdyb3Vwc19uYW1lczsgXHJcbiAgICB9O1xyXG5cclxuICAgIHNob3dfZ3JvdXBfc2VsZWN0KCBzZWxlY3RlZCApIHtcclxuICAgICAgICBsZXQgYXJyID0gdGhpcy5hbGxfZ3JvdXBzX25hbWUoIHNlbGVjdGVkICk7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyggc2VsZWN0ZWQsICcgJyAsIGFyciAsICcgJyAsIGFyci5sZW5ndGggKTtcclxuICAgICAgICByZXR1cm4gYXJyLmxlbmd0aDtcclxuICAgIH07XHJcblxyXG4gICAgYWRkX25ld19maWVsZCgpIHtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKCB0aGlzLm5ld19maWVsZCwgIHRoaXMuY29tcG9uZW50X2VkaXRhYmxlICk7XHJcblxyXG4gICAgICAgIGlmICggIXRoaXMubmV3X2ZpZWxkLm5hbWUgKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0X2Vycm9yX21zZyggJyBObyBmaWVsZCBuYW1lIHdhcyBwcm92aWRlZCAnLCAnbmV3X2ZpZWxkJyApOyBcclxuICAgICAgICAgICAgY29uc29sZS5sb2coICdObyBuYW1lIHdhcyBwcm92aWRlZCAnICk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCB0aGlzLmlzX2ZpZWxkX2V4aXN0KHRoaXMubmV3X2ZpZWxkLm5hbWUpICkge1xyXG4gICAgICAgICAgICB0aGlzLnNldF9lcnJvcl9tc2coICdPbmUgZmllbGQgaGFzIHRoaXMgbmFtZSAnLCAnbmV3X2ZpZWxkJyApOyBcclxuICAgICAgICAgICAgY29uc29sZS5sb2coICdPbmUgZmlsZWQgaGFzIHRoaXMgbmFtZScgKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlOyAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5uZXdfZmllbGQuX2lkID0gdGhpcy5jcmVhdGVfZ3VpZCgpOyAgXHJcbiAgICAgICAgLy9kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmV3LWZpZWxkLWlkJykudmFsdWUgPSB0aGlzLm5ld19maWVsZC50eXBlO1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLmJvZHkgPSBbLi4udGhpcy5jb21wb25lbnRfZWRpdGFibGUuYm9keSwgdGhpcy5uZXdfZmllbGRdO1xyXG5cclxuICAgICAgICBpZiAoIHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLmdyb3VwICE9ICdub25lJykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRfbmV3X2ZpZWxkX3RvX2dyb3VwKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm5ld19maWVsZCA9IHsgdHlwZTogdGhpcy5uZXdfZmllbGQudHlwZSB9O1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLm5ld19maWVsZCA9IHsgdHlwZTogdGhpcy5uZXdfZmllbGQudHlwZSB9O1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coICB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZS5ib2R5ICk7XHJcbiAgICAgICAgdGhpcy5zdG9yYWdlU2VydmljZS51cGRhdGUoJy9hcGkvY29tcG9uZW50cycse1xyXG4gICAgICAgICAgICBpZCA6IHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLl9pZCxcclxuICAgICAgICAgICAgbmFtZSA6IHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLm5hbWUsXHJcbiAgICAgICAgICAgIGdyb3VwIDogdGhpcy5jb21wb25lbnRfZWRpdGFibGUuZ3JvdXAsXHJcbiAgICAgICAgICAgIGJvZHkgOiB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZS5ib2R5XHJcbiAgICAgICAgfSkuXHJcbiAgICAgICAgICAgIHN1YnNjcmliZSggcmVzID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCAncHV0IC0gJyAsIHJlcyApO1xyXG4gICAgICAgICAgICAgICAgaWYgKCAhcmVzLmVycm9yICkgdGhpcy5jb21wb25lbnRzID0gcmVzLmNvbXBvbmVudHM7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggJyBiICcsIHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLmJvZHkgKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgYWRkX25ld19maWVsZF90b19ncm91cCgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RvcmFnZVNlcnZpY2UudXBkYXRlKCcvYXBpL2NvbXBvbmVudHMvZ3JvdXAvYWRkJyx7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwIDogdGhpcy5jb21wb25lbnRfZWRpdGFibGUuZ3JvdXAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkIDogdGhpcy5uZXdfZmllbGRcclxuICAgICAgICAgICAgICAgIH0pLlxyXG4gICAgICAgICAgICAgICAgc3Vic2NyaWJlKCByZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggJ2FsbCBwdXQgLSAnICwgcmVzICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICggIXJlcy5lcnJvciApIHRoaXMuY29tcG9uZW50cyA9IHJlcy5jb21wb25lbnRzO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGRlbGV0ZV9maWVsZCggaWQgKXtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKCB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZS5ib2R5ICk7XHJcbiAgICAgICAgdGhpcy5jb21wb25lbnRfZWRpdGFibGUuYm9keS5mb3JFYWNoKCAoZWwsIGlkeCwgYXJyKSA9PiB7IFxyXG4gICAgICAgICAgICBpZihlbC5faWQgPT09IGlkICkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb21wb25lbnRfZWRpdGFibGUuYm9keS5zcGxpY2UoaWR4LCAxKTtcclxuICAgICAgICAgICAgfSBcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKCB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZS5ncm91cCAhPSAnbm9uZScpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGVsZXRlX2ZpZWxkX3RvX2dyb3VwKGlkKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyggdGhpcy5jb21wb25lbnRfZWRpdGFibGUuYm9keSApIDsgICAgICBcclxuICAgICAgICB0aGlzLnN0b3JhZ2VTZXJ2aWNlLnVwZGF0ZSgnL2FwaS9jb21wb25lbnRzJyx7XHJcbiAgICAgICAgICAgIGlkIDogdGhpcy5jb21wb25lbnRfZWRpdGFibGUuX2lkLFxyXG4gICAgICAgICAgICBuYW1lIDogdGhpcy5jb21wb25lbnRfZWRpdGFibGUubmFtZSxcclxuICAgICAgICAgICAgZ3JvdXAgOiB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZS5ncm91cCxcclxuICAgICAgICAgICAgYm9keSA6IHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLmJvZHlcclxuICAgICAgICB9KS5cclxuICAgICAgICAgICAgc3Vic2NyaWJlKCByZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coICdwdXQgLSAnICwgcmVzICk7XHJcbiAgICAgICAgICAgICAgICBpZiAoICFyZXMuZXJyb3IgKSB0aGlzLmNvbXBvbmVudHMgPSByZXMuY29tcG9uZW50cztcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIGRlbGV0ZV9maWVsZF90b19ncm91cChpZCkge1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coIHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLmJvZHkgKSA7ICAgICAgXHJcbiAgICAgICAgdGhpcy5zdG9yYWdlU2VydmljZS51cGRhdGUoJy9hcGkvY29tcG9uZW50cy9ncm91cC9kZWxldGUnLHtcclxuICAgICAgICAgICAgZ3JvdXAgOiB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZS5ncm91cCwgXHJcbiAgICAgICAgICAgIGlkOiBpZFxyXG4gICAgICAgIH0pLlxyXG4gICAgICAgICAgICBzdWJzY3JpYmUoIHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggJ3B1dCAtICcgLCByZXMgKTtcclxuICAgICAgICAgICAgICAgIGlmICggIXJlcy5lcnJvciApIHRoaXMuY29tcG9uZW50cyA9IHJlcy5jb21wb25lbnRzO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcblxyXG5cclxuICAgIHNldF9jb21wb25lbnRfZmllbGRfdmFsdWUoIGZpZWxkLCBuYW1lICl7XHJcbiAgICAgICAgbGV0IGNvbXAgPSB0aGlzLmNvbXBvbmVudHMuZmluZCggY29tcCA9PiBjb21wLm5hbWUgPT09IG5hbWUgJiYgdGhpcy5jb21wb25lbnRfZWRpdGFibGUubmFtZSAhPT0gbmFtZSApO1xyXG4gICAgICAgIGZpZWxkLnZhbHVlID0gY29tcDtcclxuICAgIH07XHJcblxyXG4gICAgc2hvd19qc29uX29mX2VkaXRfY29tcG9uZW50KCl7XHJcbiAgICAgICAgdGhpcy5qc29uX29mX2VkaXRfY29tcG9uZW50X2lzX3Zpc2libGUgPSAhdGhpcy5qc29uX29mX2VkaXRfY29tcG9uZW50X2lzX3Zpc2libGU7XHJcbiAgICB9O1xyXG5cclxuICAgIFxyXG5cclxuICAgIGNyZWF0ZV9jb21wb25lbnQoKXtcclxuICAgICAgICBpZiAoICEgdGhpcy5uZXdfY29tcG9uZW50Lm5hbWUgKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0X2Vycm9yX21zZyggJyBObyBuYW1lIHdhcyBwcm92aWRlZCAnICk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCAnTm8gbmFtZSB3YXMgcHJvdmlkZWQgJyApO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICggdGhpcy5pc19jb21wb25lbnRfZXhpc3QodGhpcy5uZXdfY29tcG9uZW50Lm5hbWUpICkge1xyXG4gICAgICAgICAgICB0aGlzLnNldF9lcnJvcl9tc2coICdPbmUgY29tcG9uZW50IGhhcyB0aGlzIG5hbWUgJyApOyBcclxuICAgICAgICAgICAgY29uc29sZS5sb2coICdPbmUgY29tcG9uZW50IGhhcyB0aGlzIG5hbWUnICk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTsgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCAhIHRoaXMubmV3X2NvbXBvbmVudC5ncm91cCApIHRoaXMubmV3X2NvbXBvbmVudC5ncm91cCA9ICdub25lJyA7XHJcbiAgICAgICAgbGV0IGJvZHkgPSBbXTtcclxuICAgICAgICBpZiAoIHRoaXMubmV3X2NvbXBvbmVudC5ncm91cCAhPT0gJ25vbmUnICl7XHJcbiAgICAgICAgICAgIGxldCByZXMgPSB0aGlzLmNvbXBvbmVudHMuZmluZCggY29tcCA9PiBjb21wLmdyb3VwID09IHRoaXMubmV3X2NvbXBvbmVudC5ncm91cCk7XHJcbiAgICAgICAgICAgIGlmICggcmVzICkgYm9keSA9IHJlcy5ib2R5IDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuc3RvcmFnZVNlcnZpY2UuaW5zZXJ0KCcvYXBpL2NvbXBvbmVudHMnLCB7XHJcbiAgICAgICAgICAgIG5hbWUgOiB0aGlzLm5ld19jb21wb25lbnQubmFtZSxcclxuICAgICAgICAgICAgZ3JvdXAgOiB0aGlzLm5ld19jb21wb25lbnQuZ3JvdXAgfHwgJ25vbmUnLFxyXG4gICAgICAgICAgICBib2R5IDogYm9keVxyXG4gICAgICAgICB9KS5cclxuICAgICAgICAgICAgc3Vic2NyaWJlKCByZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coICdwb3N0IC0gJyAsIHJlcyApO1xyXG4gICAgICAgICAgICAgICAgaWYgKCAhcmVzLmVycm9yICkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29tcG9uZW50cyA9IHJlcy5jb21wb25lbnRzO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBlZGl0X2NvbXAgPSB0aGlzLmNvbXBvbmVudHMuZmluZCggY29tcCA9PiBjb21wLm5hbWUgPT0gdGhpcy5uZXdfY29tcG9uZW50Lm5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICggZWRpdF9jb21wICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5ld19jb21wb25lbnQgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRfcGFydF9jdXJyZW50X3ZpZXcoJ2VkaXQtY29tcG9uZW50Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0X2VkaXRfY29tcG9uZW50KCBlZGl0X2NvbXAgKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGNoYW5nZV9jb21wb25lbnQoY29tcG9uZW50KXtcclxuXHJcbiAgICAgICAgaWYgKCAgdGhpcy5jb21wb25lbnRfZWRpdGFibGUubmV3X25hbWUgIT0gdGhpcy5jb21wb25lbnRfZWRpdGFibGUubmFtZSAmJiBcclxuICAgICAgICAgICAgICB0aGlzLmlzX2NvbXBvbmVudF9leGlzdCh0aGlzLmNvbXBvbmVudF9lZGl0YWJsZS5uZXdfbmFtZSkgKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0X2Vycm9yX21zZyggJ09uZSBjb21wb25lbnQgaGFzIHRoaXMgbmFtZSAnLCAnZWRpdC1jb21wb25lbnQnICk7IFxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyggJ09uZSBjb21wb25lbnQgaGFzIHRoaXMgbmFtZScgKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlOyAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKCB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZS5uZXdfbmFtZSAhPSB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZS5uYW1lICkge1xyXG4gICAgICAgICAgICB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZS5uYW1lID0gdGhpcy5jb21wb25lbnRfZWRpdGFibGUubmV3X25hbWU7IFxyXG4gICAgICAgIH0gICBcclxuICAgICAgICB0aGlzLnN0b3JhZ2VTZXJ2aWNlLnVwZGF0ZSgnL2FwaS9jb21wb25lbnRzJyx7XHJcbiAgICAgICAgICAgIGlkIDogdGhpcy5jb21wb25lbnRfZWRpdGFibGUuX2lkLFxyXG4gICAgICAgICAgICBuYW1lIDogdGhpcy5jb21wb25lbnRfZWRpdGFibGUubmFtZSxcclxuICAgICAgICAgICAgZ3JvdXAgOiB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZS5ncm91cCxcclxuICAgICAgICAgICAgYm9keSA6IHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLmJvZHlcclxuICAgICAgICB9KS5cclxuICAgICAgICAgICAgc3Vic2NyaWJlKCByZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coICdwdXQgLSAnICwgcmVzICk7XHJcbiAgICAgICAgICAgICAgICBpZiAoICFyZXMuZXJyb3IgKSB0aGlzLmNvbXBvbmVudHMgPSByZXMuY29tcG9uZW50cztcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgY29weV9jb21wb25lbnQoKSB7XHJcbiAgICAgICAgaWYgKCAhdGhpcy5jb21wb25lbnRfZWRpdGFibGUubmV3X25hbWUgfHxcclxuICAgICAgICAgICAgICB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZS5uYW1lID09IHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLm5ld19uYW1lICkge1xyXG4gICAgICAgICAgICB0aGlzLnNldF9lcnJvcl9tc2coICdObyBuZXcgbmFtZSB3YXMgcHJvdmlkZWQgJywgJ2VkaXQtY29tcG9uZW50JyApOyBcclxuICAgICAgICAgICAgY29uc29sZS5sb2coICdObyBuZXcgbmFtZSB3YXMgcHJvdmlkZWQgJyApO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7ICAgIFxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiggdGhpcy5pc19jb21wb25lbnRfZXhpc3QodGhpcy5jb21wb25lbnRfZWRpdGFibGUubmV3X25hbWUpXHJcbiAgICAgICAgICAgICl7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0X2Vycm9yX21zZyggJ09uZSBjb21wb25lbnQgaGFzIHRoaXMgbmFtZSAnLCAnZWRpdC1jb21wb25lbnQnICk7IFxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyggJ09uZSBjb21wb25lbnQgaGFzIHRoaXMgbmFtZScgKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnN0b3JhZ2VTZXJ2aWNlLmluc2VydCgnL2FwaS9jb21wb25lbnRzJywge1xyXG4gICAgICAgICAgICBpZCA6IHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLl9pZCxcclxuICAgICAgICAgICAgbmFtZSA6IHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLm5ld19uYW1lLFxyXG4gICAgICAgICAgICBncm91cCA6IHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLmdyb3VwLFxyXG4gICAgICAgICAgICBib2R5IDogdGhpcy5jb21wb25lbnRfZWRpdGFibGUuYm9keVxyXG4gICAgICAgICB9KS5cclxuICAgICAgICAgICAgc3Vic2NyaWJlKCByZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coICdwb3N0IC0gJyAsIHJlcyApO1xyXG4gICAgICAgICAgICAgICAgaWYgKCAhcmVzLmVycm9yICkgdGhpcy5jb21wb25lbnRzID0gcmVzLmNvbXBvbmVudHM7XHJcbiAgICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBcclxuICAgIGRlbGV0ZV9jb21wb25lbnQoKSB7XHJcbiAgICAgICAgdGhpcy5zdG9yYWdlU2VydmljZS5kZWxldGUoJy9hcGkvY29tcG9uZW50cycsIHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLl9pZCkuXHJcbiAgICAgICAgICAgIHN1YnNjcmliZSggcmVzID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCAnZGVsZXRlIC0gJyAsIHJlcyApO1xyXG4gICAgICAgICAgICAgICAgaWYgKCAhcmVzLmVycm9yICkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29tcG9uZW50cyA9IHJlcy5jb21wb25lbnRzO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0X3BhcnRfY3VycmVudF92aWV3KCAnYWxsJyApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG5cclxuICAgIGFsbF9wYWdlc19uYW1lICgpe1xyXG4gICAgICAgIGxldCBwYWdlX25hbWVzID0gW107XHJcbiAgICAgICAgdGhpcy5wYWdlcy5mb3JFYWNoKGZ1bmN0aW9uKGVsKXtcclxuICAgICAgICAgICAgcGFnZV9uYW1lcyA9IFsuLi5wYWdlX25hbWVzLCBlbC5uYW1lIF07XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyggY29tcF9uYW1lcyApO1xyXG4gICAgICAgIHJldHVybiBwYWdlX25hbWVzOyBcclxuICAgIH07XHJcbiAgIFxyXG5cclxuICAgIHNldF9uZXdfcGFnZV9ncm91cF9zZWxlY3QoIHZhbHVlICkge1xyXG4gICAgICAgIHRoaXMubmV3X3BhZ2UuZ3JvdXAgPSB2YWx1ZTtcclxuICAgIH07XHJcblxyXG5cclxuICAgIGNoYW5nZV9uZXdfcGFnZV9ncm91cCgpIHtcclxuICAgICAgICBsZXQgcmVzID0gdGhpcy5hbGxfZ3JvdXBzX25hbWUodGhpcy5wYWdlKS5maW5kKCBlbCA9PiBlbCA9PSB0aGlzLm5ld19wYWdlLmdyb3VwKSB8fCAnbm9uZScgO1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduZXdfcGFnZV9ncm91cF9zZWxlY3QnKSA/IFxyXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmV3X3BhZ2VfZ3JvdXBfc2VsZWN0JykudmFsdWUgPSByZXMgOiAnJyA7XHJcbiAgICAgICAgY29uc29sZS5sb2coICduZXdfcGFnZV9ncm91cF9zZWxlY3QgJywgcmVzICk7IFxyXG4gICAgfTtcclxuXHJcbiAgICBpc19wYWdlX2V4aXN0KG5hbWUpe1xyXG4gICAgICAgIGxldCByZXMgPSB0aGlzLnBhZ2VzLmZpbmQoIHBhZ2UgPT4gcGFnZS5uYW1lID09IG5hbWUpO1xyXG4gICAgICAgIHJldHVybiByZXM7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICBzZXRfZWRpdF9wYWdlKCBlZGl0X3BhZ2UgKSB7XHJcbiAgICAgICAgdGhpcy5wYWdlX2VkaXRhYmxlID0gZWRpdF9wYWdlO1xyXG4gICAgICAgIHRoaXMucGFnZV9lZGl0YWJsZS5uZXdfbmFtZSA9IHRoaXMucGFnZV9lZGl0YWJsZS5uYW1lO1xyXG4gICAgfTtcclxuXHJcbiAgICBjaGFuZ2VfbmV3X3BhZ2VfZmllbGRfdmFsdWUoIHZhbHVlICkge1xyXG4gICAgICAgIHRoaXMubmV3X3BhZ2VfZmllbGQudmFsdWUgPSB2YWx1ZTtcclxuICAgIH07XHJcblxyXG4gICAgaXNfcGFnZV9maWVsZF9uYW1lX2V4aXN0KG5hbWUpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLnBhZ2VfZWRpdGFibGUuYm9keS5maW5kKCBmaWVsZCA9PiBjb25zb2xlLmxvZyhmaWVsZC5uYW1lKSApO1xyXG4gICAgfTtcclxuXHJcbiAgICBzZXRfbmV3X3BhZ2VfZmllbGRfdmFsdWUocGFnZV9lZGl0YWJsZSwgbmV3X3BhZ2VfZmllbGQpe1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coJyB0dHR0dHR0dCAnLCBwYWdlX2VkaXRhYmxlLCBuZXdfcGFnZV9maWVsZCk7XHJcbiAgICAgICAgbGV0IGNvbXAgPSB0aGlzLmNvbXBvbmVudHMuZmluZChlbCA9PiB7IHJldHVybiBlbC5uYW1lID09PSBuZXdfcGFnZV9maWVsZC52YWx1ZSA/IHRydWUgOiBmYWxzZSB9KTtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKCAnIGNvbXAgJywgY29tcCApO1xyXG4gICAgICAgIG5ld19wYWdlX2ZpZWxkLnZhbHVlID0gY29tcDtcclxuICAgIH07XHJcblxyXG4gICAgYWRkX25ld19wYWdlX2ZpZWxkKCl7XHJcbiAgICAgICAgY29uc29sZS5sb2coIHRoaXMubmV3X3BhZ2VfZmllbGQgKTsgXHJcbiAgICAgICAgaWYoIHRoaXMuaXNfcGFnZV9maWVsZF9uYW1lX2V4aXN0KHRoaXMubmV3X3BhZ2VfZmllbGQubmFtZSkgKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0X2Vycm9yX21zZyggJ09uZSBmaWVsZCBoYXMgdGhpcyBuYW1lICcsICduZXdfcGFnZV9maWVsZCcgKTsgXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCAnIG5vIG5hbWUgd2FzIHByb3ZpZGVkICcgKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGlmKCB0aGlzLm5ld19wYWdlX2ZpZWxkLnZhbHVlID09ICdub25lJyApIHRoaXMubmV3X3BhZ2VfZmllbGQudmFsdWUgPSAnJztcclxuICAgICAgICBpZiggdGhpcy5uZXdfcGFnZV9maWVsZC52YWx1ZSApIHtcclxuICAgICAgICAgICAgdGhpcy5zZXRfbmV3X3BhZ2VfZmllbGRfdmFsdWUodGhpcy5wYWdlX2VkaXRhYmxlLCB0aGlzLm5ld19wYWdlX2ZpZWxkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5uZXdfcGFnZV9maWVsZC5faWQgPSB0aGlzLmNyZWF0ZV9ndWlkKCk7ICBcclxuICAgICAgICB0aGlzLnBhZ2VfZWRpdGFibGUuYm9keSA9IFsuLi50aGlzLnBhZ2VfZWRpdGFibGUuYm9keSwgdGhpcy5uZXdfcGFnZV9maWVsZF07XHJcblxyXG4gICAgICAgIHRoaXMubmV3X3BhZ2VfZmllbGQgPSB7fTtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmV3X3BhZ2VfZmllbGRfdmFsdWVfc2VsZWN0JykgPyBcclxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25ld19wYWdlX2ZpZWxkX3ZhbHVlX3NlbGVjdCcpLnZhbHVlID0gJ25vbmUnIDogJycgO1xyXG5cclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gY29uc29sZS5sb2coICcgZW5kICcgKTtcclxuXHJcbiAgICAgICAgdGhpcy5zdG9yYWdlU2VydmljZS51cGRhdGUoJy9hcGkvY29tcG9uZW50cycse1xyXG4gICAgICAgICAgICBpZCA6IHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLl9pZCxcclxuICAgICAgICAgICAgbmFtZSA6IHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLm5hbWUsXHJcbiAgICAgICAgICAgIGdyb3VwIDogdGhpcy5jb21wb25lbnRfZWRpdGFibGUuZ3JvdXAsXHJcbiAgICAgICAgICAgIGJvZHkgOiB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZS5ib2R5XHJcbiAgICAgICAgfSkuXHJcbiAgICAgICAgICAgIHN1YnNjcmliZSggcmVzID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCAncHV0IC0gJyAsIHJlcyApO1xyXG4gICAgICAgICAgICAgICAgaWYgKCAhcmVzLmVycm9yICkgdGhpcy5jb21wb25lbnRzID0gcmVzLmNvbXBvbmVudHM7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggJyBiICcsIHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLmJvZHkgKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgY3JlYXRlX3BhZ2UoKXtcclxuICAgICAgICBpZiAoICEgdGhpcy5uZXdfcGFnZS5uYW1lICkge1xyXG4gICAgICAgICAgICB0aGlzLnNldF9lcnJvcl9tc2coICcgTm8gbmFtZSB3YXMgcHJvdmlkZWQgJyApO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyggJ05vIG5hbWUgd2FzIHByb3ZpZGVkICcgKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIHRoaXMuaXNfcGFnZV9leGlzdCh0aGlzLm5ld19wYWdlLm5hbWUpICkge1xyXG4gICAgICAgICAgICB0aGlzLnNldF9lcnJvcl9tc2coICdPbmUgcGFnZSBoYXMgdGhpcyBuYW1lICcgKTsgXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCAnT25lIHBhZ2UgaGFzIHRoaXMgbmFtZScgKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlOyAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoICEgdGhpcy5uZXdfcGFnZS5ncm91cCApIHRoaXMubmV3X3BhZ2UuZ3JvdXAgPSAnbm9uZScgO1xyXG4gICAgICAgIGxldCBib2R5ID0gW107XHJcbiAgICAgICAgaWYgKCB0aGlzLm5ld19wYWdlLmdyb3VwICE9PSAnbm9uZScgKXtcclxuICAgICAgICAgICAgbGV0IHJlcyA9IHRoaXMucGFnZXMuZmluZCggcGFnZSA9PiBwYWdlLmdyb3VwID09IHRoaXMubmV3X3BhZ2UuZ3JvdXApO1xyXG4gICAgICAgICAgICBpZiAoIHJlcyApIGJvZHkgPSByZXMuYm9keSA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnN0b3JhZ2VTZXJ2aWNlLmluc2VydCgnL2FwaS9wYWdlcycsIHtcclxuICAgICAgICAgICAgbmFtZSA6IHRoaXMubmV3X3BhZ2UubmFtZSxcclxuICAgICAgICAgICAgZ3JvdXAgOiB0aGlzLm5ld19wYWdlLmdyb3VwIHx8ICdub25lJyxcclxuICAgICAgICAgICAgYm9keSA6IGJvZHlcclxuICAgICAgICAgfSkuXHJcbiAgICAgICAgICAgIHN1YnNjcmliZSggcmVzID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCAncG9zdCAtICcgLCByZXMgKTtcclxuICAgICAgICAgICAgICAgIGlmICggIXJlcy5lcnJvciApIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBhZ2VzID0gcmVzLnBhZ2VzO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBlZGl0X3BhZ2UgPSB0aGlzLnBhZ2VzLmZpbmQoIHBhZ2UgPT4gcGFnZS5uYW1lID09IHRoaXMubmV3X3BhZ2UubmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCBlZGl0X3BhZ2UgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubmV3X3BhZ2UgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRfcGFydF9jdXJyZW50X3ZpZXcoJ2VkaXQtcGFnZScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldF9lZGl0X3BhZ2UoIGVkaXRfcGFnZSApO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG5cclxuXHJcbi8qXHJcblxyXG4gICAgaW5pdF9uZXdfY29tcG9uZW50KG11dGFiaWxpdHkgPSAnJyl7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgbXV0YWJpbGl0eSA6IG11dGFiaWxpdHlcclxuICAgICAgICB9O1xyXG4gICAgfTtcclxuXHJcbiAgICBzZXRfbmV3X2NvbXBvbmVudF9tdXRhYmlsaXR5KG11dGFiaWxpdHkpe1xyXG4gICAgICAgIHRoaXMubmV3X2NvbXBvbmVudCA9ICB0aGlzLmluaXRfbmV3X2NvbXBvbmVudCggbXV0YWJpbGl0eSApO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgZ2V0X2FsbF9jb21wb25lbnRzKCkge1xyXG4gICAgICAgIHRoaXMuc3RvcmFnZVNlcnZpY2Uuc2VsZWN0KCcvYXBpL2NvbXBvbmVudHMnICkuXHJcbiAgICAgICAgICAgIHN1YnNjcmliZSggcmVzID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCAnZ2V0IC0gJyAsIHJlcyApO1xyXG4gICAgICAgICAgICAgICAgaWYoICFyZXMuZXJyb3IgKSB0aGlzLmNvbXBvbmVudHMgPSByZXMuY29tcG9uZW50cztcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGNyZWF0ZV9jb21wb25lbnQoKXtcclxuICAgICAgICBjb25zb2xlLmxvZyggdGhpcy5jb21wb25lbnRzICk7XHJcbiAgICAgICAgaWYgKCAhdGhpcy5uZXdfY29tcG9uZW50Lm5hbWUgKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCAnIG5vIG5hbWUgd2FzIHByb3ZpZGVkICcpO1xyXG4gICAgICAgICAgICByZXR1cm4gO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIHRoaXMuZXhpc3RfY29tcG9uZW50X3doaXRoX3RoaXNfbmFtZSgpICkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyggJyBjb21wb25lbnQgd2l0aCBzdWNoIG5hbWUgZXhpc3RzICcgKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnN0b3JhZ2VTZXJ2aWNlLmluc2VydCgnL2FwaS9jb21wb25lbnRzJywge1xyXG4gICAgICAgICAgICBuYW1lIDogdGhpcy5uZXdfY29tcG9uZW50Lm5hbWUsXHJcbiAgICAgICAgICAgIGdyb3VwIDogdGhpcy5uZXdfY29tcG9uZW50Lmdyb3VwIHx8ICcnLFxyXG4gICAgICAgICAgICBtdXRhYmlsaXR5IDogdGhpcy5uZXdfY29tcG9uZW50Lm11dGFiaWxpdHksXHJcbiAgICAgICAgICAgIGJvZHkgOiBbXVxyXG4gICAgICAgICB9KS5cclxuICAgICAgICAgICAgc3Vic2NyaWJlKCByZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coICdwb3N0IC0gJyAsIHJlcyApO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coIHJlcy5tc2cgKTtcclxuICAgICAgICAgICAgICAgIGlmICggIXJlcy5lcnJvciApIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbXBvbmVudHMgPSByZXMuY29tcG9uZW50cztcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5ld19jb21wb25lbnQgPSB0aGlzLmluaXRfbmV3X2NvbXBvbmVudCh0aGlzLm5ld19jb21wb25lbnQubXV0YWJpbGl0eSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBjaGFuZ2VfY29tcG9uZW50KGNvbXBvbmVudCl7XHJcbiAgICAgICAgaWYgKCAhY29tcG9uZW50Lm5ld19uYW1lICkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnbm8gbmFtZSB3YXMgcHJvdmlkZWQgJyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoIHRoaXMuZXhpc3RfY29tcG9uZW50X3doaXRoX3RoaXNfbmFtZShjb21wb25lbnQubmV3X25hbWUpICl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCAnIGNvbXBvbmVudCB3aXRoIHN1Y2ggbmFtZSBleGlzdHMgJyApO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc3RvcmFnZVNlcnZpY2UudXBkYXRlKCcvYXBpL2NvbXBvbmVudHMnLHtcclxuICAgICAgICAgICAgaWQgOiBjb21wb25lbnQuX2lkLFxyXG4gICAgICAgICAgICBuYW1lIDogY29tcG9uZW50Lm5ld19uYW1lLFxyXG4gICAgICAgICAgICBncm91cCA6IGNvbXBvbmVudC5ncm91cCxcclxuICAgICAgICAgICAgbXV0YWJpbGl0eSA6IHRoaXMubmV3X2NvbXBvbmVudC5tdXRhYmlsaXR5LFxyXG4gICAgICAgICAgICBib2R5IDogY29tcG9uZW50LmJvZHlcclxuICAgICAgICB9KS5cclxuICAgICAgICAgICAgc3Vic2NyaWJlKCByZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coICdwdXQgLSAnICwgcmVzICk7XHJcbiAgICAgICAgICAgICAgICBpZiAoICFyZXMuZXJyb3IgKSB0aGlzLmNvbXBvbmVudHMgPSByZXMuY29tcG9uZW50cztcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgY29weV9jb21wb25lbnQoY29tcG9uZW50KSB7XHJcbiAgICAgICAgaWYgKCAhY29tcG9uZW50Lm5ld19uYW1lICkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyggJ25vIG5hbWUgd2FzIHByb3ZpZGVkICcgKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiggdGhpcy5leGlzdF9jb21wb25lbnRfd2hpdGhfdGhpc19uYW1lKGNvbXBvbmVudC5uZXdfbmFtZSkgKXtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coICcgY29tcG9uZW50IHdpdGggc3VjaCBuYW1lIGV4aXN0cyAnICk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zdG9yYWdlU2VydmljZS5pbnNlcnQoJy9hcGkvY29tcG9uZW50cycsIHtcclxuICAgICAgICAgICAgbmFtZSA6IGNvbXBvbmVudC5uZXdfbmFtZSxcclxuICAgICAgICAgICAgZ3JvdXAgOiBjb21wb25lbnQuZ3JvdXAsXHJcbiAgICAgICAgICAgIG11dGFiaWxpdHkgOiBjb21wb25lbnQubXV0YWJpbGl0eSxcclxuICAgICAgICAgICAgYm9keSA6IGNvbXBvbmVudC5ib2R5XHJcbiAgICAgICAgIH0pLlxyXG4gICAgICAgICAgICBzdWJzY3JpYmUoIHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggJ3Bvc3QgLSAnICwgcmVzICk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggcmVzLm1zZyApO1xyXG4gICAgICAgICAgICAgICAgaWYgKCAhcmVzLmVycm9yICkgdGhpcy5jb21wb25lbnRzID0gcmVzLmNvbXBvbmVudHM7XHJcbiAgICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBkZWxldGVfY29tcG9uZW50KGlkKSB7XHJcbiAgICAgICAgaWYgKCAhaWQgKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdubyBpZCB3YXMgcHJvdmlkZWQgJyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zdG9yYWdlU2VydmljZS5kZWxldGUoJy9hcGkvY29tcG9uZW50cycsIGlkKS5cclxuICAgICAgICAgICAgc3Vic2NyaWJlKCByZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coICdkZWxldGUgLSAnICwgcmVzICk7XHJcbiAgICAgICAgICAgICAgICBpZiAoICFyZXMuZXJyb3IgKSB0aGlzLmNvbXBvbmVudHMgPSByZXMuY29tcG9uZW50cztcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGV4aXN0X2NvbXBvbmVudF93aGl0aF90aGlzX25hbWUobmFtZSA9IHRoaXMubmV3X2NvbXBvbmVudC5uYW1lKXtcclxuICAgICAgICBpZihcclxuICAgICAgICAgICAgdGhpcy5jb21wb25lbnRzLmZpbmQoZWwgPT4geyByZXR1cm4gZWwubmFtZSA9PT0gbmFtZSA/IHRydWUgOiBmYWxzZSB9KVxyXG4gICAgICAgICAgICApIHJldHVybiB0cnVlO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH07XHJcblxyXG4gICAgZWRpdF9maWVsZHNfY29tcG9uZW50KGNvbXBvbmVudCl7XHJcbiAgICAgICAgdGhpcy5uZXdfZmllbGQgPSB7IHR5cGU6IFwic3RyaW5nXCIgfTsgXHJcbiAgICAgICAgY29uc29sZS5sb2coIHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLCBjb21wb25lbnQgKTtcclxuICAgICAgICBpZiAoIHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLl9pZCAhPSBjb21wb25lbnQuX2lkKSAgeyBcclxuICAgICAgICAgICAgdGhpcy5jb21wb25lbnRfZWRpdGFibGUgPSBjb21wb25lbnQ7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jb21wb25lbnRfZWRpdGFibGUgPSBbXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBzaG93X2ZpZWxkc19jb21wb25lbnQoY29tcG9uZW50KXtcclxuICAgICAgICBpZiAoICB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZSAmJlxyXG4gICAgICAgICAgICAgIHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLl9pZCA9PT0gY29tcG9uZW50Ll9pZCBcclxuICAgICAgICApIHJldHVybiB0cnVlO1xyXG4gICAgfTsgXHJcblxyXG4gICAgYWRkX2ZpZWxkKCBjb21wb25lbnQsIG5ld19maWVsZCA9IHt9ICl7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyggY29tcG9uZW50LCBuZXdfZmllbGQgKTtcclxuICAgICAgICBpZiAoICFuZXdfZmllbGQubmFtZSApIHJldHVybjtcclxuICAgICAgICBpZiAoIHRoaXMuZXhpc3RfZmllbGRfd2l0aF90aGlzX25hbWUoY29tcG9uZW50LCBuZXdfZmllbGQubmFtZSkgKSByZXR1cm4gO1xyXG4gICAgICAgIHRoaXMubmV3X2ZpZWxkID0geyB0eXBlOiBcInN0cmluZ1wiIH07IFxyXG4gICAgICAgIG5ld19maWVsZC5faWQgPSB0aGlzLmNyZWF0ZV9ndWlkKCk7ICAgICAgICBcclxuICAgICAgICBjb21wb25lbnQuYm9keSA9IFsgLi4uIGNvbXBvbmVudC5ib2R5ICwgbmV3X2ZpZWxkIF07XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyggY29tcG9uZW50LmJvZHkgKTtcclxuICAgICAgICB0aGlzLnN0b3JhZ2VTZXJ2aWNlLnVwZGF0ZSgnL2FwaS9jb21wb25lbnRzJyx7XHJcbiAgICAgICAgICAgIGlkIDogY29tcG9uZW50Ll9pZCxcclxuICAgICAgICAgICAgbmFtZSA6IGNvbXBvbmVudC5uYW1lLFxyXG4gICAgICAgICAgICBncm91cCA6IGNvbXBvbmVudC5ncm91cCxcclxuICAgICAgICAgICAgbXV0YWJpbGl0eSA6IGNvbXBvbmVudC5tdXRhYmlsaXR5LFxyXG4gICAgICAgICAgICBib2R5IDogY29tcG9uZW50LmJvZHlcclxuICAgICAgICB9KS5cclxuICAgICAgICAgICAgc3Vic2NyaWJlKCByZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coICdwdXQgLSAnICwgcmVzICk7XHJcbiAgICAgICAgICAgICAgICBpZiAoICFyZXMuZXJyb3IgKSB0aGlzLmNvbXBvbmVudHMgPSByZXMuY29tcG9uZW50cztcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIGlmX251bWJlcl9maWVsZCh2YWwpe1xyXG4gICAgICAgIHZhbCA9IE51bWJlcih2YWwpO1xyXG4gICAgICAgIHJldHVybiB2YWwgPyB2YWwgOiAwIDtcclxuICAgIH07XHJcblxyXG4gICAgaWZfY29tcG9uZW50X2ZpZWxkKGNvbXBvbmVudCwgdmFsKXtcclxuICAgICAgICBsZXQgcmVzID0gW107XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhjb21wb25lbnQsIHZhbCk7XHJcbiAgICAgICAgdGhpcy5jb21wb25lbnRzLmZpbmQoZWwgPT4geyBcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyggZWwubmFtZSApO1xyXG4gICAgICAgICAgICBpZiAoIGVsLm5hbWUgPT09IHZhbCAmJlxyXG4gICAgICAgICAgICAgICBjb21wb25lbnQubmFtZSAhPT0gdmFsICkge1xyXG4gICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyggJ3JlcyAnLCBlbCApO1xyXG4gICAgICAgICAgICAgICAgICAgcmVzID0gIGVsO1xyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coICcgLy8vLy8vLy8vLy8vLy8vLyAnKTsgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgfSlcclxuICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgfTtcclxuXHJcbiAgICBjaGFuZ2VfZmllbGQoIHNldHRpbmdzID0ge30gKXtcclxuICAgICAgICBsZXQgY29tcG9uZW50ID0gc2V0dGluZ3MuY29tcG9uZW50O1xyXG4gICAgICAgIGxldCBmaWVsZCA9IHNldHRpbmdzLmZpZWxkO1xyXG5cclxuICAgICAgICAvL2NvbnNvbGUubG9nKGNvbXBvbmVudCwgZmllbGQpO1xyXG4gICAgICAgIGlmICggdGhpcy5leGlzdF9maWVsZF93aXRoX3RoaXNfbmFtZShjb21wb25lbnQsIGZpZWxkLmVkaXRfbmFtZSwgZmllbGQuX2lkICkgKSByZXR1cm47XHJcbiAgICAgICAgaWYgKCBzZXR0aW5ncy50eXBlID09ICdudW1iZXInICkge1xyXG4gICAgICAgICAgICBmaWVsZC5lZGl0X3ZhbHVlID0gdGhpcy5pZl9udW1iZXJfZmllbGQoZmllbGQuZWRpdF92YWx1ZV9uYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCBzZXR0aW5ncy50eXBlID09ICdjb21wb25lbnQnICkge1xyXG4gICAgICAgICAgICBmaWVsZC5jb21wb25lbnRfdmFsdWUgPSB0aGlzLmlmX2NvbXBvbmVudF9maWVsZChjb21wb25lbnQsIGZpZWxkLmVkaXRfdmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmaWVsZC5uYW1lID0gZmllbGQuZWRpdF9uYW1lIHx8IGZpZWxkLm5hbWU7XHJcbiAgICAgICAgZmllbGQudmFsdWUgPSBmaWVsZC5lZGl0X3ZhbHVlO1xyXG4gICAgICAgIGRlbGV0ZSBmaWVsZC5lZGl0X25hbWU7XHJcbiAgICAgICAgZGVsZXRlIGZpZWxkLmVkaXRfdmFsdWU7XHJcbiAgICAgICAgZGVsZXRlIGZpZWxkLmFzc2lnbm1lbnQ7XHJcblxyXG4gICAgICAgIHRoaXMuc3RvcmFnZVNlcnZpY2UudXBkYXRlKCcvYXBpL2NvbXBvbmVudHMnLHtcclxuICAgICAgICAgICAgaWQgOiBjb21wb25lbnQuX2lkLFxyXG4gICAgICAgICAgICBuYW1lIDogY29tcG9uZW50Lm5hbWUsXHJcbiAgICAgICAgICAgIGdyb3VwIDogY29tcG9uZW50Lmdyb3VwLFxyXG4gICAgICAgICAgICBtdXRhYmlsaXR5IDogY29tcG9uZW50Lm11dGFiaWxpdHksXHJcbiAgICAgICAgICAgIGJvZHkgOiBjb21wb25lbnQuYm9keVxyXG4gICAgICAgIH0pLlxyXG4gICAgICAgICAgICBzdWJzY3JpYmUoIHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggJ3B1dCAtICcgLCByZXMgKTtcclxuICAgICAgICAgICAgICAgIGlmICggIXJlcy5lcnJvciApIHRoaXMuY29tcG9uZW50cyA9IHJlcy5jb21wb25lbnRzO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFxyXG4gICAgfTtcclxuXHJcbiAgICBjb3B5X2ZpZWxkKCBzZXR0aW5ncyA9IHt9ICl7XHJcbiAgICAgICAgbGV0IGNvbXBvbmVudCA9IHNldHRpbmdzLmNvbXBvbmVudDtcclxuICAgICAgICBsZXQgZmllbGQgPSBzZXR0aW5ncy5maWVsZDtcclxuICAgICAgICBjb25zb2xlLmxvZyhjb21wb25lbnQsIGZpZWxkKTtcclxuICAgICAgICBpZiAoICFmaWVsZC5lZGl0X25hbWUgKSByZXR1cm47XHJcbiAgICAgICAgaWYgKCB0aGlzLmV4aXN0X2ZpZWxkX3dpdGhfdGhpc19uYW1lKGNvbXBvbmVudCwgZmllbGQuZWRpdF9uYW1lLCBmaWVsZC5faWQgKSApIHJldHVybjtcclxuICAgICAgICBsZXQgbmV3X2ZpZWxkID0gdGhpcy5kZWVwQ29weShmaWVsZCk7XHJcbiAgICAgICAgbmV3X2ZpZWxkLl9pZCA9IHRoaXMuY3JlYXRlX2d1aWQoKTtcclxuICAgICAgICBuZXdfZmllbGQubmFtZSA9IG5ld19maWVsZC5lZGl0X25hbWU7XHJcbiAgICAgICAgbmV3X2ZpZWxkLnZhbHVlID0gJyc7XHJcbiAgICAgICAgaWYgKCBzZXR0aW5ncy50eXBlID09ICdudW1iZXInICkge1xyXG4gICAgICAgICAgICBuZXdfZmllbGQudmFsdWU9IHRoaXMuaWZfbnVtYmVyX2ZpZWxkKG5ld19maWVsZC52YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICggc2V0dGluZ3MudHlwZSA9PSAnY29tcG9uZW50JyApIHtcclxuICAgICAgICAgICAgdGhpcy5pZl9jb21wb25lbnRfZmllbGQoY29tcG9uZW50LCBuZXdfZmllbGQudmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBkZWxldGUgbmV3X2ZpZWxkLmVkaXRfbmFtZTtcclxuICAgICAgICBkZWxldGUgbmV3X2ZpZWxkLmVkaXRfdmFsdWU7XHJcbiAgICAgICAgZGVsZXRlIG5ld19maWVsZC5hc3NpZ25tZW50O1xyXG4gICAgICAgIGNvbXBvbmVudC5ib2R5ID0gWyAuLi4gY29tcG9uZW50LmJvZHkgLCBuZXdfZmllbGQgXTtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKCBuZXdfZmllbGQgKTtcclxuICAgICAgICB0aGlzLnN0b3JhZ2VTZXJ2aWNlLnVwZGF0ZSgnL2FwaS9jb21wb25lbnRzJyx7XHJcbiAgICAgICAgICAgIGlkIDogY29tcG9uZW50Ll9pZCxcclxuICAgICAgICAgICAgbmFtZSA6IGNvbXBvbmVudC5uYW1lLFxyXG4gICAgICAgICAgICBncm91cCA6IGNvbXBvbmVudC5ncm91cCxcclxuICAgICAgICAgICAgbXV0YWJpbGl0eSA6IGNvbXBvbmVudC5tdXRhYmlsaXR5LFxyXG4gICAgICAgICAgICBib2R5IDogY29tcG9uZW50LmJvZHlcclxuICAgICAgICB9KS5cclxuICAgICAgICAgICAgc3Vic2NyaWJlKCByZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coICdwdXQgLSAnICwgcmVzICk7XHJcbiAgICAgICAgICAgICAgICBpZiAoICFyZXMuZXJyb3IgKSB0aGlzLmNvbXBvbmVudHMgPSByZXMuY29tcG9uZW50cztcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgZGVsZXRlX2ZpZWxkKCBzZXR0aW5ncyA9IHt9ICl7XHJcbiAgICAgICAgbGV0IGNvbXBvbmVudCA9IHNldHRpbmdzLmNvbXBvbmVudDtcclxuICAgICAgICBsZXQgZmllbGQgPSBzZXR0aW5ncy5maWVsZDtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKGNvbXBvbmVudCwgZmllbGQpO1xyXG4gICAgICAgIGlmICggIWNvbXBvbmVudCB8fCAhZmllbGQgKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCAnbm8gY29tcG9uZW50IG9yIGZpZWxkJyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29tcG9uZW50LmJvZHkuZm9yRWFjaCggKGVsLCBpZHgsIGFycikgPT4geyBcclxuICAgICAgICAgICAgaWYoZWwuX2lkID09PSBmaWVsZC5faWQgKSB7XHJcbiAgICAgICAgICAgICAgICBhcnIuc3BsaWNlKGlkeCwgMSk7XHJcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCBhcnIsIGlkeCApO1xyXG4gICAgICAgICAgICB9IFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuc3RvcmFnZVNlcnZpY2UudXBkYXRlKCcvYXBpL2NvbXBvbmVudHMnLHtcclxuICAgICAgICAgICAgaWQgOiBjb21wb25lbnQuX2lkLFxyXG4gICAgICAgICAgICBuYW1lIDogY29tcG9uZW50Lm5hbWUsXHJcbiAgICAgICAgICAgIGdyb3VwIDogY29tcG9uZW50Lmdyb3VwLFxyXG4gICAgICAgICAgICBtdXRhYmlsaXR5IDogY29tcG9uZW50Lm11dGFiaWxpdHksXHJcbiAgICAgICAgICAgIGJvZHkgOiBjb21wb25lbnQuYm9keVxyXG4gICAgICAgIH0pLlxyXG4gICAgICAgICAgICBzdWJzY3JpYmUoIHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggJ3B1dCAtICcgLCByZXMgKTtcclxuICAgICAgICAgICAgICAgIGlmICggIXJlcy5lcnJvciApIHRoaXMuY29tcG9uZW50cyA9IHJlcy5jb21wb25lbnRzO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFxyXG4gICAgfTtcclxuXHJcbiAgICB2YWx1ZV9hc3NpZ25tZW50KGZpZWxkKXtcclxuICAgICAgICBpZiAoICAhZmllbGQuYXNzaWdubWVudCApe1xyXG4gICAgICAgICAgICBpZiAoIGZpZWxkLnR5cGUgPT0gJ2NvbXBvbmVudCcgKSB7XHJcbiAgICAgICAgICAgICAgICBmaWVsZC5jb21wb25lbnRfdmFsdWUgPSBmaWVsZC5jb21wb25lbnRfdmFsdWUgfHwgW107XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZmllbGQuZWRpdF92YWx1ZSA9IGZpZWxkLnZhbHVlO1xyXG4gICAgICAgICAgICBmaWVsZC5hc3NpZ25tZW50ID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9O1xyXG5cclxuICAgIGV4aXN0X2ZpZWxkX3dpdGhfdGhpc19uYW1lKGNvbXBvbmVudCwgZmllbGRfbmFtZSwgZmllbGRfaWQgKXtcclxuICAgICAgICBpZiAoICFjb21wb25lbnQgfHxcclxuICAgICAgICAgICAgICFjb21wb25lbnQuYm9keSBcclxuICAgICAgICApIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJyBmaWVsZHMgd2FzIG5vdCBwcm92aWRlZCAnKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKFxyXG4gICAgICAgICAgICBjb21wb25lbnQuYm9keS5maW5kKGVsID0+IHsgcmV0dXJuIChlbC5uYW1lID09PSBmaWVsZF9uYW1lICYmXHJcbiAgICAgICAgICAgICAgIGVsLl9pZCAhPT0gZmllbGRfaWQgKSA/IHRydWUgOiBmYWxzZSB9KVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyggICcgZmllbGQgd2l0aCBzdWNoIG5hbWUgZXhpc3RzICcgKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH07XHJcbiAgICBcclxuKi9cclxuXHJcbiAgICBcclxuXHJcbiAgICAvLyByZXR1cm4gdW5pcXVlIGlkXHJcbiAgICBjcmVhdGVfZ3VpZCgpIHtcclxuICAgICAgICBmdW5jdGlvbiBzNCgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoKDEgKyBNYXRoLnJhbmRvbSgpKSAqIDB4MTAwMDApXHJcbiAgICAgICAgICAgICAgICAudG9TdHJpbmcoMTYpXHJcbiAgICAgICAgICAgICAgICAuc3Vic3RyaW5nKDEpO1xyXG4gICAgICAgIH1cclxuIFx0ICAgIHJldHVybiBzNCgpICsgczQoKSArICctJyArIHM0KCkgKyAnLScgKyBzNCgpICsgJy0nICtcclxuICAgICAgICAgICAgICAgczQoKSArICctJyArIHM0KCkgKyBzNCgpICsgczQoKTtcclxuICAgIH07XHJcblxyXG4gICAgLy8gIFJldHVybnMgYSBkZWVwIGNvcHkgb2YgdGhlIG9iamVjdFxyXG4gICAgZGVlcENvcHkob2xkT2JqOiBhbnkpIHtcclxuICAgICAgICBsZXQgbmV3T2JqID0gb2xkT2JqO1xyXG4gICAgICAgIGlmIChvbGRPYmogJiYgdHlwZW9mIG9sZE9iaiA9PT0gXCJvYmplY3RcIikge1xyXG4gICAgICAgICAgICBuZXdPYmogPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2xkT2JqKSA9PT0gXCJbb2JqZWN0IEFycmF5XVwiID8gW10gOiB7fTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBvbGRPYmopIHtcclxuICAgICAgICAgICAgICAgIG5ld09ialtpXSA9IHRoaXMuZGVlcENvcHkob2xkT2JqW2ldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV3T2JqO1xyXG4gICAgfTtcclxuXHJcblxyXG5cclxuXHJcbn1cclxuXHJcblxyXG4vKlxyXG5cclxuXHJcbmxldCBjdnRfcl9uID0gKCgpID0+IHtcclxuXHJcbiAgdmFyIG51dCA9IFsxMDAwLCA5MDAsIDUwMCwgNDAwLCAxMDAsIDkwLCA1MCwgNDAsIDEwLCA5LCA1LCA0LCAxXTtcclxuICB2YXIgcm9tID0gWydNJywgJ0NNJywgJ0QnLCAnQ0QnLCAnQycsICdYQycsICdMJywgJ1hMJywgJ1gnLCAnSVgnLCAnVicsICdJVicsICdJJ107XHJcbiAgdmFyIGFsbCA9IHtJOjEsVjo1LFg6MTAsTDo1MCxDOjEwMCxEOjUwMCxNOjEwMDB9O1xyXG5cclxuICB2YXIgY3Z0X3Jfbl90b19yb21hbiA9IChhcmFiaWMpID0+IHtcclxuICAgIGxldCByZXMgPSAnJzsgIFxyXG4gICAgbnV0LmZvckVhY2goIChlbCwgaWR4LCBhcnIgKSA9PntcclxuICAgICAgICB3aGlsZSAoIGFyYWJpYyA+PSBudXRbaWR4XSApIHtcclxuICAgICAgICAgICAgcmVzICs9IHJvbVtpZHhdO1xyXG4gICAgICAgICAgICBhcmFiaWMgLT0gbnV0W2lkeF07XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gcmVzO1xyXG4gIH07XHJcblxyXG4gIHZhciBjdnRfcl9uX2Zvcm1fcm9tYW4gPSAocm9tYW4pID0+IHtcclxuICAgICAgbGV0IHJlcyA9IDA7XHJcbiAgICAgIGxldCBsID0gcm9tYW4ubGVuZ3RoO1xyXG4gICAgICB3aGlsZSAobC0tKSB7XHJcbiAgICAgICAgaWYgKCBhbGxbcm9tYW5bbF1dIDwgYWxsW3JvbWFuW2wrMV1dICkgeyBcclxuICAgICAgICAgICAgcmVzIC09IGFsbFtyb21hbltsXV07ICAgXHJcbiAgICAgICAgfSBlbHNlIHsgXHJcbiAgICAgICAgICAgIHJlcyArPSBhbGxbcm9tYW5bbF1dIFxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgcmV0dXJuIHJlcztcclxuICB9O1xyXG5cclxuICByZXR1cm4gKG51bSkgPT4ge1xyXG4gICAgaWYgKCB0eXBlb2YgbnVtID09PSAnbnVtYmVyJykgcmV0dXJuIGN2dF9yX25fdG9fcm9tYW4oIG51bSApO1xyXG4gICAgaWYgKCB0eXBlb2YgbnVtID09PSAnc3RyaW5nJykgcmV0dXJuIGN2dF9yX25fZm9ybV9yb21hbiggbnVtLnRvVXBwZXJDYXNlKCkgKTtcclxuICB9O1xyXG5cclxufSkoKTtcclxuXHJcblxyXG5jb25zb2xlLmxvZyggY3Z0X3JfbigzMDAzKSApO1xyXG5jb25zb2xlLmxvZyggY3Z0X3Jfbig0NDMpICk7XHJcbmNvbnNvbGUubG9nKCBjdnRfcl9uKDY5KSApO1xyXG5jb25zb2xlLmxvZyggY3Z0X3JfbigyKSApO1xyXG5jb25zb2xlLmxvZyggY3Z0X3Jfbig5OSkgKTtcclxuY29uc29sZS5sb2coIGN2dF9yX24oMzQpICk7XHJcbmNvbnNvbGUubG9nKCBjdnRfcl9uKDQ1NikgKTtcclxuXHJcbmNvbnNvbGUubG9nKCctLS0tLS0tLS0tLS0tLS0tLS0tJyk7XHJcblxyXG5jb25zb2xlLmxvZyggY3Z0X3JfbignTU1NSUlJJykgKTtcclxuY29uc29sZS5sb2coIGN2dF9yX24oJ0NEWExJSUknKSApO1xyXG5jb25zb2xlLmxvZyggY3Z0X3JfbignTFhJWCcpICk7XHJcbmNvbnNvbGUubG9nKCBjdnRfcl9uKCdJSScpICk7XHJcbmNvbnNvbGUubG9nKCBjdnRfcl9uKCdYQ0lYJykgKTtcclxuY29uc29sZS5sb2coIGN2dF9yX24oJ1hYWElWJykgKTtcclxuY29uc29sZS5sb2coIGN2dF9yX24oJ0NETFZJJykgKTtcclxuXHJcbiovIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9

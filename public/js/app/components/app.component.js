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
        //public component_editable = [];
        this.new_field = { type: "string" };
        //public new_group = [];
        this.components_current_view = 'all';
        this.new_component = [];
        //public create_component_group = '';
        this.error_msg = [];
        this.pages_current_view = 'all';
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
    };
    ;
    AppComponent.prototype.set_components_current_view = function (view) {
        if (view == 'all')
            document.getElementById('group_select').value = 'none';
        this.components_current_view = view;
        console.log(' components_current_view ', this.components_current_view);
    };
    ;
    AppComponent.prototype.set_sorted_components_current_view = function (sort) {
        this.components_current_view = 'sorted_view';
        this.sorted_by_value = sort;
        console.log(this.sorted_by_value);
    };
    AppComponent.prototype.set_new_component_group_select = function (value) {
        this.new_component.group = value;
    };
    ;
    AppComponent.prototype.change_new_component_group = function () {
        var _this = this;
        //console.log( 'keyup val ', this.create_component_group );
        var res = [1, 2, 3, 4].find(function (el) { return el == _this.new_component.group; }) || 'none';
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
    AppComponent.prototype.all_groups_name = function () {
        var groups_names = [];
        this.components.forEach(function (el) {
            if (groups_names.indexOf(el.group) === -1 &&
                el.group != 'none') {
                groups_names = groups_names.concat([el.group]);
            }
        });
        //console.log( groups_names );
        return groups_names;
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
            body: []
        }).
            subscribe(function (res) {
            console.log('post - ', res);
            if (!res.error) {
                _this.components = res.components;
                var edit_comp = _this.components.find(function (comp) { return comp.name == _this.new_component.name; });
                if (edit_comp) {
                    _this.set_components_current_view('edit-component');
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
                _this.set_components_current_view('all');
            }
        });
    };
    ;
    AppComponent.prototype.set_pages_current_view = function (view) {
        if (view == 'all')
            document.getElementById('collection_select').value = 'none';
        this.pages_current_view = view;
        console.log(' pages_current_view ', this.pages_current_view);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvYXBwLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEscUJBQTBCLGVBQWUsQ0FBQyxDQUFBO0FBRTFDLGdDQUE2Qiw2QkFBNkIsQ0FBQyxDQUFBO0FBRTNELG1DQUFnQyw2QkFBNkIsQ0FBQyxDQUFBO0FBQzlELGlDQUE4QiwyQkFBMkIsQ0FBQyxDQUFBO0FBVTFEO0lBYUksc0JBQW1CLGNBQThCO1FBQTlCLG1CQUFjLEdBQWQsY0FBYyxDQUFnQjtRQVpqRCxtREFBbUQ7UUFDNUMsZUFBVSxHQUFHLEVBQUUsQ0FBQztRQUNoQixVQUFLLEdBQUcsRUFBRSxDQUFDO1FBQ2xCLGlDQUFpQztRQUMxQixjQUFTLEdBQUcsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLENBQUM7UUFDdEMsd0JBQXdCO1FBQ2pCLDRCQUF1QixHQUFHLEtBQUssQ0FBQztRQUNoQyxrQkFBYSxHQUFHLEVBQUUsQ0FBQztRQUMxQixxQ0FBcUM7UUFDOUIsY0FBUyxHQUFHLEVBQUUsQ0FBQztRQUNmLHVCQUFrQixHQUFHLEtBQUssQ0FBQztJQUVrQixDQUFDO0lBRXJELCtCQUFRLEdBQVI7UUFDSSxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3hCLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1FBQzFCLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUN6QixDQUFDOztJQUVELHlDQUFrQixHQUFsQjtRQUFBLGlCQU1DO1FBTEcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUU7WUFDMUMsU0FBUyxDQUFFLFVBQUEsR0FBRztZQUNWLE9BQU8sQ0FBQyxHQUFHLENBQUUsUUFBUSxFQUFHLEdBQUcsQ0FBRSxDQUFDO1lBQzlCLEVBQUUsQ0FBQSxDQUFFLENBQUMsR0FBRyxDQUFDLEtBQU0sQ0FBQztnQkFBQyxLQUFJLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQyxVQUFVLENB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QUFFLFFBQVE7WUFDbEIsV0FBVyxFQUFFLG1CQUFtQjtZQUNoQyxTQUFTLEVBQUUsQ0FBQyxlQUFlLENBQUM7WUFDNUIsU0FBUyxFQUFFLENBQUMsZ0NBQWMsQ0FBQztZQUMzQixLQUFLLEVBQUUsQ0FBQyxzQ0FBaUIsRUFBRSxrQ0FBZSxDQUFDO1NBQzlDLENBQUM7O29CQUFBO0lBK29CRixtQkFBQztBQUFELENBOW9CQSxBQThvQkMsSUFBQTtBQTlvQlksb0JBQVksZUE4b0J4QixDQUFBO0FBR0Q7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQTRERSIsImZpbGUiOiJjb21wb25lbnRzL2FwcC5jb21wb25lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbmltcG9ydCB7U3RvcmFnZVNlcnZpY2V9IGZyb20gXCIuLi9zZXJ2aWNlcy9zdG9yYWdlLnNlcnZpY2VcIjtcclxuXHJcbmltcG9ydCB7T2JqZWN0VG9BcnJheVBpcGV9IGZyb20gXCIuLi9waXBlcy9vYmplY3RUb0FycmF5LnBpcGVcIjtcclxuaW1wb3J0IHtzb3J0QnlHcm91cFBpcGV9IGZyb20gXCIuLi9waXBlcy9zb3J0QnlHcm91cC5waXBlXCI7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICAgIG1vZHVsZUlkOiBtb2R1bGUuaWQsIFxyXG4gICAgc2VsZWN0b3I6ICdteS1hcHAnLFxyXG4gICAgdGVtcGxhdGVVcmw6ICdhcHAudGVtcGxhdGUuaHRtbCcsXHJcbiAgICBzdHlsZVVybHM6IFsnYXBwLnN0eWxlLmNzcyddLFxyXG4gICAgcHJvdmlkZXJzOiBbU3RvcmFnZVNlcnZpY2VdLFxyXG4gICAgcGlwZXM6IFtPYmplY3RUb0FycmF5UGlwZSwgc29ydEJ5R3JvdXBQaXBlXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgQXBwQ29tcG9uZW50IHtcclxuICAgIC8vcHVibGljIG5ld19jb21wb25lbnQgPSB0aGlzLmluaXRfbmV3X2NvbXBvbmVudCgpO1xyXG4gICAgcHVibGljIGNvbXBvbmVudHMgPSBbXTtcclxuICAgIHB1YmxpYyBwYWdlcyA9IFtdO1xyXG4gICAgLy9wdWJsaWMgY29tcG9uZW50X2VkaXRhYmxlID0gW107XHJcbiAgICBwdWJsaWMgbmV3X2ZpZWxkID0geyB0eXBlOiBcInN0cmluZ1wiIH07ICAgXHJcbiAgICAvL3B1YmxpYyBuZXdfZ3JvdXAgPSBbXTtcclxuICAgIHB1YmxpYyBjb21wb25lbnRzX2N1cnJlbnRfdmlldyA9ICdhbGwnO1xyXG4gICAgcHVibGljIG5ld19jb21wb25lbnQgPSBbXTtcclxuICAgIC8vcHVibGljIGNyZWF0ZV9jb21wb25lbnRfZ3JvdXAgPSAnJztcclxuICAgIHB1YmxpYyBlcnJvcl9tc2cgPSBbXTtcclxuICAgIHB1YmxpYyBwYWdlc19jdXJyZW50X3ZpZXcgPSAnYWxsJztcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgc3RvcmFnZVNlcnZpY2U6IFN0b3JhZ2VTZXJ2aWNlKSB7fVxyXG5cclxuICAgIG5nT25Jbml0KCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCduZ09uSW5pdCcpO1xyXG4gICAgICAgIHRoaXMuZ2V0X2FsbF9jb21wb25lbnRzKCk7XHJcbiAgICAgICAgdGhpcy5nZXRfYWxsX3BhZ2VzKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIGdldF9hbGxfY29tcG9uZW50cygpIHtcclxuICAgICAgICB0aGlzLnN0b3JhZ2VTZXJ2aWNlLnNlbGVjdCgnL2FwaS9jb21wb25lbnRzJyApLlxyXG4gICAgICAgICAgICBzdWJzY3JpYmUoIHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggJ2dldCAtICcgLCByZXMgKTtcclxuICAgICAgICAgICAgICAgIGlmKCAhcmVzLmVycm9yICkgdGhpcy5jb21wb25lbnRzID0gcmVzLmNvbXBvbmVudHM7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBnZXRfYWxsX3BhZ2VzKCkge1xyXG4gICAgICAgIHRoaXMuc3RvcmFnZVNlcnZpY2Uuc2VsZWN0KCcvYXBpL3BhZ2VzJyApLlxyXG4gICAgICAgICAgICBzdWJzY3JpYmUoIHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggJ2dldCAtICcgLCByZXMgKTtcclxuICAgICAgICAgICAgICAgIGlmKCAhcmVzLmVycm9yICkgdGhpcy5wYWdlcyA9IHJlcy5wYWdlcztcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHNldF9jdXJyZW50X3ZpZXcoIHZpZXcgKXtcclxuICAgICAgICB0aGlzLmN1cnJlbnRfdmlldyA9IHZpZXc7XHJcbiAgICB9O1xyXG4gICAgc2V0X2NvbXBvbmVudHNfY3VycmVudF92aWV3KCB2aWV3ICkge1xyXG4gICAgICAgIGlmICggdmlldyA9PSAnYWxsJykgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dyb3VwX3NlbGVjdCcpLnZhbHVlID0gJ25vbmUnO1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50c19jdXJyZW50X3ZpZXcgPSB2aWV3O1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCAnIGNvbXBvbmVudHNfY3VycmVudF92aWV3ICcsIHRoaXMuY29tcG9uZW50c19jdXJyZW50X3ZpZXcgKTsgICAgICAgXHJcbiAgICB9O1xyXG5cclxuICAgIHNldF9zb3J0ZWRfY29tcG9uZW50c19jdXJyZW50X3ZpZXcoIHNvcnQgKXtcclxuICAgICAgICB0aGlzLmNvbXBvbmVudHNfY3VycmVudF92aWV3ID0gJ3NvcnRlZF92aWV3JztcclxuICAgICAgICB0aGlzLnNvcnRlZF9ieV92YWx1ZSA9IHNvcnQ7IFxyXG4gICAgICAgIGNvbnNvbGUubG9nKCB0aGlzLnNvcnRlZF9ieV92YWx1ZSApOyBcclxuICAgIH1cclxuXHJcbiAgICBzZXRfbmV3X2NvbXBvbmVudF9ncm91cF9zZWxlY3QoIHZhbHVlICkge1xyXG4gICAgICAgIHRoaXMubmV3X2NvbXBvbmVudC5ncm91cCA9IHZhbHVlO1xyXG4gICAgfTtcclxuXHJcbiAgICBjaGFuZ2VfbmV3X2NvbXBvbmVudF9ncm91cCgpIHtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKCAna2V5dXAgdmFsICcsIHRoaXMuY3JlYXRlX2NvbXBvbmVudF9ncm91cCApO1xyXG4gICAgICAgIGxldCByZXMgPSBbMSwyLDMsNF0uZmluZCggZWwgPT4gZWwgPT0gdGhpcy5uZXdfY29tcG9uZW50Lmdyb3VwKSB8fCAnbm9uZScgO1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduZXdfY29tcG9uZW50X2dyb3VwX3NlbGVjdCcpLnZhbHVlID0gcmVzO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCAnbmV3X2NvbXBvbmVudF9ncm91cF9zZWxlY3QgJywgcmVzICk7IFxyXG4gICAgfTtcclxuXHJcbiAgICBjaG9vc2VuX21lbnUoIGEsIGIgKXtcclxuICAgICAgICBpZiAoIGEgPT0gYiApIHJldHVybiB0cnVlO1xyXG4gICAgfTtcclxuXHJcbiAgICBzZXRfZXJyb3JfbXNnKCBlcnJvcl9tc2csIGxvY2F0aW9uID0gJ2dsb2JhbCcgKXtcclxuICAgICAgICB0aGlzLmVycm9yX21zZ1tsb2NhdGlvbl0gPSBlcnJvcl9tc2c7XHJcbiAgICAgICAgc2V0VGltZW91dCggKCk9PiB0aGlzLmVycm9yX21zZ1tsb2NhdGlvbl0gPSAnJywgMzAwMCApO1xyXG4gICAgfTtcclxuXHJcbiAgICBpc19jb21wb25lbnRfZXhpc3QobmFtZSl7XHJcbiAgICAgICAgbGV0IHJlcyA9IHRoaXMuY29tcG9uZW50cy5maW5kKCBjb21wID0+IGNvbXAubmFtZSA9PSBuYW1lKTtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKHJlcyk7XHJcbiAgICAgICAgcmV0dXJuIHJlcztcclxuICAgIH07XHJcblxyXG4gICAgc2V0X2VkaXRfY29tcG9uZW50KCBlZGl0X2NvbXAgKSB7XHJcbiAgICAgICAgdGhpcy5jb21wb25lbnRfZWRpdGFibGUgPSBlZGl0X2NvbXA7XHJcbiAgICAgICAgdGhpcy5jb21wb25lbnRfZWRpdGFibGUubmV3X25hbWUgPSB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZS5uYW1lO1xyXG4gICAgfTtcclxuXHJcbiAgICBzZXRfbmV3X2ZpZWxkX3R5cGUoIHZhbHVlICkge1xyXG4gICAgICAgIHRoaXMubmV3X2ZpZWxkLnR5cGUgPSB2YWx1ZTtcclxuICAgIH07XHJcblxyXG4gICAgc2hvd19pZl90eXBlX2ZpZWxkX2V4aXN0KCB0eXBlICkge1xyXG4gICAgICAgICByZXR1cm4gdGhpcy5jb21wb25lbnRfZWRpdGFibGUuYm9keS5maW5kKCBmaWVsZCA9PiBmaWVsZC50eXBlID09IHR5cGUgKTtcclxuICAgIH07XHJcblxyXG4gICAgaXNfZmllbGRfZXhpc3QobmFtZSl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLmJvZHkuZmluZCggZmllbGQgPT4gZmllbGQubmFtZSA9PSBuYW1lICk7XHJcbiAgICB9OyAgXHJcblxyXG4gICAgYWxsX2NvbXBvbmVudHNfbmFtZSAoKXtcclxuICAgICAgICBsZXQgY29tcF9uYW1lcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50cy5mb3JFYWNoKGZ1bmN0aW9uKGVsKXtcclxuICAgICAgICAgICAgY29tcF9uYW1lcyA9IFsuLi5jb21wX25hbWVzLCBlbC5uYW1lIF07XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyggY29tcF9uYW1lcyApO1xyXG4gICAgICAgIHJldHVybiBjb21wX25hbWVzOyBcclxuICAgIH07XHJcblxyXG5cclxuICAgIGFsbF9ncm91cHNfbmFtZSAoKXtcclxuICAgICAgICBsZXQgZ3JvdXBzX25hbWVzID0gW107XHJcbiAgICAgICAgdGhpcy5jb21wb25lbnRzLmZvckVhY2goZnVuY3Rpb24oZWwpe1xyXG4gICAgICAgICAgICBpZiAoZ3JvdXBzX25hbWVzLmluZGV4T2YoZWwuZ3JvdXApID09PSAtMSAmJlxyXG4gICAgICAgICAgICAgICAgZWwuZ3JvdXAgIT0gJ25vbmUnICl7XHJcbiAgICAgICAgICAgICAgICBncm91cHNfbmFtZXMgPSBbIC4uLmdyb3Vwc19uYW1lcywgZWwuZ3JvdXAgXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coIGdyb3Vwc19uYW1lcyApO1xyXG4gICAgICAgIHJldHVybiBncm91cHNfbmFtZXM7IFxyXG4gICAgfTtcclxuXHJcbiAgICBhZGRfbmV3X2ZpZWxkKCkge1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coIHRoaXMubmV3X2ZpZWxkLCAgdGhpcy5jb21wb25lbnRfZWRpdGFibGUgKTtcclxuXHJcbiAgICAgICAgaWYgKCAhdGhpcy5uZXdfZmllbGQubmFtZSApIHtcclxuICAgICAgICAgICAgdGhpcy5zZXRfZXJyb3JfbXNnKCAnIE5vIGZpZWxkIG5hbWUgd2FzIHByb3ZpZGVkICcsICduZXdfZmllbGQnICk7IFxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyggJ05vIG5hbWUgd2FzIHByb3ZpZGVkICcgKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIHRoaXMuaXNfZmllbGRfZXhpc3QodGhpcy5uZXdfZmllbGQubmFtZSkgKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0X2Vycm9yX21zZyggJ09uZSBmaWVsZCBoYXMgdGhpcyBuYW1lICcsICduZXdfZmllbGQnICk7IFxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyggJ09uZSBmaWxlZCBoYXMgdGhpcyBuYW1lJyApO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7ICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLm5ld19maWVsZC5faWQgPSB0aGlzLmNyZWF0ZV9ndWlkKCk7ICBcclxuICAgICAgICAvL2RvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduZXctZmllbGQtaWQnKS52YWx1ZSA9IHRoaXMubmV3X2ZpZWxkLnR5cGU7XHJcbiAgICAgICAgdGhpcy5jb21wb25lbnRfZWRpdGFibGUuYm9keSA9IFsuLi50aGlzLmNvbXBvbmVudF9lZGl0YWJsZS5ib2R5LCB0aGlzLm5ld19maWVsZF07XHJcblxyXG4gICAgICAgIGlmICggdGhpcy5jb21wb25lbnRfZWRpdGFibGUuZ3JvdXAgIT0gJ25vbmUnKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFkZF9uZXdfZmllbGRfdG9fZ3JvdXAoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMubmV3X2ZpZWxkID0geyB0eXBlOiB0aGlzLm5ld19maWVsZC50eXBlIH07XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMubmV3X2ZpZWxkID0geyB0eXBlOiB0aGlzLm5ld19maWVsZC50eXBlIH07XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyggIHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLmJvZHkgKTtcclxuICAgICAgICB0aGlzLnN0b3JhZ2VTZXJ2aWNlLnVwZGF0ZSgnL2FwaS9jb21wb25lbnRzJyx7XHJcbiAgICAgICAgICAgIGlkIDogdGhpcy5jb21wb25lbnRfZWRpdGFibGUuX2lkLFxyXG4gICAgICAgICAgICBuYW1lIDogdGhpcy5jb21wb25lbnRfZWRpdGFibGUubmFtZSxcclxuICAgICAgICAgICAgZ3JvdXAgOiB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZS5ncm91cCxcclxuICAgICAgICAgICAgYm9keSA6IHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLmJvZHlcclxuICAgICAgICB9KS5cclxuICAgICAgICAgICAgc3Vic2NyaWJlKCByZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coICdwdXQgLSAnICwgcmVzICk7XHJcbiAgICAgICAgICAgICAgICBpZiAoICFyZXMuZXJyb3IgKSB0aGlzLmNvbXBvbmVudHMgPSByZXMuY29tcG9uZW50cztcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCAnIGIgJywgdGhpcy5jb21wb25lbnRfZWRpdGFibGUuYm9keSApO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBhZGRfbmV3X2ZpZWxkX3RvX2dyb3VwKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdG9yYWdlU2VydmljZS51cGRhdGUoJy9hcGkvY29tcG9uZW50cy9ncm91cC9hZGQnLHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXAgOiB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZS5ncm91cCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmllbGQgOiB0aGlzLm5ld19maWVsZFxyXG4gICAgICAgICAgICAgICAgfSkuXHJcbiAgICAgICAgICAgICAgICBzdWJzY3JpYmUoIHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCAnYWxsIHB1dCAtICcgLCByZXMgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCAhcmVzLmVycm9yICkgdGhpcy5jb21wb25lbnRzID0gcmVzLmNvbXBvbmVudHM7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgZGVsZXRlX2ZpZWxkKCBpZCApe1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coIHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLmJvZHkgKTtcclxuICAgICAgICB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZS5ib2R5LmZvckVhY2goIChlbCwgaWR4LCBhcnIpID0+IHsgXHJcbiAgICAgICAgICAgIGlmKGVsLl9pZCA9PT0gaWQgKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZS5ib2R5LnNwbGljZShpZHgsIDEpO1xyXG4gICAgICAgICAgICB9IFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZiAoIHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLmdyb3VwICE9ICdub25lJykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kZWxldGVfZmllbGRfdG9fZ3JvdXAoaWQpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAvL2NvbnNvbGUubG9nKCB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZS5ib2R5ICkgOyAgICAgIFxyXG4gICAgICAgIHRoaXMuc3RvcmFnZVNlcnZpY2UudXBkYXRlKCcvYXBpL2NvbXBvbmVudHMnLHtcclxuICAgICAgICAgICAgaWQgOiB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZS5faWQsXHJcbiAgICAgICAgICAgIG5hbWUgOiB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZS5uYW1lLFxyXG4gICAgICAgICAgICBncm91cCA6IHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLmdyb3VwLFxyXG4gICAgICAgICAgICBib2R5IDogdGhpcy5jb21wb25lbnRfZWRpdGFibGUuYm9keVxyXG4gICAgICAgIH0pLlxyXG4gICAgICAgICAgICBzdWJzY3JpYmUoIHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggJ3B1dCAtICcgLCByZXMgKTtcclxuICAgICAgICAgICAgICAgIGlmICggIXJlcy5lcnJvciApIHRoaXMuY29tcG9uZW50cyA9IHJlcy5jb21wb25lbnRzO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgZGVsZXRlX2ZpZWxkX3RvX2dyb3VwKGlkKSB7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyggdGhpcy5jb21wb25lbnRfZWRpdGFibGUuYm9keSApIDsgICAgICBcclxuICAgICAgICB0aGlzLnN0b3JhZ2VTZXJ2aWNlLnVwZGF0ZSgnL2FwaS9jb21wb25lbnRzL2dyb3VwL2RlbGV0ZScse1xyXG4gICAgICAgICAgICBncm91cCA6IHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLmdyb3VwLCBcclxuICAgICAgICAgICAgaWQ6IGlkXHJcbiAgICAgICAgfSkuXHJcbiAgICAgICAgICAgIHN1YnNjcmliZSggcmVzID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCAncHV0IC0gJyAsIHJlcyApO1xyXG4gICAgICAgICAgICAgICAgaWYgKCAhcmVzLmVycm9yICkgdGhpcy5jb21wb25lbnRzID0gcmVzLmNvbXBvbmVudHM7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuXHJcblxyXG4gICAgc2V0X2NvbXBvbmVudF9maWVsZF92YWx1ZSggZmllbGQsIG5hbWUgKXtcclxuICAgICAgICBsZXQgY29tcCA9IHRoaXMuY29tcG9uZW50cy5maW5kKCBjb21wID0+IGNvbXAubmFtZSA9PT0gbmFtZSAmJiB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZS5uYW1lICE9PSBuYW1lICk7XHJcbiAgICAgICAgZmllbGQudmFsdWUgPSBjb21wO1xyXG4gICAgfTtcclxuXHJcbiAgICBzaG93X2pzb25fb2ZfZWRpdF9jb21wb25lbnQoKXtcclxuICAgICAgICB0aGlzLmpzb25fb2ZfZWRpdF9jb21wb25lbnRfaXNfdmlzaWJsZSA9ICF0aGlzLmpzb25fb2ZfZWRpdF9jb21wb25lbnRfaXNfdmlzaWJsZTtcclxuICAgIH07XHJcblxyXG4gICAgXHJcblxyXG4gICAgY3JlYXRlX2NvbXBvbmVudCgpe1xyXG4gICAgICAgIGlmICggISB0aGlzLm5ld19jb21wb25lbnQubmFtZSApIHtcclxuICAgICAgICAgICAgdGhpcy5zZXRfZXJyb3JfbXNnKCAnIE5vIG5hbWUgd2FzIHByb3ZpZGVkICcgKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coICdObyBuYW1lIHdhcyBwcm92aWRlZCAnICk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCB0aGlzLmlzX2NvbXBvbmVudF9leGlzdCh0aGlzLm5ld19jb21wb25lbnQubmFtZSkgKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0X2Vycm9yX21zZyggJ09uZSBjb21wb25lbnQgaGFzIHRoaXMgbmFtZSAnICk7IFxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyggJ09uZSBjb21wb25lbnQgaGFzIHRoaXMgbmFtZScgKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlOyAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoICEgdGhpcy5uZXdfY29tcG9uZW50Lmdyb3VwICkgdGhpcy5uZXdfY29tcG9uZW50Lmdyb3VwID0gJ25vbmUnIDtcclxuICAgICAgICBsZXQgYm9keSA9IFtdO1xyXG4gICAgICAgIGlmICggdGhpcy5uZXdfY29tcG9uZW50Lmdyb3VwICE9PSAnbm9uZScgKXtcclxuICAgICAgICAgICAgbGV0IHJlcyA9IHRoaXMuY29tcG9uZW50cy5maW5kKCBjb21wID0+IGNvbXAuZ3JvdXAgPT0gdGhpcy5uZXdfY29tcG9uZW50Lmdyb3VwKTtcclxuICAgICAgICAgICAgaWYgKCByZXMgKSBib2R5ID0gcmVzLmJvZHkgO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5zdG9yYWdlU2VydmljZS5pbnNlcnQoJy9hcGkvY29tcG9uZW50cycsIHtcclxuICAgICAgICAgICAgbmFtZSA6IHRoaXMubmV3X2NvbXBvbmVudC5uYW1lLFxyXG4gICAgICAgICAgICBncm91cCA6IHRoaXMubmV3X2NvbXBvbmVudC5ncm91cCB8fCAnbm9uZScsXHJcbiAgICAgICAgICAgIGJvZHkgOiBbXVxyXG4gICAgICAgICB9KS5cclxuICAgICAgICAgICAgc3Vic2NyaWJlKCByZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coICdwb3N0IC0gJyAsIHJlcyApO1xyXG4gICAgICAgICAgICAgICAgaWYgKCAhcmVzLmVycm9yICkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29tcG9uZW50cyA9IHJlcy5jb21wb25lbnRzO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBlZGl0X2NvbXAgPSB0aGlzLmNvbXBvbmVudHMuZmluZCggY29tcCA9PiBjb21wLm5hbWUgPT0gdGhpcy5uZXdfY29tcG9uZW50Lm5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICggZWRpdF9jb21wICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldF9jb21wb25lbnRzX2N1cnJlbnRfdmlldygnZWRpdC1jb21wb25lbnQnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRfZWRpdF9jb21wb25lbnQoIGVkaXRfY29tcCApO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgY2hhbmdlX2NvbXBvbmVudChjb21wb25lbnQpe1xyXG5cclxuICAgICAgICBpZiAoICB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZS5uZXdfbmFtZSAhPSB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZS5uYW1lICYmIFxyXG4gICAgICAgICAgICAgIHRoaXMuaXNfY29tcG9uZW50X2V4aXN0KHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLm5ld19uYW1lKSApIHtcclxuICAgICAgICAgICAgdGhpcy5zZXRfZXJyb3JfbXNnKCAnT25lIGNvbXBvbmVudCBoYXMgdGhpcyBuYW1lICcsICdlZGl0LWNvbXBvbmVudCcgKTsgXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCAnT25lIGNvbXBvbmVudCBoYXMgdGhpcyBuYW1lJyApO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7ICAgICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoIHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLm5ld19uYW1lICE9IHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLm5hbWUgKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLm5hbWUgPSB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZS5uZXdfbmFtZTsgXHJcbiAgICAgICAgfSAgIFxyXG4gICAgICAgIHRoaXMuc3RvcmFnZVNlcnZpY2UudXBkYXRlKCcvYXBpL2NvbXBvbmVudHMnLHtcclxuICAgICAgICAgICAgaWQgOiB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZS5faWQsXHJcbiAgICAgICAgICAgIG5hbWUgOiB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZS5uYW1lLFxyXG4gICAgICAgICAgICBncm91cCA6IHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLmdyb3VwLFxyXG4gICAgICAgICAgICBib2R5IDogdGhpcy5jb21wb25lbnRfZWRpdGFibGUuYm9keVxyXG4gICAgICAgIH0pLlxyXG4gICAgICAgICAgICBzdWJzY3JpYmUoIHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggJ3B1dCAtICcgLCByZXMgKTtcclxuICAgICAgICAgICAgICAgIGlmICggIXJlcy5lcnJvciApIHRoaXMuY29tcG9uZW50cyA9IHJlcy5jb21wb25lbnRzO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBjb3B5X2NvbXBvbmVudCgpIHtcclxuICAgICAgICBpZiAoICF0aGlzLmNvbXBvbmVudF9lZGl0YWJsZS5uZXdfbmFtZSB8fFxyXG4gICAgICAgICAgICAgIHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLm5hbWUgPT0gdGhpcy5jb21wb25lbnRfZWRpdGFibGUubmV3X25hbWUgKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0X2Vycm9yX21zZyggJ05vIG5ldyBuYW1lIHdhcyBwcm92aWRlZCAnLCAnZWRpdC1jb21wb25lbnQnICk7IFxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyggJ05vIG5ldyBuYW1lIHdhcyBwcm92aWRlZCAnICk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTsgICAgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKCB0aGlzLmlzX2NvbXBvbmVudF9leGlzdCh0aGlzLmNvbXBvbmVudF9lZGl0YWJsZS5uZXdfbmFtZSlcclxuICAgICAgICAgICAgKXtcclxuICAgICAgICAgICAgdGhpcy5zZXRfZXJyb3JfbXNnKCAnT25lIGNvbXBvbmVudCBoYXMgdGhpcyBuYW1lICcsICdlZGl0LWNvbXBvbmVudCcgKTsgXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCAnT25lIGNvbXBvbmVudCBoYXMgdGhpcyBuYW1lJyApO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc3RvcmFnZVNlcnZpY2UuaW5zZXJ0KCcvYXBpL2NvbXBvbmVudHMnLCB7XHJcbiAgICAgICAgICAgIGlkIDogdGhpcy5jb21wb25lbnRfZWRpdGFibGUuX2lkLFxyXG4gICAgICAgICAgICBuYW1lIDogdGhpcy5jb21wb25lbnRfZWRpdGFibGUubmV3X25hbWUsXHJcbiAgICAgICAgICAgIGdyb3VwIDogdGhpcy5jb21wb25lbnRfZWRpdGFibGUuZ3JvdXAsXHJcbiAgICAgICAgICAgIGJvZHkgOiB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZS5ib2R5XHJcbiAgICAgICAgIH0pLlxyXG4gICAgICAgICAgICBzdWJzY3JpYmUoIHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggJ3Bvc3QgLSAnICwgcmVzICk7XHJcbiAgICAgICAgICAgICAgICBpZiAoICFyZXMuZXJyb3IgKSB0aGlzLmNvbXBvbmVudHMgPSByZXMuY29tcG9uZW50cztcclxuICAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIFxyXG4gICAgZGVsZXRlX2NvbXBvbmVudCgpIHtcclxuICAgICAgICB0aGlzLnN0b3JhZ2VTZXJ2aWNlLmRlbGV0ZSgnL2FwaS9jb21wb25lbnRzJywgdGhpcy5jb21wb25lbnRfZWRpdGFibGUuX2lkKS5cclxuICAgICAgICAgICAgc3Vic2NyaWJlKCByZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coICdkZWxldGUgLSAnICwgcmVzICk7XHJcbiAgICAgICAgICAgICAgICBpZiAoICFyZXMuZXJyb3IgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb21wb25lbnRzID0gcmVzLmNvbXBvbmVudHM7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRfY29tcG9uZW50c19jdXJyZW50X3ZpZXcoICdhbGwnICk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBzZXRfcGFnZXNfY3VycmVudF92aWV3KCB2aWV3ICkge1xyXG4gICAgICAgIGlmICggdmlldyA9PSAnYWxsJykgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbGxlY3Rpb25fc2VsZWN0JykudmFsdWUgPSAnbm9uZSc7XHJcbiAgICAgICAgdGhpcy5wYWdlc19jdXJyZW50X3ZpZXcgPSB2aWV3O1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCAnIHBhZ2VzX2N1cnJlbnRfdmlldyAnLCB0aGlzLnBhZ2VzX2N1cnJlbnRfdmlldyApOyAgICAgICBcclxuICAgIH07XHJcblxyXG4gICAgYWxsX3BhZ2VzX25hbWUgKCl7XHJcbiAgICAgICAgbGV0IHBhZ2VfbmFtZXMgPSBbXTtcclxuICAgICAgICB0aGlzLnBhZ2VzLmZvckVhY2goZnVuY3Rpb24oZWwpe1xyXG4gICAgICAgICAgICBwYWdlX25hbWVzID0gWy4uLnBhZ2VfbmFtZXMsIGVsLm5hbWUgXTtcclxuICAgICAgICB9KTtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKCBjb21wX25hbWVzICk7XHJcbiAgICAgICAgcmV0dXJuIHBhZ2VfbmFtZXM7IFxyXG4gICAgfTtcclxuXHJcblxyXG5cclxuLypcclxuXHJcbiAgICBpbml0X25ld19jb21wb25lbnQobXV0YWJpbGl0eSA9ICcnKXtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBtdXRhYmlsaXR5IDogbXV0YWJpbGl0eVxyXG4gICAgICAgIH07XHJcbiAgICB9O1xyXG5cclxuICAgIHNldF9uZXdfY29tcG9uZW50X211dGFiaWxpdHkobXV0YWJpbGl0eSl7XHJcbiAgICAgICAgdGhpcy5uZXdfY29tcG9uZW50ID0gIHRoaXMuaW5pdF9uZXdfY29tcG9uZW50KCBtdXRhYmlsaXR5ICk7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICBnZXRfYWxsX2NvbXBvbmVudHMoKSB7XHJcbiAgICAgICAgdGhpcy5zdG9yYWdlU2VydmljZS5zZWxlY3QoJy9hcGkvY29tcG9uZW50cycgKS5cclxuICAgICAgICAgICAgc3Vic2NyaWJlKCByZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coICdnZXQgLSAnICwgcmVzICk7XHJcbiAgICAgICAgICAgICAgICBpZiggIXJlcy5lcnJvciApIHRoaXMuY29tcG9uZW50cyA9IHJlcy5jb21wb25lbnRzO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgY3JlYXRlX2NvbXBvbmVudCgpe1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCB0aGlzLmNvbXBvbmVudHMgKTtcclxuICAgICAgICBpZiAoICF0aGlzLm5ld19jb21wb25lbnQubmFtZSApIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coICcgbm8gbmFtZSB3YXMgcHJvdmlkZWQgJyk7XHJcbiAgICAgICAgICAgIHJldHVybiA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICggdGhpcy5leGlzdF9jb21wb25lbnRfd2hpdGhfdGhpc19uYW1lKCkgKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCAnIGNvbXBvbmVudCB3aXRoIHN1Y2ggbmFtZSBleGlzdHMgJyApO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc3RvcmFnZVNlcnZpY2UuaW5zZXJ0KCcvYXBpL2NvbXBvbmVudHMnLCB7XHJcbiAgICAgICAgICAgIG5hbWUgOiB0aGlzLm5ld19jb21wb25lbnQubmFtZSxcclxuICAgICAgICAgICAgZ3JvdXAgOiB0aGlzLm5ld19jb21wb25lbnQuZ3JvdXAgfHwgJycsXHJcbiAgICAgICAgICAgIG11dGFiaWxpdHkgOiB0aGlzLm5ld19jb21wb25lbnQubXV0YWJpbGl0eSxcclxuICAgICAgICAgICAgYm9keSA6IFtdXHJcbiAgICAgICAgIH0pLlxyXG4gICAgICAgICAgICBzdWJzY3JpYmUoIHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggJ3Bvc3QgLSAnICwgcmVzICk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggcmVzLm1zZyApO1xyXG4gICAgICAgICAgICAgICAgaWYgKCAhcmVzLmVycm9yICkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29tcG9uZW50cyA9IHJlcy5jb21wb25lbnRzO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV3X2NvbXBvbmVudCA9IHRoaXMuaW5pdF9uZXdfY29tcG9uZW50KHRoaXMubmV3X2NvbXBvbmVudC5tdXRhYmlsaXR5KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIGNoYW5nZV9jb21wb25lbnQoY29tcG9uZW50KXtcclxuICAgICAgICBpZiAoICFjb21wb25lbnQubmV3X25hbWUgKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdubyBuYW1lIHdhcyBwcm92aWRlZCAnKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiggdGhpcy5leGlzdF9jb21wb25lbnRfd2hpdGhfdGhpc19uYW1lKGNvbXBvbmVudC5uZXdfbmFtZSkgKXtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coICcgY29tcG9uZW50IHdpdGggc3VjaCBuYW1lIGV4aXN0cyAnICk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zdG9yYWdlU2VydmljZS51cGRhdGUoJy9hcGkvY29tcG9uZW50cycse1xyXG4gICAgICAgICAgICBpZCA6IGNvbXBvbmVudC5faWQsXHJcbiAgICAgICAgICAgIG5hbWUgOiBjb21wb25lbnQubmV3X25hbWUsXHJcbiAgICAgICAgICAgIGdyb3VwIDogY29tcG9uZW50Lmdyb3VwLFxyXG4gICAgICAgICAgICBtdXRhYmlsaXR5IDogdGhpcy5uZXdfY29tcG9uZW50Lm11dGFiaWxpdHksXHJcbiAgICAgICAgICAgIGJvZHkgOiBjb21wb25lbnQuYm9keVxyXG4gICAgICAgIH0pLlxyXG4gICAgICAgICAgICBzdWJzY3JpYmUoIHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggJ3B1dCAtICcgLCByZXMgKTtcclxuICAgICAgICAgICAgICAgIGlmICggIXJlcy5lcnJvciApIHRoaXMuY29tcG9uZW50cyA9IHJlcy5jb21wb25lbnRzO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBjb3B5X2NvbXBvbmVudChjb21wb25lbnQpIHtcclxuICAgICAgICBpZiAoICFjb21wb25lbnQubmV3X25hbWUgKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCAnbm8gbmFtZSB3YXMgcHJvdmlkZWQgJyApO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKCB0aGlzLmV4aXN0X2NvbXBvbmVudF93aGl0aF90aGlzX25hbWUoY29tcG9uZW50Lm5ld19uYW1lKSApe1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyggJyBjb21wb25lbnQgd2l0aCBzdWNoIG5hbWUgZXhpc3RzICcgKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnN0b3JhZ2VTZXJ2aWNlLmluc2VydCgnL2FwaS9jb21wb25lbnRzJywge1xyXG4gICAgICAgICAgICBuYW1lIDogY29tcG9uZW50Lm5ld19uYW1lLFxyXG4gICAgICAgICAgICBncm91cCA6IGNvbXBvbmVudC5ncm91cCxcclxuICAgICAgICAgICAgbXV0YWJpbGl0eSA6IGNvbXBvbmVudC5tdXRhYmlsaXR5LFxyXG4gICAgICAgICAgICBib2R5IDogY29tcG9uZW50LmJvZHlcclxuICAgICAgICAgfSkuXHJcbiAgICAgICAgICAgIHN1YnNjcmliZSggcmVzID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCAncG9zdCAtICcgLCByZXMgKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCByZXMubXNnICk7XHJcbiAgICAgICAgICAgICAgICBpZiAoICFyZXMuZXJyb3IgKSB0aGlzLmNvbXBvbmVudHMgPSByZXMuY29tcG9uZW50cztcclxuICAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGRlbGV0ZV9jb21wb25lbnQoaWQpIHtcclxuICAgICAgICBpZiAoICFpZCApIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ25vIGlkIHdhcyBwcm92aWRlZCAnKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnN0b3JhZ2VTZXJ2aWNlLmRlbGV0ZSgnL2FwaS9jb21wb25lbnRzJywgaWQpLlxyXG4gICAgICAgICAgICBzdWJzY3JpYmUoIHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggJ2RlbGV0ZSAtICcgLCByZXMgKTtcclxuICAgICAgICAgICAgICAgIGlmICggIXJlcy5lcnJvciApIHRoaXMuY29tcG9uZW50cyA9IHJlcy5jb21wb25lbnRzO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgZXhpc3RfY29tcG9uZW50X3doaXRoX3RoaXNfbmFtZShuYW1lID0gdGhpcy5uZXdfY29tcG9uZW50Lm5hbWUpe1xyXG4gICAgICAgIGlmKFxyXG4gICAgICAgICAgICB0aGlzLmNvbXBvbmVudHMuZmluZChlbCA9PiB7IHJldHVybiBlbC5uYW1lID09PSBuYW1lID8gdHJ1ZSA6IGZhbHNlIH0pXHJcbiAgICAgICAgICAgICkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfTtcclxuXHJcbiAgICBlZGl0X2ZpZWxkc19jb21wb25lbnQoY29tcG9uZW50KXtcclxuICAgICAgICB0aGlzLm5ld19maWVsZCA9IHsgdHlwZTogXCJzdHJpbmdcIiB9OyBcclxuICAgICAgICBjb25zb2xlLmxvZyggdGhpcy5jb21wb25lbnRfZWRpdGFibGUsIGNvbXBvbmVudCApO1xyXG4gICAgICAgIGlmICggdGhpcy5jb21wb25lbnRfZWRpdGFibGUuX2lkICE9IGNvbXBvbmVudC5faWQpICB7IFxyXG4gICAgICAgICAgICB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZSA9IGNvbXBvbmVudDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZSA9IFtdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxuICAgIHNob3dfZmllbGRzX2NvbXBvbmVudChjb21wb25lbnQpe1xyXG4gICAgICAgIGlmICggIHRoaXMuY29tcG9uZW50X2VkaXRhYmxlICYmXHJcbiAgICAgICAgICAgICAgdGhpcy5jb21wb25lbnRfZWRpdGFibGUuX2lkID09PSBjb21wb25lbnQuX2lkIFxyXG4gICAgICAgICkgcmV0dXJuIHRydWU7XHJcbiAgICB9OyBcclxuXHJcbiAgICBhZGRfZmllbGQoIGNvbXBvbmVudCwgbmV3X2ZpZWxkID0ge30gKXtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKCBjb21wb25lbnQsIG5ld19maWVsZCApO1xyXG4gICAgICAgIGlmICggIW5ld19maWVsZC5uYW1lICkgcmV0dXJuO1xyXG4gICAgICAgIGlmICggdGhpcy5leGlzdF9maWVsZF93aXRoX3RoaXNfbmFtZShjb21wb25lbnQsIG5ld19maWVsZC5uYW1lKSApIHJldHVybiA7XHJcbiAgICAgICAgdGhpcy5uZXdfZmllbGQgPSB7IHR5cGU6IFwic3RyaW5nXCIgfTsgXHJcbiAgICAgICAgbmV3X2ZpZWxkLl9pZCA9IHRoaXMuY3JlYXRlX2d1aWQoKTsgICAgICAgIFxyXG4gICAgICAgIGNvbXBvbmVudC5ib2R5ID0gWyAuLi4gY29tcG9uZW50LmJvZHkgLCBuZXdfZmllbGQgXTtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKCBjb21wb25lbnQuYm9keSApO1xyXG4gICAgICAgIHRoaXMuc3RvcmFnZVNlcnZpY2UudXBkYXRlKCcvYXBpL2NvbXBvbmVudHMnLHtcclxuICAgICAgICAgICAgaWQgOiBjb21wb25lbnQuX2lkLFxyXG4gICAgICAgICAgICBuYW1lIDogY29tcG9uZW50Lm5hbWUsXHJcbiAgICAgICAgICAgIGdyb3VwIDogY29tcG9uZW50Lmdyb3VwLFxyXG4gICAgICAgICAgICBtdXRhYmlsaXR5IDogY29tcG9uZW50Lm11dGFiaWxpdHksXHJcbiAgICAgICAgICAgIGJvZHkgOiBjb21wb25lbnQuYm9keVxyXG4gICAgICAgIH0pLlxyXG4gICAgICAgICAgICBzdWJzY3JpYmUoIHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggJ3B1dCAtICcgLCByZXMgKTtcclxuICAgICAgICAgICAgICAgIGlmICggIXJlcy5lcnJvciApIHRoaXMuY29tcG9uZW50cyA9IHJlcy5jb21wb25lbnRzO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgaWZfbnVtYmVyX2ZpZWxkKHZhbCl7XHJcbiAgICAgICAgdmFsID0gTnVtYmVyKHZhbCk7XHJcbiAgICAgICAgcmV0dXJuIHZhbCA/IHZhbCA6IDAgO1xyXG4gICAgfTtcclxuXHJcbiAgICBpZl9jb21wb25lbnRfZmllbGQoY29tcG9uZW50LCB2YWwpe1xyXG4gICAgICAgIGxldCByZXMgPSBbXTtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKGNvbXBvbmVudCwgdmFsKTtcclxuICAgICAgICB0aGlzLmNvbXBvbmVudHMuZmluZChlbCA9PiB7IFxyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCBlbC5uYW1lICk7XHJcbiAgICAgICAgICAgIGlmICggZWwubmFtZSA9PT0gdmFsICYmXHJcbiAgICAgICAgICAgICAgIGNvbXBvbmVudC5uYW1lICE9PSB2YWwgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCAncmVzICcsIGVsICk7XHJcbiAgICAgICAgICAgICAgICAgICByZXMgPSAgZWw7XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyggJyAvLy8vLy8vLy8vLy8vLy8vICcpOyAgICAgICAgICAgICAgICBcclxuICAgICAgICB9KVxyXG4gICAgICAgIHJldHVybiByZXM7XHJcbiAgICB9O1xyXG5cclxuICAgIGNoYW5nZV9maWVsZCggc2V0dGluZ3MgPSB7fSApe1xyXG4gICAgICAgIGxldCBjb21wb25lbnQgPSBzZXR0aW5ncy5jb21wb25lbnQ7XHJcbiAgICAgICAgbGV0IGZpZWxkID0gc2V0dGluZ3MuZmllbGQ7XHJcblxyXG4gICAgICAgIC8vY29uc29sZS5sb2coY29tcG9uZW50LCBmaWVsZCk7XHJcbiAgICAgICAgaWYgKCB0aGlzLmV4aXN0X2ZpZWxkX3dpdGhfdGhpc19uYW1lKGNvbXBvbmVudCwgZmllbGQuZWRpdF9uYW1lLCBmaWVsZC5faWQgKSApIHJldHVybjtcclxuICAgICAgICBpZiAoIHNldHRpbmdzLnR5cGUgPT0gJ251bWJlcicgKSB7XHJcbiAgICAgICAgICAgIGZpZWxkLmVkaXRfdmFsdWUgPSB0aGlzLmlmX251bWJlcl9maWVsZChmaWVsZC5lZGl0X3ZhbHVlX25hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIHNldHRpbmdzLnR5cGUgPT0gJ2NvbXBvbmVudCcgKSB7XHJcbiAgICAgICAgICAgIGZpZWxkLmNvbXBvbmVudF92YWx1ZSA9IHRoaXMuaWZfY29tcG9uZW50X2ZpZWxkKGNvbXBvbmVudCwgZmllbGQuZWRpdF92YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpZWxkLm5hbWUgPSBmaWVsZC5lZGl0X25hbWUgfHwgZmllbGQubmFtZTtcclxuICAgICAgICBmaWVsZC52YWx1ZSA9IGZpZWxkLmVkaXRfdmFsdWU7XHJcbiAgICAgICAgZGVsZXRlIGZpZWxkLmVkaXRfbmFtZTtcclxuICAgICAgICBkZWxldGUgZmllbGQuZWRpdF92YWx1ZTtcclxuICAgICAgICBkZWxldGUgZmllbGQuYXNzaWdubWVudDtcclxuXHJcbiAgICAgICAgdGhpcy5zdG9yYWdlU2VydmljZS51cGRhdGUoJy9hcGkvY29tcG9uZW50cycse1xyXG4gICAgICAgICAgICBpZCA6IGNvbXBvbmVudC5faWQsXHJcbiAgICAgICAgICAgIG5hbWUgOiBjb21wb25lbnQubmFtZSxcclxuICAgICAgICAgICAgZ3JvdXAgOiBjb21wb25lbnQuZ3JvdXAsXHJcbiAgICAgICAgICAgIG11dGFiaWxpdHkgOiBjb21wb25lbnQubXV0YWJpbGl0eSxcclxuICAgICAgICAgICAgYm9keSA6IGNvbXBvbmVudC5ib2R5XHJcbiAgICAgICAgfSkuXHJcbiAgICAgICAgICAgIHN1YnNjcmliZSggcmVzID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCAncHV0IC0gJyAsIHJlcyApO1xyXG4gICAgICAgICAgICAgICAgaWYgKCAhcmVzLmVycm9yICkgdGhpcy5jb21wb25lbnRzID0gcmVzLmNvbXBvbmVudHM7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgXHJcbiAgICB9O1xyXG5cclxuICAgIGNvcHlfZmllbGQoIHNldHRpbmdzID0ge30gKXtcclxuICAgICAgICBsZXQgY29tcG9uZW50ID0gc2V0dGluZ3MuY29tcG9uZW50O1xyXG4gICAgICAgIGxldCBmaWVsZCA9IHNldHRpbmdzLmZpZWxkO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGNvbXBvbmVudCwgZmllbGQpO1xyXG4gICAgICAgIGlmICggIWZpZWxkLmVkaXRfbmFtZSApIHJldHVybjtcclxuICAgICAgICBpZiAoIHRoaXMuZXhpc3RfZmllbGRfd2l0aF90aGlzX25hbWUoY29tcG9uZW50LCBmaWVsZC5lZGl0X25hbWUsIGZpZWxkLl9pZCApICkgcmV0dXJuO1xyXG4gICAgICAgIGxldCBuZXdfZmllbGQgPSB0aGlzLmRlZXBDb3B5KGZpZWxkKTtcclxuICAgICAgICBuZXdfZmllbGQuX2lkID0gdGhpcy5jcmVhdGVfZ3VpZCgpO1xyXG4gICAgICAgIG5ld19maWVsZC5uYW1lID0gbmV3X2ZpZWxkLmVkaXRfbmFtZTtcclxuICAgICAgICBuZXdfZmllbGQudmFsdWUgPSAnJztcclxuICAgICAgICBpZiAoIHNldHRpbmdzLnR5cGUgPT0gJ251bWJlcicgKSB7XHJcbiAgICAgICAgICAgIG5ld19maWVsZC52YWx1ZT0gdGhpcy5pZl9udW1iZXJfZmllbGQobmV3X2ZpZWxkLnZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCBzZXR0aW5ncy50eXBlID09ICdjb21wb25lbnQnICkge1xyXG4gICAgICAgICAgICB0aGlzLmlmX2NvbXBvbmVudF9maWVsZChjb21wb25lbnQsIG5ld19maWVsZC52YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGRlbGV0ZSBuZXdfZmllbGQuZWRpdF9uYW1lO1xyXG4gICAgICAgIGRlbGV0ZSBuZXdfZmllbGQuZWRpdF92YWx1ZTtcclxuICAgICAgICBkZWxldGUgbmV3X2ZpZWxkLmFzc2lnbm1lbnQ7XHJcbiAgICAgICAgY29tcG9uZW50LmJvZHkgPSBbIC4uLiBjb21wb25lbnQuYm9keSAsIG5ld19maWVsZCBdO1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coIG5ld19maWVsZCApO1xyXG4gICAgICAgIHRoaXMuc3RvcmFnZVNlcnZpY2UudXBkYXRlKCcvYXBpL2NvbXBvbmVudHMnLHtcclxuICAgICAgICAgICAgaWQgOiBjb21wb25lbnQuX2lkLFxyXG4gICAgICAgICAgICBuYW1lIDogY29tcG9uZW50Lm5hbWUsXHJcbiAgICAgICAgICAgIGdyb3VwIDogY29tcG9uZW50Lmdyb3VwLFxyXG4gICAgICAgICAgICBtdXRhYmlsaXR5IDogY29tcG9uZW50Lm11dGFiaWxpdHksXHJcbiAgICAgICAgICAgIGJvZHkgOiBjb21wb25lbnQuYm9keVxyXG4gICAgICAgIH0pLlxyXG4gICAgICAgICAgICBzdWJzY3JpYmUoIHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggJ3B1dCAtICcgLCByZXMgKTtcclxuICAgICAgICAgICAgICAgIGlmICggIXJlcy5lcnJvciApIHRoaXMuY29tcG9uZW50cyA9IHJlcy5jb21wb25lbnRzO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBkZWxldGVfZmllbGQoIHNldHRpbmdzID0ge30gKXtcclxuICAgICAgICBsZXQgY29tcG9uZW50ID0gc2V0dGluZ3MuY29tcG9uZW50O1xyXG4gICAgICAgIGxldCBmaWVsZCA9IHNldHRpbmdzLmZpZWxkO1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coY29tcG9uZW50LCBmaWVsZCk7XHJcbiAgICAgICAgaWYgKCAhY29tcG9uZW50IHx8ICFmaWVsZCApIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coICdubyBjb21wb25lbnQgb3IgZmllbGQnKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb21wb25lbnQuYm9keS5mb3JFYWNoKCAoZWwsIGlkeCwgYXJyKSA9PiB7IFxyXG4gICAgICAgICAgICBpZihlbC5faWQgPT09IGZpZWxkLl9pZCApIHtcclxuICAgICAgICAgICAgICAgIGFyci5zcGxpY2UoaWR4LCAxKTtcclxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coIGFyciwgaWR4ICk7XHJcbiAgICAgICAgICAgIH0gXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5zdG9yYWdlU2VydmljZS51cGRhdGUoJy9hcGkvY29tcG9uZW50cycse1xyXG4gICAgICAgICAgICBpZCA6IGNvbXBvbmVudC5faWQsXHJcbiAgICAgICAgICAgIG5hbWUgOiBjb21wb25lbnQubmFtZSxcclxuICAgICAgICAgICAgZ3JvdXAgOiBjb21wb25lbnQuZ3JvdXAsXHJcbiAgICAgICAgICAgIG11dGFiaWxpdHkgOiBjb21wb25lbnQubXV0YWJpbGl0eSxcclxuICAgICAgICAgICAgYm9keSA6IGNvbXBvbmVudC5ib2R5XHJcbiAgICAgICAgfSkuXHJcbiAgICAgICAgICAgIHN1YnNjcmliZSggcmVzID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCAncHV0IC0gJyAsIHJlcyApO1xyXG4gICAgICAgICAgICAgICAgaWYgKCAhcmVzLmVycm9yICkgdGhpcy5jb21wb25lbnRzID0gcmVzLmNvbXBvbmVudHM7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgXHJcbiAgICB9O1xyXG5cclxuICAgIHZhbHVlX2Fzc2lnbm1lbnQoZmllbGQpe1xyXG4gICAgICAgIGlmICggICFmaWVsZC5hc3NpZ25tZW50ICl7XHJcbiAgICAgICAgICAgIGlmICggZmllbGQudHlwZSA9PSAnY29tcG9uZW50JyApIHtcclxuICAgICAgICAgICAgICAgIGZpZWxkLmNvbXBvbmVudF92YWx1ZSA9IGZpZWxkLmNvbXBvbmVudF92YWx1ZSB8fCBbXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmaWVsZC5lZGl0X3ZhbHVlID0gZmllbGQudmFsdWU7XHJcbiAgICAgICAgICAgIGZpZWxkLmFzc2lnbm1lbnQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH07XHJcblxyXG4gICAgZXhpc3RfZmllbGRfd2l0aF90aGlzX25hbWUoY29tcG9uZW50LCBmaWVsZF9uYW1lLCBmaWVsZF9pZCApe1xyXG4gICAgICAgIGlmICggIWNvbXBvbmVudCB8fFxyXG4gICAgICAgICAgICAgIWNvbXBvbmVudC5ib2R5IFxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnIGZpZWxkcyB3YXMgbm90IHByb3ZpZGVkICcpO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoXHJcbiAgICAgICAgICAgIGNvbXBvbmVudC5ib2R5LmZpbmQoZWwgPT4geyByZXR1cm4gKGVsLm5hbWUgPT09IGZpZWxkX25hbWUgJiZcclxuICAgICAgICAgICAgICAgZWwuX2lkICE9PSBmaWVsZF9pZCApID8gdHJ1ZSA6IGZhbHNlIH0pXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCAgJyBmaWVsZCB3aXRoIHN1Y2ggbmFtZSBleGlzdHMgJyApO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfTtcclxuICAgIFxyXG4qL1xyXG5cclxuICAgIFxyXG5cclxuICAgIC8vIHJldHVybiB1bmlxdWUgaWRcclxuICAgIGNyZWF0ZV9ndWlkKCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIHM0KCkge1xyXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5mbG9vcigoMSArIE1hdGgucmFuZG9tKCkpICogMHgxMDAwMClcclxuICAgICAgICAgICAgICAgIC50b1N0cmluZygxNilcclxuICAgICAgICAgICAgICAgIC5zdWJzdHJpbmcoMSk7XHJcbiAgICAgICAgfVxyXG4gXHQgICAgcmV0dXJuIHM0KCkgKyBzNCgpICsgJy0nICsgczQoKSArICctJyArIHM0KCkgKyAnLScgK1xyXG4gICAgICAgICAgICAgICBzNCgpICsgJy0nICsgczQoKSArIHM0KCkgKyBzNCgpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvLyAgUmV0dXJucyBhIGRlZXAgY29weSBvZiB0aGUgb2JqZWN0XHJcbiAgICBkZWVwQ29weShvbGRPYmo6IGFueSkge1xyXG4gICAgICAgIGxldCBuZXdPYmogPSBvbGRPYmo7XHJcbiAgICAgICAgaWYgKG9sZE9iaiAmJiB0eXBlb2Ygb2xkT2JqID09PSBcIm9iamVjdFwiKSB7XHJcbiAgICAgICAgICAgIG5ld09iaiA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvbGRPYmopID09PSBcIltvYmplY3QgQXJyYXldXCIgPyBbXSA6IHt9O1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpIGluIG9sZE9iaikge1xyXG4gICAgICAgICAgICAgICAgbmV3T2JqW2ldID0gdGhpcy5kZWVwQ29weShvbGRPYmpbaV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZXdPYmo7XHJcbiAgICB9O1xyXG5cclxuXHJcblxyXG5cclxufVxyXG5cclxuXHJcbi8qXHJcblxyXG5cclxubGV0IGN2dF9yX24gPSAoKCkgPT4ge1xyXG5cclxuICB2YXIgbnV0ID0gWzEwMDAsIDkwMCwgNTAwLCA0MDAsIDEwMCwgOTAsIDUwLCA0MCwgMTAsIDksIDUsIDQsIDFdO1xyXG4gIHZhciByb20gPSBbJ00nLCAnQ00nLCAnRCcsICdDRCcsICdDJywgJ1hDJywgJ0wnLCAnWEwnLCAnWCcsICdJWCcsICdWJywgJ0lWJywgJ0knXTtcclxuICB2YXIgYWxsID0ge0k6MSxWOjUsWDoxMCxMOjUwLEM6MTAwLEQ6NTAwLE06MTAwMH07XHJcblxyXG4gIHZhciBjdnRfcl9uX3RvX3JvbWFuID0gKGFyYWJpYykgPT4ge1xyXG4gICAgbGV0IHJlcyA9ICcnOyAgXHJcbiAgICBudXQuZm9yRWFjaCggKGVsLCBpZHgsIGFyciApID0+e1xyXG4gICAgICAgIHdoaWxlICggYXJhYmljID49IG51dFtpZHhdICkge1xyXG4gICAgICAgICAgICByZXMgKz0gcm9tW2lkeF07XHJcbiAgICAgICAgICAgIGFyYWJpYyAtPSBudXRbaWR4XTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgIHJldHVybiByZXM7XHJcbiAgfTtcclxuXHJcbiAgdmFyIGN2dF9yX25fZm9ybV9yb21hbiA9IChyb21hbikgPT4ge1xyXG4gICAgICBsZXQgcmVzID0gMDtcclxuICAgICAgbGV0IGwgPSByb21hbi5sZW5ndGg7XHJcbiAgICAgIHdoaWxlIChsLS0pIHtcclxuICAgICAgICBpZiAoIGFsbFtyb21hbltsXV0gPCBhbGxbcm9tYW5bbCsxXV0gKSB7IFxyXG4gICAgICAgICAgICByZXMgLT0gYWxsW3JvbWFuW2xdXTsgICBcclxuICAgICAgICB9IGVsc2UgeyBcclxuICAgICAgICAgICAgcmVzICs9IGFsbFtyb21hbltsXV0gXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgICByZXR1cm4gcmVzO1xyXG4gIH07XHJcblxyXG4gIHJldHVybiAobnVtKSA9PiB7XHJcbiAgICBpZiAoIHR5cGVvZiBudW0gPT09ICdudW1iZXInKSByZXR1cm4gY3Z0X3Jfbl90b19yb21hbiggbnVtICk7XHJcbiAgICBpZiAoIHR5cGVvZiBudW0gPT09ICdzdHJpbmcnKSByZXR1cm4gY3Z0X3Jfbl9mb3JtX3JvbWFuKCBudW0udG9VcHBlckNhc2UoKSApO1xyXG4gIH07XHJcblxyXG59KSgpO1xyXG5cclxuXHJcbmNvbnNvbGUubG9nKCBjdnRfcl9uKDMwMDMpICk7XHJcbmNvbnNvbGUubG9nKCBjdnRfcl9uKDQ0MykgKTtcclxuY29uc29sZS5sb2coIGN2dF9yX24oNjkpICk7XHJcbmNvbnNvbGUubG9nKCBjdnRfcl9uKDIpICk7XHJcbmNvbnNvbGUubG9nKCBjdnRfcl9uKDk5KSApO1xyXG5jb25zb2xlLmxvZyggY3Z0X3JfbigzNCkgKTtcclxuY29uc29sZS5sb2coIGN2dF9yX24oNDU2KSApO1xyXG5cclxuY29uc29sZS5sb2coJy0tLS0tLS0tLS0tLS0tLS0tLS0nKTtcclxuXHJcbmNvbnNvbGUubG9nKCBjdnRfcl9uKCdNTU1JSUknKSApO1xyXG5jb25zb2xlLmxvZyggY3Z0X3JfbignQ0RYTElJSScpICk7XHJcbmNvbnNvbGUubG9nKCBjdnRfcl9uKCdMWElYJykgKTtcclxuY29uc29sZS5sb2coIGN2dF9yX24oJ0lJJykgKTtcclxuY29uc29sZS5sb2coIGN2dF9yX24oJ1hDSVgnKSApO1xyXG5jb25zb2xlLmxvZyggY3Z0X3JfbignWFhYSVYnKSApO1xyXG5jb25zb2xlLmxvZyggY3Z0X3JfbignQ0RMVkknKSApO1xyXG5cclxuKi8iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=

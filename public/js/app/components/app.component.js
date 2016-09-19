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
        //public component_editable = [];
        this.new_field = { type: "string" };
        //public new_group = [];
        this.components_current_view = 'all';
        this.new_component = [];
        //public create_component_group = '';
        this.error_msg = [];
    }
    AppComponent.prototype.ngOnInit = function () {
        console.log('ngOnInit');
        this.get_all_components();
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvYXBwLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEscUJBQTBCLGVBQWUsQ0FBQyxDQUFBO0FBRTFDLGdDQUE2Qiw2QkFBNkIsQ0FBQyxDQUFBO0FBRTNELG1DQUFnQyw2QkFBNkIsQ0FBQyxDQUFBO0FBQzlELGlDQUE4QiwyQkFBMkIsQ0FBQyxDQUFBO0FBVTFEO0lBV0ksc0JBQW1CLGNBQThCO1FBQTlCLG1CQUFjLEdBQWQsY0FBYyxDQUFnQjtRQVZqRCxtREFBbUQ7UUFDNUMsZUFBVSxHQUFHLEVBQUUsQ0FBQztRQUN2QixpQ0FBaUM7UUFDMUIsY0FBUyxHQUFHLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxDQUFDO1FBQ3RDLHdCQUF3QjtRQUNqQiw0QkFBdUIsR0FBRyxLQUFLLENBQUM7UUFDaEMsa0JBQWEsR0FBRyxFQUFFLENBQUM7UUFDMUIscUNBQXFDO1FBQzlCLGNBQVMsR0FBRyxFQUFFLENBQUM7SUFFOEIsQ0FBQztJQUVyRCwrQkFBUSxHQUFSO1FBQ0ksT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUN4QixJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztJQUM5QixDQUFDOztJQUVELHlDQUFrQixHQUFsQjtRQUFBLGlCQU1DO1FBTEcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUU7WUFDMUMsU0FBUyxDQUFFLFVBQUEsR0FBRztZQUNWLE9BQU8sQ0FBQyxHQUFHLENBQUUsUUFBUSxFQUFHLEdBQUcsQ0FBRSxDQUFDO1lBQzlCLEVBQUUsQ0FBQSxDQUFFLENBQUMsR0FBRyxDQUFDLEtBQU0sQ0FBQztnQkFBQyxLQUFJLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUM7UUFDdEQsQ0FBQyxDQUFDLENBQUM7SUFDWCxDQUFDOztJQUVELHVDQUFnQixHQUFoQixVQUFrQixJQUFJO1FBQ2xCLElBQUksQ0FBQyxZQUFZ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LENBQUM7SUFDbEIsQ0FBQzs7SUFybkJMO1FBQUMsZ0JBQVMsQ0FBQztZQUNQLFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtZQUNuQixRQUFRLEVBQUUsUUFBUTtZQUNsQixXQUFXLEVBQUUsbUJBQW1CO1lBQ2hDLFNBQVMsRUFBRSxDQUFDLGVBQWUsQ0FBQztZQUM1QixTQUFTLEVBQUUsQ0FBQyxnQ0FBYyxDQUFDO1lBQzNCLEtBQUssRUFBRSxDQUFDLHNDQUFpQixFQUFFLGtDQUFlLENBQUM7U0FDOUMsQ0FBQzs7b0JBQUE7SUFtbkJGLG1CQUFDO0FBQUQsQ0FsbkJBLEFBa25CQyxJQUFBO0FBbG5CWSxvQkFBWSxlQWtuQnhCLENBQUE7QUFHRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBNERFIiwiZmlsZSI6ImNvbXBvbmVudHMvYXBwLmNvbXBvbmVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuaW1wb3J0IHtTdG9yYWdlU2VydmljZX0gZnJvbSBcIi4uL3NlcnZpY2VzL3N0b3JhZ2Uuc2VydmljZVwiO1xyXG5cclxuaW1wb3J0IHtPYmplY3RUb0FycmF5UGlwZX0gZnJvbSBcIi4uL3BpcGVzL29iamVjdFRvQXJyYXkucGlwZVwiO1xyXG5pbXBvcnQge3NvcnRCeUdyb3VwUGlwZX0gZnJvbSBcIi4uL3BpcGVzL3NvcnRCeUdyb3VwLnBpcGVcIjtcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gICAgbW9kdWxlSWQ6IG1vZHVsZS5pZCwgXHJcbiAgICBzZWxlY3RvcjogJ215LWFwcCcsXHJcbiAgICB0ZW1wbGF0ZVVybDogJ2FwcC50ZW1wbGF0ZS5odG1sJyxcclxuICAgIHN0eWxlVXJsczogWydhcHAuc3R5bGUuY3NzJ10sXHJcbiAgICBwcm92aWRlcnM6IFtTdG9yYWdlU2VydmljZV0sXHJcbiAgICBwaXBlczogW09iamVjdFRvQXJyYXlQaXBlLCBzb3J0QnlHcm91cFBpcGVdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBBcHBDb21wb25lbnQge1xyXG4gICAgLy9wdWJsaWMgbmV3X2NvbXBvbmVudCA9IHRoaXMuaW5pdF9uZXdfY29tcG9uZW50KCk7XHJcbiAgICBwdWJsaWMgY29tcG9uZW50cyA9IFtdO1xyXG4gICAgLy9wdWJsaWMgY29tcG9uZW50X2VkaXRhYmxlID0gW107XHJcbiAgICBwdWJsaWMgbmV3X2ZpZWxkID0geyB0eXBlOiBcInN0cmluZ1wiIH07ICAgXHJcbiAgICAvL3B1YmxpYyBuZXdfZ3JvdXAgPSBbXTtcclxuICAgIHB1YmxpYyBjb21wb25lbnRzX2N1cnJlbnRfdmlldyA9ICdhbGwnO1xyXG4gICAgcHVibGljIG5ld19jb21wb25lbnQgPSBbXTtcclxuICAgIC8vcHVibGljIGNyZWF0ZV9jb21wb25lbnRfZ3JvdXAgPSAnJztcclxuICAgIHB1YmxpYyBlcnJvcl9tc2cgPSBbXTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgc3RvcmFnZVNlcnZpY2U6IFN0b3JhZ2VTZXJ2aWNlKSB7fVxyXG5cclxuICAgIG5nT25Jbml0KCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCduZ09uSW5pdCcpO1xyXG4gICAgICAgIHRoaXMuZ2V0X2FsbF9jb21wb25lbnRzKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIGdldF9hbGxfY29tcG9uZW50cygpIHtcclxuICAgICAgICB0aGlzLnN0b3JhZ2VTZXJ2aWNlLnNlbGVjdCgnL2FwaS9jb21wb25lbnRzJyApLlxyXG4gICAgICAgICAgICBzdWJzY3JpYmUoIHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggJ2dldCAtICcgLCByZXMgKTtcclxuICAgICAgICAgICAgICAgIGlmKCAhcmVzLmVycm9yICkgdGhpcy5jb21wb25lbnRzID0gcmVzLmNvbXBvbmVudHM7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBzZXRfY3VycmVudF92aWV3KCB2aWV3ICl7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50X3ZpZXcgPSB2aWV3O1xyXG4gICAgfTtcclxuICAgIHNldF9jb21wb25lbnRzX2N1cnJlbnRfdmlldyggdmlldyApIHtcclxuICAgICAgICBpZiAoIHZpZXcgPT0gJ2FsbCcpIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdncm91cF9zZWxlY3QnKS52YWx1ZSA9ICdub25lJztcclxuICAgICAgICB0aGlzLmNvbXBvbmVudHNfY3VycmVudF92aWV3ID0gdmlldztcclxuICAgICAgICBjb25zb2xlLmxvZyggJyBjb21wb25lbnRzX2N1cnJlbnRfdmlldyAnLCB0aGlzLmNvbXBvbmVudHNfY3VycmVudF92aWV3ICk7ICAgICAgIFxyXG4gICAgfTtcclxuXHJcbiAgICBzZXRfc29ydGVkX2NvbXBvbmVudHNfY3VycmVudF92aWV3KCBzb3J0ICl7XHJcbiAgICAgICAgdGhpcy5jb21wb25lbnRzX2N1cnJlbnRfdmlldyA9ICdzb3J0ZWRfdmlldyc7XHJcbiAgICAgICAgdGhpcy5zb3J0ZWRfYnlfdmFsdWUgPSBzb3J0OyBcclxuICAgICAgICBjb25zb2xlLmxvZyggdGhpcy5zb3J0ZWRfYnlfdmFsdWUgKTsgXHJcbiAgICB9XHJcblxyXG4gICAgc2V0X25ld19jb21wb25lbnRfZ3JvdXBfc2VsZWN0KCB2YWx1ZSApIHtcclxuICAgICAgICB0aGlzLm5ld19jb21wb25lbnQuZ3JvdXAgPSB2YWx1ZTtcclxuICAgIH07XHJcblxyXG4gICAgY2hhbmdlX25ld19jb21wb25lbnRfZ3JvdXAoKSB7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyggJ2tleXVwIHZhbCAnLCB0aGlzLmNyZWF0ZV9jb21wb25lbnRfZ3JvdXAgKTtcclxuICAgICAgICBsZXQgcmVzID0gWzEsMiwzLDRdLmZpbmQoIGVsID0+IGVsID09IHRoaXMubmV3X2NvbXBvbmVudC5ncm91cCkgfHwgJ25vbmUnIDtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmV3X2NvbXBvbmVudF9ncm91cF9zZWxlY3QnKS52YWx1ZSA9IHJlcztcclxuICAgICAgICBjb25zb2xlLmxvZyggJ25ld19jb21wb25lbnRfZ3JvdXBfc2VsZWN0ICcsIHJlcyApOyBcclxuICAgIH07XHJcblxyXG4gICAgY2hvb3Nlbl9tZW51KCBhLCBiICl7XHJcbiAgICAgICAgaWYgKCBhID09IGIgKSByZXR1cm4gdHJ1ZTtcclxuICAgIH07XHJcblxyXG4gICAgc2V0X2Vycm9yX21zZyggZXJyb3JfbXNnLCBsb2NhdGlvbiA9ICdnbG9iYWwnICl7XHJcbiAgICAgICAgdGhpcy5lcnJvcl9tc2dbbG9jYXRpb25dID0gZXJyb3JfbXNnO1xyXG4gICAgICAgIHNldFRpbWVvdXQoICgpPT4gdGhpcy5lcnJvcl9tc2dbbG9jYXRpb25dID0gJycsIDMwMDAgKTtcclxuICAgIH07XHJcblxyXG4gICAgaXNfY29tcG9uZW50X2V4aXN0KG5hbWUpe1xyXG4gICAgICAgIGxldCByZXMgPSB0aGlzLmNvbXBvbmVudHMuZmluZCggY29tcCA9PiBjb21wLm5hbWUgPT0gbmFtZSk7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhyZXMpO1xyXG4gICAgICAgIHJldHVybiByZXM7XHJcbiAgICB9O1xyXG5cclxuICAgIHNldF9lZGl0X2NvbXBvbmVudCggZWRpdF9jb21wICkge1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50X2VkaXRhYmxlID0gZWRpdF9jb21wO1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLm5ld19uYW1lID0gdGhpcy5jb21wb25lbnRfZWRpdGFibGUubmFtZTtcclxuICAgIH07XHJcblxyXG4gICAgc2V0X25ld19maWVsZF90eXBlKCB2YWx1ZSApIHtcclxuICAgICAgICB0aGlzLm5ld19maWVsZC50eXBlID0gdmFsdWU7XHJcbiAgICB9O1xyXG5cclxuICAgIHNob3dfaWZfdHlwZV9maWVsZF9leGlzdCggdHlwZSApIHtcclxuICAgICAgICAgcmV0dXJuIHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLmJvZHkuZmluZCggZmllbGQgPT4gZmllbGQudHlwZSA9PSB0eXBlICk7XHJcbiAgICB9O1xyXG5cclxuICAgIGlzX2ZpZWxkX2V4aXN0KG5hbWUpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZS5ib2R5LmZpbmQoIGZpZWxkID0+IGZpZWxkLm5hbWUgPT0gbmFtZSApO1xyXG4gICAgfTsgIFxyXG5cclxuICAgIGFsbF9jb21wb25lbnRzX25hbWUgKCl7XHJcbiAgICAgICAgbGV0IGNvbXBfbmFtZXMgPSBbXTtcclxuICAgICAgICB0aGlzLmNvbXBvbmVudHMuZm9yRWFjaChmdW5jdGlvbihlbCl7XHJcbiAgICAgICAgICAgIGNvbXBfbmFtZXMgPSBbLi4uY29tcF9uYW1lcywgZWwubmFtZSBdO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coIGNvbXBfbmFtZXMgKTtcclxuICAgICAgICByZXR1cm4gY29tcF9uYW1lczsgXHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICBhbGxfZ3JvdXBzX25hbWUgKCl7XHJcbiAgICAgICAgbGV0IGdyb3Vwc19uYW1lcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50cy5mb3JFYWNoKGZ1bmN0aW9uKGVsKXtcclxuICAgICAgICAgICAgaWYgKGdyb3Vwc19uYW1lcy5pbmRleE9mKGVsLmdyb3VwKSA9PT0gLTEgJiZcclxuICAgICAgICAgICAgICAgIGVsLmdyb3VwICE9ICdub25lJyApe1xyXG4gICAgICAgICAgICAgICAgZ3JvdXBzX25hbWVzID0gWyAuLi5ncm91cHNfbmFtZXMsIGVsLmdyb3VwIF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKCBncm91cHNfbmFtZXMgKTtcclxuICAgICAgICByZXR1cm4gZ3JvdXBzX25hbWVzOyBcclxuICAgIH07XHJcblxyXG4gICAgYWRkX25ld19maWVsZCgpIHtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKCB0aGlzLm5ld19maWVsZCwgIHRoaXMuY29tcG9uZW50X2VkaXRhYmxlICk7XHJcblxyXG4gICAgICAgIGlmICggIXRoaXMubmV3X2ZpZWxkLm5hbWUgKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0X2Vycm9yX21zZyggJyBObyBmaWVsZCBuYW1lIHdhcyBwcm92aWRlZCAnLCAnbmV3X2ZpZWxkJyApOyBcclxuICAgICAgICAgICAgY29uc29sZS5sb2coICdObyBuYW1lIHdhcyBwcm92aWRlZCAnICk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCB0aGlzLmlzX2ZpZWxkX2V4aXN0KHRoaXMubmV3X2ZpZWxkLm5hbWUpICkge1xyXG4gICAgICAgICAgICB0aGlzLnNldF9lcnJvcl9tc2coICdPbmUgZmllbGQgaGFzIHRoaXMgbmFtZSAnLCAnbmV3X2ZpZWxkJyApOyBcclxuICAgICAgICAgICAgY29uc29sZS5sb2coICdPbmUgZmlsZWQgaGFzIHRoaXMgbmFtZScgKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlOyAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5uZXdfZmllbGQuX2lkID0gdGhpcy5jcmVhdGVfZ3VpZCgpOyAgXHJcbiAgICAgICAgLy9kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmV3LWZpZWxkLWlkJykudmFsdWUgPSB0aGlzLm5ld19maWVsZC50eXBlO1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLmJvZHkgPSBbLi4udGhpcy5jb21wb25lbnRfZWRpdGFibGUuYm9keSwgdGhpcy5uZXdfZmllbGRdO1xyXG5cclxuICAgICAgICBpZiAoIHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLmdyb3VwICE9ICdub25lJykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRfbmV3X2ZpZWxkX3RvX2dyb3VwKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm5ld19maWVsZCA9IHsgdHlwZTogdGhpcy5uZXdfZmllbGQudHlwZSB9O1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLm5ld19maWVsZCA9IHsgdHlwZTogdGhpcy5uZXdfZmllbGQudHlwZSB9O1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coICB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZS5ib2R5ICk7XHJcbiAgICAgICAgdGhpcy5zdG9yYWdlU2VydmljZS51cGRhdGUoJy9hcGkvY29tcG9uZW50cycse1xyXG4gICAgICAgICAgICBpZCA6IHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLl9pZCxcclxuICAgICAgICAgICAgbmFtZSA6IHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLm5hbWUsXHJcbiAgICAgICAgICAgIGdyb3VwIDogdGhpcy5jb21wb25lbnRfZWRpdGFibGUuZ3JvdXAsXHJcbiAgICAgICAgICAgIGJvZHkgOiB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZS5ib2R5XHJcbiAgICAgICAgfSkuXHJcbiAgICAgICAgICAgIHN1YnNjcmliZSggcmVzID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCAncHV0IC0gJyAsIHJlcyApO1xyXG4gICAgICAgICAgICAgICAgaWYgKCAhcmVzLmVycm9yICkgdGhpcy5jb21wb25lbnRzID0gcmVzLmNvbXBvbmVudHM7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggJyBiICcsIHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLmJvZHkgKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgYWRkX25ld19maWVsZF90b19ncm91cCgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RvcmFnZVNlcnZpY2UudXBkYXRlKCcvYXBpL2NvbXBvbmVudHMvZ3JvdXAvYWRkJyx7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwIDogdGhpcy5jb21wb25lbnRfZWRpdGFibGUuZ3JvdXAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkIDogdGhpcy5uZXdfZmllbGRcclxuICAgICAgICAgICAgICAgIH0pLlxyXG4gICAgICAgICAgICAgICAgc3Vic2NyaWJlKCByZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggJ2FsbCBwdXQgLSAnICwgcmVzICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICggIXJlcy5lcnJvciApIHRoaXMuY29tcG9uZW50cyA9IHJlcy5jb21wb25lbnRzO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGRlbGV0ZV9maWVsZCggaWQgKXtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKCB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZS5ib2R5ICk7XHJcbiAgICAgICAgdGhpcy5jb21wb25lbnRfZWRpdGFibGUuYm9keS5mb3JFYWNoKCAoZWwsIGlkeCwgYXJyKSA9PiB7IFxyXG4gICAgICAgICAgICBpZihlbC5faWQgPT09IGlkICkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb21wb25lbnRfZWRpdGFibGUuYm9keS5zcGxpY2UoaWR4LCAxKTtcclxuICAgICAgICAgICAgfSBcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKCB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZS5ncm91cCAhPSAnbm9uZScpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGVsZXRlX2ZpZWxkX3RvX2dyb3VwKGlkKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyggdGhpcy5jb21wb25lbnRfZWRpdGFibGUuYm9keSApIDsgICAgICBcclxuICAgICAgICB0aGlzLnN0b3JhZ2VTZXJ2aWNlLnVwZGF0ZSgnL2FwaS9jb21wb25lbnRzJyx7XHJcbiAgICAgICAgICAgIGlkIDogdGhpcy5jb21wb25lbnRfZWRpdGFibGUuX2lkLFxyXG4gICAgICAgICAgICBuYW1lIDogdGhpcy5jb21wb25lbnRfZWRpdGFibGUubmFtZSxcclxuICAgICAgICAgICAgZ3JvdXAgOiB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZS5ncm91cCxcclxuICAgICAgICAgICAgYm9keSA6IHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLmJvZHlcclxuICAgICAgICB9KS5cclxuICAgICAgICAgICAgc3Vic2NyaWJlKCByZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coICdwdXQgLSAnICwgcmVzICk7XHJcbiAgICAgICAgICAgICAgICBpZiAoICFyZXMuZXJyb3IgKSB0aGlzLmNvbXBvbmVudHMgPSByZXMuY29tcG9uZW50cztcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIGRlbGV0ZV9maWVsZF90b19ncm91cChpZCkge1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coIHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLmJvZHkgKSA7ICAgICAgXHJcbiAgICAgICAgdGhpcy5zdG9yYWdlU2VydmljZS51cGRhdGUoJy9hcGkvY29tcG9uZW50cy9ncm91cC9kZWxldGUnLHtcclxuICAgICAgICAgICAgZ3JvdXAgOiB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZS5ncm91cCwgXHJcbiAgICAgICAgICAgIGlkOiBpZFxyXG4gICAgICAgIH0pLlxyXG4gICAgICAgICAgICBzdWJzY3JpYmUoIHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggJ3B1dCAtICcgLCByZXMgKTtcclxuICAgICAgICAgICAgICAgIGlmICggIXJlcy5lcnJvciApIHRoaXMuY29tcG9uZW50cyA9IHJlcy5jb21wb25lbnRzO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcblxyXG5cclxuICAgIHNldF9jb21wb25lbnRfZmllbGRfdmFsdWUoIGZpZWxkLCBuYW1lICl7XHJcbiAgICAgICAgbGV0IGNvbXAgPSB0aGlzLmNvbXBvbmVudHMuZmluZCggY29tcCA9PiBjb21wLm5hbWUgPT09IG5hbWUgJiYgdGhpcy5jb21wb25lbnRfZWRpdGFibGUubmFtZSAhPT0gbmFtZSApO1xyXG4gICAgICAgIGZpZWxkLnZhbHVlID0gY29tcDtcclxuICAgIH07XHJcblxyXG4gICAgc2hvd19qc29uX29mX2VkaXRfY29tcG9uZW50KCl7XHJcbiAgICAgICAgdGhpcy5qc29uX29mX2VkaXRfY29tcG9uZW50X2lzX3Zpc2libGUgPSAhdGhpcy5qc29uX29mX2VkaXRfY29tcG9uZW50X2lzX3Zpc2libGU7XHJcbiAgICB9O1xyXG5cclxuICAgIFxyXG5cclxuICAgIGNyZWF0ZV9jb21wb25lbnQoKXtcclxuICAgICAgICBpZiAoICEgdGhpcy5uZXdfY29tcG9uZW50Lm5hbWUgKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0X2Vycm9yX21zZyggJyBObyBuYW1lIHdhcyBwcm92aWRlZCAnICk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCAnTm8gbmFtZSB3YXMgcHJvdmlkZWQgJyApO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICggdGhpcy5pc19jb21wb25lbnRfZXhpc3QodGhpcy5uZXdfY29tcG9uZW50Lm5hbWUpICkge1xyXG4gICAgICAgICAgICB0aGlzLnNldF9lcnJvcl9tc2coICdPbmUgY29tcG9uZW50IGhhcyB0aGlzIG5hbWUgJyApOyBcclxuICAgICAgICAgICAgY29uc29sZS5sb2coICdPbmUgY29tcG9uZW50IGhhcyB0aGlzIG5hbWUnICk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTsgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCAhIHRoaXMubmV3X2NvbXBvbmVudC5ncm91cCApIHRoaXMubmV3X2NvbXBvbmVudC5ncm91cCA9ICdub25lJyA7XHJcbiAgICAgICAgbGV0IGJvZHkgPSBbXTtcclxuICAgICAgICBpZiAoIHRoaXMubmV3X2NvbXBvbmVudC5ncm91cCAhPT0gJ25vbmUnICl7XHJcbiAgICAgICAgICAgIGxldCByZXMgPSB0aGlzLmNvbXBvbmVudHMuZmluZCggY29tcCA9PiBjb21wLmdyb3VwID09IHRoaXMubmV3X2NvbXBvbmVudC5ncm91cCk7XHJcbiAgICAgICAgICAgIGlmICggcmVzICkgYm9keSA9IHJlcy5ib2R5IDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuc3RvcmFnZVNlcnZpY2UuaW5zZXJ0KCcvYXBpL2NvbXBvbmVudHMnLCB7XHJcbiAgICAgICAgICAgIG5hbWUgOiB0aGlzLm5ld19jb21wb25lbnQubmFtZSxcclxuICAgICAgICAgICAgZ3JvdXAgOiB0aGlzLm5ld19jb21wb25lbnQuZ3JvdXAgfHwgJ25vbmUnLFxyXG4gICAgICAgICAgICBib2R5IDogW11cclxuICAgICAgICAgfSkuXHJcbiAgICAgICAgICAgIHN1YnNjcmliZSggcmVzID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCAncG9zdCAtICcgLCByZXMgKTtcclxuICAgICAgICAgICAgICAgIGlmICggIXJlcy5lcnJvciApIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbXBvbmVudHMgPSByZXMuY29tcG9uZW50cztcclxuICAgICAgICAgICAgICAgICAgICBsZXQgZWRpdF9jb21wID0gdGhpcy5jb21wb25lbnRzLmZpbmQoIGNvbXAgPT4gY29tcC5uYW1lID09IHRoaXMubmV3X2NvbXBvbmVudC5uYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIGVkaXRfY29tcCApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRfY29tcG9uZW50c19jdXJyZW50X3ZpZXcoJ2VkaXQtY29tcG9uZW50Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0X2VkaXRfY29tcG9uZW50KCBlZGl0X2NvbXAgKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGNoYW5nZV9jb21wb25lbnQoY29tcG9uZW50KXtcclxuXHJcbiAgICAgICAgaWYgKCAgdGhpcy5jb21wb25lbnRfZWRpdGFibGUubmV3X25hbWUgIT0gdGhpcy5jb21wb25lbnRfZWRpdGFibGUubmFtZSAmJiBcclxuICAgICAgICAgICAgICB0aGlzLmlzX2NvbXBvbmVudF9leGlzdCh0aGlzLmNvbXBvbmVudF9lZGl0YWJsZS5uZXdfbmFtZSkgKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0X2Vycm9yX21zZyggJ09uZSBjb21wb25lbnQgaGFzIHRoaXMgbmFtZSAnLCAnZWRpdC1jb21wb25lbnQnICk7IFxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyggJ09uZSBjb21wb25lbnQgaGFzIHRoaXMgbmFtZScgKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlOyAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKCB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZS5uZXdfbmFtZSAhPSB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZS5uYW1lICkge1xyXG4gICAgICAgICAgICB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZS5uYW1lID0gdGhpcy5jb21wb25lbnRfZWRpdGFibGUubmV3X25hbWU7IFxyXG4gICAgICAgIH0gICBcclxuICAgICAgICB0aGlzLnN0b3JhZ2VTZXJ2aWNlLnVwZGF0ZSgnL2FwaS9jb21wb25lbnRzJyx7XHJcbiAgICAgICAgICAgIGlkIDogdGhpcy5jb21wb25lbnRfZWRpdGFibGUuX2lkLFxyXG4gICAgICAgICAgICBuYW1lIDogdGhpcy5jb21wb25lbnRfZWRpdGFibGUubmFtZSxcclxuICAgICAgICAgICAgZ3JvdXAgOiB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZS5ncm91cCxcclxuICAgICAgICAgICAgYm9keSA6IHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLmJvZHlcclxuICAgICAgICB9KS5cclxuICAgICAgICAgICAgc3Vic2NyaWJlKCByZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coICdwdXQgLSAnICwgcmVzICk7XHJcbiAgICAgICAgICAgICAgICBpZiAoICFyZXMuZXJyb3IgKSB0aGlzLmNvbXBvbmVudHMgPSByZXMuY29tcG9uZW50cztcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgY29weV9jb21wb25lbnQoKSB7XHJcbiAgICAgICAgaWYgKCAhdGhpcy5jb21wb25lbnRfZWRpdGFibGUubmV3X25hbWUgfHxcclxuICAgICAgICAgICAgICB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZS5uYW1lID09IHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLm5ld19uYW1lICkge1xyXG4gICAgICAgICAgICB0aGlzLnNldF9lcnJvcl9tc2coICdObyBuZXcgbmFtZSB3YXMgcHJvdmlkZWQgJywgJ2VkaXQtY29tcG9uZW50JyApOyBcclxuICAgICAgICAgICAgY29uc29sZS5sb2coICdObyBuZXcgbmFtZSB3YXMgcHJvdmlkZWQgJyApO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7ICAgIFxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiggdGhpcy5pc19jb21wb25lbnRfZXhpc3QodGhpcy5jb21wb25lbnRfZWRpdGFibGUubmV3X25hbWUpXHJcbiAgICAgICAgICAgICl7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0X2Vycm9yX21zZyggJ09uZSBjb21wb25lbnQgaGFzIHRoaXMgbmFtZSAnLCAnZWRpdC1jb21wb25lbnQnICk7IFxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyggJ09uZSBjb21wb25lbnQgaGFzIHRoaXMgbmFtZScgKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnN0b3JhZ2VTZXJ2aWNlLmluc2VydCgnL2FwaS9jb21wb25lbnRzJywge1xyXG4gICAgICAgICAgICBpZCA6IHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLl9pZCxcclxuICAgICAgICAgICAgbmFtZSA6IHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLm5ld19uYW1lLFxyXG4gICAgICAgICAgICBncm91cCA6IHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLmdyb3VwLFxyXG4gICAgICAgICAgICBib2R5IDogdGhpcy5jb21wb25lbnRfZWRpdGFibGUuYm9keVxyXG4gICAgICAgICB9KS5cclxuICAgICAgICAgICAgc3Vic2NyaWJlKCByZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coICdwb3N0IC0gJyAsIHJlcyApO1xyXG4gICAgICAgICAgICAgICAgaWYgKCAhcmVzLmVycm9yICkgdGhpcy5jb21wb25lbnRzID0gcmVzLmNvbXBvbmVudHM7XHJcbiAgICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBcclxuICAgIGRlbGV0ZV9jb21wb25lbnQoKSB7XHJcbiAgICAgICAgdGhpcy5zdG9yYWdlU2VydmljZS5kZWxldGUoJy9hcGkvY29tcG9uZW50cycsIHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLl9pZCkuXHJcbiAgICAgICAgICAgIHN1YnNjcmliZSggcmVzID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCAnZGVsZXRlIC0gJyAsIHJlcyApO1xyXG4gICAgICAgICAgICAgICAgaWYgKCAhcmVzLmVycm9yICkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29tcG9uZW50cyA9IHJlcy5jb21wb25lbnRzO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0X2NvbXBvbmVudHNfY3VycmVudF92aWV3KCAnYWxsJyApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4vKlxyXG5cclxuICAgIGluaXRfbmV3X2NvbXBvbmVudChtdXRhYmlsaXR5ID0gJycpe1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIG11dGFiaWxpdHkgOiBtdXRhYmlsaXR5XHJcbiAgICAgICAgfTtcclxuICAgIH07XHJcblxyXG4gICAgc2V0X25ld19jb21wb25lbnRfbXV0YWJpbGl0eShtdXRhYmlsaXR5KXtcclxuICAgICAgICB0aGlzLm5ld19jb21wb25lbnQgPSAgdGhpcy5pbml0X25ld19jb21wb25lbnQoIG11dGFiaWxpdHkgKTtcclxuICAgIH07XHJcblxyXG5cclxuICAgIGdldF9hbGxfY29tcG9uZW50cygpIHtcclxuICAgICAgICB0aGlzLnN0b3JhZ2VTZXJ2aWNlLnNlbGVjdCgnL2FwaS9jb21wb25lbnRzJyApLlxyXG4gICAgICAgICAgICBzdWJzY3JpYmUoIHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggJ2dldCAtICcgLCByZXMgKTtcclxuICAgICAgICAgICAgICAgIGlmKCAhcmVzLmVycm9yICkgdGhpcy5jb21wb25lbnRzID0gcmVzLmNvbXBvbmVudHM7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBjcmVhdGVfY29tcG9uZW50KCl7XHJcbiAgICAgICAgY29uc29sZS5sb2coIHRoaXMuY29tcG9uZW50cyApO1xyXG4gICAgICAgIGlmICggIXRoaXMubmV3X2NvbXBvbmVudC5uYW1lICkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyggJyBubyBuYW1lIHdhcyBwcm92aWRlZCAnKTtcclxuICAgICAgICAgICAgcmV0dXJuIDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCB0aGlzLmV4aXN0X2NvbXBvbmVudF93aGl0aF90aGlzX25hbWUoKSApIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coICcgY29tcG9uZW50IHdpdGggc3VjaCBuYW1lIGV4aXN0cyAnICk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zdG9yYWdlU2VydmljZS5pbnNlcnQoJy9hcGkvY29tcG9uZW50cycsIHtcclxuICAgICAgICAgICAgbmFtZSA6IHRoaXMubmV3X2NvbXBvbmVudC5uYW1lLFxyXG4gICAgICAgICAgICBncm91cCA6IHRoaXMubmV3X2NvbXBvbmVudC5ncm91cCB8fCAnJyxcclxuICAgICAgICAgICAgbXV0YWJpbGl0eSA6IHRoaXMubmV3X2NvbXBvbmVudC5tdXRhYmlsaXR5LFxyXG4gICAgICAgICAgICBib2R5IDogW11cclxuICAgICAgICAgfSkuXHJcbiAgICAgICAgICAgIHN1YnNjcmliZSggcmVzID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCAncG9zdCAtICcgLCByZXMgKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCByZXMubXNnICk7XHJcbiAgICAgICAgICAgICAgICBpZiAoICFyZXMuZXJyb3IgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb21wb25lbnRzID0gcmVzLmNvbXBvbmVudHM7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXdfY29tcG9uZW50ID0gdGhpcy5pbml0X25ld19jb21wb25lbnQodGhpcy5uZXdfY29tcG9uZW50Lm11dGFiaWxpdHkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgY2hhbmdlX2NvbXBvbmVudChjb21wb25lbnQpe1xyXG4gICAgICAgIGlmICggIWNvbXBvbmVudC5uZXdfbmFtZSApIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ25vIG5hbWUgd2FzIHByb3ZpZGVkICcpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKCB0aGlzLmV4aXN0X2NvbXBvbmVudF93aGl0aF90aGlzX25hbWUoY29tcG9uZW50Lm5ld19uYW1lKSApe1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyggJyBjb21wb25lbnQgd2l0aCBzdWNoIG5hbWUgZXhpc3RzICcgKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnN0b3JhZ2VTZXJ2aWNlLnVwZGF0ZSgnL2FwaS9jb21wb25lbnRzJyx7XHJcbiAgICAgICAgICAgIGlkIDogY29tcG9uZW50Ll9pZCxcclxuICAgICAgICAgICAgbmFtZSA6IGNvbXBvbmVudC5uZXdfbmFtZSxcclxuICAgICAgICAgICAgZ3JvdXAgOiBjb21wb25lbnQuZ3JvdXAsXHJcbiAgICAgICAgICAgIG11dGFiaWxpdHkgOiB0aGlzLm5ld19jb21wb25lbnQubXV0YWJpbGl0eSxcclxuICAgICAgICAgICAgYm9keSA6IGNvbXBvbmVudC5ib2R5XHJcbiAgICAgICAgfSkuXHJcbiAgICAgICAgICAgIHN1YnNjcmliZSggcmVzID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCAncHV0IC0gJyAsIHJlcyApO1xyXG4gICAgICAgICAgICAgICAgaWYgKCAhcmVzLmVycm9yICkgdGhpcy5jb21wb25lbnRzID0gcmVzLmNvbXBvbmVudHM7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGNvcHlfY29tcG9uZW50KGNvbXBvbmVudCkge1xyXG4gICAgICAgIGlmICggIWNvbXBvbmVudC5uZXdfbmFtZSApIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coICdubyBuYW1lIHdhcyBwcm92aWRlZCAnICk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoIHRoaXMuZXhpc3RfY29tcG9uZW50X3doaXRoX3RoaXNfbmFtZShjb21wb25lbnQubmV3X25hbWUpICl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCAnIGNvbXBvbmVudCB3aXRoIHN1Y2ggbmFtZSBleGlzdHMgJyApO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc3RvcmFnZVNlcnZpY2UuaW5zZXJ0KCcvYXBpL2NvbXBvbmVudHMnLCB7XHJcbiAgICAgICAgICAgIG5hbWUgOiBjb21wb25lbnQubmV3X25hbWUsXHJcbiAgICAgICAgICAgIGdyb3VwIDogY29tcG9uZW50Lmdyb3VwLFxyXG4gICAgICAgICAgICBtdXRhYmlsaXR5IDogY29tcG9uZW50Lm11dGFiaWxpdHksXHJcbiAgICAgICAgICAgIGJvZHkgOiBjb21wb25lbnQuYm9keVxyXG4gICAgICAgICB9KS5cclxuICAgICAgICAgICAgc3Vic2NyaWJlKCByZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coICdwb3N0IC0gJyAsIHJlcyApO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coIHJlcy5tc2cgKTtcclxuICAgICAgICAgICAgICAgIGlmICggIXJlcy5lcnJvciApIHRoaXMuY29tcG9uZW50cyA9IHJlcy5jb21wb25lbnRzO1xyXG4gICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgZGVsZXRlX2NvbXBvbmVudChpZCkge1xyXG4gICAgICAgIGlmICggIWlkICkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnbm8gaWQgd2FzIHByb3ZpZGVkICcpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc3RvcmFnZVNlcnZpY2UuZGVsZXRlKCcvYXBpL2NvbXBvbmVudHMnLCBpZCkuXHJcbiAgICAgICAgICAgIHN1YnNjcmliZSggcmVzID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCAnZGVsZXRlIC0gJyAsIHJlcyApO1xyXG4gICAgICAgICAgICAgICAgaWYgKCAhcmVzLmVycm9yICkgdGhpcy5jb21wb25lbnRzID0gcmVzLmNvbXBvbmVudHM7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBleGlzdF9jb21wb25lbnRfd2hpdGhfdGhpc19uYW1lKG5hbWUgPSB0aGlzLm5ld19jb21wb25lbnQubmFtZSl7XHJcbiAgICAgICAgaWYoXHJcbiAgICAgICAgICAgIHRoaXMuY29tcG9uZW50cy5maW5kKGVsID0+IHsgcmV0dXJuIGVsLm5hbWUgPT09IG5hbWUgPyB0cnVlIDogZmFsc2UgfSlcclxuICAgICAgICAgICAgKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9O1xyXG5cclxuICAgIGVkaXRfZmllbGRzX2NvbXBvbmVudChjb21wb25lbnQpe1xyXG4gICAgICAgIHRoaXMubmV3X2ZpZWxkID0geyB0eXBlOiBcInN0cmluZ1wiIH07IFxyXG4gICAgICAgIGNvbnNvbGUubG9nKCB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZSwgY29tcG9uZW50ICk7XHJcbiAgICAgICAgaWYgKCB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZS5faWQgIT0gY29tcG9uZW50Ll9pZCkgIHsgXHJcbiAgICAgICAgICAgIHRoaXMuY29tcG9uZW50X2VkaXRhYmxlID0gY29tcG9uZW50O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29tcG9uZW50X2VkaXRhYmxlID0gW107XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgc2hvd19maWVsZHNfY29tcG9uZW50KGNvbXBvbmVudCl7XHJcbiAgICAgICAgaWYgKCAgdGhpcy5jb21wb25lbnRfZWRpdGFibGUgJiZcclxuICAgICAgICAgICAgICB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZS5faWQgPT09IGNvbXBvbmVudC5faWQgXHJcbiAgICAgICAgKSByZXR1cm4gdHJ1ZTtcclxuICAgIH07IFxyXG5cclxuICAgIGFkZF9maWVsZCggY29tcG9uZW50LCBuZXdfZmllbGQgPSB7fSApe1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coIGNvbXBvbmVudCwgbmV3X2ZpZWxkICk7XHJcbiAgICAgICAgaWYgKCAhbmV3X2ZpZWxkLm5hbWUgKSByZXR1cm47XHJcbiAgICAgICAgaWYgKCB0aGlzLmV4aXN0X2ZpZWxkX3dpdGhfdGhpc19uYW1lKGNvbXBvbmVudCwgbmV3X2ZpZWxkLm5hbWUpICkgcmV0dXJuIDtcclxuICAgICAgICB0aGlzLm5ld19maWVsZCA9IHsgdHlwZTogXCJzdHJpbmdcIiB9OyBcclxuICAgICAgICBuZXdfZmllbGQuX2lkID0gdGhpcy5jcmVhdGVfZ3VpZCgpOyAgICAgICAgXHJcbiAgICAgICAgY29tcG9uZW50LmJvZHkgPSBbIC4uLiBjb21wb25lbnQuYm9keSAsIG5ld19maWVsZCBdO1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coIGNvbXBvbmVudC5ib2R5ICk7XHJcbiAgICAgICAgdGhpcy5zdG9yYWdlU2VydmljZS51cGRhdGUoJy9hcGkvY29tcG9uZW50cycse1xyXG4gICAgICAgICAgICBpZCA6IGNvbXBvbmVudC5faWQsXHJcbiAgICAgICAgICAgIG5hbWUgOiBjb21wb25lbnQubmFtZSxcclxuICAgICAgICAgICAgZ3JvdXAgOiBjb21wb25lbnQuZ3JvdXAsXHJcbiAgICAgICAgICAgIG11dGFiaWxpdHkgOiBjb21wb25lbnQubXV0YWJpbGl0eSxcclxuICAgICAgICAgICAgYm9keSA6IGNvbXBvbmVudC5ib2R5XHJcbiAgICAgICAgfSkuXHJcbiAgICAgICAgICAgIHN1YnNjcmliZSggcmVzID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCAncHV0IC0gJyAsIHJlcyApO1xyXG4gICAgICAgICAgICAgICAgaWYgKCAhcmVzLmVycm9yICkgdGhpcy5jb21wb25lbnRzID0gcmVzLmNvbXBvbmVudHM7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBpZl9udW1iZXJfZmllbGQodmFsKXtcclxuICAgICAgICB2YWwgPSBOdW1iZXIodmFsKTtcclxuICAgICAgICByZXR1cm4gdmFsID8gdmFsIDogMCA7XHJcbiAgICB9O1xyXG5cclxuICAgIGlmX2NvbXBvbmVudF9maWVsZChjb21wb25lbnQsIHZhbCl7XHJcbiAgICAgICAgbGV0IHJlcyA9IFtdO1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coY29tcG9uZW50LCB2YWwpO1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50cy5maW5kKGVsID0+IHsgXHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coIGVsLm5hbWUgKTtcclxuICAgICAgICAgICAgaWYgKCBlbC5uYW1lID09PSB2YWwgJiZcclxuICAgICAgICAgICAgICAgY29tcG9uZW50Lm5hbWUgIT09IHZhbCApIHtcclxuICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coICdyZXMgJywgZWwgKTtcclxuICAgICAgICAgICAgICAgICAgIHJlcyA9ICBlbDtcclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCAnIC8vLy8vLy8vLy8vLy8vLy8gJyk7ICAgICAgICAgICAgICAgIFxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgcmV0dXJuIHJlcztcclxuICAgIH07XHJcblxyXG4gICAgY2hhbmdlX2ZpZWxkKCBzZXR0aW5ncyA9IHt9ICl7XHJcbiAgICAgICAgbGV0IGNvbXBvbmVudCA9IHNldHRpbmdzLmNvbXBvbmVudDtcclxuICAgICAgICBsZXQgZmllbGQgPSBzZXR0aW5ncy5maWVsZDtcclxuXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhjb21wb25lbnQsIGZpZWxkKTtcclxuICAgICAgICBpZiAoIHRoaXMuZXhpc3RfZmllbGRfd2l0aF90aGlzX25hbWUoY29tcG9uZW50LCBmaWVsZC5lZGl0X25hbWUsIGZpZWxkLl9pZCApICkgcmV0dXJuO1xyXG4gICAgICAgIGlmICggc2V0dGluZ3MudHlwZSA9PSAnbnVtYmVyJyApIHtcclxuICAgICAgICAgICAgZmllbGQuZWRpdF92YWx1ZSA9IHRoaXMuaWZfbnVtYmVyX2ZpZWxkKGZpZWxkLmVkaXRfdmFsdWVfbmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICggc2V0dGluZ3MudHlwZSA9PSAnY29tcG9uZW50JyApIHtcclxuICAgICAgICAgICAgZmllbGQuY29tcG9uZW50X3ZhbHVlID0gdGhpcy5pZl9jb21wb25lbnRfZmllbGQoY29tcG9uZW50LCBmaWVsZC5lZGl0X3ZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZmllbGQubmFtZSA9IGZpZWxkLmVkaXRfbmFtZSB8fCBmaWVsZC5uYW1lO1xyXG4gICAgICAgIGZpZWxkLnZhbHVlID0gZmllbGQuZWRpdF92YWx1ZTtcclxuICAgICAgICBkZWxldGUgZmllbGQuZWRpdF9uYW1lO1xyXG4gICAgICAgIGRlbGV0ZSBmaWVsZC5lZGl0X3ZhbHVlO1xyXG4gICAgICAgIGRlbGV0ZSBmaWVsZC5hc3NpZ25tZW50O1xyXG5cclxuICAgICAgICB0aGlzLnN0b3JhZ2VTZXJ2aWNlLnVwZGF0ZSgnL2FwaS9jb21wb25lbnRzJyx7XHJcbiAgICAgICAgICAgIGlkIDogY29tcG9uZW50Ll9pZCxcclxuICAgICAgICAgICAgbmFtZSA6IGNvbXBvbmVudC5uYW1lLFxyXG4gICAgICAgICAgICBncm91cCA6IGNvbXBvbmVudC5ncm91cCxcclxuICAgICAgICAgICAgbXV0YWJpbGl0eSA6IGNvbXBvbmVudC5tdXRhYmlsaXR5LFxyXG4gICAgICAgICAgICBib2R5IDogY29tcG9uZW50LmJvZHlcclxuICAgICAgICB9KS5cclxuICAgICAgICAgICAgc3Vic2NyaWJlKCByZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coICdwdXQgLSAnICwgcmVzICk7XHJcbiAgICAgICAgICAgICAgICBpZiAoICFyZXMuZXJyb3IgKSB0aGlzLmNvbXBvbmVudHMgPSByZXMuY29tcG9uZW50cztcclxuICAgICAgICB9KTtcclxuICAgICAgICBcclxuICAgIH07XHJcblxyXG4gICAgY29weV9maWVsZCggc2V0dGluZ3MgPSB7fSApe1xyXG4gICAgICAgIGxldCBjb21wb25lbnQgPSBzZXR0aW5ncy5jb21wb25lbnQ7XHJcbiAgICAgICAgbGV0IGZpZWxkID0gc2V0dGluZ3MuZmllbGQ7XHJcbiAgICAgICAgY29uc29sZS5sb2coY29tcG9uZW50LCBmaWVsZCk7XHJcbiAgICAgICAgaWYgKCAhZmllbGQuZWRpdF9uYW1lICkgcmV0dXJuO1xyXG4gICAgICAgIGlmICggdGhpcy5leGlzdF9maWVsZF93aXRoX3RoaXNfbmFtZShjb21wb25lbnQsIGZpZWxkLmVkaXRfbmFtZSwgZmllbGQuX2lkICkgKSByZXR1cm47XHJcbiAgICAgICAgbGV0IG5ld19maWVsZCA9IHRoaXMuZGVlcENvcHkoZmllbGQpO1xyXG4gICAgICAgIG5ld19maWVsZC5faWQgPSB0aGlzLmNyZWF0ZV9ndWlkKCk7XHJcbiAgICAgICAgbmV3X2ZpZWxkLm5hbWUgPSBuZXdfZmllbGQuZWRpdF9uYW1lO1xyXG4gICAgICAgIG5ld19maWVsZC52YWx1ZSA9ICcnO1xyXG4gICAgICAgIGlmICggc2V0dGluZ3MudHlwZSA9PSAnbnVtYmVyJyApIHtcclxuICAgICAgICAgICAgbmV3X2ZpZWxkLnZhbHVlPSB0aGlzLmlmX251bWJlcl9maWVsZChuZXdfZmllbGQudmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIHNldHRpbmdzLnR5cGUgPT0gJ2NvbXBvbmVudCcgKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaWZfY29tcG9uZW50X2ZpZWxkKGNvbXBvbmVudCwgbmV3X2ZpZWxkLnZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZGVsZXRlIG5ld19maWVsZC5lZGl0X25hbWU7XHJcbiAgICAgICAgZGVsZXRlIG5ld19maWVsZC5lZGl0X3ZhbHVlO1xyXG4gICAgICAgIGRlbGV0ZSBuZXdfZmllbGQuYXNzaWdubWVudDtcclxuICAgICAgICBjb21wb25lbnQuYm9keSA9IFsgLi4uIGNvbXBvbmVudC5ib2R5ICwgbmV3X2ZpZWxkIF07XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyggbmV3X2ZpZWxkICk7XHJcbiAgICAgICAgdGhpcy5zdG9yYWdlU2VydmljZS51cGRhdGUoJy9hcGkvY29tcG9uZW50cycse1xyXG4gICAgICAgICAgICBpZCA6IGNvbXBvbmVudC5faWQsXHJcbiAgICAgICAgICAgIG5hbWUgOiBjb21wb25lbnQubmFtZSxcclxuICAgICAgICAgICAgZ3JvdXAgOiBjb21wb25lbnQuZ3JvdXAsXHJcbiAgICAgICAgICAgIG11dGFiaWxpdHkgOiBjb21wb25lbnQubXV0YWJpbGl0eSxcclxuICAgICAgICAgICAgYm9keSA6IGNvbXBvbmVudC5ib2R5XHJcbiAgICAgICAgfSkuXHJcbiAgICAgICAgICAgIHN1YnNjcmliZSggcmVzID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCAncHV0IC0gJyAsIHJlcyApO1xyXG4gICAgICAgICAgICAgICAgaWYgKCAhcmVzLmVycm9yICkgdGhpcy5jb21wb25lbnRzID0gcmVzLmNvbXBvbmVudHM7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGRlbGV0ZV9maWVsZCggc2V0dGluZ3MgPSB7fSApe1xyXG4gICAgICAgIGxldCBjb21wb25lbnQgPSBzZXR0aW5ncy5jb21wb25lbnQ7XHJcbiAgICAgICAgbGV0IGZpZWxkID0gc2V0dGluZ3MuZmllbGQ7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhjb21wb25lbnQsIGZpZWxkKTtcclxuICAgICAgICBpZiAoICFjb21wb25lbnQgfHwgIWZpZWxkICkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyggJ25vIGNvbXBvbmVudCBvciBmaWVsZCcpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbXBvbmVudC5ib2R5LmZvckVhY2goIChlbCwgaWR4LCBhcnIpID0+IHsgXHJcbiAgICAgICAgICAgIGlmKGVsLl9pZCA9PT0gZmllbGQuX2lkICkge1xyXG4gICAgICAgICAgICAgICAgYXJyLnNwbGljZShpZHgsIDEpO1xyXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyggYXJyLCBpZHggKTtcclxuICAgICAgICAgICAgfSBcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnN0b3JhZ2VTZXJ2aWNlLnVwZGF0ZSgnL2FwaS9jb21wb25lbnRzJyx7XHJcbiAgICAgICAgICAgIGlkIDogY29tcG9uZW50Ll9pZCxcclxuICAgICAgICAgICAgbmFtZSA6IGNvbXBvbmVudC5uYW1lLFxyXG4gICAgICAgICAgICBncm91cCA6IGNvbXBvbmVudC5ncm91cCxcclxuICAgICAgICAgICAgbXV0YWJpbGl0eSA6IGNvbXBvbmVudC5tdXRhYmlsaXR5LFxyXG4gICAgICAgICAgICBib2R5IDogY29tcG9uZW50LmJvZHlcclxuICAgICAgICB9KS5cclxuICAgICAgICAgICAgc3Vic2NyaWJlKCByZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coICdwdXQgLSAnICwgcmVzICk7XHJcbiAgICAgICAgICAgICAgICBpZiAoICFyZXMuZXJyb3IgKSB0aGlzLmNvbXBvbmVudHMgPSByZXMuY29tcG9uZW50cztcclxuICAgICAgICB9KTtcclxuICAgICAgICBcclxuICAgIH07XHJcblxyXG4gICAgdmFsdWVfYXNzaWdubWVudChmaWVsZCl7XHJcbiAgICAgICAgaWYgKCAgIWZpZWxkLmFzc2lnbm1lbnQgKXtcclxuICAgICAgICAgICAgaWYgKCBmaWVsZC50eXBlID09ICdjb21wb25lbnQnICkge1xyXG4gICAgICAgICAgICAgICAgZmllbGQuY29tcG9uZW50X3ZhbHVlID0gZmllbGQuY29tcG9uZW50X3ZhbHVlIHx8IFtdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZpZWxkLmVkaXRfdmFsdWUgPSBmaWVsZC52YWx1ZTtcclxuICAgICAgICAgICAgZmllbGQuYXNzaWdubWVudCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfTtcclxuXHJcbiAgICBleGlzdF9maWVsZF93aXRoX3RoaXNfbmFtZShjb21wb25lbnQsIGZpZWxkX25hbWUsIGZpZWxkX2lkICl7XHJcbiAgICAgICAgaWYgKCAhY29tcG9uZW50IHx8XHJcbiAgICAgICAgICAgICAhY29tcG9uZW50LmJvZHkgXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCcgZmllbGRzIHdhcyBub3QgcHJvdmlkZWQgJyk7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihcclxuICAgICAgICAgICAgY29tcG9uZW50LmJvZHkuZmluZChlbCA9PiB7IHJldHVybiAoZWwubmFtZSA9PT0gZmllbGRfbmFtZSAmJlxyXG4gICAgICAgICAgICAgICBlbC5faWQgIT09IGZpZWxkX2lkICkgPyB0cnVlIDogZmFsc2UgfSlcclxuICAgICAgICApIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coICAnIGZpZWxkIHdpdGggc3VjaCBuYW1lIGV4aXN0cyAnICk7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9O1xyXG4gICAgXHJcbiovXHJcblxyXG4gICAgXHJcblxyXG4gICAgLy8gcmV0dXJuIHVuaXF1ZSBpZFxyXG4gICAgY3JlYXRlX2d1aWQoKSB7XHJcbiAgICAgICAgZnVuY3Rpb24gczQoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBNYXRoLmZsb29yKCgxICsgTWF0aC5yYW5kb20oKSkgKiAweDEwMDAwKVxyXG4gICAgICAgICAgICAgICAgLnRvU3RyaW5nKDE2KVxyXG4gICAgICAgICAgICAgICAgLnN1YnN0cmluZygxKTtcclxuICAgICAgICB9XHJcbiBcdCAgICByZXR1cm4gczQoKSArIHM0KCkgKyAnLScgKyBzNCgpICsgJy0nICsgczQoKSArICctJyArXHJcbiAgICAgICAgICAgICAgIHM0KCkgKyAnLScgKyBzNCgpICsgczQoKSArIHM0KCk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8vICBSZXR1cm5zIGEgZGVlcCBjb3B5IG9mIHRoZSBvYmplY3RcclxuICAgIGRlZXBDb3B5KG9sZE9iajogYW55KSB7XHJcbiAgICAgICAgbGV0IG5ld09iaiA9IG9sZE9iajtcclxuICAgICAgICBpZiAob2xkT2JqICYmIHR5cGVvZiBvbGRPYmogPT09IFwib2JqZWN0XCIpIHtcclxuICAgICAgICAgICAgbmV3T2JqID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9sZE9iaikgPT09IFwiW29iamVjdCBBcnJheV1cIiA/IFtdIDoge307XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgaW4gb2xkT2JqKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdPYmpbaV0gPSB0aGlzLmRlZXBDb3B5KG9sZE9ialtpXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5ld09iajtcclxuICAgIH07XHJcblxyXG5cclxuXHJcblxyXG59XHJcblxyXG5cclxuLypcclxuXHJcblxyXG5sZXQgY3Z0X3JfbiA9ICgoKSA9PiB7XHJcblxyXG4gIHZhciBudXQgPSBbMTAwMCwgOTAwLCA1MDAsIDQwMCwgMTAwLCA5MCwgNTAsIDQwLCAxMCwgOSwgNSwgNCwgMV07XHJcbiAgdmFyIHJvbSA9IFsnTScsICdDTScsICdEJywgJ0NEJywgJ0MnLCAnWEMnLCAnTCcsICdYTCcsICdYJywgJ0lYJywgJ1YnLCAnSVYnLCAnSSddO1xyXG4gIHZhciBhbGwgPSB7SToxLFY6NSxYOjEwLEw6NTAsQzoxMDAsRDo1MDAsTToxMDAwfTtcclxuXHJcbiAgdmFyIGN2dF9yX25fdG9fcm9tYW4gPSAoYXJhYmljKSA9PiB7XHJcbiAgICBsZXQgcmVzID0gJyc7ICBcclxuICAgIG51dC5mb3JFYWNoKCAoZWwsIGlkeCwgYXJyICkgPT57XHJcbiAgICAgICAgd2hpbGUgKCBhcmFiaWMgPj0gbnV0W2lkeF0gKSB7XHJcbiAgICAgICAgICAgIHJlcyArPSByb21baWR4XTtcclxuICAgICAgICAgICAgYXJhYmljIC09IG51dFtpZHhdO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIHJlcztcclxuICB9O1xyXG5cclxuICB2YXIgY3Z0X3Jfbl9mb3JtX3JvbWFuID0gKHJvbWFuKSA9PiB7XHJcbiAgICAgIGxldCByZXMgPSAwO1xyXG4gICAgICBsZXQgbCA9IHJvbWFuLmxlbmd0aDtcclxuICAgICAgd2hpbGUgKGwtLSkge1xyXG4gICAgICAgIGlmICggYWxsW3JvbWFuW2xdXSA8IGFsbFtyb21hbltsKzFdXSApIHsgXHJcbiAgICAgICAgICAgIHJlcyAtPSBhbGxbcm9tYW5bbF1dOyAgIFxyXG4gICAgICAgIH0gZWxzZSB7IFxyXG4gICAgICAgICAgICByZXMgKz0gYWxsW3JvbWFuW2xdXSBcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgIHJldHVybiByZXM7XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIChudW0pID0+IHtcclxuICAgIGlmICggdHlwZW9mIG51bSA9PT0gJ251bWJlcicpIHJldHVybiBjdnRfcl9uX3RvX3JvbWFuKCBudW0gKTtcclxuICAgIGlmICggdHlwZW9mIG51bSA9PT0gJ3N0cmluZycpIHJldHVybiBjdnRfcl9uX2Zvcm1fcm9tYW4oIG51bS50b1VwcGVyQ2FzZSgpICk7XHJcbiAgfTtcclxuXHJcbn0pKCk7XHJcblxyXG5cclxuY29uc29sZS5sb2coIGN2dF9yX24oMzAwMykgKTtcclxuY29uc29sZS5sb2coIGN2dF9yX24oNDQzKSApO1xyXG5jb25zb2xlLmxvZyggY3Z0X3Jfbig2OSkgKTtcclxuY29uc29sZS5sb2coIGN2dF9yX24oMikgKTtcclxuY29uc29sZS5sb2coIGN2dF9yX24oOTkpICk7XHJcbmNvbnNvbGUubG9nKCBjdnRfcl9uKDM0KSApO1xyXG5jb25zb2xlLmxvZyggY3Z0X3Jfbig0NTYpICk7XHJcblxyXG5jb25zb2xlLmxvZygnLS0tLS0tLS0tLS0tLS0tLS0tLScpO1xyXG5cclxuY29uc29sZS5sb2coIGN2dF9yX24oJ01NTUlJSScpICk7XHJcbmNvbnNvbGUubG9nKCBjdnRfcl9uKCdDRFhMSUlJJykgKTtcclxuY29uc29sZS5sb2coIGN2dF9yX24oJ0xYSVgnKSApO1xyXG5jb25zb2xlLmxvZyggY3Z0X3JfbignSUknKSApO1xyXG5jb25zb2xlLmxvZyggY3Z0X3JfbignWENJWCcpICk7XHJcbmNvbnNvbGUubG9nKCBjdnRfcl9uKCdYWFhJVicpICk7XHJcbmNvbnNvbGUubG9nKCBjdnRfcl9uKCdDRExWSScpICk7XHJcblxyXG4qLyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==

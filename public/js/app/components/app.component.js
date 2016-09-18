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
    //public create_component_group = '';
    function AppComponent(storageService) {
        this.storageService = storageService;
        //public new_component = this.init_new_component();
        this.components = [];
        //public component_editable = [];
        this.new_field = { type: "string" };
        //public new_group = [];
        this.components_current_view = 'all';
        this.new_component = [];
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
    AppComponent.prototype.set_error_msg = function (error_msg) {
        var _this = this;
        this.error_msg = error_msg;
        setTimeout(function () { return _this.error_msg = ''; }, 3000);
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
            this.set_error_msg('No field name was provided ');
            console.log('No name was provided ');
            return false;
        }
        if (this.is_field_exist(this.new_field.name)) {
            this.set_error_msg('One field has this name ');
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
            this.set_error_msg('One component has this name ');
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
            this.set_error_msg('No new name was provided ');
            console.log('No new name was provided ');
            return false;
        }
        if (this.is_component_exist(this.component_editable.new_name)) {
            this.set_error_msg('One component has this name ');
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvYXBwLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEscUJBQTBCLGVBQWUsQ0FBQyxDQUFBO0FBRTFDLGdDQUE2Qiw2QkFBNkIsQ0FBQyxDQUFBO0FBRTNELG1DQUFnQyw2QkFBNkIsQ0FBQyxDQUFBO0FBQzlELGlDQUE4QiwyQkFBMkIsQ0FBQyxDQUFBO0FBVTFEO0lBUUkscUNBQXFDO0lBRXJDLHNCQUFtQixjQUE4QjtRQUE5QixtQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7UUFUakQsbURBQW1EO1FBQzVDLGVBQVUsR0FBRyxFQUFFLENBQUM7UUFDdkIsaUNBQWlDO1FBQzFCLGNBQVMsR0FBRyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsQ0FBQztRQUN0Qyx3QkFBd0I7UUFDakIsNEJBQXVCLEdBQUcsS0FBSyxDQUFDO1FBQ2hDLGtCQUFhLEdBQUcsRUFBRSxDQUFDO0lBRzBCLENBQUM7SUFFckQsK0JBQVEsR0FBUjtRQUNJLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDeEIsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7SUFDOUIsQ0FBQzs7SUFFRCx5Q0FBa0IsR0FBbEI7UUFBQSxpQkFNQztRQUxHLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFFO1lBQzFDLFNBQVMsQ0FBRSxVQUFBLEdBQUc7WUFDVixPQUFPLENBQUMsR0FBRyxDQUFFLFFBQVEsRUFBRyxHQUFHLENBQUUsQ0FBQztZQUM5QixFQUFFLENBQUEsQ0FBRSxDQUFDLEdBQUcsQ0FBQyxLQUFNLENBQUM7Z0JBQUMsS0FBSSxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDO1FBQ3RELENBQUMsQ0FBQyxDQUFDO0lBQ1gsQ0FBQzs7SUFFRCx1Q0FBZ0IsR0FBaEIsVUFBa0IsSUFBSTtRQUNsQixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztJQUM3QixDQUFD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QixTQUFTLEVBQUUsQ0FBQyxnQ0FBYyxDQUFDO1lBQzNCLEtBQUssRUFBRSxDQUFDLHNDQUFpQixFQUFFLGtDQUFlLENBQUM7U0FDOUMsQ0FBQzs7b0JBQUE7SUFrbkJGLG1CQUFDO0FBQUQsQ0FqbkJBLEFBaW5CQyxJQUFBO0FBam5CWSxvQkFBWSxlQWluQnhCLENBQUE7QUFHRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBNERFIiwiZmlsZSI6ImNvbXBvbmVudHMvYXBwLmNvbXBvbmVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuaW1wb3J0IHtTdG9yYWdlU2VydmljZX0gZnJvbSBcIi4uL3NlcnZpY2VzL3N0b3JhZ2Uuc2VydmljZVwiO1xyXG5cclxuaW1wb3J0IHtPYmplY3RUb0FycmF5UGlwZX0gZnJvbSBcIi4uL3BpcGVzL29iamVjdFRvQXJyYXkucGlwZVwiO1xyXG5pbXBvcnQge3NvcnRCeUdyb3VwUGlwZX0gZnJvbSBcIi4uL3BpcGVzL3NvcnRCeUdyb3VwLnBpcGVcIjtcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gICAgbW9kdWxlSWQ6IG1vZHVsZS5pZCwgXHJcbiAgICBzZWxlY3RvcjogJ215LWFwcCcsXHJcbiAgICB0ZW1wbGF0ZVVybDogJ2FwcC50ZW1wbGF0ZS5odG1sJyxcclxuICAgIHN0eWxlVXJsczogWydhcHAuc3R5bGUuY3NzJ10sXHJcbiAgICBwcm92aWRlcnM6IFtTdG9yYWdlU2VydmljZV0sXHJcbiAgICBwaXBlczogW09iamVjdFRvQXJyYXlQaXBlLCBzb3J0QnlHcm91cFBpcGVdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBBcHBDb21wb25lbnQge1xyXG4gICAgLy9wdWJsaWMgbmV3X2NvbXBvbmVudCA9IHRoaXMuaW5pdF9uZXdfY29tcG9uZW50KCk7XHJcbiAgICBwdWJsaWMgY29tcG9uZW50cyA9IFtdO1xyXG4gICAgLy9wdWJsaWMgY29tcG9uZW50X2VkaXRhYmxlID0gW107XHJcbiAgICBwdWJsaWMgbmV3X2ZpZWxkID0geyB0eXBlOiBcInN0cmluZ1wiIH07ICAgXHJcbiAgICAvL3B1YmxpYyBuZXdfZ3JvdXAgPSBbXTtcclxuICAgIHB1YmxpYyBjb21wb25lbnRzX2N1cnJlbnRfdmlldyA9ICdhbGwnO1xyXG4gICAgcHVibGljIG5ld19jb21wb25lbnQgPSBbXTtcclxuICAgIC8vcHVibGljIGNyZWF0ZV9jb21wb25lbnRfZ3JvdXAgPSAnJztcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgc3RvcmFnZVNlcnZpY2U6IFN0b3JhZ2VTZXJ2aWNlKSB7fVxyXG5cclxuICAgIG5nT25Jbml0KCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCduZ09uSW5pdCcpO1xyXG4gICAgICAgIHRoaXMuZ2V0X2FsbF9jb21wb25lbnRzKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIGdldF9hbGxfY29tcG9uZW50cygpIHtcclxuICAgICAgICB0aGlzLnN0b3JhZ2VTZXJ2aWNlLnNlbGVjdCgnL2FwaS9jb21wb25lbnRzJyApLlxyXG4gICAgICAgICAgICBzdWJzY3JpYmUoIHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggJ2dldCAtICcgLCByZXMgKTtcclxuICAgICAgICAgICAgICAgIGlmKCAhcmVzLmVycm9yICkgdGhpcy5jb21wb25lbnRzID0gcmVzLmNvbXBvbmVudHM7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBzZXRfY3VycmVudF92aWV3KCB2aWV3ICl7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50X3ZpZXcgPSB2aWV3O1xyXG4gICAgfTtcclxuICAgIHNldF9jb21wb25lbnRzX2N1cnJlbnRfdmlldyggdmlldyApIHtcclxuICAgICAgICBpZiAoIHZpZXcgPT0gJ2FsbCcpIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdncm91cF9zZWxlY3QnKS52YWx1ZSA9ICdub25lJztcclxuICAgICAgICB0aGlzLmNvbXBvbmVudHNfY3VycmVudF92aWV3ID0gdmlldztcclxuICAgICAgICBjb25zb2xlLmxvZyggJyBjb21wb25lbnRzX2N1cnJlbnRfdmlldyAnLCB0aGlzLmNvbXBvbmVudHNfY3VycmVudF92aWV3ICk7ICAgICAgIFxyXG4gICAgfTtcclxuXHJcbiAgICBzZXRfc29ydGVkX2NvbXBvbmVudHNfY3VycmVudF92aWV3KCBzb3J0ICl7XHJcbiAgICAgICAgdGhpcy5jb21wb25lbnRzX2N1cnJlbnRfdmlldyA9ICdzb3J0ZWRfdmlldyc7XHJcbiAgICAgICAgdGhpcy5zb3J0ZWRfYnlfdmFsdWUgPSBzb3J0OyBcclxuICAgICAgICBjb25zb2xlLmxvZyggdGhpcy5zb3J0ZWRfYnlfdmFsdWUgKTsgXHJcbiAgICB9XHJcblxyXG4gICAgc2V0X25ld19jb21wb25lbnRfZ3JvdXBfc2VsZWN0KCB2YWx1ZSApIHtcclxuICAgICAgICB0aGlzLm5ld19jb21wb25lbnQuZ3JvdXAgPSB2YWx1ZTtcclxuICAgIH07XHJcblxyXG4gICAgY2hhbmdlX25ld19jb21wb25lbnRfZ3JvdXAoKSB7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyggJ2tleXVwIHZhbCAnLCB0aGlzLmNyZWF0ZV9jb21wb25lbnRfZ3JvdXAgKTtcclxuICAgICAgICBsZXQgcmVzID0gWzEsMiwzLDRdLmZpbmQoIGVsID0+IGVsID09IHRoaXMubmV3X2NvbXBvbmVudC5ncm91cCkgfHwgJ25vbmUnIDtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmV3X2NvbXBvbmVudF9ncm91cF9zZWxlY3QnKS52YWx1ZSA9IHJlcztcclxuICAgICAgICBjb25zb2xlLmxvZyggJ25ld19jb21wb25lbnRfZ3JvdXBfc2VsZWN0ICcsIHJlcyApOyBcclxuICAgIH07XHJcblxyXG4gICAgY2hvb3Nlbl9tZW51KCBhLCBiICl7XHJcbiAgICAgICAgaWYgKCBhID09IGIgKSByZXR1cm4gdHJ1ZTtcclxuICAgIH07XHJcblxyXG4gICAgc2V0X2Vycm9yX21zZyggZXJyb3JfbXNnICl7XHJcbiAgICAgICAgdGhpcy5lcnJvcl9tc2cgPSBlcnJvcl9tc2c7XHJcbiAgICAgICAgc2V0VGltZW91dCggKCk9PiB0aGlzLmVycm9yX21zZyA9ICcnLCAzMDAwICk7XHJcbiAgICB9O1xyXG5cclxuICAgIGlzX2NvbXBvbmVudF9leGlzdChuYW1lKXtcclxuICAgICAgICBsZXQgcmVzID0gdGhpcy5jb21wb25lbnRzLmZpbmQoIGNvbXAgPT4gY29tcC5uYW1lID09IG5hbWUpO1xyXG4gICAgICAgIC8vY29uc29sZS5sb2cocmVzKTtcclxuICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgfTtcclxuXHJcbiAgICBzZXRfZWRpdF9jb21wb25lbnQoIGVkaXRfY29tcCApIHtcclxuICAgICAgICB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZSA9IGVkaXRfY29tcDtcclxuICAgICAgICB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZS5uZXdfbmFtZSA9IHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLm5hbWU7XHJcbiAgICB9O1xyXG5cclxuICAgIHNldF9uZXdfZmllbGRfdHlwZSggdmFsdWUgKSB7XHJcbiAgICAgICAgdGhpcy5uZXdfZmllbGQudHlwZSA9IHZhbHVlO1xyXG4gICAgfTtcclxuXHJcbiAgICBzaG93X2lmX3R5cGVfZmllbGRfZXhpc3QoIHR5cGUgKSB7XHJcbiAgICAgICAgIHJldHVybiB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZS5ib2R5LmZpbmQoIGZpZWxkID0+IGZpZWxkLnR5cGUgPT0gdHlwZSApO1xyXG4gICAgfTtcclxuXHJcbiAgICBpc19maWVsZF9leGlzdChuYW1lKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb21wb25lbnRfZWRpdGFibGUuYm9keS5maW5kKCBmaWVsZCA9PiBmaWVsZC5uYW1lID09IG5hbWUgKTtcclxuICAgIH07ICBcclxuXHJcbiAgICBhbGxfY29tcG9uZW50c19uYW1lICgpe1xyXG4gICAgICAgIGxldCBjb21wX25hbWVzID0gW107XHJcbiAgICAgICAgdGhpcy5jb21wb25lbnRzLmZvckVhY2goZnVuY3Rpb24oZWwpe1xyXG4gICAgICAgICAgICBjb21wX25hbWVzID0gWy4uLmNvbXBfbmFtZXMsIGVsLm5hbWUgXTtcclxuICAgICAgICB9KTtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKCBjb21wX25hbWVzICk7XHJcbiAgICAgICAgcmV0dXJuIGNvbXBfbmFtZXM7IFxyXG4gICAgfTtcclxuXHJcblxyXG4gICAgYWxsX2dyb3Vwc19uYW1lICgpe1xyXG4gICAgICAgIGxldCBncm91cHNfbmFtZXMgPSBbXTtcclxuICAgICAgICB0aGlzLmNvbXBvbmVudHMuZm9yRWFjaChmdW5jdGlvbihlbCl7XHJcbiAgICAgICAgICAgIGlmIChncm91cHNfbmFtZXMuaW5kZXhPZihlbC5ncm91cCkgPT09IC0xICYmXHJcbiAgICAgICAgICAgICAgICBlbC5ncm91cCAhPSAnbm9uZScgKXtcclxuICAgICAgICAgICAgICAgIGdyb3Vwc19uYW1lcyA9IFsgLi4uZ3JvdXBzX25hbWVzLCBlbC5ncm91cCBdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyggZ3JvdXBzX25hbWVzICk7XHJcbiAgICAgICAgcmV0dXJuIGdyb3Vwc19uYW1lczsgXHJcbiAgICB9O1xyXG5cclxuICAgIGFkZF9uZXdfZmllbGQoKSB7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyggdGhpcy5uZXdfZmllbGQsICB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZSApO1xyXG5cclxuICAgICAgICBpZiAoICF0aGlzLm5ld19maWVsZC5uYW1lICkge1xyXG4gICAgICAgICAgICB0aGlzLnNldF9lcnJvcl9tc2coICdObyBmaWVsZCBuYW1lIHdhcyBwcm92aWRlZCAnICk7IFxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyggJ05vIG5hbWUgd2FzIHByb3ZpZGVkICcgKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIHRoaXMuaXNfZmllbGRfZXhpc3QodGhpcy5uZXdfZmllbGQubmFtZSkgKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0X2Vycm9yX21zZyggJ09uZSBmaWVsZCBoYXMgdGhpcyBuYW1lICcgKTsgXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCAnT25lIGZpbGVkIGhhcyB0aGlzIG5hbWUnICk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTsgICAgICAgICAgICBcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMubmV3X2ZpZWxkLl9pZCA9IHRoaXMuY3JlYXRlX2d1aWQoKTsgIFxyXG4gICAgICAgIC8vZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25ldy1maWVsZC1pZCcpLnZhbHVlID0gdGhpcy5uZXdfZmllbGQudHlwZTtcclxuICAgICAgICB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZS5ib2R5ID0gWy4uLnRoaXMuY29tcG9uZW50X2VkaXRhYmxlLmJvZHksIHRoaXMubmV3X2ZpZWxkXTtcclxuXHJcbiAgICAgICAgaWYgKCB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZS5ncm91cCAhPSAnbm9uZScpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWRkX25ld19maWVsZF90b19ncm91cCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5uZXdfZmllbGQgPSB7IHR5cGU6IHRoaXMubmV3X2ZpZWxkLnR5cGUgfTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5uZXdfZmllbGQgPSB7IHR5cGU6IHRoaXMubmV3X2ZpZWxkLnR5cGUgfTtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKCAgdGhpcy5jb21wb25lbnRfZWRpdGFibGUuYm9keSApO1xyXG4gICAgICAgIHRoaXMuc3RvcmFnZVNlcnZpY2UudXBkYXRlKCcvYXBpL2NvbXBvbmVudHMnLHtcclxuICAgICAgICAgICAgaWQgOiB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZS5faWQsXHJcbiAgICAgICAgICAgIG5hbWUgOiB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZS5uYW1lLFxyXG4gICAgICAgICAgICBncm91cCA6IHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLmdyb3VwLFxyXG4gICAgICAgICAgICBib2R5IDogdGhpcy5jb21wb25lbnRfZWRpdGFibGUuYm9keVxyXG4gICAgICAgIH0pLlxyXG4gICAgICAgICAgICBzdWJzY3JpYmUoIHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggJ3B1dCAtICcgLCByZXMgKTtcclxuICAgICAgICAgICAgICAgIGlmICggIXJlcy5lcnJvciApIHRoaXMuY29tcG9uZW50cyA9IHJlcy5jb21wb25lbnRzO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coICcgYiAnLCB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZS5ib2R5ICk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGFkZF9uZXdfZmllbGRfdG9fZ3JvdXAoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0b3JhZ2VTZXJ2aWNlLnVwZGF0ZSgnL2FwaS9jb21wb25lbnRzL2dyb3VwL2FkZCcse1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBncm91cCA6IHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLmdyb3VwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWVsZCA6IHRoaXMubmV3X2ZpZWxkXHJcbiAgICAgICAgICAgICAgICB9KS5cclxuICAgICAgICAgICAgICAgIHN1YnNjcmliZSggcmVzID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coICdhbGwgcHV0IC0gJyAsIHJlcyApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoICFyZXMuZXJyb3IgKSB0aGlzLmNvbXBvbmVudHMgPSByZXMuY29tcG9uZW50cztcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBkZWxldGVfZmllbGQoIGlkICl7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyggdGhpcy5jb21wb25lbnRfZWRpdGFibGUuYm9keSApO1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLmJvZHkuZm9yRWFjaCggKGVsLCBpZHgsIGFycikgPT4geyBcclxuICAgICAgICAgICAgaWYoZWwuX2lkID09PSBpZCApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLmJvZHkuc3BsaWNlKGlkeCwgMSk7XHJcbiAgICAgICAgICAgIH0gXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmICggdGhpcy5jb21wb25lbnRfZWRpdGFibGUuZ3JvdXAgIT0gJ25vbmUnKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlbGV0ZV9maWVsZF90b19ncm91cChpZCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vY29uc29sZS5sb2coIHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLmJvZHkgKSA7ICAgICAgXHJcbiAgICAgICAgdGhpcy5zdG9yYWdlU2VydmljZS51cGRhdGUoJy9hcGkvY29tcG9uZW50cycse1xyXG4gICAgICAgICAgICBpZCA6IHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLl9pZCxcclxuICAgICAgICAgICAgbmFtZSA6IHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLm5hbWUsXHJcbiAgICAgICAgICAgIGdyb3VwIDogdGhpcy5jb21wb25lbnRfZWRpdGFibGUuZ3JvdXAsXHJcbiAgICAgICAgICAgIGJvZHkgOiB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZS5ib2R5XHJcbiAgICAgICAgfSkuXHJcbiAgICAgICAgICAgIHN1YnNjcmliZSggcmVzID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCAncHV0IC0gJyAsIHJlcyApO1xyXG4gICAgICAgICAgICAgICAgaWYgKCAhcmVzLmVycm9yICkgdGhpcy5jb21wb25lbnRzID0gcmVzLmNvbXBvbmVudHM7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBkZWxldGVfZmllbGRfdG9fZ3JvdXAoaWQpIHtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKCB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZS5ib2R5ICkgOyAgICAgIFxyXG4gICAgICAgIHRoaXMuc3RvcmFnZVNlcnZpY2UudXBkYXRlKCcvYXBpL2NvbXBvbmVudHMvZ3JvdXAvZGVsZXRlJyx7XHJcbiAgICAgICAgICAgIGdyb3VwIDogdGhpcy5jb21wb25lbnRfZWRpdGFibGUuZ3JvdXAsIFxyXG4gICAgICAgICAgICBpZDogaWRcclxuICAgICAgICB9KS5cclxuICAgICAgICAgICAgc3Vic2NyaWJlKCByZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coICdwdXQgLSAnICwgcmVzICk7XHJcbiAgICAgICAgICAgICAgICBpZiAoICFyZXMuZXJyb3IgKSB0aGlzLmNvbXBvbmVudHMgPSByZXMuY29tcG9uZW50cztcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG5cclxuXHJcbiAgICBzZXRfY29tcG9uZW50X2ZpZWxkX3ZhbHVlKCBmaWVsZCwgbmFtZSApe1xyXG4gICAgICAgIGxldCBjb21wID0gdGhpcy5jb21wb25lbnRzLmZpbmQoIGNvbXAgPT4gY29tcC5uYW1lID09PSBuYW1lICYmIHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLm5hbWUgIT09IG5hbWUgKTtcclxuICAgICAgICBmaWVsZC52YWx1ZSA9IGNvbXA7XHJcbiAgICB9O1xyXG5cclxuICAgIHNob3dfanNvbl9vZl9lZGl0X2NvbXBvbmVudCgpe1xyXG4gICAgICAgIHRoaXMuanNvbl9vZl9lZGl0X2NvbXBvbmVudF9pc192aXNpYmxlID0gIXRoaXMuanNvbl9vZl9lZGl0X2NvbXBvbmVudF9pc192aXNpYmxlO1xyXG4gICAgfTtcclxuXHJcbiAgICBcclxuXHJcbiAgICBjcmVhdGVfY29tcG9uZW50KCl7XHJcbiAgICAgICAgaWYgKCAhIHRoaXMubmV3X2NvbXBvbmVudC5uYW1lICkge1xyXG4gICAgICAgICAgICB0aGlzLnNldF9lcnJvcl9tc2coICcgTm8gbmFtZSB3YXMgcHJvdmlkZWQgJyApO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyggJ05vIG5hbWUgd2FzIHByb3ZpZGVkICcgKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIHRoaXMuaXNfY29tcG9uZW50X2V4aXN0KHRoaXMubmV3X2NvbXBvbmVudC5uYW1lKSApIHtcclxuICAgICAgICAgICAgdGhpcy5zZXRfZXJyb3JfbXNnKCAnT25lIGNvbXBvbmVudCBoYXMgdGhpcyBuYW1lICcgKTsgXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCAnT25lIGNvbXBvbmVudCBoYXMgdGhpcyBuYW1lJyApO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7ICAgICAgICAgICBcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICggISB0aGlzLm5ld19jb21wb25lbnQuZ3JvdXAgKSB0aGlzLm5ld19jb21wb25lbnQuZ3JvdXAgPSAnbm9uZScgO1xyXG4gICAgICAgIGxldCBib2R5ID0gW107XHJcbiAgICAgICAgaWYgKCB0aGlzLm5ld19jb21wb25lbnQuZ3JvdXAgIT09ICdub25lJyApe1xyXG4gICAgICAgICAgICBsZXQgcmVzID0gdGhpcy5jb21wb25lbnRzLmZpbmQoIGNvbXAgPT4gY29tcC5ncm91cCA9PSB0aGlzLm5ld19jb21wb25lbnQuZ3JvdXApO1xyXG4gICAgICAgICAgICBpZiAoIHJlcyApIGJvZHkgPSByZXMuYm9keSA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnN0b3JhZ2VTZXJ2aWNlLmluc2VydCgnL2FwaS9jb21wb25lbnRzJywge1xyXG4gICAgICAgICAgICBuYW1lIDogdGhpcy5uZXdfY29tcG9uZW50Lm5hbWUsXHJcbiAgICAgICAgICAgIGdyb3VwIDogdGhpcy5uZXdfY29tcG9uZW50Lmdyb3VwIHx8ICdub25lJyxcclxuICAgICAgICAgICAgYm9keSA6IFtdXHJcbiAgICAgICAgIH0pLlxyXG4gICAgICAgICAgICBzdWJzY3JpYmUoIHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggJ3Bvc3QgLSAnICwgcmVzICk7XHJcbiAgICAgICAgICAgICAgICBpZiAoICFyZXMuZXJyb3IgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb21wb25lbnRzID0gcmVzLmNvbXBvbmVudHM7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGVkaXRfY29tcCA9IHRoaXMuY29tcG9uZW50cy5maW5kKCBjb21wID0+IGNvbXAubmFtZSA9PSB0aGlzLm5ld19jb21wb25lbnQubmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCBlZGl0X2NvbXAgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0X2NvbXBvbmVudHNfY3VycmVudF92aWV3KCdlZGl0LWNvbXBvbmVudCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldF9lZGl0X2NvbXBvbmVudCggZWRpdF9jb21wICk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBjaGFuZ2VfY29tcG9uZW50KGNvbXBvbmVudCl7XHJcblxyXG4gICAgICAgIGlmICggIHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLm5ld19uYW1lICE9IHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLm5hbWUgJiYgXHJcbiAgICAgICAgICAgICAgdGhpcy5pc19jb21wb25lbnRfZXhpc3QodGhpcy5jb21wb25lbnRfZWRpdGFibGUubmV3X25hbWUpICkge1xyXG4gICAgICAgICAgICB0aGlzLnNldF9lcnJvcl9tc2coICdPbmUgY29tcG9uZW50IGhhcyB0aGlzIG5hbWUgJyApOyBcclxuICAgICAgICAgICAgY29uc29sZS5sb2coICdPbmUgY29tcG9uZW50IGhhcyB0aGlzIG5hbWUnICk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTsgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiggdGhpcy5jb21wb25lbnRfZWRpdGFibGUubmV3X25hbWUgIT0gdGhpcy5jb21wb25lbnRfZWRpdGFibGUubmFtZSApIHtcclxuICAgICAgICAgICAgdGhpcy5jb21wb25lbnRfZWRpdGFibGUubmFtZSA9IHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLm5ld19uYW1lOyBcclxuICAgICAgICB9ICAgXHJcbiAgICAgICAgdGhpcy5zdG9yYWdlU2VydmljZS51cGRhdGUoJy9hcGkvY29tcG9uZW50cycse1xyXG4gICAgICAgICAgICBpZCA6IHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLl9pZCxcclxuICAgICAgICAgICAgbmFtZSA6IHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLm5hbWUsXHJcbiAgICAgICAgICAgIGdyb3VwIDogdGhpcy5jb21wb25lbnRfZWRpdGFibGUuZ3JvdXAsXHJcbiAgICAgICAgICAgIGJvZHkgOiB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZS5ib2R5XHJcbiAgICAgICAgfSkuXHJcbiAgICAgICAgICAgIHN1YnNjcmliZSggcmVzID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCAncHV0IC0gJyAsIHJlcyApO1xyXG4gICAgICAgICAgICAgICAgaWYgKCAhcmVzLmVycm9yICkgdGhpcy5jb21wb25lbnRzID0gcmVzLmNvbXBvbmVudHM7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGNvcHlfY29tcG9uZW50KCkge1xyXG4gICAgICAgIGlmICggIXRoaXMuY29tcG9uZW50X2VkaXRhYmxlLm5ld19uYW1lIHx8XHJcbiAgICAgICAgICAgICAgdGhpcy5jb21wb25lbnRfZWRpdGFibGUubmFtZSA9PSB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZS5uZXdfbmFtZSApIHtcclxuICAgICAgICAgICAgdGhpcy5zZXRfZXJyb3JfbXNnKCAnTm8gbmV3IG5hbWUgd2FzIHByb3ZpZGVkICcgKTsgXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCAnTm8gbmV3IG5hbWUgd2FzIHByb3ZpZGVkICcgKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlOyAgICBcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoIHRoaXMuaXNfY29tcG9uZW50X2V4aXN0KHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLm5ld19uYW1lKVxyXG4gICAgICAgICAgICApe1xyXG4gICAgICAgICAgICB0aGlzLnNldF9lcnJvcl9tc2coICdPbmUgY29tcG9uZW50IGhhcyB0aGlzIG5hbWUgJyApOyBcclxuICAgICAgICAgICAgY29uc29sZS5sb2coICdPbmUgY29tcG9uZW50IGhhcyB0aGlzIG5hbWUnICk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zdG9yYWdlU2VydmljZS5pbnNlcnQoJy9hcGkvY29tcG9uZW50cycsIHtcclxuICAgICAgICAgICAgaWQgOiB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZS5faWQsXHJcbiAgICAgICAgICAgIG5hbWUgOiB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZS5uZXdfbmFtZSxcclxuICAgICAgICAgICAgZ3JvdXAgOiB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZS5ncm91cCxcclxuICAgICAgICAgICAgYm9keSA6IHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLmJvZHlcclxuICAgICAgICAgfSkuXHJcbiAgICAgICAgICAgIHN1YnNjcmliZSggcmVzID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCAncG9zdCAtICcgLCByZXMgKTtcclxuICAgICAgICAgICAgICAgIGlmICggIXJlcy5lcnJvciApIHRoaXMuY29tcG9uZW50cyA9IHJlcy5jb21wb25lbnRzO1xyXG4gICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgXHJcbiAgICBkZWxldGVfY29tcG9uZW50KCkge1xyXG4gICAgICAgIHRoaXMuc3RvcmFnZVNlcnZpY2UuZGVsZXRlKCcvYXBpL2NvbXBvbmVudHMnLCB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZS5faWQpLlxyXG4gICAgICAgICAgICBzdWJzY3JpYmUoIHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggJ2RlbGV0ZSAtICcgLCByZXMgKTtcclxuICAgICAgICAgICAgICAgIGlmICggIXJlcy5lcnJvciApIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbXBvbmVudHMgPSByZXMuY29tcG9uZW50cztcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldF9jb21wb25lbnRzX2N1cnJlbnRfdmlldyggJ2FsbCcgKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuLypcclxuXHJcbiAgICBpbml0X25ld19jb21wb25lbnQobXV0YWJpbGl0eSA9ICcnKXtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBtdXRhYmlsaXR5IDogbXV0YWJpbGl0eVxyXG4gICAgICAgIH07XHJcbiAgICB9O1xyXG5cclxuICAgIHNldF9uZXdfY29tcG9uZW50X211dGFiaWxpdHkobXV0YWJpbGl0eSl7XHJcbiAgICAgICAgdGhpcy5uZXdfY29tcG9uZW50ID0gIHRoaXMuaW5pdF9uZXdfY29tcG9uZW50KCBtdXRhYmlsaXR5ICk7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICBnZXRfYWxsX2NvbXBvbmVudHMoKSB7XHJcbiAgICAgICAgdGhpcy5zdG9yYWdlU2VydmljZS5zZWxlY3QoJy9hcGkvY29tcG9uZW50cycgKS5cclxuICAgICAgICAgICAgc3Vic2NyaWJlKCByZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coICdnZXQgLSAnICwgcmVzICk7XHJcbiAgICAgICAgICAgICAgICBpZiggIXJlcy5lcnJvciApIHRoaXMuY29tcG9uZW50cyA9IHJlcy5jb21wb25lbnRzO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgY3JlYXRlX2NvbXBvbmVudCgpe1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCB0aGlzLmNvbXBvbmVudHMgKTtcclxuICAgICAgICBpZiAoICF0aGlzLm5ld19jb21wb25lbnQubmFtZSApIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coICcgbm8gbmFtZSB3YXMgcHJvdmlkZWQgJyk7XHJcbiAgICAgICAgICAgIHJldHVybiA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICggdGhpcy5leGlzdF9jb21wb25lbnRfd2hpdGhfdGhpc19uYW1lKCkgKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCAnIGNvbXBvbmVudCB3aXRoIHN1Y2ggbmFtZSBleGlzdHMgJyApO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc3RvcmFnZVNlcnZpY2UuaW5zZXJ0KCcvYXBpL2NvbXBvbmVudHMnLCB7XHJcbiAgICAgICAgICAgIG5hbWUgOiB0aGlzLm5ld19jb21wb25lbnQubmFtZSxcclxuICAgICAgICAgICAgZ3JvdXAgOiB0aGlzLm5ld19jb21wb25lbnQuZ3JvdXAgfHwgJycsXHJcbiAgICAgICAgICAgIG11dGFiaWxpdHkgOiB0aGlzLm5ld19jb21wb25lbnQubXV0YWJpbGl0eSxcclxuICAgICAgICAgICAgYm9keSA6IFtdXHJcbiAgICAgICAgIH0pLlxyXG4gICAgICAgICAgICBzdWJzY3JpYmUoIHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggJ3Bvc3QgLSAnICwgcmVzICk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggcmVzLm1zZyApO1xyXG4gICAgICAgICAgICAgICAgaWYgKCAhcmVzLmVycm9yICkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29tcG9uZW50cyA9IHJlcy5jb21wb25lbnRzO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV3X2NvbXBvbmVudCA9IHRoaXMuaW5pdF9uZXdfY29tcG9uZW50KHRoaXMubmV3X2NvbXBvbmVudC5tdXRhYmlsaXR5KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIGNoYW5nZV9jb21wb25lbnQoY29tcG9uZW50KXtcclxuICAgICAgICBpZiAoICFjb21wb25lbnQubmV3X25hbWUgKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdubyBuYW1lIHdhcyBwcm92aWRlZCAnKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiggdGhpcy5leGlzdF9jb21wb25lbnRfd2hpdGhfdGhpc19uYW1lKGNvbXBvbmVudC5uZXdfbmFtZSkgKXtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coICcgY29tcG9uZW50IHdpdGggc3VjaCBuYW1lIGV4aXN0cyAnICk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zdG9yYWdlU2VydmljZS51cGRhdGUoJy9hcGkvY29tcG9uZW50cycse1xyXG4gICAgICAgICAgICBpZCA6IGNvbXBvbmVudC5faWQsXHJcbiAgICAgICAgICAgIG5hbWUgOiBjb21wb25lbnQubmV3X25hbWUsXHJcbiAgICAgICAgICAgIGdyb3VwIDogY29tcG9uZW50Lmdyb3VwLFxyXG4gICAgICAgICAgICBtdXRhYmlsaXR5IDogdGhpcy5uZXdfY29tcG9uZW50Lm11dGFiaWxpdHksXHJcbiAgICAgICAgICAgIGJvZHkgOiBjb21wb25lbnQuYm9keVxyXG4gICAgICAgIH0pLlxyXG4gICAgICAgICAgICBzdWJzY3JpYmUoIHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggJ3B1dCAtICcgLCByZXMgKTtcclxuICAgICAgICAgICAgICAgIGlmICggIXJlcy5lcnJvciApIHRoaXMuY29tcG9uZW50cyA9IHJlcy5jb21wb25lbnRzO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBjb3B5X2NvbXBvbmVudChjb21wb25lbnQpIHtcclxuICAgICAgICBpZiAoICFjb21wb25lbnQubmV3X25hbWUgKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCAnbm8gbmFtZSB3YXMgcHJvdmlkZWQgJyApO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKCB0aGlzLmV4aXN0X2NvbXBvbmVudF93aGl0aF90aGlzX25hbWUoY29tcG9uZW50Lm5ld19uYW1lKSApe1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyggJyBjb21wb25lbnQgd2l0aCBzdWNoIG5hbWUgZXhpc3RzICcgKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnN0b3JhZ2VTZXJ2aWNlLmluc2VydCgnL2FwaS9jb21wb25lbnRzJywge1xyXG4gICAgICAgICAgICBuYW1lIDogY29tcG9uZW50Lm5ld19uYW1lLFxyXG4gICAgICAgICAgICBncm91cCA6IGNvbXBvbmVudC5ncm91cCxcclxuICAgICAgICAgICAgbXV0YWJpbGl0eSA6IGNvbXBvbmVudC5tdXRhYmlsaXR5LFxyXG4gICAgICAgICAgICBib2R5IDogY29tcG9uZW50LmJvZHlcclxuICAgICAgICAgfSkuXHJcbiAgICAgICAgICAgIHN1YnNjcmliZSggcmVzID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCAncG9zdCAtICcgLCByZXMgKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCByZXMubXNnICk7XHJcbiAgICAgICAgICAgICAgICBpZiAoICFyZXMuZXJyb3IgKSB0aGlzLmNvbXBvbmVudHMgPSByZXMuY29tcG9uZW50cztcclxuICAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGRlbGV0ZV9jb21wb25lbnQoaWQpIHtcclxuICAgICAgICBpZiAoICFpZCApIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ25vIGlkIHdhcyBwcm92aWRlZCAnKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnN0b3JhZ2VTZXJ2aWNlLmRlbGV0ZSgnL2FwaS9jb21wb25lbnRzJywgaWQpLlxyXG4gICAgICAgICAgICBzdWJzY3JpYmUoIHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggJ2RlbGV0ZSAtICcgLCByZXMgKTtcclxuICAgICAgICAgICAgICAgIGlmICggIXJlcy5lcnJvciApIHRoaXMuY29tcG9uZW50cyA9IHJlcy5jb21wb25lbnRzO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgZXhpc3RfY29tcG9uZW50X3doaXRoX3RoaXNfbmFtZShuYW1lID0gdGhpcy5uZXdfY29tcG9uZW50Lm5hbWUpe1xyXG4gICAgICAgIGlmKFxyXG4gICAgICAgICAgICB0aGlzLmNvbXBvbmVudHMuZmluZChlbCA9PiB7IHJldHVybiBlbC5uYW1lID09PSBuYW1lID8gdHJ1ZSA6IGZhbHNlIH0pXHJcbiAgICAgICAgICAgICkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfTtcclxuXHJcbiAgICBlZGl0X2ZpZWxkc19jb21wb25lbnQoY29tcG9uZW50KXtcclxuICAgICAgICB0aGlzLm5ld19maWVsZCA9IHsgdHlwZTogXCJzdHJpbmdcIiB9OyBcclxuICAgICAgICBjb25zb2xlLmxvZyggdGhpcy5jb21wb25lbnRfZWRpdGFibGUsIGNvbXBvbmVudCApO1xyXG4gICAgICAgIGlmICggdGhpcy5jb21wb25lbnRfZWRpdGFibGUuX2lkICE9IGNvbXBvbmVudC5faWQpICB7IFxyXG4gICAgICAgICAgICB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZSA9IGNvbXBvbmVudDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZSA9IFtdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxuICAgIHNob3dfZmllbGRzX2NvbXBvbmVudChjb21wb25lbnQpe1xyXG4gICAgICAgIGlmICggIHRoaXMuY29tcG9uZW50X2VkaXRhYmxlICYmXHJcbiAgICAgICAgICAgICAgdGhpcy5jb21wb25lbnRfZWRpdGFibGUuX2lkID09PSBjb21wb25lbnQuX2lkIFxyXG4gICAgICAgICkgcmV0dXJuIHRydWU7XHJcbiAgICB9OyBcclxuXHJcbiAgICBhZGRfZmllbGQoIGNvbXBvbmVudCwgbmV3X2ZpZWxkID0ge30gKXtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKCBjb21wb25lbnQsIG5ld19maWVsZCApO1xyXG4gICAgICAgIGlmICggIW5ld19maWVsZC5uYW1lICkgcmV0dXJuO1xyXG4gICAgICAgIGlmICggdGhpcy5leGlzdF9maWVsZF93aXRoX3RoaXNfbmFtZShjb21wb25lbnQsIG5ld19maWVsZC5uYW1lKSApIHJldHVybiA7XHJcbiAgICAgICAgdGhpcy5uZXdfZmllbGQgPSB7IHR5cGU6IFwic3RyaW5nXCIgfTsgXHJcbiAgICAgICAgbmV3X2ZpZWxkLl9pZCA9IHRoaXMuY3JlYXRlX2d1aWQoKTsgICAgICAgIFxyXG4gICAgICAgIGNvbXBvbmVudC5ib2R5ID0gWyAuLi4gY29tcG9uZW50LmJvZHkgLCBuZXdfZmllbGQgXTtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKCBjb21wb25lbnQuYm9keSApO1xyXG4gICAgICAgIHRoaXMuc3RvcmFnZVNlcnZpY2UudXBkYXRlKCcvYXBpL2NvbXBvbmVudHMnLHtcclxuICAgICAgICAgICAgaWQgOiBjb21wb25lbnQuX2lkLFxyXG4gICAgICAgICAgICBuYW1lIDogY29tcG9uZW50Lm5hbWUsXHJcbiAgICAgICAgICAgIGdyb3VwIDogY29tcG9uZW50Lmdyb3VwLFxyXG4gICAgICAgICAgICBtdXRhYmlsaXR5IDogY29tcG9uZW50Lm11dGFiaWxpdHksXHJcbiAgICAgICAgICAgIGJvZHkgOiBjb21wb25lbnQuYm9keVxyXG4gICAgICAgIH0pLlxyXG4gICAgICAgICAgICBzdWJzY3JpYmUoIHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggJ3B1dCAtICcgLCByZXMgKTtcclxuICAgICAgICAgICAgICAgIGlmICggIXJlcy5lcnJvciApIHRoaXMuY29tcG9uZW50cyA9IHJlcy5jb21wb25lbnRzO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgaWZfbnVtYmVyX2ZpZWxkKHZhbCl7XHJcbiAgICAgICAgdmFsID0gTnVtYmVyKHZhbCk7XHJcbiAgICAgICAgcmV0dXJuIHZhbCA/IHZhbCA6IDAgO1xyXG4gICAgfTtcclxuXHJcbiAgICBpZl9jb21wb25lbnRfZmllbGQoY29tcG9uZW50LCB2YWwpe1xyXG4gICAgICAgIGxldCByZXMgPSBbXTtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKGNvbXBvbmVudCwgdmFsKTtcclxuICAgICAgICB0aGlzLmNvbXBvbmVudHMuZmluZChlbCA9PiB7IFxyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCBlbC5uYW1lICk7XHJcbiAgICAgICAgICAgIGlmICggZWwubmFtZSA9PT0gdmFsICYmXHJcbiAgICAgICAgICAgICAgIGNvbXBvbmVudC5uYW1lICE9PSB2YWwgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCAncmVzICcsIGVsICk7XHJcbiAgICAgICAgICAgICAgICAgICByZXMgPSAgZWw7XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyggJyAvLy8vLy8vLy8vLy8vLy8vICcpOyAgICAgICAgICAgICAgICBcclxuICAgICAgICB9KVxyXG4gICAgICAgIHJldHVybiByZXM7XHJcbiAgICB9O1xyXG5cclxuICAgIGNoYW5nZV9maWVsZCggc2V0dGluZ3MgPSB7fSApe1xyXG4gICAgICAgIGxldCBjb21wb25lbnQgPSBzZXR0aW5ncy5jb21wb25lbnQ7XHJcbiAgICAgICAgbGV0IGZpZWxkID0gc2V0dGluZ3MuZmllbGQ7XHJcblxyXG4gICAgICAgIC8vY29uc29sZS5sb2coY29tcG9uZW50LCBmaWVsZCk7XHJcbiAgICAgICAgaWYgKCB0aGlzLmV4aXN0X2ZpZWxkX3dpdGhfdGhpc19uYW1lKGNvbXBvbmVudCwgZmllbGQuZWRpdF9uYW1lLCBmaWVsZC5faWQgKSApIHJldHVybjtcclxuICAgICAgICBpZiAoIHNldHRpbmdzLnR5cGUgPT0gJ251bWJlcicgKSB7XHJcbiAgICAgICAgICAgIGZpZWxkLmVkaXRfdmFsdWUgPSB0aGlzLmlmX251bWJlcl9maWVsZChmaWVsZC5lZGl0X3ZhbHVlX25hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIHNldHRpbmdzLnR5cGUgPT0gJ2NvbXBvbmVudCcgKSB7XHJcbiAgICAgICAgICAgIGZpZWxkLmNvbXBvbmVudF92YWx1ZSA9IHRoaXMuaWZfY29tcG9uZW50X2ZpZWxkKGNvbXBvbmVudCwgZmllbGQuZWRpdF92YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpZWxkLm5hbWUgPSBmaWVsZC5lZGl0X25hbWUgfHwgZmllbGQubmFtZTtcclxuICAgICAgICBmaWVsZC52YWx1ZSA9IGZpZWxkLmVkaXRfdmFsdWU7XHJcbiAgICAgICAgZGVsZXRlIGZpZWxkLmVkaXRfbmFtZTtcclxuICAgICAgICBkZWxldGUgZmllbGQuZWRpdF92YWx1ZTtcclxuICAgICAgICBkZWxldGUgZmllbGQuYXNzaWdubWVudDtcclxuXHJcbiAgICAgICAgdGhpcy5zdG9yYWdlU2VydmljZS51cGRhdGUoJy9hcGkvY29tcG9uZW50cycse1xyXG4gICAgICAgICAgICBpZCA6IGNvbXBvbmVudC5faWQsXHJcbiAgICAgICAgICAgIG5hbWUgOiBjb21wb25lbnQubmFtZSxcclxuICAgICAgICAgICAgZ3JvdXAgOiBjb21wb25lbnQuZ3JvdXAsXHJcbiAgICAgICAgICAgIG11dGFiaWxpdHkgOiBjb21wb25lbnQubXV0YWJpbGl0eSxcclxuICAgICAgICAgICAgYm9keSA6IGNvbXBvbmVudC5ib2R5XHJcbiAgICAgICAgfSkuXHJcbiAgICAgICAgICAgIHN1YnNjcmliZSggcmVzID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCAncHV0IC0gJyAsIHJlcyApO1xyXG4gICAgICAgICAgICAgICAgaWYgKCAhcmVzLmVycm9yICkgdGhpcy5jb21wb25lbnRzID0gcmVzLmNvbXBvbmVudHM7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgXHJcbiAgICB9O1xyXG5cclxuICAgIGNvcHlfZmllbGQoIHNldHRpbmdzID0ge30gKXtcclxuICAgICAgICBsZXQgY29tcG9uZW50ID0gc2V0dGluZ3MuY29tcG9uZW50O1xyXG4gICAgICAgIGxldCBmaWVsZCA9IHNldHRpbmdzLmZpZWxkO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGNvbXBvbmVudCwgZmllbGQpO1xyXG4gICAgICAgIGlmICggIWZpZWxkLmVkaXRfbmFtZSApIHJldHVybjtcclxuICAgICAgICBpZiAoIHRoaXMuZXhpc3RfZmllbGRfd2l0aF90aGlzX25hbWUoY29tcG9uZW50LCBmaWVsZC5lZGl0X25hbWUsIGZpZWxkLl9pZCApICkgcmV0dXJuO1xyXG4gICAgICAgIGxldCBuZXdfZmllbGQgPSB0aGlzLmRlZXBDb3B5KGZpZWxkKTtcclxuICAgICAgICBuZXdfZmllbGQuX2lkID0gdGhpcy5jcmVhdGVfZ3VpZCgpO1xyXG4gICAgICAgIG5ld19maWVsZC5uYW1lID0gbmV3X2ZpZWxkLmVkaXRfbmFtZTtcclxuICAgICAgICBuZXdfZmllbGQudmFsdWUgPSAnJztcclxuICAgICAgICBpZiAoIHNldHRpbmdzLnR5cGUgPT0gJ251bWJlcicgKSB7XHJcbiAgICAgICAgICAgIG5ld19maWVsZC52YWx1ZT0gdGhpcy5pZl9udW1iZXJfZmllbGQobmV3X2ZpZWxkLnZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCBzZXR0aW5ncy50eXBlID09ICdjb21wb25lbnQnICkge1xyXG4gICAgICAgICAgICB0aGlzLmlmX2NvbXBvbmVudF9maWVsZChjb21wb25lbnQsIG5ld19maWVsZC52YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGRlbGV0ZSBuZXdfZmllbGQuZWRpdF9uYW1lO1xyXG4gICAgICAgIGRlbGV0ZSBuZXdfZmllbGQuZWRpdF92YWx1ZTtcclxuICAgICAgICBkZWxldGUgbmV3X2ZpZWxkLmFzc2lnbm1lbnQ7XHJcbiAgICAgICAgY29tcG9uZW50LmJvZHkgPSBbIC4uLiBjb21wb25lbnQuYm9keSAsIG5ld19maWVsZCBdO1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coIG5ld19maWVsZCApO1xyXG4gICAgICAgIHRoaXMuc3RvcmFnZVNlcnZpY2UudXBkYXRlKCcvYXBpL2NvbXBvbmVudHMnLHtcclxuICAgICAgICAgICAgaWQgOiBjb21wb25lbnQuX2lkLFxyXG4gICAgICAgICAgICBuYW1lIDogY29tcG9uZW50Lm5hbWUsXHJcbiAgICAgICAgICAgIGdyb3VwIDogY29tcG9uZW50Lmdyb3VwLFxyXG4gICAgICAgICAgICBtdXRhYmlsaXR5IDogY29tcG9uZW50Lm11dGFiaWxpdHksXHJcbiAgICAgICAgICAgIGJvZHkgOiBjb21wb25lbnQuYm9keVxyXG4gICAgICAgIH0pLlxyXG4gICAgICAgICAgICBzdWJzY3JpYmUoIHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggJ3B1dCAtICcgLCByZXMgKTtcclxuICAgICAgICAgICAgICAgIGlmICggIXJlcy5lcnJvciApIHRoaXMuY29tcG9uZW50cyA9IHJlcy5jb21wb25lbnRzO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBkZWxldGVfZmllbGQoIHNldHRpbmdzID0ge30gKXtcclxuICAgICAgICBsZXQgY29tcG9uZW50ID0gc2V0dGluZ3MuY29tcG9uZW50O1xyXG4gICAgICAgIGxldCBmaWVsZCA9IHNldHRpbmdzLmZpZWxkO1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coY29tcG9uZW50LCBmaWVsZCk7XHJcbiAgICAgICAgaWYgKCAhY29tcG9uZW50IHx8ICFmaWVsZCApIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coICdubyBjb21wb25lbnQgb3IgZmllbGQnKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb21wb25lbnQuYm9keS5mb3JFYWNoKCAoZWwsIGlkeCwgYXJyKSA9PiB7IFxyXG4gICAgICAgICAgICBpZihlbC5faWQgPT09IGZpZWxkLl9pZCApIHtcclxuICAgICAgICAgICAgICAgIGFyci5zcGxpY2UoaWR4LCAxKTtcclxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coIGFyciwgaWR4ICk7XHJcbiAgICAgICAgICAgIH0gXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5zdG9yYWdlU2VydmljZS51cGRhdGUoJy9hcGkvY29tcG9uZW50cycse1xyXG4gICAgICAgICAgICBpZCA6IGNvbXBvbmVudC5faWQsXHJcbiAgICAgICAgICAgIG5hbWUgOiBjb21wb25lbnQubmFtZSxcclxuICAgICAgICAgICAgZ3JvdXAgOiBjb21wb25lbnQuZ3JvdXAsXHJcbiAgICAgICAgICAgIG11dGFiaWxpdHkgOiBjb21wb25lbnQubXV0YWJpbGl0eSxcclxuICAgICAgICAgICAgYm9keSA6IGNvbXBvbmVudC5ib2R5XHJcbiAgICAgICAgfSkuXHJcbiAgICAgICAgICAgIHN1YnNjcmliZSggcmVzID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCAncHV0IC0gJyAsIHJlcyApO1xyXG4gICAgICAgICAgICAgICAgaWYgKCAhcmVzLmVycm9yICkgdGhpcy5jb21wb25lbnRzID0gcmVzLmNvbXBvbmVudHM7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgXHJcbiAgICB9O1xyXG5cclxuICAgIHZhbHVlX2Fzc2lnbm1lbnQoZmllbGQpe1xyXG4gICAgICAgIGlmICggICFmaWVsZC5hc3NpZ25tZW50ICl7XHJcbiAgICAgICAgICAgIGlmICggZmllbGQudHlwZSA9PSAnY29tcG9uZW50JyApIHtcclxuICAgICAgICAgICAgICAgIGZpZWxkLmNvbXBvbmVudF92YWx1ZSA9IGZpZWxkLmNvbXBvbmVudF92YWx1ZSB8fCBbXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmaWVsZC5lZGl0X3ZhbHVlID0gZmllbGQudmFsdWU7XHJcbiAgICAgICAgICAgIGZpZWxkLmFzc2lnbm1lbnQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH07XHJcblxyXG4gICAgZXhpc3RfZmllbGRfd2l0aF90aGlzX25hbWUoY29tcG9uZW50LCBmaWVsZF9uYW1lLCBmaWVsZF9pZCApe1xyXG4gICAgICAgIGlmICggIWNvbXBvbmVudCB8fFxyXG4gICAgICAgICAgICAgIWNvbXBvbmVudC5ib2R5IFxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnIGZpZWxkcyB3YXMgbm90IHByb3ZpZGVkICcpO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoXHJcbiAgICAgICAgICAgIGNvbXBvbmVudC5ib2R5LmZpbmQoZWwgPT4geyByZXR1cm4gKGVsLm5hbWUgPT09IGZpZWxkX25hbWUgJiZcclxuICAgICAgICAgICAgICAgZWwuX2lkICE9PSBmaWVsZF9pZCApID8gdHJ1ZSA6IGZhbHNlIH0pXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCAgJyBmaWVsZCB3aXRoIHN1Y2ggbmFtZSBleGlzdHMgJyApO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfTtcclxuICAgIFxyXG4qL1xyXG5cclxuICAgIFxyXG5cclxuICAgIC8vIHJldHVybiB1bmlxdWUgaWRcclxuICAgIGNyZWF0ZV9ndWlkKCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIHM0KCkge1xyXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5mbG9vcigoMSArIE1hdGgucmFuZG9tKCkpICogMHgxMDAwMClcclxuICAgICAgICAgICAgICAgIC50b1N0cmluZygxNilcclxuICAgICAgICAgICAgICAgIC5zdWJzdHJpbmcoMSk7XHJcbiAgICAgICAgfVxyXG4gXHQgICAgcmV0dXJuIHM0KCkgKyBzNCgpICsgJy0nICsgczQoKSArICctJyArIHM0KCkgKyAnLScgK1xyXG4gICAgICAgICAgICAgICBzNCgpICsgJy0nICsgczQoKSArIHM0KCkgKyBzNCgpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvLyAgUmV0dXJucyBhIGRlZXAgY29weSBvZiB0aGUgb2JqZWN0XHJcbiAgICBkZWVwQ29weShvbGRPYmo6IGFueSkge1xyXG4gICAgICAgIGxldCBuZXdPYmogPSBvbGRPYmo7XHJcbiAgICAgICAgaWYgKG9sZE9iaiAmJiB0eXBlb2Ygb2xkT2JqID09PSBcIm9iamVjdFwiKSB7XHJcbiAgICAgICAgICAgIG5ld09iaiA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvbGRPYmopID09PSBcIltvYmplY3QgQXJyYXldXCIgPyBbXSA6IHt9O1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpIGluIG9sZE9iaikge1xyXG4gICAgICAgICAgICAgICAgbmV3T2JqW2ldID0gdGhpcy5kZWVwQ29weShvbGRPYmpbaV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZXdPYmo7XHJcbiAgICB9O1xyXG5cclxuXHJcblxyXG5cclxufVxyXG5cclxuXHJcbi8qXHJcblxyXG5cclxubGV0IGN2dF9yX24gPSAoKCkgPT4ge1xyXG5cclxuICB2YXIgbnV0ID0gWzEwMDAsIDkwMCwgNTAwLCA0MDAsIDEwMCwgOTAsIDUwLCA0MCwgMTAsIDksIDUsIDQsIDFdO1xyXG4gIHZhciByb20gPSBbJ00nLCAnQ00nLCAnRCcsICdDRCcsICdDJywgJ1hDJywgJ0wnLCAnWEwnLCAnWCcsICdJWCcsICdWJywgJ0lWJywgJ0knXTtcclxuICB2YXIgYWxsID0ge0k6MSxWOjUsWDoxMCxMOjUwLEM6MTAwLEQ6NTAwLE06MTAwMH07XHJcblxyXG4gIHZhciBjdnRfcl9uX3RvX3JvbWFuID0gKGFyYWJpYykgPT4ge1xyXG4gICAgbGV0IHJlcyA9ICcnOyAgXHJcbiAgICBudXQuZm9yRWFjaCggKGVsLCBpZHgsIGFyciApID0+e1xyXG4gICAgICAgIHdoaWxlICggYXJhYmljID49IG51dFtpZHhdICkge1xyXG4gICAgICAgICAgICByZXMgKz0gcm9tW2lkeF07XHJcbiAgICAgICAgICAgIGFyYWJpYyAtPSBudXRbaWR4XTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgIHJldHVybiByZXM7XHJcbiAgfTtcclxuXHJcbiAgdmFyIGN2dF9yX25fZm9ybV9yb21hbiA9IChyb21hbikgPT4ge1xyXG4gICAgICBsZXQgcmVzID0gMDtcclxuICAgICAgbGV0IGwgPSByb21hbi5sZW5ndGg7XHJcbiAgICAgIHdoaWxlIChsLS0pIHtcclxuICAgICAgICBpZiAoIGFsbFtyb21hbltsXV0gPCBhbGxbcm9tYW5bbCsxXV0gKSB7IFxyXG4gICAgICAgICAgICByZXMgLT0gYWxsW3JvbWFuW2xdXTsgICBcclxuICAgICAgICB9IGVsc2UgeyBcclxuICAgICAgICAgICAgcmVzICs9IGFsbFtyb21hbltsXV0gXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgICByZXR1cm4gcmVzO1xyXG4gIH07XHJcblxyXG4gIHJldHVybiAobnVtKSA9PiB7XHJcbiAgICBpZiAoIHR5cGVvZiBudW0gPT09ICdudW1iZXInKSByZXR1cm4gY3Z0X3Jfbl90b19yb21hbiggbnVtICk7XHJcbiAgICBpZiAoIHR5cGVvZiBudW0gPT09ICdzdHJpbmcnKSByZXR1cm4gY3Z0X3Jfbl9mb3JtX3JvbWFuKCBudW0udG9VcHBlckNhc2UoKSApO1xyXG4gIH07XHJcblxyXG59KSgpO1xyXG5cclxuXHJcbmNvbnNvbGUubG9nKCBjdnRfcl9uKDMwMDMpICk7XHJcbmNvbnNvbGUubG9nKCBjdnRfcl9uKDQ0MykgKTtcclxuY29uc29sZS5sb2coIGN2dF9yX24oNjkpICk7XHJcbmNvbnNvbGUubG9nKCBjdnRfcl9uKDIpICk7XHJcbmNvbnNvbGUubG9nKCBjdnRfcl9uKDk5KSApO1xyXG5jb25zb2xlLmxvZyggY3Z0X3JfbigzNCkgKTtcclxuY29uc29sZS5sb2coIGN2dF9yX24oNDU2KSApO1xyXG5cclxuY29uc29sZS5sb2coJy0tLS0tLS0tLS0tLS0tLS0tLS0nKTtcclxuXHJcbmNvbnNvbGUubG9nKCBjdnRfcl9uKCdNTU1JSUknKSApO1xyXG5jb25zb2xlLmxvZyggY3Z0X3JfbignQ0RYTElJSScpICk7XHJcbmNvbnNvbGUubG9nKCBjdnRfcl9uKCdMWElYJykgKTtcclxuY29uc29sZS5sb2coIGN2dF9yX24oJ0lJJykgKTtcclxuY29uc29sZS5sb2coIGN2dF9yX24oJ1hDSVgnKSApO1xyXG5jb25zb2xlLmxvZyggY3Z0X3JfbignWFhYSVYnKSApO1xyXG5jb25zb2xlLmxvZyggY3Z0X3JfbignQ0RMVkknKSApO1xyXG5cclxuKi8iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=

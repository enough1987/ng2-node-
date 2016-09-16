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
        this.storageService.update('/api/all/components', {
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
        console.log(this.new_component.name, ' ', this.new_component.group, ' ', body);
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
            pipes: [objectToArray_pipe_1.ObjectToArrayPipe]
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvYXBwLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEscUJBQTBCLGVBQWUsQ0FBQyxDQUFBO0FBRTFDLGdDQUE2Qiw2QkFBNkIsQ0FBQyxDQUFBO0FBQzNELG1DQUFnQyw2QkFBNkIsQ0FBQyxDQUFBO0FBVTlEO0lBUUkscUNBQXFDO0lBRXJDLHNCQUFtQixjQUE4QjtRQUE5QixtQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7UUFUakQsbURBQW1EO1FBQzVDLGVBQVUsR0FBRyxFQUFFLENBQUM7UUFDdkIsaUNBQWlDO1FBQzFCLGNBQVMsR0FBRyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsQ0FBQztRQUN0Qyx3QkFBd0I7UUFDakIsNEJBQXVCLEdBQUcsS0FBSyxDQUFDO1FBQ2hDLGtCQUFhLEdBQUcsRUFBRSxDQUFDO0lBRzBCLENBQUM7SUFFckQsK0JBQVEsR0FBUjtRQUNJLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDeEIsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7SUFDOUIsQ0FBQzs7SUFFRCx5Q0FBa0IsR0FBbEI7UUFBQSxpQkFNQztRQUxHLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFFO1lBQzFDLFNBQVMsQ0FBRSxVQUFBLEdBQUc7WUFDVixPQUFPLENBQUMsR0FBRyxDQUFFLFFBQVEsRUFBRyxHQUFHLENBQUUsQ0FBQztZQUM5QixFQUFFLENBQUEsQ0FBRSxDQUFDLEdBQUcsQ0FBQyxLQUFNLENBQUM7Z0JBQUMsS0FBSSxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDO1FBQ3RELENBQUMsQ0FBQyxDQUFDO0lBQ1gsQ0FBQzs7SUFFRCx1Q0FBZ0IsR0FBaEIsVUFBa0IsSUFBSTtRQUNsQixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztJQUM3QixDQUFDOztJQUNELGtEQUEyQixHQUEzQixVQUE2QixJQUFJ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QyxzQ0FBaUIsQ0FBQztTQUM3QixDQUFDOztvQkFBQTtJQXNsQkYsbUJBQUM7QUFBRCxDQXJsQkEsQUFxbEJDLElBQUE7QUFybEJZLG9CQUFZLGVBcWxCeEIsQ0FBQTtBQUdEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUE0REUiLCJmaWxlIjoiY29tcG9uZW50cy9hcHAuY29tcG9uZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5pbXBvcnQge1N0b3JhZ2VTZXJ2aWNlfSBmcm9tIFwiLi4vc2VydmljZXMvc3RvcmFnZS5zZXJ2aWNlXCI7XHJcbmltcG9ydCB7T2JqZWN0VG9BcnJheVBpcGV9IGZyb20gXCIuLi9waXBlcy9vYmplY3RUb0FycmF5LnBpcGVcIjtcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gICAgbW9kdWxlSWQ6IG1vZHVsZS5pZCwgXHJcbiAgICBzZWxlY3RvcjogJ215LWFwcCcsXHJcbiAgICB0ZW1wbGF0ZVVybDogJ2FwcC50ZW1wbGF0ZS5odG1sJyxcclxuICAgIHN0eWxlVXJsczogWydhcHAuc3R5bGUuY3NzJ10sXHJcbiAgICBwcm92aWRlcnM6IFtTdG9yYWdlU2VydmljZV0sXHJcbiAgICBwaXBlczogW09iamVjdFRvQXJyYXlQaXBlXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgQXBwQ29tcG9uZW50IHtcclxuICAgIC8vcHVibGljIG5ld19jb21wb25lbnQgPSB0aGlzLmluaXRfbmV3X2NvbXBvbmVudCgpO1xyXG4gICAgcHVibGljIGNvbXBvbmVudHMgPSBbXTtcclxuICAgIC8vcHVibGljIGNvbXBvbmVudF9lZGl0YWJsZSA9IFtdO1xyXG4gICAgcHVibGljIG5ld19maWVsZCA9IHsgdHlwZTogXCJzdHJpbmdcIiB9OyAgIFxyXG4gICAgLy9wdWJsaWMgbmV3X2dyb3VwID0gW107XHJcbiAgICBwdWJsaWMgY29tcG9uZW50c19jdXJyZW50X3ZpZXcgPSAnYWxsJztcclxuICAgIHB1YmxpYyBuZXdfY29tcG9uZW50ID0gW107XHJcbiAgICAvL3B1YmxpYyBjcmVhdGVfY29tcG9uZW50X2dyb3VwID0gJyc7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHVibGljIHN0b3JhZ2VTZXJ2aWNlOiBTdG9yYWdlU2VydmljZSkge31cclxuXHJcbiAgICBuZ09uSW5pdCgpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnbmdPbkluaXQnKTtcclxuICAgICAgICB0aGlzLmdldF9hbGxfY29tcG9uZW50cygpO1xyXG4gICAgfTtcclxuXHJcbiAgICBnZXRfYWxsX2NvbXBvbmVudHMoKSB7XHJcbiAgICAgICAgdGhpcy5zdG9yYWdlU2VydmljZS5zZWxlY3QoJy9hcGkvY29tcG9uZW50cycgKS5cclxuICAgICAgICAgICAgc3Vic2NyaWJlKCByZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coICdnZXQgLSAnICwgcmVzICk7XHJcbiAgICAgICAgICAgICAgICBpZiggIXJlcy5lcnJvciApIHRoaXMuY29tcG9uZW50cyA9IHJlcy5jb21wb25lbnRzO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgc2V0X2N1cnJlbnRfdmlldyggdmlldyApe1xyXG4gICAgICAgIHRoaXMuY3VycmVudF92aWV3ID0gdmlldztcclxuICAgIH07XHJcbiAgICBzZXRfY29tcG9uZW50c19jdXJyZW50X3ZpZXcoIHZpZXcgKSB7XHJcbiAgICAgICAgaWYgKCB2aWV3ID09ICdhbGwnKSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ3JvdXBfc2VsZWN0JykudmFsdWUgPSAnbm9uZSc7XHJcbiAgICAgICAgdGhpcy5jb21wb25lbnRzX2N1cnJlbnRfdmlldyA9IHZpZXc7XHJcbiAgICAgICAgY29uc29sZS5sb2coICcgY29tcG9uZW50c19jdXJyZW50X3ZpZXcgJywgdGhpcy5jb21wb25lbnRzX2N1cnJlbnRfdmlldyApOyAgICAgICBcclxuICAgIH07XHJcblxyXG4gICAgc2V0X25ld19jb21wb25lbnRfZ3JvdXBfc2VsZWN0KCB2YWx1ZSApIHtcclxuICAgICAgICB0aGlzLm5ld19jb21wb25lbnQuZ3JvdXAgPSB2YWx1ZTtcclxuICAgIH07XHJcblxyXG4gICAgY2hhbmdlX25ld19jb21wb25lbnRfZ3JvdXAoKSB7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyggJ2tleXVwIHZhbCAnLCB0aGlzLmNyZWF0ZV9jb21wb25lbnRfZ3JvdXAgKTtcclxuICAgICAgICBsZXQgcmVzID0gWzEsMiwzLDRdLmZpbmQoIGVsID0+IGVsID09IHRoaXMubmV3X2NvbXBvbmVudC5ncm91cCkgfHwgJ25vbmUnIDtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmV3X2NvbXBvbmVudF9ncm91cF9zZWxlY3QnKS52YWx1ZSA9IHJlcztcclxuICAgICAgICBjb25zb2xlLmxvZyggJ25ld19jb21wb25lbnRfZ3JvdXBfc2VsZWN0ICcsIHJlcyApOyBcclxuICAgIH07XHJcblxyXG4gICAgY2hvb3Nlbl9tZW51KCBhLCBiICl7XHJcbiAgICAgICAgaWYgKCBhID09IGIgKSByZXR1cm4gdHJ1ZTtcclxuICAgIH07XHJcblxyXG4gICAgc2V0X2Vycm9yX21zZyggZXJyb3JfbXNnICl7XHJcbiAgICAgICAgdGhpcy5lcnJvcl9tc2cgPSBlcnJvcl9tc2c7XHJcbiAgICAgICAgc2V0VGltZW91dCggKCk9PiB0aGlzLmVycm9yX21zZyA9ICcnLCAzMDAwICk7XHJcbiAgICB9O1xyXG5cclxuICAgIGlzX2NvbXBvbmVudF9leGlzdChuYW1lKXtcclxuICAgICAgICBsZXQgcmVzID0gdGhpcy5jb21wb25lbnRzLmZpbmQoIGNvbXAgPT4gY29tcC5uYW1lID09IG5hbWUpO1xyXG4gICAgICAgIC8vY29uc29sZS5sb2cocmVzKTtcclxuICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgfTtcclxuXHJcbiAgICBzZXRfZWRpdF9jb21wb25lbnQoIGVkaXRfY29tcCApIHtcclxuICAgICAgICB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZSA9IGVkaXRfY29tcDtcclxuICAgICAgICB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZS5uZXdfbmFtZSA9IHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLm5hbWU7XHJcbiAgICB9O1xyXG5cclxuICAgIHNldF9uZXdfZmllbGRfdHlwZSggdmFsdWUgKSB7XHJcbiAgICAgICAgdGhpcy5uZXdfZmllbGQudHlwZSA9IHZhbHVlO1xyXG4gICAgfTtcclxuXHJcbiAgICBzaG93X2lmX3R5cGVfZmllbGRfZXhpc3QoIHR5cGUgKSB7XHJcbiAgICAgICAgIHJldHVybiB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZS5ib2R5LmZpbmQoIGZpZWxkID0+IGZpZWxkLnR5cGUgPT0gdHlwZSApO1xyXG4gICAgfTtcclxuXHJcbiAgICBpc19maWVsZF9leGlzdChuYW1lKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb21wb25lbnRfZWRpdGFibGUuYm9keS5maW5kKCBmaWVsZCA9PiBmaWVsZC5uYW1lID09IG5hbWUgKTtcclxuICAgIH07ICBcclxuXHJcbiAgICBhbGxfY29tcG9uZW50c19uYW1lICgpe1xyXG4gICAgICAgIGxldCBjb21wX25hbWVzID0gW107XHJcbiAgICAgICAgdGhpcy5jb21wb25lbnRzLmZvckVhY2goZnVuY3Rpb24oZWwpe1xyXG4gICAgICAgICAgICBjb21wX25hbWVzID0gWy4uLmNvbXBfbmFtZXMsIGVsLm5hbWUgXTtcclxuICAgICAgICB9KTtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKCBjb21wX25hbWVzICk7XHJcbiAgICAgICAgcmV0dXJuIGNvbXBfbmFtZXM7IFxyXG4gICAgfTtcclxuXHJcbiAgICBhZGRfbmV3X2ZpZWxkKCkge1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coIHRoaXMubmV3X2ZpZWxkLCAgdGhpcy5jb21wb25lbnRfZWRpdGFibGUgKTtcclxuXHJcbiAgICAgICAgaWYgKCAhdGhpcy5uZXdfZmllbGQubmFtZSApIHtcclxuICAgICAgICAgICAgdGhpcy5zZXRfZXJyb3JfbXNnKCAnTm8gZmllbGQgbmFtZSB3YXMgcHJvdmlkZWQgJyApOyBcclxuICAgICAgICAgICAgY29uc29sZS5sb2coICdObyBuYW1lIHdhcyBwcm92aWRlZCAnICk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCB0aGlzLmlzX2ZpZWxkX2V4aXN0KHRoaXMubmV3X2ZpZWxkLm5hbWUpICkge1xyXG4gICAgICAgICAgICB0aGlzLnNldF9lcnJvcl9tc2coICdPbmUgZmllbGQgaGFzIHRoaXMgbmFtZSAnICk7IFxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyggJ09uZSBmaWxlZCBoYXMgdGhpcyBuYW1lJyApO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7ICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLm5ld19maWVsZC5faWQgPSB0aGlzLmNyZWF0ZV9ndWlkKCk7ICBcclxuICAgICAgICAvL2RvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduZXctZmllbGQtaWQnKS52YWx1ZSA9IHRoaXMubmV3X2ZpZWxkLnR5cGU7XHJcbiAgICAgICAgdGhpcy5jb21wb25lbnRfZWRpdGFibGUuYm9keSA9IFsuLi50aGlzLmNvbXBvbmVudF9lZGl0YWJsZS5ib2R5LCB0aGlzLm5ld19maWVsZF07XHJcblxyXG4gICAgICAgIGlmICggdGhpcy5jb21wb25lbnRfZWRpdGFibGUuZ3JvdXAgIT0gJ25vbmUnKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFkZF9uZXdfZmllbGRfdG9fZ3JvdXAoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMubmV3X2ZpZWxkID0geyB0eXBlOiB0aGlzLm5ld19maWVsZC50eXBlIH07XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMubmV3X2ZpZWxkID0geyB0eXBlOiB0aGlzLm5ld19maWVsZC50eXBlIH07XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyggIHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLmJvZHkgKTtcclxuICAgICAgICB0aGlzLnN0b3JhZ2VTZXJ2aWNlLnVwZGF0ZSgnL2FwaS9jb21wb25lbnRzJyx7XHJcbiAgICAgICAgICAgIGlkIDogdGhpcy5jb21wb25lbnRfZWRpdGFibGUuX2lkLFxyXG4gICAgICAgICAgICBuYW1lIDogdGhpcy5jb21wb25lbnRfZWRpdGFibGUubmFtZSxcclxuICAgICAgICAgICAgZ3JvdXAgOiB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZS5ncm91cCxcclxuICAgICAgICAgICAgYm9keSA6IHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLmJvZHlcclxuICAgICAgICB9KS5cclxuICAgICAgICAgICAgc3Vic2NyaWJlKCByZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coICdwdXQgLSAnICwgcmVzICk7XHJcbiAgICAgICAgICAgICAgICBpZiAoICFyZXMuZXJyb3IgKSB0aGlzLmNvbXBvbmVudHMgPSByZXMuY29tcG9uZW50cztcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCAnIGIgJywgdGhpcy5jb21wb25lbnRfZWRpdGFibGUuYm9keSApO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBhZGRfbmV3X2ZpZWxkX3RvX2dyb3VwKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdG9yYWdlU2VydmljZS51cGRhdGUoJy9hcGkvYWxsL2NvbXBvbmVudHMnLHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXAgOiB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZS5ncm91cCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmllbGQgOiB0aGlzLm5ld19maWVsZFxyXG4gICAgICAgICAgICAgICAgfSkuXHJcbiAgICAgICAgICAgICAgICBzdWJzY3JpYmUoIHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCAnYWxsIHB1dCAtICcgLCByZXMgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCAhcmVzLmVycm9yICkgdGhpcy5jb21wb25lbnRzID0gcmVzLmNvbXBvbmVudHM7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgZGVsZXRlX2ZpZWxkKCBpZCApe1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coIHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLmJvZHkgKTtcclxuICAgICAgICB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZS5ib2R5LmZvckVhY2goIChlbCwgaWR4LCBhcnIpID0+IHsgXHJcbiAgICAgICAgICAgIGlmKGVsLl9pZCA9PT0gaWQgKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZS5ib2R5LnNwbGljZShpZHgsIDEpO1xyXG4gICAgICAgICAgICB9IFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vY29uc29sZS5sb2coIHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLmJvZHkgKSA7ICAgICAgXHJcbiAgICAgICAgdGhpcy5zdG9yYWdlU2VydmljZS51cGRhdGUoJy9hcGkvY29tcG9uZW50cycse1xyXG4gICAgICAgICAgICBpZCA6IHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLl9pZCxcclxuICAgICAgICAgICAgbmFtZSA6IHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLm5hbWUsXHJcbiAgICAgICAgICAgIGdyb3VwIDogdGhpcy5jb21wb25lbnRfZWRpdGFibGUuZ3JvdXAsXHJcbiAgICAgICAgICAgIGJvZHkgOiB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZS5ib2R5XHJcbiAgICAgICAgfSkuXHJcbiAgICAgICAgICAgIHN1YnNjcmliZSggcmVzID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCAncHV0IC0gJyAsIHJlcyApO1xyXG4gICAgICAgICAgICAgICAgaWYgKCAhcmVzLmVycm9yICkgdGhpcy5jb21wb25lbnRzID0gcmVzLmNvbXBvbmVudHM7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfTtcclxuXHJcblxyXG5cclxuICAgIHNldF9jb21wb25lbnRfZmllbGRfdmFsdWUoIGZpZWxkLCBuYW1lICl7XHJcbiAgICAgICAgbGV0IGNvbXAgPSB0aGlzLmNvbXBvbmVudHMuZmluZCggY29tcCA9PiBjb21wLm5hbWUgPT09IG5hbWUgJiYgdGhpcy5jb21wb25lbnRfZWRpdGFibGUubmFtZSAhPT0gbmFtZSApO1xyXG4gICAgICAgIGZpZWxkLnZhbHVlID0gY29tcDtcclxuICAgIH07XHJcblxyXG4gICAgc2hvd19qc29uX29mX2VkaXRfY29tcG9uZW50KCl7XHJcbiAgICAgICAgdGhpcy5qc29uX29mX2VkaXRfY29tcG9uZW50X2lzX3Zpc2libGUgPSAhdGhpcy5qc29uX29mX2VkaXRfY29tcG9uZW50X2lzX3Zpc2libGU7XHJcbiAgICB9O1xyXG5cclxuICAgIFxyXG5cclxuICAgIGNyZWF0ZV9jb21wb25lbnQoKXtcclxuICAgICAgICBpZiAoICEgdGhpcy5uZXdfY29tcG9uZW50Lm5hbWUgKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0X2Vycm9yX21zZyggJyBObyBuYW1lIHdhcyBwcm92aWRlZCAnICk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCAnTm8gbmFtZSB3YXMgcHJvdmlkZWQgJyApO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICggdGhpcy5pc19jb21wb25lbnRfZXhpc3QodGhpcy5uZXdfY29tcG9uZW50Lm5hbWUpICkge1xyXG4gICAgICAgICAgICB0aGlzLnNldF9lcnJvcl9tc2coICdPbmUgY29tcG9uZW50IGhhcyB0aGlzIG5hbWUgJyApOyBcclxuICAgICAgICAgICAgY29uc29sZS5sb2coICdPbmUgY29tcG9uZW50IGhhcyB0aGlzIG5hbWUnICk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTsgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCAhIHRoaXMubmV3X2NvbXBvbmVudC5ncm91cCApIHRoaXMubmV3X2NvbXBvbmVudC5ncm91cCA9ICdub25lJyA7XHJcbiAgICAgICAgbGV0IGJvZHkgPSBbXTtcclxuICAgICAgICBpZiAoIHRoaXMubmV3X2NvbXBvbmVudC5ncm91cCAhPT0gJ25vbmUnICl7XHJcbiAgICAgICAgICAgIGxldCByZXMgPSB0aGlzLmNvbXBvbmVudHMuZmluZCggY29tcCA9PiBjb21wLmdyb3VwID09IHRoaXMubmV3X2NvbXBvbmVudC5ncm91cCk7XHJcbiAgICAgICAgICAgIGlmICggcmVzICkgYm9keSA9IHJlcy5ib2R5IDtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc29sZS5sb2coXHJcbiAgICAgICAgICAgIHRoaXMubmV3X2NvbXBvbmVudC5uYW1lLFxyXG4gICAgICAgICAgICAnICcsXHJcbiAgICAgICAgICAgIHRoaXMubmV3X2NvbXBvbmVudC5ncm91cCxcclxuICAgICAgICAgICAgJyAnLFxyXG4gICAgICAgICAgICBib2R5XHJcbiAgICAgICAgKTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMuc3RvcmFnZVNlcnZpY2UuaW5zZXJ0KCcvYXBpL2NvbXBvbmVudHMnLCB7XHJcbiAgICAgICAgICAgIG5hbWUgOiB0aGlzLm5ld19jb21wb25lbnQubmFtZSxcclxuICAgICAgICAgICAgZ3JvdXAgOiB0aGlzLm5ld19jb21wb25lbnQuZ3JvdXAgfHwgJ25vbmUnLFxyXG4gICAgICAgICAgICBib2R5IDogW11cclxuICAgICAgICAgfSkuXHJcbiAgICAgICAgICAgIHN1YnNjcmliZSggcmVzID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCAncG9zdCAtICcgLCByZXMgKTtcclxuICAgICAgICAgICAgICAgIGlmICggIXJlcy5lcnJvciApIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbXBvbmVudHMgPSByZXMuY29tcG9uZW50cztcclxuICAgICAgICAgICAgICAgICAgICBsZXQgZWRpdF9jb21wID0gdGhpcy5jb21wb25lbnRzLmZpbmQoIGNvbXAgPT4gY29tcC5uYW1lID09IHRoaXMubmV3X2NvbXBvbmVudC5uYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIGVkaXRfY29tcCApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRfY29tcG9uZW50c19jdXJyZW50X3ZpZXcoJ2VkaXQtY29tcG9uZW50Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0X2VkaXRfY29tcG9uZW50KCBlZGl0X2NvbXAgKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGNoYW5nZV9jb21wb25lbnQoY29tcG9uZW50KXtcclxuXHJcbiAgICAgICAgaWYgKCAgdGhpcy5jb21wb25lbnRfZWRpdGFibGUubmV3X25hbWUgIT0gdGhpcy5jb21wb25lbnRfZWRpdGFibGUubmFtZSAmJiBcclxuICAgICAgICAgICAgICB0aGlzLmlzX2NvbXBvbmVudF9leGlzdCh0aGlzLmNvbXBvbmVudF9lZGl0YWJsZS5uZXdfbmFtZSkgKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0X2Vycm9yX21zZyggJ09uZSBjb21wb25lbnQgaGFzIHRoaXMgbmFtZSAnICk7IFxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyggJ09uZSBjb21wb25lbnQgaGFzIHRoaXMgbmFtZScgKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlOyAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKCB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZS5uZXdfbmFtZSAhPSB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZS5uYW1lICkge1xyXG4gICAgICAgICAgICB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZS5uYW1lID0gdGhpcy5jb21wb25lbnRfZWRpdGFibGUubmV3X25hbWU7IFxyXG4gICAgICAgIH0gICBcclxuICAgICAgICB0aGlzLnN0b3JhZ2VTZXJ2aWNlLnVwZGF0ZSgnL2FwaS9jb21wb25lbnRzJyx7XHJcbiAgICAgICAgICAgIGlkIDogdGhpcy5jb21wb25lbnRfZWRpdGFibGUuX2lkLFxyXG4gICAgICAgICAgICBuYW1lIDogdGhpcy5jb21wb25lbnRfZWRpdGFibGUubmFtZSxcclxuICAgICAgICAgICAgZ3JvdXAgOiB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZS5ncm91cCxcclxuICAgICAgICAgICAgYm9keSA6IHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLmJvZHlcclxuICAgICAgICB9KS5cclxuICAgICAgICAgICAgc3Vic2NyaWJlKCByZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coICdwdXQgLSAnICwgcmVzICk7XHJcbiAgICAgICAgICAgICAgICBpZiAoICFyZXMuZXJyb3IgKSB0aGlzLmNvbXBvbmVudHMgPSByZXMuY29tcG9uZW50cztcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgY29weV9jb21wb25lbnQoKSB7XHJcbiAgICAgICAgaWYgKCAhdGhpcy5jb21wb25lbnRfZWRpdGFibGUubmV3X25hbWUgfHxcclxuICAgICAgICAgICAgICB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZS5uYW1lID09IHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLm5ld19uYW1lICkge1xyXG4gICAgICAgICAgICB0aGlzLnNldF9lcnJvcl9tc2coICdObyBuZXcgbmFtZSB3YXMgcHJvdmlkZWQgJyApOyBcclxuICAgICAgICAgICAgY29uc29sZS5sb2coICdObyBuZXcgbmFtZSB3YXMgcHJvdmlkZWQgJyApO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7ICAgIFxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiggdGhpcy5pc19jb21wb25lbnRfZXhpc3QodGhpcy5jb21wb25lbnRfZWRpdGFibGUubmV3X25hbWUpXHJcbiAgICAgICAgICAgICl7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0X2Vycm9yX21zZyggJ09uZSBjb21wb25lbnQgaGFzIHRoaXMgbmFtZSAnICk7IFxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyggJ09uZSBjb21wb25lbnQgaGFzIHRoaXMgbmFtZScgKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnN0b3JhZ2VTZXJ2aWNlLmluc2VydCgnL2FwaS9jb21wb25lbnRzJywge1xyXG4gICAgICAgICAgICBpZCA6IHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLl9pZCxcclxuICAgICAgICAgICAgbmFtZSA6IHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLm5ld19uYW1lLFxyXG4gICAgICAgICAgICBncm91cCA6IHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLmdyb3VwLFxyXG4gICAgICAgICAgICBib2R5IDogdGhpcy5jb21wb25lbnRfZWRpdGFibGUuYm9keVxyXG4gICAgICAgICB9KS5cclxuICAgICAgICAgICAgc3Vic2NyaWJlKCByZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coICdwb3N0IC0gJyAsIHJlcyApO1xyXG4gICAgICAgICAgICAgICAgaWYgKCAhcmVzLmVycm9yICkgdGhpcy5jb21wb25lbnRzID0gcmVzLmNvbXBvbmVudHM7XHJcbiAgICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBcclxuICAgIGRlbGV0ZV9jb21wb25lbnQoKSB7XHJcbiAgICAgICAgdGhpcy5zdG9yYWdlU2VydmljZS5kZWxldGUoJy9hcGkvY29tcG9uZW50cycsIHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLl9pZCkuXHJcbiAgICAgICAgICAgIHN1YnNjcmliZSggcmVzID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCAnZGVsZXRlIC0gJyAsIHJlcyApO1xyXG4gICAgICAgICAgICAgICAgaWYgKCAhcmVzLmVycm9yICkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29tcG9uZW50cyA9IHJlcy5jb21wb25lbnRzO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0X2NvbXBvbmVudHNfY3VycmVudF92aWV3KCAnYWxsJyApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4vKlxyXG5cclxuICAgIGluaXRfbmV3X2NvbXBvbmVudChtdXRhYmlsaXR5ID0gJycpe1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIG11dGFiaWxpdHkgOiBtdXRhYmlsaXR5XHJcbiAgICAgICAgfTtcclxuICAgIH07XHJcblxyXG4gICAgc2V0X25ld19jb21wb25lbnRfbXV0YWJpbGl0eShtdXRhYmlsaXR5KXtcclxuICAgICAgICB0aGlzLm5ld19jb21wb25lbnQgPSAgdGhpcy5pbml0X25ld19jb21wb25lbnQoIG11dGFiaWxpdHkgKTtcclxuICAgIH07XHJcblxyXG5cclxuICAgIGdldF9hbGxfY29tcG9uZW50cygpIHtcclxuICAgICAgICB0aGlzLnN0b3JhZ2VTZXJ2aWNlLnNlbGVjdCgnL2FwaS9jb21wb25lbnRzJyApLlxyXG4gICAgICAgICAgICBzdWJzY3JpYmUoIHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggJ2dldCAtICcgLCByZXMgKTtcclxuICAgICAgICAgICAgICAgIGlmKCAhcmVzLmVycm9yICkgdGhpcy5jb21wb25lbnRzID0gcmVzLmNvbXBvbmVudHM7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBjcmVhdGVfY29tcG9uZW50KCl7XHJcbiAgICAgICAgY29uc29sZS5sb2coIHRoaXMuY29tcG9uZW50cyApO1xyXG4gICAgICAgIGlmICggIXRoaXMubmV3X2NvbXBvbmVudC5uYW1lICkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyggJyBubyBuYW1lIHdhcyBwcm92aWRlZCAnKTtcclxuICAgICAgICAgICAgcmV0dXJuIDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCB0aGlzLmV4aXN0X2NvbXBvbmVudF93aGl0aF90aGlzX25hbWUoKSApIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coICcgY29tcG9uZW50IHdpdGggc3VjaCBuYW1lIGV4aXN0cyAnICk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zdG9yYWdlU2VydmljZS5pbnNlcnQoJy9hcGkvY29tcG9uZW50cycsIHtcclxuICAgICAgICAgICAgbmFtZSA6IHRoaXMubmV3X2NvbXBvbmVudC5uYW1lLFxyXG4gICAgICAgICAgICBncm91cCA6IHRoaXMubmV3X2NvbXBvbmVudC5ncm91cCB8fCAnJyxcclxuICAgICAgICAgICAgbXV0YWJpbGl0eSA6IHRoaXMubmV3X2NvbXBvbmVudC5tdXRhYmlsaXR5LFxyXG4gICAgICAgICAgICBib2R5IDogW11cclxuICAgICAgICAgfSkuXHJcbiAgICAgICAgICAgIHN1YnNjcmliZSggcmVzID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCAncG9zdCAtICcgLCByZXMgKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCByZXMubXNnICk7XHJcbiAgICAgICAgICAgICAgICBpZiAoICFyZXMuZXJyb3IgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb21wb25lbnRzID0gcmVzLmNvbXBvbmVudHM7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXdfY29tcG9uZW50ID0gdGhpcy5pbml0X25ld19jb21wb25lbnQodGhpcy5uZXdfY29tcG9uZW50Lm11dGFiaWxpdHkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgY2hhbmdlX2NvbXBvbmVudChjb21wb25lbnQpe1xyXG4gICAgICAgIGlmICggIWNvbXBvbmVudC5uZXdfbmFtZSApIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ25vIG5hbWUgd2FzIHByb3ZpZGVkICcpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKCB0aGlzLmV4aXN0X2NvbXBvbmVudF93aGl0aF90aGlzX25hbWUoY29tcG9uZW50Lm5ld19uYW1lKSApe1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyggJyBjb21wb25lbnQgd2l0aCBzdWNoIG5hbWUgZXhpc3RzICcgKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnN0b3JhZ2VTZXJ2aWNlLnVwZGF0ZSgnL2FwaS9jb21wb25lbnRzJyx7XHJcbiAgICAgICAgICAgIGlkIDogY29tcG9uZW50Ll9pZCxcclxuICAgICAgICAgICAgbmFtZSA6IGNvbXBvbmVudC5uZXdfbmFtZSxcclxuICAgICAgICAgICAgZ3JvdXAgOiBjb21wb25lbnQuZ3JvdXAsXHJcbiAgICAgICAgICAgIG11dGFiaWxpdHkgOiB0aGlzLm5ld19jb21wb25lbnQubXV0YWJpbGl0eSxcclxuICAgICAgICAgICAgYm9keSA6IGNvbXBvbmVudC5ib2R5XHJcbiAgICAgICAgfSkuXHJcbiAgICAgICAgICAgIHN1YnNjcmliZSggcmVzID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCAncHV0IC0gJyAsIHJlcyApO1xyXG4gICAgICAgICAgICAgICAgaWYgKCAhcmVzLmVycm9yICkgdGhpcy5jb21wb25lbnRzID0gcmVzLmNvbXBvbmVudHM7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGNvcHlfY29tcG9uZW50KGNvbXBvbmVudCkge1xyXG4gICAgICAgIGlmICggIWNvbXBvbmVudC5uZXdfbmFtZSApIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coICdubyBuYW1lIHdhcyBwcm92aWRlZCAnICk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoIHRoaXMuZXhpc3RfY29tcG9uZW50X3doaXRoX3RoaXNfbmFtZShjb21wb25lbnQubmV3X25hbWUpICl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCAnIGNvbXBvbmVudCB3aXRoIHN1Y2ggbmFtZSBleGlzdHMgJyApO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc3RvcmFnZVNlcnZpY2UuaW5zZXJ0KCcvYXBpL2NvbXBvbmVudHMnLCB7XHJcbiAgICAgICAgICAgIG5hbWUgOiBjb21wb25lbnQubmV3X25hbWUsXHJcbiAgICAgICAgICAgIGdyb3VwIDogY29tcG9uZW50Lmdyb3VwLFxyXG4gICAgICAgICAgICBtdXRhYmlsaXR5IDogY29tcG9uZW50Lm11dGFiaWxpdHksXHJcbiAgICAgICAgICAgIGJvZHkgOiBjb21wb25lbnQuYm9keVxyXG4gICAgICAgICB9KS5cclxuICAgICAgICAgICAgc3Vic2NyaWJlKCByZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coICdwb3N0IC0gJyAsIHJlcyApO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coIHJlcy5tc2cgKTtcclxuICAgICAgICAgICAgICAgIGlmICggIXJlcy5lcnJvciApIHRoaXMuY29tcG9uZW50cyA9IHJlcy5jb21wb25lbnRzO1xyXG4gICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgZGVsZXRlX2NvbXBvbmVudChpZCkge1xyXG4gICAgICAgIGlmICggIWlkICkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnbm8gaWQgd2FzIHByb3ZpZGVkICcpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc3RvcmFnZVNlcnZpY2UuZGVsZXRlKCcvYXBpL2NvbXBvbmVudHMnLCBpZCkuXHJcbiAgICAgICAgICAgIHN1YnNjcmliZSggcmVzID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCAnZGVsZXRlIC0gJyAsIHJlcyApO1xyXG4gICAgICAgICAgICAgICAgaWYgKCAhcmVzLmVycm9yICkgdGhpcy5jb21wb25lbnRzID0gcmVzLmNvbXBvbmVudHM7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBleGlzdF9jb21wb25lbnRfd2hpdGhfdGhpc19uYW1lKG5hbWUgPSB0aGlzLm5ld19jb21wb25lbnQubmFtZSl7XHJcbiAgICAgICAgaWYoXHJcbiAgICAgICAgICAgIHRoaXMuY29tcG9uZW50cy5maW5kKGVsID0+IHsgcmV0dXJuIGVsLm5hbWUgPT09IG5hbWUgPyB0cnVlIDogZmFsc2UgfSlcclxuICAgICAgICAgICAgKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9O1xyXG5cclxuICAgIGVkaXRfZmllbGRzX2NvbXBvbmVudChjb21wb25lbnQpe1xyXG4gICAgICAgIHRoaXMubmV3X2ZpZWxkID0geyB0eXBlOiBcInN0cmluZ1wiIH07IFxyXG4gICAgICAgIGNvbnNvbGUubG9nKCB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZSwgY29tcG9uZW50ICk7XHJcbiAgICAgICAgaWYgKCB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZS5faWQgIT0gY29tcG9uZW50Ll9pZCkgIHsgXHJcbiAgICAgICAgICAgIHRoaXMuY29tcG9uZW50X2VkaXRhYmxlID0gY29tcG9uZW50O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29tcG9uZW50X2VkaXRhYmxlID0gW107XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgc2hvd19maWVsZHNfY29tcG9uZW50KGNvbXBvbmVudCl7XHJcbiAgICAgICAgaWYgKCAgdGhpcy5jb21wb25lbnRfZWRpdGFibGUgJiZcclxuICAgICAgICAgICAgICB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZS5faWQgPT09IGNvbXBvbmVudC5faWQgXHJcbiAgICAgICAgKSByZXR1cm4gdHJ1ZTtcclxuICAgIH07IFxyXG5cclxuICAgIGFkZF9maWVsZCggY29tcG9uZW50LCBuZXdfZmllbGQgPSB7fSApe1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coIGNvbXBvbmVudCwgbmV3X2ZpZWxkICk7XHJcbiAgICAgICAgaWYgKCAhbmV3X2ZpZWxkLm5hbWUgKSByZXR1cm47XHJcbiAgICAgICAgaWYgKCB0aGlzLmV4aXN0X2ZpZWxkX3dpdGhfdGhpc19uYW1lKGNvbXBvbmVudCwgbmV3X2ZpZWxkLm5hbWUpICkgcmV0dXJuIDtcclxuICAgICAgICB0aGlzLm5ld19maWVsZCA9IHsgdHlwZTogXCJzdHJpbmdcIiB9OyBcclxuICAgICAgICBuZXdfZmllbGQuX2lkID0gdGhpcy5jcmVhdGVfZ3VpZCgpOyAgICAgICAgXHJcbiAgICAgICAgY29tcG9uZW50LmJvZHkgPSBbIC4uLiBjb21wb25lbnQuYm9keSAsIG5ld19maWVsZCBdO1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coIGNvbXBvbmVudC5ib2R5ICk7XHJcbiAgICAgICAgdGhpcy5zdG9yYWdlU2VydmljZS51cGRhdGUoJy9hcGkvY29tcG9uZW50cycse1xyXG4gICAgICAgICAgICBpZCA6IGNvbXBvbmVudC5faWQsXHJcbiAgICAgICAgICAgIG5hbWUgOiBjb21wb25lbnQubmFtZSxcclxuICAgICAgICAgICAgZ3JvdXAgOiBjb21wb25lbnQuZ3JvdXAsXHJcbiAgICAgICAgICAgIG11dGFiaWxpdHkgOiBjb21wb25lbnQubXV0YWJpbGl0eSxcclxuICAgICAgICAgICAgYm9keSA6IGNvbXBvbmVudC5ib2R5XHJcbiAgICAgICAgfSkuXHJcbiAgICAgICAgICAgIHN1YnNjcmliZSggcmVzID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCAncHV0IC0gJyAsIHJlcyApO1xyXG4gICAgICAgICAgICAgICAgaWYgKCAhcmVzLmVycm9yICkgdGhpcy5jb21wb25lbnRzID0gcmVzLmNvbXBvbmVudHM7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBpZl9udW1iZXJfZmllbGQodmFsKXtcclxuICAgICAgICB2YWwgPSBOdW1iZXIodmFsKTtcclxuICAgICAgICByZXR1cm4gdmFsID8gdmFsIDogMCA7XHJcbiAgICB9O1xyXG5cclxuICAgIGlmX2NvbXBvbmVudF9maWVsZChjb21wb25lbnQsIHZhbCl7XHJcbiAgICAgICAgbGV0IHJlcyA9IFtdO1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coY29tcG9uZW50LCB2YWwpO1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50cy5maW5kKGVsID0+IHsgXHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coIGVsLm5hbWUgKTtcclxuICAgICAgICAgICAgaWYgKCBlbC5uYW1lID09PSB2YWwgJiZcclxuICAgICAgICAgICAgICAgY29tcG9uZW50Lm5hbWUgIT09IHZhbCApIHtcclxuICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coICdyZXMgJywgZWwgKTtcclxuICAgICAgICAgICAgICAgICAgIHJlcyA9ICBlbDtcclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCAnIC8vLy8vLy8vLy8vLy8vLy8gJyk7ICAgICAgICAgICAgICAgIFxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgcmV0dXJuIHJlcztcclxuICAgIH07XHJcblxyXG4gICAgY2hhbmdlX2ZpZWxkKCBzZXR0aW5ncyA9IHt9ICl7XHJcbiAgICAgICAgbGV0IGNvbXBvbmVudCA9IHNldHRpbmdzLmNvbXBvbmVudDtcclxuICAgICAgICBsZXQgZmllbGQgPSBzZXR0aW5ncy5maWVsZDtcclxuXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhjb21wb25lbnQsIGZpZWxkKTtcclxuICAgICAgICBpZiAoIHRoaXMuZXhpc3RfZmllbGRfd2l0aF90aGlzX25hbWUoY29tcG9uZW50LCBmaWVsZC5lZGl0X25hbWUsIGZpZWxkLl9pZCApICkgcmV0dXJuO1xyXG4gICAgICAgIGlmICggc2V0dGluZ3MudHlwZSA9PSAnbnVtYmVyJyApIHtcclxuICAgICAgICAgICAgZmllbGQuZWRpdF92YWx1ZSA9IHRoaXMuaWZfbnVtYmVyX2ZpZWxkKGZpZWxkLmVkaXRfdmFsdWVfbmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICggc2V0dGluZ3MudHlwZSA9PSAnY29tcG9uZW50JyApIHtcclxuICAgICAgICAgICAgZmllbGQuY29tcG9uZW50X3ZhbHVlID0gdGhpcy5pZl9jb21wb25lbnRfZmllbGQoY29tcG9uZW50LCBmaWVsZC5lZGl0X3ZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZmllbGQubmFtZSA9IGZpZWxkLmVkaXRfbmFtZSB8fCBmaWVsZC5uYW1lO1xyXG4gICAgICAgIGZpZWxkLnZhbHVlID0gZmllbGQuZWRpdF92YWx1ZTtcclxuICAgICAgICBkZWxldGUgZmllbGQuZWRpdF9uYW1lO1xyXG4gICAgICAgIGRlbGV0ZSBmaWVsZC5lZGl0X3ZhbHVlO1xyXG4gICAgICAgIGRlbGV0ZSBmaWVsZC5hc3NpZ25tZW50O1xyXG5cclxuICAgICAgICB0aGlzLnN0b3JhZ2VTZXJ2aWNlLnVwZGF0ZSgnL2FwaS9jb21wb25lbnRzJyx7XHJcbiAgICAgICAgICAgIGlkIDogY29tcG9uZW50Ll9pZCxcclxuICAgICAgICAgICAgbmFtZSA6IGNvbXBvbmVudC5uYW1lLFxyXG4gICAgICAgICAgICBncm91cCA6IGNvbXBvbmVudC5ncm91cCxcclxuICAgICAgICAgICAgbXV0YWJpbGl0eSA6IGNvbXBvbmVudC5tdXRhYmlsaXR5LFxyXG4gICAgICAgICAgICBib2R5IDogY29tcG9uZW50LmJvZHlcclxuICAgICAgICB9KS5cclxuICAgICAgICAgICAgc3Vic2NyaWJlKCByZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coICdwdXQgLSAnICwgcmVzICk7XHJcbiAgICAgICAgICAgICAgICBpZiAoICFyZXMuZXJyb3IgKSB0aGlzLmNvbXBvbmVudHMgPSByZXMuY29tcG9uZW50cztcclxuICAgICAgICB9KTtcclxuICAgICAgICBcclxuICAgIH07XHJcblxyXG4gICAgY29weV9maWVsZCggc2V0dGluZ3MgPSB7fSApe1xyXG4gICAgICAgIGxldCBjb21wb25lbnQgPSBzZXR0aW5ncy5jb21wb25lbnQ7XHJcbiAgICAgICAgbGV0IGZpZWxkID0gc2V0dGluZ3MuZmllbGQ7XHJcbiAgICAgICAgY29uc29sZS5sb2coY29tcG9uZW50LCBmaWVsZCk7XHJcbiAgICAgICAgaWYgKCAhZmllbGQuZWRpdF9uYW1lICkgcmV0dXJuO1xyXG4gICAgICAgIGlmICggdGhpcy5leGlzdF9maWVsZF93aXRoX3RoaXNfbmFtZShjb21wb25lbnQsIGZpZWxkLmVkaXRfbmFtZSwgZmllbGQuX2lkICkgKSByZXR1cm47XHJcbiAgICAgICAgbGV0IG5ld19maWVsZCA9IHRoaXMuZGVlcENvcHkoZmllbGQpO1xyXG4gICAgICAgIG5ld19maWVsZC5faWQgPSB0aGlzLmNyZWF0ZV9ndWlkKCk7XHJcbiAgICAgICAgbmV3X2ZpZWxkLm5hbWUgPSBuZXdfZmllbGQuZWRpdF9uYW1lO1xyXG4gICAgICAgIG5ld19maWVsZC52YWx1ZSA9ICcnO1xyXG4gICAgICAgIGlmICggc2V0dGluZ3MudHlwZSA9PSAnbnVtYmVyJyApIHtcclxuICAgICAgICAgICAgbmV3X2ZpZWxkLnZhbHVlPSB0aGlzLmlmX251bWJlcl9maWVsZChuZXdfZmllbGQudmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIHNldHRpbmdzLnR5cGUgPT0gJ2NvbXBvbmVudCcgKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaWZfY29tcG9uZW50X2ZpZWxkKGNvbXBvbmVudCwgbmV3X2ZpZWxkLnZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZGVsZXRlIG5ld19maWVsZC5lZGl0X25hbWU7XHJcbiAgICAgICAgZGVsZXRlIG5ld19maWVsZC5lZGl0X3ZhbHVlO1xyXG4gICAgICAgIGRlbGV0ZSBuZXdfZmllbGQuYXNzaWdubWVudDtcclxuICAgICAgICBjb21wb25lbnQuYm9keSA9IFsgLi4uIGNvbXBvbmVudC5ib2R5ICwgbmV3X2ZpZWxkIF07XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyggbmV3X2ZpZWxkICk7XHJcbiAgICAgICAgdGhpcy5zdG9yYWdlU2VydmljZS51cGRhdGUoJy9hcGkvY29tcG9uZW50cycse1xyXG4gICAgICAgICAgICBpZCA6IGNvbXBvbmVudC5faWQsXHJcbiAgICAgICAgICAgIG5hbWUgOiBjb21wb25lbnQubmFtZSxcclxuICAgICAgICAgICAgZ3JvdXAgOiBjb21wb25lbnQuZ3JvdXAsXHJcbiAgICAgICAgICAgIG11dGFiaWxpdHkgOiBjb21wb25lbnQubXV0YWJpbGl0eSxcclxuICAgICAgICAgICAgYm9keSA6IGNvbXBvbmVudC5ib2R5XHJcbiAgICAgICAgfSkuXHJcbiAgICAgICAgICAgIHN1YnNjcmliZSggcmVzID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCAncHV0IC0gJyAsIHJlcyApO1xyXG4gICAgICAgICAgICAgICAgaWYgKCAhcmVzLmVycm9yICkgdGhpcy5jb21wb25lbnRzID0gcmVzLmNvbXBvbmVudHM7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGRlbGV0ZV9maWVsZCggc2V0dGluZ3MgPSB7fSApe1xyXG4gICAgICAgIGxldCBjb21wb25lbnQgPSBzZXR0aW5ncy5jb21wb25lbnQ7XHJcbiAgICAgICAgbGV0IGZpZWxkID0gc2V0dGluZ3MuZmllbGQ7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhjb21wb25lbnQsIGZpZWxkKTtcclxuICAgICAgICBpZiAoICFjb21wb25lbnQgfHwgIWZpZWxkICkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyggJ25vIGNvbXBvbmVudCBvciBmaWVsZCcpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbXBvbmVudC5ib2R5LmZvckVhY2goIChlbCwgaWR4LCBhcnIpID0+IHsgXHJcbiAgICAgICAgICAgIGlmKGVsLl9pZCA9PT0gZmllbGQuX2lkICkge1xyXG4gICAgICAgICAgICAgICAgYXJyLnNwbGljZShpZHgsIDEpO1xyXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyggYXJyLCBpZHggKTtcclxuICAgICAgICAgICAgfSBcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnN0b3JhZ2VTZXJ2aWNlLnVwZGF0ZSgnL2FwaS9jb21wb25lbnRzJyx7XHJcbiAgICAgICAgICAgIGlkIDogY29tcG9uZW50Ll9pZCxcclxuICAgICAgICAgICAgbmFtZSA6IGNvbXBvbmVudC5uYW1lLFxyXG4gICAgICAgICAgICBncm91cCA6IGNvbXBvbmVudC5ncm91cCxcclxuICAgICAgICAgICAgbXV0YWJpbGl0eSA6IGNvbXBvbmVudC5tdXRhYmlsaXR5LFxyXG4gICAgICAgICAgICBib2R5IDogY29tcG9uZW50LmJvZHlcclxuICAgICAgICB9KS5cclxuICAgICAgICAgICAgc3Vic2NyaWJlKCByZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coICdwdXQgLSAnICwgcmVzICk7XHJcbiAgICAgICAgICAgICAgICBpZiAoICFyZXMuZXJyb3IgKSB0aGlzLmNvbXBvbmVudHMgPSByZXMuY29tcG9uZW50cztcclxuICAgICAgICB9KTtcclxuICAgICAgICBcclxuICAgIH07XHJcblxyXG4gICAgdmFsdWVfYXNzaWdubWVudChmaWVsZCl7XHJcbiAgICAgICAgaWYgKCAgIWZpZWxkLmFzc2lnbm1lbnQgKXtcclxuICAgICAgICAgICAgaWYgKCBmaWVsZC50eXBlID09ICdjb21wb25lbnQnICkge1xyXG4gICAgICAgICAgICAgICAgZmllbGQuY29tcG9uZW50X3ZhbHVlID0gZmllbGQuY29tcG9uZW50X3ZhbHVlIHx8IFtdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZpZWxkLmVkaXRfdmFsdWUgPSBmaWVsZC52YWx1ZTtcclxuICAgICAgICAgICAgZmllbGQuYXNzaWdubWVudCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfTtcclxuXHJcbiAgICBleGlzdF9maWVsZF93aXRoX3RoaXNfbmFtZShjb21wb25lbnQsIGZpZWxkX25hbWUsIGZpZWxkX2lkICl7XHJcbiAgICAgICAgaWYgKCAhY29tcG9uZW50IHx8XHJcbiAgICAgICAgICAgICAhY29tcG9uZW50LmJvZHkgXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCcgZmllbGRzIHdhcyBub3QgcHJvdmlkZWQgJyk7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihcclxuICAgICAgICAgICAgY29tcG9uZW50LmJvZHkuZmluZChlbCA9PiB7IHJldHVybiAoZWwubmFtZSA9PT0gZmllbGRfbmFtZSAmJlxyXG4gICAgICAgICAgICAgICBlbC5faWQgIT09IGZpZWxkX2lkICkgPyB0cnVlIDogZmFsc2UgfSlcclxuICAgICAgICApIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coICAnIGZpZWxkIHdpdGggc3VjaCBuYW1lIGV4aXN0cyAnICk7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9O1xyXG4gICAgXHJcbiovXHJcblxyXG4gICAgXHJcblxyXG4gICAgLy8gcmV0dXJuIHVuaXF1ZSBpZFxyXG4gICAgY3JlYXRlX2d1aWQoKSB7XHJcbiAgICAgICAgZnVuY3Rpb24gczQoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBNYXRoLmZsb29yKCgxICsgTWF0aC5yYW5kb20oKSkgKiAweDEwMDAwKVxyXG4gICAgICAgICAgICAgICAgLnRvU3RyaW5nKDE2KVxyXG4gICAgICAgICAgICAgICAgLnN1YnN0cmluZygxKTtcclxuICAgICAgICB9XHJcbiBcdCAgICByZXR1cm4gczQoKSArIHM0KCkgKyAnLScgKyBzNCgpICsgJy0nICsgczQoKSArICctJyArXHJcbiAgICAgICAgICAgICAgIHM0KCkgKyAnLScgKyBzNCgpICsgczQoKSArIHM0KCk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8vICBSZXR1cm5zIGEgZGVlcCBjb3B5IG9mIHRoZSBvYmplY3RcclxuICAgIGRlZXBDb3B5KG9sZE9iajogYW55KSB7XHJcbiAgICAgICAgbGV0IG5ld09iaiA9IG9sZE9iajtcclxuICAgICAgICBpZiAob2xkT2JqICYmIHR5cGVvZiBvbGRPYmogPT09IFwib2JqZWN0XCIpIHtcclxuICAgICAgICAgICAgbmV3T2JqID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9sZE9iaikgPT09IFwiW29iamVjdCBBcnJheV1cIiA/IFtdIDoge307XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgaW4gb2xkT2JqKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdPYmpbaV0gPSB0aGlzLmRlZXBDb3B5KG9sZE9ialtpXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5ld09iajtcclxuICAgIH07XHJcblxyXG5cclxuXHJcblxyXG59XHJcblxyXG5cclxuLypcclxuXHJcblxyXG5sZXQgY3Z0X3JfbiA9ICgoKSA9PiB7XHJcblxyXG4gIHZhciBudXQgPSBbMTAwMCwgOTAwLCA1MDAsIDQwMCwgMTAwLCA5MCwgNTAsIDQwLCAxMCwgOSwgNSwgNCwgMV07XHJcbiAgdmFyIHJvbSA9IFsnTScsICdDTScsICdEJywgJ0NEJywgJ0MnLCAnWEMnLCAnTCcsICdYTCcsICdYJywgJ0lYJywgJ1YnLCAnSVYnLCAnSSddO1xyXG4gIHZhciBhbGwgPSB7SToxLFY6NSxYOjEwLEw6NTAsQzoxMDAsRDo1MDAsTToxMDAwfTtcclxuXHJcbiAgdmFyIGN2dF9yX25fdG9fcm9tYW4gPSAoYXJhYmljKSA9PiB7XHJcbiAgICBsZXQgcmVzID0gJyc7ICBcclxuICAgIG51dC5mb3JFYWNoKCAoZWwsIGlkeCwgYXJyICkgPT57XHJcbiAgICAgICAgd2hpbGUgKCBhcmFiaWMgPj0gbnV0W2lkeF0gKSB7XHJcbiAgICAgICAgICAgIHJlcyArPSByb21baWR4XTtcclxuICAgICAgICAgICAgYXJhYmljIC09IG51dFtpZHhdO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIHJlcztcclxuICB9O1xyXG5cclxuICB2YXIgY3Z0X3Jfbl9mb3JtX3JvbWFuID0gKHJvbWFuKSA9PiB7XHJcbiAgICAgIGxldCByZXMgPSAwO1xyXG4gICAgICBsZXQgbCA9IHJvbWFuLmxlbmd0aDtcclxuICAgICAgd2hpbGUgKGwtLSkge1xyXG4gICAgICAgIGlmICggYWxsW3JvbWFuW2xdXSA8IGFsbFtyb21hbltsKzFdXSApIHsgXHJcbiAgICAgICAgICAgIHJlcyAtPSBhbGxbcm9tYW5bbF1dOyAgIFxyXG4gICAgICAgIH0gZWxzZSB7IFxyXG4gICAgICAgICAgICByZXMgKz0gYWxsW3JvbWFuW2xdXSBcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgIHJldHVybiByZXM7XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIChudW0pID0+IHtcclxuICAgIGlmICggdHlwZW9mIG51bSA9PT0gJ251bWJlcicpIHJldHVybiBjdnRfcl9uX3RvX3JvbWFuKCBudW0gKTtcclxuICAgIGlmICggdHlwZW9mIG51bSA9PT0gJ3N0cmluZycpIHJldHVybiBjdnRfcl9uX2Zvcm1fcm9tYW4oIG51bS50b1VwcGVyQ2FzZSgpICk7XHJcbiAgfTtcclxuXHJcbn0pKCk7XHJcblxyXG5cclxuY29uc29sZS5sb2coIGN2dF9yX24oMzAwMykgKTtcclxuY29uc29sZS5sb2coIGN2dF9yX24oNDQzKSApO1xyXG5jb25zb2xlLmxvZyggY3Z0X3Jfbig2OSkgKTtcclxuY29uc29sZS5sb2coIGN2dF9yX24oMikgKTtcclxuY29uc29sZS5sb2coIGN2dF9yX24oOTkpICk7XHJcbmNvbnNvbGUubG9nKCBjdnRfcl9uKDM0KSApO1xyXG5jb25zb2xlLmxvZyggY3Z0X3Jfbig0NTYpICk7XHJcblxyXG5jb25zb2xlLmxvZygnLS0tLS0tLS0tLS0tLS0tLS0tLScpO1xyXG5cclxuY29uc29sZS5sb2coIGN2dF9yX24oJ01NTUlJSScpICk7XHJcbmNvbnNvbGUubG9nKCBjdnRfcl9uKCdDRFhMSUlJJykgKTtcclxuY29uc29sZS5sb2coIGN2dF9yX24oJ0xYSVgnKSApO1xyXG5jb25zb2xlLmxvZyggY3Z0X3JfbignSUknKSApO1xyXG5jb25zb2xlLmxvZyggY3Z0X3JfbignWENJWCcpICk7XHJcbmNvbnNvbGUubG9nKCBjdnRfcl9uKCdYWFhJVicpICk7XHJcbmNvbnNvbGUubG9nKCBjdnRfcl9uKCdDRExWSScpICk7XHJcblxyXG4qLyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==

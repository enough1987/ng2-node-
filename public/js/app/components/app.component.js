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
    function AppComponent(storageService) {
        this.storageService = storageService;
        //public new_component = this.init_new_component();
        this.components = [];
        //public component_editable = [];
        //public new_field = { type: "string" };   
        //public new_group = [];
        this.components_current_view = 'all';
        this.create_component_group = '';
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
    AppComponent.prototype.set_create_component_group_select = function (value) {
        this.create_component_group = value;
    };
    ;
    AppComponent.prototype.change_create_component_group = function () {
        var _this = this;
        //console.log( 'keyup val ', this.create_component_group );
        var res = [1, 2, 3, 4].find(function (el) { return el == _this.create_component_group; }) || 'none';
        document.getElementById('create_component_group_select').value = res;
        console.log('create_component_group_select ', res);
    };
    AppComponent.prototype.choosen_menu = function (a, b) {
        if (a == b)
            return true;
    };
    AppComponent.prototype.create_component = function () {
        var _this = this;
        console.log(this.create_component_name);
        console.log(this.create_component_group || 'none');
        if (this.create_component_group !== 'none') {
            this.components.find(function (comp) { return comp.group == _this.create_component_group; });
        }
        return this.create_component_name;
        this.storageService.insert('/api/components', {
            name: this.create_component_name,
            group: this.create_component_group || 'none',
            body: []
        }).
            subscribe(function (res) {
            console.log('post - ', res);
            console.log(res.msg);
            if (!res.error) {
                _this.components = res.components;
                _this.new_component = _this.init_new_component(_this.new_component.mutability);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvYXBwLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEscUJBQTBCLGVBQWUsQ0FBQyxDQUFBO0FBRTFDLGdDQUE2Qiw2QkFBNkIsQ0FBQyxDQUFBO0FBQzNELG1DQUFnQyw2QkFBNkIsQ0FBQyxDQUFBO0FBVTlEO0lBU0ksc0JBQW1CLGNBQThCO1FBQTlCLG1CQUFjLEdBQWQsY0FBYyxDQUFnQjtRQVJqRCxtREFBbUQ7UUFDNUMsZUFBVSxHQUFHLEVBQUUsQ0FBQztRQUN2QixpQ0FBaUM7UUFDakMsMkNBQTJDO1FBQzNDLHdCQUF3QjtRQUNqQiw0QkFBdUIsR0FBRyxLQUFLLENBQUM7UUFDaEMsMkJBQXNCLEdBQUcsRUFBRSxDQUFDO0lBRWlCLENBQUM7SUFFckQsK0JBQVEsR0FBUjtRQUNJLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDeEIsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7SUFDOUIsQ0FBQzs7SUFFRCx5Q0FBa0IsR0FBbEI7UUFBQSxpQkFNQztRQUxHLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFFO1lBQzFDLFNBQVMsQ0FBRSxVQUFBLEdBQUc7WUFDVixPQUFPLENBQUMsR0FBRyxDQUFFLFFBQVEsRUFBRyxHQUFHLENBQUUsQ0FBQztZQUM5QixFQUFFLENBQUEsQ0FBRSxDQUFDLEdBQUcsQ0FBQyxLQUFNLENBQUM7Z0JBQUMsS0FBSSxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDO1FBQ3RELENBQUMsQ0FBQyxDQUFDO0lBQ1gsQ0FBQzs7SUFFRCx1Q0FBZ0IsR0FBaEIsVUFBa0IsSUFBSTtRQUNsQixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztJQUM3QixDQUFDOztJQUNELGtEQUEyQixHQUEzQixVQUE2QixJQUFJO1FBQzdCLEVBQUUsQ0FBQyxDQUFFLElBQUksSUFBSSxLQUFLLENBQUM7WUFBQyxRQUFRLENBQUMsY0FBYyxDQUFDLGNBQWMsQ0FBQyxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUM7UUFDM0UsSUFBSSxDQUFDLHVCQUF1QixHQUFHLElBQUksQ0FBQztRQUNwQyxPQUFPLENBQUMsR0FBRyxDQUFFLDJCQUEyQixFQUFFLElBQUksQ0FBQyx1QkFBdUIsQ0FBRSxDQUFDO0lBQzdFLENBQUM7O0lBRUQsd0RBQWlDLEdBQWpDLFVBQW1DLEtBQUs7UUFDcEMsSUFBSSxDQUFDLHNCQUFzQixHQUFHLEtBQUssQ0FBQztJQUN4QyxDQUFDOztJQUVELG9EQUE2QixHQUE3QjtRQUFBLGlCQUtDO1FBSkcsMkRBQTJEO1FBQzNELElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFFLFVBQUEsRUFBRSxJQUFJLE9BQUEsRUFBRSxJQUFJLEtBQUksQ0FBQyxzQkFBc0IsRUFBakMsQ0FBaUMsQ0FBQyxJQUFJLE1BQU0sQ0FBRTtRQUM5RSxRQUFRLENBQUMsY0FBYyxDQUFDLCtCQUErQixDQUFDLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQztRQUNyRSxPQUFPLENBQUMsR0FBRyxDQUFFLGdDQUFnQyxFQUFFLEdBQUcsQ0FBRSxDQUFDO0lBQ3pELENBQUM7SUFFRCxtQ0FBWSxHQUFaLFVBQWMsQ0FBQyxFQUFFLENBQUM7UUFDZCxFQUFFLENBQUMsQ0FBRSxDQUFDLElBQUksQ0FBRSxDQUFDO1lBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztJQUM5QixDQUFDO0lBRUQsdUNBQWdCLEdBQWhCO1FBQUEsaUJBc0JDO1FBckJHLE9BQU8sQ0FBQyxHQUFHLENBQUUsSUFBSSxDQUFDLHFCQUFxQixDQUFFLENBQUM7UUFDMUMsT0FBTyxDQUFDLEdBQUcsQ0FBRSxJQUFJLENBQUMsc0JBQXNCLElBQUksTUFBTSxDQUFFLENBQUM7UUFFckQsRUFBRSxDQUFDLENBQUUsSUFBSSxDQUFDLHNCQUFzQixLQUFLLE1BQU8sQ0FBQyxDQUFBLENBQUM7WUFDMUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUUsVUFBQSxJQUFJLElBQUksT0FBQSxJQUFJLENBQUMsS0FBSyxJQUFJLEtBQUksQ0FBQyxzQkFBc0IsRUFBekMsQ0FBeUMsQ0FBQyxDQUFDO1FBQzdFLENBQUM7UUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFFO1FBQ25DLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLGlCQUFpQixFQUFFO1lBQzFDLElBQUksRUFBRyxJQUFJLENBQUMscUJBQXFCO1lBQ2pDLEtBQUssRUFBRyxJQUFJLENBQUMsc0JBQXNCLElBQUksTUFBTTtZQUM3QyxJQUFJLEVBQUcsRUFBRTtTQUNYLENBQUM7WUFDQyxTQUFTLENBQUUsVUFBQSxHQUFHO1lBQ1YsT0FBTyxDQUFDLEdBQUcsQ0FBRSxTQUFTLEVBQUcsR0FBRyxDQUFFLENBQUM7WUFDL0IsT0FBTyxDQUFDLEdBQUcsQ0FBRSxHQUFHLENBQUMsR0FBRyxDQUFFLENBQUM7WUFDdkIsRUFBRSxDQUFDLENBQUUsQ0FBQyxHQUFHLENBQUMsS0FBTSxDQUFDLENBQUMsQ0FBQztnQkFDZixLQUFJLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUM7Z0JBQ2pDLEtBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSSxDQUFDLGtCQUFrQixDQUFDLEtBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDaEYsQ0FBQztRQUNULENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQzs7SUFHTDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQW9TRTtJQUlFLG1CQUFtQjtJQUNuQixrQ0FBVyxHQUFYO1FBQ0k7WUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUM7aUJBQzNDLFFBQVEsQ0FBQyxFQUFFLENBQUM7aUJBQ1osU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLENBQUM7UUFDSCxNQUFNLENBQUMsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEdBQUcsR0FBRyxHQUFHLEVBQUUsRUFBRSxHQUFHLEdBQUcsR0FBRyxFQUFFLEVBQUUsR0FBRyxHQUFHO1lBQ3pDLEVBQUUsRUFBRSxHQUFHLEdBQUcsR0FBRyxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQztJQUMzQyxDQUFDOztJQUVELHFDQUFxQztJQUNyQywrQkFBUSxHQUFSLFVBQVMsTUFBVztRQUNoQixJQUFJLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDcEIsRUFBRSxDQUFDLENBQUMsTUFBTSxJQUFJLE9BQU8sTUFBTSxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDdkMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxnQkFBZ0IsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDO1lBQy9FLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ25CLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3pDLENBQUM7UUFDTCxDQUFDO1FBQ0QsTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUNsQixDQUFDOztJQTlZTDtRQUFDLGdCQUFTLENBQUM7WUFDUCxRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7WUFDbkIsUUFBUSxFQUFFLFFBQVE7WUFDbEIsV0FBVyxFQUFFLG1CQUFtQjtZQUNoQyxTQUFTLEVBQUUsQ0FBQyxlQUFlLENBQUM7WUFDNUIsU0FBUyxFQUFFLENBQUMsZ0NBQWMsQ0FBQztZQUMzQixLQUFLLEVBQUUsQ0FBQyxzQ0FBaUIsQ0FBQztTQUM3QixDQUFDOztvQkFBQTtJQTRZRixtQkFBQztBQUFELENBM1lBLEFBMllDLElBQUE7QUEzWVksb0JBQVksZUEyWXhCLENBQUEiLCJmaWxlIjoiY29tcG9uZW50cy9hcHAuY29tcG9uZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5pbXBvcnQge1N0b3JhZ2VTZXJ2aWNlfSBmcm9tIFwiLi4vc2VydmljZXMvc3RvcmFnZS5zZXJ2aWNlXCI7XHJcbmltcG9ydCB7T2JqZWN0VG9BcnJheVBpcGV9IGZyb20gXCIuLi9waXBlcy9vYmplY3RUb0FycmF5LnBpcGVcIjtcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gICAgbW9kdWxlSWQ6IG1vZHVsZS5pZCwgXHJcbiAgICBzZWxlY3RvcjogJ215LWFwcCcsXHJcbiAgICB0ZW1wbGF0ZVVybDogJ2FwcC50ZW1wbGF0ZS5odG1sJyxcclxuICAgIHN0eWxlVXJsczogWydhcHAuc3R5bGUuY3NzJ10sXHJcbiAgICBwcm92aWRlcnM6IFtTdG9yYWdlU2VydmljZV0sXHJcbiAgICBwaXBlczogW09iamVjdFRvQXJyYXlQaXBlXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgQXBwQ29tcG9uZW50IHtcclxuICAgIC8vcHVibGljIG5ld19jb21wb25lbnQgPSB0aGlzLmluaXRfbmV3X2NvbXBvbmVudCgpO1xyXG4gICAgcHVibGljIGNvbXBvbmVudHMgPSBbXTtcclxuICAgIC8vcHVibGljIGNvbXBvbmVudF9lZGl0YWJsZSA9IFtdO1xyXG4gICAgLy9wdWJsaWMgbmV3X2ZpZWxkID0geyB0eXBlOiBcInN0cmluZ1wiIH07ICAgXHJcbiAgICAvL3B1YmxpYyBuZXdfZ3JvdXAgPSBbXTtcclxuICAgIHB1YmxpYyBjb21wb25lbnRzX2N1cnJlbnRfdmlldyA9ICdhbGwnO1xyXG4gICAgcHVibGljIGNyZWF0ZV9jb21wb25lbnRfZ3JvdXAgPSAnJztcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgc3RvcmFnZVNlcnZpY2U6IFN0b3JhZ2VTZXJ2aWNlKSB7fVxyXG5cclxuICAgIG5nT25Jbml0KCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCduZ09uSW5pdCcpO1xyXG4gICAgICAgIHRoaXMuZ2V0X2FsbF9jb21wb25lbnRzKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIGdldF9hbGxfY29tcG9uZW50cygpIHtcclxuICAgICAgICB0aGlzLnN0b3JhZ2VTZXJ2aWNlLnNlbGVjdCgnL2FwaS9jb21wb25lbnRzJyApLlxyXG4gICAgICAgICAgICBzdWJzY3JpYmUoIHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggJ2dldCAtICcgLCByZXMgKTtcclxuICAgICAgICAgICAgICAgIGlmKCAhcmVzLmVycm9yICkgdGhpcy5jb21wb25lbnRzID0gcmVzLmNvbXBvbmVudHM7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBzZXRfY3VycmVudF92aWV3KCB2aWV3ICl7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50X3ZpZXcgPSB2aWV3O1xyXG4gICAgfTtcclxuICAgIHNldF9jb21wb25lbnRzX2N1cnJlbnRfdmlldyggdmlldyApIHtcclxuICAgICAgICBpZiAoIHZpZXcgPT0gJ2FsbCcpIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdncm91cF9zZWxlY3QnKS52YWx1ZSA9ICdub25lJztcclxuICAgICAgICB0aGlzLmNvbXBvbmVudHNfY3VycmVudF92aWV3ID0gdmlldztcclxuICAgICAgICBjb25zb2xlLmxvZyggJyBjb21wb25lbnRzX2N1cnJlbnRfdmlldyAnLCB0aGlzLmNvbXBvbmVudHNfY3VycmVudF92aWV3ICk7ICAgICAgIFxyXG4gICAgfTtcclxuXHJcbiAgICBzZXRfY3JlYXRlX2NvbXBvbmVudF9ncm91cF9zZWxlY3QoIHZhbHVlICkge1xyXG4gICAgICAgIHRoaXMuY3JlYXRlX2NvbXBvbmVudF9ncm91cCA9IHZhbHVlO1xyXG4gICAgfTtcclxuXHJcbiAgICBjaGFuZ2VfY3JlYXRlX2NvbXBvbmVudF9ncm91cCgpIHtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKCAna2V5dXAgdmFsICcsIHRoaXMuY3JlYXRlX2NvbXBvbmVudF9ncm91cCApO1xyXG4gICAgICAgIGxldCByZXMgPSBbMSwyLDMsNF0uZmluZCggZWwgPT4gZWwgPT0gdGhpcy5jcmVhdGVfY29tcG9uZW50X2dyb3VwKSB8fCAnbm9uZScgO1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjcmVhdGVfY29tcG9uZW50X2dyb3VwX3NlbGVjdCcpLnZhbHVlID0gcmVzO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCAnY3JlYXRlX2NvbXBvbmVudF9ncm91cF9zZWxlY3QgJywgcmVzICk7IFxyXG4gICAgfVxyXG5cclxuICAgIGNob29zZW5fbWVudSggYSwgYiApe1xyXG4gICAgICAgIGlmICggYSA9PSBiICkgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlX2NvbXBvbmVudCgpe1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCB0aGlzLmNyZWF0ZV9jb21wb25lbnRfbmFtZSApO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCB0aGlzLmNyZWF0ZV9jb21wb25lbnRfZ3JvdXAgfHwgJ25vbmUnICk7XHJcblxyXG4gICAgICAgIGlmICggdGhpcy5jcmVhdGVfY29tcG9uZW50X2dyb3VwICE9PSAnbm9uZScgKXtcclxuICAgICAgICAgICAgdGhpcy5jb21wb25lbnRzLmZpbmQoIGNvbXAgPT4gY29tcC5ncm91cCA9PSB0aGlzLmNyZWF0ZV9jb21wb25lbnRfZ3JvdXApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlX2NvbXBvbmVudF9uYW1lIDtcclxuICAgICAgICB0aGlzLnN0b3JhZ2VTZXJ2aWNlLmluc2VydCgnL2FwaS9jb21wb25lbnRzJywge1xyXG4gICAgICAgICAgICBuYW1lIDogdGhpcy5jcmVhdGVfY29tcG9uZW50X25hbWUsXHJcbiAgICAgICAgICAgIGdyb3VwIDogdGhpcy5jcmVhdGVfY29tcG9uZW50X2dyb3VwIHx8ICdub25lJyxcclxuICAgICAgICAgICAgYm9keSA6IFtdXHJcbiAgICAgICAgIH0pLlxyXG4gICAgICAgICAgICBzdWJzY3JpYmUoIHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggJ3Bvc3QgLSAnICwgcmVzICk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggcmVzLm1zZyApO1xyXG4gICAgICAgICAgICAgICAgaWYgKCAhcmVzLmVycm9yICkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29tcG9uZW50cyA9IHJlcy5jb21wb25lbnRzO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV3X2NvbXBvbmVudCA9IHRoaXMuaW5pdF9uZXdfY29tcG9uZW50KHRoaXMubmV3X2NvbXBvbmVudC5tdXRhYmlsaXR5KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG5cclxuLypcclxuXHJcbiAgICBpbml0X25ld19jb21wb25lbnQobXV0YWJpbGl0eSA9ICcnKXtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBtdXRhYmlsaXR5IDogbXV0YWJpbGl0eVxyXG4gICAgICAgIH07XHJcbiAgICB9O1xyXG5cclxuICAgIHNldF9uZXdfY29tcG9uZW50X211dGFiaWxpdHkobXV0YWJpbGl0eSl7XHJcbiAgICAgICAgdGhpcy5uZXdfY29tcG9uZW50ID0gIHRoaXMuaW5pdF9uZXdfY29tcG9uZW50KCBtdXRhYmlsaXR5ICk7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICBnZXRfYWxsX2NvbXBvbmVudHMoKSB7XHJcbiAgICAgICAgdGhpcy5zdG9yYWdlU2VydmljZS5zZWxlY3QoJy9hcGkvY29tcG9uZW50cycgKS5cclxuICAgICAgICAgICAgc3Vic2NyaWJlKCByZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coICdnZXQgLSAnICwgcmVzICk7XHJcbiAgICAgICAgICAgICAgICBpZiggIXJlcy5lcnJvciApIHRoaXMuY29tcG9uZW50cyA9IHJlcy5jb21wb25lbnRzO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgY3JlYXRlX2NvbXBvbmVudCgpe1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCB0aGlzLmNvbXBvbmVudHMgKTtcclxuICAgICAgICBpZiAoICF0aGlzLm5ld19jb21wb25lbnQubmFtZSApIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coICcgbm8gbmFtZSB3YXMgcHJvdmlkZWQgJyk7XHJcbiAgICAgICAgICAgIHJldHVybiA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICggdGhpcy5leGlzdF9jb21wb25lbnRfd2hpdGhfdGhpc19uYW1lKCkgKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCAnIGNvbXBvbmVudCB3aXRoIHN1Y2ggbmFtZSBleGlzdHMgJyApO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc3RvcmFnZVNlcnZpY2UuaW5zZXJ0KCcvYXBpL2NvbXBvbmVudHMnLCB7XHJcbiAgICAgICAgICAgIG5hbWUgOiB0aGlzLm5ld19jb21wb25lbnQubmFtZSxcclxuICAgICAgICAgICAgZ3JvdXAgOiB0aGlzLm5ld19jb21wb25lbnQuZ3JvdXAgfHwgJycsXHJcbiAgICAgICAgICAgIG11dGFiaWxpdHkgOiB0aGlzLm5ld19jb21wb25lbnQubXV0YWJpbGl0eSxcclxuICAgICAgICAgICAgYm9keSA6IFtdXHJcbiAgICAgICAgIH0pLlxyXG4gICAgICAgICAgICBzdWJzY3JpYmUoIHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggJ3Bvc3QgLSAnICwgcmVzICk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggcmVzLm1zZyApO1xyXG4gICAgICAgICAgICAgICAgaWYgKCAhcmVzLmVycm9yICkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29tcG9uZW50cyA9IHJlcy5jb21wb25lbnRzO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV3X2NvbXBvbmVudCA9IHRoaXMuaW5pdF9uZXdfY29tcG9uZW50KHRoaXMubmV3X2NvbXBvbmVudC5tdXRhYmlsaXR5KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIGNoYW5nZV9jb21wb25lbnQoY29tcG9uZW50KXtcclxuICAgICAgICBpZiAoICFjb21wb25lbnQubmV3X25hbWUgKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdubyBuYW1lIHdhcyBwcm92aWRlZCAnKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiggdGhpcy5leGlzdF9jb21wb25lbnRfd2hpdGhfdGhpc19uYW1lKGNvbXBvbmVudC5uZXdfbmFtZSkgKXtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coICcgY29tcG9uZW50IHdpdGggc3VjaCBuYW1lIGV4aXN0cyAnICk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zdG9yYWdlU2VydmljZS51cGRhdGUoJy9hcGkvY29tcG9uZW50cycse1xyXG4gICAgICAgICAgICBpZCA6IGNvbXBvbmVudC5faWQsXHJcbiAgICAgICAgICAgIG5hbWUgOiBjb21wb25lbnQubmV3X25hbWUsXHJcbiAgICAgICAgICAgIGdyb3VwIDogY29tcG9uZW50Lmdyb3VwLFxyXG4gICAgICAgICAgICBtdXRhYmlsaXR5IDogdGhpcy5uZXdfY29tcG9uZW50Lm11dGFiaWxpdHksXHJcbiAgICAgICAgICAgIGJvZHkgOiBjb21wb25lbnQuYm9keVxyXG4gICAgICAgIH0pLlxyXG4gICAgICAgICAgICBzdWJzY3JpYmUoIHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggJ3B1dCAtICcgLCByZXMgKTtcclxuICAgICAgICAgICAgICAgIGlmICggIXJlcy5lcnJvciApIHRoaXMuY29tcG9uZW50cyA9IHJlcy5jb21wb25lbnRzO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBjb3B5X2NvbXBvbmVudChjb21wb25lbnQpIHtcclxuICAgICAgICBpZiAoICFjb21wb25lbnQubmV3X25hbWUgKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCAnbm8gbmFtZSB3YXMgcHJvdmlkZWQgJyApO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKCB0aGlzLmV4aXN0X2NvbXBvbmVudF93aGl0aF90aGlzX25hbWUoY29tcG9uZW50Lm5ld19uYW1lKSApe1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyggJyBjb21wb25lbnQgd2l0aCBzdWNoIG5hbWUgZXhpc3RzICcgKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnN0b3JhZ2VTZXJ2aWNlLmluc2VydCgnL2FwaS9jb21wb25lbnRzJywge1xyXG4gICAgICAgICAgICBuYW1lIDogY29tcG9uZW50Lm5ld19uYW1lLFxyXG4gICAgICAgICAgICBncm91cCA6IGNvbXBvbmVudC5ncm91cCxcclxuICAgICAgICAgICAgbXV0YWJpbGl0eSA6IGNvbXBvbmVudC5tdXRhYmlsaXR5LFxyXG4gICAgICAgICAgICBib2R5IDogY29tcG9uZW50LmJvZHlcclxuICAgICAgICAgfSkuXHJcbiAgICAgICAgICAgIHN1YnNjcmliZSggcmVzID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCAncG9zdCAtICcgLCByZXMgKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCByZXMubXNnICk7XHJcbiAgICAgICAgICAgICAgICBpZiAoICFyZXMuZXJyb3IgKSB0aGlzLmNvbXBvbmVudHMgPSByZXMuY29tcG9uZW50cztcclxuICAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGRlbGV0ZV9jb21wb25lbnQoaWQpIHtcclxuICAgICAgICBpZiAoICFpZCApIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ25vIGlkIHdhcyBwcm92aWRlZCAnKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnN0b3JhZ2VTZXJ2aWNlLmRlbGV0ZSgnL2FwaS9jb21wb25lbnRzJywgaWQpLlxyXG4gICAgICAgICAgICBzdWJzY3JpYmUoIHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggJ2RlbGV0ZSAtICcgLCByZXMgKTtcclxuICAgICAgICAgICAgICAgIGlmICggIXJlcy5lcnJvciApIHRoaXMuY29tcG9uZW50cyA9IHJlcy5jb21wb25lbnRzO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgZXhpc3RfY29tcG9uZW50X3doaXRoX3RoaXNfbmFtZShuYW1lID0gdGhpcy5uZXdfY29tcG9uZW50Lm5hbWUpe1xyXG4gICAgICAgIGlmKFxyXG4gICAgICAgICAgICB0aGlzLmNvbXBvbmVudHMuZmluZChlbCA9PiB7IHJldHVybiBlbC5uYW1lID09PSBuYW1lID8gdHJ1ZSA6IGZhbHNlIH0pXHJcbiAgICAgICAgICAgICkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfTtcclxuXHJcbiAgICBlZGl0X2ZpZWxkc19jb21wb25lbnQoY29tcG9uZW50KXtcclxuICAgICAgICB0aGlzLm5ld19maWVsZCA9IHsgdHlwZTogXCJzdHJpbmdcIiB9OyBcclxuICAgICAgICBjb25zb2xlLmxvZyggdGhpcy5jb21wb25lbnRfZWRpdGFibGUsIGNvbXBvbmVudCApO1xyXG4gICAgICAgIGlmICggdGhpcy5jb21wb25lbnRfZWRpdGFibGUuX2lkICE9IGNvbXBvbmVudC5faWQpICB7IFxyXG4gICAgICAgICAgICB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZSA9IGNvbXBvbmVudDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZSA9IFtdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxuICAgIHNob3dfZmllbGRzX2NvbXBvbmVudChjb21wb25lbnQpe1xyXG4gICAgICAgIGlmICggIHRoaXMuY29tcG9uZW50X2VkaXRhYmxlICYmXHJcbiAgICAgICAgICAgICAgdGhpcy5jb21wb25lbnRfZWRpdGFibGUuX2lkID09PSBjb21wb25lbnQuX2lkIFxyXG4gICAgICAgICkgcmV0dXJuIHRydWU7XHJcbiAgICB9OyBcclxuXHJcbiAgICBhZGRfZmllbGQoIGNvbXBvbmVudCwgbmV3X2ZpZWxkID0ge30gKXtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKCBjb21wb25lbnQsIG5ld19maWVsZCApO1xyXG4gICAgICAgIGlmICggIW5ld19maWVsZC5uYW1lICkgcmV0dXJuO1xyXG4gICAgICAgIGlmICggdGhpcy5leGlzdF9maWVsZF93aXRoX3RoaXNfbmFtZShjb21wb25lbnQsIG5ld19maWVsZC5uYW1lKSApIHJldHVybiA7XHJcbiAgICAgICAgdGhpcy5uZXdfZmllbGQgPSB7IHR5cGU6IFwic3RyaW5nXCIgfTsgXHJcbiAgICAgICAgbmV3X2ZpZWxkLl9pZCA9IHRoaXMuY3JlYXRlX2d1aWQoKTsgICAgICAgIFxyXG4gICAgICAgIGNvbXBvbmVudC5ib2R5ID0gWyAuLi4gY29tcG9uZW50LmJvZHkgLCBuZXdfZmllbGQgXTtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKCBjb21wb25lbnQuYm9keSApO1xyXG4gICAgICAgIHRoaXMuc3RvcmFnZVNlcnZpY2UudXBkYXRlKCcvYXBpL2NvbXBvbmVudHMnLHtcclxuICAgICAgICAgICAgaWQgOiBjb21wb25lbnQuX2lkLFxyXG4gICAgICAgICAgICBuYW1lIDogY29tcG9uZW50Lm5hbWUsXHJcbiAgICAgICAgICAgIGdyb3VwIDogY29tcG9uZW50Lmdyb3VwLFxyXG4gICAgICAgICAgICBtdXRhYmlsaXR5IDogY29tcG9uZW50Lm11dGFiaWxpdHksXHJcbiAgICAgICAgICAgIGJvZHkgOiBjb21wb25lbnQuYm9keVxyXG4gICAgICAgIH0pLlxyXG4gICAgICAgICAgICBzdWJzY3JpYmUoIHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggJ3B1dCAtICcgLCByZXMgKTtcclxuICAgICAgICAgICAgICAgIGlmICggIXJlcy5lcnJvciApIHRoaXMuY29tcG9uZW50cyA9IHJlcy5jb21wb25lbnRzO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgaWZfbnVtYmVyX2ZpZWxkKHZhbCl7XHJcbiAgICAgICAgdmFsID0gTnVtYmVyKHZhbCk7XHJcbiAgICAgICAgcmV0dXJuIHZhbCA/IHZhbCA6IDAgO1xyXG4gICAgfTtcclxuXHJcbiAgICBpZl9jb21wb25lbnRfZmllbGQoY29tcG9uZW50LCB2YWwpe1xyXG4gICAgICAgIGxldCByZXMgPSBbXTtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKGNvbXBvbmVudCwgdmFsKTtcclxuICAgICAgICB0aGlzLmNvbXBvbmVudHMuZmluZChlbCA9PiB7IFxyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCBlbC5uYW1lICk7XHJcbiAgICAgICAgICAgIGlmICggZWwubmFtZSA9PT0gdmFsICYmXHJcbiAgICAgICAgICAgICAgIGNvbXBvbmVudC5uYW1lICE9PSB2YWwgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCAncmVzICcsIGVsICk7XHJcbiAgICAgICAgICAgICAgICAgICByZXMgPSAgZWw7XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyggJyAvLy8vLy8vLy8vLy8vLy8vICcpOyAgICAgICAgICAgICAgICBcclxuICAgICAgICB9KVxyXG4gICAgICAgIHJldHVybiByZXM7XHJcbiAgICB9O1xyXG5cclxuICAgIGNoYW5nZV9maWVsZCggc2V0dGluZ3MgPSB7fSApe1xyXG4gICAgICAgIGxldCBjb21wb25lbnQgPSBzZXR0aW5ncy5jb21wb25lbnQ7XHJcbiAgICAgICAgbGV0IGZpZWxkID0gc2V0dGluZ3MuZmllbGQ7XHJcblxyXG4gICAgICAgIC8vY29uc29sZS5sb2coY29tcG9uZW50LCBmaWVsZCk7XHJcbiAgICAgICAgaWYgKCB0aGlzLmV4aXN0X2ZpZWxkX3dpdGhfdGhpc19uYW1lKGNvbXBvbmVudCwgZmllbGQuZWRpdF9uYW1lLCBmaWVsZC5faWQgKSApIHJldHVybjtcclxuICAgICAgICBpZiAoIHNldHRpbmdzLnR5cGUgPT0gJ251bWJlcicgKSB7XHJcbiAgICAgICAgICAgIGZpZWxkLmVkaXRfdmFsdWUgPSB0aGlzLmlmX251bWJlcl9maWVsZChmaWVsZC5lZGl0X3ZhbHVlX25hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIHNldHRpbmdzLnR5cGUgPT0gJ2NvbXBvbmVudCcgKSB7XHJcbiAgICAgICAgICAgIGZpZWxkLmNvbXBvbmVudF92YWx1ZSA9IHRoaXMuaWZfY29tcG9uZW50X2ZpZWxkKGNvbXBvbmVudCwgZmllbGQuZWRpdF92YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpZWxkLm5hbWUgPSBmaWVsZC5lZGl0X25hbWUgfHwgZmllbGQubmFtZTtcclxuICAgICAgICBmaWVsZC52YWx1ZSA9IGZpZWxkLmVkaXRfdmFsdWU7XHJcbiAgICAgICAgZGVsZXRlIGZpZWxkLmVkaXRfbmFtZTtcclxuICAgICAgICBkZWxldGUgZmllbGQuZWRpdF92YWx1ZTtcclxuICAgICAgICBkZWxldGUgZmllbGQuYXNzaWdubWVudDtcclxuXHJcbiAgICAgICAgdGhpcy5zdG9yYWdlU2VydmljZS51cGRhdGUoJy9hcGkvY29tcG9uZW50cycse1xyXG4gICAgICAgICAgICBpZCA6IGNvbXBvbmVudC5faWQsXHJcbiAgICAgICAgICAgIG5hbWUgOiBjb21wb25lbnQubmFtZSxcclxuICAgICAgICAgICAgZ3JvdXAgOiBjb21wb25lbnQuZ3JvdXAsXHJcbiAgICAgICAgICAgIG11dGFiaWxpdHkgOiBjb21wb25lbnQubXV0YWJpbGl0eSxcclxuICAgICAgICAgICAgYm9keSA6IGNvbXBvbmVudC5ib2R5XHJcbiAgICAgICAgfSkuXHJcbiAgICAgICAgICAgIHN1YnNjcmliZSggcmVzID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCAncHV0IC0gJyAsIHJlcyApO1xyXG4gICAgICAgICAgICAgICAgaWYgKCAhcmVzLmVycm9yICkgdGhpcy5jb21wb25lbnRzID0gcmVzLmNvbXBvbmVudHM7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgXHJcbiAgICB9O1xyXG5cclxuICAgIGNvcHlfZmllbGQoIHNldHRpbmdzID0ge30gKXtcclxuICAgICAgICBsZXQgY29tcG9uZW50ID0gc2V0dGluZ3MuY29tcG9uZW50O1xyXG4gICAgICAgIGxldCBmaWVsZCA9IHNldHRpbmdzLmZpZWxkO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGNvbXBvbmVudCwgZmllbGQpO1xyXG4gICAgICAgIGlmICggIWZpZWxkLmVkaXRfbmFtZSApIHJldHVybjtcclxuICAgICAgICBpZiAoIHRoaXMuZXhpc3RfZmllbGRfd2l0aF90aGlzX25hbWUoY29tcG9uZW50LCBmaWVsZC5lZGl0X25hbWUsIGZpZWxkLl9pZCApICkgcmV0dXJuO1xyXG4gICAgICAgIGxldCBuZXdfZmllbGQgPSB0aGlzLmRlZXBDb3B5KGZpZWxkKTtcclxuICAgICAgICBuZXdfZmllbGQuX2lkID0gdGhpcy5jcmVhdGVfZ3VpZCgpO1xyXG4gICAgICAgIG5ld19maWVsZC5uYW1lID0gbmV3X2ZpZWxkLmVkaXRfbmFtZTtcclxuICAgICAgICBuZXdfZmllbGQudmFsdWUgPSAnJztcclxuICAgICAgICBpZiAoIHNldHRpbmdzLnR5cGUgPT0gJ251bWJlcicgKSB7XHJcbiAgICAgICAgICAgIG5ld19maWVsZC52YWx1ZT0gdGhpcy5pZl9udW1iZXJfZmllbGQobmV3X2ZpZWxkLnZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCBzZXR0aW5ncy50eXBlID09ICdjb21wb25lbnQnICkge1xyXG4gICAgICAgICAgICB0aGlzLmlmX2NvbXBvbmVudF9maWVsZChjb21wb25lbnQsIG5ld19maWVsZC52YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGRlbGV0ZSBuZXdfZmllbGQuZWRpdF9uYW1lO1xyXG4gICAgICAgIGRlbGV0ZSBuZXdfZmllbGQuZWRpdF92YWx1ZTtcclxuICAgICAgICBkZWxldGUgbmV3X2ZpZWxkLmFzc2lnbm1lbnQ7XHJcbiAgICAgICAgY29tcG9uZW50LmJvZHkgPSBbIC4uLiBjb21wb25lbnQuYm9keSAsIG5ld19maWVsZCBdO1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coIG5ld19maWVsZCApO1xyXG4gICAgICAgIHRoaXMuc3RvcmFnZVNlcnZpY2UudXBkYXRlKCcvYXBpL2NvbXBvbmVudHMnLHtcclxuICAgICAgICAgICAgaWQgOiBjb21wb25lbnQuX2lkLFxyXG4gICAgICAgICAgICBuYW1lIDogY29tcG9uZW50Lm5hbWUsXHJcbiAgICAgICAgICAgIGdyb3VwIDogY29tcG9uZW50Lmdyb3VwLFxyXG4gICAgICAgICAgICBtdXRhYmlsaXR5IDogY29tcG9uZW50Lm11dGFiaWxpdHksXHJcbiAgICAgICAgICAgIGJvZHkgOiBjb21wb25lbnQuYm9keVxyXG4gICAgICAgIH0pLlxyXG4gICAgICAgICAgICBzdWJzY3JpYmUoIHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggJ3B1dCAtICcgLCByZXMgKTtcclxuICAgICAgICAgICAgICAgIGlmICggIXJlcy5lcnJvciApIHRoaXMuY29tcG9uZW50cyA9IHJlcy5jb21wb25lbnRzO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBkZWxldGVfZmllbGQoIHNldHRpbmdzID0ge30gKXtcclxuICAgICAgICBsZXQgY29tcG9uZW50ID0gc2V0dGluZ3MuY29tcG9uZW50O1xyXG4gICAgICAgIGxldCBmaWVsZCA9IHNldHRpbmdzLmZpZWxkO1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coY29tcG9uZW50LCBmaWVsZCk7XHJcbiAgICAgICAgaWYgKCAhY29tcG9uZW50IHx8ICFmaWVsZCApIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coICdubyBjb21wb25lbnQgb3IgZmllbGQnKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb21wb25lbnQuYm9keS5mb3JFYWNoKCAoZWwsIGlkeCwgYXJyKSA9PiB7IFxyXG4gICAgICAgICAgICBpZihlbC5faWQgPT09IGZpZWxkLl9pZCApIHtcclxuICAgICAgICAgICAgICAgIGFyci5zcGxpY2UoaWR4LCAxKTtcclxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coIGFyciwgaWR4ICk7XHJcbiAgICAgICAgICAgIH0gXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5zdG9yYWdlU2VydmljZS51cGRhdGUoJy9hcGkvY29tcG9uZW50cycse1xyXG4gICAgICAgICAgICBpZCA6IGNvbXBvbmVudC5faWQsXHJcbiAgICAgICAgICAgIG5hbWUgOiBjb21wb25lbnQubmFtZSxcclxuICAgICAgICAgICAgZ3JvdXAgOiBjb21wb25lbnQuZ3JvdXAsXHJcbiAgICAgICAgICAgIG11dGFiaWxpdHkgOiBjb21wb25lbnQubXV0YWJpbGl0eSxcclxuICAgICAgICAgICAgYm9keSA6IGNvbXBvbmVudC5ib2R5XHJcbiAgICAgICAgfSkuXHJcbiAgICAgICAgICAgIHN1YnNjcmliZSggcmVzID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCAncHV0IC0gJyAsIHJlcyApO1xyXG4gICAgICAgICAgICAgICAgaWYgKCAhcmVzLmVycm9yICkgdGhpcy5jb21wb25lbnRzID0gcmVzLmNvbXBvbmVudHM7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgXHJcbiAgICB9O1xyXG5cclxuICAgIHZhbHVlX2Fzc2lnbm1lbnQoZmllbGQpe1xyXG4gICAgICAgIGlmICggICFmaWVsZC5hc3NpZ25tZW50ICl7XHJcbiAgICAgICAgICAgIGlmICggZmllbGQudHlwZSA9PSAnY29tcG9uZW50JyApIHtcclxuICAgICAgICAgICAgICAgIGZpZWxkLmNvbXBvbmVudF92YWx1ZSA9IGZpZWxkLmNvbXBvbmVudF92YWx1ZSB8fCBbXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmaWVsZC5lZGl0X3ZhbHVlID0gZmllbGQudmFsdWU7XHJcbiAgICAgICAgICAgIGZpZWxkLmFzc2lnbm1lbnQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH07XHJcblxyXG4gICAgZXhpc3RfZmllbGRfd2l0aF90aGlzX25hbWUoY29tcG9uZW50LCBmaWVsZF9uYW1lLCBmaWVsZF9pZCApe1xyXG4gICAgICAgIGlmICggIWNvbXBvbmVudCB8fFxyXG4gICAgICAgICAgICAgIWNvbXBvbmVudC5ib2R5IFxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnIGZpZWxkcyB3YXMgbm90IHByb3ZpZGVkICcpO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoXHJcbiAgICAgICAgICAgIGNvbXBvbmVudC5ib2R5LmZpbmQoZWwgPT4geyByZXR1cm4gKGVsLm5hbWUgPT09IGZpZWxkX25hbWUgJiZcclxuICAgICAgICAgICAgICAgZWwuX2lkICE9PSBmaWVsZF9pZCApID8gdHJ1ZSA6IGZhbHNlIH0pXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCAgJyBmaWVsZCB3aXRoIHN1Y2ggbmFtZSBleGlzdHMgJyApO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfTtcclxuICAgIFxyXG4qL1xyXG5cclxuICAgIFxyXG5cclxuICAgIC8vIHJldHVybiB1bmlxdWUgaWRcclxuICAgIGNyZWF0ZV9ndWlkKCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIHM0KCkge1xyXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5mbG9vcigoMSArIE1hdGgucmFuZG9tKCkpICogMHgxMDAwMClcclxuICAgICAgICAgICAgICAgIC50b1N0cmluZygxNilcclxuICAgICAgICAgICAgICAgIC5zdWJzdHJpbmcoMSk7XHJcbiAgICAgICAgfVxyXG4gXHQgICAgcmV0dXJuIHM0KCkgKyBzNCgpICsgJy0nICsgczQoKSArICctJyArIHM0KCkgKyAnLScgK1xyXG4gICAgICAgICAgICAgICBzNCgpICsgJy0nICsgczQoKSArIHM0KCkgKyBzNCgpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvLyAgUmV0dXJucyBhIGRlZXAgY29weSBvZiB0aGUgb2JqZWN0XHJcbiAgICBkZWVwQ29weShvbGRPYmo6IGFueSkge1xyXG4gICAgICAgIGxldCBuZXdPYmogPSBvbGRPYmo7XHJcbiAgICAgICAgaWYgKG9sZE9iaiAmJiB0eXBlb2Ygb2xkT2JqID09PSBcIm9iamVjdFwiKSB7XHJcbiAgICAgICAgICAgIG5ld09iaiA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvbGRPYmopID09PSBcIltvYmplY3QgQXJyYXldXCIgPyBbXSA6IHt9O1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpIGluIG9sZE9iaikge1xyXG4gICAgICAgICAgICAgICAgbmV3T2JqW2ldID0gdGhpcy5kZWVwQ29weShvbGRPYmpbaV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZXdPYmo7XHJcbiAgICB9O1xyXG5cclxuXHJcblxyXG5cclxufVxyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=

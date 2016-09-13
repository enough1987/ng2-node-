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
    AppComponent.prototype.is_component_exist = function (name) {
        var res = this.components.find(function (comp) { return comp.name == name; });
        return !!res;
    };
    ;
    AppComponent.prototype.create_component = function () {
        var _this = this;
        if (!this.create_component_name) {
            console.log('no name was provided ');
            return false;
        }
        if (this.is_component_exist(this.create_component_name)) {
            console.log('Some component has this name');
            return false;
        }
        if (!this.create_component_group)
            this.create_component_group = 'none';
        var body = [];
        if (this.create_component_group !== 'none') {
            var res = this.components.find(function (comp) { return comp.group == _this.create_component_group; });
            body = res.body;
        }
        console.log(this.create_component_name, ' ', this.create_component_group, ' ', body);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvYXBwLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEscUJBQTBCLGVBQWUsQ0FBQyxDQUFBO0FBRTFDLGdDQUE2Qiw2QkFBNkIsQ0FBQyxDQUFBO0FBQzNELG1DQUFnQyw2QkFBNkIsQ0FBQyxDQUFBO0FBVTlEO0lBU0ksc0JBQW1CLGNBQThCO1FBQTlCLG1CQUFjLEdBQWQsY0FBYyxDQUFnQjtRQVJqRCxtREFBbUQ7UUFDNUMsZUFBVSxHQUFHLEVBQUUsQ0FBQztRQUN2QixpQ0FBaUM7UUFDakMsMkNBQTJDO1FBQzNDLHdCQUF3QjtRQUNqQiw0QkFBdUIsR0FBRyxLQUFLLENBQUM7UUFDaEMsMkJBQXNCLEdBQUcsRUFBRSxDQUFDO0lBRWlCLENBQUM7SUFFckQsK0JBQVEsR0FBUjtRQUNJLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDeEIsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7SUFDOUIsQ0FBQzs7SUFFRCx5Q0FBa0IsR0FBbEI7UUFBQSxpQkFNQztRQUxHLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFFO1lBQzFDLFNBQVMsQ0FBRSxVQUFBLEdBQUc7WUFDVixPQUFPLENBQUMsR0FBRyxDQUFFLFFBQVEsRUFBRyxHQUFHLENBQUUsQ0FBQztZQUM5QixFQUFFLENBQUEsQ0FBRSxDQUFDLEdBQUcsQ0FBQyxLQUFNLENBQUM7Z0JBQUMsS0FBSSxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDO1FBQ3RELENBQUMsQ0FBQyxDQUFDO0lBQ1gsQ0FBQzs7SUFFRCx1Q0FBZ0IsR0FBaEIsVUFBa0IsSUFBSTtRQUNsQixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztJQUM3QixDQUFDOztJQUNELGtEQUEyQixHQUEzQixVQUE2QixJQUFJO1FBQzdCLEVBQUUsQ0FBQyxDQUFFLElBQUksSUFBSSxLQUFLLENBQUM7WUFB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QUUsRUFBRSxHQUFHLEdBQUcsR0FBRyxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQztJQUMzQyxDQUFDOztJQUVELHFDQUFxQztJQUNyQywrQkFBUSxHQUFSLFVBQVMsTUFBVztRQUNoQixJQUFJLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDcEIsRUFBRSxDQUFDLENBQUMsTUFBTSxJQUFJLE9BQU8sTUFBTSxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDdkMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxnQkFBZ0IsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDO1lBQy9FLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ25CLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3pDLENBQUM7UUFDTCxDQUFDO1FBQ0QsTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUNsQixDQUFDOztJQWphTDtRQUFDLGdCQUFTLENBQUM7WUFDUCxRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7WUFDbkIsUUFBUSxFQUFFLFFBQVE7WUFDbEIsV0FBVyxFQUFFLG1CQUFtQjtZQUNoQyxTQUFTLEVBQUUsQ0FBQyxlQUFlLENBQUM7WUFDNUIsU0FBUyxFQUFFLENBQUMsZ0NBQWMsQ0FBQztZQUMzQixLQUFLLEVBQUUsQ0FBQyxzQ0FBaUIsQ0FBQztTQUM3QixDQUFDOztvQkFBQTtJQStaRixtQkFBQztBQUFELENBOVpBLEFBOFpDLElBQUE7QUE5Wlksb0JBQVksZUE4WnhCLENBQUEiLCJmaWxlIjoiY29tcG9uZW50cy9hcHAuY29tcG9uZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5pbXBvcnQge1N0b3JhZ2VTZXJ2aWNlfSBmcm9tIFwiLi4vc2VydmljZXMvc3RvcmFnZS5zZXJ2aWNlXCI7XHJcbmltcG9ydCB7T2JqZWN0VG9BcnJheVBpcGV9IGZyb20gXCIuLi9waXBlcy9vYmplY3RUb0FycmF5LnBpcGVcIjtcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gICAgbW9kdWxlSWQ6IG1vZHVsZS5pZCwgXHJcbiAgICBzZWxlY3RvcjogJ215LWFwcCcsXHJcbiAgICB0ZW1wbGF0ZVVybDogJ2FwcC50ZW1wbGF0ZS5odG1sJyxcclxuICAgIHN0eWxlVXJsczogWydhcHAuc3R5bGUuY3NzJ10sXHJcbiAgICBwcm92aWRlcnM6IFtTdG9yYWdlU2VydmljZV0sXHJcbiAgICBwaXBlczogW09iamVjdFRvQXJyYXlQaXBlXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgQXBwQ29tcG9uZW50IHtcclxuICAgIC8vcHVibGljIG5ld19jb21wb25lbnQgPSB0aGlzLmluaXRfbmV3X2NvbXBvbmVudCgpO1xyXG4gICAgcHVibGljIGNvbXBvbmVudHMgPSBbXTtcclxuICAgIC8vcHVibGljIGNvbXBvbmVudF9lZGl0YWJsZSA9IFtdO1xyXG4gICAgLy9wdWJsaWMgbmV3X2ZpZWxkID0geyB0eXBlOiBcInN0cmluZ1wiIH07ICAgXHJcbiAgICAvL3B1YmxpYyBuZXdfZ3JvdXAgPSBbXTtcclxuICAgIHB1YmxpYyBjb21wb25lbnRzX2N1cnJlbnRfdmlldyA9ICdhbGwnO1xyXG4gICAgcHVibGljIGNyZWF0ZV9jb21wb25lbnRfZ3JvdXAgPSAnJztcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgc3RvcmFnZVNlcnZpY2U6IFN0b3JhZ2VTZXJ2aWNlKSB7fVxyXG5cclxuICAgIG5nT25Jbml0KCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCduZ09uSW5pdCcpO1xyXG4gICAgICAgIHRoaXMuZ2V0X2FsbF9jb21wb25lbnRzKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIGdldF9hbGxfY29tcG9uZW50cygpIHtcclxuICAgICAgICB0aGlzLnN0b3JhZ2VTZXJ2aWNlLnNlbGVjdCgnL2FwaS9jb21wb25lbnRzJyApLlxyXG4gICAgICAgICAgICBzdWJzY3JpYmUoIHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggJ2dldCAtICcgLCByZXMgKTtcclxuICAgICAgICAgICAgICAgIGlmKCAhcmVzLmVycm9yICkgdGhpcy5jb21wb25lbnRzID0gcmVzLmNvbXBvbmVudHM7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBzZXRfY3VycmVudF92aWV3KCB2aWV3ICl7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50X3ZpZXcgPSB2aWV3O1xyXG4gICAgfTtcclxuICAgIHNldF9jb21wb25lbnRzX2N1cnJlbnRfdmlldyggdmlldyApIHtcclxuICAgICAgICBpZiAoIHZpZXcgPT0gJ2FsbCcpIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdncm91cF9zZWxlY3QnKS52YWx1ZSA9ICdub25lJztcclxuICAgICAgICB0aGlzLmNvbXBvbmVudHNfY3VycmVudF92aWV3ID0gdmlldztcclxuICAgICAgICBjb25zb2xlLmxvZyggJyBjb21wb25lbnRzX2N1cnJlbnRfdmlldyAnLCB0aGlzLmNvbXBvbmVudHNfY3VycmVudF92aWV3ICk7ICAgICAgIFxyXG4gICAgfTtcclxuXHJcbiAgICBzZXRfY3JlYXRlX2NvbXBvbmVudF9ncm91cF9zZWxlY3QoIHZhbHVlICkge1xyXG4gICAgICAgIHRoaXMuY3JlYXRlX2NvbXBvbmVudF9ncm91cCA9IHZhbHVlO1xyXG4gICAgfTtcclxuXHJcbiAgICBjaGFuZ2VfY3JlYXRlX2NvbXBvbmVudF9ncm91cCgpIHtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKCAna2V5dXAgdmFsICcsIHRoaXMuY3JlYXRlX2NvbXBvbmVudF9ncm91cCApO1xyXG4gICAgICAgIGxldCByZXMgPSBbMSwyLDMsNF0uZmluZCggZWwgPT4gZWwgPT0gdGhpcy5jcmVhdGVfY29tcG9uZW50X2dyb3VwKSB8fCAnbm9uZScgO1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjcmVhdGVfY29tcG9uZW50X2dyb3VwX3NlbGVjdCcpLnZhbHVlID0gcmVzO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCAnY3JlYXRlX2NvbXBvbmVudF9ncm91cF9zZWxlY3QgJywgcmVzICk7IFxyXG4gICAgfVxyXG5cclxuICAgIGNob29zZW5fbWVudSggYSwgYiApe1xyXG4gICAgICAgIGlmICggYSA9PSBiICkgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgaXNfY29tcG9uZW50X2V4aXN0KG5hbWUpe1xyXG4gICAgICAgIGxldCByZXMgPSB0aGlzLmNvbXBvbmVudHMuZmluZCggY29tcCA9PiBjb21wLm5hbWUgPT0gbmFtZSk7XHJcbiAgICAgICAgcmV0dXJuICEhcmVzO1xyXG4gICAgfTtcclxuXHJcbiAgICBjcmVhdGVfY29tcG9uZW50KCl7XHJcbiAgICAgICAgaWYgKCAhIHRoaXMuY3JlYXRlX2NvbXBvbmVudF9uYW1lICkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyggJ25vIG5hbWUgd2FzIHByb3ZpZGVkICcgKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIHRoaXMuaXNfY29tcG9uZW50X2V4aXN0KHRoaXMuY3JlYXRlX2NvbXBvbmVudF9uYW1lKSApIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coICdTb21lIGNvbXBvbmVudCBoYXMgdGhpcyBuYW1lJyApO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7ICAgICAgICAgICBcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICggISB0aGlzLmNyZWF0ZV9jb21wb25lbnRfZ3JvdXAgKSB0aGlzLmNyZWF0ZV9jb21wb25lbnRfZ3JvdXAgPSAnbm9uZScgO1xyXG4gICAgICAgIGxldCBib2R5ID0gW107XHJcbiAgICAgICAgaWYgKCB0aGlzLmNyZWF0ZV9jb21wb25lbnRfZ3JvdXAgIT09ICdub25lJyApe1xyXG4gICAgICAgICAgICBsZXQgcmVzID0gdGhpcy5jb21wb25lbnRzLmZpbmQoIGNvbXAgPT4gY29tcC5ncm91cCA9PSB0aGlzLmNyZWF0ZV9jb21wb25lbnRfZ3JvdXApO1xyXG4gICAgICAgICAgICBib2R5ID0gcmVzLmJvZHk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnNvbGUubG9nKFxyXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZV9jb21wb25lbnRfbmFtZSxcclxuICAgICAgICAgICAgJyAnLFxyXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZV9jb21wb25lbnRfZ3JvdXAsXHJcbiAgICAgICAgICAgICcgJyxcclxuICAgICAgICAgICAgYm9keVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHRoaXMuc3RvcmFnZVNlcnZpY2UuaW5zZXJ0KCcvYXBpL2NvbXBvbmVudHMnLCB7XHJcbiAgICAgICAgICAgIG5hbWUgOiB0aGlzLmNyZWF0ZV9jb21wb25lbnRfbmFtZSxcclxuICAgICAgICAgICAgZ3JvdXAgOiB0aGlzLmNyZWF0ZV9jb21wb25lbnRfZ3JvdXAgfHwgJ25vbmUnLFxyXG4gICAgICAgICAgICBib2R5IDogW11cclxuICAgICAgICAgfSkuXHJcbiAgICAgICAgICAgIHN1YnNjcmliZSggcmVzID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCAncG9zdCAtICcgLCByZXMgKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCByZXMubXNnICk7XHJcbiAgICAgICAgICAgICAgICBpZiAoICFyZXMuZXJyb3IgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb21wb25lbnRzID0gcmVzLmNvbXBvbmVudHM7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuXHJcbi8qXHJcblxyXG4gICAgaW5pdF9uZXdfY29tcG9uZW50KG11dGFiaWxpdHkgPSAnJyl7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgbXV0YWJpbGl0eSA6IG11dGFiaWxpdHlcclxuICAgICAgICB9O1xyXG4gICAgfTtcclxuXHJcbiAgICBzZXRfbmV3X2NvbXBvbmVudF9tdXRhYmlsaXR5KG11dGFiaWxpdHkpe1xyXG4gICAgICAgIHRoaXMubmV3X2NvbXBvbmVudCA9ICB0aGlzLmluaXRfbmV3X2NvbXBvbmVudCggbXV0YWJpbGl0eSApO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgZ2V0X2FsbF9jb21wb25lbnRzKCkge1xyXG4gICAgICAgIHRoaXMuc3RvcmFnZVNlcnZpY2Uuc2VsZWN0KCcvYXBpL2NvbXBvbmVudHMnICkuXHJcbiAgICAgICAgICAgIHN1YnNjcmliZSggcmVzID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCAnZ2V0IC0gJyAsIHJlcyApO1xyXG4gICAgICAgICAgICAgICAgaWYoICFyZXMuZXJyb3IgKSB0aGlzLmNvbXBvbmVudHMgPSByZXMuY29tcG9uZW50cztcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGNyZWF0ZV9jb21wb25lbnQoKXtcclxuICAgICAgICBjb25zb2xlLmxvZyggdGhpcy5jb21wb25lbnRzICk7XHJcbiAgICAgICAgaWYgKCAhdGhpcy5uZXdfY29tcG9uZW50Lm5hbWUgKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCAnIG5vIG5hbWUgd2FzIHByb3ZpZGVkICcpO1xyXG4gICAgICAgICAgICByZXR1cm4gO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIHRoaXMuZXhpc3RfY29tcG9uZW50X3doaXRoX3RoaXNfbmFtZSgpICkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyggJyBjb21wb25lbnQgd2l0aCBzdWNoIG5hbWUgZXhpc3RzICcgKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnN0b3JhZ2VTZXJ2aWNlLmluc2VydCgnL2FwaS9jb21wb25lbnRzJywge1xyXG4gICAgICAgICAgICBuYW1lIDogdGhpcy5uZXdfY29tcG9uZW50Lm5hbWUsXHJcbiAgICAgICAgICAgIGdyb3VwIDogdGhpcy5uZXdfY29tcG9uZW50Lmdyb3VwIHx8ICcnLFxyXG4gICAgICAgICAgICBtdXRhYmlsaXR5IDogdGhpcy5uZXdfY29tcG9uZW50Lm11dGFiaWxpdHksXHJcbiAgICAgICAgICAgIGJvZHkgOiBbXVxyXG4gICAgICAgICB9KS5cclxuICAgICAgICAgICAgc3Vic2NyaWJlKCByZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coICdwb3N0IC0gJyAsIHJlcyApO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coIHJlcy5tc2cgKTtcclxuICAgICAgICAgICAgICAgIGlmICggIXJlcy5lcnJvciApIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbXBvbmVudHMgPSByZXMuY29tcG9uZW50cztcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5ld19jb21wb25lbnQgPSB0aGlzLmluaXRfbmV3X2NvbXBvbmVudCh0aGlzLm5ld19jb21wb25lbnQubXV0YWJpbGl0eSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBjaGFuZ2VfY29tcG9uZW50KGNvbXBvbmVudCl7XHJcbiAgICAgICAgaWYgKCAhY29tcG9uZW50Lm5ld19uYW1lICkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnbm8gbmFtZSB3YXMgcHJvdmlkZWQgJyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoIHRoaXMuZXhpc3RfY29tcG9uZW50X3doaXRoX3RoaXNfbmFtZShjb21wb25lbnQubmV3X25hbWUpICl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCAnIGNvbXBvbmVudCB3aXRoIHN1Y2ggbmFtZSBleGlzdHMgJyApO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc3RvcmFnZVNlcnZpY2UudXBkYXRlKCcvYXBpL2NvbXBvbmVudHMnLHtcclxuICAgICAgICAgICAgaWQgOiBjb21wb25lbnQuX2lkLFxyXG4gICAgICAgICAgICBuYW1lIDogY29tcG9uZW50Lm5ld19uYW1lLFxyXG4gICAgICAgICAgICBncm91cCA6IGNvbXBvbmVudC5ncm91cCxcclxuICAgICAgICAgICAgbXV0YWJpbGl0eSA6IHRoaXMubmV3X2NvbXBvbmVudC5tdXRhYmlsaXR5LFxyXG4gICAgICAgICAgICBib2R5IDogY29tcG9uZW50LmJvZHlcclxuICAgICAgICB9KS5cclxuICAgICAgICAgICAgc3Vic2NyaWJlKCByZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coICdwdXQgLSAnICwgcmVzICk7XHJcbiAgICAgICAgICAgICAgICBpZiAoICFyZXMuZXJyb3IgKSB0aGlzLmNvbXBvbmVudHMgPSByZXMuY29tcG9uZW50cztcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgY29weV9jb21wb25lbnQoY29tcG9uZW50KSB7XHJcbiAgICAgICAgaWYgKCAhY29tcG9uZW50Lm5ld19uYW1lICkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyggJ25vIG5hbWUgd2FzIHByb3ZpZGVkICcgKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiggdGhpcy5leGlzdF9jb21wb25lbnRfd2hpdGhfdGhpc19uYW1lKGNvbXBvbmVudC5uZXdfbmFtZSkgKXtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coICcgY29tcG9uZW50IHdpdGggc3VjaCBuYW1lIGV4aXN0cyAnICk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zdG9yYWdlU2VydmljZS5pbnNlcnQoJy9hcGkvY29tcG9uZW50cycsIHtcclxuICAgICAgICAgICAgbmFtZSA6IGNvbXBvbmVudC5uZXdfbmFtZSxcclxuICAgICAgICAgICAgZ3JvdXAgOiBjb21wb25lbnQuZ3JvdXAsXHJcbiAgICAgICAgICAgIG11dGFiaWxpdHkgOiBjb21wb25lbnQubXV0YWJpbGl0eSxcclxuICAgICAgICAgICAgYm9keSA6IGNvbXBvbmVudC5ib2R5XHJcbiAgICAgICAgIH0pLlxyXG4gICAgICAgICAgICBzdWJzY3JpYmUoIHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggJ3Bvc3QgLSAnICwgcmVzICk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggcmVzLm1zZyApO1xyXG4gICAgICAgICAgICAgICAgaWYgKCAhcmVzLmVycm9yICkgdGhpcy5jb21wb25lbnRzID0gcmVzLmNvbXBvbmVudHM7XHJcbiAgICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBkZWxldGVfY29tcG9uZW50KGlkKSB7XHJcbiAgICAgICAgaWYgKCAhaWQgKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdubyBpZCB3YXMgcHJvdmlkZWQgJyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zdG9yYWdlU2VydmljZS5kZWxldGUoJy9hcGkvY29tcG9uZW50cycsIGlkKS5cclxuICAgICAgICAgICAgc3Vic2NyaWJlKCByZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coICdkZWxldGUgLSAnICwgcmVzICk7XHJcbiAgICAgICAgICAgICAgICBpZiAoICFyZXMuZXJyb3IgKSB0aGlzLmNvbXBvbmVudHMgPSByZXMuY29tcG9uZW50cztcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGV4aXN0X2NvbXBvbmVudF93aGl0aF90aGlzX25hbWUobmFtZSA9IHRoaXMubmV3X2NvbXBvbmVudC5uYW1lKXtcclxuICAgICAgICBpZihcclxuICAgICAgICAgICAgdGhpcy5jb21wb25lbnRzLmZpbmQoZWwgPT4geyByZXR1cm4gZWwubmFtZSA9PT0gbmFtZSA/IHRydWUgOiBmYWxzZSB9KVxyXG4gICAgICAgICAgICApIHJldHVybiB0cnVlO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH07XHJcblxyXG4gICAgZWRpdF9maWVsZHNfY29tcG9uZW50KGNvbXBvbmVudCl7XHJcbiAgICAgICAgdGhpcy5uZXdfZmllbGQgPSB7IHR5cGU6IFwic3RyaW5nXCIgfTsgXHJcbiAgICAgICAgY29uc29sZS5sb2coIHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLCBjb21wb25lbnQgKTtcclxuICAgICAgICBpZiAoIHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLl9pZCAhPSBjb21wb25lbnQuX2lkKSAgeyBcclxuICAgICAgICAgICAgdGhpcy5jb21wb25lbnRfZWRpdGFibGUgPSBjb21wb25lbnQ7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jb21wb25lbnRfZWRpdGFibGUgPSBbXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBzaG93X2ZpZWxkc19jb21wb25lbnQoY29tcG9uZW50KXtcclxuICAgICAgICBpZiAoICB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZSAmJlxyXG4gICAgICAgICAgICAgIHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLl9pZCA9PT0gY29tcG9uZW50Ll9pZCBcclxuICAgICAgICApIHJldHVybiB0cnVlO1xyXG4gICAgfTsgXHJcblxyXG4gICAgYWRkX2ZpZWxkKCBjb21wb25lbnQsIG5ld19maWVsZCA9IHt9ICl7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyggY29tcG9uZW50LCBuZXdfZmllbGQgKTtcclxuICAgICAgICBpZiAoICFuZXdfZmllbGQubmFtZSApIHJldHVybjtcclxuICAgICAgICBpZiAoIHRoaXMuZXhpc3RfZmllbGRfd2l0aF90aGlzX25hbWUoY29tcG9uZW50LCBuZXdfZmllbGQubmFtZSkgKSByZXR1cm4gO1xyXG4gICAgICAgIHRoaXMubmV3X2ZpZWxkID0geyB0eXBlOiBcInN0cmluZ1wiIH07IFxyXG4gICAgICAgIG5ld19maWVsZC5faWQgPSB0aGlzLmNyZWF0ZV9ndWlkKCk7ICAgICAgICBcclxuICAgICAgICBjb21wb25lbnQuYm9keSA9IFsgLi4uIGNvbXBvbmVudC5ib2R5ICwgbmV3X2ZpZWxkIF07XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyggY29tcG9uZW50LmJvZHkgKTtcclxuICAgICAgICB0aGlzLnN0b3JhZ2VTZXJ2aWNlLnVwZGF0ZSgnL2FwaS9jb21wb25lbnRzJyx7XHJcbiAgICAgICAgICAgIGlkIDogY29tcG9uZW50Ll9pZCxcclxuICAgICAgICAgICAgbmFtZSA6IGNvbXBvbmVudC5uYW1lLFxyXG4gICAgICAgICAgICBncm91cCA6IGNvbXBvbmVudC5ncm91cCxcclxuICAgICAgICAgICAgbXV0YWJpbGl0eSA6IGNvbXBvbmVudC5tdXRhYmlsaXR5LFxyXG4gICAgICAgICAgICBib2R5IDogY29tcG9uZW50LmJvZHlcclxuICAgICAgICB9KS5cclxuICAgICAgICAgICAgc3Vic2NyaWJlKCByZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coICdwdXQgLSAnICwgcmVzICk7XHJcbiAgICAgICAgICAgICAgICBpZiAoICFyZXMuZXJyb3IgKSB0aGlzLmNvbXBvbmVudHMgPSByZXMuY29tcG9uZW50cztcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIGlmX251bWJlcl9maWVsZCh2YWwpe1xyXG4gICAgICAgIHZhbCA9IE51bWJlcih2YWwpO1xyXG4gICAgICAgIHJldHVybiB2YWwgPyB2YWwgOiAwIDtcclxuICAgIH07XHJcblxyXG4gICAgaWZfY29tcG9uZW50X2ZpZWxkKGNvbXBvbmVudCwgdmFsKXtcclxuICAgICAgICBsZXQgcmVzID0gW107XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhjb21wb25lbnQsIHZhbCk7XHJcbiAgICAgICAgdGhpcy5jb21wb25lbnRzLmZpbmQoZWwgPT4geyBcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyggZWwubmFtZSApO1xyXG4gICAgICAgICAgICBpZiAoIGVsLm5hbWUgPT09IHZhbCAmJlxyXG4gICAgICAgICAgICAgICBjb21wb25lbnQubmFtZSAhPT0gdmFsICkge1xyXG4gICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyggJ3JlcyAnLCBlbCApO1xyXG4gICAgICAgICAgICAgICAgICAgcmVzID0gIGVsO1xyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coICcgLy8vLy8vLy8vLy8vLy8vLyAnKTsgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgfSlcclxuICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgfTtcclxuXHJcbiAgICBjaGFuZ2VfZmllbGQoIHNldHRpbmdzID0ge30gKXtcclxuICAgICAgICBsZXQgY29tcG9uZW50ID0gc2V0dGluZ3MuY29tcG9uZW50O1xyXG4gICAgICAgIGxldCBmaWVsZCA9IHNldHRpbmdzLmZpZWxkO1xyXG5cclxuICAgICAgICAvL2NvbnNvbGUubG9nKGNvbXBvbmVudCwgZmllbGQpO1xyXG4gICAgICAgIGlmICggdGhpcy5leGlzdF9maWVsZF93aXRoX3RoaXNfbmFtZShjb21wb25lbnQsIGZpZWxkLmVkaXRfbmFtZSwgZmllbGQuX2lkICkgKSByZXR1cm47XHJcbiAgICAgICAgaWYgKCBzZXR0aW5ncy50eXBlID09ICdudW1iZXInICkge1xyXG4gICAgICAgICAgICBmaWVsZC5lZGl0X3ZhbHVlID0gdGhpcy5pZl9udW1iZXJfZmllbGQoZmllbGQuZWRpdF92YWx1ZV9uYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCBzZXR0aW5ncy50eXBlID09ICdjb21wb25lbnQnICkge1xyXG4gICAgICAgICAgICBmaWVsZC5jb21wb25lbnRfdmFsdWUgPSB0aGlzLmlmX2NvbXBvbmVudF9maWVsZChjb21wb25lbnQsIGZpZWxkLmVkaXRfdmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmaWVsZC5uYW1lID0gZmllbGQuZWRpdF9uYW1lIHx8IGZpZWxkLm5hbWU7XHJcbiAgICAgICAgZmllbGQudmFsdWUgPSBmaWVsZC5lZGl0X3ZhbHVlO1xyXG4gICAgICAgIGRlbGV0ZSBmaWVsZC5lZGl0X25hbWU7XHJcbiAgICAgICAgZGVsZXRlIGZpZWxkLmVkaXRfdmFsdWU7XHJcbiAgICAgICAgZGVsZXRlIGZpZWxkLmFzc2lnbm1lbnQ7XHJcblxyXG4gICAgICAgIHRoaXMuc3RvcmFnZVNlcnZpY2UudXBkYXRlKCcvYXBpL2NvbXBvbmVudHMnLHtcclxuICAgICAgICAgICAgaWQgOiBjb21wb25lbnQuX2lkLFxyXG4gICAgICAgICAgICBuYW1lIDogY29tcG9uZW50Lm5hbWUsXHJcbiAgICAgICAgICAgIGdyb3VwIDogY29tcG9uZW50Lmdyb3VwLFxyXG4gICAgICAgICAgICBtdXRhYmlsaXR5IDogY29tcG9uZW50Lm11dGFiaWxpdHksXHJcbiAgICAgICAgICAgIGJvZHkgOiBjb21wb25lbnQuYm9keVxyXG4gICAgICAgIH0pLlxyXG4gICAgICAgICAgICBzdWJzY3JpYmUoIHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggJ3B1dCAtICcgLCByZXMgKTtcclxuICAgICAgICAgICAgICAgIGlmICggIXJlcy5lcnJvciApIHRoaXMuY29tcG9uZW50cyA9IHJlcy5jb21wb25lbnRzO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFxyXG4gICAgfTtcclxuXHJcbiAgICBjb3B5X2ZpZWxkKCBzZXR0aW5ncyA9IHt9ICl7XHJcbiAgICAgICAgbGV0IGNvbXBvbmVudCA9IHNldHRpbmdzLmNvbXBvbmVudDtcclxuICAgICAgICBsZXQgZmllbGQgPSBzZXR0aW5ncy5maWVsZDtcclxuICAgICAgICBjb25zb2xlLmxvZyhjb21wb25lbnQsIGZpZWxkKTtcclxuICAgICAgICBpZiAoICFmaWVsZC5lZGl0X25hbWUgKSByZXR1cm47XHJcbiAgICAgICAgaWYgKCB0aGlzLmV4aXN0X2ZpZWxkX3dpdGhfdGhpc19uYW1lKGNvbXBvbmVudCwgZmllbGQuZWRpdF9uYW1lLCBmaWVsZC5faWQgKSApIHJldHVybjtcclxuICAgICAgICBsZXQgbmV3X2ZpZWxkID0gdGhpcy5kZWVwQ29weShmaWVsZCk7XHJcbiAgICAgICAgbmV3X2ZpZWxkLl9pZCA9IHRoaXMuY3JlYXRlX2d1aWQoKTtcclxuICAgICAgICBuZXdfZmllbGQubmFtZSA9IG5ld19maWVsZC5lZGl0X25hbWU7XHJcbiAgICAgICAgbmV3X2ZpZWxkLnZhbHVlID0gJyc7XHJcbiAgICAgICAgaWYgKCBzZXR0aW5ncy50eXBlID09ICdudW1iZXInICkge1xyXG4gICAgICAgICAgICBuZXdfZmllbGQudmFsdWU9IHRoaXMuaWZfbnVtYmVyX2ZpZWxkKG5ld19maWVsZC52YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICggc2V0dGluZ3MudHlwZSA9PSAnY29tcG9uZW50JyApIHtcclxuICAgICAgICAgICAgdGhpcy5pZl9jb21wb25lbnRfZmllbGQoY29tcG9uZW50LCBuZXdfZmllbGQudmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBkZWxldGUgbmV3X2ZpZWxkLmVkaXRfbmFtZTtcclxuICAgICAgICBkZWxldGUgbmV3X2ZpZWxkLmVkaXRfdmFsdWU7XHJcbiAgICAgICAgZGVsZXRlIG5ld19maWVsZC5hc3NpZ25tZW50O1xyXG4gICAgICAgIGNvbXBvbmVudC5ib2R5ID0gWyAuLi4gY29tcG9uZW50LmJvZHkgLCBuZXdfZmllbGQgXTtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKCBuZXdfZmllbGQgKTtcclxuICAgICAgICB0aGlzLnN0b3JhZ2VTZXJ2aWNlLnVwZGF0ZSgnL2FwaS9jb21wb25lbnRzJyx7XHJcbiAgICAgICAgICAgIGlkIDogY29tcG9uZW50Ll9pZCxcclxuICAgICAgICAgICAgbmFtZSA6IGNvbXBvbmVudC5uYW1lLFxyXG4gICAgICAgICAgICBncm91cCA6IGNvbXBvbmVudC5ncm91cCxcclxuICAgICAgICAgICAgbXV0YWJpbGl0eSA6IGNvbXBvbmVudC5tdXRhYmlsaXR5LFxyXG4gICAgICAgICAgICBib2R5IDogY29tcG9uZW50LmJvZHlcclxuICAgICAgICB9KS5cclxuICAgICAgICAgICAgc3Vic2NyaWJlKCByZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coICdwdXQgLSAnICwgcmVzICk7XHJcbiAgICAgICAgICAgICAgICBpZiAoICFyZXMuZXJyb3IgKSB0aGlzLmNvbXBvbmVudHMgPSByZXMuY29tcG9uZW50cztcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgZGVsZXRlX2ZpZWxkKCBzZXR0aW5ncyA9IHt9ICl7XHJcbiAgICAgICAgbGV0IGNvbXBvbmVudCA9IHNldHRpbmdzLmNvbXBvbmVudDtcclxuICAgICAgICBsZXQgZmllbGQgPSBzZXR0aW5ncy5maWVsZDtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKGNvbXBvbmVudCwgZmllbGQpO1xyXG4gICAgICAgIGlmICggIWNvbXBvbmVudCB8fCAhZmllbGQgKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCAnbm8gY29tcG9uZW50IG9yIGZpZWxkJyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29tcG9uZW50LmJvZHkuZm9yRWFjaCggKGVsLCBpZHgsIGFycikgPT4geyBcclxuICAgICAgICAgICAgaWYoZWwuX2lkID09PSBmaWVsZC5faWQgKSB7XHJcbiAgICAgICAgICAgICAgICBhcnIuc3BsaWNlKGlkeCwgMSk7XHJcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCBhcnIsIGlkeCApO1xyXG4gICAgICAgICAgICB9IFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuc3RvcmFnZVNlcnZpY2UudXBkYXRlKCcvYXBpL2NvbXBvbmVudHMnLHtcclxuICAgICAgICAgICAgaWQgOiBjb21wb25lbnQuX2lkLFxyXG4gICAgICAgICAgICBuYW1lIDogY29tcG9uZW50Lm5hbWUsXHJcbiAgICAgICAgICAgIGdyb3VwIDogY29tcG9uZW50Lmdyb3VwLFxyXG4gICAgICAgICAgICBtdXRhYmlsaXR5IDogY29tcG9uZW50Lm11dGFiaWxpdHksXHJcbiAgICAgICAgICAgIGJvZHkgOiBjb21wb25lbnQuYm9keVxyXG4gICAgICAgIH0pLlxyXG4gICAgICAgICAgICBzdWJzY3JpYmUoIHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggJ3B1dCAtICcgLCByZXMgKTtcclxuICAgICAgICAgICAgICAgIGlmICggIXJlcy5lcnJvciApIHRoaXMuY29tcG9uZW50cyA9IHJlcy5jb21wb25lbnRzO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFxyXG4gICAgfTtcclxuXHJcbiAgICB2YWx1ZV9hc3NpZ25tZW50KGZpZWxkKXtcclxuICAgICAgICBpZiAoICAhZmllbGQuYXNzaWdubWVudCApe1xyXG4gICAgICAgICAgICBpZiAoIGZpZWxkLnR5cGUgPT0gJ2NvbXBvbmVudCcgKSB7XHJcbiAgICAgICAgICAgICAgICBmaWVsZC5jb21wb25lbnRfdmFsdWUgPSBmaWVsZC5jb21wb25lbnRfdmFsdWUgfHwgW107XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZmllbGQuZWRpdF92YWx1ZSA9IGZpZWxkLnZhbHVlO1xyXG4gICAgICAgICAgICBmaWVsZC5hc3NpZ25tZW50ID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9O1xyXG5cclxuICAgIGV4aXN0X2ZpZWxkX3dpdGhfdGhpc19uYW1lKGNvbXBvbmVudCwgZmllbGRfbmFtZSwgZmllbGRfaWQgKXtcclxuICAgICAgICBpZiAoICFjb21wb25lbnQgfHxcclxuICAgICAgICAgICAgICFjb21wb25lbnQuYm9keSBcclxuICAgICAgICApIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJyBmaWVsZHMgd2FzIG5vdCBwcm92aWRlZCAnKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKFxyXG4gICAgICAgICAgICBjb21wb25lbnQuYm9keS5maW5kKGVsID0+IHsgcmV0dXJuIChlbC5uYW1lID09PSBmaWVsZF9uYW1lICYmXHJcbiAgICAgICAgICAgICAgIGVsLl9pZCAhPT0gZmllbGRfaWQgKSA/IHRydWUgOiBmYWxzZSB9KVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyggICcgZmllbGQgd2l0aCBzdWNoIG5hbWUgZXhpc3RzICcgKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH07XHJcbiAgICBcclxuKi9cclxuXHJcbiAgICBcclxuXHJcbiAgICAvLyByZXR1cm4gdW5pcXVlIGlkXHJcbiAgICBjcmVhdGVfZ3VpZCgpIHtcclxuICAgICAgICBmdW5jdGlvbiBzNCgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoKDEgKyBNYXRoLnJhbmRvbSgpKSAqIDB4MTAwMDApXHJcbiAgICAgICAgICAgICAgICAudG9TdHJpbmcoMTYpXHJcbiAgICAgICAgICAgICAgICAuc3Vic3RyaW5nKDEpO1xyXG4gICAgICAgIH1cclxuIFx0ICAgIHJldHVybiBzNCgpICsgczQoKSArICctJyArIHM0KCkgKyAnLScgKyBzNCgpICsgJy0nICtcclxuICAgICAgICAgICAgICAgczQoKSArICctJyArIHM0KCkgKyBzNCgpICsgczQoKTtcclxuICAgIH07XHJcblxyXG4gICAgLy8gIFJldHVybnMgYSBkZWVwIGNvcHkgb2YgdGhlIG9iamVjdFxyXG4gICAgZGVlcENvcHkob2xkT2JqOiBhbnkpIHtcclxuICAgICAgICBsZXQgbmV3T2JqID0gb2xkT2JqO1xyXG4gICAgICAgIGlmIChvbGRPYmogJiYgdHlwZW9mIG9sZE9iaiA9PT0gXCJvYmplY3RcIikge1xyXG4gICAgICAgICAgICBuZXdPYmogPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2xkT2JqKSA9PT0gXCJbb2JqZWN0IEFycmF5XVwiID8gW10gOiB7fTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBvbGRPYmopIHtcclxuICAgICAgICAgICAgICAgIG5ld09ialtpXSA9IHRoaXMuZGVlcENvcHkob2xkT2JqW2ldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV3T2JqO1xyXG4gICAgfTtcclxuXHJcblxyXG5cclxuXHJcbn1cclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9

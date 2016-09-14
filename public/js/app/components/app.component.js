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
        return !!res;
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
    AppComponent.prototype.add_new_field = function () {
        console.log(this.new_field);
        if (!this.new_field.name) {
            this.set_error_msg('No field name was provided ');
            console.log('No name was provided ');
            return false;
        }
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
            this.set_error_msg(' Some component has this name ');
            console.log('Some component has this name');
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvYXBwLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEscUJBQTBCLGVBQWUsQ0FBQyxDQUFBO0FBRTFDLGdDQUE2Qiw2QkFBNkIsQ0FBQyxDQUFBO0FBQzNELG1DQUFnQyw2QkFBNkIsQ0FBQyxDQUFBO0FBVTlEO0lBUUkscUNBQXFDO0lBRXJDLHNCQUFtQixjQUE4QjtRQUE5QixtQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7UUFUakQsbURBQW1EO1FBQzVDLGVBQVUsR0FBRyxFQUFFLENBQUM7UUFDdkIsaUNBQWlDO1FBQzFCLGNBQVMsR0FBRyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsQ0FBQztRQUN0Qyx3QkFBd0I7UUFDakIsNEJBQXVCLEdBQUcsS0FBSyxDQUFDO1FBQ2hDLGtCQUFhLEdBQUcsRUFBRSxDQUFDO0lBRzBCLENBQUM7SUFFckQsK0JBQVEsR0FBUjtRQUNJLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDeEIsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7SUFDOUIsQ0FBQzs7SUFFRCx5Q0FBa0IsR0FBbEI7UUFBQSxpQkFNQztRQUxHLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFFO1lBQzFDLFNBQVMsQ0FBRSxVQUFBLEdBQUc7WUFDVixPQUFPLENBQUMsR0FBRyxDQUFFLFFBQVEsRUFBRyxHQUFHLENBQUUsQ0FBQztZQUM5QixFQUFFLENBQUEsQ0FBRSxDQUFDLEdBQUcsQ0FBQyxLQUFNLENBQUM7Z0JBQUMsS0FBSSxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDO1FBQ3RELENBQUMsQ0FBQyxDQUFDO0lBQ1gsQ0FBQzs7SUFFRCx1Q0FBZ0IsR0FBaEIsVUFBa0IsSUFBSTtRQUNsQixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztJQUM3QixDQUFDOztJQUNELGtEQUEyQixHQUEzQixVQUE2QixJQUFJ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QztZQUM1QixTQUFTLEVBQUUsQ0FBQyxnQ0FBYyxDQUFDO1lBQzNCLEtBQUssRUFBRSxDQUFDLHNDQUFpQixDQUFDO1NBQzdCLENBQUM7O29CQUFBO0lBK2JGLG1CQUFDO0FBQUQsQ0E5YkEsQUE4YkMsSUFBQTtBQTliWSxvQkFBWSxlQThieEIsQ0FBQSIsImZpbGUiOiJjb21wb25lbnRzL2FwcC5jb21wb25lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbmltcG9ydCB7U3RvcmFnZVNlcnZpY2V9IGZyb20gXCIuLi9zZXJ2aWNlcy9zdG9yYWdlLnNlcnZpY2VcIjtcclxuaW1wb3J0IHtPYmplY3RUb0FycmF5UGlwZX0gZnJvbSBcIi4uL3BpcGVzL29iamVjdFRvQXJyYXkucGlwZVwiO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgICBtb2R1bGVJZDogbW9kdWxlLmlkLCBcclxuICAgIHNlbGVjdG9yOiAnbXktYXBwJyxcclxuICAgIHRlbXBsYXRlVXJsOiAnYXBwLnRlbXBsYXRlLmh0bWwnLFxyXG4gICAgc3R5bGVVcmxzOiBbJ2FwcC5zdHlsZS5jc3MnXSxcclxuICAgIHByb3ZpZGVyczogW1N0b3JhZ2VTZXJ2aWNlXSxcclxuICAgIHBpcGVzOiBbT2JqZWN0VG9BcnJheVBpcGVdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBBcHBDb21wb25lbnQge1xyXG4gICAgLy9wdWJsaWMgbmV3X2NvbXBvbmVudCA9IHRoaXMuaW5pdF9uZXdfY29tcG9uZW50KCk7XHJcbiAgICBwdWJsaWMgY29tcG9uZW50cyA9IFtdO1xyXG4gICAgLy9wdWJsaWMgY29tcG9uZW50X2VkaXRhYmxlID0gW107XHJcbiAgICBwdWJsaWMgbmV3X2ZpZWxkID0geyB0eXBlOiBcInN0cmluZ1wiIH07ICAgXHJcbiAgICAvL3B1YmxpYyBuZXdfZ3JvdXAgPSBbXTtcclxuICAgIHB1YmxpYyBjb21wb25lbnRzX2N1cnJlbnRfdmlldyA9ICdhbGwnO1xyXG4gICAgcHVibGljIG5ld19jb21wb25lbnQgPSBbXTtcclxuICAgIC8vcHVibGljIGNyZWF0ZV9jb21wb25lbnRfZ3JvdXAgPSAnJztcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgc3RvcmFnZVNlcnZpY2U6IFN0b3JhZ2VTZXJ2aWNlKSB7fVxyXG5cclxuICAgIG5nT25Jbml0KCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCduZ09uSW5pdCcpO1xyXG4gICAgICAgIHRoaXMuZ2V0X2FsbF9jb21wb25lbnRzKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIGdldF9hbGxfY29tcG9uZW50cygpIHtcclxuICAgICAgICB0aGlzLnN0b3JhZ2VTZXJ2aWNlLnNlbGVjdCgnL2FwaS9jb21wb25lbnRzJyApLlxyXG4gICAgICAgICAgICBzdWJzY3JpYmUoIHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggJ2dldCAtICcgLCByZXMgKTtcclxuICAgICAgICAgICAgICAgIGlmKCAhcmVzLmVycm9yICkgdGhpcy5jb21wb25lbnRzID0gcmVzLmNvbXBvbmVudHM7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBzZXRfY3VycmVudF92aWV3KCB2aWV3ICl7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50X3ZpZXcgPSB2aWV3O1xyXG4gICAgfTtcclxuICAgIHNldF9jb21wb25lbnRzX2N1cnJlbnRfdmlldyggdmlldyApIHtcclxuICAgICAgICBpZiAoIHZpZXcgPT0gJ2FsbCcpIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdncm91cF9zZWxlY3QnKS52YWx1ZSA9ICdub25lJztcclxuICAgICAgICB0aGlzLmNvbXBvbmVudHNfY3VycmVudF92aWV3ID0gdmlldztcclxuICAgICAgICBjb25zb2xlLmxvZyggJyBjb21wb25lbnRzX2N1cnJlbnRfdmlldyAnLCB0aGlzLmNvbXBvbmVudHNfY3VycmVudF92aWV3ICk7ICAgICAgIFxyXG4gICAgfTtcclxuXHJcbiAgICBzZXRfbmV3X2NvbXBvbmVudF9ncm91cF9zZWxlY3QoIHZhbHVlICkge1xyXG4gICAgICAgIHRoaXMubmV3X2NvbXBvbmVudC5ncm91cCA9IHZhbHVlO1xyXG4gICAgfTtcclxuXHJcbiAgICBjaGFuZ2VfbmV3X2NvbXBvbmVudF9ncm91cCgpIHtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKCAna2V5dXAgdmFsICcsIHRoaXMuY3JlYXRlX2NvbXBvbmVudF9ncm91cCApO1xyXG4gICAgICAgIGxldCByZXMgPSBbMSwyLDMsNF0uZmluZCggZWwgPT4gZWwgPT0gdGhpcy5uZXdfY29tcG9uZW50Lmdyb3VwKSB8fCAnbm9uZScgO1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduZXdfY29tcG9uZW50X2dyb3VwX3NlbGVjdCcpLnZhbHVlID0gcmVzO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCAnbmV3X2NvbXBvbmVudF9ncm91cF9zZWxlY3QgJywgcmVzICk7IFxyXG4gICAgfTtcclxuXHJcbiAgICBjaG9vc2VuX21lbnUoIGEsIGIgKXtcclxuICAgICAgICBpZiAoIGEgPT0gYiApIHJldHVybiB0cnVlO1xyXG4gICAgfTtcclxuXHJcbiAgICBzZXRfZXJyb3JfbXNnKCBlcnJvcl9tc2cgKXtcclxuICAgICAgICB0aGlzLmVycm9yX21zZyA9IGVycm9yX21zZztcclxuICAgICAgICBzZXRUaW1lb3V0KCAoKT0+IHRoaXMuZXJyb3JfbXNnID0gJycsIDMwMDAgKTtcclxuICAgIH07XHJcblxyXG4gICAgaXNfY29tcG9uZW50X2V4aXN0KG5hbWUpe1xyXG4gICAgICAgIGxldCByZXMgPSB0aGlzLmNvbXBvbmVudHMuZmluZCggY29tcCA9PiBjb21wLm5hbWUgPT0gbmFtZSk7XHJcbiAgICAgICAgcmV0dXJuICEhcmVzO1xyXG4gICAgfTtcclxuXHJcbiAgICBzZXRfZWRpdF9jb21wb25lbnQoIGVkaXRfY29tcCApIHtcclxuICAgICAgICB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZSA9IGVkaXRfY29tcDtcclxuICAgICAgICB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZS5uZXdfbmFtZSA9IHRoaXMuY29tcG9uZW50X2VkaXRhYmxlLm5hbWU7XHJcbiAgICB9O1xyXG5cclxuICAgIHNldF9uZXdfZmllbGRfdHlwZSggdmFsdWUgKSB7XHJcbiAgICAgICAgdGhpcy5uZXdfZmllbGQudHlwZSA9IHZhbHVlO1xyXG4gICAgfTtcclxuXHJcbiAgICBhZGRfbmV3X2ZpZWxkKCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCB0aGlzLm5ld19maWVsZCApO1xyXG4gICAgICAgIGlmICggIXRoaXMubmV3X2ZpZWxkLm5hbWUgKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0X2Vycm9yX21zZyggJ05vIGZpZWxkIG5hbWUgd2FzIHByb3ZpZGVkICcgKTsgXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCAnTm8gbmFtZSB3YXMgcHJvdmlkZWQgJyApO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgfTtcclxuXHJcbiAgICBjcmVhdGVfY29tcG9uZW50KCl7XHJcbiAgICAgICAgaWYgKCAhIHRoaXMubmV3X2NvbXBvbmVudC5uYW1lICkge1xyXG4gICAgICAgICAgICB0aGlzLnNldF9lcnJvcl9tc2coICcgTm8gbmFtZSB3YXMgcHJvdmlkZWQgJyApO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyggJ05vIG5hbWUgd2FzIHByb3ZpZGVkICcgKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIHRoaXMuaXNfY29tcG9uZW50X2V4aXN0KHRoaXMubmV3X2NvbXBvbmVudC5uYW1lKSApIHtcclxuICAgICAgICAgICAgdGhpcy5zZXRfZXJyb3JfbXNnKCAnIFNvbWUgY29tcG9uZW50IGhhcyB0aGlzIG5hbWUgJyApOyBcclxuICAgICAgICAgICAgY29uc29sZS5sb2coICdTb21lIGNvbXBvbmVudCBoYXMgdGhpcyBuYW1lJyApO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7ICAgICAgICAgICBcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICggISB0aGlzLm5ld19jb21wb25lbnQuZ3JvdXAgKSB0aGlzLm5ld19jb21wb25lbnQuZ3JvdXAgPSAnbm9uZScgO1xyXG4gICAgICAgIGxldCBib2R5ID0gW107XHJcbiAgICAgICAgaWYgKCB0aGlzLm5ld19jb21wb25lbnQuZ3JvdXAgIT09ICdub25lJyApe1xyXG4gICAgICAgICAgICBsZXQgcmVzID0gdGhpcy5jb21wb25lbnRzLmZpbmQoIGNvbXAgPT4gY29tcC5ncm91cCA9PSB0aGlzLm5ld19jb21wb25lbnQuZ3JvdXApO1xyXG4gICAgICAgICAgICBpZiAoIHJlcyApIGJvZHkgPSByZXMuYm9keSA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnNvbGUubG9nKFxyXG4gICAgICAgICAgICB0aGlzLm5ld19jb21wb25lbnQubmFtZSxcclxuICAgICAgICAgICAgJyAnLFxyXG4gICAgICAgICAgICB0aGlzLm5ld19jb21wb25lbnQuZ3JvdXAsXHJcbiAgICAgICAgICAgICcgJyxcclxuICAgICAgICAgICAgYm9keVxyXG4gICAgICAgICk7XHJcblxyXG5cclxuICAgICAgICB0aGlzLnN0b3JhZ2VTZXJ2aWNlLmluc2VydCgnL2FwaS9jb21wb25lbnRzJywge1xyXG4gICAgICAgICAgICBuYW1lIDogdGhpcy5uZXdfY29tcG9uZW50Lm5hbWUsXHJcbiAgICAgICAgICAgIGdyb3VwIDogdGhpcy5uZXdfY29tcG9uZW50Lmdyb3VwIHx8ICdub25lJyxcclxuICAgICAgICAgICAgYm9keSA6IFtdXHJcbiAgICAgICAgIH0pLlxyXG4gICAgICAgICAgICBzdWJzY3JpYmUoIHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggJ3Bvc3QgLSAnICwgcmVzICk7XHJcbiAgICAgICAgICAgICAgICBpZiAoICFyZXMuZXJyb3IgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb21wb25lbnRzID0gcmVzLmNvbXBvbmVudHM7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGVkaXRfY29tcCA9IHRoaXMuY29tcG9uZW50cy5maW5kKCBjb21wID0+IGNvbXAubmFtZSA9PSB0aGlzLm5ld19jb21wb25lbnQubmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCBlZGl0X2NvbXAgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0X2NvbXBvbmVudHNfY3VycmVudF92aWV3KCdlZGl0LWNvbXBvbmVudCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldF9lZGl0X2NvbXBvbmVudCggZWRpdF9jb21wICk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcblxyXG4vKlxyXG5cclxuICAgIGluaXRfbmV3X2NvbXBvbmVudChtdXRhYmlsaXR5ID0gJycpe1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIG11dGFiaWxpdHkgOiBtdXRhYmlsaXR5XHJcbiAgICAgICAgfTtcclxuICAgIH07XHJcblxyXG4gICAgc2V0X25ld19jb21wb25lbnRfbXV0YWJpbGl0eShtdXRhYmlsaXR5KXtcclxuICAgICAgICB0aGlzLm5ld19jb21wb25lbnQgPSAgdGhpcy5pbml0X25ld19jb21wb25lbnQoIG11dGFiaWxpdHkgKTtcclxuICAgIH07XHJcblxyXG5cclxuICAgIGdldF9hbGxfY29tcG9uZW50cygpIHtcclxuICAgICAgICB0aGlzLnN0b3JhZ2VTZXJ2aWNlLnNlbGVjdCgnL2FwaS9jb21wb25lbnRzJyApLlxyXG4gICAgICAgICAgICBzdWJzY3JpYmUoIHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggJ2dldCAtICcgLCByZXMgKTtcclxuICAgICAgICAgICAgICAgIGlmKCAhcmVzLmVycm9yICkgdGhpcy5jb21wb25lbnRzID0gcmVzLmNvbXBvbmVudHM7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBjcmVhdGVfY29tcG9uZW50KCl7XHJcbiAgICAgICAgY29uc29sZS5sb2coIHRoaXMuY29tcG9uZW50cyApO1xyXG4gICAgICAgIGlmICggIXRoaXMubmV3X2NvbXBvbmVudC5uYW1lICkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyggJyBubyBuYW1lIHdhcyBwcm92aWRlZCAnKTtcclxuICAgICAgICAgICAgcmV0dXJuIDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCB0aGlzLmV4aXN0X2NvbXBvbmVudF93aGl0aF90aGlzX25hbWUoKSApIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coICcgY29tcG9uZW50IHdpdGggc3VjaCBuYW1lIGV4aXN0cyAnICk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zdG9yYWdlU2VydmljZS5pbnNlcnQoJy9hcGkvY29tcG9uZW50cycsIHtcclxuICAgICAgICAgICAgbmFtZSA6IHRoaXMubmV3X2NvbXBvbmVudC5uYW1lLFxyXG4gICAgICAgICAgICBncm91cCA6IHRoaXMubmV3X2NvbXBvbmVudC5ncm91cCB8fCAnJyxcclxuICAgICAgICAgICAgbXV0YWJpbGl0eSA6IHRoaXMubmV3X2NvbXBvbmVudC5tdXRhYmlsaXR5LFxyXG4gICAgICAgICAgICBib2R5IDogW11cclxuICAgICAgICAgfSkuXHJcbiAgICAgICAgICAgIHN1YnNjcmliZSggcmVzID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCAncG9zdCAtICcgLCByZXMgKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCByZXMubXNnICk7XHJcbiAgICAgICAgICAgICAgICBpZiAoICFyZXMuZXJyb3IgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb21wb25lbnRzID0gcmVzLmNvbXBvbmVudHM7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXdfY29tcG9uZW50ID0gdGhpcy5pbml0X25ld19jb21wb25lbnQodGhpcy5uZXdfY29tcG9uZW50Lm11dGFiaWxpdHkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgY2hhbmdlX2NvbXBvbmVudChjb21wb25lbnQpe1xyXG4gICAgICAgIGlmICggIWNvbXBvbmVudC5uZXdfbmFtZSApIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ25vIG5hbWUgd2FzIHByb3ZpZGVkICcpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKCB0aGlzLmV4aXN0X2NvbXBvbmVudF93aGl0aF90aGlzX25hbWUoY29tcG9uZW50Lm5ld19uYW1lKSApe1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyggJyBjb21wb25lbnQgd2l0aCBzdWNoIG5hbWUgZXhpc3RzICcgKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnN0b3JhZ2VTZXJ2aWNlLnVwZGF0ZSgnL2FwaS9jb21wb25lbnRzJyx7XHJcbiAgICAgICAgICAgIGlkIDogY29tcG9uZW50Ll9pZCxcclxuICAgICAgICAgICAgbmFtZSA6IGNvbXBvbmVudC5uZXdfbmFtZSxcclxuICAgICAgICAgICAgZ3JvdXAgOiBjb21wb25lbnQuZ3JvdXAsXHJcbiAgICAgICAgICAgIG11dGFiaWxpdHkgOiB0aGlzLm5ld19jb21wb25lbnQubXV0YWJpbGl0eSxcclxuICAgICAgICAgICAgYm9keSA6IGNvbXBvbmVudC5ib2R5XHJcbiAgICAgICAgfSkuXHJcbiAgICAgICAgICAgIHN1YnNjcmliZSggcmVzID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCAncHV0IC0gJyAsIHJlcyApO1xyXG4gICAgICAgICAgICAgICAgaWYgKCAhcmVzLmVycm9yICkgdGhpcy5jb21wb25lbnRzID0gcmVzLmNvbXBvbmVudHM7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGNvcHlfY29tcG9uZW50KGNvbXBvbmVudCkge1xyXG4gICAgICAgIGlmICggIWNvbXBvbmVudC5uZXdfbmFtZSApIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coICdubyBuYW1lIHdhcyBwcm92aWRlZCAnICk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoIHRoaXMuZXhpc3RfY29tcG9uZW50X3doaXRoX3RoaXNfbmFtZShjb21wb25lbnQubmV3X25hbWUpICl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCAnIGNvbXBvbmVudCB3aXRoIHN1Y2ggbmFtZSBleGlzdHMgJyApO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc3RvcmFnZVNlcnZpY2UuaW5zZXJ0KCcvYXBpL2NvbXBvbmVudHMnLCB7XHJcbiAgICAgICAgICAgIG5hbWUgOiBjb21wb25lbnQubmV3X25hbWUsXHJcbiAgICAgICAgICAgIGdyb3VwIDogY29tcG9uZW50Lmdyb3VwLFxyXG4gICAgICAgICAgICBtdXRhYmlsaXR5IDogY29tcG9uZW50Lm11dGFiaWxpdHksXHJcbiAgICAgICAgICAgIGJvZHkgOiBjb21wb25lbnQuYm9keVxyXG4gICAgICAgICB9KS5cclxuICAgICAgICAgICAgc3Vic2NyaWJlKCByZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coICdwb3N0IC0gJyAsIHJlcyApO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coIHJlcy5tc2cgKTtcclxuICAgICAgICAgICAgICAgIGlmICggIXJlcy5lcnJvciApIHRoaXMuY29tcG9uZW50cyA9IHJlcy5jb21wb25lbnRzO1xyXG4gICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgZGVsZXRlX2NvbXBvbmVudChpZCkge1xyXG4gICAgICAgIGlmICggIWlkICkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnbm8gaWQgd2FzIHByb3ZpZGVkICcpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc3RvcmFnZVNlcnZpY2UuZGVsZXRlKCcvYXBpL2NvbXBvbmVudHMnLCBpZCkuXHJcbiAgICAgICAgICAgIHN1YnNjcmliZSggcmVzID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCAnZGVsZXRlIC0gJyAsIHJlcyApO1xyXG4gICAgICAgICAgICAgICAgaWYgKCAhcmVzLmVycm9yICkgdGhpcy5jb21wb25lbnRzID0gcmVzLmNvbXBvbmVudHM7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBleGlzdF9jb21wb25lbnRfd2hpdGhfdGhpc19uYW1lKG5hbWUgPSB0aGlzLm5ld19jb21wb25lbnQubmFtZSl7XHJcbiAgICAgICAgaWYoXHJcbiAgICAgICAgICAgIHRoaXMuY29tcG9uZW50cy5maW5kKGVsID0+IHsgcmV0dXJuIGVsLm5hbWUgPT09IG5hbWUgPyB0cnVlIDogZmFsc2UgfSlcclxuICAgICAgICAgICAgKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9O1xyXG5cclxuICAgIGVkaXRfZmllbGRzX2NvbXBvbmVudChjb21wb25lbnQpe1xyXG4gICAgICAgIHRoaXMubmV3X2ZpZWxkID0geyB0eXBlOiBcInN0cmluZ1wiIH07IFxyXG4gICAgICAgIGNvbnNvbGUubG9nKCB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZSwgY29tcG9uZW50ICk7XHJcbiAgICAgICAgaWYgKCB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZS5faWQgIT0gY29tcG9uZW50Ll9pZCkgIHsgXHJcbiAgICAgICAgICAgIHRoaXMuY29tcG9uZW50X2VkaXRhYmxlID0gY29tcG9uZW50O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29tcG9uZW50X2VkaXRhYmxlID0gW107XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgc2hvd19maWVsZHNfY29tcG9uZW50KGNvbXBvbmVudCl7XHJcbiAgICAgICAgaWYgKCAgdGhpcy5jb21wb25lbnRfZWRpdGFibGUgJiZcclxuICAgICAgICAgICAgICB0aGlzLmNvbXBvbmVudF9lZGl0YWJsZS5faWQgPT09IGNvbXBvbmVudC5faWQgXHJcbiAgICAgICAgKSByZXR1cm4gdHJ1ZTtcclxuICAgIH07IFxyXG5cclxuICAgIGFkZF9maWVsZCggY29tcG9uZW50LCBuZXdfZmllbGQgPSB7fSApe1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coIGNvbXBvbmVudCwgbmV3X2ZpZWxkICk7XHJcbiAgICAgICAgaWYgKCAhbmV3X2ZpZWxkLm5hbWUgKSByZXR1cm47XHJcbiAgICAgICAgaWYgKCB0aGlzLmV4aXN0X2ZpZWxkX3dpdGhfdGhpc19uYW1lKGNvbXBvbmVudCwgbmV3X2ZpZWxkLm5hbWUpICkgcmV0dXJuIDtcclxuICAgICAgICB0aGlzLm5ld19maWVsZCA9IHsgdHlwZTogXCJzdHJpbmdcIiB9OyBcclxuICAgICAgICBuZXdfZmllbGQuX2lkID0gdGhpcy5jcmVhdGVfZ3VpZCgpOyAgICAgICAgXHJcbiAgICAgICAgY29tcG9uZW50LmJvZHkgPSBbIC4uLiBjb21wb25lbnQuYm9keSAsIG5ld19maWVsZCBdO1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coIGNvbXBvbmVudC5ib2R5ICk7XHJcbiAgICAgICAgdGhpcy5zdG9yYWdlU2VydmljZS51cGRhdGUoJy9hcGkvY29tcG9uZW50cycse1xyXG4gICAgICAgICAgICBpZCA6IGNvbXBvbmVudC5faWQsXHJcbiAgICAgICAgICAgIG5hbWUgOiBjb21wb25lbnQubmFtZSxcclxuICAgICAgICAgICAgZ3JvdXAgOiBjb21wb25lbnQuZ3JvdXAsXHJcbiAgICAgICAgICAgIG11dGFiaWxpdHkgOiBjb21wb25lbnQubXV0YWJpbGl0eSxcclxuICAgICAgICAgICAgYm9keSA6IGNvbXBvbmVudC5ib2R5XHJcbiAgICAgICAgfSkuXHJcbiAgICAgICAgICAgIHN1YnNjcmliZSggcmVzID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCAncHV0IC0gJyAsIHJlcyApO1xyXG4gICAgICAgICAgICAgICAgaWYgKCAhcmVzLmVycm9yICkgdGhpcy5jb21wb25lbnRzID0gcmVzLmNvbXBvbmVudHM7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBpZl9udW1iZXJfZmllbGQodmFsKXtcclxuICAgICAgICB2YWwgPSBOdW1iZXIodmFsKTtcclxuICAgICAgICByZXR1cm4gdmFsID8gdmFsIDogMCA7XHJcbiAgICB9O1xyXG5cclxuICAgIGlmX2NvbXBvbmVudF9maWVsZChjb21wb25lbnQsIHZhbCl7XHJcbiAgICAgICAgbGV0IHJlcyA9IFtdO1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coY29tcG9uZW50LCB2YWwpO1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50cy5maW5kKGVsID0+IHsgXHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coIGVsLm5hbWUgKTtcclxuICAgICAgICAgICAgaWYgKCBlbC5uYW1lID09PSB2YWwgJiZcclxuICAgICAgICAgICAgICAgY29tcG9uZW50Lm5hbWUgIT09IHZhbCApIHtcclxuICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coICdyZXMgJywgZWwgKTtcclxuICAgICAgICAgICAgICAgICAgIHJlcyA9ICBlbDtcclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCAnIC8vLy8vLy8vLy8vLy8vLy8gJyk7ICAgICAgICAgICAgICAgIFxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgcmV0dXJuIHJlcztcclxuICAgIH07XHJcblxyXG4gICAgY2hhbmdlX2ZpZWxkKCBzZXR0aW5ncyA9IHt9ICl7XHJcbiAgICAgICAgbGV0IGNvbXBvbmVudCA9IHNldHRpbmdzLmNvbXBvbmVudDtcclxuICAgICAgICBsZXQgZmllbGQgPSBzZXR0aW5ncy5maWVsZDtcclxuXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhjb21wb25lbnQsIGZpZWxkKTtcclxuICAgICAgICBpZiAoIHRoaXMuZXhpc3RfZmllbGRfd2l0aF90aGlzX25hbWUoY29tcG9uZW50LCBmaWVsZC5lZGl0X25hbWUsIGZpZWxkLl9pZCApICkgcmV0dXJuO1xyXG4gICAgICAgIGlmICggc2V0dGluZ3MudHlwZSA9PSAnbnVtYmVyJyApIHtcclxuICAgICAgICAgICAgZmllbGQuZWRpdF92YWx1ZSA9IHRoaXMuaWZfbnVtYmVyX2ZpZWxkKGZpZWxkLmVkaXRfdmFsdWVfbmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICggc2V0dGluZ3MudHlwZSA9PSAnY29tcG9uZW50JyApIHtcclxuICAgICAgICAgICAgZmllbGQuY29tcG9uZW50X3ZhbHVlID0gdGhpcy5pZl9jb21wb25lbnRfZmllbGQoY29tcG9uZW50LCBmaWVsZC5lZGl0X3ZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZmllbGQubmFtZSA9IGZpZWxkLmVkaXRfbmFtZSB8fCBmaWVsZC5uYW1lO1xyXG4gICAgICAgIGZpZWxkLnZhbHVlID0gZmllbGQuZWRpdF92YWx1ZTtcclxuICAgICAgICBkZWxldGUgZmllbGQuZWRpdF9uYW1lO1xyXG4gICAgICAgIGRlbGV0ZSBmaWVsZC5lZGl0X3ZhbHVlO1xyXG4gICAgICAgIGRlbGV0ZSBmaWVsZC5hc3NpZ25tZW50O1xyXG5cclxuICAgICAgICB0aGlzLnN0b3JhZ2VTZXJ2aWNlLnVwZGF0ZSgnL2FwaS9jb21wb25lbnRzJyx7XHJcbiAgICAgICAgICAgIGlkIDogY29tcG9uZW50Ll9pZCxcclxuICAgICAgICAgICAgbmFtZSA6IGNvbXBvbmVudC5uYW1lLFxyXG4gICAgICAgICAgICBncm91cCA6IGNvbXBvbmVudC5ncm91cCxcclxuICAgICAgICAgICAgbXV0YWJpbGl0eSA6IGNvbXBvbmVudC5tdXRhYmlsaXR5LFxyXG4gICAgICAgICAgICBib2R5IDogY29tcG9uZW50LmJvZHlcclxuICAgICAgICB9KS5cclxuICAgICAgICAgICAgc3Vic2NyaWJlKCByZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coICdwdXQgLSAnICwgcmVzICk7XHJcbiAgICAgICAgICAgICAgICBpZiAoICFyZXMuZXJyb3IgKSB0aGlzLmNvbXBvbmVudHMgPSByZXMuY29tcG9uZW50cztcclxuICAgICAgICB9KTtcclxuICAgICAgICBcclxuICAgIH07XHJcblxyXG4gICAgY29weV9maWVsZCggc2V0dGluZ3MgPSB7fSApe1xyXG4gICAgICAgIGxldCBjb21wb25lbnQgPSBzZXR0aW5ncy5jb21wb25lbnQ7XHJcbiAgICAgICAgbGV0IGZpZWxkID0gc2V0dGluZ3MuZmllbGQ7XHJcbiAgICAgICAgY29uc29sZS5sb2coY29tcG9uZW50LCBmaWVsZCk7XHJcbiAgICAgICAgaWYgKCAhZmllbGQuZWRpdF9uYW1lICkgcmV0dXJuO1xyXG4gICAgICAgIGlmICggdGhpcy5leGlzdF9maWVsZF93aXRoX3RoaXNfbmFtZShjb21wb25lbnQsIGZpZWxkLmVkaXRfbmFtZSwgZmllbGQuX2lkICkgKSByZXR1cm47XHJcbiAgICAgICAgbGV0IG5ld19maWVsZCA9IHRoaXMuZGVlcENvcHkoZmllbGQpO1xyXG4gICAgICAgIG5ld19maWVsZC5faWQgPSB0aGlzLmNyZWF0ZV9ndWlkKCk7XHJcbiAgICAgICAgbmV3X2ZpZWxkLm5hbWUgPSBuZXdfZmllbGQuZWRpdF9uYW1lO1xyXG4gICAgICAgIG5ld19maWVsZC52YWx1ZSA9ICcnO1xyXG4gICAgICAgIGlmICggc2V0dGluZ3MudHlwZSA9PSAnbnVtYmVyJyApIHtcclxuICAgICAgICAgICAgbmV3X2ZpZWxkLnZhbHVlPSB0aGlzLmlmX251bWJlcl9maWVsZChuZXdfZmllbGQudmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIHNldHRpbmdzLnR5cGUgPT0gJ2NvbXBvbmVudCcgKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaWZfY29tcG9uZW50X2ZpZWxkKGNvbXBvbmVudCwgbmV3X2ZpZWxkLnZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZGVsZXRlIG5ld19maWVsZC5lZGl0X25hbWU7XHJcbiAgICAgICAgZGVsZXRlIG5ld19maWVsZC5lZGl0X3ZhbHVlO1xyXG4gICAgICAgIGRlbGV0ZSBuZXdfZmllbGQuYXNzaWdubWVudDtcclxuICAgICAgICBjb21wb25lbnQuYm9keSA9IFsgLi4uIGNvbXBvbmVudC5ib2R5ICwgbmV3X2ZpZWxkIF07XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyggbmV3X2ZpZWxkICk7XHJcbiAgICAgICAgdGhpcy5zdG9yYWdlU2VydmljZS51cGRhdGUoJy9hcGkvY29tcG9uZW50cycse1xyXG4gICAgICAgICAgICBpZCA6IGNvbXBvbmVudC5faWQsXHJcbiAgICAgICAgICAgIG5hbWUgOiBjb21wb25lbnQubmFtZSxcclxuICAgICAgICAgICAgZ3JvdXAgOiBjb21wb25lbnQuZ3JvdXAsXHJcbiAgICAgICAgICAgIG11dGFiaWxpdHkgOiBjb21wb25lbnQubXV0YWJpbGl0eSxcclxuICAgICAgICAgICAgYm9keSA6IGNvbXBvbmVudC5ib2R5XHJcbiAgICAgICAgfSkuXHJcbiAgICAgICAgICAgIHN1YnNjcmliZSggcmVzID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCAncHV0IC0gJyAsIHJlcyApO1xyXG4gICAgICAgICAgICAgICAgaWYgKCAhcmVzLmVycm9yICkgdGhpcy5jb21wb25lbnRzID0gcmVzLmNvbXBvbmVudHM7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGRlbGV0ZV9maWVsZCggc2V0dGluZ3MgPSB7fSApe1xyXG4gICAgICAgIGxldCBjb21wb25lbnQgPSBzZXR0aW5ncy5jb21wb25lbnQ7XHJcbiAgICAgICAgbGV0IGZpZWxkID0gc2V0dGluZ3MuZmllbGQ7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhjb21wb25lbnQsIGZpZWxkKTtcclxuICAgICAgICBpZiAoICFjb21wb25lbnQgfHwgIWZpZWxkICkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyggJ25vIGNvbXBvbmVudCBvciBmaWVsZCcpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbXBvbmVudC5ib2R5LmZvckVhY2goIChlbCwgaWR4LCBhcnIpID0+IHsgXHJcbiAgICAgICAgICAgIGlmKGVsLl9pZCA9PT0gZmllbGQuX2lkICkge1xyXG4gICAgICAgICAgICAgICAgYXJyLnNwbGljZShpZHgsIDEpO1xyXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyggYXJyLCBpZHggKTtcclxuICAgICAgICAgICAgfSBcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnN0b3JhZ2VTZXJ2aWNlLnVwZGF0ZSgnL2FwaS9jb21wb25lbnRzJyx7XHJcbiAgICAgICAgICAgIGlkIDogY29tcG9uZW50Ll9pZCxcclxuICAgICAgICAgICAgbmFtZSA6IGNvbXBvbmVudC5uYW1lLFxyXG4gICAgICAgICAgICBncm91cCA6IGNvbXBvbmVudC5ncm91cCxcclxuICAgICAgICAgICAgbXV0YWJpbGl0eSA6IGNvbXBvbmVudC5tdXRhYmlsaXR5LFxyXG4gICAgICAgICAgICBib2R5IDogY29tcG9uZW50LmJvZHlcclxuICAgICAgICB9KS5cclxuICAgICAgICAgICAgc3Vic2NyaWJlKCByZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coICdwdXQgLSAnICwgcmVzICk7XHJcbiAgICAgICAgICAgICAgICBpZiAoICFyZXMuZXJyb3IgKSB0aGlzLmNvbXBvbmVudHMgPSByZXMuY29tcG9uZW50cztcclxuICAgICAgICB9KTtcclxuICAgICAgICBcclxuICAgIH07XHJcblxyXG4gICAgdmFsdWVfYXNzaWdubWVudChmaWVsZCl7XHJcbiAgICAgICAgaWYgKCAgIWZpZWxkLmFzc2lnbm1lbnQgKXtcclxuICAgICAgICAgICAgaWYgKCBmaWVsZC50eXBlID09ICdjb21wb25lbnQnICkge1xyXG4gICAgICAgICAgICAgICAgZmllbGQuY29tcG9uZW50X3ZhbHVlID0gZmllbGQuY29tcG9uZW50X3ZhbHVlIHx8IFtdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZpZWxkLmVkaXRfdmFsdWUgPSBmaWVsZC52YWx1ZTtcclxuICAgICAgICAgICAgZmllbGQuYXNzaWdubWVudCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfTtcclxuXHJcbiAgICBleGlzdF9maWVsZF93aXRoX3RoaXNfbmFtZShjb21wb25lbnQsIGZpZWxkX25hbWUsIGZpZWxkX2lkICl7XHJcbiAgICAgICAgaWYgKCAhY29tcG9uZW50IHx8XHJcbiAgICAgICAgICAgICAhY29tcG9uZW50LmJvZHkgXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCcgZmllbGRzIHdhcyBub3QgcHJvdmlkZWQgJyk7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihcclxuICAgICAgICAgICAgY29tcG9uZW50LmJvZHkuZmluZChlbCA9PiB7IHJldHVybiAoZWwubmFtZSA9PT0gZmllbGRfbmFtZSAmJlxyXG4gICAgICAgICAgICAgICBlbC5faWQgIT09IGZpZWxkX2lkICkgPyB0cnVlIDogZmFsc2UgfSlcclxuICAgICAgICApIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coICAnIGZpZWxkIHdpdGggc3VjaCBuYW1lIGV4aXN0cyAnICk7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9O1xyXG4gICAgXHJcbiovXHJcblxyXG4gICAgXHJcblxyXG4gICAgLy8gcmV0dXJuIHVuaXF1ZSBpZFxyXG4gICAgY3JlYXRlX2d1aWQoKSB7XHJcbiAgICAgICAgZnVuY3Rpb24gczQoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBNYXRoLmZsb29yKCgxICsgTWF0aC5yYW5kb20oKSkgKiAweDEwMDAwKVxyXG4gICAgICAgICAgICAgICAgLnRvU3RyaW5nKDE2KVxyXG4gICAgICAgICAgICAgICAgLnN1YnN0cmluZygxKTtcclxuICAgICAgICB9XHJcbiBcdCAgICByZXR1cm4gczQoKSArIHM0KCkgKyAnLScgKyBzNCgpICsgJy0nICsgczQoKSArICctJyArXHJcbiAgICAgICAgICAgICAgIHM0KCkgKyAnLScgKyBzNCgpICsgczQoKSArIHM0KCk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8vICBSZXR1cm5zIGEgZGVlcCBjb3B5IG9mIHRoZSBvYmplY3RcclxuICAgIGRlZXBDb3B5KG9sZE9iajogYW55KSB7XHJcbiAgICAgICAgbGV0IG5ld09iaiA9IG9sZE9iajtcclxuICAgICAgICBpZiAob2xkT2JqICYmIHR5cGVvZiBvbGRPYmogPT09IFwib2JqZWN0XCIpIHtcclxuICAgICAgICAgICAgbmV3T2JqID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9sZE9iaikgPT09IFwiW29iamVjdCBBcnJheV1cIiA/IFtdIDoge307XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgaW4gb2xkT2JqKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdPYmpbaV0gPSB0aGlzLmRlZXBDb3B5KG9sZE9ialtpXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5ld09iajtcclxuICAgIH07XHJcblxyXG5cclxuXHJcblxyXG59XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==

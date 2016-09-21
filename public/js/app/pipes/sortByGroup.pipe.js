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
var sortByGroupPipe = (function () {
    function sortByGroupPipe() {
    }
    sortByGroupPipe.prototype.transform = function (value, args) {
        //console.log( args );
        if (!args || !args.sort || !args.view || args.view == 'all')
            return value;
        //console.log( ' aFTER IF 'el.group , args.sort  );
        var arr = [];
        value.forEach(function (el) {
            if (el.group == args.sort)
                arr = arr.concat([el]);
        });
        return arr;
    };
    sortByGroupPipe = __decorate([
        core_1.Pipe({ name: 'sortByGroup' }), 
        __metadata('design:paramtypes', [])
    ], sortByGroupPipe);
    return sortByGroupPipe;
}());
exports.sortByGroupPipe = sortByGroupPipe;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBpcGVzL3NvcnRCeUdyb3VwLnBpcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUNBLHFCQUFxQixlQUFlLENBQUMsQ0FBQTtBQUlyQztJQUFBO0lBZ0JBLENBQUM7SUFmQyxtQ0FBUyxHQUFULFVBQVksS0FBSyxFQUFFLElBQUk7UUFFckIsc0JBQXNCO1FBRXRCLEVBQUUsQ0FBQyxDQUFFLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxLQUFNLENBQUM7WUFBQyxNQUFNLENBQUMsS0FBSyxDQUFDO1FBRTVFLG1EQUFtRDtRQUVuRCxJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUM7UUFDYixLQUFLLENBQUMsT0FBTyxDQUFDLFVBQVMsRUFBRTtZQUNyQixFQUFFLENBQUMsQ0FBRSxFQUFFLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxJQUFLLENBQUM7Z0JBQUMsR0FBRyxHQUFRLEdBQUcsU0FBRyxFQUFFLEVBQUUsQ0FBQztRQUN2RCxDQUFDLENBQUMsQ0FBQztRQUNILE1BQU0sQ0FBQyxHQUFHLENBQUM7SUFFYixDQUFDO0lBaEJIO1FBQUMsV0FBSSxDQUFDLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRSxDQUFDOzt1QkFBQTtJQWlCOUIsc0JBQUM7QUFBRCxDQWhCQSxBQWdCQyxJQUFBO0FBaEJZLHVCQUFlLGtCQWdCM0IsQ0FBQSIsImZpbGUiOiJwaXBlcy9zb3J0QnlHcm91cC5waXBlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbmltcG9ydCB7IFBpcGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcblxyXG5AUGlwZSh7IG5hbWU6ICdzb3J0QnlHcm91cCcgfSlcclxuZXhwb3J0IGNsYXNzIHNvcnRCeUdyb3VwUGlwZSB7XHJcbiAgdHJhbnNmb3JtICggdmFsdWUsIGFyZ3MgKSB7XHJcblxyXG4gICAgLy9jb25zb2xlLmxvZyggYXJncyApO1xyXG5cclxuICAgIGlmICggIWFyZ3MgfHwgIWFyZ3Muc29ydCB8fCAhYXJncy52aWV3IHx8IGFyZ3MudmlldyA9PSAnYWxsJyApIHJldHVybiB2YWx1ZTtcclxuXHJcbiAgICAvL2NvbnNvbGUubG9nKCAnIGFGVEVSIElGICdlbC5ncm91cCAsIGFyZ3Muc29ydCAgKTtcclxuXHJcbiAgICBsZXQgYXJyID0gW107XHJcbiAgICB2YWx1ZS5mb3JFYWNoKGZ1bmN0aW9uKGVsKXtcclxuICAgICAgICBpZiAoIGVsLmdyb3VwID09IGFyZ3Muc29ydCApIGFyciA9IFsgLi4uYXJyICwgZWwgXTtcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIGFycjtcclxuICAgIFxyXG4gIH1cclxufSJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==

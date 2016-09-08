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
/*
  # Description:

  Repackages an array subset as a new array.

  **Reasoning:**

  Angular2's change checker freaks out when you ngFor an array that's a subset
    of a larger data structure.

  # Usage:
  ``
  <div *ng-for="#value of objectOfObjects | objectToArray"> </div>
  ``
*/
var ObjectToArrayPipe = (function () {
    function ObjectToArrayPipe() {
    }
    ObjectToArrayPipe.prototype.transform = function (value, args) {
        var arr = [];
        if (typeof value == "object") {
            for (var p in value) {
                arr.push(value[p]);
            }
        }
        return arr;
    };
    ObjectToArrayPipe = __decorate([
        core_1.Pipe({ name: 'objectToArray' }), 
        __metadata('design:paramtypes', [])
    ], ObjectToArrayPipe);
    return ObjectToArrayPipe;
}());
exports.ObjectToArrayPipe = ObjectToArrayPipe;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBpcGVzL29iamVjdFRvQXJyYXkucGlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQ0EscUJBQXFCLGVBQWUsQ0FBQyxDQUFBO0FBRXJDOzs7Ozs7Ozs7Ozs7OztFQWNFO0FBRUY7SUFBQTtJQVdBLENBQUM7SUFWQyxxQ0FBUyxHQUFULFVBQVcsS0FBSyxFQUFFLElBQUk7UUFDcEIsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDO1FBQ2IsRUFBRSxDQUFBLENBQUUsT0FBTyxLQUFLLElBQUksUUFBUyxDQUFDLENBQUMsQ0FBQztZQUM5QixHQUFHLENBQUMsQ0FBRSxJQUFJLENBQUMsSUFBSSxLQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUN0QixHQUFHLENBQUMsSUFBSSxDQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBRSxDQUFDO1lBQ3ZCLENBQUM7UUFDSCxDQUFDO1FBRUQsTUFBTSxDQUFDLEdBQUcsQ0FBQztJQUNiLENBQUM7SUFYSDtRQUFDLFdBQUksQ0FBQyxFQUFFLElBQUksRUFBRSxlQUFlLEVBQUUsQ0FBQzs7eUJBQUE7SUFZaEMsd0JBQUM7QUFBRCxDQVhBLEFBV0MsSUFBQTtBQVhZLHlCQUFpQixvQkFXN0IsQ0FBQSIsImZpbGUiOiJwaXBlcy9vYmplY3RUb0FycmF5LnBpcGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuaW1wb3J0IHsgUGlwZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuLypcclxuICAjIERlc2NyaXB0aW9uOlxyXG5cclxuICBSZXBhY2thZ2VzIGFuIGFycmF5IHN1YnNldCBhcyBhIG5ldyBhcnJheS5cclxuXHJcbiAgKipSZWFzb25pbmc6KipcclxuXHJcbiAgQW5ndWxhcjIncyBjaGFuZ2UgY2hlY2tlciBmcmVha3Mgb3V0IHdoZW4geW91IG5nRm9yIGFuIGFycmF5IHRoYXQncyBhIHN1YnNldFxyXG4gICAgb2YgYSBsYXJnZXIgZGF0YSBzdHJ1Y3R1cmUuXHJcblxyXG4gICMgVXNhZ2U6XHJcbiAgYGBcclxuICA8ZGl2ICpuZy1mb3I9XCIjdmFsdWUgb2Ygb2JqZWN0T2ZPYmplY3RzIHwgb2JqZWN0VG9BcnJheVwiPiA8L2Rpdj5cclxuICBgYFxyXG4qL1xyXG5AUGlwZSh7IG5hbWU6ICdvYmplY3RUb0FycmF5JyB9KVxyXG5leHBvcnQgY2xhc3MgT2JqZWN0VG9BcnJheVBpcGUge1xyXG4gIHRyYW5zZm9ybSAodmFsdWUsIGFyZ3MpIHtcclxuICAgIHZhciBhcnIgPSBbXTtcclxuICAgIGlmKCB0eXBlb2YgdmFsdWUgPT0gXCJvYmplY3RcIiApIHtcclxuICAgICAgZm9yICggdmFyIHAgaW4gdmFsdWUgKSB7XHJcbiAgICAgICAgYXJyLnB1c2goIHZhbHVlW3BdICk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYXJyO1xyXG4gIH1cclxufSJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==

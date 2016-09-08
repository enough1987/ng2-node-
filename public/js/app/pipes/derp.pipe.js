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
  <div *ng-for="#value of arrayOfObjects | derp"> </div>
  ``
*/
var DerpPipe = (function () {
    function DerpPipe() {
    }
    DerpPipe.prototype.transform = function (value, args) {
        var arr = [];
        if (typeof value == "object") {
            for (var p in value) {
                arr.push(value[p]);
            }
        }
        return arr;
    };
    DerpPipe = __decorate([
        core_1.Pipe({ name: 'derp' }), 
        __metadata('design:paramtypes', [])
    ], DerpPipe);
    return DerpPipe;
}());
exports.DerpPipe = DerpPipe;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBpcGVzL2RlcnAucGlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQ0EscUJBQXFCLGVBQWUsQ0FBQyxDQUFBO0FBRXJDOzs7Ozs7Ozs7Ozs7OztFQWNFO0FBRUY7SUFBQTtJQVdBLENBQUM7SUFWQyw0QkFBUyxHQUFULFVBQVcsS0FBSyxFQUFFLElBQUk7UUFDcEIsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDO1FBQ2IsRUFBRSxDQUFBLENBQUUsT0FBTyxLQUFLLElBQUksUUFBUyxDQUFDLENBQUMsQ0FBQztZQUM5QixHQUFHLENBQUMsQ0FBRSxJQUFJLENBQUMsSUFBSSxLQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUN0QixHQUFHLENBQUMsSUFBSSxDQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBRSxDQUFDO1lBQ3ZCLENBQUM7UUFDSCxDQUFDO1FBRUQsTUFBTSxDQUFDLEdBQUcsQ0FBQztJQUNiLENBQUM7SUFYSDtRQUFDLFdBQUksQ0FBQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsQ0FBQzs7Z0JBQUE7SUFZdkIsZUFBQztBQUFELENBWEEsQUFXQyxJQUFBO0FBWFksZ0JBQVEsV0FXcEIsQ0FBQSIsImZpbGUiOiJwaXBlcy9kZXJwLnBpcGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuaW1wb3J0IHsgUGlwZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuLypcclxuICAjIERlc2NyaXB0aW9uOlxyXG5cclxuICBSZXBhY2thZ2VzIGFuIGFycmF5IHN1YnNldCBhcyBhIG5ldyBhcnJheS5cclxuXHJcbiAgKipSZWFzb25pbmc6KipcclxuXHJcbiAgQW5ndWxhcjIncyBjaGFuZ2UgY2hlY2tlciBmcmVha3Mgb3V0IHdoZW4geW91IG5nRm9yIGFuIGFycmF5IHRoYXQncyBhIHN1YnNldFxyXG4gICAgb2YgYSBsYXJnZXIgZGF0YSBzdHJ1Y3R1cmUuXHJcblxyXG4gICMgVXNhZ2U6XHJcbiAgYGBcclxuICA8ZGl2ICpuZy1mb3I9XCIjdmFsdWUgb2YgYXJyYXlPZk9iamVjdHMgfCBkZXJwXCI+IDwvZGl2PlxyXG4gIGBgXHJcbiovXHJcbkBQaXBlKHsgbmFtZTogJ2RlcnAnIH0pXHJcbmV4cG9ydCBjbGFzcyBEZXJwUGlwZSB7XHJcbiAgdHJhbnNmb3JtICh2YWx1ZSwgYXJncykge1xyXG4gICAgdmFyIGFyciA9IFtdO1xyXG4gICAgaWYoIHR5cGVvZiB2YWx1ZSA9PSBcIm9iamVjdFwiICkge1xyXG4gICAgICBmb3IgKCB2YXIgcCBpbiB2YWx1ZSApIHtcclxuICAgICAgICBhcnIucHVzaCggdmFsdWVbcF0gKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBhcnI7XHJcbiAgfVxyXG59XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==

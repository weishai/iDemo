/*! demo 2014-04-02 */
!function(a){"use strict";function b(a,b){for(var c in b)b.hasOwnProperty(c)&&(a[c]=b[c]);return a}function c(a,c){this.el=a,this.options=b({},this.options),b(this.options,c),this._init()}c.prototype.options={start:0},c.prototype._init=function(){this.tabs=[].slice.call(this.el.querySelectorAll("nav > ul > li")),this.items=[].slice.call(this.el.querySelectorAll(".content > section")),this.current=-1,this._show(),this._initEvents()},c.prototype._initEvents=function(){var a=this;this.tabs.forEach(function(b,c){b.addEventListener("click",function(b){b.preventDefault(),a._show(c)})})},c.prototype._show=function(a){this.current>=0&&(this.tabs[this.current].className="",this.items[this.current].className=""),this.current=void 0!=a?a:this.options.start>=0&&this.options.start<this.items.length?this.options.start:0,this.tabs[this.current].className="tab-current",this.items[this.current].className="content-current"},a.CBPFWTabs=c}(window);
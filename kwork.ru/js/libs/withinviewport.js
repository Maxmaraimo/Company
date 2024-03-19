/**
 * Within Viewport
 *
 * @description Determines whether an element is completely within the browser viewport
 * @author      Craig Patik, http://patik.com/
 * @version     2.0.0
 * @date        2016-12-19
 */
!function(t,e,o){"function"==typeof define&&define.amd?define([],o):"undefined"!=typeof module&&"object"==typeof exports?module.exports=o():t[e]=o()}(this,"withinviewport",function(){var t=void 0!==window.innerHeight,e=function o(e,n){var r,i,l,c,f,u,a,d,p,s=!1,g={},m={},h=[0,0];if("undefined"!=typeof jQuery&&e instanceof jQuery&&(e=e.get(0)),"object"!=typeof e||1!==e.nodeType)throw Error("First argument must be an element");for(e.getAttribute("data-withinviewport-settings")&&window.JSON&&(g=JSON.parse(e.getAttribute("data-withinviewport-settings"))),r="string"==typeof n?{sides:n}:n||{},m.container=r.container||g.container||o.defaults.container||window,m.sides=r.sides||g.sides||o.defaults.sides||"all",m.top=r.top||g.top||o.defaults.top||0,m.right=r.right||g.right||o.defaults.right||0,m.bottom=r.bottom||g.bottom||o.defaults.bottom||0,m.left=r.left||g.left||o.defaults.left||0,"undefined"!=typeof jQuery&&m.container instanceof jQuery&&(m.container=m.container.get(0)),(m.container===document.body||1===!m.container.nodeType)&&(m.container=window),l=m.container===window,i={top:function(){return l?c.top>=m.top:c.top>=containerScrollTop-(containerScrollTop-f.top)+m.top},right:function(){return l?c.right<=f.right+containerScrollLeft-m.right:c.right<=f.right-h[0]-m.right},bottom:function(){var e;return e=l?t?m.container.innerHeight:document.documentElement.clientHeight:f.bottom,c.bottom<=e-h[1]-m.bottom},left:function(){return l?c.left>=m.left:c.left>=containerScrollLeft-(containerScrollLeft-f.left)+m.left},all:function(){return i.top()&&i.bottom()&&i.left()&&i.right()}},c=e.getBoundingClientRect(),l?(f=document.documentElement.getBoundingClientRect(),containerScrollTop=document.body.scrollTop,containerScrollLeft=document.body.scrollLeft):(f=m.container.getBoundingClientRect(),containerScrollTop=m.container.scrollTop,containerScrollLeft=m.container.scrollLeft),containerScrollLeft&&(h[0]=18),containerScrollTop&&(h[1]=16),u=/^top$|^right$|^bottom$|^left$|^all$/,a=m.sides.split(" "),p=a.length;p--;)if(d=a[p].toLowerCase(),u.test(d)){if(!i[d]()){s=!1;break}s=!0}return s};return e.prototype.defaults={container:document.body,sides:"all",top:0,right:0,bottom:0,left:0},e.defaults=e.prototype.defaults,e.prototype.top=function(t){return e(t,"top")},e.prototype.right=function(t){return e(t,"right")},e.prototype.bottom=function(t){return e(t,"bottom")},e.prototype.left=function(t){return e(t,"left")},e});
window.defferScripts && window.defferScripts.triggerExecuted('withinViewport');

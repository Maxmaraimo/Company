!function(){var e={14137:function(){var e=$(".js-mobile-app-slider");function n(){e.hasClass("slick-initialized")||isMobile()||e.slick({arrows:!1,autoplay:!0,autoplaySpeed:3e3,dots:!0,infinite:!0,speed:500,slidesToShow:1,slidesToScroll:1})}$((function(){window.defferScripts.on("slick",(function(){n(),$(window).on("resize",(function(){isMobile()?e.hasClass("slick-initialized")&&e.slick("unslick"):n()}))}))}))}},n={};function r(i){var o=n[i];if(void 0!==o)return o.exports;var t=n[i]={exports:{}};return e[i](t,t.exports,r),t.exports}r.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(n,{a:n}),n},r.d=function(e,n){for(var i in n)r.o(n,i)&&!r.o(e,i)&&Object.defineProperty(e,i,{enumerable:!0,get:n[i]})},r.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},void 0!==r&&Object.defineProperty(r,"p",{get:function(){try{if("string"!=typeof chunkCdnUrl)throw new Error("WebpackRequireFrom: 'chunkCdnUrl' is not a string or not available at runtime. See https://github.com/agoldis/webpack-require-from#troubleshooting");return chunkCdnUrl}catch(e){return console.error(e),"/"}},set:function(e){console.warn("WebpackRequireFrom: something is trying to override webpack public path. Ignoring the new value"+e+".")}}),function(){"use strict";r(14137)}()}();
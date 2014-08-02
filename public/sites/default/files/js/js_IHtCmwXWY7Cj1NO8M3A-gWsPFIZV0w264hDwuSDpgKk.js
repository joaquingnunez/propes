;
/*!
	jQuery Colorbox v1.4.10 - 2013-04-02
	(c) 2013 Jack Moore - jacklmoore.com/colorbox
	license: http://www.opensource.org/licenses/mit-license.php
*/
(function(e,t,i){function o(i,o,n){var r=t.createElement(i);return o&&(r.id=et+o),n&&(r.style.cssText=n),e(r)}function n(){return i.innerHeight?i.innerHeight:e(i).height()}function r(e){var t=H.length,i=(j+e)%t;return 0>i?t+i:i}function h(e,t){return Math.round((/%/.test(e)?("x"===t?E.width():n())/100:1)*parseInt(e,10))}function s(e,t){return e.photo||e.photoRegex.test(t)}function l(e,t){return e.retinaUrl&&i.devicePixelRatio>1?t.replace(e.photoRegex,e.retinaSuffix):t}function a(e){"contains"in v[0]&&!v[0].contains(e.target)&&(e.stopPropagation(),v.focus())}function d(){var t,i=e.data(O,Z);null==i?(D=e.extend({},Y),console&&console.log&&console.log("Error: cboxElement missing settings object")):D=e.extend({},i);for(t in D)e.isFunction(D[t])&&"on"!==t.slice(0,2)&&(D[t]=D[t].call(O));D.rel=D.rel||O.rel||e(O).data("rel")||"nofollow",D.href=D.href||e(O).attr("href"),D.title=D.title||O.title,"string"==typeof D.href&&(D.href=e.trim(D.href))}function c(i,o){e(t).trigger(i),lt.trigger(i),e.isFunction(o)&&o.call(O)}function u(){var e,t,i,o,n,r=et+"Slideshow_",h="click."+et;D.slideshow&&H[1]?(t=function(){clearTimeout(e)},i=function(){(D.loop||H[j+1])&&(e=setTimeout(J.next,D.slideshowSpeed))},o=function(){M.html(D.slideshowStop).unbind(h).one(h,n),lt.bind(nt,i).bind(ot,t).bind(rt,n),v.removeClass(r+"off").addClass(r+"on")},n=function(){t(),lt.unbind(nt,i).unbind(ot,t).unbind(rt,n),M.html(D.slideshowStart).unbind(h).one(h,function(){J.next(),o()}),v.removeClass(r+"on").addClass(r+"off")},D.slideshowAuto?o():n()):v.removeClass(r+"off "+r+"on")}function f(i){G||(O=i,d(),H=e(O),j=0,"nofollow"!==D.rel&&(H=e("."+tt).filter(function(){var t,i=e.data(this,Z);return i&&(t=e(this).data("rel")||i.rel||this.rel),t===D.rel}),j=H.index(O),-1===j&&(H=H.add(O),j=H.length-1)),g.css({opacity:parseFloat(D.opacity),cursor:D.overlayClose?"pointer":"auto",visibility:"visible"}).show(),V&&v.add(g).removeClass(V),D.className&&v.add(g).addClass(D.className),V=D.className,K.html(D.close).show(),$||($=q=!0,v.css({visibility:"hidden",display:"block"}),W=o(at,"LoadedContent","width:0; height:0; overflow:hidden").appendTo(y),B=b.height()+k.height()+y.outerHeight(!0)-y.height(),N=C.width()+T.width()+y.outerWidth(!0)-y.width(),z=W.outerHeight(!0),A=W.outerWidth(!0),D.w=h(D.initialWidth,"x"),D.h=h(D.initialHeight,"y"),J.position(),u(),c(it,D.onOpen),_.add(F).hide(),v.focus(),t.addEventListener&&(t.addEventListener("focus",a,!0),lt.one(ht,function(){t.removeEventListener("focus",a,!0)})),D.returnFocus&&lt.one(ht,function(){e(O).focus()})),w())}function p(){!v&&t.body&&(X=!1,E=e(i),v=o(at).attr({id:Z,"class":e.support.opacity===!1?et+"IE":"",role:"dialog",tabindex:"-1"}).hide(),g=o(at,"Overlay").hide(),S=o(at,"LoadingOverlay").add(o(at,"LoadingGraphic")),x=o(at,"Wrapper"),y=o(at,"Content").append(F=o(at,"Title"),I=o(at,"Current"),P=o("button","Previous"),R=o("button","Next"),M=o("button","Slideshow"),S,K=o("button","Close")),x.append(o(at).append(o(at,"TopLeft"),b=o(at,"TopCenter"),o(at,"TopRight")),o(at,!1,"clear:left").append(C=o(at,"MiddleLeft"),y,T=o(at,"MiddleRight")),o(at,!1,"clear:left").append(o(at,"BottomLeft"),k=o(at,"BottomCenter"),o(at,"BottomRight"))).find("div div").css({"float":"left"}),L=o(at,!1,"position:absolute; width:9999px; visibility:hidden; display:none"),_=R.add(P).add(I).add(M),e(t.body).append(g,v.append(x,L)))}function m(){function i(e){e.which>1||e.shiftKey||e.altKey||e.metaKey||e.control||(e.preventDefault(),f(this))}return v?(X||(X=!0,R.click(function(){J.next()}),P.click(function(){J.prev()}),K.click(function(){J.close()}),g.click(function(){D.overlayClose&&J.close()}),e(t).bind("keydown."+et,function(e){var t=e.keyCode;$&&D.escKey&&27===t&&(e.preventDefault(),J.close()),$&&D.arrowKey&&H[1]&&!e.altKey&&(37===t?(e.preventDefault(),P.click()):39===t&&(e.preventDefault(),R.click()))}),e.isFunction(e.fn.on)?e(t).on("click."+et,"."+tt,i):e("."+tt).live("click."+et,i)),!0):!1}function w(){var t,n,r,a=J.prep,u=++dt;q=!0,U=!1,O=H[j],d(),c(st),c(ot,D.onLoad),D.h=D.height?h(D.height,"y")-z-B:D.innerHeight&&h(D.innerHeight,"y"),D.w=D.width?h(D.width,"x")-A-N:D.innerWidth&&h(D.innerWidth,"x"),D.mw=D.w,D.mh=D.h,D.maxWidth&&(D.mw=h(D.maxWidth,"x")-A-N,D.mw=D.w&&D.w<D.mw?D.w:D.mw),D.maxHeight&&(D.mh=h(D.maxHeight,"y")-z-B,D.mh=D.h&&D.h<D.mh?D.h:D.mh),t=D.href,Q=setTimeout(function(){S.show()},100),D.inline?(r=o(at).hide().insertBefore(e(t)[0]),lt.one(st,function(){r.replaceWith(W.children())}),a(e(t))):D.iframe?a(" "):D.html?a(D.html):s(D,t)?(t=l(D,t),e(U=new Image).addClass(et+"Photo").bind("error",function(){D.title=!1,a(o(at,"Error").html(D.imgError))}).one("load",function(){var e;u===dt&&(D.retinaImage&&i.devicePixelRatio>1&&(U.height=U.height/i.devicePixelRatio,U.width=U.width/i.devicePixelRatio),D.scalePhotos&&(n=function(){U.height-=U.height*e,U.width-=U.width*e},D.mw&&U.width>D.mw&&(e=(U.width-D.mw)/U.width,n()),D.mh&&U.height>D.mh&&(e=(U.height-D.mh)/U.height,n())),D.h&&(U.style.marginTop=Math.max(D.mh-U.height,0)/2+"px"),H[1]&&(D.loop||H[j+1])&&(U.style.cursor="pointer",U.onclick=function(){J.next()}),setTimeout(function(){a(U)},1))}),setTimeout(function(){U.src=t},1)):t&&L.load(t,D.data,function(t,i){u===dt&&a("error"===i?o(at,"Error").html(D.xhrError):e(this).contents())})}var g,v,x,y,b,C,T,k,H,E,W,L,S,F,I,M,R,P,K,_,D,B,N,z,A,O,j,U,$,q,G,Q,J,V,X,Y={transition:"elastic",speed:300,width:!1,initialWidth:"600",innerWidth:!1,maxWidth:!1,height:!1,initialHeight:"450",innerHeight:!1,maxHeight:!1,scalePhotos:!0,scrolling:!0,inline:!1,html:!1,iframe:!1,fastIframe:!0,photo:!1,href:!1,title:!1,rel:!1,opacity:.9,preloading:!0,className:!1,retinaImage:!1,retinaUrl:!1,retinaSuffix:"@2x.$1",current:"image {current} of {total}",previous:"previous",next:"next",close:"close",xhrError:"This content failed to load.",imgError:"This image failed to load.",open:!1,returnFocus:!0,reposition:!0,loop:!0,slideshow:!1,slideshowAuto:!0,slideshowSpeed:2500,slideshowStart:"start slideshow",slideshowStop:"stop slideshow",photoRegex:/\.(gif|png|jp(e|g|eg)|bmp|ico)((#|\?).*)?$/i,onOpen:!1,onLoad:!1,onComplete:!1,onCleanup:!1,onClosed:!1,overlayClose:!0,escKey:!0,arrowKey:!0,top:!1,bottom:!1,left:!1,right:!1,fixed:!1,data:void 0},Z="colorbox",et="cbox",tt=et+"Element",it=et+"_open",ot=et+"_load",nt=et+"_complete",rt=et+"_cleanup",ht=et+"_closed",st=et+"_purge",lt=e("<a/>"),at="div",dt=0;e.colorbox||(e(p),J=e.fn[Z]=e[Z]=function(t,i){var o=this;if(t=t||{},p(),m()){if(e.isFunction(o))o=e("<a/>"),t.open=!0;else if(!o[0])return o;i&&(t.onComplete=i),o.each(function(){e.data(this,Z,e.extend({},e.data(this,Z)||Y,t))}).addClass(tt),(e.isFunction(t.open)&&t.open.call(o)||t.open)&&f(o[0])}return o},J.position=function(e,t){function i(e){b[0].style.width=k[0].style.width=y[0].style.width=parseInt(e.style.width,10)-N+"px",y[0].style.height=C[0].style.height=T[0].style.height=parseInt(e.style.height,10)-B+"px"}var o,r,s,l=0,a=0,d=v.offset();E.unbind("resize."+et),v.css({top:-9e4,left:-9e4}),r=E.scrollTop(),s=E.scrollLeft(),D.fixed?(d.top-=r,d.left-=s,v.css({position:"fixed"})):(l=r,a=s,v.css({position:"absolute"})),a+=D.right!==!1?Math.max(E.width()-D.w-A-N-h(D.right,"x"),0):D.left!==!1?h(D.left,"x"):Math.round(Math.max(E.width()-D.w-A-N,0)/2),l+=D.bottom!==!1?Math.max(n()-D.h-z-B-h(D.bottom,"y"),0):D.top!==!1?h(D.top,"y"):Math.round(Math.max(n()-D.h-z-B,0)/2),v.css({top:d.top,left:d.left,visibility:"visible"}),e=v.width()===D.w+A&&v.height()===D.h+z?0:e||0,x[0].style.width=x[0].style.height="9999px",o={width:D.w+A+N,height:D.h+z+B,top:l,left:a},0===e&&v.css(o),v.dequeue().animate(o,{duration:e,complete:function(){i(this),q=!1,x[0].style.width=D.w+A+N+"px",x[0].style.height=D.h+z+B+"px",D.reposition&&setTimeout(function(){E.bind("resize."+et,J.position)},1),t&&t()},step:function(){i(this)}})},J.resize=function(e){$&&(e=e||{},e.width&&(D.w=h(e.width,"x")-A-N),e.innerWidth&&(D.w=h(e.innerWidth,"x")),W.css({width:D.w}),e.height&&(D.h=h(e.height,"y")-z-B),e.innerHeight&&(D.h=h(e.innerHeight,"y")),e.innerHeight||e.height||(W.css({height:"auto"}),D.h=W.height()),W.css({height:D.h}),J.position("none"===D.transition?0:D.speed))},J.prep=function(t){function i(){return D.w=D.w||W.width(),D.w=D.mw&&D.mw<D.w?D.mw:D.w,D.w}function n(){return D.h=D.h||W.height(),D.h=D.mh&&D.mh<D.h?D.mh:D.h,D.h}if($){var h,a="none"===D.transition?0:D.speed;W.empty().remove(),W=o(at,"LoadedContent").append(t),W.hide().appendTo(L.show()).css({width:i(),overflow:D.scrolling?"auto":"hidden"}).css({height:n()}).prependTo(y),L.hide(),e(U).css({"float":"none"}),h=function(){function t(){e.support.opacity===!1&&v[0].style.removeAttribute("filter")}var i,n,h=H.length,d="frameBorder",u="allowTransparency";$&&(n=function(){clearTimeout(Q),S.hide(),c(nt,D.onComplete)},F.html(D.title).add(W).show(),h>1?("string"==typeof D.current&&I.html(D.current.replace("{current}",j+1).replace("{total}",h)).show(),R[D.loop||h-1>j?"show":"hide"]().html(D.next),P[D.loop||j?"show":"hide"]().html(D.previous),D.slideshow&&M.show(),D.preloading&&e.each([r(-1),r(1)],function(){var t,i,o=H[this],n=e.data(o,Z);n&&n.href?(t=n.href,e.isFunction(t)&&(t=t.call(o))):t=e(o).attr("href"),t&&s(n,t)&&(t=l(n,t),i=new Image,i.src=t)})):_.hide(),D.iframe?(i=o("iframe")[0],d in i&&(i[d]=0),u in i&&(i[u]="true"),D.scrolling||(i.scrolling="no"),e(i).attr({src:D.href,name:(new Date).getTime(),"class":et+"Iframe",allowFullScreen:!0,webkitAllowFullScreen:!0,mozallowfullscreen:!0}).one("load",n).appendTo(W),lt.one(st,function(){i.src="//about:blank"}),D.fastIframe&&e(i).trigger("load")):n(),"fade"===D.transition?v.fadeTo(a,1,t):t())},"fade"===D.transition?v.fadeTo(a,0,function(){J.position(0,h)}):J.position(a,h)}},J.next=function(){!q&&H[1]&&(D.loop||H[j+1])&&(j=r(1),f(H[j]))},J.prev=function(){!q&&H[1]&&(D.loop||j)&&(j=r(-1),f(H[j]))},J.close=function(){$&&!G&&(G=!0,$=!1,c(rt,D.onCleanup),E.unbind("."+et),g.fadeTo(200,0),v.stop().fadeTo(300,0,function(){v.add(g).css({opacity:1,cursor:"auto"}).hide(),c(st),W.empty().remove(),setTimeout(function(){G=!1,c(ht,D.onClosed)},1)}))},J.remove=function(){v&&(v.stop(),e.colorbox.close(),v.stop().remove(),g.remove(),G=!1,v=null,e("."+tt).removeData(Z).removeClass(tt),e(t).unbind("click."+et))},J.element=function(){return e(O)},J.settings=Y)})(jQuery,document,window);;
(function ($) {

Drupal.behaviors.initColorbox = {
  attach: function (context, settings) {
    if (!$.isFunction($.colorbox)) {
      return;
    }
    $('.colorbox', context)
      .once('init-colorbox')
      .colorbox(settings.colorbox);
  }
};

{
  $(document).bind('cbox_complete', function () {
    Drupal.attachBehaviors('#cboxLoadedContent');
  });
}

})(jQuery);
;
(function ($) {

Drupal.behaviors.initColorboxLoad = {
  attach: function (context, settings) {
    if (!$.isFunction($.colorbox)) {
      return;
    }
    $.urlParams = function (url) {
      var p = {},
          e,
          a = /\+/g,  // Regex for replacing addition symbol with a space
          r = /([^&=]+)=?([^&]*)/g,
          d = function (s) { return decodeURIComponent(s.replace(a, ' ')); },
          q = url.split('?');
      while (e = r.exec(q[1])) {
        e[1] = d(e[1]);
        e[2] = d(e[2]);
        switch (e[2].toLowerCase()) {
          case 'true':
          case 'yes':
            e[2] = true;
            break;
          case 'false':
          case 'no':
            e[2] = false;
            break;
        }
        if (e[1] == 'width') { e[1] = 'innerWidth'; }
        if (e[1] == 'height') { e[1] = 'innerHeight'; }
        p[e[1]] = e[2];
      }
      return p;
    };
    $('.colorbox-load', context)
      .once('init-colorbox-load', function () {
        var params = $.urlParams($(this).attr('href'));
        $(this).colorbox($.extend({}, settings.colorbox, params));
      });
  }
};

})(jQuery);
;
(function ($) {

Drupal.behaviors.initColorboxInline = {
  attach: function (context, settings) {
    if (!$.isFunction($.colorbox)) {
      return;
    }
    $.urlParam = function(name, url){
      if (name == 'fragment') {
        var results = new RegExp('(#[^&#]*)').exec(url);
      }
      else {
        var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(url);
      }
      if (!results) { return ''; }
      return results[1] || '';
    };
    $('.colorbox-inline', context).once('init-colorbox-inline').colorbox({
      transition:settings.colorbox.transition,
      speed:settings.colorbox.speed,
      opacity:settings.colorbox.opacity,
      slideshow:settings.colorbox.slideshow,
      slideshowAuto:settings.colorbox.slideshowAuto,
      slideshowSpeed:settings.colorbox.slideshowSpeed,
      slideshowStart:settings.colorbox.slideshowStart,
      slideshowStop:settings.colorbox.slideshowStop,
      current:settings.colorbox.current,
      previous:settings.colorbox.previous,
      next:settings.colorbox.next,
      close:settings.colorbox.close,
      overlayClose:settings.colorbox.overlayClose,
      maxWidth:settings.colorbox.maxWidth,
      maxHeight:settings.colorbox.maxHeight,
      innerWidth:function(){
        return $.urlParam('width', $(this).attr('href'));
      },
      innerHeight:function(){
        return $.urlParam('height', $(this).attr('href'));
      },
      title:function(){
        return decodeURIComponent($.urlParam('title', $(this).attr('href')));
      },
      iframe:function(){
        return $.urlParam('iframe', $(this).attr('href'));
      },
      inline:function(){
        return $.urlParam('inline', $(this).attr('href'));
      },
      href:function(){
        return $.urlParam('fragment', $(this).attr('href'));
      }
    });
  }
};

})(jQuery);
;

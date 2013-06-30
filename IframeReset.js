/* IframeReset
 * Use an iframe to reset styling.
 * (c) 2013 David (daXXog) Volm ><> + + + <><
 * Released under Apache License, Version 2.0:
 * http://www.apache.org/licenses/LICENSE-2.0.html  
 */

/* UMD LOADER: https://github.com/umdjs/umd/blob/master/returnExports.js */
(function (root, factory) {
    if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory);
    } else {
        // Class name
        var CLASS_NAME = 'IframeReset';
        
        // Browser globals (root is window)
        root[CLASS_NAME] = factory();
        
        // jQuery sugar
        if(typeof root.jQuery == 'function') {
            root.$.fn[CLASS_NAME] = function() {
                var args = Array.prototype.slice.call(arguments);
                
                args.unshift($(this));
                
                return root[CLASS_NAME].apply(root, args);
            };
        }
  }
}(this, function() {
    var IframeReset = function(_j, fx, pass) {
        var el = $(_j).get(0),
            j = $(el),
            div = $('<div>'),
            that = this,
            InjectedR = false,
            _frame = $('<iframe>').css({
                border: 0,
                padding: 0,
                margin: 0,
                width: '100%',
                height: '100%',
                scroll: 'auto'
            }).appendTo(j),
            frame, ctx = _frame.get(0).contentWindow;
            
        eval('!function(t,n){"object"==typeof exports?module.exports=n():"function"==typeof define&&define.amd?define(n):t.FlagBack=n()}(this,function(){var t=function(){var t=function(){this.ran=!1,this.q=[]};return t.prototype.builder=function(){var t=this;return function(n){"function"==typeof n?t.ran===!0?n():t.q.push(n):(t.ran===!1&&(t.q.forEach(function(t){t()}),t.q=[]),t.ran=!0)}},(new t).builder()},n=t,o=function(t,o){this.stack=[],this.cbs=0,this.cb=t,this.once="boolean"==typeof o?o:!1,this.called=!1,this.wait=n()};return o.prototype.add=function(){var t=this,n=t.stack.push(function(){setTimeout(function(){delete t.stack[n],t.cbs--,0!==t.cbs||(t.once?t.called!==!1:t.once)||(t.stack=[],t.called=!0,t.cb())},1)})-1;return t.cbs++,function(){t.wait(t.stack[n])}},o.prototype.flow=function(){this.wait()},o});');
        
        frame = _frame.contents();
        frame.find('body').append(div);
        
        if(Array.isArray(pass)) {
            var fb = new FlagBack(function() {
                console.log('flag');
            });
            
            var inject = function(v) {
                var doc = ctx.document,
                    type = typeof v,
                    script = doc.createElement('script');
                
                script.type = 'text/javascript';
                script.onload = fb.add();
                
                if(type == 'string') {
                    script.src = v;
                } else if(type == 'function') {
                    script.innerHTML = '(' + v.toString() + ')();';
                }
                
                doc.head.appendChild(script);
            };
            
            pass.forEach(function(v, i, a) {
                if(typeof that[v] != 'undefined') {
                    ctx[v] = that[v];
                } else {
                    if(InjectedR === false) {
                        ctx.r = function() {
                            console.log('hi');
                            fb.flow();
                        };
                    }
                    
                    inject(v);
                }
            });
            
            
            fb.flow();
        }
        
        if(typeof fx == 'function') {
            fx.apply(j, [div, function() {
                return frame.find.apply(frame, arguments);
            }, ctx]);
        }
        
        return div;
    };
    
    return IframeReset;
}));

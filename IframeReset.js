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
            _frame = $('<iframe>').css({
                border: 0,
                padding: 0,
                margin: 0,
                width: '100%',
                height: '100%',
                scroll: 'auto'
            }).appendTo(j),
            frame, ctx = _frame.get(0).contentWindow;
        
        frame = _frame.contents();
        frame.find('body').append(div);
        
        if(Array.isArray(pass)) {
            pass.forEach(function(v, i, a) {
                if(typeof that[v] != 'undefined') {
                    ctx[v] = that[v];
                } else {
                    var inject = function(v) {
                        var doc = ctx.document,
                            type = typeof v,
                            script = doc.createElement('script');
                        
                        script.type = 'text/javascript';
                        script.onload = function () {
                            console.log('load');
                        };
                        
                        if(type == 'string') {
                            script.src = v;
                        } else if(type == 'function') {
                            script.innerHTML = '(' + v.toString() + ')();';
                        }
                        
                        doc.head.appendChild(script);
                    };
                    
                    inject(v);
                }
            });
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

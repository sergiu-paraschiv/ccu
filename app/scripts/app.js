(function($, undefined) {
    'use strict';
    
    this.Crosscut = {};
    
    this.Crosscut.exports = function(where, what) {
        $.extend(true, where, what);
    };

}).call(this, this.jQuery);
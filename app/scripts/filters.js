(function(undefined) {
    'use strict';
    
    this.Main.filter('unsafe', function ($sce) {
        return function (val) {
            return $sce.trustAsHtml(val);
        };
    });

}).call(this.Crosscut);
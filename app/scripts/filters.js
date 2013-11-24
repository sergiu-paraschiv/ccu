(function(undefined) {
    'use strict';
    
    this.Main.filter('unsafe', function ($sce) {
        return function (val) {
            return $sce.trustAsHtml(val);
        };
    });

    this.Main.filter('numbersOnly', function ($sce) {
        return function (val) {
            if (val) {
                return val.replace(/\D+/g, '');
            }

            return '';
        };
    });

}).call(this.Crosscut);
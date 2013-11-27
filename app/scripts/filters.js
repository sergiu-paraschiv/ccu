(function($, undefined) {
    'use strict';
    
    this.Main.filter('unsafe', function ($sce) {
        return function (val) {
            return $sce.trustAsHtml(val);
        };
    });

    this.Main.filter('numbersOnly', function () {
        return function (val) {
            if (val) {
                return val.replace(/\D+/g, '');
            }

            return '';
        };
    });

    this.Main.filter('limit', [
        'ResponsiveSrvc',
        function (responsive) {
            return function (input, XDPILimit, limit, cutoff) {
                if (!input) {
                    return '';
                }

                if (responsive.isXDPI()) {
                    limit = XDPILimit;
                }

                var out = input;

                if (out.length > limit) {
                    out = $.trim(out.substring(0, limit)) + cutoff;
                }

                return out;
            };
        }
    ]);

}).call(this.Crosscut, this.jQuery);
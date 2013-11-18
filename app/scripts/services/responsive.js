(function(window, $, undefined) {
    'use strict';

    var C = this.Constants;
   
    this.Main.factory('ResponsiveSrvc', [
        '$rootScope',

        function ($rootScope) {
            var self = this;

            function isXDPI() {
                return $(window).width() >= C.XDPI_WIDTH;
            }

            $(window).resize(function () {
                $rootScope.$broadcast('responsiveLayoutChanged');
            });

            return {
                isXDPI: isXDPI
            };
        }
    ]);
        
}).call(this.Crosscut, window, this.jQuery);
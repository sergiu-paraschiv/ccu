(function ($, undefined) {
    'use strict';

    this.Main.directive('isFocused', [
        function () {
            return {
                restrict: 'A',

                controller: function ($scope, $element) {
                    $element.focus(function () {
                        $(this).parent().delay(100).queue(function(next){
                            $(this).addClass('focused');
                            next();
                        });
                    });

                    $element.blur(function () {
                        $(this).parent().delay(500).queue(function (next) {
                            $(this).removeClass('focused');
                            next();
                        });
                    });
                }
            };
        }
    ]);

}).call(this.Crosscut, this.jQuery);
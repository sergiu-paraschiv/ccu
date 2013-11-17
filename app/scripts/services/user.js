(function(undefined) {
    'use strict';

    var User = this.Models.User;

    var C = this.Constants;
   
    this.Main.factory('UserSrvc', [
        '$rootScope',
        '$http',

        function ($rootScope, $http) {
            var self = this;

            this.user = new User({});

            function get(callback) {
                callback.call(undefined, self.user);
            }

            return {
                get: get
            };
        }
    ]);
        
}).call(this.Crosscut);
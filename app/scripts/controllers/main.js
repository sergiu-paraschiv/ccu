(function(undefined) {
    'use strict';
   
    this.Main.controller('MainCtrl', [
        '$scope', 
        
        function($scope) {
            $scope.mainMenuIsClosed = true;
            $scope.accountMenuIsClosed = true;
            
            $scope.toggleMainMenu = function() {
                $scope.mainMenuIsClosed = !$scope.mainMenuIsClosed;
            };
            
            $scope.toggleAccountMenu = function() {
                $scope.accountMenuIsClosed = !$scope.accountMenuIsClosed;
            };
        }
    ]);
        
}).call(this.Crosscut, this.angular);
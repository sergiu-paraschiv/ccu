(function(a){"use strict";this.Crosscut={},this.Crosscut.exports=function(b,c){a.extend(!0,b,c)}}).call(this,this.jQuery),function(a){"use strict";var b=a.module("Crosscut",["ui.router"]);b.config(function(a,b){b.otherwise("/"),a.state("home",{url:"/",controller:"MainCtrl",views:{content:{templateUrl:"views/home.html",controller:"HomeCtrl"}}}).state("places",{url:"/places",views:{content:{templateUrl:"views/places.html",controller:"PlacesCtrl"}}}).state("jobs",{url:"/jobs",views:{content:{templateUrl:"views/jobs.html",controller:"JobsCtrl"}}}).state("news",{url:"/news",views:{content:{templateUrl:"views/news.html",controller:"NewsCtrl"}}})}),this.exports(this,{Main:b})}.call(this.Crosscut,this.angular),function(){"use strict";this.Main.controller("MainCtrl",["$scope",function(a){a.mainMenuIsClosed=!0,a.accountMenuIsClosed=!0,a.toggleMainMenu=function(){a.mainMenuIsClosed=!a.mainMenuIsClosed},a.toggleAccountMenu=function(){a.accountMenuIsClosed=!a.accountMenuIsClosed}}])}.call(this.Crosscut,this.angular),function(){"use strict";this.Main.controller("HomeCtrl",["$scope",function(){}])}.call(this.Crosscut,this.angular),function(){"use strict";this.Main.controller("PlacesCtrl",["$scope",function(){}])}.call(this.Crosscut,this.angular),function(){"use strict";this.Main.controller("JobsCtrl",["$scope",function(){}])}.call(this.Crosscut,this.angular),function(){"use strict";this.Main.controller("NewsCtrl",["$scope",function(){}])}.call(this.Crosscut,this.angular);
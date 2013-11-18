(function (_, undefined) {
    'use strict';

    var Job = this.Models.Job;

    this.Main.factory('JobsMapper', [
       '$rootScope',

       function ($rootScope) {

           function map(data, type) {
               return _.map(data, function (item) {
                   return mapOne(item, type);
               });
           }

           function mapOne(data, type) {
               return new Job(data, type);
           }

           function unmapOne(place) {
               return {
                   title: place.title,
                   description: place.description,
                   address: {
                       formatedAddress: place.address,
                       formatedPhone: '',
                       longitude: place.location.lng,
                       latitude: place.location.lat
                   }
               };
           }

           return {
               map: map,
               mapOne: mapOne,
               unmapOne: unmapOne
           };
       }
    ]);

}).call(this.Crosscut, this._);
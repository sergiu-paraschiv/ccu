(function (_, undefined) {
    'use strict';

    var Place = this.Models.Place;

    this.Main.factory('PlacesMapper', [
       '$rootScope',

       function ($rootScope) {

           function map(data, type) {
               return _.map(data, function (item) {
                   return mapOne(item, type);
               });
           }

           function mapOne(data, type) {
               return new Place(data, type);
           }

           function unmapOne(place) {
               return {
                   name: place.title,
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
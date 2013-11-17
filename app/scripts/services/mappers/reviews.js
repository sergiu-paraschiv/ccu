(function (_, undefined) {
    'use strict';

    var Review = this.Models.Review;

    this.Main.factory('ReviewsMapper', [
       '$rootScope',

       function ($rootScope) {

           function map(data) {
               return _.map(data, function (item) {
                   return mapOne(item);
               });
           }

           function mapOne(data) {
               return new Review(data);
           }

           function unmapOne(review) {
               return {
                   rating: review.rating,
                   comment: review.comment
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
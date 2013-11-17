(function (undefined) {
    'use strict';

    var C = this.Constants;

    function Place(data, type) {
        this.id = data.gReference;
        this.reference = data.id;
        this.image = '';
        this.title = data.name || '';
        this.description = data.description || '';
        this.address = data.address.formatedAddress || '';
        this.phone = data.address.formatedPhone || '';
        this.rating = data.averageRating || 0;
        this.location = {
            lat: data.address.latitude || C.LOCATION.DEFAULT.lat,
            lng: data.address.longitude || C.LOCATION.DEFAULT.lng
        };
        this.type = type || '';
        this.reviews = [];
    }

    this.exports(this.Models, {
        Place: Place
    });

}).call(this.Crosscut);
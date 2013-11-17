(function (undefined) {
    'use strict';

    var C = this.Constants;

    function Job(data, type) {
        this.reference = data.id;
        this.icon = '';
        this.date = data.dueDate || '';
        this.title = data.title || '';
        this.description = data.description || '';
        this.address = data.address.formatedAddress || '';
        this.phone = data.address.formatedPhone || '';
        this.location = {
            lat: data.address.latitude || C.LOCATION.DEFAULT.lat,
            lng: data.address.longitude || C.LOCATION.DEFAULT.lng
        };
        this.type = type || '';
    }

    this.exports(this.Models, {
        Job: Job
    });

}).call(this.Crosscut);
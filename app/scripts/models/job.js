(function (undefined) {
    'use strict';

    function Job(data) {
        this.icon = data.icon || '';
        this.date = data.date || '';
        this.title = data.title || '';
        this.address = data.address || '';
    }

    this.exports(this.Models, {
        Job: Job
    });

}).call(this.Crosscut);
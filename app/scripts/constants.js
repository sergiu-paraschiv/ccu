(function(undefined) {
    'use strict';
    
    this.Constants = {
        PLACE: {
            URL: {
                SEARCH: 'https://gcdc2013-crosscut.appspot.com/_ah/api/places/v1/places?lat={lat}&long={lng}&type={type}',
                GET: 'https://gcdc2013-crosscut.appspot.com/_ah/api/places/v1/places/{guid}',
                ADD: 'https://gcdc2013-crosscut.appspot.com/_ah/api/places/v1/add/{type}'
            },

            TYPE: {
                SHELTER: 'SHELTER',
                FOOD_PANTRIES: 'FOOD_PANTRIES',
                FOOD_BANK: 'FOOD_BANK',
                TRANSITIONAL_HOUSING: 'TRANSITIONAL_HOUSING',
                HEALTH: 'HEALTH'
            },

            PER_PAGE: 5,
            PER_PAGE_XDPI: 10
        },

        JOB: {
            URL: {
                SEARCH: 'https://gcdc2013-crosscut.appspot.com/_ah/api/jobs/v1/jobs?lat={lat}&long={lng}&type={type}',
                ADD: 'https://gcdc2013-crosscut.appspot.com/_ah/api/jobs/v1/add/{due}/{type}'
            },

            TYPE: {
                PAID: 'PAID',
                VOLUNTEERING: 'VOLUNTEERING'
            },

            PER_PAGE: 5,
            PER_PAGE_XDPI: 10
        },

        NEWS: {
            PER_PAGE: 5,
            PER_PAGE_XDPI: 10
        },

        LOCATION: {
            URL: {
                GEOCODE: 'https://gcdc2013-crosscut.appspot.com/_ah/api/location/v1/locations?lat={lat}&long={lng}'
            },

            DEFAULT: {
                lat: 34.0483953,
                lng: -118.2025121
            }
        },

        REVIEW: {
            URL: {
                ADD: 'https://gcdc2013-crosscut.appspot.com/_ah/api/reviews/v1/add/{type}'
            }
        },

        XDPI_WIDTH: 960
    };

}).call(this.Crosscut);
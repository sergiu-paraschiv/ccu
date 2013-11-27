(function(undefined) {
    'use strict';
   
    var NewsArticle = this.Models.NewsArticle;

    this.Main.factory('NewsSrvc', [
        '$rootScope',
        '$http',

        function ($rootScope, $http) {
            
            function search(callback) {
                var news = [
                    new NewsArticle({
                        image: '',
                        title: 'Cold Weather Shelters Open Dec. 1st',
                        description: 'Beginning December 1st, LA County will commence the Winter Shelter Program.  Each program location provides  temporary emergency shelter, meals, supportive services, and housing assistance.  For a list of locations, please follow the link.',
                        date: '26 Nov 2013',
                        url: 'http://www.lahsa.org/winter_shelter_program.asp'
                    }),

                    new NewsArticle({
                        image: '',
                        title: 'LA Considers Ban on Charity Meals for Homeless',
                        description: 'Two LA City Counsel Members propose ordinance that would restrict feeding homeless people in public places.  In the past years, many cities, including Philadelphia, Orlando, Raleigh, and Seattle have enacted such legislation.  ',
                        date: '25 Nov 2013',
                        url: 'http://www.nytimes.com/2013/11/26/us/as-homeless-line-up-for-food-los-angeles-weighs-restrictions.html'
                    }),

                    new NewsArticle({
                        image: '',
                        title: 'While National Homeless Numbers Decline, LA Homelessness Increases',
                        description: 'Between 2011-2013 homelessness in LA county increased by 15%.  Long-term homelessness increased by 16%, while homeless veterans increased 24%.',
                        date: '21 Nov 2013',
                        url: 'http://www.latimes.com/local/lanow/la-me-ln-hud-homeless-20131121,0,1923578.story#axzz2ll5Mfnjd'
                    }),

                    new NewsArticle({
                        image: '',
                        title: 'Free Flu Vaccinations',
                        description: 'Flu season is upon us.  Crosscut encourages those experiencing homelessness to take advantage of the free flu vaccinations available throughout LA.  Please visit the link for programs available near you.  If you need assistance finding a free flu vaccination please contact jen@crosscutusa.org.',
                        date: '20 Nov 2013',
                        url: 'http://publichealth.lacounty.gov/ip/flu/FluLocatorMain.htm'
                    }),

                    new NewsArticle({
                        image: '',
                        title: 'Free Thanksgiving Meals',
                        description: 'Don\'t spend the holiday alone!  There are many events to offering free Thanksgiving meals.  Come share in good food and cheer.',
                        date: '20 Nov 2013',
                        url: 'http://abclocal.go.com/kabc/story?id=7140446'
                    }),

                    new NewsArticle({
                        image: '',
                        title: 'Nevada Accused of Bussing Homeless Patients to Other Cities',
                        description: 'San Francisco\'s city attorney filed a class action lawsuit against the hospital and the state of Nevada for patient dumping. The suit alleges from 2008 to 2013, the hospital improperly discharged and sent at least two dozen indigent patients by Greyhound bus to San Francisco. The suit claims some of those transported had no connection to their destinations.',
                        date: '13 Nov 2013',
                        url: 'http://www.fox19.com/story/23827863/fox19-investigates-nv-mental-health-patients-dumped-in-ohio'
                    }),

                    new NewsArticle({
                        image: '',
                        title: 'Several cities providing homeless one-way bus tickets to Portland',
                        description: 'Programs that provide one-way bus tickets to the homeless are supposed to reunite them with families who can help them.  However, more often than not they are used by cities to shift the burden of homeless residents to another city, without providing any benefit to the homeless.',
                        date: '13 Nov 2013',
                        url: 'http://www.nwcn.com/news/230202841.html'
                    }),

                    new NewsArticle({
                        image: '',
                        title: 'Fresno Destroys Downtown Homeless Encampments',
                        description: 'Despite widespread acknowledgement that the city provides insufficient shelter beds, the city of Fresno, CA has continued to destroy homeless encampments.',
                        date: '11 Nov 2013',
                        url: 'http://www.streetsense.org/2013/11/city-of-fresno-destroys-downtown-homeless-encampments/'
                    }),

                    new NewsArticle({
                        image: '',
                        title: 'Help the Hungry This Thanksgiving',
                        description: 'Did you know that 1 in 6 Americans experiences food insecurity?  Dedicate some time this holiday to helping the less fortunate by volunteering with one of the many programs that helps make the holidays a little happier for the less fortunate.',
                        date: '9 Nov 2013',
                        url: 'http://losangeles.cbslocal.com/guide/how-to-help-the-hungry-this-thanksgiving/'
                    }),

                    new NewsArticle({
                        image: '',
                        title: 'Ontario Homeless Shelter Starts Charging Clients',
                        description: 'A homeless shelter in Ontario has begun charging clients for shelter. John Pencoff, the front-line supervisor at the shelter, says in the real world, anyone who doesn\'t pay their rent sleeps outside.',
                        date: '8 Nov 2013',
                        url: 'http://www.thespec.com/news-story/4200040-ontario-homeless-shelter-starting-to-charge-clients/'
                    }),

                    new NewsArticle({
                        image: '',
                        title: 'CA Homeless Bill of Rights Dies in Committee',
                        description: 'Cost of implementation is cited as the main reason why a bill, which would have extended protections and vital services to the homeless, has been killed.',
                        date: '6 Nov 2013',
                        url: 'http://www.visaliatimesdelta.com/article/20131107/OPINION01/311070008/'
                    })
                ];
                callback.call(undefined, news);
            }

            return {
                search: search
            };
        }
    ]);
        
}).call(this.Crosscut);
/**
 * @file Meteor routing logic
 * @author Dominic Thwaites
 */
String.prototype.capitalise = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

var routing={onBeforeAction: function() {
    document.title=this.route.getName().capitalise()+" (DJT)";
    this.next();
}};

Router.configure({
    layoutTemplate: 'ApplicationLayout'
});

Router.route('/', function () {
    this.render('home');
    this.render('code',{to:'background'});
});

Router.route('/evolution',function () {
    this.render('evolution');
    this.render('life',{to:'background'});
},routing);

Router.route('/resume', function () {
    this.render('resume');
    this.render('bouncing_logos',{to:'background'});
},routing);

Router.route('/about', function () {
    this.render('about');
},routing);

Router.route('/physics', function () {
    this.render('physics');
},routing);

Router.route('/programming', function () {
    this.render('programming');
},routing);

Router.route('/squash', function () {
    this.render('squash');
},routing);

Router.route('/sailing', function () {
    this.render('sailing');
},routing);

Router.route('/goinggreen', function () {
    this.render('goinggreen');
},routing);

Router.route('/diet', function () {
    this.render('diet');
},routing);

Router.route('/life', function (params) {
    this.layout(''); // Suppress the default layout
    this.render('serverlife',{
        data: function() {
            return this.params.hash;
        }
    });
},routing);



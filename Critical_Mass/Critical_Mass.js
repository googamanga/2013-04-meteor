var Users = new Meteor.Collection("users");
var Questions = new Meteor.Collection("Questions");
if (Meteor.isClient) {
  window.Users = Users;

  Session.set('loginScreen', true);

  Template.container.loginScreen = function(){
    return Session.equals('loginScreen', true);
  };

  Template.title_bar.loggedInUser = function(){
    var user =  Users.findOne(Session.get('loggedInUser'));
    return user && user.name;
  };

  Template.wall.questions = function(){
    return Questions.find({});
  };

  Template.ask_question.events = {
    'click input.add': function () {
      var question_text = document.getElementById("user_question").value;
      Questions.insert({question: question_text, user_id: Session.get('loggedInUser')._id});
    }
  };

  Template.new_user.events = {
    'click input.add': function () {
      var new_user_name = document.getElementById("new_user_name").value;
      Session.set('loggedInUser', Users.findOne({name: new_user_name}));
      Session.set('loginScreen',false);
    }
  };

  Template.users.users = function(){
    return Users.find({}, {sort: {karma: -1, name: 1}});
  };
}

// On server startup, create some users if the database is empty.
if (Meteor.isServer) {
  Meteor.startup(function () {
    if (Users.find().count() === 0) {
      var names = ["Ada Lovelace",
                   "Grace Hopper",
                   "Marie Curie",
                   "Carl Friedrich Gauss",
                   "Nikola Tesla",
                   "Claude Shannon",
                   "Alex"];
      for (var i = 0; i < names.length; i++)
        Users.insert({name: names[i], karma: Math.floor(Random.fraction()*10)*5});
    }
  });
}

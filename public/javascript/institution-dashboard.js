$(document).ready(function(){

var StudentModel = Backbone.Model.extend({

});
var StudentCollection= Backbone.Collection.extend({
  model: StudentModel
});

var StudentView = Backbone.View.extend({
  tagname: 'div',
  className: 'progress-card',
  events:{
    'click .student-card': 'browseStudentProfile',
    'click .remove-affiliation': 'removeStudentAffiliation',
    'click .approve-affiliation': 'approveStudentAffiliation'
  },
  initialize: function(){

  },
  render: function(){
    this.$el.html(this.template(this.model.toJSON()));
    if(this.model.get('percentage_accrued') !== 0 && this.model.get('percentage_accrued')){
      var percentage = this.model.get('percentage_accrued').split('%')[0];
      this.$('#initial-bar').css('width',  percentage+ '%');
    }
    return this; // enable chained calls
  },
  browseStudentProfile: function(e){
    console.log(e.target.tagName.toLowerCase());
    console.log(e.target.tagName.toLowerCase() === 'a');
    if(e.target.tagName.toLowerCase() === 'a'){
            console.log("HI");
    }
    else{

      var studentId = this.model.get('id');
      console.log(studentId);
      window.location = '/public/' + studentId;
    }

  },
  removeStudentAffiliation: function(e){
    e.preventDefault();
    var studentId = this.model.get('id');
    var r = confirm("Are you sure you want to remove this affiliation?");
    if (r === true) {
      $.post('/user/remove-affiliation/' + studentId, function(data){
        location.reload();
      });
    } else {
        x = "You pressed Cancel!";
    }

  },
  approveStudentAffiliation: function(e){
    e.preventDefault();
    var studentId = this.model.get('id');
    $.post('/user/approve-affiliation/' + studentId, function(data){
      location.reload();
    });
  }
});

var StudentList = Backbone.View.extend({
  el: '.progress-div',
  render: function(template){
    this.collection.each(function(student){
      var descriptionText = extractContent(student.get('description'));
      descriptionText = descriptionText.replace('About me', '');
      descriptionText = descriptionText.replace('My target', '');
      var shortenedDescription = descriptionText.slice(0, 100);
      lastSpaceIndex = shortenedDescription.lastIndexOf(' ');
      shortenedDescription = shortenedDescription.slice(0, lastSpaceIndex);
      if(shortenedDescription.length > 0){
        shortenedDescription = shortenedDescription + '...';
      }
      else{
        console.log("STIDENT", student.get('short_description'));
        var checkDescription = student.get('short_description');
        if(checkDescription){
          shortenedDescription = checkDescription;
        }
        else{
          shortenedDescription = 'No description available yet.';
        }
      }

      student.set('student_description', shortenedDescription);

      var funding_accrued = student.get('funding_accrued');
      var funding_needed = student.get('funding_needed');
      if(funding_accrued){
        percentage = Math.floor((funding_accrued/funding_needed) * 100);
        student.set('percentage_accrued', percentage + '%');
        student.set('funding_accrued', '£' + funding_accrued);
        if(percentage && percentage < 100){
          student.set('funding_left', '£' + parseInt(funding_needed - funding_accrued));
          student.set('variable_text', ' left');
        }
        else{
          if(percentage > 100){
            student.set('funding_left', 'Fulfilled');
            student.set('variable_text', '');
          }
          else{
            student.set('funding_left', '');
            student.set('variable_text', '');
          }

        }
      }
      else{
        student.set('percentage_accrued', 0);
        student.set('funding_accrued', 0);
        student.set('funding_left', '£' + funding_needed );
        student.set('variable_text', 'left');
      }
      var studentView = new StudentView({model: student, template: template});
      studentView.template = _.template(template.html());
      console.log("STUDENT VIEW", studentView);
      console.log(studentView.el);
      this.$el.append(studentView.render().el);
    }, this);
    return this;
  }
});

var studentCollection = new StudentCollection(students);
var studentList = new StudentList({collection: studentCollection});
$('.wrapper-div').append(studentList.render($('#student-template')).el);

var pendingStudentCollection = new StudentCollection(pending_students);
var pendingStudentList = new StudentList({collection: pendingStudentCollection, el: '.progress-div-pending'});
$('.wrapper-div-pending').append(pendingStudentList.render($('#student-pending-template')).el);

function extractContent(s) {
  var span= document.createElement('span');
  span.innerHTML= s;
  return span.textContent || span.innerText;
}


});

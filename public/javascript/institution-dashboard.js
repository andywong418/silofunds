$(document).ready(function(){

var StudentModel = Backbone.Model.extend({

});
var StudentCollection= Backbone.Collection.extend({
  model: StudentModel
});

var StudentView = Backbone.View.extend({
  tagname: 'div',
  className: 'progress-card',
  template: _.template($('#student-template').html()),
  events:{
    'click .student-card': 'browseStudentProfile'
  },
  initialize: function(){
    this.render();
    console.log(this.model.get('percentage'));
    if(this.model.get('percentage_accrued') !== 0 && this.model.get('percentage_accrued')){
      console.log("WHAT");
      var percentage = this.model.get('percentage_accrued').split('%')[0];
      console.log("OERCENT", percentage);
      console.log("SADf", this.$('#initial-bar'));
      console.log("AGAIN", $('initial-bar'));
      this.$('#initial-bar').css('width',  percentage+ '%');
    }

  },
  render: function(){
    this.$el.html(this.template(this.model.toJSON()));
    return this; // enable chained calls
  },
  browseStudentProfile: function(){
    var studentId = this.model.get('id');
    console.log(studentId);
    window.location = '/public/' + studentId;
  }
});

var StudentList = Backbone.View.extend({
  el: '.progress-div',
  render: function(){
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
        if(student.get('short_description')){
          shortenedDescription = student.get(short_description);
        }
        else{
          shortenedDescription = 'No description available yet.';
        }
      }

      student.set('student_description', shortenedDescription);

      var funding_accrued = student.get('funding_accrued');
      var funding_needed = student.get('funding_needed');
      if(funding_accrued){
        percentage = Math.ceil((funding_accrued/funding_needed) * 100);
        student.set('percentage_accrued', percentage + '%');
        student.set('funding_accrued', '£' + funding_accrued);
        if(percentage && percentage < 100){
          student.set('funding_left', '£' + parseInt(funding_needed - funding_accrued));
          student.set('variable_text', ' left');
        }
        else{
          if(percentage > 100){
            console.log(percentage);
            student.set('funding_left', 'Fulfilled');
            student.set('variable_text', '');
          }
          else{
            console.log(percentage);
            student.set('funding_left', '');
            student.set('variable_text', '');
          }

        }
      }
      else{
        student.set('percentage_accrued', 0);
        student.set('funding_accrued', 0);
        student.set('funding_left', funding_needed );
        student.set('variable_text', '');
      }
      var studentView = new StudentView({model: student});
      this.$el.append(studentView.el);
    }, this);
    return this;
  }
});

var studentCollection = new StudentCollection(students);
var studentList = new StudentList({collection: studentCollection});
$('.wrapper-div').append(studentList.render().el);


function extractContent(s) {
  var span= document.createElement('span');
  span.innerHTML= s;
  return span.textContent || span.innerText;
}


});

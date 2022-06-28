var mongoose = require('mongoose');

var Schema = mongoose.Schema;

const { DateTime } = require("luxon");

var AuthorSchema = new Schema(
  {
    first_name: {type: String, required: true, maxLength: 100},
    family_name: {type: String, required: true, maxLength: 100},
    date_of_birth: {type: Date},
    date_of_death: {type: Date},
  }
);

// Virtual for author's full name
AuthorSchema
.virtual('name')
.get(function () {
// To avoid errors in cases where an author does not have either a family name or first name
// We want to make sure we handle the exception by returning an empty string for that case
  var fullname = '';
  if (this.first_name && this.family_name) {
    fullname = this.family_name + ', ' + this.first_name
  }
  if (!this.first_name || !this.family_name) {
    fullname = '';
  }
  return fullname;
});

AuthorSchema
.virtual('birth_formatted')
.get(function () {
  if (!this.date_of_birth) {
    return ""
  }
  let birth = this.date_of_birth.toISOString().split('T')[0]
  
  return birth;
})

AuthorSchema
.virtual('death_formatted')
.get(function () {
  if (!this.date_of_death) {
    return ""
  }
  let death = this.date_of_death.toISOString().split('T')[0]
  return death;
})

// Virtual for author's lifespan
AuthorSchema
.virtual('lifespan')
.get(function() {
  var lifetime_string = '';
  if (this.date_of_birth) {
    lifetime_string = this.date_of_birth.getFullYear().toString();
  }
  lifetime_string += ' - ';
  if (this.date_of_death) {
    lifetime_string += this.date_of_death.getFullYear()
  }
  return lifetime_string;
});

// Virtual for author's URL
AuthorSchema
.virtual('url')
.get(function () {
  return '/catalog/author/' + this._id;
});

AuthorSchema
.virtual('lifespan_formatted')
.get(function () {
    var lifetime_string_formatted = '';
  if (this.date_of_birth) {
    lifetime_string_formatted = DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED)
  }
  lifetime_string_formatted += ' - ';
  if (this.date_of_death) {
    lifetime_string_formatted += DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED)
  }
  return lifetime_string_formatted
  ;
})

//Export model
module.exports = mongoose.model('Author', AuthorSchema);

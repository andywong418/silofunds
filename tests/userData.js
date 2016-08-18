// User and organisation injection data
minUserData = {
  email: 'minUserData@silofunds.com',
  username: 'Minimum user data test',
  password: 'password'
}

minOrganisationData = {
  email: 'minOrganisationData@silofunds.com',
  username: 'Minimum organisation data test',
  password: 'password',
  organisation_or_user: 100000
}

fullUserData = new User();
fullUserData.email = 'fullUserData@silofunds.com'
fullUserData.username = 'Full user data test'
fullUserData.profile_picture = 'http://vignette3.wikia.nocookie.net/adventuretimewithfinnandjake/images/9/97/S1e25_Finn_with_five_fingers.png/revision/latest?cb=20131128031157'

fullOrganisationData = new User();
fullOrganisationData.email = 'fullOranisationData@silofunds.com'
fullOrganisationData.username = 'Full organisation data test'
fullOrganisationData.profile_picture = 'http://vignette4.wikia.nocookie.net/villains/images/7/78/Illuminati-Logo.png/revision/latest?cb=20150529234113'
fullOrganisationData.organisation_or_user = 10000001


// Export objects
exports = module.exports = {}
exports.minUser = minUserData;
exports.minOrganisation = minOrganisationData;
exports.fullUser = fullUserData;
exports.fullOrganisation = fullOrganisationData;


// User prototype
function User() {
  this.email = '', // STRING
  this.username = '', // STRING
  this.password = 'password', // STRING
  this.profile_picture = '', // TEXT
  this.description = 'This is a description', // TEXT
  this.past_work = ['Butcher', 'Baker', 'Candlestick maker'], // ARRAY(text)
  this.date_of_birth = '1991-06-20 01:00:00:01', // DATE
  this.country_of_residence = ['England', 'Scotland', 'Uzbekistan'], // ARRAY(string)
  this.address_line1 = '23a Hart Street', // STRING
  this.address_zip = 'OX2 6BN', // STRING
  this.address_city = 'Oxford', // STRING
  this.billing_country = 'United Kingdom', // TEXT
  this.religion = 'Jedi', // TEXT
  this.funding_needed = 10000, // INTEGER
  this.organisation_or_user = null, // INTEGER
  this.email_updates = true, // BOOLEAN
  this.subject = ['Maths', 'Physics', 'Chemistry', 'Japanese', 'Cookery', 'Lasers'], // ARRAY(text)
  this.previous_degree = ['Masters', 'Undergraduate'], // ARRAY(text)
  this.previous_university = ['Oxford', 'Warwick', 'Bolton'], // ARRAY(text)
  this.target_degree = ['Phd', 'Masters'], // ARRAY(text)
  this.target_university = ['Oxford', 'Warwick', 'Bolton'], // ARRAY(text)
  this.completion_date = '2016-08-18 15:46:40.85+01', // DATE
  this.password_token = '', // TEXT
  this.email_verify_token = '', // TEXT
  this.link = '', // TEXT
  this.email_is_verified = true, // BOOLEAN
  this.funding_accrued = 1000, // INTEGER
  this.gender = 'female', // TEXT
  this.facebook_registering = false, // BOOLEAN
  this.video = '' // TEXT
}

var apiKey = "1da6b12f081b6014f18ea9f7c1ea494e31deb443";
var searchTerm = "" //this will need to be defined as search criteria
var holidayType = "National" //This will be selected based on drop down, need to determine who to include multiple
var year = "2020"


function holiday () {
  var queryURL = "https://calendarific.com/api/v2/holidays?api_key=" + apiKey + "&country=AU&year=2019&type=" + holidayType

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {
    console.log(response)


    // Country name:
    // var countryName = (response.response.holiday[0])

    // Holiday name:
    var holidayName = (response.response.holidays[3].name);
    console.log(holidayName)

    // description of holiday
    var holidayDesc = (response.response.holidays[3].description);
    console.log(holidayDesc)

    // holiday type - returned from what was 
    holidayType = (response.response.holidays[3].type[0])
    console.log(holidayType)


  })}

holiday()

function countryList () {
var queryURL = "https://calendarific.com/api/v2/countries?api_key=" + apiKey

$.ajax({
  url: queryURL,
  method: "GET"
}).then(function (response) {
  console.log(response.response.countries.country_name)

})}

countryList()
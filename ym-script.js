// runs when document loads
$(document).ready(function () {
  $('select').formSelect();
  $("select[required]").css({
    display: "inline",
    height: 0,
    padding: 0,
    width: 0
  });
  $('.datepicker').datepicker({
    selectMonths: true,
  });
  myTimer();
  countryList();
  // holiday();
});

var apiKey = "7d54d178cff682b4d8985e43a6b6c9055e8cef71";
var searchTerm = "" //this will need to be defined as search criteria
var holidayType = "National" //This will be selected based on drop down, need to determine who to include multiple
var year = "2020"


// create clock to display current time
var myVar = setInterval(myTimer, 1000);
function myTimer() {
  var d = new Date();
  var t = d.toString();
  t = t.substring(0, t.indexOf('('));
  $("#currentDandT").html(t);
}


// When search submitted

$("#submitButton").click(function () {
  var selectedCountriesEl = $('#countrySelector').find(":selected").map(function () { return this.value; }).get().join().split(",");
  var holidayType = $('#typeHoliday').find(":selected").map(function () { return this.value; }).get().join()
  var selectedDate = $(".datepicker").val();
  var date = new Date(selectedDate);
  var year = date.getFullYear();
  var month = date.getMonth()+1;
  var day = date.getDate();

  console.log(date);

  $.each(selectedCountriesEl, function (index, value) {
    var countryCodeEl = value;
    var queryURL = "https://calendarific.com/api/v2/holidays?api_key=" + apiKey + "&country=" + countryCodeEl + "&year="+year+"&month="+month+"&day="+day+"&type=" + holidayType;
      console.log(queryURL);
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function (output) {
      console.log(output);
      var countryEl = output.response.holidays[0].country.name;
      var cardHorId = "id=cardHor" + countryCodeEl;
      var cardHorizontal = "<div class=card>" ;
      var cardStacked = "<div class=card-stacked>";
      var cardStackedIdEl = "<div class=card-stacked "  + cardHorId + ">";
      var cardContent = "<div class=card-content>";
      var closeDivHCard = "</div></div>";
      var cardHorTemplate = cardHorizontal + cardStacked + cardContent + "<h4>" + countryEl + "</h4>" + closeDivHCard + cardStackedIdEl
      
      $("#resultsBox").append(cardHorTemplate);
      $('div.card').addClass("horizontal");
      $.each(output.response.holidays, function (index, value) {
        console.log(this.name);
        var closeDivCard = "</div></div></div>";
        var cardTemplate =  cardContent + "<p>"+this.name+"</p>"+"<br/>"+"<p>"+this.date.iso+"</p>"+"<br/>"+closeDivCard

        console.log(cardTemplate);
        $("#cardHor"+countryCodeEl).append(cardTemplate);
      })
    })
  })
});


// Create country list drop down 
function countryList() {
  var queryURL = "https://calendarific.com/api/v2/countries?api_key=" + apiKey

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {
    console.log(response);
    $.each(response.response.countries, function (index, value) {

      // console.log(this["iso-3166"], this.country_name);
      $("#countrySelector").append(new Option(this.country_name, this["iso-3166"]));

    })
    $('#countrySelector').formSelect();
  })
};
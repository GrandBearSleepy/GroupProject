// runs when document loads
$(document).ready(function () {
  $('select').formSelect();
  $("select[required]").css({
    display: "inline",
    height: 0,
    padding: 0,
    width: 0
  });
  // $('#dateSearch').datepicker({ selectMonths: true,  } );

  myTimer();
  // countryList();
  // holiday();
  $('select.select_all').siblings('ul').prepend('<li id=sm_select_all><span>Select All</span></li>');
  $('li#sm_select_all').on('click', function () {
    var jq_elem = $(this),
      jq_elem_span = jq_elem.find('span'),
      select_all = jq_elem_span.text() == 'Select All',
      set_text = select_all ? 'Select None' : 'Select All';
    jq_elem_span.text(set_text);
    jq_elem.siblings('li').filter(function () {
      return $(this).find('input').prop('checked') != select_all;
    }).click();
  });
});
$('select.select_all').siblings('ul').prepend('<li id=sm_select_all><span>Select All</span></li>');

var apiKey1 = "7d54d178cff682b4d8985e43a6b6c9055e8cef71";
var searchTerm = "" //this will need to be defined as search criteria
var holidayType = "National" //This will be selected based on drop down, need to determine who to include multiple
var year = "2020"
var states = "";



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



  var selectedStateEl = $('#stateSelector').find(":selected").map(function () { return this.text; }).get().join().split(",")
  var statesSortedEl = selectedStateEl.sort();
  console.log(statesSortedEl);

  var holidayType = $('#typeHoliday').find(":selected").map(function () { return this.value; }).get().join()
  var selectedDate = $(".datepicker").val().split("-");
  var selectedMonth = selectedDate[1].replace(/^0+/, '');


  console.log(selectedMonth);

  // Empty all Divs
  $("#resultsBox").empty();


  var queryURL = "https://calendarific.com/api/v2/holidays?api_key=" + apiKey1 + "&country=AU&year=" + selectedDate[0] + "&month=" + selectedMonth + "&type=" + holidayType;
  console.log(queryURL);
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (output) {

    //for each state
    $.each(statesSortedEl, function (index, value) {
      console.log(value);
      var thisState = value;
      var statestripped = value.replace(/\s/g, '');
      console.log(statestripped);
      var cardHorId = "id=cardHor" + statestripped;
      var statevalue = statestripped;
      var cardHorizontal = "<div class=card>";

      var cardStacked = "<div class=card-stacked>";
      var cardStackedIdEl = "<div class=card-stacked " + cardHorId + ">";
      var cardContent = "<div class=card-content>";
      var closeDivHCard = "</div></div>";
      var cardHorTemplate = cardHorizontal + cardStacked + cardContent + "<h4>" + value + "</h4>" + closeDivHCard + cardStackedIdEl

      $("#resultsBox").append(cardHorTemplate);
      $('div.card').addClass("horizontal");

      //For Each holiday returned
      $.each(output.response.holidays, function (index, value) {

    

        var closeDivCard = "</div></div></div>";
        var cardTemplate = cardContent + "<p>" + this.name + "</p>" + "<br/>" + "<p>" + this.date.iso + "</p>" + "<br/>" + closeDivCard
        var holidayStateEl = this.states;
        var outputIsArray = Array.isArray(holidayStateEl);
        console.log(outputIsArray);
        console.log(holidayStateEl);

        if (holidayStateEl == "All") {
          console.log("this is row 88 = All")

          $("#cardHor" + statevalue).append(cardTemplate)
        }
        else if (outputIsArray == true) {
          $.each(holidayStateEl, function (index, value) {
            if (this.name == thisState){
              $("#cardHor" + statevalue).append(cardTemplate)
            }

            console.log(this);
            // ("#cardHor" + holidayStateEl.name).append(cardTemplate)
          })
        }
      })
    })
  })

});

// API call details for Timezones -------------------------------//
var apiKey2 = "G5S20ISM8DXY"
var statesSelected = "" //this will need to be defined from what is selected on screen
var queryURLTime = "https://api.timezonedb.com/v2.1/list-time-zone?key=" + apiKey2 + "&format=json&zone=Australia/Sydney"

console.log(queryURLTime)

$.ajax({
  url: queryURLTime,
  method: "GET"
}).then(function (response) {
  console.log(response);
  var time = (response.zones[0].timestamp * 1000);
  var currentTime = moment.utc(time).format("hh:mm:ss a")
  console.log(currentTime)


})

  // API call details for Timezones -------------------------------//
  var apiKey2 = "G5S20ISM8DXY"
  var statesSelected = "" //this will need to be defined from what is selected on screen
  var queryURLTime = "https://api.timezonedb.com/v2.1/list-time-zone?key=" + apiKey2 + "&format=json&country=AU"
  console.log(queryURLTime)

  $.ajax({
    url: queryURLTime,
    method: "GET"
  }).then(function (response) {
    console.log(response);
  })
  // --------------------------------------------------------------//



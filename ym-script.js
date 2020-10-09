// runs when document 
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
    console.log(output);
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


        //Leon's code start

        //Generate holiday description div
        var holidayDec = this.description;
        var holidayType = this.type[0];

        var holidayInfo = "<div class='tooltip hide'>" + "<h5 class='type'>" + holidayType + "</h5>" + "<br/>" + "<p>" + holidayDec + "</p>" + "</div>";

        //End





        var closeDivCard = "</div></div></div>";
        var cardTemplate = cardContent + "<a class=holiday-name>" + this.name + "</a>" + "<br/>" + "<p>" + this.date.iso + "</p>" + "<br/>" + holidayInfo + closeDivCard;
        console.log(this.name);
        var holidayStateEl = this.states;
        var outputIsArray = Array.isArray(holidayStateEl);
        console.log(outputIsArray);
        console.log(holidayStateEl);


        if (holidayStateEl == "All") {
          console.log("this is row 88 = All")

          $("#cardHor" + statevalue).append(cardTemplate);
          //Leon
          // $("#cardHor" + statevalue).append(holidayDec);
          //End
        }
        else if (outputIsArray == true) {
          $.each(holidayStateEl, function (index, value) {
            if (this.name == thisState) {
              $("#cardHor" + statevalue).append(cardTemplate);
              // $("#cardHor" + statevalue).append(holidayDec);
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

// Leon's code

//click to display holday information
$(document).on("click", ".holiday-name", function (event) {
  console.log("clicked");
  var holidayTypeShort = $(this).siblings(".tooltip").children(".type").text().split(' ')[0];
  console.log(holidayTypeShort);
  $(this).siblings(".tooltip").removeClass("hide");
  $(this).siblings(".tooltip").addClass("show");
  $(this).siblings(".tooltip").css({
    "top": 30,
    "left": 150
  })
  $(this).siblings(".tooltip").show().delay(3000).hide(300);

  //Add different back ground color base on holiday type
  if (holidayTypeShort === "National") {
    $(this).siblings(".tooltip").addClass("national");
  }
  else if (holidayTypeShort === "Local") {
    $(this).siblings(".tooltip").addClass("local");
  }
  else if (holidayTypeShort === "Religious") {
    $(this).siblings(".tooltip").addClass("religious");
  }
  else if (holidayTypeShort === "Observance") {
    $(this).siblings(".tooltip").addClass("observance");
  }
  else {
    $(this).siblings(".tooltip").css({
      "background-color": "#009688",
      "color": "white"
    })
  }
})

//End
// runs when document loads 
$(document).ready(function () {

  $('.datepicker').monthpicker();
  $('.modal').modal();
  $('select').formSelect();
  $("select[required]").css({
    display: "block",
    height: 0,
    padding: 0,
    width: 0,
  });

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


  myTimer();

});



// creates clock and appends current local time to the Nav Bar
var myVar = setInterval(myTimer, 1000);
function myTimer() {
  t = moment().format("LLLL");
  $("#currentDandT").html(t);
};


// When item in the history is clicked updates search fields and starts search function
$("#HISTORYORSOMETHING").click(function () {
  $.fn.startSearch();
});

// Creates dashboard with returned results from click commands 
$.fn.startSearch = function () {

  // var newDateMYP = new Date ($(".datepicker").val()*1000);
  var monthYearPicker = moment.unix($(".datepicker").val()).format("YYYY-MM-DD");
  var apiKey1 = "5831336151323c413d8fb0aed13c83618c5f2c17";
  var selectedStateCity = [];
  var holidayType = $('#typeHoliday').find(":selected").map(function () { return this.value; }).get().join()
  var selectedDate = monthYearPicker.split("-");
  var selectedMonth = selectedDate[1].replace(/^0+/, '');
  var queryURL = "https://calendarific.com/api/v2/holidays?api_key=" + apiKey1 + "&country=AU&year=" + selectedDate[0] + "&month=" + selectedMonth + "&type=" + holidayType;

  //Creates object array for all selected States
  $('#stateSelector').find(":selected").each(function () {
    selectedStateCity.push({ "state": this.value, "city": this.id, "code": this.text });
  });

  // Empties all results from results box
  $("#resultsBox").empty();

  // Ajax call to get all public holidays in Australia for user selected month and year
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (output) {

    //Create card for each State the user selected
    $.each(selectedStateCity, function (index, value) {

      var thisState = this.state;
      var thisCity = this.city
      var statestripped = thisState.replace(/\s/g, '');
      var cardHorId = "id=cardHor" + statestripped;
      var statevalue = statestripped;
      var cardHorizontal = "<div class=card>";
      var cardStacked = "<div class=card-stacked>";
      var cardStackedIdEl = "<div class=card-stacked " + cardHorId + ">";
      var cardContent = "<div class=card-content>";
      var closeDivHCard = "</div></div>";
      var cardContentHID = "stateHeader" + statestripped;
      var cardContentHead = "<div class=card-content id=" + cardContentHID + ">";
      var clockDivId = statestripped + "Clock";
      var clockDiv = "<div id=" + clockDivId + "></div>"
      var cardHorTemplate = cardHorizontal + cardStacked + cardContentHead + "<h4>" + this.code + "</h4>" + clockDiv + closeDivHCard + cardStackedIdEl


      // Call functions to obtain weather and local time
      findCaptialCityWeather(thisCity, cardContentHID);
      createLocalClocks(thisState, clockDiv, clockDivId);

      $("#resultsBox").append(cardHorTemplate);
      $('div.card').addClass("horizontal");


      //Add details to each state with corresponding holidays;
      $.each(output.response.holidays, function (index, value) {

        //Leon's code start

        //Generate holiday description div
        var holidayDec = this.description;
        var holidayType = this.type[0];
        var holDateFormatted = moment(this.date.iso).format("ddd D MMMM YYYY");


        console.log("date formatted: " + holDateFormatted)
        var holidayInfo = "<div class='tooltip hide'>" + "<h5 class='type'>" + holidayType + "</h5>" + "<br/>" + "<p>" + holidayDec + "</p>" + "</div>";

        //End

        var closeDivCard = "</div></div></div>";
        var cardTemplate = cardContent + "<a class=holiday-name>" + this.name + "</a>" + "<br/>" + "<p>" + holDateFormatted + "</p>" + "<br/>" + holidayInfo + closeDivCard;
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

            }



            console.log(this);

          })

        }

      })

      checkIfEmpty(statevalue);


    })
  })
};

//Checks if card content is empty and adds note if true
function checkIfEmpty(statevalue) {
  if ($("#cardHor" + statevalue).is(':empty')) {
    console.log("!!IT IS EMPTY!!")
    $("#cardHor" + statevalue).append("<p>There are no public holidays listed</p>");
  }
  else {
    console.log("***IT IS FULL***")
  }
};

//Create a ticking clock for each selected state and add to card content
function createLocalClocks(thisState, clockDiv, clockDivId) {
  var myclock = setInterval(newClock, 1000);
  function newClock() {
    var timeZoneLibrary = {
      "Australian Capital Territory": "Australia/Sydney",
      "New South Wales": "Australia/Sydney",
      "Northern Teritory": "Australia/Darwin",
      "Queensland": "Australia/Brisbane",
      "South Australia": "Australia/Adelaide",
      "Tasmania": "Australia/Hobart",
      "Victoria": "Australia/Melbourne",
      "Western Australia": "Australia/Perth",
    };
    var selectedZoneName = timeZoneLibrary[thisState];
    var time = moment().tz(selectedZoneName).format("LLLL");
    var dtString = time.toString();
    $("#" + clockDivId).html(dtString);

  }
};

//Look up weather for selected States captial/s and appends modal to card
function findCaptialCityWeather(thisCity, cardContentHID) {

  var apiKey = "5f3a536ffcbefd25650f04ba24f777f8"
  var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + thisCity + "&appid=" + apiKey;

  console.log(queryURL);

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (output) {
    var wTodayIcon = "<img class=bg-white src=http://openweathermap.org/img/wn/" + output.weather[0].icon + "@2x.png alt=WeatherLogo/>"
    var tempTodayKelvin = output.main.temp;
    var tempTodayCelsuis = Math.floor(tempTodayKelvin - 273) + "&#8451;";
    var wTodayDes = output.weather[0].description;
    var humidityToday = output.main.humidity + "%";
    var windSpeedTodayMPS = output.wind.speed;
    var windSpeedTodayKPH = Math.floor(windSpeedTodayMPS * 3600 / 1610.3 * 100) / 100 + " km/h";
    var uv = output.wind.speed;
    console.log("Temp: " + tempTodayCelsuis + " Description: " + wTodayDes + " Humidity: " + humidityToday + " Wind Speed (km/h): " + windSpeedTodayKPH + " UV: " + uv);
    var todayPush = "<h4>TODAY</h4>" + wTodayIcon + "<h5>" + tempTodayCelsuis + "</h5></br><h6>" + wTodayDes + "</h6></br><p>Wind: " + windSpeedTodayKPH + "    |   Humidity: " + humidityToday + "</p>"

    var classWModal = "waves-effect waves-light btn modal-trigger";

    var weatherModal = "<a class=modal-trigger href=#modal" + thisCity + ">" + thisCity + " Weather" + "</a><div id=modal" + thisCity + " class=modal><div class=modal-content>" + todayPush + "</div></div>";

    $("#" + cardContentHID).append(weatherModal);
    $('.modal-trigger').addClass("waves-effect waves-light btn");
    $('.modal').modal();
  })
};

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

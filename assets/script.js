
var APIKey = "&appid=d53e4da083eaaef89fa9b69a40dc5d8f";
var cityHist = [];

var storeCityHist = JSON.parse(localStorage.getItem("cityHist"));
if (storeCityHist !== null){
  cityHist = storeCityHist;
  renderCityHist();
};

function renderCityHist() {
  $("#search-city").html("")
  for (var i = 0; i < cityHist.length; i++) {
    var oldCity = cityHist[i];
    var button = $("<button>");
    button.attr("class", "btn list-group-item past");
    button.attr("data-name", oldCity);
    button.text(oldCity.toUpperCase());
    $("#search-city").prepend(button);
  }
};

$("#search-city").on("click", "past",function(){
  getWeather($(this).attr("data-name"));
});

$(".btn").on("click", function getWeather(event){
  event.preventDefault();
  var city = $("#search").val();
  $("section").attr("class","row ml-4 mt-4")
  if (city === "") {
    return;
  };
  $("#search").val("");
  cityHist.push(city);

  var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + ",us" + APIKey;
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {
    var tempC = response.main.temp;
    var tempF = (tempC - 273.15) * 1.80 + 32;
    var iconVar = "http://api.openweathermap.org/img/w/" + response.weather[0].icon +".png";
    longEl = response.coord.lon;
    latEl = response.coord.lat;
    $("#temperature").text("Temperature: " + tempF.toFixed(2) + " F");
    $("#windSpeed").text("Wind Speed: " + response.wind.speed + " MPH");
    $("#humidity").text("Humidity: " + response.main.humidity + " %");
    $(".City").text(response.name +" "+ (moment().format("(M/D/YYYY)")));
    $(".icon1").attr("src", iconVar);

    UVI(longEl, latEl);
    forcast(city);
  });
});


function UVI(longEl, latEl) {
  var queryUVI = "http://api.openweathermap.org/data/2.5/uvi?"+APIKey+"&lat="+latEl+"&lon="+longEl;
  $.ajax({
    url: queryUVI,
    method: "GET"
  }).then(function(resp) {
    var UVIndex = resp.value;
    $("#UVindex").text("UV Index: " + UVIndex);
    if (UVIndex >= 11) {
      $("#UVindex").attr("class","badge badge-dark");
    }
    else if (UVIndex >= 8){
      $("#UVindex").attr("class","badge badge-danger");
    }
    else if (UVIndex >= 6){
      $("#UVindex").attr("class","badge badge-warning");
    }
    else if (UVIndex >= 3){
      $("#UVindex").attr("class","badge badge-success");
    }
    else {
      $("#UVindex").attr("class","badge badge-primary");
    }
  })
};

function forcast(city) {
$(".card-deck").html("");
  var queryFor = "http://api.openweathermap.org/data/2.5/forecast?q="+city+APIKey;

  $.ajax({
    url: queryFor,
    method: "GET"
  }).then(function(resp) {
    var d = 1;
      for (var i = 0; i < resp.list.length; i++) {
         var curr = resp.list[i]
         if(curr.dt_txt.includes("12:00")){
            var tempC5 = curr.main.temp;
            var tempF5 = (tempC5 - 273.15) * 1.80 + 32;
            var divEl = $("<div>").attr("class", "card bg-primary text-white");
            $(".card-deck").append(divEl);
            var h6El = $("<h6>").attr("class", "card-title text-center mt-2").text((moment().add(d, "days").format("M/D/YYYY")));
            divEl.append(h6El);
            var imgEl = $("<img>").attr("class", "mx-auto").attr("src", "http://api.openweathermap.org/img/w/"+ curr.weather[0].icon+".png");
            divEl.append(imgEl);
            var p1El = $("<p>").attr("class", "card-text ml-2").text("Temp: " + tempF5.toFixed(2) + " F");
            divEl.append(p1El);
            var p2El = $("<p>").attr("class", "card-text ml-2 mb-2").text("Humidity: " +  curr.main.humidity + " %");
            divEl.append(p2El);
            d++;
         }
      }
  })
  storeCity();
};

function storeCity() {
  localStorage.setItem("cityHist", JSON.stringify(cityHist));
  renderCityHist();
};




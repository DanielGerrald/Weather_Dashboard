
var APIKey = "&appid=d53e4da083eaaef89fa9b69a40dc5d8f";
var cityHist = [];
var city;
var storeCityHist = JSON.parse(localStorage.getItem("cityHist"));

if (storeCityHist !== null){
  cityHist = storeCityHist.slice(Math.max(storeCityHist.length - 5, 0));
  renderCityHist();
};

function renderCityHist() {
  $("#search-city").html("");
  $("#search-city").attr("class", "card mt-2");
  for (var i = 0; i < cityHist.length; i++) {
    var oldCity = cityHist[i];
    var button = $("<button>");
    button.attr("class", "btn list-group-item past");
    button.attr("data-name", oldCity);
    button.text(oldCity.toUpperCase());
    $("#search-city").prepend(button);
  }
};

$(".btn").on("click", function(event){
  event.preventDefault();
  city = $("#search").val();
  getWeather()
});

$("#search-city").on("click",function(event){
  event.preventDefault();
  if(event.target.matches("button")) {
    city = event.target.textContent;
  }
  getWeather();
});

function getWeather(){
  $("#search").val("");
  if (city === "") {
    return;
  };
  $("section").attr("class","row ml-4 mt-4");
  cityHist.push(city);

  var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + ",us" + APIKey;
  console.log(queryURL);

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {
    var tempC = response.main.temp;
    var tempF = (tempC - 273.15) * 1.80 + 32;
    var iconVar = "https://api.openweathermap.org/img/w/" + response.weather[0].icon +".png";
    longEl = response.coord.lon;
    latEl = response.coord.lat;
    $("#temperature").text("Temperature: " + tempF.toFixed(2) + " F");
    $("#windSpeed").text("Wind Speed: " + response.wind.speed + " MPH");
    $("#humidity").text("Humidity: " + response.main.humidity + " %");
    $(".City").text(response.name +" "+ (moment().format("(M/D/YYYY)")));
    $(".icon1").attr("src", iconVar);
  
    UVI(longEl, latEl);
    forcast(longEl, latEl);
  });
};


function UVI(longEl, latEl) {
  var queryUVI = "https://api.openweathermap.org/data/2.5/uvi?"+APIKey+"&lat="+latEl+"&lon="+longEl;
  console.log(queryUVI);
  
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

function forcast(longEl, latEl) {
$(".card-deck").html("");
  var queryFor = "https://api.openweathermap.org/data/2.5/forecast?lat="+latEl+"&lon="+longEl+APIKey;
  console.log(queryFor)

  $.ajax({
    url: queryFor,
    method: "GET"
  }).then(function(resp) {
    var d = 1;
      for (var i = 0; i < resp.list.length; i++) {
         var curr = resp.list[i]
         if(curr.dt_txt.includes("12:00:00")){
            var tempC5 = curr.main.temp;
            var tempF5 = (tempC5 - 273.15) * 1.80 + 32;
            var divEl = $("<div>").attr("class", "card bg-primary text-white");
            $(".card-deck").append(divEl);
            var h6El = $("<h6>").attr("class", "card-title text-center mt-2").text((moment().add(d, "days").format("M/D/YYYY")));
            divEl.append(h6El);
            var imgEl = $("<img>").attr("class", "mx-auto").attr("src", "https://api.openweathermap.org/img/w/"+ curr.weather[0].icon+".png");
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




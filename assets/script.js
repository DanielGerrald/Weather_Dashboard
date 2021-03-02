var APIKey = "&appid=d53e4da083eaaef89fa9b69a40dc5d8f";
var cityHist = [];
var city;
var storeCityHist = JSON.parse(localStorage.getItem("cityHist"));

// https://api.openweathermap.org/data/2.5/onecall?lat=34.1782&lon=-79.4006&exclude=minutely,hourly,alerts&appid=d53e4da083eaaef89fa9b69a40dc5d8f

if (storeCityHist !== null) {
  cityHist = storeCityHist.slice(Math.max(storeCityHist.length - 5, 0));
  renderCityHist();
}

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
}

$(".btn").on("click", function (event) {
  event.preventDefault();
  city = $("#search").val();
  getWeather();
});

$("#search-city").on("click", function (event) {
  event.preventDefault();
  if (event.target.matches("button")) {
    city = event.target.textContent;
  }
  getWeather();
});

function getWeather() {
  $("#search").val("");
  if (city === "") {
    return;
  }
  $("section").attr("class", "row ml-4 mt-4");
  cityHist.push(city);

  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    ",us" +
    APIKey;
  console.log(queryURL);

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    longEl = response.coord.lon;
    latEl = response.coord.lat;
    var tempF = Math.round(((response.main.temp - 273.15) * 9) / 5 + 32);
    var iconVar =
      "https://api.openweathermap.org/img/w/" +
      response.weather[0].icon +
      ".png";
    $("#temperature").html(tempF + "<span>&#8457;</span>");
    $("#windSpeed").text("Wind Speed: " + response.wind.speed + " MPH");
    $("#humidity").text("Humidity: " + response.main.humidity + " %");
    $(".city").text(response.name);
    $(".date").text(moment().format("M/D/YYYY"));
    $(".icon1").attr("src", iconVar);

    forcast(longEl, latEl);
  });
}


function forcast(longEl, latEl) {
  $(".card-deck").html("");
  var queryFor =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    latEl +
    "&lon=" +
    longEl +
    "&exclude=minutely,hourly,alerts" +
    APIKey;
  console.log(queryFor);

  $.ajax({
    url: queryFor,
    method: "GET",
  }).then(function (resp) {

    var high = Math.round(((resp.daily[0].temp.max - 273.15) * 9) / 5 + 32);
    var low = Math.round(((resp.daily[0].temp.min - 273.15) * 9) / 5 + 32);
    $("#high").html("High: " + high + "<span>&#8457;</span>");
    $("#low").html("Low: " + low + "<span>&#8457;</span>");

    var UVIndex = resp.current.uvi;
    $("#UVindex").text("UV Index: " + UVIndex);
    if (UVIndex >= 11) {
      $("#UVindex").attr("class", "badge badge-dark");
    } else if (UVIndex >= 8) {
      $("#UVindex").attr("class", "badge badge-danger");
    } else if (UVIndex >= 6) {
      $("#UVindex").attr("class", "badge badge-warning");
    } else if (UVIndex >= 3) {
      $("#UVindex").attr("class", "badge badge-success");
    } else {
      $("#UVindex").attr("class", "badge badge-primary");
    }

    var d = 1;
    for (var i = 1; i < 6; i++) {
      var curr = resp.daily[i];
      var tempH = Math.round(((curr.temp.max - 273.15) * 9) / 5 + 32);
      var tempL = Math.round(((curr.temp.min - 273.15) * 9) / 5 + 32);
      var divEl = $("<div>").attr("class", "card bg-primary text-white");
      $(".card-deck").append(divEl);
      var h6El = $("<h6>")
        .attr("class", "card-title text-center mt-2")
        .text(moment().add(d, "days").format("M/D/YYYY"));
      divEl.append(h6El);
      var imgEl = $("<img>")
        .attr("class", "mx-auto")
        .attr(
          "src",
          "https://api.openweathermap.org/img/w/" +
            curr.weather[0].icon +
            ".png"
        );
      divEl.append(imgEl);
      var p1El = $("<p>")
        .attr("class", "card-text ml-2")
        .html("High: " + tempH + "<span>&#8457;</span>");
      divEl.append(p1El);
      var p2El = $("<p>")
        .attr("class", "card-text ml-2")
        .html("Low: " + tempL + "<span>&#8457;</span>");
      divEl.append(p2El);
      var p3El = $("<p>")
        .attr("class", "card-text ml-2 mb-2")
        .text("Humidity: " + curr.humidity + " %");
      divEl.append(p3El);
      d++;
    }
  });
  storeCity();
}

function storeCity() {
  localStorage.setItem("cityHist", JSON.stringify(cityHist));
  renderCityHist();
}

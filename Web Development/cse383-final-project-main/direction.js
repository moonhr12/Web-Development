var api = "OxZzL5BGvlDZgXxxMJNqKPk7pCxPAYSV";
var url = "api.tomtom.com";


function getInfo(name) {

	let info = document.getElementsByName(name);

        for(i = 0; i < info.length; i++) {
        	if(info[i].checked) {
                	return info[i].value;
            	}
        }
}

$(document).ready(function() {
    $("#submit").click(function(){
        console.log("Submit Button Clicked");

		let start = document.getElementById("start").value;
        let end = document.getElementById("end").value;


		let route = getInfo("route");
		let hill = getInfo("hill");
		let mode = getInfo("mode");


		latLong(start, end);

    });
});

function latLong(q1, q2) {

        r=$.ajax({

        	url: "https://" + url + "/search/2/geocode/" + q1 + ".json?key=" + api,
                method: "GET"

       	}).done(function(data) {
		console.log("GET Request for Geocode Location", data.results[0]);

               	let lat1 = data.results[0].position.lat;
                let long1 = data.results[0].position.lon;



        	r=$.ajax({

                	url: "https://" + url + "/search/2/geocode/" + q2 + ".json?key=" + api,
                	method: "GET"

        	}).done(function(data) {

                	let lat2 = data.results[0].position.lat;
                	let long2 = data.results[0].position.lon;


	                // Routing Call
        	        getLeg(lat1, long1, lat2, long2);

        	}).fail(function(error) {

                	// Search Failure
                	console.log("Error in GET Request Geocode Query2", error);

        	});

        }).fail(function(error) {

                // Search Failure
                console.log("Error in GET Request Geocode Query1", error);

        });
}

function getLeg(lat1, long1, lat2, long2) {

    r=$.ajax({

            url: "https://" + url + "/routing/1/calculateRoute/" + lat1 + "," + long1 + ":" + lat2 + "," + long2 + "/json?instructionsType=text&language=en-US&vehicleHeading=90&sectionType=traffic&report=effectiveSettings&routeType=eco&traffic=true&avoid=unpavedRoads&travelMode=car&vehicleMaxSpeed=120&vehicleCommercial=false&vehicleEngineType=combustion&key=" + api,
        method: "GET"

    }).done(function(data) {

    $("#distance").html(data.routes[0].summary.lengthInMeters);
    $("#time").html(data.routes[0].summary.travelTimeInSeconds);
    $("#delay").html(data.routes[0].summary.trafficDelayInSeconds);

    for (let i = 0; i < data.routes[0].guidance.instructions.length; i++) {
       let lat = data.routes[0].guidance.instructions[i].point.latitude;
       let long = data.routes[0].guidance.instructions[i].point.longitude;

                $("#leg").append("<li class='list-group-item list-group-item-action'>" + data.routes[0].guidance.instructions[i].message + ".</li>");
                $("#leg").append("<img src = ' " +  "https://" + url + "/map/1/staticimage?layer=basic&style=main&format=png&zoom=12&center="+ long + "%2C%20" + lat + "&width=512&height=512&view=Unified&key=" + api + " '> "); 

    }
        saveInfo(JSON.stringify(data.routes));
    }).fail(function(error) {

    console.log("Error in GET Request Routing", error);
   
});
}

function saveInfo(txt) {

    r=$.ajax({
            url: "http://172.17.12.138/final.php",
        method: "POST", 
        data: {location:"45056", sensor:"web", value:txt, method: "setLookup"}
        

    }).done(function(data) {
        console.log("Information is saved!");
    }).fail(function(error) {

    console.log("Couldn't save the information", error);
   
});
}





import React, { useEffect } from 'react'
import './EntryPage.css'
import { loader } from '../Utils/Api-Key'
import { arrayDataOfAmountsType, coordinatesInterface } from "../Utils/Interfaces"


// FIX TYPES
// state in README = "Wanted to have full size map of London, however the public Police API had API call limitations. This would impact the load time of the site. etc..."
// Fix variable naming and letter capitalisation, and variables types (const, let, var)
// change naming of stuff, especially functions
// aggregate all duplication of code 
// add bundler to program to speed up rendering since everything will be in different files

var prev_infoWindow: google.maps.InfoWindow | undefined = undefined

var map: google.maps.Map<HTMLElement>;

var polyBorder: google.maps.Polyline;

var antiSocialBehaviourArray: google.maps.Marker[] = [];
var bicycleTheftArray: google.maps.Marker[] = [];
var burglaryArray: google.maps.Marker[] = [];
var criminalDamageArsonArray: google.maps.Marker[] = [];
var drugsArray: google.maps.Marker[] = [];
var otherTheftArray: google.maps.Marker[] = [];
var possessionOfWeaponsArray: google.maps.Marker[] = [];
var publicOrderArray: google.maps.Marker[] = [];
var robberyArray: google.maps.Marker[] = [];
var shopliftingArray: google.maps.Marker[] = [];
var theftFromThePersonArray: google.maps.Marker[] = [];
var vehicleCrimeArray: google.maps.Marker[] = [];
var violentCrimeArray: google.maps.Marker[] = [];
var otherCrimeArray: google.maps.Marker[] = [];

function googleMapFunctionality(boundaryApiResponseJSON: any, crimesApiResponseJSON: any, setArrayData: Function, neighborhoodName?: any) {

  loader.load().then(() => {
    map = new google.maps.Map(document.getElementById("map") as HTMLElement, {})

    var boundaryApiResponseInPolyFormat = boundaryApiResponseJSON.map((element: any, index: any) => (
      {"lat": parseFloat(element.latitude), "lng": parseFloat(element.longitude)}
    ))

    polyBorder = new google.maps.Polygon ({
      paths: boundaryApiResponseInPolyFormat,
      geodesic: true,
      strokeColor: "#FF0000",
      strokeOpacity: 1.0,
      strokeWeight: 2,
      fillColor: "blue",
      fillOpacity: 0.1,
      map: map
    })

    var bounds = new google.maps.LatLngBounds();

    crimesApiResponseJSON.forEach((element: any, index: any) => {
      var selectMarkerArray: google.maps.Marker[] | undefined;
      var iconMarker; 

      switch(element.category) {
        case "anti-social-behaviour":
          iconMarker = '/markerIcons/blue-dot.png'
          selectMarkerArray = antiSocialBehaviourArray
          break
        case "bicycle-theft":
          iconMarker = '/markerIcons/marker_brown.png'
          selectMarkerArray = bicycleTheftArray
          break
        case "burglary":
          iconMarker = '/markerIcons/yellow-dot.png'
          selectMarkerArray = burglaryArray
          break
        case "criminal-damage-arson":
          iconMarker = '/markerIcons/marker_orange.png'
          selectMarkerArray = criminalDamageArsonArray
          break
        case "drugs":
          iconMarker = '/markerIcons/light-green-dot.png'
          selectMarkerArray = drugsArray
          break
        case "other-theft":
          iconMarker = '/markerIcons/marker_black.png'
          selectMarkerArray = otherTheftArray
          break
        case "possession-of-weapons":
          iconMarker = '/markerIcons/ltblue-dot.png'
          selectMarkerArray = possessionOfWeaponsArray
          break
        case "public-order":
          iconMarker = '/markerIcons/marker_grey.png'
          selectMarkerArray = publicOrderArray
          break
        case "robbery":
          iconMarker = '/markerIcons/marker_dark_green.png'
          selectMarkerArray = robberyArray
          break
        case "shoplifting":
          iconMarker = '/markerIcons/marker_purple.png'
          selectMarkerArray = shopliftingArray
          break
        case "theft-from-the-person":
          iconMarker = '/markerIcons/pink-dot.png'
          selectMarkerArray = theftFromThePersonArray
          break
        case "vehicle-crime":
          iconMarker = '/markerIcons/marker_pear.png'
          selectMarkerArray = vehicleCrimeArray
          break
        case "violent-crime":
          iconMarker = '/markerIcons/red-dot.png'
          selectMarkerArray = violentCrimeArray
          break
        case "other-crime":
          iconMarker = '/markerIcons/marker_white.png'
          selectMarkerArray = otherCrimeArray
          break
      }

      var marker = new google.maps.Marker({
        position: { lat: parseFloat(element.location.latitude), lng: parseFloat(element.location.longitude) },
        map: map,
        icon: iconMarker
      })
      selectMarkerArray?.push(marker)

      bounds.extend({ lat: parseFloat(element.location.latitude), lng: parseFloat(element.location.longitude)})

      const infowindow = new google.maps.InfoWindow({
        content: 
        "<div>" +
        "<p style=margin:0px><b> Type of crime: </b> " + element.category + "</p> " +
        "<p style=margin:0px><b> Date: </b> " + element.month + "</p> " +
        "<p style=margin:0px><b> Approximate location: </b> " + element.location.street.name + "</p> " +
        "<p style=margin:0px><b> Outcome of crime: </b> " + (element.outcome_status == null ? '<i>NO DATA ON OUTCOME</i>' : element.outcome_status.category) + "</p> " +
        "</div>"
      })


      bindInfoWindow(marker, map, infowindow)
    })

    map.fitBounds(bounds);

    // Design better system of loading spinner and button disabled
    (document.getElementById('errorMessage') as HTMLParagraphElement).innerHTML = "";

    (document.getElementById("submitButton") as HTMLInputElement).disabled = false;
    (document.getElementById("loadingSpinner") as HTMLInputElement).className = "";
    (document.getElementById("loadingSpinnerForCityOfLondonButton") as HTMLInputElement).className = "";
    (document.getElementById("CityOfLondonButton") as HTMLInputElement).disabled = false;

    {(neighborhoodName && ((document.getElementById("neighbourhoodTitle") as HTMLTitleElement).innerHTML = `Crime in ${neighborhoodName} neighbourhood`)) ||
    ((document.getElementById("neighbourhoodTitle") as HTMLTitleElement).innerHTML = "Crime in City of London")} // city of long saying Community Police, change this. Also design is too hacky

    const arrayDataOfAmounts: arrayDataOfAmountsType = {
      'antiSocialBehaviourAmount' : antiSocialBehaviourArray.length, 
      'bicycleTheftAmount' : bicycleTheftArray.length,
      'burglaryAmount' : burglaryArray.length,
      'criminalDamageArsonAmount' : criminalDamageArsonArray.length,
      'drugsAmount' : drugsArray.length,
      'otherTheftAmount' : otherTheftArray.length,
      'possessionOfWeaponsAmount' : possessionOfWeaponsArray.length,
      'publicOrderAmount' : publicOrderArray.length,
      'robberyAmount' : robberyArray.length,
      'shopliftingAmount' : shopliftingArray.length,
      'theftFromThePersonAmount' : theftFromThePersonArray.length,
      'vehicleCrimeAmount' : vehicleCrimeArray.length,
      'violentCrimeAmount' : violentCrimeArray.length,
      'otherCrimeAmount' : otherCrimeArray.length
    }
    
    setArrayData(arrayDataOfAmounts)
  })
}

function bindInfoWindow(marker: any, map: google.maps.Map<HTMLElement>, infowindow: google.maps.InfoWindow) { 
  google.maps.event.addListener(marker, 'click', function() { 
    if(prev_infoWindow){
      prev_infoWindow.close()
    }
    
    prev_infoWindow = infowindow
    infowindow.open(map, marker) 
  })
}


async function geocoderCalculations(result: any, setArrayData: Function) {
  const [latCoordinate, lngCoordinate] = [result[0].geometry.location.lat(), result[0].geometry.location.lng()]

  const neighborhoodLookup = await fetch(`https://data.police.uk/api/locate-neighbourhood?q=${latCoordinate},${lngCoordinate}`)

  if(neighborhoodLookup.ok === false) {
    (document.getElementById('errorMessage') as HTMLParagraphElement).innerHTML = ("Error with request, potential issues causing this:"+ "<br />" +
    "<ul style='margin:0px;'> <li>Cant find data</li> <li>Address is outside of England</li> <li>Address is not specific enough</li></ul>");
    (document.getElementById("submitButton") as HTMLInputElement).disabled = false;
    (document.getElementById("CityOfLondonButton") as HTMLInputElement).disabled = false;
    (document.getElementById("loadingSpinner") as HTMLInputElement).className = ""
  }
  else {
    removeDrawingsFromMap();
    const neighborhoodLookupJSON = await neighborhoodLookup.json() // Use neighbourhood id to query api about location name

    const neighborhoodBoundary = await fetch(`https://data.police.uk/api/${neighborhoodLookupJSON.force}/${neighborhoodLookupJSON.neighbourhood}/boundary`)
    const neighborhoodBoundaryJSON = await neighborhoodBoundary.json()

    const neighborhoodFromFormName = await fetch(`https://data.police.uk/api/${neighborhoodLookupJSON.force}/neighbourhoods`)
    const neighborhoodFromFormNameJson = await neighborhoodFromFormName.json()
    const neighborhoodIdAndName = neighborhoodFromFormNameJson.find((element: any) => element.id === neighborhoodLookupJSON.neighbourhood);
    const neighborhoodName = neighborhoodIdAndName.name

    var usersCoordinateString = "poly="
    neighborhoodBoundaryJSON.forEach((coordinates: coordinatesInterface) => {
      var calculation = coordinates.latitude + "," + coordinates.longitude + ":"
      usersCoordinateString = usersCoordinateString.concat(calculation)
    })

    const crimesApiResponse = await fetch('https://data.police.uk/api/crimes-street/all-crime', {
      method: "POST",
      headers: new Headers({'Content-Type': 'application/x-www-form-urlencoded'}),
      body: usersCoordinateString
    })
    const crimesApiResponseJSON = await crimesApiResponse.json()

    googleMapRendering(neighborhoodBoundaryJSON, crimesApiResponseJSON, setArrayData, neighborhoodName)
  }
}


function initiateGeocoder(setArrayData: React.Dispatch<React.SetStateAction<any>>) {

  (document.getElementById("submitButton") as HTMLInputElement).disabled = true;
  (document.getElementById("CityOfLondonButton") as HTMLInputElement).disabled = true

  var address = (document.getElementById("queryAddress") as HTMLInputElement).value
        
  loader.load().then(() => {
    new google.maps.Geocoder()
      .geocode({ address: address}, (result) => {

        if(result === null) {
          (document.getElementById('errorMessage') as HTMLParagraphElement).innerHTML = "Cannot find or invalid address";
          (document.getElementById("submitButton") as HTMLInputElement).disabled = false;
          (document.getElementById("CityOfLondonButton") as HTMLInputElement).disabled = false
        }
        else {
          (document.getElementById("loadingSpinner") as HTMLInputElement).className = "lds-dual-ring"
          geocoderCalculations(result, setArrayData)
        }

      })
    }
  )
}

async function getLondonData(setArrayData: React.Dispatch<React.SetStateAction<any>>) {
  const boundaryApiResponse = await fetch('https://data.police.uk/api/city-of-london/cp/boundary')
  const boundaryApiResponseJSON = await boundaryApiResponse.json()

  var coordinateString = "poly="
  boundaryApiResponseJSON.forEach((coordinates: coordinatesInterface) => {
    var calculation = coordinates.latitude + "," + coordinates.longitude + ":"
    coordinateString = coordinateString.concat(calculation)
  })

  const crimesApiResponse = await fetch('https://data.police.uk/api/crimes-street/all-crime', {
    method: "POST",
    headers: new Headers({'Content-Type': 'application/x-www-form-urlencoded'}),
    body: coordinateString
  })
  const crimesApiResponseJSON = await crimesApiResponse.json()

  googleMapFunctionality(boundaryApiResponseJSON, crimesApiResponseJSON, setArrayData)
}

const keyComponentDropdown = () => {
  var x = document.getElementById("keyComponentSection") as HTMLElement

  if(window.getComputedStyle(x).display === "none") {
    x.style.display = 'block';

  }
  else {
    x.style.display = 'none';
  }
}

const handlingKeyComponentDisplayingWhenScaling = () => {
  var x = document.getElementById("keyComponentSection") as HTMLElement

  if((window.innerWidth > 780) && x.style.display === 'none') {
    x.style.display= 'block';
  }
  else if((window.innerWidth <= 780)) {
    x.style.display= 'none';
  }
}

window.addEventListener('resize', handlingKeyComponentDisplayingWhenScaling)

const KeyComponent = () => {
  return (
    <div className='keyComponentMobileContainer'>
      <button onClick={keyComponentDropdown} className='keyButton'>{`Key`}</button>

      <div id='keyComponentSection' className='keyComponentSection'>
        <h4 style={{margin: 0, textDecoration: 'underline', marginLeft: 3}}>Key:</h4>
          <table>
            <tbody>
              <tr>
                <td><img src='/markerIcons/blue-dot.png'/></td>
                <td>{"Anti-social behaviour"}</td>
              </tr>
              <tr>
                <td><img src='/markerIcons/marker_brown.png'/></td>
                <td>{"Bicycle theft"}</td>
              </tr>
              <tr>
                <td><img src='/markerIcons/yellow-dot.png'/></td>
                <td>{"Burglary"}</td>
              </tr>
              <tr>
                <td><img src='/markerIcons/marker_orange.png'/></td>
                <td>{"Criminal damage and arson"}</td>
              </tr>
              <tr>
                <td><img src='/markerIcons/light-green-dot.png'/></td>
                <td>{"Drugs"}</td>
              </tr>
              <tr>
                <td><img src='/markerIcons/marker_black.png'/></td>
                <td>{"Other theft"}</td>
              </tr>
              <tr>
                <td><img src='/markerIcons/ltblue-dot.png'/></td>
                <td>{"Possession of weapons"}</td>
              </tr>
              <tr>
                <td><img src='/markerIcons/marker_grey.png'/></td>
                <td>{"Public order"}</td>
              </tr>
              <tr>
                <td><img src='/markerIcons/marker_dark_green.png'/></td>
                <td>{"Robbery"}</td>
              </tr>
              <tr>
                <td><img src='/markerIcons/marker_purple.png'/></td>
                <td>{"Shoplifting"}</td>
              </tr>
              <tr>
                <td><img src='/markerIcons/pink-dot.png'/></td>
                <td>{"Theft from the person"}</td>
              </tr>
              <tr>
                <td><img src='/markerIcons/marker_pear.png'/></td>
                <td>{"Vehicle crime"}</td>
              </tr>
              <tr>
                <td><img src='/markerIcons/red-dot.png'/></td>
                <td>{"Violence and sexual offences"}</td>
              </tr>
              <tr>
                <td><img src='/markerIcons/marker_white.png'/></td>
                <td>{"Other crime"}</td>
              </tr>
            </tbody>
          </table>
      </div>
    </div>
  )
}

function removeDrawingsFromMap() {
  // add if statement, e.g. -> if(antiSocialBehaviourArray[0].getMap() !== null) {
  for (var i = 0; i < antiSocialBehaviourArray.length; i++) {
    antiSocialBehaviourArray[i].setMap(null);
  }
  antiSocialBehaviourArray = [];

  for (var i = 0; i < bicycleTheftArray.length; i++) {
    bicycleTheftArray[i].setMap(null);
  }
  bicycleTheftArray = [];

  for (var i = 0; i < burglaryArray.length; i++) {
    burglaryArray[i].setMap(null);
  }
  burglaryArray = [];

  for (var i = 0; i < criminalDamageArsonArray.length; i++) {
    criminalDamageArsonArray[i].setMap(null);
  }
  criminalDamageArsonArray = [];

  for (var i = 0; i < drugsArray.length; i++) {
    drugsArray[i].setMap(null);
  }
  drugsArray = [];

  for (var i = 0; i < otherTheftArray.length; i++) {
    otherTheftArray[i].setMap(null);
  }
  otherTheftArray = [];

  for (var i = 0; i < possessionOfWeaponsArray.length; i++) {
    possessionOfWeaponsArray[i].setMap(null);
  }
  possessionOfWeaponsArray = [];

  for (var i = 0; i < publicOrderArray.length; i++) {
    publicOrderArray[i].setMap(null);
  }
  publicOrderArray = [];

  for (var i = 0; i < robberyArray.length; i++) {
    robberyArray[i].setMap(null);
  }
  robberyArray = [];

  for (var i = 0; i < shopliftingArray.length; i++) {
    shopliftingArray[i].setMap(null);
  }
  shopliftingArray = [];

  for (var i = 0; i < theftFromThePersonArray.length; i++) {
    theftFromThePersonArray[i].setMap(null);
  }
  theftFromThePersonArray = [];

  for (var i = 0; i < vehicleCrimeArray.length; i++) {
    vehicleCrimeArray[i].setMap(null);
  }
  vehicleCrimeArray = [];

  for (var i = 0; i < violentCrimeArray.length; i++) {
    violentCrimeArray[i].setMap(null);
  }
  violentCrimeArray = [];

  for (var i = 0; i < otherCrimeArray.length; i++) {
    otherCrimeArray[i].setMap(null);
  }
  otherCrimeArray = [];

  polyBorder.setMap(null)
}

function googleMapRendering(boundaryApiResponseJSON: any, crimesApiResponseJSON: any, setArrayData: Function, neighborhoodName?: any) {

  loader.load().then(() => {

    var boundaryApiResponseInPolyFormat = boundaryApiResponseJSON.map((element: any, index: any) => (
      {"lat": parseFloat(element.latitude), "lng": parseFloat(element.longitude)}
    ))

    polyBorder = new google.maps.Polygon ({
      paths: boundaryApiResponseInPolyFormat,
      geodesic: true,
      strokeColor: "#FF0000",
      strokeOpacity: 1.0,
      strokeWeight: 2,
      fillColor: "blue",
      fillOpacity: 0.1,
      map: map
    })

    var bounds = new google.maps.LatLngBounds();

    crimesApiResponseJSON.forEach((element: any, index: any) => {
      var selectMarkerArray: google.maps.Marker[] | undefined;
      var iconMarker

      switch(element.category) {
        case "anti-social-behaviour":
          iconMarker = '/markerIcons/blue-dot.png'
          selectMarkerArray = antiSocialBehaviourArray
          break
        case "bicycle-theft":
          iconMarker = '/markerIcons/marker_brown.png'
          selectMarkerArray = bicycleTheftArray
          break
        case "burglary":
          iconMarker = '/markerIcons/yellow-dot.png'
          selectMarkerArray = burglaryArray
          break
        case "criminal-damage-arson":
          iconMarker = '/markerIcons/marker_orange.png'
          selectMarkerArray = criminalDamageArsonArray
          break
        case "drugs":
          iconMarker = '/markerIcons/light-green-dot.png'
          selectMarkerArray = drugsArray
          break
        case "other-theft":
          iconMarker = '/markerIcons/marker_black.png'
          selectMarkerArray = otherTheftArray
          break
        case "possession-of-weapons":
          iconMarker = '/markerIcons/ltblue-dot.png'
          selectMarkerArray = possessionOfWeaponsArray
          break
        case "public-order":
          iconMarker = '/markerIcons/marker_grey.png'
          selectMarkerArray = publicOrderArray
          break
        case "robbery":
          iconMarker = '/markerIcons/marker_dark_green.png'
          selectMarkerArray = robberyArray
          break
        case "shoplifting":
          iconMarker = '/markerIcons/marker_purple.png'
          selectMarkerArray = shopliftingArray
          break
        case "theft-from-the-person":
          iconMarker = '/markerIcons/pink-dot.png'
          selectMarkerArray = theftFromThePersonArray
          break
        case "vehicle-crime":
          iconMarker = '/markerIcons/marker_pear.png'
          selectMarkerArray = vehicleCrimeArray
          break
        case "violent-crime":
          iconMarker = '/markerIcons/red-dot.png'
          selectMarkerArray = violentCrimeArray
          break
        case "other-crime":
          iconMarker = '/markerIcons/marker_white.png'
          selectMarkerArray = otherCrimeArray
          break
      }

      var marker = new google.maps.Marker({
        position: { lat: parseFloat(element.location.latitude), lng: parseFloat(element.location.longitude) },
        map: map,
        icon: iconMarker
      })
      selectMarkerArray?.push(marker)

      bounds.extend({ lat: parseFloat(element.location.latitude), lng: parseFloat(element.location.longitude)})

      const infowindow = new google.maps.InfoWindow({
        content: 
        "<div>" +
        "<p style=margin:0px><b> Type of crime: </b> " + element.category + "</p> " +
        "<p style=margin:0px><b> Date: </b> " + element.month + "</p> " +
        "<p style=margin:0px><b> Approximate location: </b> " + element.location.street.name + "</p> " +
        "<p style=margin:0px><b> Outcome of crime: </b> " + (element.outcome_status == null ? '<i>NO DATA ON OUTCOME</i>' : element.outcome_status.category) + "</p> " +
        "</div>"
      })


      bindInfoWindow(marker, map, infowindow)
    })

    map.fitBounds(bounds);

    // Design better system of loading spinner and button disabled
    (document.getElementById('errorMessage') as HTMLParagraphElement).innerHTML = "";

    (document.getElementById("submitButton") as HTMLInputElement).disabled = false;
    (document.getElementById("loadingSpinner") as HTMLInputElement).className = "";
    (document.getElementById("loadingSpinnerForCityOfLondonButton") as HTMLInputElement).className = "";
    (document.getElementById("CityOfLondonButton") as HTMLInputElement).disabled = false;

    {(neighborhoodName && ((document.getElementById("neighbourhoodTitle") as HTMLTitleElement).innerHTML = `Crime in ${neighborhoodName} neighbourhood`)) ||
    ((document.getElementById("neighbourhoodTitle") as HTMLTitleElement).innerHTML = "Crime in City of London")} // city of long saying Community Police, change this. Also design is too hacky
  
    //call sorting functions - THIS IS NOT IN THE INITIAL GOOGLE MAP RENDERING FUNCTION () - maybe optional parm that says 'shouldRenderSpecificCrimeResumingFilter'
    if((document.getElementById("choose_specific_crimes") as HTMLInputElement).checked) {
      SpecificCrimeMarkersResumingFilter() 
    }

    const arrayDataOfAmounts: arrayDataOfAmountsType = {
      'antiSocialBehaviourAmount' : antiSocialBehaviourArray.length, 
      'bicycleTheftAmount' : bicycleTheftArray.length,
      'burglaryAmount' : burglaryArray.length,
      'criminalDamageArsonAmount' : criminalDamageArsonArray.length,
      'drugsAmount' : drugsArray.length,
      'otherTheftAmount' : otherTheftArray.length,
      'possessionOfWeaponsAmount' : possessionOfWeaponsArray.length,
      'publicOrderAmount' : publicOrderArray.length,
      'robberyAmount' : robberyArray.length,
      'shopliftingAmount' : shopliftingArray.length,
      'theftFromThePersonAmount' : theftFromThePersonArray.length,
      'vehicleCrimeAmount' : vehicleCrimeArray.length,
      'violentCrimeAmount' : violentCrimeArray.length,
      'otherCrimeAmount' : otherCrimeArray.length
    }
    
    setArrayData(arrayDataOfAmounts)
  })
}

async function CityOfLondonButtonFunction(setArrayData: React.Dispatch<React.SetStateAction<any>>) {
  removeDrawingsFromMap();
  
  (document.getElementById("loadingSpinnerForCityOfLondonButton") as HTMLInputElement).className = "lds-dual-ring"

  const boundaryApiResponse = await fetch('https://data.police.uk/api/city-of-london/cp/boundary')
  const boundaryApiResponseJSON = await boundaryApiResponse.json()

  var coordinateString = "poly="
  boundaryApiResponseJSON.forEach((coordinates: coordinatesInterface) => {
    var calculation = coordinates.latitude + "," + coordinates.longitude + ":"
    coordinateString = coordinateString.concat(calculation)
  })

  const crimesApiResponse = await fetch('https://data.police.uk/api/crimes-street/all-crime', {
    method: "POST",
    headers: new Headers({'Content-Type': 'application/x-www-form-urlencoded'}),
    body: coordinateString
  })
  const crimesApiResponseJSON = await crimesApiResponse.json()

  googleMapRendering(boundaryApiResponseJSON, crimesApiResponseJSON, setArrayData)
}

function allCrimeMarkersEnabled() {
  if(antiSocialBehaviourArray[0].getMap() === null) {
    for (var i = 0; i < antiSocialBehaviourArray.length; i++) {
      antiSocialBehaviourArray[i].setMap(map);
    }
  }

  if(bicycleTheftArray[0].getMap() === null) {
    for (var i = 0; i < bicycleTheftArray.length; i++) {
      bicycleTheftArray[i].setMap(map);
    }
  }

  if(burglaryArray[0].getMap() === null) {
    for (var i = 0; i < burglaryArray.length; i++) {
      burglaryArray[i].setMap(map);
    }
  }

  if(criminalDamageArsonArray[0].getMap() === null) {
    for (var i = 0; i < criminalDamageArsonArray.length; i++) {
      criminalDamageArsonArray[i].setMap(map);
    }
  }

  if(drugsArray[0].getMap() === null) {
    for (var i = 0; i < drugsArray.length; i++) {
      drugsArray[i].setMap(map);
    }
  }

  if(otherTheftArray[0].getMap() === null) {
    for (var i = 0; i < otherTheftArray.length; i++) {
      otherTheftArray[i].setMap(map);
    }
  }

  if(possessionOfWeaponsArray[0].getMap() === null) {
    for (var i = 0; i < possessionOfWeaponsArray.length; i++) {
      possessionOfWeaponsArray[i].setMap(map);
    }
  }

  if(publicOrderArray[0].getMap() === null) {
    for (var i = 0; i < publicOrderArray.length; i++) {
      publicOrderArray[i].setMap(map);
    }
  }

  if(robberyArray[0].getMap() === null) {
    for (var i = 0; i < robberyArray.length; i++) {
      robberyArray[i].setMap(map);
    }
  }
  
  if(shopliftingArray[0].getMap() === null) {
    for (var i = 0; i < shopliftingArray.length; i++) {
      shopliftingArray[i].setMap(map);
    }
  }

  if(theftFromThePersonArray[0].getMap() === null) {
    for (var i = 0; i < theftFromThePersonArray.length; i++) {
      theftFromThePersonArray[i].setMap(map);
    }
  }

  if(vehicleCrimeArray[0].getMap() === null) {
    for (var i = 0; i < vehicleCrimeArray.length; i++) {
      vehicleCrimeArray[i].setMap(map);
    }
  }

  if(violentCrimeArray[0].getMap() === null) {
    for (var i = 0; i < violentCrimeArray.length; i++) {
      violentCrimeArray[i].setMap(map);
    }
  }

  if(otherCrimeArray[0].getMap() === null) {
    for (var i = 0; i < otherCrimeArray.length; i++) {
      otherCrimeArray[i].setMap(map);
    }
  }
}

function SpecificCrimeMarkersResumingFilter() {
  if((document.getElementById("anti-social_behaviour") as HTMLInputElement).checked === false) {
    for (var i = 0; i < antiSocialBehaviourArray.length; i++) {
      antiSocialBehaviourArray[i].setMap(null);
    }
  }
  if((document.getElementById("bicycle_theft") as HTMLInputElement).checked === false) {
    for (var i = 0; i < bicycleTheftArray.length; i++) {
      bicycleTheftArray[i].setMap(null);
    }
  }
  if((document.getElementById("burglary") as HTMLInputElement).checked === false) {
    for (var i = 0; i < burglaryArray.length; i++) {
      burglaryArray[i].setMap(null);
    }
  }
  if((document.getElementById("criminal_damage_and_arson") as HTMLInputElement).checked === false) {
    for (var i = 0; i < criminalDamageArsonArray.length; i++) {
      criminalDamageArsonArray[i].setMap(null);
    }
  }
  if((document.getElementById("drugs") as HTMLInputElement).checked === false) {
    for (var i = 0; i < drugsArray.length; i++) {
      drugsArray[i].setMap(null);
    }
  }
  if((document.getElementById("other_theft") as HTMLInputElement).checked === false) {
    for (var i = 0; i < otherTheftArray.length; i++) {
      otherTheftArray[i].setMap(null);
    }
  }
  if((document.getElementById("possession_of_weapons") as HTMLInputElement).checked === false) {
    for (var i = 0; i < possessionOfWeaponsArray.length; i++) {
      possessionOfWeaponsArray[i].setMap(null);
    }
  }
  if((document.getElementById("public_order") as HTMLInputElement).checked === false) {
    for (var i = 0; i < publicOrderArray.length; i++) {
      publicOrderArray[i].setMap(null);
    }
  }
  if((document.getElementById("robbery") as HTMLInputElement).checked === false) {
    for (var i = 0; i < robberyArray.length; i++) {
      robberyArray[i].setMap(null);
    }
  }
  if((document.getElementById("shoplifting") as HTMLInputElement).checked === false) {
    for (var i = 0; i < shopliftingArray.length; i++) {
      shopliftingArray[i].setMap(null);
    }
  }
  if((document.getElementById("theft_from_the_person") as HTMLInputElement).checked === false) {
    for (var i = 0; i < theftFromThePersonArray.length; i++) {
      theftFromThePersonArray[i].setMap(null);
    }
  }
  if((document.getElementById("vehicle_crime") as HTMLInputElement).checked === false) {
    for (var i = 0; i < vehicleCrimeArray.length; i++) {
      vehicleCrimeArray[i].setMap(null);
    }
  }
  if((document.getElementById("violence_and_sexual_offences") as HTMLInputElement).checked === false) {
    for (var i = 0; i < violentCrimeArray.length; i++) {
      violentCrimeArray[i].setMap(null);
    }
  }
  if((document.getElementById("other_crime") as HTMLInputElement).checked === false) {
    for (var i = 0; i < otherCrimeArray.length; i++) {
      otherCrimeArray[i].setMap(null);
    }
  }
}

function filterTriggerfunc() {
  if((document.getElementById("all_crime") as HTMLInputElement).checked) {
    allCrimeMarkersEnabled()
  }

  if((document.getElementById("choose_specific_crimes") as HTMLInputElement).checked) {
    (document.getElementById("specificCrimeCheckboxes") as HTMLElement).style.display = "";
  }
  else {
    (document.getElementById("specificCrimeCheckboxes") as HTMLElement).style.display = "none";
  }

  if((document.getElementById("choose_specific_crimes") as HTMLInputElement).checked) {
    SpecificCrimeMarkersResumingFilter() 
  }
}


function setMapOnMarkerArrayFromCheckbox(e: any, arrayReference: any) { 
  if(e.target.checked) {
    for (var i = 0; i < arrayReference.length; i++) {
      arrayReference[i].setMap(map);
    }
  }
  else {
    for (var i = 0; i < arrayReference.length; i++) {
      arrayReference[i].setMap(null);
    }
  }
}


function FilterDropdownFunction() {
  var x = document.getElementById("filtercontainer") as HTMLElement

  if(window.getComputedStyle(x).display === "none") {
    (document.getElementById("filtercontainer") as HTMLElement).style.display = 'block';
    (document.getElementById("filterToggleButton") as HTMLButtonElement).textContent = 'Filter ▲';
  }
  else {
    (document.getElementById("filtercontainer") as HTMLElement).style.display = 'none';
    (document.getElementById("filterToggleButton") as HTMLButtonElement).textContent = 'Filter ▼';
  }
}

const FilterComponent = () => {
  return(
    <div className='filterTotalContainer'>
      <button id='filterToggleButton' className='filterToggleButton' onClick={FilterDropdownFunction}>Filter ▼</button>
      <div id='filtercontainer' className='filterContainer'>
        <input type="radio" id="all_crime" name="filter_category" value="All Crime" defaultChecked onChange={filterTriggerfunc} />
        <label htmlFor="all_crime">All Crime</label><br/>
        <input type="radio" id="choose_specific_crimes" name="filter_category" value="Choose Specific Crimes" onChange={filterTriggerfunc} />
        <label htmlFor="choose_specific_crimes">Choose Specific Crimes</label><br/>
          <div id='specificCrimeCheckboxes' className='specificCrimeCheckboxes' style={{display: 'none'}}>
            <input type="checkbox" id="anti-social_behaviour" value="Anti-social behaviour" defaultChecked onChange={(e) => setMapOnMarkerArrayFromCheckbox(e, antiSocialBehaviourArray)}/>
            <label htmlFor="anti-social_behaviour"> Anti-social behaviour</label><br/>

            <input type="checkbox" id="bicycle_theft" value="Bicycle theft" defaultChecked onChange={(e) => setMapOnMarkerArrayFromCheckbox(e, bicycleTheftArray)}/>
            <label htmlFor="bicycle_theft"> Bicycle theft</label><br/>

            <input type="checkbox" id="burglary" value="Burglary" defaultChecked onChange={(e) => setMapOnMarkerArrayFromCheckbox(e, burglaryArray)}/>
            <label htmlFor="burglary"> Burglary</label><br/>

            <input type="checkbox" id="criminal_damage_and_arson" value="Criminal damage and arson" defaultChecked onChange={(e) => setMapOnMarkerArrayFromCheckbox(e, criminalDamageArsonArray)}/>
            <label htmlFor="criminal_damage_and_arson"> Criminal damage and arson</label><br/>

            <input type="checkbox" id="drugs" value="Drugs" defaultChecked onChange={(e) => setMapOnMarkerArrayFromCheckbox(e, drugsArray)}/>
            <label htmlFor="drugs"> Drugs</label><br/>

            <input type="checkbox" id="other_theft" value="Other theft" defaultChecked onChange={(e) => setMapOnMarkerArrayFromCheckbox(e, otherTheftArray)}/>
            <label htmlFor="other_theft"> Other theft</label><br/>

            <input type="checkbox" id="possession_of_weapons" value="Possession of weapons" defaultChecked onChange={(e) => setMapOnMarkerArrayFromCheckbox(e, possessionOfWeaponsArray)}/>
            <label htmlFor="possession_of_weapons"> Possession of weapons</label><br/>

            <input type="checkbox" id="public_order" value="Public order" defaultChecked onChange={(e) => setMapOnMarkerArrayFromCheckbox(e, publicOrderArray)}/>
            <label htmlFor="public_order"> Public order</label><br/>

            <input type="checkbox" id="robbery" value="Robbery" defaultChecked onChange={(e) => setMapOnMarkerArrayFromCheckbox(e, robberyArray)}/>
            <label htmlFor="robbery"> Robbery</label><br/>

            <input type="checkbox" id="shoplifting" value="Shoplifting" defaultChecked onChange={(e) => setMapOnMarkerArrayFromCheckbox(e, shopliftingArray)}/>
            <label htmlFor="shoplifting"> Shoplifting</label><br/>

            <input type="checkbox" id="theft_from_the_person" value="Theft from the person" defaultChecked onChange={(e) => setMapOnMarkerArrayFromCheckbox(e, theftFromThePersonArray)}/>
            <label htmlFor="theft_from_the_person"> Theft from the person</label><br/>

            <input type="checkbox" id="vehicle_crime" value="Vehicle crime" defaultChecked onChange={(e) => setMapOnMarkerArrayFromCheckbox(e, vehicleCrimeArray)}/>
            <label htmlFor="vehicle_crime"> Vehicle crime</label><br/>

            <input type="checkbox" id="violence_and_sexual_offences" value="Violence and sexual offences" defaultChecked onChange={(e) => setMapOnMarkerArrayFromCheckbox(e, violentCrimeArray)}/>
            <label htmlFor="violence_and_sexual_offences"> Violence and sexual offences</label><br/>

            <input type="checkbox" id="other_crime" value="Other crime" defaultChecked onChange={(e) => setMapOnMarkerArrayFromCheckbox(e, otherCrimeArray)}/>
            <label htmlFor="other_crime"> Other crime</label><br/>
          </div>
          <p style={{color: 'red', margin: '0px', marginLeft: '10px'}}><i>Click the 'Filters' button again to close this dropdown. Filters will still be applied.</i></p>
      </div>
    </div>
  )
}

const CrimeDefinitionsComponent = () => {
  return(
    <div className='InfoContainer'>
      <h3>Crime definitions:</h3>
      <p style={{margin: 3, marginBottom: 8}}><b>Anti-social behaviour:</b> Includes personal, environmental and nuisance anti-social behaviour. </p>
      <p style={{margin: 3, marginBottom: 8}}><b>Bicycle theft:</b> Includes the taking without consent or theft of a pedal cycle. </p>
      <p style={{margin: 3, marginBottom: 8}}><b>Burglary:</b> Includes offences where a person enters a house or other building with the intention of stealing. </p>
      <p style={{margin: 3, marginBottom: 8}}><b>Criminal damage and arson:</b> Includes damage to buildings and vehicles and deliberate damage by fire.</p>
      <p style={{margin: 3, marginBottom: 8}}><b>Drug:</b> Includes offences related to possession, supply and production. </p>
      <p style={{margin: 3, marginBottom: 8}}><b>Other theft:</b> Includes theft by an employee, blackmail and making off without payment. </p>
      <p style={{margin: 3, marginBottom: 8}}><b>Possession of weapon:</b> Includes possession of a weapon, such as a firearm or knife. </p>
      <p style={{margin: 3, marginBottom: 8}}><b>Public order:</b> Includes offences which cause fear, alarm or distress. </p>
      <p style={{margin: 3, marginBottom: 8}}><b>Robbery:</b> Includes offences where a person uses force or threat of force to steal. </p>
      <p style={{margin: 3, marginBottom: 8}}><b>Shoplifting:</b> Includes theft from shops or stalls. </p>
      <p style={{margin: 3, marginBottom: 8}}><b>Theft from the person:</b> Includes crimes that involve theft directly from the victim (including handbag, wallet, cash, mobile phones) but without the use or threat of physical force. </p>
      <p style={{margin: 3, marginBottom: 8}}><b>Vehicle crime:</b> Includes theft from or of a vehicle or interference with a vehicle. </p>
      <p style={{margin: 3, marginBottom: 8}}><b>Violence and sexual offence:</b> Includes offences against the person such as common assaults, Grievous Bodily Harm and sexual offences. </p>
      <p style={{margin: 3, marginBottom: 8}}><b>Other crime:</b> Includes forgery, perjury and other miscellaneous crime.</p>
      <p style={{margin: 3, marginBottom: 8}}><i>Info gathered from <a href={'https://www.police.uk/pu/about-police.uk-crime-data/'}>https://www.police.uk/pu/about-police.uk-crime-data/</a></i></p>
  </div> 
  )
}

const EntryPage = () => {
  const [arrayData, setArrayData] = React.useState()

  useEffect(() => {
    getLondonData(setArrayData)
  }, [])
 
  return (
    <div className='totalContainer'>
      <h1 className='title'>Crime in England Application </h1> 

      <div className='navBar'>
        <input id='CityOfLondonButton' type={'button'} className='CityOfLondonButtonStyling' onClick={() => CityOfLondonButtonFunction(setArrayData)} value={'Display "Crime in City of London" map'}/>
        <div id='loadingSpinnerForCityOfLondonButton'></div>
      </div>

      <form onSubmit={() => initiateGeocoder(setArrayData)}>
        <div className='zipCodeContainer'>
          <p className='zipCode'>Enter in your address/ZIP code to see crime in your neighbourhood:</p>
          <input id='queryAddress' type={'text'} placeholder={"Address/ZIP code"} onSubmit={() => initiateGeocoder(setArrayData)}/>
          <input id='submitButton' type={'submit'} onClick={() => initiateGeocoder(setArrayData)}/>
          <div id='loadingSpinner'></div>
          <p id='errorMessage' className='errorMessageStyling'></p>
        </div>
      </form>

      <p style={{color: 'red', marginBottom: '0px'}}><i>Note: Click the markers on the map to view more details about the incident</i></p>
      
      <FilterComponent/>

      <h2 id='neighbourhoodTitle' className='neighbourhoodTitle'>Crime in City of London</h2>

      <div className='parent-grid-container'>
        <div id="map"></div>
        <KeyComponent/>
      </div>

      <div className='info-grid-container'>
        {arrayData &&
        <div className='InfoContainer'>
          <h3>Stats about the displayed neighborhood:</h3>
          <p style={{margin: 3}}><b>'Anti-social behaviour'</b> reports: {arrayData['antiSocialBehaviourAmount']}</p>
          <p style={{margin: 3}}><b>'Bicycle theft'</b> reports: {arrayData['bicycleTheftAmount']}</p>
          <p style={{margin: 3}}><b>'Burglary'</b> reports: {arrayData['burglaryAmount']}</p>
          <p style={{margin: 3}}><b>'Criminal damage and arson'</b> reports: {arrayData['criminalDamageArsonAmount']}</p>
          <p style={{margin: 3}}><b>'Drug'</b> reports: {arrayData['drugsAmount']}</p>
          <p style={{margin: 3}}><b>'Other theft'</b> reports: {arrayData['otherTheftAmount']}</p>
          <p style={{margin: 3}}><b>'Possession of weapon'</b> reports: {arrayData['possessionOfWeaponsAmount']}</p>
          <p style={{margin: 3}}><b>'Public order'</b> reports: {arrayData['publicOrderAmount']}</p>
          <p style={{margin: 3}}><b>'Robbery'</b> reports: {arrayData['robberyAmount']}</p>
          <p style={{margin: 3}}><b>'Shoplifting'</b> reports: {arrayData['shopliftingAmount']}</p>
          <p style={{margin: 3}}><b>'Theft from the person'</b> reports: {arrayData['theftFromThePersonAmount']}</p>
          <p style={{margin: 3}}><b>'Vehicle crime'</b> reports: {arrayData['vehicleCrimeAmount']}</p>
          <p style={{margin: 3}}><b>'Violence and sexual offence'</b> reports: {arrayData['violentCrimeAmount']}</p>
          <p style={{margin: 3}}><b>'Other crime'</b> reports: {arrayData['otherCrimeAmount']}</p>
          {/* Maybe add total reports here */}
        </div>}
        <CrimeDefinitionsComponent/>
      </div>

      <p><i> Created by Hasan Ahmed </i> - <a href="https://www.linkedin.com/in/hasanahmed7855/"> LinkedIn </a> - <a href="https://github.com/HasanAhmed7855"> GitHub </a> </p>
    </div>
  )
}

export default EntryPage

//HAVE TO COME UP WITH BETTER WAY TO HANDLE MARKERS THAT OVER LAP - https://developers.google.com/maps/documentation/javascript/manage-marker-label-collisions

// Error messages for the user ---- Can make the error messages more specific
// Show text on screen telling user what neighbourhood they looking at --- Paritally, still CP bug present and soltion is too hacky
// Mobile responsive view 
// FIX STYLING OF SOME ELEMENTS SCALING PROPERLY AND SOME NOT AT SMALL SCREEN WIDTHS (E.G 330PX) -> NEED TO FIX, ITS VISIBLE ON MY PHONE
// FIX filter button positioning when on smaller screens
// STAT CONTAINERS NEED TO BE RESTURCUTRED TO LOOK BETTER ON MOBILE. HAS TO BE DISPLAYED AS ROWS, RATHER THAN COLUMNS

// MAYBE seperate the logic into different file
// Handle cases where api calls go through even when another error is already present
// Make APi calls more sync, some api calls dont have to wait for other calls
// More effcient design, not hacky document.getelementIds everywhere 

// upload project to netflify or google firebase
// upload to github along with weblink 
  // if doing this, make sure to set up google budget alerts

// FUTURE DEVELOPMENT: Show surrounding areas of the searched address 
// FUTURE DEVELOPMENT: Shows all crime and coloured coded markers 
$(document).ready(init);

const HOST = '0.0.0.0';
const amenityObj = {};

function init () {
  $('.amenities .popover input').change(function () {
    if ($(this).is(':checked')) {
      amenityObj[$(this).attr('data-name')] = $(this).attr('data-id');
    } else if ($(this).is(':not(:checked)')) {
      delete amenityObj[$(this).attr('data-name')];
    }
    const names = Object.keys(amenityObj);
    $('.amenities h4').text(names.sort().join(', '));
  });

  apiStatus();
  getPlaces();
}

function apiStatus () {
  const API_URL = `http://${HOST}:5001/api/v1/status/`;
  $.get(API_URL, (data, textStatus) => {
    if (textStatus === 'success' && data.status === 'OK') {
      console.log(textStatus);
      $('#api_status').addClass('available');
    } else {
      $('#api_status').removeClass('available');
    }
  });
}

function getPlaces () {
  const users = {};
  $.getJSON(`http://${HOST}:5001/api/v1/users`, function (data) {
    for (const i of data) {
      users[i.id] = i.first_name + ' ' + i.last_name;
    }
  });
  $.ajax({
    url: `http://${HOST}:5001/api/v1/places_search/`,
    type: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify({ amenities: Object.values(amenityObj) }),
    success: function (data) {
      for (const j of Object.values(data)) {
        $('section.places').append(
          '<article><div class="title_box"><h2>' +
            j.name +
            '</h2><div class="price_by_night">' +
            '$' +
            j.price_by_night +
            '</div></div><div class="information">' +
            '<div class="max_guest">' +
            j.max_guest +
            ' Guest(s)</div>' +
            '<div class="number_rooms">' +
            j.number_rooms +
            ' Bedroom(s)</div>' +
            '<div class="number_bathrooms">' +
            j.number_bathrooms +
            'Bathroom(s)</div>' +
            '</div><div class="user"><b>Owner: ' +
            `${users[j.user_id]}</b></div>` +
            '<div class="description">' +
            j.description +
            '</div></article>'
        );
      }
    }
  });
}

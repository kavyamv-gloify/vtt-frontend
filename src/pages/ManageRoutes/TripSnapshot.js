import React from 'react';

function getStaticGmapURLForDirection(
  origin,
  destination,
  waypoints,
  size = '500x500',
) {
  var markers = [];
  var waypoints_labels = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
  ];
  var waypoints_label_iter = 0;

  markers.push(
    'markers=color:green' +
      encodeURI('|') +
      'label:' +
      encodeURI(waypoints_labels[waypoints_label_iter++] + '|' + origin),
  );

  waypoints.forEach((waypoint) => {
    markers.push(
      'markers=color:blue' +
        encodeURI('|') +
        'label:' +
        encodeURI(waypoints_labels[waypoints_label_iter++] + '|' + waypoint),
    );
  });
  markers.push(
    'markers=color:red' +
      encodeURI('|') +
      'label:' +
      encodeURI(waypoints_labels[waypoints_label_iter] + '|' + destination),
  );
  var directionsService = new google.maps.DirectionsService();
  directionsService.route(
    {
      origin,
      destination,
      travelMode: 'DRIVING',
    },
    function (response, status) {
      if (status === 'OK') {
        const googleDirection = response;
        const polyline = encodeURI(
          googleDirection['routes'][0]['overview_polyline'],
        );
        markers = markers.join('&');
        const smu =
          'https://maps.googleapis.com/maps/api/staticmap?key=AIzaSyCoMMqvRnzokUhSy9D27vLVzLxMsm65hwQ&size=' +
          size +
          '&maptype=roadmap&path=enc:' +
          polyline +
          '&' +
          markers;
        $('body').append('<img src="' + smu + '" />');
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    },
  );
}

setTimeout(() => {
  getStaticGmapURLForDirection(
    '28.5744854,77.3826259',
    '28.6040239,77.38042700000001',
    ['28.5744854,77.3826259', '28.6040239,77.38042700000001'],
  );
}, 3000);

export default getStaticGmapURLForDirection;

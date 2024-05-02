import React, {useEffect, useState} from 'react';
const MapSnapShot = ({mapPosition, imageSrc, myProcess, count}) => {
  const [imageUrl, setImageUrl] = useState();
  useEffect(() => {
    if (!mapPosition?.length || !mapPosition[count]) return;
    getStaticGmapURLForDirection(
      [mapPosition[count]?.origin_lat, mapPosition[count]?.origin_long].join(
        ', ',
      ),
      [
        mapPosition[count]?.destination_lat,
        mapPosition[count]?.destination_long,
      ].join(', '),
      [
        [mapPosition[count]?.origin_lat, mapPosition[count]?.origin_long].join(
          ', ',
        ),
        [
          mapPosition[count]?.destination_lat,
          mapPosition[count]?.destination_long,
        ].join(', '),
      ],
    );
  }, [mapPosition, count]);

  function getStaticGmapURLForDirection(
    origin,
    destination,
    waypoints,
    size = '600x600',
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
    //
    //
    markers.push(
      'markers=color:green' +
        encodeURI('|') +
        'label:' +
        encodeURI(waypoints_labels[waypoints_label_iter++] + '|' + origin),
    );

    waypoints?.forEach((waypoint) => {
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
    const google = window.google;
    var directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin,
        destination,
        travelMode: 'DRIVING',
      },
      function (response, status) {
        if (status === 'OK') {
          //
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
          // const smu =
          //   'https://maps.googleapis.com/maps/api/staticmap?key=AIzaSyDKjQUy_qz9i57KPW-da_9BV849mnxn4hg&size=' +
          //   size +
          //   '&maptype=roadmap&path=enc:' +
          //   polyline +
          //   '&' +
          //   markers;
          setImageUrl(smu);
          myProcess(smu, mapPosition[count]);
          // imageSrc(smu);
        } else {
        }
      },
    );
  }
  return (
    <>
      <img src={imageUrl} alt='' />
    </>
  );
};
export default MapSnapShot;

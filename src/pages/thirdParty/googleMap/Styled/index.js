import React, {Component} from 'react';
import {GoogleMap, withGoogleMap} from 'react-google-maps';
import 'shared/vendors/maps.css';

import InfoBox from 'react-google-maps/lib/components/addons/InfoBox';

import fancyMapStyles from './fancyMapStyles.json';

const google = window.google;

const StyledMapExampleGoogleMap = withGoogleMap((props) => (
  <GoogleMap
    defaultZoom={11}
    defaultCenter={props.center}
    defaultOptions={{styles: fancyMapStyles}}
  >
    <InfoBox
      defaultPosition={props.center}
      options={{closeBoxURL: ``, enableEventPropagation: true}}
    >
      <div
        style={{backgroundColor: `yellow`, opacity: 0.75, padding: `20px`}}
        onClick={props.onClickFromChildrenOfInfoBox}
      >
        <div style={{fontSize: `16px`, fontColor: `#08233B`}}>Taipei</div>
      </div>
    </InfoBox>
  </GoogleMap>
));

/*
 * Add <script src="https://maps.googleapis.com/maps/api/js"></script> to your HTML to provide google.maps reference
 */
export default class StyledMap extends Component {
  handleClickFromChildrenOfInfoBox =
    this.handleClickFromChildrenOfInfoBox.bind(this);

  handleClickFromChildrenOfInfoBox(e) {

  }

  render() {
    return (
      <StyledMapExampleGoogleMap
        containerElement={
          <div className='cr-embed-responsive cr-embed-responsive-21by9' />
        }
        mapElement={<div className='cr-embed-responsive-item' />}
        center={new google.maps.LatLng(44.8799929, 21.3190073)}
        onClickFromChildrenOfInfoBox={this.handleClickFromChildrenOfInfoBox}
      />
    );
  }
}

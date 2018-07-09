import React from 'react';
import ReactDOM from 'react-dom';
import mapboxgl from 'mapbox-gl'
import chroma from 'chroma-js'
import 'mapbox-gl/dist/mapbox-gl.css';
import route0 from './ramsay2/geojson/route0.json'
import route1 from './ramsay2/geojson/route1.json'
import route2 from './ramsay2/geojson/route2.json'


mapboxgl.accessToken = 'pk.eyJ1Ijoic2FhZGlxbSIsImEiOiJjamJpMXcxa3AyMG9zMzNyNmdxNDlneGRvIn0.wjlI8r1S_-xxtq2d-W5qPA';

let steps = [];
let scale = chroma.scale(['red', 'orange','yellow']).domain([0.3,0.6]);
let num_steps = 20;
for (let i=0; i<num_steps+1;i++){
  let j = i/num_steps
  let step = [j,scale(j).hex()]
  steps.push(step)
}

let set_opacity = 0.1;

class Application extends React.Component {

  constructor(props: Props) {
    super(props);
    //this.click = this.click.bind(this)
    this.state = {
      lng: -114.040559,
      lat: 51.031887,
      zoom: 15
    };
  }

  componentDidMount() {
    const { lng, lat, zoom } = this.state;

    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/saadiqm/cjbjougmt08z72rsa7me1duoi',
      center: [lng, lat],
      zoom
    });

    this.map.on('load', () => {

      this.map.addSource('route0', {
                type: 'geojson',
                data: route0
              });
      this.map.addSource('route1', {
                type: 'geojson',
                data: route1
              });
      this.map.addSource('route2', {
                type: 'geojson',
                data: route2
              });

      this.map.addLayer({
          "id": "Route0",
          "type": "line",
          "source": 'route0',
          "paint": {
              "line-color": {
                property:"street_score",
                stops: steps
              },
              "line-width": 15,
              "line-opacity":set_opacity
          },
          "layout": {
              "line-join": "round",
              "line-cap": "round"
          },
      });
      this.map.addLayer({
          "id": "Route1",
          "type": "line",
          "source": 'route1',
          "paint": {
              "line-color": {
                property:"street_score",
                stops: steps
              },
              "line-width": 15,
              "line-opacity":set_opacity,
          },
          "layout": {
              "line-join": "round",
              "line-cap": "round"
          },
      });
      this.map.addLayer({
          "id": "Route2",
          "type": "line",
          "source": 'route2',
          "paint": {
            "line-color": {
              property:"street_score",
              stops: steps
            },
            "line-width": 15,
            "line-opacity":set_opacity
          },
          "layout": {
              "line-join": "round",
              "line-cap": "round"
          },
      });
    });

    this.popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false
    });

    this.map.on('mousemove',"Route0", this.add.bind(this));
    this.map.on('mouseleave',"Route0", this.remove.bind(this));

    this.map.on('mousemove',"Route1", this.add.bind(this));
    this.map.on('mouseleave',"Route1", this.remove.bind(this));

    this.map.on('mousemove',"Route2", this.add.bind(this));
    this.map.on('mouseleave',"Route2", this.remove.bind(this));

  }

  add(e){
    var score = e.features[0].properties.street_score;
    let route = "Route"+String(e.features[0].properties.route);


    let text = "<b>Street Score:</b> "+String(score)
    this.popup.setLngLat(e.lngLat).setHTML(text).addTo(this.map);


    this.map.setPaintProperty(route, 'line-opacity', 1)
  }

  remove(e){
    this.popup.remove();
    this.map.setPaintProperty('Route0', 'line-opacity', set_opacity)
    this.map.setPaintProperty('Route1', 'line-opacity', set_opacity)
    this.map.setPaintProperty('Route2', 'line-opacity', set_opacity)
  }


  render() {

    return (
      <div>
        <div ref={el => this.mapContainer = el} className="absolute top right left bottom" />
      </div>
    );
  }
}

ReactDOM.render(<Application />, document.getElementById('app'));

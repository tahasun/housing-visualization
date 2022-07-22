import { GoogleMapsOverlay } from '@deck.gl/google-maps';
import { HexagonLayer } from '@deck.gl/aggregation-layers';
import { ScatterplotLayer } from '@deck.gl/layers';
import mapStyles from './map-styles';

const sourceData = './houses.json';

const scatterplot = () => new ScatterplotLayer({
    id: 'scatter',
    data: sourceData,
    opacity: 0.5,
    filled: true,
    radiusMinPixels: 10,
    radiusMaxPixels: 50,
    getPosition: d => [d.longitude, d.latitude],
    getFillColor: d => (d.median_income)*10000/d.median_house_value  > 0.5 ? [200, 0, 40, 150] : [255, 140, 0, 100],
    onHover: ({object, x, y}) => {
      const el = document.getElementById('tooltip');
      if (object) {
        console.log(object);
        const { median_house_value, median_income} = object;
        
        console.log((median_income)*10000/median_house_value);
        el.innerHTML = 
        `<div>Price ${median_hose_valueu}</div> 
         <div>Household Income ${Math.ceil(median_income*10)}k</div>
         <div>Ratio ${(median_income*10000)/median_house_value}</div>
        `;
        el.style.display = 'block';
        el.style.opacity = 0.9;
        el.style.left = x + 'px';
        el.style.top = y + 'px';
      } else {
        el.style.opacity = 0.0;
      }
    }
  });

const colorRange = [
  [255,255,204], [255,237,160], [254,217,118],
  [254,178,76], [253,141,60], [252,78,42], 
  [227,26,28], [189,0,38], [128,0,38]
];

const hexagon = () => new HexagonLayer({
    id: 'hex',
    data: sourceData,
    getPosition: d => [d.longitude, d.latitude],
    getColorWeight: d => d.median_house_value,
    colorAggregation:'MEAN',
    getElevationWeight: d => d.median_income,
    elevationAggregation: 'MEAN',
    elevationScale: 100,
    colorRange,
    extruded: true,
    radius: 1610,         
    opacity: 0.6,        
    coverage: 0.88,
    lowerPercentile: 50,
    pickable: true,
    onHover: ({object, x, y}) => {
      const el = document.getElementById('tooltip');
      if (object) {
        const { median_house_value, median_income, households, 
          median_age, tot_bedrooms, tot_rooms, population} = object.points[0];
        
        el.innerHTML = 
        `<div>Price ${median_house_value}</div> 
         <div>Household Income ${Math.ceil(median_income*10)}k</div>
         <div>Bedrooms ${Math.ceil(tot_bedrooms/households)}</div>
         <div>Total Rooms ${Math.ceil(tot_rooms/households)}</div>
         <div>Residents ${Math.ceil(population/households)}</div>
         <div>Built in ${1990-median_age}</div>
        `;
        el.style.display = 'block';
        el.style.opacity = 0.9;
        el.style.left = x + 'px';
        el.style.top = y + 'px';
      } else {
        el.style.opacity = 0.0;
      }
    }
});


window.initMap = () => {
    const map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 36.0, lng: -119.0},
        zoom: 10,
        styles: mapStyles
    });

    const overlay = new GoogleMapsOverlay({
        layers: [
            scatterplot(),
            hexagon()
        ],
    });

    overlay.setMap(map);
}
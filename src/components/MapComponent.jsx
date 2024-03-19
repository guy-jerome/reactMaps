import React, { useRef, useEffect, useState } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Style from "ol/style/Style";
import Icon from "ol/style/Icon";
import Draw from "ol/interaction/Draw";
import Point from "ol/geom/Point";
import Select from "ol/interaction/Select";

const MapComponent = () => {
  const mapRef = useRef();
  const [drawInteraction, setDrawInteraction] = useState(null);

  useEffect(() => {
    const map = new Map({
      target: mapRef.current,
      layers: [new TileLayer({ source: new OSM() })],
      view: new View({ center: [0, 0], zoom: 2 }),
    });

    // Vector Layer for Drawn Features
    const vectorLayer = new VectorLayer({
      source: new VectorSource(),
      style: new Style({
        image: new Icon({
          src: "https://openlayers.org/en/latest/examples/data/dot.png",
          scale: 0.5,
        }),
      }),
    });
    map.addLayer(vectorLayer);

    // Draw Interaction
    const draw = new Draw({
      source: vectorLayer.getSource(),
      type: "Point",
    });
    map.addInteraction(draw);
    setDrawInteraction(draw);

    const selectInteraction = new Select();
    map.addInteraction(selectInteraction);

    selectInteraction.on("select", function (e) {
      // Get the selected feature(s)
      const selectedFeatures = e.selected;

      if (selectedFeatures.length > 0) {
        const selectedFeature = selectedFeatures[0];

        // Remove from the vector layer's source
        selectedFeature.getSource().removeFeature(selectedFeature);
      }
    });

    return () => {
      map.setTarget(undefined);
      if (drawInteraction) map.removeInteraction(drawInteraction);
    };
  }, []);

  return (
    <div
      ref={mapRef}
      className="map-container"
      style={{ height: "400px", width: "50%" }}
    />
  );
};

export default MapComponent;

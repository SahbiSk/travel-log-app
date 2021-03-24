import React, { useState, useEffect, Fragment } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import { IoIosPin } from "react-icons/io";
import { listLogEntries } from "./API";
import LogEntryForm from "./LogEntryForm";

const App = () => {
  const [viewport, setViewport] = useState({
    latitude: 35.8124921,
    longitude: 10.6361194,
    zoom: 4,
    width: "100vw",
    height: "100vh",
  });
  const [showPopup, setShowPopup] = useState({});
  const [addEntryLocation, setAddEntryLocation] = useState(null);
  const [logEntries, setLogEntries] = useState([]);

  const getEntries = async () => {
    try {
      const res = await listLogEntries();
      setLogEntries(res);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getEntries();
  }, []);

  const showAddMarkerPopup = (event) => {
    const [longitude, latitude] = event.lngLat;
    setAddEntryLocation({
      latitude,
      longitude,
    });
  };

  return (
    <ReactMapGL
      {...viewport}
      onViewportChange={(viewport) => setViewport(viewport)}
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      mapStyle={"mapbox://styles/mapbox/basic-v9"}
      onDblClick={showAddMarkerPopup}
    >
      {logEntries.map((entry) => (
        <Fragment key={entry._id}>
          <Marker
            latitude={entry.latitude}
            longitude={entry.longitude}
            offsetLeft={-12}
            offsetTop={-24}
          >
            <IoIosPin
              onClick={() =>
                setShowPopup({
                  [entry._id]: true,
                })
              }
              className="marker"
              style={{
                height: 6 * viewport.zoom + "px",
                width: 24 * viewport.zoom + "px",
              }}
            />
            <div>{entry.title}</div>
          </Marker>
          {showPopup[entry._id] ? (
            <Popup
              latitude={entry.latitude}
              longitude={entry.longitude}
              closeButton={true}
              closeOnClick={false}
              onClose={() => setShowPopup({})}
              anchor="top"
              dynamicPosition
            >
              <div className="popup">
                <h3>{entry.title} </h3>
                <p>{entry.comments} </p>
                <small>{entry.description} </small>
                {entry.image && (
                  <img src={entry.image} alt={entry.title} className="image" />
                )}
              </div>
            </Popup>
          ) : null}
        </Fragment>
      ))}

      {addEntryLocation ? (
        <Fragment>
          <Marker
            latitude={addEntryLocation.latitude}
            longitude={addEntryLocation.longitude}
          >
            <IoIosPin
              className="marker red"
              style={{
                height: 6 * viewport.zoom + "px",
                width: 24 * viewport.zoom + "px",
              }}
            />
          </Marker>

          <Popup
            latitude={addEntryLocation.latitude}
            longitude={addEntryLocation.longitude}
            closeButton={true}
            closeOnClick={false}
            onClose={() => setShowPopup({})}
            anchor="top"
            dynamicPosition
          >
            <div className="popup">
              <LogEntryForm
                onClose={() => {
                  setAddEntryLocation(null);
                  getEntries();
                }}
                location={addEntryLocation}
              />
            </div>
          </Popup>
        </Fragment>
      ) : null}
    </ReactMapGL>
  );
};

export default App;

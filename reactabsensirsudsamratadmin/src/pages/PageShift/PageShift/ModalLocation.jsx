import React, { useState, forwardRef, useEffect } from "react";
import Popup from "reactjs-popup";
import api from "../../config/axios";
import { HiOutlineX } from "react-icons/hi";
import { MapContainer, TileLayer, useMapEvents, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const ModalLocation = forwardRef((schedule, ref) => {
  const [markerPosition, setMarkerPosition] = useState({
    lat: null,
    lng: null,
  });

  const [options, setOptions] = useState([]);
  const [hospitalName, setsHospitalName] = useState("");

  const postLocationData = () => {
    const dataLocation = {
      locationName: hospitalName.toString(),
      latitude: markerPosition.lat,
      longitude: markerPosition.lng,
    };

    api
      .post("/api/v1/dev/locations", dataLocation)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    // Fetch data from API
    api
      .get("/api/v1/dev/locations")
      .then((res) => {
        setOptions(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleHospitalInput = (e) => {
    setsHospitalName(e);
  };

  const closeModal = () => {
    ref.current.close();
    setMarkerPosition({ lat: null, lng: null });
  };

  function LocationMarker() {
    const [position, setPosition] = useState(null);
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
        setMarkerPosition(e.latlng);
      },
    });

    return position === null ? null : (
      <Marker position={position}>
        <Popup>You are here</Popup>
      </Marker>
    );
  }

  return (
    <Popup
      ref={ref}
      modal
      onClose={closeModal}
      contentStyle={{ borderRadius: "12px", padding: "0", width: "35rem" }}
    >
      {(close) => (
        <div className="relative p-6 overflow-hidden">
          {/* create location*/}
          <div className="flex gap-4 mb-2 mt-4 items-center flex-col">
            <h1>Create Location</h1>
            <MapContainer
              center={[1.3089757786697331, 124.91652488708498]}
              zoom={17}
              style={{ height: "20rem", width: "30rem" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {markerPosition && <Marker position={markerPosition} />}
              <LocationMarker />
            </MapContainer>
            <input
              type="text"
              name="name"
              placeholder="Location Name"
              className="w-full input input-bordered"
              onChange={handleHospitalInput}
            />
            <button
              onClick={() => {
                postLocationData();
              }}
              className="text-white btn bg-primary-2 hover:bg-primary-3 w-full"
            >
              Create Location
            </button>
            <button
              className="absolute block cursor-pointer top-1 right-1"
              onClick={close}
            >
              <HiOutlineX className="text-2xl text-gray-500" />
            </button>
          </div>
        </div>
      )}
    </Popup>
  );
});

export default ModalLocation;

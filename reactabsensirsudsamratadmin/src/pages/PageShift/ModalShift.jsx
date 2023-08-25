import React, { useState, forwardRef, useEffect } from "react";
import Popup from "reactjs-popup";
import { HiOutlineX } from "react-icons/hi";
import { HiArrowDown, HiChevronDown } from "react-icons/hi";
import { api } from "../../config/axios";
import { MapContainer, TileLayer, useMapEvents, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const ModalShift = forwardRef((props, ref) => {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [dateSchedule, setDateSchedule] = useState("");
  const [scheduleTime, setscheduleTime] = useState("Shift");
  const [locId, setLocId] = useState("Nama Lokasi");
  const [isOpen, setIsOpen] = useState(false);
  const [markerPosition, setMarkerPosition] = useState({
    lat: null,
    lng: null,
  });
  const [isOpenLocation, setIsOpenLocation] = useState(false);
  const [options, setOptions] = useState([]);
  const [hospitalName, setsHospitalName] = useState("");
  const [locName, setLocName] = useState("Nama Lokasi");

  const postScheduleData = () => {
    const dataSchedule = {
      shiftId: null,
      scheduleDate: dateSchedule,
      locationId: locId,
    };

    if (scheduleTime === "Pagi") {
      dataSchedule.shiftId = 1;
    } else if (scheduleTime === "Siang") {
      dataSchedule.shiftId = 2;
    } else if (scheduleTime === "Malam") {
      dataSchedule.shiftId = 3;
    } else if (scheduleTime === "Management") {
      dataSchedule.shiftId = 4;
    }

    const dataDateRange = {
      shiftId: 2,
      startDate: dateFrom,
      endDate: dateTo,
      locationIds: [1, 1, 1, 1, 1, 1, 1],
    };

    api
      .post("/api/v1/dev/schedule", dataSchedule)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
    api
      .post("/api/v1/dev/schedule/add-schedule-with-time-range", dataDateRange)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

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

  const handleOptionClick = (option) => {
    setscheduleTime(option);
    toggleDropdown();
  };

  const handleLocClick = (id, name) => {
    setLocId(id);
    setLocName(name);
    console.log(id, name);
    toggleLocDropdown();
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const toggleLocDropdown = () => {
    setIsOpenLocation(!isOpenLocation);
  };

  const handleDateChangeTo = (e) => {
    setDateTo(e.target.value);
  };

  const handleDateChangeFrom = (e) => {
    setDateFrom(e.target.value);
  };

  const handleDateChangeSchedule = (e) => {
    setDateSchedule(e.target.value);
  };

  const closeModal = () => {
    ref.current.close();
    setMarkerPosition({ lat: null, lng: null });
    setscheduleTime("Shift");
    setLocName("Nama Lokasi");
    props.onClose();
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
      contentStyle={{ borderRadius: "12px", padding: "0", width: "28rem" }}
    >
      {(close) => (
        <div className="relative p-6 overflow-hidden">
          <div className="flex mb-8 items-center justify-center">
            <button
              className="absolute block cursor-pointer top-1 right-1"
              onClick={close}
            >
              <HiOutlineX className="text-2xl text-gray-500" />
            </button>
            {props.type === "location" ? (
              <div className="flex gap-4 mb-2 mt-4 items-center justify-between flex-col">
                <h1>Create Location</h1>
                <MapContainer
                  center={[1.3089757786697331, 124.91652488708498]}
                  zoom={17}
                  style={{ height: "20rem", width: "25rem" }}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  {markerPosition && <Marker position={markerPosition} />}
                  <LocationMarker />
                </MapContainer>
                <input
                  type="text"
                  name="name"
                  placeholder="Nama Lokasi"
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
              </div>
            ) : (
              <div>
                {/* create schedule*/}
                <div className="flex gap-4 mb-2 mt-4 items-center flex-col">
                  <h1>Create Schedule</h1>
                  <div className="relative inline-block text-left w-96">
                    <button
                      type="button"
                      className="dropdown-button btn h-12 justify-between w-full px-4 py-2 text-sm font-medium text-gray-400 bg-white border border-primary-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-2"
                      onClick={toggleLocDropdown}
                    >
                      {locName}
                      <HiChevronDown />
                    </button>
                    <ul
                      className={` overflow-auto max-h-[10rem] dropdown-list absolute z-10 ${
                        isOpenLocation ? "block" : "hidden"
                      } w-32 py-1 mt-2 bg-white border border-gray-300 rounded-md shadow-lg transition ease-in-out duration-200 transform ${
                        isOpenLocation
                          ? "opacity-100 scale-y-100"
                          : "opacity-0 scale-y-95"
                      }`}
                    >
                      {options.map((option) => (
                        <li
                          key={option.locationId}
                          className="block px-4 py-2 text-sm text-gray-400 cursor-pointer hover:bg-primary-2 hover:text-white"
                          onClick={() =>
                            handleLocClick(
                              option.locationId,
                              option.locationName
                            )
                          }
                        >
                          {option.locationName}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="relative inline-block text-left w-96">
                    <button
                      type="button"
                      className="dropdown-button btn h-12 justify-between w-full px-4 py-2 text-sm font-medium text-gray-400 bg-white border border-primary-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-2"
                      onClick={toggleDropdown}
                    >
                      {scheduleTime}
                      <HiChevronDown />
                    </button>
                    <ul
                      className={`dropdown-list absolute z-10 ${
                        isOpen ? "block" : "hidden"
                      } w-32 py-1 mt-2 bg-white border border-gray-300 rounded-md shadow-lg transition ease-in-out duration-200 transform ${
                        isOpen
                          ? "opacity-100 scale-y-100"
                          : "opacity-0 scale-y-95"
                      }`}
                    >
                      <li
                        className="block px-4 py-2 text-sm text-gray-400 cursor-pointer hover:bg-primary-2 hover:text-white"
                        onClick={() => handleOptionClick("Pagi")}
                      >
                        Pagi
                      </li>
                      <li
                        className="block px-4 py-2 text-sm text-gray-400 cursor-pointer hover:bg-primary-2 hover:text-white"
                        onClick={() => handleOptionClick("Siang")}
                      >
                        Sore
                      </li>
                      <li
                        className="block px-4 py-2 text-sm text-gray-400 cursor-pointer hover:bg-primary-2 hover:text-white"
                        onClick={() => handleOptionClick("Malam")}
                      >
                        Malam
                      </li>
                      <li
                        className="block px-4 py-2 text-sm text-gray-400 cursor-pointer hover:bg-primary-2 hover:text-white"
                        onClick={() => handleOptionClick("Management")}
                      >
                        Management
                      </li>
                    </ul>
                  </div>
                  <input
                    type="date"
                    onChange={handleDateChangeSchedule}
                    className="w-full text-gray-400 input input-bordered"
                  />
                  {/* create schedule data range*/}
                  <div className="flex w-96 flex-col items-center gap-2 mb-8">
                    <h1 className=" self-start">Tanggal</h1>
                    <button
                      className="absolute block cursor-pointer top-1 right-1"
                      onClick={closeModal}
                    >
                      <HiOutlineX className="text-2xl text-gray-500" />
                    </button>
                    <input
                      type="date"
                      onChange={handleDateChangeFrom}
                      className="w-full text-gray-400 input input-bordered"
                    />

                    <input
                      type="date"
                      onChange={handleDateChangeTo}
                      className="w-full text-gray-400 input input-bordered"
                    />
                  </div>
                  <button
                    onClick={() => {
                      postScheduleData();
                      closeModal();
                    }}
                    className="text-white btn bg-primary-2 hover:bg-primary-3 w-96"
                  >
                    Create Schedule
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </Popup>
  );
});

export default ModalShift;

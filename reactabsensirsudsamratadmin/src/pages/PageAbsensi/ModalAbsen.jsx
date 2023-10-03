import React, { useState, useEffect } from "react";
import { api, apiCheckToken } from "../../config/axios";

import bgModal from "../../assets/modal-bg.png";
import { HiUpload, HiEye, HiEyeOff, HiX, HiChevronDown } from "react-icons/hi";
import axios from "axios";

const ModalAbsen = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  // const [data, setData] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [reloadApi, setReloadApi] = useState(false);
  const [employeeData, setEmployeeData] = useState([]);
  const [dropdownEmpIsOpen, setDropdownEmpIsOpen] = useState(false);
  const [dropDownText, setDropDownText] = useState("");
  const [empId, setEmpId] = useState(null);
  const [schId, setSchId] = useState(null);
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredNames, setFilteredNames] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const closeModal = () => {
    setReloadApi(!reloadApi);
    setDropDownText("");
    setSearchTerm("");
    setSelectedFile(null);
    setDropdownEmpIsOpen(false);
    onClose();
  };

  const handleTest = () => {
    const test3 = filteredSchedules;
    const test4 = schId;
    const test5 = empId;
    console.log(test3, test4, test5);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    console.log(selectedFile.name);
  };

  const handleClockInRequest = () => {
    // Get current date and time
    const now = new Date();

    // Set the target date to September 25, 2023
    const targetDate = new Date(); // Note: Months are 0-based, so 8 represents September

    // Format the attendanceDate in "YYYY-MM-DD" format
    const formattedAttendanceDate = `${targetDate.getFullYear()}-${(
      targetDate.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${targetDate.getDate().toString().padStart(2, "0")}`;

    // Format the clockIn time in "YYYY-MM-DDTHH:mm:ss" format
    const formattedClockIn = `${formattedAttendanceDate}T${now
      .toLocaleTimeString([], { hour12: false })
      .padStart(8, "0")}`; // Using client local time

    // setData({
    //   scheduleId: schId,
    //   employeeId: empId,
    //   attendanceDate: formattedAttendanceDate,
    //   clockIn: formattedClockIn,
    //   clockOut: "",
    //   locationLatIn: 37.7749,
    //   locationLongIn: -122.4194,
    //   status: "CheckIn",
    //   attendanceType: "WFO",
    //   selfieCheckInImage: selectedFile.name,
    // });

    const data = new FormData();
    data.append("scheduleId", 34);
    data.append("employeeId", 66);
    data.append("attendanceDate", `${formattedAttendanceDate}`);
    data.append("clockIn", `${formattedClockIn}`);
    data.append("clockOut", "");
    data.append("locationLatIn", "37.7749");
    data.append("locationLongIn", "-122.4194");
    data.append("status", "CheckIn");
    data.append("attendanceType", "WFO");
    data.append("selfieCheckInImage", selectedFile);
    console.log(data);
    api
      .post("/api/v1/dev/attendances/checkInMasuk", data, {
        header: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        console.log(res);
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
        const test = data;
        console.log(test);
      });

    // axios
    //   .post(
    //     "http://rsudsamrat.site:9999/api/v1/dev/attendances/checkInMasuk",
    //     data
    //   )
    //   .then((response) => {
    //     console.log(response.data); // Handle the response data
    //   })
    //   .catch((error) => {
    //     console.error("Error:", error); // Handle errors
    //   });
  };

  const handleOptionClick = (id, name) => {
    setDropDownText(name);
    setEmpId(id);
    setSearchTerm(name);
    const filteredSch = schedule.filter((schedule) =>
      schedule.employees.some((employee) => employee.name === name)
    );
    setFilteredSchedules(filteredSch);
    setSchId(filteredSch[0].scheduleId);
    toggleDropdownEmp();
  };

  const toggleDropdownEmp = () => {
    setDropdownEmpIsOpen(!dropdownEmpIsOpen);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setDropdownEmpIsOpen(true);
  };

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredNames(employeeData);

      return;
    }
    const results = employeeData.filter((e) =>
      e.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredNames(results);
  }, [searchTerm, employeeData]);

  useEffect(() => {
    // Fetch data from API
    api
      .get("/api/v1/dev/schedule")
      .then((res) => {
        const dataSchedule = res.data;

        const currentDate = new Date().toISOString().split("T")[0];

        const schData = dataSchedule.filter(
          (schedule) => schedule.scheduleDate === currentDate
        );

        setSchedule(schData);
        // const test = schedule;
        // console.log(test);

        const extractedEmployees = schedule.reduce((employees, schedule) => {
          schedule.employees.forEach((employee) => {
            employees.push({ id: employee.employeeId, name: employee.name });
          });
          return employees;
        }, []);

        // Set the extracted employee data to the state
        setEmployeeData(extractedEmployees);
        // const test2 = employeeData;
        // console.log(test2);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [isOpen]);

  return (
    <div>
      <dialog className={`modal ${isOpen ? "modal-open" : ""}`}>
        <div
          className="absolute top-0 left-0 w-full h-full"
          onClick={closeModal}
        ></div>
        <div className="relative w-96 modal-box">
          <form method="dialog">
            <div className="flex justify-end">
              <HiX onClick={closeModal} className="cursor-pointer" />
            </div>
            <h3 className="mb-3 text-lg font-bold mr-auto ml-0">
              Employee Absence
            </h3>
            <div className="flex justify-between">
              <div className="grid gap-3">
                <div className="relative">
                  <input
                    type="text"
                    className="w-64 p-2 border border-gray-300 rounded"
                    placeholder="Search names..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onClick={toggleDropdownEmp}
                  />
                  <ul
                    className={`dropdown-content absolute z-10 ${
                      dropdownEmpIsOpen ? "block" : "hidden"
                    } w-full mt-1 p-2 bg-white border border-gray-300 rounded-md shadow-lg transition ease-in-out duration-200 transform ${
                      dropdownEmpIsOpen
                        ? "opacity-100 scale-y-100 max-h-40 overflow-y-auto"
                        : "opacity-0 scale-y-95"
                    }`}
                  >
                    {filteredNames.map((e) => (
                      <li
                        key={e.employeeId}
                        className="block px-4 py-2 text-sm text-gray-400 cursor-pointer hover:bg-primary-2 hover:text-white"
                        onClick={() => handleOptionClick(e.id, e.name)}
                      >
                        {e.name}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <label
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    for="file_input"
                  >
                    Upload foto
                  </label>
                  <input
                    type="file"
                    class="block w-full text-sm border border-slate-500 text-gray-500 rounded-md
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-md file:border-0
                            file:text-sm file:font-semibold
                        file:bg-primary-2 file:text-white
                        hover:file:bg-primary-3"
                    onChange={handleFileUpload}
                  />
                </div>
              </div>
              <div className="mt-1 mr-10"></div>
            </div>
            <div className="modal-action">
              <button
                className="btn bg-[#01A7A3] text-white"
                onClick={handleClockInRequest}
              >
                Clock In
              </button>
            </div>
            {/* <div className="modal-action">
              <button
                className="btn bg-[#01A7A3] text-white"
                onClick={handleTest}
              >
                test
              </button>
            </div> */}
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default ModalAbsen;

import React, { useState, useEffect } from "react";
import {
  HiSearch,
  HiChevronDown,
  HiDownload,
  HiOutlinePencil,
  HiChevronLeft,
} from "react-icons/hi";
import DataTable from "react-data-table-component";
import api from "../../config/axios";
import { useNavigate } from "react-router-dom";

export default function ViewAllSchedule() {
  const [reloadApi, setReloadApi] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  // const [absences, setAbsences] = useState([]);
  const [scheduleTime, setscheduleTime] = useState("Shift");
  const [isOpen, setIsOpen] = useState(false);

  const [schedule, setSchedule] = useState([]);

  const filteredScheduleData = schedule.filter((sch) =>
    sch.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const navigate = useNavigate();

  const handleOptionClick = (option) => {
    setscheduleTime(option);
    toggleDropdown();
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const columns = [
    {
      name: "Nama",
      selector: (row) => row.name,
    },
    {
      name: "Password",
      selector: (row) => row.password,
    },
    {
      name: "NIK",
      selector: (row) => row.nik,
    },
    {
      name: "Bidang/Jabatan",
      selector: (row) => row.role,
    },
    {
      name: "Action",
      cell: (row) => (
        <div>
          <button
            type="button"
            className="mr-2 text-white btn btn-sm bg-primary-2 hover:bg-primary-3"
          >
            <HiDownload />
          </button>
          <button
            type="button"
            className=" mr-2 btn btn-sm text-white bg-primary-2 hover:bg-primary-3"
          >
            <HiOutlinePencil />
          </button>
        </div>
      ),
    },
  ];

  const handleEdit = (id) => {
    console.log(`Edit button clicked for row with id: ${id}`);
  };

  const handleDelete = (id) => {
    console.log(`Delete button clicked for row with id: ${id}`);
  };

  const customStyles = {
    headCells: {
      style: {
        fontWeight: "bold",
      },
    },
  };

  useEffect(() => {
    // Fetch data from API
    api
      .get("/api/v1/dev/schedule")
      .then((res) => {
        const allEmployees = [];
        const dataSchedule = res.data;
        for (const sch of dataSchedule) {
          const employees = sch.employees;

          for (const emp of employees) {
            allEmployees.push(emp);
          }
        }
        setSchedule(allEmployees);
        console.log(allEmployees);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [reloadApi]);

  return (
    <div>
      <button
        className="btn bg-transparent border-none"
        onClick={() => navigate(`/shift`)}
      >
        <HiChevronLeft />
        Schedule
      </button>
      <div className="flex items-center justify-between">
        <h1 className=" text-2xl">See All Employee Schedule</h1>
        <button
          type="button"
          className=" gap-2 px-14 py-3 font-semibold text-white rounded-md bg-primary-2"
        >
          Print PDF
        </button>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-end">
          {/* Search Bar */}
          <div className="flex items-center relative w-full mr-4">
            <HiSearch className="absolute left-4" />
            <input
              type="text"
              placeholder="Cari..."
              className="w-full pl-10 input input-bordered"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="">
            Tanggal:
            <div className="flex justify-center items-center gap-2">
              <input
                type="date"
                defaultValue={new Date().toISOString().slice(0, 10)}
                className="input input-bordered"
              />
              <p>-</p>
              <input
                type="date"
                defaultValue={new Date().toISOString().slice(0, 10)}
                className="input input-bordered"
              />
              <div className="relative inline-block text-left w-48">
                <button
                  type="button"
                  className="dropdown-button btn h-12 justify-between w-full text-primary-2 bg-white border border-primary-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-2"
                  onClick={toggleDropdown}
                >
                  {scheduleTime}
                  <HiChevronDown />
                </button>
                {/*dropdown*/}

                <ul
                  className={`dropdown-content absolute z-10 ${
                    isOpen ? "block" : "hidden"
                  } w-full mt-1 p-2 bg-white border border-gray-300 rounded-md shadow-lg transition ease-in-out duration-200 transform ${
                    isOpen ? "opacity-100 scale-y-100" : "opacity-0 scale-y-95"
                  }`}
                >
                  <li
                    className="block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-slate-200 rounded-md"
                    onClick={() => handleOptionClick("Pagi")}
                  >
                    Pagi
                  </li>
                  <li
                    className="block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-slate-200 rounded-md"
                    onClick={() => handleOptionClick("Siang")}
                  >
                    Siang
                  </li>
                  <li
                    className="block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-slate-200 rounded-md"
                    onClick={() => handleOptionClick("Malam")}
                  >
                    Malam
                  </li>
                </ul>

                {/*dropdown*/}
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-500">
          {filteredScheduleData.length} schedule
        </p>
        <div className=" overflow-auto max-h-[60vh]">
          <DataTable
            columns={columns}
            data={filteredScheduleData}
            customStyles={customStyles}
          />
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import {
  HiSearch,
  HiChevronDown,
  HiDownload,
  HiOutlinePencil,
  HiChevronLeft,
} from "react-icons/hi";
import DataTable from "react-data-table-component";
import { api } from "../../config/axios";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function ViewAllSchedule() {
  const [reloadApi, setReloadApi] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [schedulefl, setSchedulefl] = useState("");

  const [filteredSchedule, setFilteredSchedule] = useState([]);
  // const [absences, setAbsences] = useState([]);
  const [scheduleTime, setscheduleTime] = useState("Shift");
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [schedule, setSchedule] = useState([]);

  // const filteredScheduleData = schedule.filter((sch) =>
  //   sch.name.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  const navigate = useNavigate();

  const generatePDF = () => {
    let data = filteredSchedule.map((employee) => {
      return {
        name: employee?.name,
        bidang: employee?.role,
        password: employee?.password,
        nik: employee?.nik,
      };
    });
    const doc = new jsPDF();
    doc.text("employee schedule", 20, 10);
    doc.autoTable({
      theme: "grid",
      columns: pdfcolumns.map((col) => ({ ...col, dataKey: col.field })),
      body: data,
    });
    doc.save("table.pdf");
    console.log(data);
  };

  const studentData = [
    {
      id: 1,
      name: "Neeraj",
      email: "neeraj@gmail.com",
      year: 2015,
      fee: 167000,
    },
    {
      id: 2,
      name: "Vikas",
      email: "vikas@gmail.com",
      year: 2013,
      fee: 785462,
    },

    {
      id: 3,
      name: "Rahul",
      email: "rahul@gmail.com",
      year: 2020,
      fee: 784596,
    },
  ];

  const pdfcolumns = [
    { title: "Name", field: "name" },
    { title: "Bidang", field: "bidang" },
    { title: "Password", field: "password" },
    { title: "NIK", field: "nik", type: "numeric" },
  ];

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
        setFilteredSchedule(allEmployees);
        setSchedule(res.data);
        console.log(res.data);

        // console.log(allEmployees);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [reloadApi]);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredSchedule(
        schedule
          .filter((schedule) => schedule.employees.length !== 0)
          .map((schedule) => schedule.employees)
          .flat()
      );
      return;
    }
    const results = schedule
      .map((schedule) => schedule.employees)
      .flat()
      .filter((employee) =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    setFilteredSchedule(results);
  }, [searchTerm, schedule]);

  useEffect(() => {
    if (startDate === null || endDate === null) {
      return;
    }

    const startDateFormatted = startDate.split("-").join("-");
    const endDateFormatted = endDate.split("-").join("-");

    console.log(startDateFormatted, endDateFormatted);

    if (startDateFormatted > endDateFormatted) {
      alert("Tanggal awal tidak boleh lebih besar dari tanggal akhir");
      return;
    }

    setFilteredSchedule(
      schedule
        .filter(
          (schedule) =>
            schedule.scheduleDate >= startDateFormatted &&
            schedule.scheduleDate <= endDateFormatted &&
            schedule.employees.length !== 0
        )
        .map((schedule) => schedule.employees)
        .flat()
    );
  }, [startDate, endDate, schedule]);

  useEffect(() => {
    if (scheduleTime === "Shift") {
      setFilteredSchedule(
        schedule.map((schedule) => schedule.employees).flat()
      );
      return;
    }

    const results = schedule.filter((schedule) => {
      const startTime = schedule.shift.start_time;
      let shiftLabel = "";

      if (startTime === "08:00:00") {
        shiftLabel = "Pagi";
      } else if (startTime === "14:00:00") {
        shiftLabel = "Sore";
      } else if (startTime === "16:00:00") {
        shiftLabel = "Malam";
      }
      if (shiftLabel === scheduleTime) {
        return schedule;
      }
    });

    setFilteredSchedule(results.map((schedule) => schedule.employees).flat());
  }, [schedule, scheduleTime]);

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
          onClick={generatePDF}
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
                className="input input-bordered"
                onChange={(e) => setStartDate(e.target.value)}
              />
              <p>Sampai</p>
              <input
                type="date"
                className="input input-bordered"
                onChange={(e) => setEndDate(e.target.value)}
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
                    Pagi/Management
                  </li>
                  <li
                    className="block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-slate-200 rounded-md"
                    onClick={() => handleOptionClick("Sore")}
                  >
                    Sore
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
          {filteredSchedule.length} pegawai
        </p>
        <div className=" overflow-auto max-h-[60vh]" id="content">
          <DataTable
            columns={columns}
            data={filteredSchedule}
            customStyles={customStyles}
          />
        </div>
      </div>
    </div>
  );
}

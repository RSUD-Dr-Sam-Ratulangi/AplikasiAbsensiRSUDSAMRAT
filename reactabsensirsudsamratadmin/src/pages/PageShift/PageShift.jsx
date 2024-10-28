import React, { useState, useRef, useEffect } from "react";
import { HiSearch, HiOutlineTrash, HiChevronDown, HiOutlinePencil } from "react-icons/hi";
import DataTable from "react-data-table-component";
import ModalShift from "./ModalShift";
import { api } from "../../config/axios";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import Popup from "reactjs-popup";
import { toast } from "react-toastify";

export default function PageShift() {
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [scheduleTime, setscheduleTime] = useState("Shift");
  const [isOpen, setIsOpen] = useState(false);
  const modalShiftRef = useRef(null);
  const [schedule, setSchedule] = useState([]);
  const [filteredSchedule, setFilteredSchedule] = useState([]);
  const [scheduleDay, setScheduleDay] = useState([]);
  const [modalType, setModalType] = useState("location");
  const [selectedSchedule, setSelectedSchedule] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(0);
  const modalDelete = useRef(null);

  const navigate = useNavigate();

  // const checkDoubleSchedule = async () => {
  //   try {
  //     const response = await api.get('/api/v1/dev/schedule');
      
  //     const scheduleDates = response.data.map(item => item.scheduleDate);
  //     const dateCount = scheduleDates.filter(date => date === '2024-09-04').length;
      
  //     console.log(`The date 2024-09-04 appears ${dateCount} times in the schedule.`);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };
  const deleteSchedules = async () => {
    try {
      const response = await api.get('/api/v1/dev/schedule');
      
      // Filter schedules with date '2024-09-04' except the one with scheduleId 495
      const schedulesToDelete = response.data.filter(
        item => item.scheduleDate === '2024-11-01' && item.scheduleId !== 725
      );
      
      // Delete each filtered schedule
      for (const schedule of schedulesToDelete) {
        await api.delete(`/api/v1/dev/schedule/${schedule.scheduleId}`);
        console.log(`Deleted schedule with ID: ${schedule.scheduleId}`);
      }
  
      console.log(`Deleted ${schedulesToDelete.length}`);
    } catch (err) {
      console.log(err);
    }
  };

  const handleOptionClick = (option) => {
    setscheduleTime(option);
    toggleDropdown();
  };

  const deleteSuccess = () =>
    toast("Schedule berhasil di hapus", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      theme: "light",
      progressStyle: { background: "green" },
    });

  const deleteFailed = () =>
    toast("Eror, schedule tidak berhasil dihapus", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      theme: "light",
      progressStyle: { background: "red" },
    });

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const columns = [
    {
      name: "ID",
      selector: (row) => row.scheduleId,
      width: "100px",
    },
    {
      name: "Date",
      selector: (row) => row.scheduleDate,
    },
    {
      name: "Shift",
      cell: (row) => row.shift.name,
    },
    {
      name: "Time",
      cell: (row) => `${row.shift.start_time} - ${row.shift.end_time}`,
    },
    // {
    //   name: "Location",
    //   cell: (row) => row.location ?? dummyString,
    // },
    {
      name: "Action",
      cell: (row) => (
        <div>
          <button
            type="button"
            className="mr-2 text-white btn btn-sm bg-primary-2 hover:bg-primary-3"
            onClick={() => {
              handleEdit(row);
            }}
          >
            <HiOutlinePencil />
          </button>
          <button
            type="button"
            className="text-white bg-red-600 btn btn-sm hover:bg-red-700"
            onClick={() => {
              setDeleteId(row.scheduleId);
              modalDelete.current.open();
            }}
          >
            <HiOutlineTrash />
          </button>
        </div>
      ),
    },
  ];

  const columns2 = [
    {
      name: "ID",
      selector: (row) => row.scheduleId,
      width: "100px",
    },
    {
      name: "Date",
      selector: (row) => row.scheduleDate,
    },
    {
      name: "Shift Name",
      selector: (row) => row.shift.name,
    },
    {
      name: "Shift Time",
      selector: (row) => `${row.shift.start_time} - ${row.shift.end_time}`,
    },
    {
      name: "Employee Count",
      selector: (row) => row.employees.length,
    },
    {
      name: "Location",
      selector: (row) => row.location ?? "N/A",
    },
    {
      name: "Action",
      cell: (row) => (
        <div>
          <button
            type="button"
            className="mr-2 text-white btn btn-sm bg-primary-2 hover:bg-primary-3"
            onClick={() => {
              handleEdit(row);
            }}
          >
            <HiOutlinePencil />
          </button>
          <button
            type="button"
            className="text-white bg-red-600 btn btn-sm hover:bg-red-700"
            onClick={() => {
              setDeleteId(row.scheduleId);
              modalDelete.current.open();
            }}
          >
            <HiOutlineTrash />
          </button>
        </div>
      ),
    },
  ];
  

  const handleEdit = (schedule) => {
    setModalType("Edit");
    setSelectedSchedule(schedule);
    modalShiftRef.current.open();
  };

  const handleDelete = (id) => {
    api
      .delete(`/api/v1/dev/schedule/${id}`)
      .then((res) => {
        console.log(res.data);
        deleteSuccess();
        fetchData();
      })
      .catch((err) => {
        console.log(err);
        deleteFailed();
      });
    modalDelete.current.close();
  };

  const customStyles = {
    headCells: {
      style: {
        fontWeight: "bold",
      },
    },
  };

  const fetchData = () => {
    api
      .get("/api/v1/dev/schedule")
      .then((res) => {
        setSchedule(res.data);
        setFilteredSchedule(res.data.reverse());
        console.log(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const fetchData1 = () => {
    // Function to format the date as YYYY-MM-DD
    function formatDate(date) {
      let year = date.getFullYear();
      let month = (date.getMonth() + 1).toString().padStart(2, "0");
      let day = date.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    }

    // Get today's date and format it
    let today = new Date();
    let formattedDate = formatDate(today);

    // Construct the URL with the formatted date
    let url = `/api/v1/dev/schedule/date?scheduleDate=${formattedDate}`;

    api
      .get(url)
      .then((res) => {
        setScheduleDay(res.data);
        console.log('hari ini punya', res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    // Fetch data from API
    fetchData();
    fetchData1();
  }, []);

  useEffect(() => {
    if (scheduleTime === "Shift") {
      setFilteredSchedule(schedule);
      return;
    }

    const results = schedule.filter((schedule) => {
      const startTime = schedule.shift.start_time;
      let shiftLabel = "";

      if (startTime === "08:00:00") {
        shiftLabel = "Pagi";
      } else if (startTime === "14:00:00") {
        shiftLabel = "Sore";
      } else if (startTime === "20:00:00") {
        shiftLabel = "Malam";
      }
      if (shiftLabel === scheduleTime) {
        return schedule;
      }
      return null;
    });
    setFilteredSchedule(results);
  }, [schedule, scheduleTime]);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredSchedule(schedule);
      return;
    }
    const results = schedule.filter((schedule) => {
      if (schedule.scheduleId.toString() === searchTerm) {
        return schedule;
      }
      return null;
    });
    setFilteredSchedule(results);
  }, [schedule, searchTerm]);

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
      schedule.filter((schedule) => {
        if (
          schedule.scheduleDate >= startDateFormatted &&
          schedule.scheduleDate <= endDateFormatted
        ) {
          return schedule;
        }
        return null;
      })
    );
  }, [startDate, endDate, schedule]);

  return (
    <>
      <ModalShift
        ref={modalShiftRef}
        onClose={fetchData}
        schedule={schedule}
        type={modalType}
        data={selectedSchedule}
      />
      <div className="flex items-end justify-between">
        <div className="w-fit">
          Tanggal:
          <div className="flex items-center justify-center gap-2">
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
            <div className="relative inline-block w-48 text-left">
              <button
                type="button"
                className="justify-between w-full h-12 bg-white border rounded-md shadow-sm dropdown-button btn text-primary-2 border-primary-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-2"
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
                  className="block px-4 py-2 text-sm text-gray-700 rounded-md cursor-pointer hover:bg-slate-200"
                  onClick={() => handleOptionClick("Pagi")}
                >
                  Pagi / Management
                </li>
                <li
                  className="block px-4 py-2 text-sm text-gray-700 rounded-md cursor-pointer hover:bg-slate-200"
                  onClick={() => handleOptionClick("Sore")}
                >
                  Sore
                </li>
                <li
                  className="block px-4 py-2 text-sm text-gray-700 rounded-md cursor-pointer hover:bg-slate-200"
                  onClick={() => handleOptionClick("Malam")}
                >
                  Malam
                </li>
              </ul>
              {/*dropdown*/}
            </div>
          </div>
        </div>
        <div className="flex gap-3
        ">
        <details className="relative dropdown dropdown-bottom dropdown-end">
          <summary className="py-3 font-semibold text-white rounded-md btn bg-primary-2">
            Buat sif
            <HiChevronDown className="inline-block ml-2" />
          </summary>
          <ul className="absolute z-10 w-full gap-2 p-2 bg-white border rounded-md shadow-xl dropdown-content menu">
            <li>
              <button
                onClick={() => {
                  modalShiftRef.current.open();
                  setModalType("Create");
                }}
              >
                Buat jadwal
              </button>
            </li>
            <li>
              <button onClick={() => navigate(`/shift/allschedule/`)}>
                View All Employee Schedule
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  modalShiftRef.current.open();
                  setModalType("location");
                }}
              >
                Buat Lokasi
              </button>
            </li>
          </ul>
        </details>
        {/* <button className="btn btn-primary" onClick={deleteSchedules}>Hapus Jadwal</button> */}
        </div>

      </div>
      <div>
        <label className="label">JADWAL HARI INI</label>
        <DataTable
          columns={columns2}
          data={scheduleDay}
          highlightOnHover
          customStyles={customStyles}
          onRowClicked={(row) => navigate(`/shift/${row.scheduleId}`)}
        />
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-56">
          <span className="loading loading-dots loading-lg"></span>
        </div>
      ) : (
        <div>
          <Popup
            ref={modalDelete}
            modal
            contentStyle={{
              borderRadius: "12px",
              padding: "2rem",
              width: "25rem",
              height: "10rem",
            }}
          >
            <div className="flex flex-col items-center justify-center gap-4">
              <h1>apakah anda yakin ingin menghapus schedule ini?</h1>
              <div className="flex gap-4">
                <button
                  className=" btn bg-primary-2 w-28"
                  onClick={() => {
                    handleDelete(deleteId);
                    fetchData();
                  }}
                >
                  Ya
                </button>
                <button
                  className="bg-red-500 btn w-28"
                  onClick={() => {
                    modalDelete.current.close();
                  }}
                >
                  Tidak
                </button>
              </div>
            </div>
          </Popup>
          <h1 className="text-xl font-medium">Schedule</h1>
          <div className="flex flex-col gap-3">
            {/* Search Bar */}
            <div className="relative flex items-center w-full">
              <HiSearch className="absolute left-4" />
              <input
                type="text"
                placeholder="Cari..."
                className="w-full pl-10 input input-bordered"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <p className="text-xs text-slate-500">
              {filteredSchedule.length} sif
            </p>
            <div className=" overflow-auto max-h-[60vh]">
              <DataTable
                columns={columns}
                data={filteredSchedule}
                highlightOnHover
                customStyles={customStyles}
                onRowClicked={(row) => navigate(`/shift/${row.scheduleId}`)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

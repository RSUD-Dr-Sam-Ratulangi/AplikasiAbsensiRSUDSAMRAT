import React from "react";
import {
  HiOutlineEye,
  HiChevronLeft,
  HiChevronRight,

} from "react-icons/hi";
import DataTable from "react-data-table-component";
import ModalBukti from "./ModalBukti";
import { useState, useEffect } from "react";
import {
  api,
} from "../../config/axios";
import ModalPrint from "./ModalPrint";

export default function PageAbsensi() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const [startDate, setStartDate] = useState(
    `${currentYear}-${currentMonth < 10 ? "0" + currentMonth : currentMonth}-01`
  );
  const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 10));
  const [absences, setAbsences] = useState([]);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const modalBuktiRef = React.useRef();
  const [imgCheckIn, setImgCheckIn] = useState(null);
  const [imgCheckOut, setImgCheckOut] = useState(null);
  const [clockCheckIn, setClockCheckIn] = useState(null);
  const [clockCheckOut, setClockCheckOut] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [isModalPrintOpen, setIsModalPrintOpen] = useState(false);

  const openModalPrint = () => {
    setIsModalPrintOpen(true);
  };

  const closeModalPrint = () => {
    setIsModalPrintOpen(false);
  };

  const columns = [
    {
      name: 'No',
      selector: (row, index) => index + 1
    },
    {
      name: "Nama",
      selector: (row) => row.name,
    },
    {
      name: "Waktu",
      selector: (row) => row.time,
    },
    {
      name: "Sif",
      selector: (row) => row.shift,
    },
    {
      name: "Kategori",
      selector: (row) => row.category,
    },
    {
      name: "Waktu Datang - Waktu Pulang",
      selector: (row) => {
        if (row.clockIn === null && row.clockOut === null) {
          return "BELUM ABSEN";
        } else if (row.clockIn === null && row.clockOut) {
          return `?? Absen Datang ??`;
        } else if (row.clockIn && row.clockOut === null) {
          return `${row.clockIn} - Belum Absen Pulang`;
        } else {
          return `${row.clockIn} - ${row.clockOut}`;
        }
      },
    },
    {
      name: "Bukti",
      cell: (row) => (
        <button
          type="button"
          onClick={() => {
            setImgCheckIn(row.selfieCheckIn);
            setImgCheckOut(row.selfieCheckOut);
            setClockCheckIn(row.clockIn);
            setClockCheckOut(row.clockOut);
            setSelectedData(row);
            modalBuktiRef.current.open();
            // setImage(row.selfieCheckIn);
          }}
          className="text-white btn btn-sm bg-primary-2 hover:bg-primary-3"
        >
          <HiOutlineEye />
        </button>
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

  const handleStartDate = (e) => setStartDate(e.target.value);
  const handleEndDate = (e) => setEndDate(e.target.value);
  const handleNextPage = () => setPage(page + 1);
  const handlePreviousPage = () => setPage(Math.max(1, page - 1));
  const handleChangePage = (e) => setPage(Number(e.target.value));

  const fetchAbsences = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(
        `http://rsudsamrat.site:9991/api/v1/dev/attendances/Date/date-range?startDate=${startDate}&endDate=${endDate}&page=${page}&size=20`
      );
      const data = response.data;

      if (Array.isArray(data)) {
        const extractedData = data.map((item) => {
          const clockInTime = item.clockIn ? new Date(item.clockIn).toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        }) : null;
        
        const clockOutTime = item.clockOut ? new Date(item.clockOut).toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        }) : null;
        

          const employeeName = item.employee ? item.employee.name : "Unknown";
          const shift = item.shift.name || "Unknown";
          const category = item.attendanceType || "Unknown";
          const scheduleDate = item.scheduleDate || "Unknown";
          const selfieCheckIn = item.selfieCheckIn || null;
          const selfieCheckOut = item.selfieCheckOut || null;

          return {
            name: employeeName,
            time: scheduleDate,
            clockIn: clockInTime,
            clockOut: clockOutTime,
            shift: shift,
            category: category,
            selfieCheckIn: selfieCheckIn,
            selfieCheckOut: selfieCheckOut, 
          };
        });

        setAbsences(extractedData);
        console.log("Extracted Data on page", page, extractedData);
      } else {
        setIsLoading(false);
        console.log("Data is not an array:", data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAbsences();
  }, [page]); // Fetch data when startDate, endDate, or page changes

  const handleFilter = () => {
    setPage(0);
    fetchAbsences();
  };

  return (
    <div>
      {isLoading ? (
        <div className="flex justify-center items-center h-56">
          <span className="loading loading-dots loading-lg"></span>
        </div>
      ) : (
        <>
          <div className="flex justify-end gap-5 mr-10">
            <div className="flex gap-3">
            <button className="btn bg-primary-2" onClick={openModalPrint}>
                Print
              </button>
            </div>
            <input
              className="input border border-gray-300"
              type="date"
              onChange={handleStartDate}
              value={startDate}
            />
            <input
              className="input border border-gray-300"
              type="date"
              onChange={handleEndDate}
              value={endDate}
            />
            <button className="btn btn-md bg-primary-2" onClick={handleFilter}>
              Filter
            </button>
          </div>
          <div className="overflow-auto max-h-[60vh]">
            <DataTable
              columns={columns}
              data={absences}
              customStyles={customStyles}
            />
          </div>
          <div className="flex justify-center gap-5 mt-5">
            <button
              onClick={handlePreviousPage}
              className="btn btn-sm btn-primary"
              disabled={page === 0}
            >
              <HiChevronLeft />
            </button>
            <input
              className="w-8"
              type="number"
              value={page}
              onChange={handleChangePage}
              inputMode="numeric"
            />
            <button className="btn btn-sm btn-primary" onClick={handleNextPage}>
              <HiChevronRight />
            </button>
          </div>
        </>
      )}
      <ModalBukti
        ref={modalBuktiRef}
        imageCheckIn={imgCheckIn}
        imageCheckOut={imgCheckOut}
        clockInTime={clockCheckIn}
        clockOutTime={clockCheckOut}
        selectedData={selectedData}
        onClose={() => modalBuktiRef.current.close()}
      />
      <ModalPrint isOpen={isModalPrintOpen} onClose={closeModalPrint} />
    </div>
  );
}

import { apiCheckToken, apiLogin } from "../../config/axios";
import Cookies from "js-cookie";
import React from "react";
import { api } from "../../config/axios";
import ModalBukti from "../PageDashboard/DashboardModalBukti";
import { HiOutlineEye } from "react-icons/hi";
import DataTable from "react-data-table-component";
import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function PageDashboard() {
  const [absences, setAbsences] = useState([]);
  const [filteredAbsences, setFilteredAbsences] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [imgCheckIn, setImgCheckIn] = useState(null);
  const [imgCheckOut, setImgCheckOut] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const modalBuktiRef = React.useRef();

  const getFormattedDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  const columns = [
    {
      name: "Nama",
      selector: (row) => row.employee.name,
    },
    {
      name: "Waktu",
      selector: (row) => row.scheduleDate,
    },
    {
      name: "Sif",
      selector: (row) => row.shift.name,
    },
    {
      name: "Kategori",
      selector: (row) => row.attendanceType,
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
    // {
    //   name: 'Presensi',
    //   cell: (row) => (
    //     <div
    //       className={`w-3 rounded-full h-3   ${
    //         row.presence === 'red'
    //           ? 'bg-red-600'
    //           : row.presence === 'green'
    //           ? 'bg-green-600'
    //           : row.presence === 'yellow'
    //           ? 'bg-yellow-600'
    //           : row.presence === 'blue'
    //           ? 'bg-blue-600'
    //           : 'bg-transparent'
    //       }`}
    //     />
    //   )
    // },
    {
      name: "Bukti",
      cell: (row) => (
        <button
          type="button"
          onClick={() => {
            console.log("row", row);
            setImgCheckIn(row.selfieCheckIn);
            setImgCheckOut(row.selfieCheckOut);
            setSelectedData(row);
            modalBuktiRef.current.open();
          }}
          className="btn btn-sm bg-primary-2 text-white hover:bg-primary-3"
        >
          <HiOutlineEye />
        </button>
      ),
    },
  ];

  const handleDateChange = (event) => {
    const dateValue = event.target.value;
    setSelectedDate(dateValue);
  };

  const [selectedDate, setSelectedDate] = useState(() => {
    const storedDate = localStorage.getItem('selectedDate');
    return storedDate ? storedDate : getFormattedDate(new Date());
  });

  useEffect(() => {
    localStorage.setItem('selectedDate', selectedDate);
  }, [selectedDate]);


  const customStyles = {
    rows: {
      style: {
        minHeight: "72px", // override the row height
      },
    },
    headCells: {
      style: {
        paddingLeft: "24px", // override the cell padding for head cells
        paddingRight: "8px",
        fontWeight: "bold",
      },
    },
    cells: {
      style: {
        paddingLeft: "24px", // override the cell padding for data cells
        paddingRight: "8px",
      },
    },
  };


  useEffect(() => {
    const fetchAbsences = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(
          `http://rsudsamrat.site:9999/api/v1/dev/attendances/date/${selectedDate}`
        );
        setIsLoading(false);
  
        const updatedData = response.data.map((row) => {
          return {
            ...row,
            clockIn: row.clockIn ? row.clockIn.split("T")[1].substring(0, 8) : null,
            clockOut: row.clockOut ? row.clockOut.split("T")[1].substring(0, 8) : null,
          };
        });
  
        setData(updatedData);
        console.log('tanggal yang dipilih: ',selectedDate)
      } catch (error) {
        console.log(error);
      }
    };
  
    fetchAbsences();
  }, [selectedDate]); 

  console.log(filteredAbsences);
  console.log(absences);

  return (
    <div className="flex flex-col mt-5">
      {isLoading ? (
        <div className="flex justify-center items-center h-56">
          <span className="loading loading-dots loading-lg"></span>
        </div>
      ) : (
        <div className="flex flex-col mt-5">
          <ModalBukti
            ref={modalBuktiRef}
            imageCheckIn={imgCheckIn}
            imageCheckOut={imgCheckOut}
            selectedData={selectedData}
            onClose={() => modalBuktiRef.current.close()}
          />
          <div className="flex-1 mt-8">
            <div className="flex justify-between relative w-full font-bold mb-3">
               <div>
               <p>Riwayat kehadiran pegawai hari ini</p>
              <span>{data.length} Pegawai</span>
                </div> 
                <div>
                  <input className="input border border-gray-300" type="date" onChange={handleDateChange} value={selectedDate} />
                 </div> 
            </div>
            <div>
              <DataTable
                columns={columns}
                data={data}
                customStyles={customStyles}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// export const NotificationCard = ({ name, message, date }) => {
//   return (
//     <div
//       className="flex flex-col bg-white rounded-xl p-3 shadow-lg"
//       style={{ width: "256px", height: "auto" }}
//     >
//       <div className="pb-2">
//         <p>{name}</p>
//         <p>{message}</p>
//       </div>
//       <div className="flex flex-row items-center gap-2 justify-end">
//         <p>{date}</p>
//         <div className="w-3 rounded-full h-3 bg-primary-2" />
//       </div>
//     </div>
//   );
// };

// export const EmployeeCard = ({ totalEmployee, totalTHL, registeredTHL }) => {
//   return (
//     <>
//       <div
//         className="flex flex-col bg-primary-2 rounded-xl p-4 shadow-lg justify-center items-center gap-2 text-white"
//         style={{ width: "164px", height: "auto" }}
//       >
//         <div className="pb-2">
//           <p>Jumlah Pegawai</p>
//         </div>
//         <div className="text-3xl">
//           <p>{totalEmployee}</p>
//         </div>
//       </div>
//       <div
//         className="flex flex-col bg-white rounded-xl p-4 shadow-lg justify-center items-center gap-2"
//         style={{ width: "164px", height: "auto" }}
//       >
//         <div className="pb-2">
//           <p>Total THL</p>
//         </div>
//         <div className="text-3xl">
//           <p>{totalTHL}</p>
//         </div>
//       </div>
//       <div
//         className="flex flex-col bg-white rounded-xl p-4 shadow-lg justify-center items-center gap-2"
//         style={{ width: "164px", height: "auto" }}
//       >
//         <div className="pb-2">
//           <p>THL Terdaftar</p>
//         </div>
//         <div className="text-3xl">
//           <p>{registeredTHL}</p>
//         </div>
//       </div>
//     </>
//   );
// };

// export const GraphicLine = ({ data }) => {
//   return (
//     <div style={{ textAlign: "center" }}>
//       <ResponsiveContainer width="100%" height={350}>
//         <LineChart
//           data={data}
//           margin={{
//             top: 20,
//             right: 30,
//             left: 20,
//             bottom: 20,
//           }}
//         >
//           <CartesianGrid strokeDasharray="5 5" />
//           <XAxis dataKey="name" tick={{ fontSize: 12 }} />
//           <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
//           <Tooltip
//             contentStyle={{ backgroundColor: "#f0f0f0", border: "none" }}
//           />
//           <Legend verticalAlign="top" height={36} />
//           <Line
//             yAxisId="left"
//             type="monotone"
//             dataKey="Pegawai"
//             stroke="#26A69A"
//             strokeWidth={2}
//             dot={{ r: 2, fill: "#26A69A" }}
//             activeDot={{ r: 4 }}
//           />
//           <Line
//             yAxisId="left"
//             type="monotone"
//             dataKey="Jumlah_total"
//             stroke="#2bd9c8"
//             strokeWidth={2}
//             dot={{ r: 2, fill: "#2bd9c8" }}
//             activeDot={{ r: 4 }}
//             strokeDasharray="5 5"
//           />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   );
//};

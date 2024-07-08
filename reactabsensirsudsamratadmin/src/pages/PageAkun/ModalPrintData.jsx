import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { HiOutlineX } from "react-icons/hi";
import { api } from "../../config/axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const ModalPrintData = forwardRef(({ data }, ref) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  const [isOpen, setIsOpen] = useState(false);
  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [check, setCheck] = useState(false);
  const id = data;
  const [dataPegawai, setDataPegawai] = useState([]);

  useImperativeHandle(ref, () => ({
    open() {
      setIsOpen(true);
    },
    close() {
      setIsOpen(false);
    },
  }));

  const handleMonthChange = (event) => {
    setMonth(event.target.value);
  };

  const fetchData = async () => {
    try {
      const formattedMonth = month < 10 ? `0${month}` : month;
      const response = await api.get(
        `http://rsudsamrat.site:9991/api/v1/dev/attendances/monthly?year=${year}&month=${formattedMonth}&employeeId=${id}`
      );
      setDataPegawai(response.data);

    } catch (err) {
      console.error(err);
    } finally {
      setCheck(true)
    }
  };


  const handlePrint = () => {
    const doc = new jsPDF();
    const selectedMonth = months.find((m) => m.value === month);
    const selectedMonthLabel = selectedMonth ? selectedMonth.label : "Unknown";
    const totalRecords = dataPegawai.length;

    doc.text("Data Pegawai", 14, 16);
    if (dataPegawai.length > 0) {
      doc.text(`Nama: ${dataPegawai[0].employee.name}`, 14, 23);
      doc.text(`Bulan: ${selectedMonthLabel}`, 14, 30);
      doc.text(`Jumlah Absensi: ${totalRecords}`, 14, 37);
    }

    doc.autoTable({
      startY: 45,
      head: [['No', 'Tipe Jadwal', 'Jam Masuk', 'Jam Pulang']],
      body: dataPegawai.map((item, index) => [
        index + 1,
        item.attendanceType,
        item.clockIn ? formatTimestamp(item.clockIn) : 'N/A',
        item.clockOut ? formatTimestamp(item.clockOut) : 'N/A'
      ]),
    });

    doc.save(`data-pegawai-${dataPegawai[0].employee.name}-Bulan${month}.pdf`);
  };



  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  const years = [];
  for (let i = currentYear; i >= 1900; i--) {
    years.push(i);
  }

  const formatTimestamp = (timestamp) => {
    return timestamp.replace("T", " ");
  };


  const selectedMonthLabel = months.find((m) => m.value === months)?.label;

  return (
    <Popup
      open={isOpen}
      onClose={() => setIsOpen(false)}
      modal
      contentStyle={{
        borderRadius: "12px",
        padding: "0",
        minHeight: "35rem",
        width: "80%",
        boxSizing: "border-box", // Includes padding and border in the element's total width and height
        "@media (max-width: 768px)": {
          minHeight: "30rem",
          width: "90%", // Adjust width for smaller screens
        },
        "@media (max-width: 480px)": {
          minHeight: "25rem",
          width: "85%", // Adjust width for very small screens
        },
      }}
    >
      <>
        <div className="flex items-center justify-between p-3">
          <label className="label font-bold">Data Pegawai</label>
          <button className="p-4" onClick={() => setIsOpen(false)}>
            <HiOutlineX />
          </button>
        </div>
        <div className="p-2">
          <div className="flex items-center justify-end gap-3">
            <select
              id="month-select"
              className="border rounded-xl"
              value={month}
              onChange={handleMonthChange}
            >
              {months.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
            <button className="btn btn-ghost" onClick={fetchData}>
              Check
            </button>
            {check ? (
            <button className="btn btn-ghost" onClick={handlePrint}>
            Print
          </button>
            ) : (
              null
            ) }
          </div>
        </div>
        <div>
          {dataPegawai && dataPegawai.length > 0 ? (
            <div>
              <div className="flex justify-between p-3">
                <h1 className="text-2xl font-bold mb-4 ml-3">{dataPegawai[0].employee.name}</h1>
                <h1 className="text-2xl font-bold mb-4 mr-3">Bulan : {month}</h1>
              </div>
              <table className="table-auto w-full">
                <thead>
                  <tr>
                    <th className="px-4 py-2">No</th>
                    <th className="px-4 py-2">Tipe Jadwal</th>
                    <th className="px-4 py-2">Jam Masuk</th>
                    <th className="px-4 py-2">Jam Pulang</th>
                  </tr>
                </thead>
                <tbody>
                  {dataPegawai.map((item, index) => (
                    <tr key={item.attendanceId}>
                      <td className="border px-4 py-2">{index + 1}</td>
                      <td className="border px-4 py-2">{item.attendanceType}</td>
                      <td className="border px-4 py-2">
                        {item.clockIn ? (
                          formatTimestamp(item.clockIn)
                        ) : (
                          <p className="text-red-500">N/A</p>
                        )}
                      </td>
                      <td className="border px-4 py-2">
                        {item.clockOut ? (
                          formatTimestamp(item.clockOut)
                        ) : (
                          <p className="text-red-500">N/A</p>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No data available</p>
          )}
        </div>

      </>
    </Popup>
  );
});

export default ModalPrintData;

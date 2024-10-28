import React, { useState } from "react";
import Popup from "reactjs-popup";
import { api } from "../../config/axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { HiOutlineRefresh, HiX } from "react-icons/hi";
import axios, { all } from "axios";

const ModalPrint = ({ isOpen, onClose }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("01");
  const [data, setData] = useState([]);
  const [progress, setProgress] = useState(0);
  const [isProgress, setIsProgress] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const closeModal = () => {
    if (isProgress) {
      const userConfirmed = window.confirm(
        "Proses sedang berjalan. Apakah Anda ingin keluar dan menyegarkan halaman?"
      );
      if (userConfirmed) {
        window.location.reload();
      }
    } else {
      onClose();
    }
  };

  const handleFetchData = async () => {
    const year = new Date().getFullYear();
    const month = selectedMonth;

    try {
      setLoading(true);
      setError(null);
      setIsProgress(true); // Start progress

      // Fetch all employees
      const employeesResponse = await axios.get(
        "http://rsudsamrat.site:9991/api/v1/dev/employees"
      );
      const employees = employeesResponse.data;
      const totalEmployees = employees.length;

      const fetchAttendancePromises = employees.map(async (employee) => {
        try {
          const attendanceResponse = await axios.get(
            `http://rsudsamrat.site:9991/api/v1/dev/attendances/monthly?year=${year}&month=${month}&employeeId=${employee.employeeId}`
          );

          return attendanceResponse.data.map((item) => ({
            name: employee.name,
            clockIn: item.clockIn,
            clockOut: item.clockOut,
            date:
              item.date || new Date(item.clockIn).toISOString().split("T")[0],
          }));
        } catch (error) {
          console.error(
            `Error fetching attendance for employee ${employee.name}:`,
            error
          );
          return [];
        }
      });

      const allData = await Promise.all(fetchAttendancePromises);
      const groupedData = {};

      let processedCount = 0;

      employees.forEach(employee => {
        if (!groupedData[employee.name]) {
          groupedData[employee.name] = [];
        }
      });

      allData.flat().forEach((entry) => {
        if (!groupedData[entry.name]) {
          groupedData[entry.name] = [];
        }
        groupedData[entry.name].push({
          clockIn: entry.clockIn,
          clockOut: entry.clockOut,
          date: entry.date,
        });
        processedCount++;

        setProgress(Math.round((processedCount / allData.flat().length) * 100));
      });

      console.log("Fetched Data:", groupedData);
      const dates = Array.from(
        { length: new Date(year, month, 0).getDate() },
        (_, i) => `${year}-${month}-${String(i + 1).padStart(2, "0")}`
      );

      handleGeneratePDF(groupedData, dates);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Error fetching data.");
    } finally {
      setIsProgress(false);
      setLoading(false);
      setProgress(0);
    }
  };

  const handleGeneratePDF = (data, dates) => {
    const doc = new jsPDF("l", "mm", "a4");
    const start = new Date(dates[0]);
    const end = new Date(dates[dates.length - 1]);
    const month = start.toLocaleString("default", { month: "long" });
    const startDateFormatted = dates[0].replace(/-/g, "");
    const endDateFormatted = dates[dates.length - 1].replace(/-/g, "");

    doc.text(
      `Data Absen Simfoni Bulan: ${month}`,
      10,
      10
    );

    const dateRangeHeader = ["No", "Name"];
    dates.forEach((date) => {
      const day = new Date(date).getDate();
      dateRangeHeader.push(day.toString());
    });

    const tableBody = [];
    const employeeAttendanceCount = {};

    // Count clock-ins and clock-outs
    Object.entries(data).forEach(([name, attendance]) => {
      const clockInCount = attendance.filter(att => att.clockIn).length;
      const clockOutCount = attendance.filter(att => att.clockOut).length;
      employeeAttendanceCount[name] = {
        attendance,
        clockInCount,
        clockOutCount
      };
    });

    // Sort employees by the total number of clock-ins and clock-outs
    const sortedEmployees = Object.entries(employeeAttendanceCount).sort((a, b) => {
      const totalA = a[1].clockInCount + a[1].clockOutCount;
      const totalB = b[1].clockInCount + b[1].clockOutCount;
      return totalB - totalA; // Sort in descending order
    });

    // Create table body based on sorted employee data
    sortedEmployees.forEach(([name, { attendance }], index) => {
      const row = [index + 1, name];
      dates.forEach((date) => {
        const record = attendance.find((att) => att.date === date);
        if (record) {
          const clockInTime = record.clockIn ? record.clockIn.slice(11, 16) : "N/A";
          const clockOutTime = record.clockOut ? record.clockOut.slice(11, 16) : "N/A";
          row.push(`${clockInTime} - ${clockOutTime}`);
        } else {
          row.push({ content: "-", styles: { textColor: [255, 0, 0] } }); // Red color for missing data
        }
      });
      tableBody.push(row);
    });

    doc.autoTable({
      head: [dateRangeHeader],
      body: tableBody,
      startY: 20,
      styles: {
        cellPadding: 1,
        fontSize: 5,
        halign: "center",
        valign: "middle",
      },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 30 },
        ...Array(dates.length).fill({ cellWidth: "auto" }),
      },
    });

    const fileName = `DaftarKehadiran_${month}_${startDateFormatted}-${endDateFormatted}.pdf`;
    doc.save(fileName);
};


  return (
    <Popup
      open={isOpen}
      onClose={onClose}
      closeOnDocumentClick={false}
      modal
      contentStyle={{
        borderRadius: "12px",
        padding: "0",
        minHeight: "full",
        width: "full",
      }}
    >
      <div className="p-2">
        <div className="flex justify-end">
          <button className="btn btn-ghost " onClick={closeModal}>
            <HiX className="text text-lg" />
          </button>
        </div>
        <div>
          <div className="flex items-center">
            <label className="label">Select Month:</label>
            <select
              className="select select-bordered select-sm"
              value={selectedMonth}
              onChange={handleMonthChange}
            >
              <option value="01">January</option>
              <option value="02">February</option>
              <option value="03">March</option>
              <option value="04">April</option>
              <option value="05">May</option>
              <option value="06">June</option>
              <option value="07">July</option>
              <option value="08">August</option>
              <option value="09">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </select>
          </div>
          {loading ? null : (
            <button
              className="btn btn-sm mt-3 btn-primary"
              onClick={handleFetchData}
              disabled={loading}
            >
              Fetch Data
            </button>
          )}

          {loading && (
            <p className="animate animate-pulse font-bold mt-4">
              Mengambil data ......
            </p>
          )}
          {error && <p>{error}</p>}
        </div>
      </div>
    </Popup>
  );
};

export default ModalPrint;

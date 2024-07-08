import React, { useState } from "react";
import Popup from "reactjs-popup";
import { api } from "../../config/axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { HiOutlineRefresh, HiX } from "react-icons/hi";

const ModalPrint = ({ isOpen, onClose }) => {
  const [progress, setProgress] = useState(0);
  const [isProgress, setIsProgress] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
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

  // const fetchAndSaveAllPaginatedData = async () => {
  //   // Validate dates
  //   if (!startDate || !endDate) {
  //     window.alert("Mohon Memilih Tanggal.");
  //     return;
  //   }

  //   const start = new Date(startDate);
  //   const end = new Date(endDate);

  //   if (start.getMonth() !== end.getMonth() || start.getFullYear() !== end.getFullYear()) {
  //     window.alert("Tanggal harus dalam bulan yang sama.");
  //     return;
  //   }

  //   if (new Date(endDate) < new Date(startDate)) {
  //     window.alert("Tanggal Akhir tidak bisa lebih cepat dari tanggal mulai.");
  //     return;
  //   }

  //   const diffDays = (end - start) / (1000 * 60 * 60 * 24);
  //   if (diffDays < 10) {
  //     window.alert("Rentang tanggal harus minimal 10 hari.");
  //     return;
  //   }

  //   setProgress(0);
  //   setIsProgress(true);

  //   const startDateFormatted = startDate.replace(/-/g, "");
  //   const endDateFormatted = endDate.replace(/-/g, "");
  //   const fileName = `DaftarKehadiran_${startDateFormatted}-${endDateFormatted}.pdf`;

  //   const dateRangeBatchSize = 5;
  //   const size = 10;
  //   let allData = [];
  //   let attendanceCounts = {};
  //   let validClockOutCounts = {};

  //   const dateRangeToBatches = (startDate, endDate, batchSize) => {
  //     const batches = [];
  //     let currentStartDate = new Date(startDate);

  //     while (currentStartDate <= new Date(endDate)) {
  //       const currentEndDate = new Date(currentStartDate);
  //       currentEndDate.setDate(currentEndDate.getDate() + batchSize - 1);

  //       if (currentEndDate > new Date(endDate)) {
  //         currentEndDate.setDate(new Date(endDate).getDate());
  //       }

  //       batches.push({
  //         startDate: currentStartDate.toISOString().split("T")[0],
  //         endDate: currentEndDate.toISOString().split("T")[0],
  //       });

  //       currentStartDate.setDate(currentStartDate.getDate() + batchSize);
  //     }

  //     return batches;
  //   };

  //   const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  //   const dateBatches = dateRangeToBatches(
  //     startDate,
  //     endDate,
  //     dateRangeBatchSize
  //   );
  //   const totalBatches = dateBatches.length;

  //   try {
  //     for (let i = 0; i < totalBatches; i++) {
  //       const batch = dateBatches[i];
  //       let page = 0;
  //       let hasMoreData = true;

  //       while (hasMoreData) {
  //         const response = await api.get(
  //           `http://rsudsamrat.site:9991/api/v1/dev/attendances/Date/date-range?startDate=${batch.startDate}&endDate=${batch.endDate}&page=${page}&size=${size}`
  //         );

  //         const data = response.data;

  //         if (data.length < size) {
  //           hasMoreData = false;
  //         }

  //         // Count attendance for each employee
  //         data.forEach(({ employee, clockOut }) => {
  //           if (!attendanceCounts[employee.name]) {
  //             attendanceCounts[employee.name] = 0;
  //             validClockOutCounts[employee.name] = 0; // Initialize valid clock-out count
  //           }
  //           attendanceCounts[employee.name]++;

  //           // Count valid clock-outs
  //           if (clockOut) {
  //             validClockOutCounts[employee.name]++;
  //           }
  //         });

  //         allData = allData.concat(data);
  //         page++;
  //       }

  //       // Update progress
  //       setProgress(Math.min(((i + 1) / totalBatches) * 100, 100));

  //       // Delay to avoid overwhelming the server
  //       await delay(1000); // 1 second delay
  //     }

  //     setProgress(100);
  //     setIsProgress(false);
  //     console.log("All paginated data:", allData);

  //     // Create a new PDF document
  //     const doc = new jsPDF();

  //     // Sort data by scheduleDate
  //     allData.sort(
  //       (a, b) => new Date(a.scheduleDate) - new Date(b.scheduleDate)
  //     );

  //     // Create a table for attendance counts
  //     const countTableData = Object.entries(attendanceCounts).map(
  //       ([name, count]) => [name, count, validClockOutCounts[name]]
  //     );

  //     // Add attendance counts table to the PDF
  //     doc.autoTable({
  //       head: [["Nama", "Jumlah Kehadiran", "Jumlah Kehadiran Tanpa Absen Pulang"]],
  //       body: countTableData,
  //       startY: 10,
  //       margin: { top: 10 },
  //     });

  //     // Group data by month and date
  //     const groupedData = {};
  //     allData.forEach((item) => {
  //       const scheduleDate = new Date(item.scheduleDate);
  //       const month = scheduleDate.getMonth() + 1;
  //       const date = scheduleDate.getDate();
  //       const year = scheduleDate.getFullYear();
  //       const key = `${year}-${month}-${date}`;
  //       if (!groupedData[key]) {
  //         groupedData[key] = [];
  //       }
  //       groupedData[key].push(item);
  //     });

  //     // Loop through grouped data and add to PDF
  //     Object.keys(groupedData).forEach((key, index) => {
  //       const data = groupedData[key];

  //       doc.addPage();
  //       doc.text(`Tanggal: ${key}`, 10, 20);

  //       const columns = ["Nama", "Jam Masuk", "Jam Pulang", "Shift Name"];

  //       const tableData = data.map(({ employee, clockIn, clockOut, shift }) => [
  //         employee.name ?? "",
  //         (clockIn ?? "").replace("T", " "),
  //         (clockOut ?? "").replace("T", " "),
  //         shift.name ?? "",
  //       ]);

  //       doc.autoTable({
  //         head: [columns],
  //         body: tableData,
  //         startY: 30,
  //         margin: { top: 30 },
  //       });
  //     });

  //     // Save or download the PDF
  //     doc.save(fileName);

  //     return allData;
  //   } catch (error) {
  //     setIsProgress(false);
  //     setProgress(0);
  //     console.error("Error fetching and saving paginated data:", error);
  //   }
  // };

  const fetchAndSaveAllPaginatedData = async () => {
    // Validate dates
    if (!startDate || !endDate) {
      window.alert("Mohon Memilih Tanggal.");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (
      start.getMonth() !== end.getMonth() ||
      start.getFullYear() !== end.getFullYear()
    ) {
      window.alert("Tanggal harus dalam bulan yang sama.");
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      window.alert("Tanggal Akhir tidak bisa lebih cepat dari tanggal mulai.");
      return;
    }

    setProgress(0);
    setIsProgress(true);

    const startDateFormatted = startDate.replace(/-/g, "");
    const endDateFormatted = endDate.replace(/-/g, "");

    const dateRangeBatchSize = 5;
    const size = 10;
    let allData = [];
    let attendanceDetails = {};

    const dateRangeToBatches = (startDate, endDate, batchSize) => {
      const batches = [];
      let currentStartDate = new Date(startDate);

      while (currentStartDate <= new Date(endDate)) {
        const currentEndDate = new Date(currentStartDate);
        currentEndDate.setDate(currentEndDate.getDate() + batchSize - 1);

        if (currentEndDate > new Date(endDate)) {
          currentEndDate.setDate(new Date(endDate).getDate());
        }

        batches.push({
          startDate: currentStartDate.toISOString().split("T")[0],
          endDate: currentEndDate.toISOString().split("T")[0],
        });

        currentStartDate.setDate(currentStartDate.getDate() + batchSize);
      }

      return batches;
    };

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const dateBatches = dateRangeToBatches(
      startDate,
      endDate,
      dateRangeBatchSize
    );
    const totalBatches = dateBatches.length;

    try {
      for (let i = 0; i < totalBatches; i++) {
        const batch = dateBatches[i];
        let page = 0;
        let hasMoreData = true;

        while (hasMoreData) {
          const response = await api.get(
            `http://rsudsamrat.site:9991/api/v1/dev/attendances/Date/date-range?startDate=${batch.startDate}&endDate=${batch.endDate}&page=${page}&size=${size}`
          );

          const data = response.data;

          if (!data || !Array.isArray(data)) {
            console.error("Invalid data format from API:", data);
            break;
          }

          if (data.length < size) {
            hasMoreData = false;
          }

          // Store attendance details for each employee
          data.forEach(({ employee, clockIn, clockOut, scheduleDate }) => {
            if (employee && employee.name && clockIn && scheduleDate) {
              const dateKey = new Date(scheduleDate).getDate();
              if (!attendanceDetails[employee.name]) {
                attendanceDetails[employee.name] = {};
              }
              if (!attendanceDetails[employee.name][dateKey]) {
                attendanceDetails[employee.name][dateKey] = {
                  clockIn: "",
                  clockOut: "",
                };
              }
              attendanceDetails[employee.name][dateKey].clockIn = clockIn
                .split("T")[1]
                .slice(0, 5);
              attendanceDetails[employee.name][dateKey].clockOut = clockOut
                ? clockOut.split("T")[1].slice(0, 5)
                : null;
            } else {
              console.warn("Incomplete data for:", {
                employee,
                clockIn,
                clockOut,
                scheduleDate,
              });
            }
          });

          allData = allData.concat(data);
          page++;
        }

        // Update progress
        setProgress(Math.min(((i + 1) / totalBatches) * 100, 100));

        // Delay to avoid overwhelming the server
        await delay(1000); // 1 second delay
      }

      setProgress(100);
      setIsProgress(false);
      console.log("All paginated data:", allData);

      // Create a new PDF document with landscape orientation
      const doc = new jsPDF("l", "mm", "a4");

      // Get date range as array
      const dateRange = [];
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        dateRange.push(new Date(d).getDate());
      }

      // Add month and dates header to the PDF
      const month = start.toLocaleString("default", { month: "long" });
      doc.text(
        `Bulan: ${month}, range tanggal : ${startDateFormatted} - ${endDateFormatted}`,
        10,
        10
      );

      // Construct the table header
      const dateRangeHeader = ["No"];
      dateRange.forEach((date) => {
        dateRangeHeader.push(date);
      });

      // Add employee names and attendance data
      const tableBody = [];
      const employeeNames = Object.keys(attendanceDetails).sort();

      employeeNames.forEach((name, index) => {
        const headerRow = [index + 1];
        headerRow.push({
          content: name,
          colSpan: dateRange.length,
          styles: { fontStyle: "bold", halign: "left" },
        });

        const dataRow = [""];
        dateRange.forEach((date) => {
          const details = attendanceDetails[name][date];
          let clockIn = details && details.clockIn ? details.clockIn : "null";
          let clockOut =
            details && details.clockOut ? details.clockOut : "null";

          if (clockIn === "null" && clockOut === "null") {
            dataRow.push({
              content: `${"-"}`,
              styles: { textColor: [255, 0, 0], fontSize: 8 },
            });
          } else if (clockIn !== "null" && clockOut === "null") {
            dataRow.push({
              content: `${clockIn}\n-\nnull`,
              styles: { fontSize: 6, fontStyle: "bold" },
              cellStyles: { 2: { textColor: [255, 0, 0] } },
            });
          } else {
            dataRow.push({
              content: `${clockIn}\n-\n${clockOut}`,
              styles: { fontSize: 6, fontStyle: "bold" },
            });
          }
        });

        tableBody.push(headerRow);
        tableBody.push(dataRow);
      });

      const columnStyles = {
        0: { cellWidth: 10 },

        ...Array(dateRange.length).fill({ cellWidth: "auto" }),
      };

      doc.autoTable({
        head: [dateRangeHeader],
        body: tableBody,
        startY: 20,
        margin: { top: 20 },
        styles: {
          cellPadding: 1,
          fontSize: 8,
          halign: "center",
          valign: "middle",
        },
        columnStyles: columnStyles,
      });

      const fileName = `DaftarKehadiran_${month}_${startDateFormatted}-${endDateFormatted}.pdf`;

      // Save or download the PDF
      doc.save(fileName);

      return allData;
    } catch (error) {
      setIsProgress(false);
      setProgress(0);
      console.error("Error fetching and saving paginated data:", error);
    }
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
      <>
        <div className="flex justify-between items-center p-3">
          <p className="font-bold text-xl">Ambil Data Pegawai :</p>
          <button className="btn " onClick={closeModal}>
            <HiX className="text text-lg" />
          </button>
        </div>
        <div className="grid justify-center items-center p-5">
          <div className="flex justify-center items-center gap-5">
            <label className="label">Masukkan Tanggal :</label>
            <input
              className="input border border-stone-500"
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
            />

            <input
              className="input border border-stone-500"
              type="date"
              value={endDate}
              onChange={handleEndDateChange}
            />

            <button className="btn" onClick={fetchAndSaveAllPaginatedData}>
              Cek
            </button>
          </div>
          <div className="flex justify-center items-center gap-3 mt-3">
            {isProgress ? (
              <progress
                className="progress progress-primary w-56 h-6"
                value={progress}
                max="100"
              ></progress>
            ) : null}

            {isProgress ? (
              <>
                <p>
                  <HiOutlineRefresh className="animate-spin text-xl" />
                </p>
                <p>{startDate}</p>
                <p>-</p>
                <p>{endDate}</p>
              </>
            ) : null}
          </div>
        </div>
      </>
    </Popup>
  );
};

export default ModalPrint;

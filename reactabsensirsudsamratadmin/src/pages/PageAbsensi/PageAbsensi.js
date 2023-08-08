import React, { useState } from "react";
import { HiSearch, HiOutlineEye } from "react-icons/hi";
import DataTable from "react-data-table-component";

const columns = [
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
    name: "Presensi",
    cell: (row) => (
      <div
        className={`w-3 rounded-full h-3   ${
          row.presence === "red"
            ? "bg-red-600"
            : row.presence === "green"
            ? "bg-green-600"
            : row.presence === "yellow"
            ? "bg-yellow-600"
            : row.presence === "blue"
            ? "bg-blue-600"
            : "bg-transparent"
        }`}
      />
    ),
  },
  {
    name: "Bukti",
    cell: (row) => (
      <button
        type="button"
        className="btn btn-sm bg-primary-2 text-white hover:bg-primary-3"
      >
        <HiOutlineEye />
      </button>
    ),
  },
];

const data = [
  {
    id: 1,
    name: "John Doe",
    time: "Selasa 1 Agustus 2023, 16:39",
    shift: "pagi",
    category: "WoF",
    presence: "red",
  },
  {
    id: 2,
    name: "David Beckham",
    time: "Selasa 1 Agustus 2023, 16:39",
    shift: "pagi",
    category: "FWO",
    presence: "green",
  },
  {
    id: 3,
    name: "Valentino Rossi",
    time: "Selasa 1 Agustus 2023, 16:39",
    shift: "sore",
    category: "WFO",
    presence: "yellow",
  },
  {
    id: 4,
    name: "Augustus Claudius",
    time: "Kamis 3 Agustus 2023, 16:39",
    shift: "malam",
    category: "WFO",
    presence: "blue",
  },
];

const customStyles = {
  // rows: {
  //   style: {
  //     minHeight: '72px' // override the row height
  //   }
  // },
  headCells: {
    style: {
      fontWeight: "bold",
    },
  },
  // cells: {
  //   style: {
  //     paddingLeft: '8px', // override the cell padding for data cells
  //     paddingRight: '8px'
  //   }
  // }
};

export default function PageAbsensi() {
  const [searchTerm, setSearchTerm] = useState("");
  const filteredData = data.filter(
    (data) =>
      data.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      data.time.toLowerCase().includes(searchTerm.toLowerCase()) ||
      data.shift.toLowerCase().includes(searchTerm.toLowerCase()) ||
      data.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-xl font-medium">Absensi</h1>
      <div className="flex flex-col gap-3">
        <div className="flex justify-end items-center gap-3">
          <div className="w-fit">
            Tanggal:
            <div className="flex justify-center items-center gap-2">
              {/* Aug 21, 2021 */}
              <input
                type="date"
                defaultValue={new Date().toISOString().slice(0, 10)}
              />
            </div>
          </div>
          <button
            type="button"
            className="bg-primary-2 py-3 px-10 rounded-md font-semibold text-white"
          >
            Print PDF
          </button>
        </div>
        {/* Search Bar */}
        <div className="flex items-center relative w-full">
          <HiSearch className="absolute left-4" />
          <input
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <p className="text-xs text-slate-500">12 Absen</p>
        <div>
          <DataTable
            columns={columns}
            data={filteredData}
            customStyles={customStyles}
          />
        </div>
      </div>
    </div>
  );
}

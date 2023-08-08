import React, { useEffect, useState, useRef } from "react";
import {
  HiOutlinePlusSm,
  HiSearch,
  HiOutlinePencil,
  HiOutlineTrash,
} from "react-icons/hi";
import ModalAkun from "./ModalAkun";
import DataTable from "react-data-table-component";
import api from "../../config/axios";

export default function PageAkun() {
  const [modalAkunType, setModalAkunType] = useState(""); // ['create', 'edit']
  const [akunData, setAkunData] = useState([]);
  const [selectedAkun, setSelectedAkun] = useState(null);
  const [reloadApi, setReloadApi] = useState(false);
  const modalAkun = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAkunData = akunData.filter(
    (akun) =>
      akun.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      // akun.nik.toLowerCase().includes(searchTerm.toLowerCase()) ||
      akun.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      akun.employeeId.toString().includes(searchTerm)
  );

  const columns = [
    {
      name: "ID",
      selector: (row) => row.employeeId,
      width: "50px",
    },
    {
      name: "Name",
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
            onClick={() => handleEdit(row.employeeId)}
          >
            <HiOutlinePencil />
          </button>
          <button
            type="button"
            className="text-white bg-red-600 btn btn-sm hover:bg-red-700"
            onClick={() => handleDelete(row.id)}
          >
            <HiOutlineTrash />
          </button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    // Fetch data from API
    api
      .get("/api/v1/dev/employees")
      .then((res) => {
        console.log(res.data);
        setAkunData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [reloadApi]);

  const handleEdit = (id) => {
    setModalAkunType("edit");
    // Find the selected akun
    const selectedAkun = akunData.find((akun) => akun.employeeId === id);
    setSelectedAkun(selectedAkun);
    modalAkun.current.open();
  };

  const handleDelete = (id) => {
    console.log(`Delete button clicked for row with id: ${id}`);
  };

  return (
    <>
      <ModalAkun
        ref={modalAkun}
        type={modalAkunType}
        data={filteredAkunData}
        onClose={() => {
          modalAkun.current.close();
          setReloadApi(!reloadApi);
          setSelectedAkun(null);
          console.log("Modal closed");
        }}
      />
      <div>
        <h1 className="text-xl font-medium">Akun</h1>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setModalAkunType("create");
                modalAkun.current.open();
              }}
              className="flex items-center justify-center gap-2 px-8 py-3 font-semibold text-white rounded-md bg-primary-2"
            >
              <HiOutlinePlusSm />
              Buat Akun
            </button>
          </div>
          {/* Search Bar */}
          <div className="relative flex items-center w-full">
            <HiSearch className="absolute left-4" />
            <input
              type="text"
              placeholder="Type here"
              className="w-full pl-10 input input-bordered"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <DataTable
              columns={columns}
              data={filteredAkunData}
              customStyles={{
                headCells: {
                  style: {
                    fontWeight: "bold",
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}

import React, { useEffect, useState, useRef } from "react";
import {
  HiOutlinePlusSm,
  HiSearch,
  HiOutlineArrowCircleDown,
  HiOutlineTrash,
  HiOutlinePaperClip,
  HiXCircle,
  HiDotsCircleHorizontal,
  HiOutlineMinus,
} from "react-icons/hi";
import ModalAkun from "./ModalAkun";
import ModalPrintData from "./ModalPrintData";
import DataTable from "react-data-table-component";
import { api } from "../../config/axios";
import "react-toastify/dist/ReactToastify.css";
import Popup from "reactjs-popup";
import { toast } from "react-toastify";

export default function PageAkun() {
  const [modalAkunType, setModalAkunType] = useState(""); // ['create', 'edit']
  const [akunData, setAkunData] = useState([]);
  const [dataPegawai, setDataPegawai] = useState([]);
  const [selectedAkun, setSelectedAkun] = useState([]);
  const [reloadApi, setReloadApi] = useState(false);
  const modalAkun = useRef(null);
  const modalDelete = useRef(null);
  const ModalPrintDataRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [duplicates, setDuplicates] = useState([]);

  const deleteSuccess = () =>
    toast("Akun berhasil di hapus", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      theme: "light",
      progressStyle: { background: "green" },
    });

  const deleteFailed = () =>
    toast("ERROR, MOHON DICOBA KEMBALI.", {
      position: "top-right",
      autoClose: 6000,
      hideProgressBar: false,
      closeOnClick: true,
      theme: "light",
      progressStyle: { background: "red" },
    });

  const filteredAkunData = akunData.filter((akun) =>
    akun.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      name: "ID",
      selector: (row) => row.employeeId,
      width: "75px",
    },
    {
      name: "Name",
      selector: (row) => row.name,
    },
    {
      name: "Bidang/Jabatan",
      selector: (row) => row.role,
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex justify-center items-center gap-3">
          {/* <button
            type="button"
            className="mr-2 text-white btn btn-sm bg-primary-2 hover:bg-primary-3"
            onClick={() => {
              handleEdit(row);
            }}
          >
            <HiOutlinePencil />
          </button> */}
          <button
            type="button"
            className=" text-white bg-primary-2 btn btn-sm hover:bg-gray-300"
            onClick={() => handleCheckData(row.employeeId)}
          >
            <HiOutlinePaperClip />
          </button>
          <button
            type="button"
            className=" text-white bg-red-600 btn btn-sm hover:bg-red-700"
            onClick={() => {
              setDeleteId(row.employeeId);
              modalDelete.current.open();
            }}
          >
            <HiOutlineTrash />
          </button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    // Fetch data from API
    fetchData();
  }, [reloadApi]);

  const fetchData = async () => {
    api
      .get("/api/v1/dev/employees")
      .then((res) => {
        const dataEmp = res.data;
        const data = dataEmp.sort((a, b) => {
            if (a.name < b.name) {
                return -1;
            }
            if (a.name > b.name) {
                return 1;
            }
            return 0;
        });
        setAkunData(data);
        console.log('employee', data);
        const employees = res.data;

              // Check for duplicate names
      const nameCount = {};
      const duplicatesArray = [];

      employees.forEach((employee) => {
        const name = employee.name;
        nameCount[name] = (nameCount[name] || 0) + 1;
      });

      // Find duplicates
      for (const [name, count] of Object.entries(nameCount)) {
        if (count > 1) {
          duplicatesArray.push(name);
        }
      }

      setDuplicates(duplicatesArray);

      console.log('Duplicate Name',duplicatesArray)
        
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleEdit = (id) => {
    setModalAkunType("edit");
    setSelectedAkun(id);
    console.log(id);
    modalAkun.current.open();
  };

  const handleDelete = (id, retryCount = 0) => {
    const maxRetries = 3;
    
    setIsLoading(true);
    api
      .delete(`/api/v1/dev/employees/${id}`)
      .then((res) => {
        console.log(res.data);
        deleteSuccess();
        setIsLoading(false);
        window.location.reload();
      })
      .catch(() => {
        if (retryCount < maxRetries) {
          handleDelete(id, retryCount + 1);
        } else {
          setIsLoading(false);
          console.error("Failed to delete after multiple attempts.");
          deleteFailed();
        }
      });
    
    modalDelete.current.close();
  };
  

  const handleCheckData = async (id) => {
    setDataPegawai(id);
    ModalPrintDataRef.current.open();
  };

  return (
    <>
      <ModalAkun
        ref={modalAkun}
        type={modalAkunType}
        data={selectedAkun}
        onClose={() => {
          modalAkun.current.close();
          setReloadApi(!reloadApi);
          setSelectedAkun(null);
          fetchData();
          console.log("Modal closed");
        }}
      />
      <ModalPrintData ref={ModalPrintDataRef} data={dataPegawai} />
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
        <div className="flex flex-col justify-center items-center gap-4">
          <h1>apakah anda yakin ingin menghapus akun ini?</h1>
          <div className="flex gap-4">
            <button
              className=" btn bg-primary-2 w-28"
              onClick={() => {
                handleDelete(deleteId);
              }}
            >
              Ya
            </button>
            <button
              className="btn bg-red-500 w-28"
              onClick={() => {
                modalDelete.current.close();
                // setDeleteId(null);
              }}
            >
              Tidak
            </button>
          </div>
        </div>
      </Popup>
      <div className="">
        <h1 className="text-xl font-medium">Akun</h1>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            {isLoading ? (
              <>
                <div className="flex justify-center gap-3">
                  <h1 className="text-3xl animate-spin">
                    <HiOutlineMinus />
                  </h1>
                  <p className="animate-pulse text-2xl">
                    SEDANG MENGHAPUS DATA
                  </p>
                </div>
              </>
            ) : null}
            <button
              disabled={isLoading}
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
          <p className="text-xs text-slate-500">
            {filteredAkunData.length} users
          </p>
          <div className="overflow-auto max-h-[60vh]">
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

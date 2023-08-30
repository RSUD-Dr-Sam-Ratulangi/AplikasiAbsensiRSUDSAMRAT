import React, { useState, useEffect } from 'react';
import { HiSearch, HiOutlineTrash, HiOutlinePlus } from 'react-icons/hi';
import DataTable from 'react-data-table-component';
import { api } from '../../config/axios';
import { useParams } from 'react-router-dom';

export default function PageEmployeeSchedule() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchResults2, setSearchResults2] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [haveSchedule, setHaveSchedule] = useState([]);
  const [scheduleData, setScheduleData] = useState([]);
  const { scheduleId } = useParams();

  const columns1 = [
    {
      name: 'ID',
      selector: (row) => row.employeeId,
      width: '50px'
    },
    {
      name: 'Name',
      selector: (row) => row.name
    },
    {
      name: 'NIK',
      selector: (row) => row.nik
    },
    {
      name: 'Bidang/Jabatan',
      selector: (row) => row.role
    },
    {
      name: 'Action',
      cell: (row) => (
        <button
          type='button'
          className='mr-2 text-white btn btn-sm bg-primary-2 hover:bg-primary-3'
          onClick={() => handleAdd(row.employeeId)}>
          <HiOutlinePlus />
        </button>
      )
    }
  ];

  const columns2 = [
    {
      name: 'ID',
      selector: (row) => row.employeeId,
      width: '50px'
    },
    {
      name: 'Name',
      selector: (row) => row.name
    },
    {
      name: 'NIK',
      selector: (row) => row.nik
    },
    {
      name: 'Bidang/Jabatan',
      selector: (row) => row.role
    },
    {
      name: 'Action',
      cell: (row) => (
        <button
          type='button'
          className='text-white bg-red-600 btn btn-sm hover:bg-red-700'
          onClick={() => handleDelete(row.employeeId)}>
          <HiOutlineTrash />
        </button>
      )
    }
  ];

  const handleAdd = (id) => {
    api
      .post(`/api/v1/dev/employees/${id}/schedule`, {
        employeeId: id,
        scheduleId: scheduleId
      })
      .then((res) => {
        console.log(res.data);

        // add this row to haveSchedule state
        setHaveSchedule([
          ...haveSchedule,
          searchResults.find((item) => item.employeeId === id)
        ]);
        // remove this row from schedule state
        setSchedule(searchResults.filter((item) => item.employeeId !== id));
      })
      .catch((err) => {
        console.log(err);
      });

    console.log('haveSchedule: ', haveSchedule);
  };

  const handleDelete = (id) => {
    api
      .delete(`/api/v1/dev/schedule/${scheduleId}/removeEmployee/${id}`)
      .then((res) => {
        console.log(res.data);

        // add this row to schedule state
        setSchedule([
          ...schedule,
          searchResults2.find((item) => item.employeeId === id)
        ]);
        // remove this row from haveSchedule state
        setHaveSchedule(
          searchResults2.filter((item) => item.employeeId !== id)
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const customStyles = {
    headCells: {
      style: {
        fontWeight: 'bold'
      }
    }
  };

  useEffect(() => {
    api
      .get('/api/v1/dev/employees')
      .then((res) => {
        setSchedule(res.data);
        setSearchResults(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    api
      .get('/api/v1/dev/schedule/' + scheduleId)
      .then((res) => {
        setScheduleData(res.data);
        setHaveSchedule(res.data?.employees);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [scheduleId]);

  useEffect(() => {
    if (!scheduleData.employees) return;
    const filteredSchedule = schedule.filter(
      (item) =>
        !scheduleData.employees.some(
          (item2) => item.employeeId === item2.employeeId
        )
    );
    setSchedule(filteredSchedule);
    console.log('filteredSchedule: ', filteredSchedule);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [haveSchedule]);

  const handleSearch = (value) => {
    setSearchTerm(value);
    const results = schedule.filter((person) =>
      person.name.toLowerCase().includes(searchTerm)
    );
    setSearchResults(results);
  };

  useEffect(() => {
    if (searchTerm === '') {
      setSearchResults(schedule);
      setSearchResults2(haveSchedule);
      return;
    }

    const results = schedule.filter((person) =>
      person.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(results);

    const results2 = haveSchedule.filter((person) =>
      person.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults2(results2);
  }, [haveSchedule, schedule, searchTerm]);

  return (
    <div>
      <h1 className='text-xl font-medium'>Jadwal Pegawai</h1>
      <div className='flex flex-col gap-3'>
        <div className='flex justify-between items-center gap-2'>
          <div className='w-full flex justify-center items-center'>
            <div className='flex flex-col justify-start items-start w-full'>
              <h2 className='font-bold'>Date</h2>
              <span>{scheduleData.scheduleDate}</span>
            </div>
            <div className='flex flex-col justify-start items-start w-full'>
              <h2 className='font-bold'>Sif</h2>
              <span>{scheduleData.shift.name}</span>
            </div>
            <div className='flex flex-col justify-start items-start w-full'>
              <h2 className='font-bold'>Waktu</h2>
              <span>
                {scheduleData.shift.start_time} - {scheduleData.shift.end_time}
              </span>
            </div>
            <div className='flex flex-col justify-start items-start w-full'>
              <h2 className='font-bold'>Location</h2>
              <span>{scheduleData.location ?? 'Tidak Diketahui'}</span>
            </div>
          </div>
          {/* Search Bar */}
          <div className='flex items-center relative w-full'>
            <HiSearch className='absolute left-4' />
            <input
              type='text'
              placeholder='Cari...'
              className='w-full pl-10 input input-bordered'
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>
        <div className='mt-3'>
          <h1 className='font-bold'>Tanpa Jadwal </h1>
          <p className='text-xs text-slate-500'>{schedule.length} Pegawai</p>
          <div className=' overflow-auto max-h-[29vh]'>
            <DataTable
              columns={columns1}
              data={searchResults}
              customStyles={customStyles}
            />
          </div>
        </div>
        <div className='mt-3'>
          <h1 className='font-bold'>Dengan Jadwal </h1>
          <p className='text-xs text-slate-500'>{schedule.length} Pegawai</p>
          <div className=' overflow-auto max-h-[29vh]'>
            <DataTable
              columns={columns2}
              data={searchResults2}
              customStyles={customStyles}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { HiSearch, HiOutlineEye } from 'react-icons/hi';
import DataTable from 'react-data-table-component';
import ModalBukti from './ModalBukti';
import { useState, useEffect } from 'react';
import { api, apiCheckToken } from '../../config/axios';
import { useDispatch } from 'react-redux';
import { expiredToken } from '../../config/authState/authSlice';

export default function PageAbsensi() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [absences, setAbsences] = useState([]);
  const [filteredAbsences, setFilteredAbsences] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress]  = useState(0);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const modalBuktiRef = React.useRef();
  // const dispatch = useDispatch();

  console.log('absences', absences);
  console.log('filteredAbsences', filteredAbsences);

  const handleSearch = (e) => {
    const { value } = e.target;
    const newData = absences.filter((item) => {
      const itemData = `${item.name.toUpperCase()} ${item.category.toUpperCase()}`;
      const textData = value.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    setFilteredAbsences(newData);
  };

  const columns = [
    {
      name: 'Nama',
      selector: (row) => row.name
    },
    {
      name: 'Waktu',
      selector: (row) => row.time
    },
    {
      name: 'Sif',
      selector: (row) => row.shift
    },
    {
      name: 'Kategori',
      selector: (row) => row.category
    },
    {
      name: 'Presensi',
      cell: (row) => (
        <div
          className={`w-3 rounded-full h-3   ${
            row.presence === 'red'
              ? 'bg-red-600'
              : row.presence === 'green'
              ? 'bg-green-600'
              : row.presence === 'yellow'
              ? 'bg-yellow-600'
              : row.presence === 'blue'
              ? 'bg-blue-600'
              : 'bg-transparent'
          }`}
        />
      )
    },
    {
      name: 'Bukti',
      cell: (row) => (
        <button
          type='button'
          onClick={() => {
            modalBuktiRef.current.open();
          }}
          className='text-white btn btn-sm bg-primary-2 hover:bg-primary-3'>
          <HiOutlineEye />
        </button>
      )
    }
  ];

  const customStyles = {
    headCells: {
      style: {
        fontWeight: 'bold'
      }
    }
  };

  useEffect(() => {
    const fetchAbsences = async () => {
      // try {
      //   const response = await apiCheckToken.get('/ping');
      //   console.log(response.data);
      //   if (response.data) {
      try {
        const response = await api.get(
          '/api/v1/dev/attendances/all-with-schedule'
        );
        const data = response.data;

        const ExtractData = data.map((attendance) => {
          const shiftStartTime = attendance.shift.start_time;
          const shiftEndTime = attendance.shift.end_time;

          const clockIn = attendance.attendances[0]?.clockIn
            ? new Date(attendance.attendances[0].clockIn)
            : null;
          const clockOut = attendance.attendances[0]?.clockOut
            ? new Date(attendance.attendances[0].clockOut)
            : null;

          const formatWaktu = (waktu) => {
            const options = {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false
            };
            return waktu.toLocaleTimeString('en-US', options);
          };
          const clockInTime = clockIn ? formatWaktu(clockIn) : null;
          const clockOutTime = clockOut ? formatWaktu(clockOut) : null;

          let statusPenilaian = 'red'; // Default: Tidak ada data clock in atau clock out

          if (clockInTime && clockOutTime) {
            if (clockInTime <= shiftStartTime && clockOutTime >= shiftEndTime) {
              statusPenilaian = 'green'; // Clock in sebelum start_time dan clock out setelah end_time
            } else if (clockInTime > shiftStartTime) {
              statusPenilaian = 'yellow'; // Clock in setelah start_time
            }
          } else if (clockInTime) {
            if (clockInTime > shiftStartTime) {
              statusPenilaian = 'yellow'; // Clock in setelah start_time
            }
          }

          const employeeNamesString = attendance.attendances
            .map((attendance) => attendance.employee.name)
            .join(', ')
            .replace(
              /\w\S*/g,
              (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
            );

          return {
            clockInTime: clockInTime,
            clockOutTime: clockOutTime,
            shiftStartTime: shiftStartTime,
            shiftEndTime: shiftEndTime,
            presence: statusPenilaian,
            id: attendance.scheduleId,
            category: attendance.attendances.map(
              (attendance) => attendance.attendanceType
            ),
            name: employeeNamesString,
            time: attendance.scheduleDate,
            shift: attendance.shift.name
          };
        });
        console.log(ExtractData);
        console.log("dataReal", response.data);
        setIsLoading(false);
        console.log('----------------------', ExtractData);

        setAbsences(ExtractData);
        setFilteredAbsences(ExtractData);
      } catch (error) {
        setIsLoading(false)
        console.log(error);
      }
      // try {
      //   const response = await apiCheckToken.get('/ping');
      //   console.log(response.data);
      //   if (response.data) {
      //   }
      // } catch (error) {
      //   console.log(error);
      //   dispatch(expiredToken());
      // }
    };
    //   } catch (error) {
    //     console.log(error);
    //     // dispatch(expiredToken());
    //   }
    // };

    fetchAbsences();
  }, []);

  useEffect(() => {
    if (startDate === null || endDate === null) {
      return;
    }

    const startDateFormatted = startDate.split('-').join('-');
    const endDateFormatted = endDate.split('-').join('-');

    if (startDate > endDate) {
      alert('Tanggal awal tidak boleh lebih besar dari tanggal akhir');
      return;
    }

    console.log(startDateFormatted, endDateFormatted);

    if (startDateFormatted > endDateFormatted) {
      alert('Tanggal awal tidak boleh lebih besar dari tanggal akhir');
      return;
    }

    setFilteredAbsences(
      absences.filter((schedule) => {
        if (
          schedule.time >= startDateFormatted &&
          schedule.time <= endDateFormatted
        ) {
          return schedule;
        }
        return null;
      })
    );
  }, [startDate, endDate, absences]);

  return (
    <div>
    {isLoading ? (
      <div className='flex justify-center items-center h-56'>
              <span className="loading loading-dots loading-lg"></span>
        </div>
    ) : (
      <div>
      <h1 className="text-xl font-medium">Absensi</h1>
      <div className="flex flex-col gap-3">
        <div className="flex justify-end items-end gap-3">
          <div className="flex justify-center items-center gap-3">
            <div className="w-fit">
              Tanggal:
              <div className='flex items-center justify-center gap-2'>
                {/* Aug 21, 2021 */}
                <input
                  type='date'
                  className='input input-bordered'
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
            </div>
            <span>Sampai</span>
            <div className='w-fit'>
              Tanggal:
              <div className='flex items-center justify-center gap-2'>
                {/* Aug 21, 2021 */}
                <input
                  type='date'
                  className='input input-bordered'
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          </div>
          <button
            type='button'
            className='px-10 py-3 font-semibold text-white rounded-md bg-primary-2'>
            Print PDF
          </button>
        </div>
        {/* Search Bar */}
        <div className='relative flex items-center w-full'>
          <HiSearch className='absolute left-4' />
          <input
            type='text'
            placeholder='Cari...'
            className='w-full pl-10 input input-bordered'
            onChange={handleSearch}
          />
        </div>
        <p className='text-xs text-slate-500'>{absences.length} Absen</p>
        <div>
          <DataTable
            columns={columns}
            data={filteredAbsences}
            customStyles={customStyles}
          />
        </div>
      </div>
    </div>
    )}
      <ModalBukti
        ref={modalBuktiRef}
        // image={image}
        onClose={() => modalBuktiRef.current.close()}
      />
    </div>
  );
}

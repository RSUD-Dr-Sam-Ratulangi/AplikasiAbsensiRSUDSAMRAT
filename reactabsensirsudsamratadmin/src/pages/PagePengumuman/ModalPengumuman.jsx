import React, { useState, forwardRef } from 'react';
import Popup from 'reactjs-popup';
import modalBg from '../../assets/modal-bg.png';
import { HiOutlineX } from 'react-icons/hi';
import io from 'socket.io-client';
import axios from 'axios';
import { apiCheckToken } from '../../config/axios';

const socket = io.connect('http://rsudsamrat.site:3001');

const ModalPengumuman = forwardRef((props, ref) => {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [date, setDate] = useState(new Date());

  const postToDb = async (data) => {
    await apiCheckToken
      .post('/notification', data)
      .then((res) => {
        props.setRefresh((prev) => !prev);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const postNewPengumuman = () => {
    const data = {
      title: title,
      desc: desc,
      date: date,
      time: new Date().toLocaleTimeString('en-US', {
        hour12: false,
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      }),
    };

    postToDb(data);
    socket.emit('message', data);
    handleClose();
  };

  const handleDateChange = (date) => {
    setDate(date);
    console.log('date', date);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'judul':
        setTitle(value);
        break;
      case 'description':
        setDesc(value);
        break;
      default:
        break;
    }
  };

  const handleClose = () => {
    ref.current.close();
    setTitle('');
    setDesc('');
  };

  return (
    <Popup
      ref={ref}
      modal
      onClose={handleClose}
      contentStyle={{ borderRadius: '12px', padding: '0' }}
    >
      {(close) => (
        <div className="relative p-6 overflow-hidden h-[400px]">
          <img
            src={modalBg}
            alt="modal-background"
            className="absolute bottom-0 z-0 -translate-x-1/2 left-1/2"
            width="70%"
          />
          <button
            className="absolute block cursor-pointer top-1 right-1"
            onClick={close}
          >
            <HiOutlineX className="text-2xl text-gray-500" />
          </button>
          <div className="flex gap-2 mb-2">
            <div className="flex flex-col flex-1 gap-4">
              <input
                type="text"
                name="judul"
                value={title}
                onChange={handleInputChange}
                placeholder="Masukan judul"
                className="input input-bordered"
              />
            </div>
            <div className="flex-1">
              <input
                type="date"
                onChange={(e) => handleDateChange(e.target.value)}
                className="w-full text-gray-800 input input-bordered"
              />
            </div>
          </div>
          <div className="w-full">
            <textarea
              name="description"
              value={desc}
              onChange={handleInputChange}
              placeholder="Masukan deskripsi"
              rows={5}
              className="w-full textarea textarea-bordered"
            />
          </div>
          <div className="absolute bottom-6 right-6">
            <button
              className="text-white btn bg-primary-2 hover:bg-primary-3"
              onClick={postNewPengumuman}
            >
              Post
            </button>
          </div>
        </div>
      )}
    </Popup>
  );
});

export default ModalPengumuman;

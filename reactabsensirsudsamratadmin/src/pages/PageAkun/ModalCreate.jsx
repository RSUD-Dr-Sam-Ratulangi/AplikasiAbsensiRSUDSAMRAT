import React, { useState } from 'react';
import pPicutre from '../../assets/ProfilePicture.png';
import bgModal from '../../assets/modal-bg.png';
import { HiUpload, HiEye, HiEyeOff, HiX } from 'react-icons/hi';

const ModalCreate = ({ isOpen, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordLogo = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div>
      <dialog className={`modal ${isOpen ? 'modal-open' : ''}`}>
        <div
          className='absolute top-0 left-0 w-full h-full'
          onClick={onClose}></div>
        <div className='relative w-5/6 max-w-3xl modal-box'>
          <img
            src={bgModal}
            alt='logo'
            className='absolute bottom-0 left-0 w-full h-80 -z-50'
          />
          <form method='dialog'>
            <div className='flex justify-end'>
              <HiX onClick={onClose} className='cursor-pointer' />
            </div>
            <h3 className='mb-3 text-lg font-bold'>Create Account</h3>
            <div className='flex justify-between'>
              <div className='grid gap-5'>
                <input
                  type='text'
                  placeholder='Username'
                  className='pr-10 input input-primary border-slate-800'
                />
                <input
                  type='number'
                  placeholder='NIK'
                  className='pr-10 input input-primary border-slate-800'
                />
                <input
                  type='text'
                  placeholder='Bidang / Jabatan'
                  className='pr-10 input input-primary border-slate-800'
                />

                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Password'
                  className='pr-10 input input-primary border-slate-800'
                />
                <button
                  onClick={handlePasswordLogo}
                  className='absolute bottom-[115px] left-[245px] text-lg bg-none border-none '>
                  {showPassword ? <HiEyeOff /> : <HiEye />}
                </button>
              </div>
              <div className='mt-1 mr-10'>
                <img src={pPicutre} className='w-52 h-52' alt='Profile' />
              </div>
            </div>
            <div className='modal-action'>
              <button className='btn bg-[#01A7A3] text-white'>Create</button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default ModalCreate;

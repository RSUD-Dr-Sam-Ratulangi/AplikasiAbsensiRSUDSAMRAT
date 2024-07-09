import Logo from '../../assets/LOGORSREVISI4.png';
import bg from '../../assets/abstract_wavy_line_geometric1.png';
import { apiLogin } from '../../config/axios';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess } from '../../config/authState/authSlice';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [nikUser, SetNikUser] = useState('');
  const [password, setPassowrd] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChangeUserNik = (e) => {
    SetNikUser(e.target.value);
  };

  const handleChangePassword = (e) => {
    setPassowrd(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const response = await apiLogin.post('/api/auth/login', {
        nik: nikUser,
        password: password
      });
      dispatch(loginSuccess({ accessToken: response.data.data.access_token }));
      console.log(response.data);
      navigate('/dashboard');
    } catch (error) {
      console.log(error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className='flex bg-gray-200'>
      <div className='flex justify-center items-center w-4/6 h-screen '>
        <figure className='max-w-lg'>
          <img className='h-auto max-w-sm rounded-lg' src={Logo} alt='Logo' />
          <p className='text text-2xl text-black text-center font-bold'>
            ABSENSI TENAGA HARIAN LEPAS
          </p>
          <p className='text text-2xl text-black  text-center font-bold'>
            RSUD SAMRATULANGI TONDANO
          </p>
        </figure>
      </div>
      <div className='flex justify-center items-center w-full h-screen relative'>
        <img
          src={bg}
          alt='logo'
          className='absolute left-0 top-0 w-full h-full'
        />
        <div className='hero min-h-screen'>
          <div className='hero-overlay'></div>
          <div className='hero-content min-w-full text-center text-neutral-content '>
            <div className='card flex-shrink-0 w-full max-w-sm shadow-2xl bg-white'>
              <div className='card-body'>
                <div className='form-control'>
                  <label className='label'>
                    <span className='label-text text-black font-bold'>NIK</span>
                  </label>
                  <input
                    type='text'
                    value={nikUser}
                    onChange={handleChangeUserNik}
                    onKeyPress={handleKeyPress}
                    className='input bg-transparent rounded-none text-black focus:outline-none input-ghost border-b-black border-l-white border-r-white border-t-white'
                  />
                </div>
                <div className='form-control'>
                  <label className='label'>
                    <span className='label-text font-bold text-black'>Password</span>
                  </label>
                  <input
                    type='password'
                    value={password}
                    onChange={handleChangePassword}
                    onKeyPress={handleKeyPress}
                    className='input focus:outline-none rounded-none text-black border-b-black border-l-white border-r-white border-t-white  bg-transparent'
                  />
                </div>
                <div className='form-control mt-6'>
                  <button
                    className='btn bg-[#01A7A3] border-none text-white'
                    onClick={handleSubmit}
                    // onClick={() => {
                    //   window.location.href = '/';
                    // }}
                  >
                    Log in
                  </button>
                  {/* <button className='btn btn-primary' onClick={checkCookies}>
                    Check Cookies
                  </button> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

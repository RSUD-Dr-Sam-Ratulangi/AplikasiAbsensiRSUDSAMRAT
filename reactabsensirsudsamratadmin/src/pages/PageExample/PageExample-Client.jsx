// import React, { useState, useEffect } from 'react';
// import io from 'socket.io-client';

// const socket = io.connect('http://localhost:3001');

// const PageExampleClient = () => {
//   const [messageReceived, setMessageReceived] = useState([]);

//   useEffect(() => {
//     const handleReceivedMessage = (data) => {
//       // Mendengarkan event 'message' dari server
//       setMessageReceived((prevMessages) => [...prevMessages, data]);
//     };

//     socket.on('recieve_message', handleReceivedMessage);

//     return () => {
//       socket.off('recieve_message', handleReceivedMessage); // Membersihkan listener saat komponen unmount
//     };
//   }, []); // Menggunakan array dependensi kosong untuk menjalankan useEffect hanya saat mount

//   return (
//     <div className="p-4 mx-auto my-8 bg-white rounded shadow w-96">
//       <h2 className="mb-4 text-lg font-semibold">Formulir Chat</h2>
//       <div className="mb-4">
//         <ul>
//           {messageReceived.map((msg, index) => (
//             <li key={index}>
//               <strong>{msg.title}:</strong> {msg.message}
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default PageExampleClient;

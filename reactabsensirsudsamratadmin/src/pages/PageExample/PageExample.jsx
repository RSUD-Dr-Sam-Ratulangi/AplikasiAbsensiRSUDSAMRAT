// import React, { useState } from 'react';
// import io from 'socket.io-client';

// const socket = io.connect('http://localhost:3001');

// export default function PagExample() {
//   const [title, setTitle] = useState('');
//   const [message, setMessage] = useState('');

//   const sendMsg = () => {
//     //TODO: Save database before send socket
//     socket.emit('message', { title, message });
//   };

//   return (
//     <div className="w-96 mx-auto my-8 p-4 bg-white rounded shadow">
//       <h2 className="text-lg font-semibold mb-4">Formulir Chat</h2>
//       <div className="flex">
//         <input
//           type="text"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           placeholder="Judul"
//           className="flex-grow p-2 border border-gray-300 rounded-l"
//         />
//         <input
//           type="text"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           placeholder="Pesan"
//           className="flex-grow p-2 border border-gray-300 rounded-l"
//         />
//         <button
//           type="submit"
//           className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600"
//           onClick={sendMsg}
//         >
//           Kirim
//         </button>
//       </div>
//     </div>
//   );
// }

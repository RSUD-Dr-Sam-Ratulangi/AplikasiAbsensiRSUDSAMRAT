import "../../App.css";

const TableBody = () => {
  const tableData = [
    {
      profilPicture: "",
      name: "John Doe",
      waktu: "08:30 AM",
      shift: "Shift 1",
      presensi: "Present",
      kategori: "WHO",
      bukti: "Buka",
    },
    {
      profilPicture: "",
      name: "John Doe",
      waktu: "08:30 AM",
      shift: "Shift 1",
      presensi: "Present",
      kategori: "WHO",
      bukti: "Buka",
    },
    {
      profilPicture: "",
      name: "John Doe",
      waktu: "08:30 AM",
      shift: "Shift 1",
      presensi: "Present",
      kategori: "WHO",
      bukti: "Buka",
    },
    // Add other data rows here
  ];

  return (
    <>
      {tableData.map((row, index) => (
        <tr key={index}>
          <td>{row.profilPicture}</td>
          <td>{row.name}</td>
          <td>{row.waktu}</td>
          <td>{row.shift}</td>
          <td>{row.presensi}</td>
          <td>{row.kategori}</td>
          <td>
            <button className="buttonTable">{row.bukti}</button>
          </td>
        </tr>
      ))}
    </>
  );
};

export default TableBody;

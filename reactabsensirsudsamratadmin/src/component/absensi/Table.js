import "../../App.css"; // We'll create this file to add custom styles
import TableBody from "./TableBody";

const TableComponent = () => {
  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th></th>
            <th>Nama</th>
            <th>Waktu</th>
            <th>Shift</th>
            <th>Presensi</th>
            <th>Kategori</th>
            <th>Bukti</th>
          </tr>
        </thead>
        <tbody>
          <TableBody />
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent;

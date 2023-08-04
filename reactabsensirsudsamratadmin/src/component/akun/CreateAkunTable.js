import "../../App.css"; // We'll create this file to add custom styles
import TableBody from "./CreateAkunTableComponent";

const CreateAkunTable = () => {
  return (
    <div className="table-container">
      <table className="CreateAccount-table">
        <thead>
          <tr>
            <th></th>
            <th>Nama</th>
            <th>Password</th>
            <th>NIK</th>
            <th>Bidang/Jabatan</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <TableBody />
        </tbody>
      </table>
    </div>
  );
};

export default CreateAkunTable;

import "../../App.css";
import trash from "../../img/Trash.png";
import edit from "../../img/Edit_fill.png";
const CreateAkunTableComponent = () => {
  const tableData = [
    {
      profilPicture: "",
      name: "John Doe",
      password: "08:30 AM",
      nik: "Shift 1",
      Bidang: "Present",
      bukti: "Buka",
    },
    {
      profilPicture: "",
      name: "John Doe",
      password: "08:30 AM",
      nik: "Shift 1",
      Bidang: "Present",
      bukti: "Buka",
    },
    {
      profilPicture: "",
      name: "John Doe",
      password: "08:30 AM",
      nik: "Shift 1",
      Bidang: "Present",
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
          <td>{row.password}</td>
          <td>{row.nik}</td>
          <td>{row.Bidang}</td>
          <td className="CreateAccount-tableAction">
            <button className="CreateAccount-buttonTableEdit">
              <img src={edit} alt="edit-logo" />
            </button>
            <button className="CreateAccount-buttonTableTrash">
              <img src={trash} alt="trash-logo" />
            </button>
          </td>
        </tr>
      ))}
    </>
  );
};

export default CreateAkunTableComponent;

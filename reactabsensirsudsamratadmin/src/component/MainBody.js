import Header from "./Header";
import Search from "./absensi/Search";
import TableComponent from "./absensi/Table";
import CreateAkunTable from "./akun/CreateAkunTable";
import CreateAkun from "./akun/CreateAkun";

const Dashboard = ({ activeButtonId }) => {
  return (
    <div className="main-body">
      <Header />
      {activeButtonId === 2 ? (
        <>
          <Search />
          <TableComponent />
        </>
      ) : activeButtonId === 3 ? (
        <>
          <CreateAkun />
          <CreateAkunTable />
        </>
      ) : null}
    </div>
  );
};

export default Dashboard;

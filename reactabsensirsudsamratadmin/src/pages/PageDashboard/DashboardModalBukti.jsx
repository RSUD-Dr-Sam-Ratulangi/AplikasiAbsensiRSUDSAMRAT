import { forwardRef, useState } from "react";
import Popup from "reactjs-popup";
import { HiOutlineX } from "react-icons/hi";

const ModalBuktiAbsen = forwardRef((props, ref) => {
  const {
    imageCheckIn,
    imageCheckOut,
    selectedData,
  } = props;
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  const closeModal = () => {
    ref.current.close();
  };

  const toggleCheckIn = () => {
    setIsCheckedIn(!isCheckedIn);
  };

  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      day: "numeric",
      month: "numeric",
      year: "numeric",
    };
    const formattedDate = new Date(dateString).toLocaleDateString(
      "id-ID",
      options
    );
    return formattedDate;
  };

  const getImageToDisplay = () => {
    if (isCheckedIn) {
      return imageCheckIn;
    } else {
      return imageCheckOut;
    }
  };
  const imageToDisplay = getImageToDisplay();

  const getClockToDisplay = () => {
    if (isCheckedIn) {
      return (
        <p className="text-lg font-bold text-center">
          {selectedData.clockInTime || selectedData.clockIn}
        </p>
      );
    } else {
      if (selectedData && selectedData.clockOut) {
        return (
          <p className="text-lg font-bold text-center">
            {selectedData && selectedData.clockOut}
          </p>
        );
      } else {
        return (
          <p className="text-red-400 font-bold text-center">BELUM ABSEN</p>
        );
      }
    }
  };

  const clockToDisplay = getClockToDisplay();

  return (
    <Popup
      ref={ref}
      modal
      onClose={closeModal}
      contentStyle={{ borderRadius: "12px", padding: "0", width: "28rem" }}
    >
      {(close) => (
        <div className="w-full h-full p-5">
          <div>
            <button
              className="absolute block cursor-pointer top-1 right-1"
              onClick={close}
            >
              <HiOutlineX className="text-2xl text-gray-500" />
            </button>
          </div>
          <div className="flex gap-2 text-xl font-semibold justify-center">
            <button
              className={`${isCheckedIn ? "text-primary-2" : ""}`}
              onClick={toggleCheckIn}
            >
              Check in
            </button>
            <button
              className={` ${!isCheckedIn ? " text-primary-2" : ""}`}
              onClick={toggleCheckIn}
            >
              Check out
            </button>
          </div>
          <div className="grid justify-center">
            <p>{selectedData && selectedData.employee.name}</p>

            <span> {clockToDisplay}</span>

            <span className="text-center">
              {formatDate(selectedData && selectedData.scheduleDate)}
            </span>
          </div>
          <div className="p-1 border-4 rounded-xl ">
            {imageToDisplay ? (
              <img
                src={`data:image/png;base64,${imageToDisplay}`}
                alt="bukti"
                className="object-fill w-full h-[500px] rounded-lg"
              />
            ) : (
              <div>
                <img
                  src="https://placehold.co/800?text=No+Image+:)&font=lora"
                  alt="bukti"
                  className="w-full h-[500px] rounded-lg"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </Popup>
  );
});

export default ModalBuktiAbsen;

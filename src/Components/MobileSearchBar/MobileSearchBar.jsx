import { useState } from "react";
import { BiSearch } from "react-icons/bi";
import SearchModal from "../SearchModal/SearchModal";

const MobileSearchBar = () => {
  const [showSearchModal, setShowSearchModal] = useState(false);
  return (
    <>
    <div className="d-flex justify-content-center align-items-center gap-3 p-3 d-lg-none w-100">
      <form className="position-relative flex-grow-1 d-flex search-container w-100" style={{ maxWidth: "400px" }}>
        <input
          type="text"
          className="form-control"
          placeholder="Search for Medicines & more..."
          onClick={() => setShowSearchModal(true)}
        />
        <button className="btn" type="submit">
          <BiSearch size={20} />
        </button>

      </form>

    </div>
    {showSearchModal && (
        <SearchModal onClose={() => setShowSearchModal(false)} />
      )}

    </>
  );
};

export default MobileSearchBar;

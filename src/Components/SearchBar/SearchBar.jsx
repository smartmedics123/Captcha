import "./SearchBar.css"; // Optional external CSS
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const SearchBar = () => {
  return (
    <div className="search-bar-container">
      <div className="input-group">
        {/* Search Icon */}
        <span className="input-group-text">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
        </span>
        {/* Input Field */}
        <input
          type="text"
          className="form-control"
          placeholder="Search for Medicines & more..."
        />
      </div>
    </div>
  );
};

export default SearchBar;

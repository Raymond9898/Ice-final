import React from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchBar = ({ query, onChange, onSubmit }) => {
  return (
    <form
      className="d-none d-lg-flex align-items-center"
      onSubmit={onSubmit}
      role="search"
    >
      <div className="input-group">
        <input
          type="text"
          className="form-control border-end-0"
          placeholder="Search jewelry..."
          aria-label="Search jewelry"
          value={query}
          onChange={onChange}
        />
        <button
          className="btn btn-outline-secondary border-start-0"
          type="submit"
          aria-label="Search"
        >
          <FaSearch />
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
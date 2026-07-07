const Filter = ({ searchQuery, handleSearch }) => {
  return (
    <div>
      <label>Search</label>
      <input type="text" value={searchQuery} onChange={handleSearch} />
    </div>
  );
};

export default Filter;

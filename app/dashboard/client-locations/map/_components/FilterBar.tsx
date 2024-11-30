// Define a type for the filters
type Filters = {
  category: string;
  status: string;
};

type FilterBarProps = {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;  // Make type-safe
};

export const FilterBar = ({ filters, onFilterChange }: FilterBarProps) => {
  return (
    <div className="p-4 bg-white shadow-md">
      <div className="flex gap-4">
        <select
          value={filters.category}
          onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="all">All Categories</option>
          {/* Add your categories */}
        </select>

        <select
          value={filters.status}
          onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="all">All Statuses</option>
          {/* Add your statuses */}
        </select>

        {/* Add more filters as needed */}
      </div>
    </div>
  );
}; 
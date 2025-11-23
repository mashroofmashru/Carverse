import React from "react";
import FilterSection from "./FilterSection.jsx";
import {
  TextInput,
  NumberInput,
  Select,
  Checkbox,
  Radio,
} from "../ui/FormControls";
import { PrimaryButton, SecondaryButton } from "../ui/Buttons";

const FilterSidebar = ({ isOpen, onClose, onApply, onReset }) => {
  return (
    <aside
      id="filter-sidebar"
      className={`fixed inset-y-0 left-0 w-64 lg:static lg:w-full bg-white lg:bg-transparent p-6 lg:p-0 shadow-xl lg:shadow-none overflow-y-auto border-r lg:border-none ${
        isOpen ? "open" : ""
      }`}
    >
      <div className="flex justify-between items-center mb-6 lg:hidden">
        <h3 className="text-xl font-bold text-gray-900">Filters</h3>
        <button
          className="text-gray-500 hover:text-gray-900"
          onClick={onClose}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          onApply && onApply();
        }}
        onReset={onReset}
      >
        <FilterSection>
          <TextInput
            id="search"
            label="Keyword Search"
            placeholder="Enter Make, Model, or Year"
            type="text"
          />
        </FilterSection>

        <FilterSection title="Price Range">
          <div className="grid grid-cols-2 gap-3">
            <NumberInput placeholder="Min ($1,000)" min="1000" />
            <NumberInput placeholder="Max ($100,000+)" max="100000" />
          </div>
        </FilterSection>

        <FilterSection title="Vehicle Type">
          <div className="space-y-2">
            <Checkbox label="Sedan" />
            <Checkbox label="SUV" defaultChecked />
            <Checkbox label="Truck" />
            <Checkbox label="Hatchback" />
            <Checkbox label="Coupe" />
          </div>
        </FilterSection>

        <FilterSection title="Max Mileage">
          <Select defaultValue="Under 50,000 miles">
            <option value="Any Mileage">Any Mileage</option>
            <option value="Under 25,000 miles">Under 25,000 miles</option>
            <option value="Under 50,000 miles">Under 50,000 miles</option>
            <option value="Under 75,000 miles">Under 75,000 miles</option>
          </Select>
        </FilterSection>

        <FilterSection title="Fuel Type">
          <div className="space-y-2">
            <Radio label="Gasoline" name="fuel" />
            <Radio label="Electric" name="fuel" />
            <Radio label="Hybrid" name="fuel" />
          </div>
        </FilterSection>

        <div className="pt-4 space-y-3 lg:space-y-0 lg:flex lg:space-x-3">
          <PrimaryButton type="submit">Apply Filters</PrimaryButton>
          <SecondaryButton type="reset">Reset Filters</SecondaryButton>
        </div>
      </form>
    </aside>
  );
};

export default FilterSidebar;

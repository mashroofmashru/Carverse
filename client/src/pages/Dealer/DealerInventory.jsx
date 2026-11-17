import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Car, Search, Eye, Trash2, Fuel, Settings2, Plus, RotateCcw, Pencil } from "lucide-react";
import DealerLayout from "../../components/common/DealerLayout";
import TableCard, { Th, THEAD_CLASS, TBODY_CLASS } from "../../components/common/TableCard";
import StatusBadge from "../../components/common/StatusBadge";
import EmptyState from "../../components/common/EmptyState";
import Modal from "../../components/common/Modal";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import DetailBox from "../../components/Dashboard/DetailBox";
import AddCarForm from "../../components/Details/AddCarForm";
import { useToast } from "../../context/ToastContext";
import api from "../../config/server";
import { getImageUrl } from "../../config/imageUrl";
import { formatINR, label } from "../../utils/format";

const CATEGORIES = ["SUVs", "SEDAN", "HATCHBACK", "ELECTRIC"];

const Thumb = ({ car, className = "h-14 w-20" }) => (
  <span className={`block shrink-0 overflow-hidden rounded-lg bg-mist-deep ${className}`}>
    {car.images?.[0] && <img src={getImageUrl(car.images[0])} alt="" className="h-full w-full object-cover" />}
  </span>
);

const DealerInventory = () => {
  const { showToast } = useToast();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCar, setSelectedCar] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [editCar, setEditCar] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null, title: "" });

  const fetchInventory = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await api.get("/dealer/get-inventory");
      setInventory(Array.isArray(res.data.cars) ? res.data.cars : []);
    } catch (err) {
      console.error("Error fetching inventory:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/dealer/delete-car/${deleteConfirm.id}`);
      setInventory((prev) => prev.filter((car) => car._id !== deleteConfirm.id));
      setSelectedCar((cur) => (cur?._id === deleteConfirm.id ? null : cur));
      showToast("Vehicle deleted");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to delete vehicle", "error");
    } finally {
      setDeleteConfirm({ show: false, id: null, title: "" });
    }
  };

  const filteredCars = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return inventory.filter((car) => {
      const matchesSearch = !q || car.brand?.toLowerCase().includes(q) || car.model?.toLowerCase().includes(q);
      const matchesCategory = categoryFilter === "all" || car.category === categoryFilter;
      const matchesStatus =
        statusFilter === "all" ? true : statusFilter === "sold" ? car.status === "SOLD" : car.status !== "SOLD";
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [inventory, searchTerm, categoryFilter, statusFilter]);

  const soldCount = inventory.filter((c) => c.status === "SOLD").length;
  const hasFilters = searchTerm.trim() !== "" || categoryFilter !== "all" || statusFilter !== "all";
  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setStatusFilter("all");
  };
  const askDelete = (car) => setDeleteConfirm({ show: true, id: car._id, title: `${car.brand} ${car.model}` });

  const subtitle = loading
    ? "Loading…"
    : `${inventory.length - soldCount} available · ${soldCount} sold`;

  const renderBody = () => {
    if (loading) {
      return <div className="card animate-pulse p-16 text-center text-gray-600">Loading inventory…</div>;
    }
    if (error) {
      return (
        <div className="card">
          <EmptyState icon={RotateCcw} title="Couldn't load your inventory" hint="Please check your connection and try again.">
            <button type="button" onClick={fetchInventory} className="btn btn-brand">
              Try again
            </button>
          </EmptyState>
        </div>
      );
    }
    if (inventory.length === 0) {
      return (
        <div className="card">
          <EmptyState icon={Car} title="No vehicles yet" hint="Add your first vehicle and it will show up on the marketplace right away.">
            <button type="button" onClick={() => setShowAdd(true)} className="btn btn-brand">
              <Plus size={18} aria-hidden="true" /> Add vehicle
            </button>
          </EmptyState>
        </div>
      );
    }
    if (filteredCars.length === 0) {
      return (
        <div className="card">
          <EmptyState icon={Search} title="No vehicles match your filters">
            {hasFilters && (
              <button type="button" onClick={clearFilters} className="btn btn-light">
                Clear filters
              </button>
            )}
          </EmptyState>
        </div>
      );
    }

    return (
      <>
        {/* Phones: one card per vehicle */}
        <ul className="space-y-3 md:hidden">
          {filteredCars.map((car) => (
            <li key={car._id} className="card p-4">
              <div className="flex gap-3">
                <Thumb car={car} className="h-20 w-28" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold leading-tight">
                    {car.brand} {car.model}
                  </p>
                  <p className="text-xs text-gray-600">{car.year}</p>
                  <p className="mt-1 font-semibold">{formatINR(car.price)}</p>
                  <div className="mt-1">
                    <StatusBadge status={car.status === "SOLD" ? "SOLD" : "AVAILABLE"} />
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-neutral-100 pt-3">
                <p className="flex items-center gap-3 text-xs text-gray-700">
                  <span className="inline-flex items-center gap-1.5">
                    <Fuel size={14} aria-hidden="true" /> {label(car.fuelType)}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Settings2 size={14} aria-hidden="true" /> {label(car.transmission)}
                  </span>
                </p>
                <div className="flex gap-1">
                  <button type="button" onClick={() => setSelectedCar(car)} className="icon-btn" aria-label={`View ${car.brand} ${car.model}`}>
                    <Eye size={18} aria-hidden="true" />
                  </button>
                  {car.status !== "SOLD" && (
                    <button type="button" onClick={() => setEditCar(car)} className="icon-btn" aria-label={`Edit ${car.brand} ${car.model}`}>
                      <Pencil size={18} aria-hidden="true" />
                    </button>
                  )}
                  <button type="button" onClick={() => askDelete(car)} className="icon-btn hover:!bg-red-50 hover:!text-red-700" aria-label={`Delete ${car.brand} ${car.model}`}>
                    <Trash2 size={18} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Tablet and up: table */}
        <div className="hidden md:block">
          <TableCard>
            <thead className={THEAD_CLASS}>
              <tr>
                <Th>Vehicle</Th>
                <Th>Specs</Th>
                <Th>Price</Th>
                <Th>Status</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>
            <tbody className={TBODY_CLASS}>
              {filteredCars.map((car) => (
                <tr key={car._id} onClick={() => setSelectedCar(car)} className="cursor-pointer transition-colors hover:bg-mist">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-4">
                      <Thumb car={car} />
                      <div className="min-w-0">
                        <p className="truncate font-semibold">
                          {car.brand} {car.model}
                        </p>
                        <p className="text-xs text-gray-600">{car.year}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-700">
                    <p className="flex items-center gap-2">
                      <Fuel size={14} aria-hidden="true" /> {label(car.fuelType)}
                    </p>
                    <p className="mt-1 flex items-center gap-2">
                      <Settings2 size={14} aria-hidden="true" /> {label(car.transmission)}
                    </p>
                  </td>
                  <td className="px-5 py-3.5 font-semibold">{formatINR(car.price)}</td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={car.status === "SOLD" ? "SOLD" : "AVAILABLE"} />
                  </td>
                  <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end gap-1">
                      <button type="button" onClick={() => setSelectedCar(car)} className="icon-btn" aria-label={`View ${car.brand} ${car.model}`} title="View details">
                        <Eye size={18} aria-hidden="true" />
                      </button>
                      {car.status !== "SOLD" && (
                        <button type="button" onClick={() => setEditCar(car)} className="icon-btn" aria-label={`Edit ${car.brand} ${car.model}`} title="Edit details">
                          <Pencil size={18} aria-hidden="true" />
                        </button>
                      )}
                      <button type="button" onClick={() => askDelete(car)} className="icon-btn hover:!bg-red-50 hover:!text-red-700" aria-label={`Delete ${car.brand} ${car.model}`} title="Delete">
                        <Trash2 size={18} aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </TableCard>
        </div>
      </>
    );
  };

  return (
    <DealerLayout>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Inventory</h1>
          <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
        </div>
        <button type="button" onClick={() => setShowAdd(true)} className="btn btn-brand self-start sm:self-auto">
          <Plus size={18} aria-hidden="true" /> Add vehicle
        </button>
      </div>

      {/* Filters */}
      <div className="card mb-5 flex flex-col gap-3 p-4 md:flex-row">
        <div className="relative flex-1">
          <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" aria-hidden="true" />
          <label htmlFor="inv-search" className="sr-only">
            Search brand or model
          </label>
          <input
            id="inv-search"
            type="search"
            placeholder="Search brand or model…"
            className="field pl-11"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="md:w-52">
          <label htmlFor="inv-category" className="sr-only">
            Category
          </label>
          <select id="inv-category" className="field cursor-pointer font-medium" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="all">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {label(c)}
              </option>
            ))}
          </select>
        </div>
        <div className="md:w-44">
          <label htmlFor="inv-status" className="sr-only">
            Status
          </label>
          <select id="inv-status" className="field cursor-pointer font-medium" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All status</option>
            <option value="available">Available</option>
            <option value="sold">Sold</option>
          </select>
        </div>
      </div>

      {renderBody()}

      {deleteConfirm.show && (
        <ConfirmationModal
          isOpen={deleteConfirm.show}
          onClose={() => setDeleteConfirm({ show: false, id: null, title: "" })}
          onConfirm={handleConfirmDelete}
          title="Remove vehicle?"
          message={
            <>
              You are about to delete <span className="font-bold text-ink">{deleteConfirm.title}</span>. It will be permanently removed.
            </>
          }
          confirmText="Delete"
        />
      )}

      {selectedCar && (
        <Modal
          title={`${selectedCar.brand} ${selectedCar.model}`}
          subtitle={selectedCar.title}
          onClose={() => setSelectedCar(null)}
        >
          <div className="p-6">
            <div className="mb-6 aspect-video overflow-hidden rounded-xl bg-mist-deep">
              {selectedCar.images?.[0] && (
                <img src={getImageUrl(selectedCar.images[0])} alt={selectedCar.title || "Vehicle"} className="h-full w-full object-cover" />
              )}
            </div>

            <div className="mb-5 flex items-center justify-between gap-4">
              <p className="text-2xl font-bold">{formatINR(selectedCar.price)}</p>
              <StatusBadge status={selectedCar.status === "SOLD" ? "SOLD" : "AVAILABLE"} />
            </div>

            <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <DetailBox label="Year" value={selectedCar.year} />
              <DetailBox label="Fuel" value={label(selectedCar.fuelType)} />
              <DetailBox label="Transmission" value={label(selectedCar.transmission)} />
              <DetailBox label="Mileage" value={`${Number(selectedCar.mileage).toLocaleString("en-IN")} km`} />
              <DetailBox label="Color" value={selectedCar.color} />
              <DetailBox label="Category" value={label(selectedCar.category)} />
            </div>

            <h3 className="mb-2 text-sm font-semibold">Description</h3>
            <p className="whitespace-pre-line text-sm leading-relaxed text-gray-700">{selectedCar.description}</p>

            {selectedCar.status !== "SOLD" && (
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setEditCar(selectedCar);
                    setSelectedCar(null);
                  }}
                  className="btn btn-ink"
                >
                  <Pencil size={18} aria-hidden="true" /> Edit details
                </button>
              </div>
            )}
          </div>
        </Modal>
      )}

      {showAdd && <AddCarForm onClose={() => setShowAdd(false)} onAdded={fetchInventory} />}
      {editCar && <AddCarForm car={editCar} onClose={() => setEditCar(null)} onAdded={fetchInventory} />}
    </DealerLayout>
  );
};

export default DealerInventory;

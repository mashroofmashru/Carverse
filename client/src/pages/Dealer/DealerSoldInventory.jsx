import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Search, Eye, Trash2, Car, User, CheckCircle2, IndianRupee, CalendarDays, MapPin, CreditCard, RotateCcw } from "lucide-react";
import DealerLayout from "../../components/common/DealerLayout";
import TableCard, { Th, THEAD_CLASS, TBODY_CLASS } from "../../components/common/TableCard";
import StatusBadge from "../../components/common/StatusBadge";
import EmptyState from "../../components/common/EmptyState";
import Modal from "../../components/common/Modal";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import StatCard from "../../components/Dashboard/StateCard";
import DetailBox from "../../components/Dashboard/DetailBox";
import { useToast } from "../../context/ToastContext";
import api from "../../config/server";
import { getImageUrl } from "../../config/imageUrl";
import { formatINR, label } from "../../utils/format";

const shortDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
const carName = (order) => (order.carId ? `${order.carId.brand} ${order.carId.model}` : "Deleted car");
const buyerName = (order) => order.customerDetails?.fullName || order.userId?.Name || "Unknown";

const Thumb = ({ order, className = "h-14 w-20" }) => (
  <span className={`block shrink-0 overflow-hidden rounded-lg bg-mist-deep ${className}`}>
    {order.carId?.images?.[0] && <img src={getImageUrl(order.carId.images[0])} alt="" className="h-full w-full object-cover" />}
  </span>
);

const DealerSoldInventory = () => {
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null, title: "" });

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await api.get("/dealer/get-sold-cars");
      setOrders(Array.isArray(res.data.orders) ? res.data.orders : []);
    } catch (err) {
      console.error("Error fetching sold cars:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/dealer/delete-order-car/${deleteConfirm.id}`);
      setOrders((prev) => prev.filter((o) => o._id !== deleteConfirm.id));
      setSelectedOrder((cur) => (cur?._id === deleteConfirm.id ? null : cur));
      showToast("Sale record deleted");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to delete the sale record", "error");
    } finally {
      setDeleteConfirm({ show: false, id: null, title: "" });
    }
  };

  const filteredOrders = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return orders;
    return orders.filter(
      (o) =>
        o.carId?.brand?.toLowerCase().includes(q) ||
        o.carId?.model?.toLowerCase().includes(q) ||
        o.userId?.Name?.toLowerCase().includes(q) ||
        o.customerDetails?.fullName?.toLowerCase().includes(q)
    );
  }, [orders, searchTerm]);

  // Summary strip (always for all sales, not just the searched ones)
  const totalRevenue = orders.reduce((sum, o) => sum + (o.amount || 0), 0);
  const latestSale = orders.reduce((latest, o) => (!latest || new Date(o.createdAt) > new Date(latest) ? o.createdAt : latest), null);

  const askDelete = (order) =>
    setDeleteConfirm({ show: true, id: order._id, title: `${carName(order)} (sale record)` });

  const renderBody = () => {
    if (loading) return <div className="card animate-pulse p-16 text-center text-gray-600">Loading sales history…</div>;
    if (error) {
      return (
        <div className="card">
          <EmptyState icon={RotateCcw} title="Couldn't load your sales" hint="Please check your connection and try again.">
            <button type="button" onClick={fetchOrders} className="btn btn-brand">
              Try again
            </button>
          </EmptyState>
        </div>
      );
    }
    if (orders.length === 0) {
      return (
        <div className="card">
          <EmptyState icon={Car} title="No sales yet" hint="When a customer buys one of your cars, the sale shows up here." />
        </div>
      );
    }
    if (filteredOrders.length === 0) {
      return (
        <div className="card">
          <EmptyState icon={Search} title="No sales match your search">
            <button type="button" onClick={() => setSearchTerm("")} className="btn btn-light">
              Clear search
            </button>
          </EmptyState>
        </div>
      );
    }

    return (
      <>
        {/* Phones */}
        <ul className="space-y-3 md:hidden">
          {filteredOrders.map((order) => (
            <li key={order._id} className="card p-4">
              <div className="flex gap-3">
                <Thumb order={order} className="h-20 w-28" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold leading-tight">{carName(order)}</p>
                  <p className="text-xs text-gray-600">
                    {order.carId?.year} {order.carId?.fuelType ? `· ${label(order.carId.fuelType)}` : ""}
                  </p>
                  <p className="mt-1 font-semibold">{formatINR(order.amount)}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between gap-3 border-t border-neutral-100 pt-3">
                <div className="min-w-0 text-xs text-gray-700">
                  <p className="truncate font-medium text-ink">{buyerName(order)}</p>
                  <p>{shortDate(order.createdAt)}</p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button type="button" onClick={() => setSelectedOrder(order)} className="icon-btn" aria-label={`View sale of ${carName(order)}`}>
                    <Eye size={18} aria-hidden="true" />
                  </button>
                  <button type="button" onClick={() => askDelete(order)} className="icon-btn hover:!bg-red-50 hover:!text-red-700" aria-label={`Delete sale record of ${carName(order)}`}>
                    <Trash2 size={18} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Tablet and up */}
        <div className="hidden md:block">
          <TableCard>
            <thead className={THEAD_CLASS}>
              <tr>
                <Th>Vehicle</Th>
                <Th>Buyer</Th>
                <Th>Sale price</Th>
                <Th>Sale date</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>
            <tbody className={TBODY_CLASS}>
              {filteredOrders.map((order) => (
                <tr key={order._id} onClick={() => setSelectedOrder(order)} className="cursor-pointer transition-colors hover:bg-mist">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-4">
                      <Thumb order={order} />
                      <div className="min-w-0">
                        <p className="truncate font-semibold">{carName(order)}</p>
                        <p className="text-xs text-gray-600">
                          {order.carId?.year} {order.carId?.fuelType ? `· ${label(order.carId.fuelType)}` : ""}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold" aria-hidden="true">
                        {buyerName(order).charAt(0).toUpperCase()}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{buyerName(order)}</p>
                        <p className="truncate text-xs text-gray-600">
                          {order.customerDetails?.city ? `${order.customerDetails.city}, ${order.customerDetails.zipCode}` : order.userId?.Email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-semibold">{formatINR(order.amount)}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-700">{shortDate(order.createdAt)}</td>
                  <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end gap-1">
                      <button type="button" onClick={() => setSelectedOrder(order)} className="icon-btn" aria-label={`View sale of ${carName(order)}`} title="View details">
                        <Eye size={18} aria-hidden="true" />
                      </button>
                      <button type="button" onClick={() => askDelete(order)} className="icon-btn hover:!bg-red-50 hover:!text-red-700" aria-label={`Delete sale record of ${carName(order)}`} title="Delete record">
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Sold cars</h1>
        <p className="mt-1 text-sm text-gray-600">Your sales history and buyer details.</p>
      </div>

      {/* Summary strip */}
      {!loading && !error && orders.length > 0 && (
        <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <StatCard title="Cars sold" value={orders.length} icon={CheckCircle2} color="purple" />
          <StatCard title="Total revenue" value={formatINR(totalRevenue)} icon={IndianRupee} color="green" />
          <StatCard title="Latest sale" value={shortDate(latestSale)} icon={CalendarDays} color="blue" />
        </div>
      )}

      <div className="card mb-5 p-4">
        <div className="relative">
          <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" aria-hidden="true" />
          <label htmlFor="sold-search" className="sr-only">
            Search by car or buyer
          </label>
          <input
            id="sold-search"
            type="search"
            placeholder="Search by car or buyer name…"
            className="field pl-11"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {renderBody()}

      {deleteConfirm.show && (
        <ConfirmationModal
          isOpen={deleteConfirm.show}
          onClose={() => setDeleteConfirm({ show: false, id: null, title: "" })}
          onConfirm={handleConfirmDelete}
          title="Delete sale record?"
          message={
            <>
              You are about to delete <span className="font-bold text-ink">{deleteConfirm.title}</span>. This can't be undone.
            </>
          }
          confirmText="Delete"
        />
      )}

      {selectedOrder && (
        <Modal title="Order details" subtitle={`ID: ${selectedOrder._id}`} onClose={() => setSelectedOrder(null)}>
          <div className="space-y-7 p-6">
            {/* Vehicle */}
            <section aria-labelledby="od-vehicle">
              <h3 id="od-vehicle" className="mb-3 flex items-center gap-2 border-b border-neutral-200 pb-2 text-sm font-semibold">
                <Car size={16} aria-hidden="true" /> Vehicle
              </h3>
              <div className="flex flex-col gap-5 sm:flex-row">
                <div className="aspect-video w-full overflow-hidden rounded-xl bg-mist-deep sm:w-52 sm:shrink-0">
                  {selectedOrder.carId?.images?.[0] && (
                    <img src={getImageUrl(selectedOrder.carId.images[0])} alt="" className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-lg font-bold">{carName(selectedOrder)}</p>
                  <p className="text-sm text-gray-600">
                    {selectedOrder.carId?.year} {selectedOrder.carId?.fuelType ? `· ${label(selectedOrder.carId.fuelType)}` : ""}
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <DetailBox label="Transmission" value={label(selectedOrder.carId?.transmission) || "N/A"} />
                    <DetailBox label="Color" value={selectedOrder.carId?.color || "N/A"} />
                  </div>
                </div>
              </div>
            </section>

            <div className="grid gap-7 md:grid-cols-2">
              {/* Buyer */}
              <section aria-labelledby="od-buyer">
                <h3 id="od-buyer" className="mb-3 flex items-center gap-2 border-b border-neutral-200 pb-2 text-sm font-semibold">
                  <User size={16} aria-hidden="true" /> Buyer
                </h3>
                <div className="space-y-3">
                  <DetailBox label="Full name" value={buyerName(selectedOrder)} />
                  <DetailBox label="Email" value={selectedOrder.userId?.Email || "N/A"} />
                  <DetailBox label="Phone" value={selectedOrder.customerDetails?.phone || selectedOrder.userId?.Phone || "N/A"} />
                </div>
              </section>

              {/* Delivery */}
              <section aria-labelledby="od-delivery">
                <h3 id="od-delivery" className="mb-3 flex items-center gap-2 border-b border-neutral-200 pb-2 text-sm font-semibold">
                  <MapPin size={16} aria-hidden="true" /> Delivery address
                </h3>
                {selectedOrder.customerDetails?.address ? (
                  <div className="rounded-lg border border-neutral-200 bg-mist p-4 text-sm leading-relaxed">
                    <p className="font-semibold">{selectedOrder.customerDetails.address}</p>
                    <p className="text-gray-700">
                      {selectedOrder.customerDetails.city}, {selectedOrder.customerDetails.zipCode}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">No delivery address recorded.</p>
                )}
              </section>
            </div>

            {/* Payment */}
            <section aria-labelledby="od-payment">
              <h3 id="od-payment" className="mb-3 flex items-center gap-2 border-b border-neutral-200 pb-2 text-sm font-semibold">
                <CreditCard size={16} aria-hidden="true" /> Payment
              </h3>
              <dl className="grid grid-cols-2 gap-5 rounded-xl border border-neutral-200 bg-mist p-5 md:grid-cols-4">
                <div>
                  <dt className="text-xs font-medium text-gray-600">Amount</dt>
                  <dd className="mt-1 text-lg font-bold">{formatINR(selectedOrder.amount)}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-gray-600">Status</dt>
                  <dd className="mt-1">
                    <StatusBadge status={selectedOrder.status} />
                  </dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-xs font-medium text-gray-600">Transaction ID</dt>
                  <dd className="mt-1 truncate font-mono text-sm" title={selectedOrder.paymentDetails?.transactionId}>
                    {selectedOrder.paymentDetails?.transactionId || "N/A"}
                  </dd>
                </div>
              </dl>
            </section>
          </div>
        </Modal>
      )}
    </DealerLayout>
  );
};

export default DealerSoldInventory;

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Mail, Phone, Trash2, Search, MessageSquare, RotateCcw } from "lucide-react";
import DealerLayout from "../../components/common/DealerLayout";
import TableCard, { Th, THEAD_CLASS, TBODY_CLASS } from "../../components/common/TableCard";
import EmptyState from "../../components/common/EmptyState";
import Modal from "../../components/common/Modal";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import { useToast } from "../../context/ToastContext";
import api from "../../config/server";
import { timeAgo } from "../../utils/format";

const formatDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

const LONG_MESSAGE = 90;
const vehicleName = (item) => (item.carId ? `${item.carId.brand} ${item.carId.model}` : "Removed vehicle");
const mailto = (item) =>
  `mailto:${item.email}?subject=${encodeURIComponent(`Re: your enquiry about the ${vehicleName(item)}`)}`;

// Name with email and phone underneath, each icon in the same fixed-size box
const ContactLines = ({ item }) => (
  <div className="min-w-0">
    <p className="truncate font-semibold">{item.name}</p>
    <p className="mt-1 flex items-center gap-2 text-xs text-gray-700">
      <Mail size={14} aria-hidden="true" />
      <span className="truncate">{item.email}</span>
    </p>
    {item.phone && (
      <p className="mt-0.5 flex items-center gap-2 text-xs text-gray-700">
        <Phone size={14} aria-hidden="true" />
        <a href={`tel:${item.phone}`} className="underline-offset-2 hover:underline">
          {item.phone}
        </a>
      </p>
    )}
  </div>
);

const Avatar = ({ name }) => (
  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand font-bold" aria-hidden="true">
    {name?.charAt(0)?.toUpperCase() || "?"}
  </span>
);

const DealerEnquiries = () => {
  const { showToast } = useToast();
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [reading, setReading] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null, name: "" });

  const fetchEnquiries = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await api.get("/dealer/get-enquiries");
      setEnquiries(Array.isArray(res.data.enquiries) ? res.data.enquiries : []);
    } catch (err) {
      console.error("Error fetching enquiries:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEnquiries();
  }, [fetchEnquiries]);

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return enquiries;
    return enquiries.filter(
      (item) =>
        item.name?.toLowerCase().includes(q) ||
        item.carId?.model?.toLowerCase().includes(q) ||
        item.carId?.brand?.toLowerCase().includes(q)
    );
  }, [enquiries, searchTerm]);

  const handleDelete = async () => {
    const { id } = deleteConfirm;
    try {
      const res = await api.delete(`/dealer/delete-enquiry/${id}`);
      if (res.data.success) {
        setEnquiries((prev) => prev.filter((item) => item._id !== id));
        setReading((cur) => (cur?._id === id ? null : cur));
        showToast("Enquiry deleted");
      }
    } catch (err) {
      console.error("Error deleting enquiry:", err);
      showToast("Failed to delete enquiry. Please try again.", "error");
    } finally {
      setDeleteConfirm({ show: false, id: null, name: "" });
    }
  };

  const askDelete = (item) => setDeleteConfirm({ show: true, id: item._id, name: item.name });

  // Message text, shortened with a "Read more" button when long
  const renderMessage = (item) => {
    const text = item.message || "No message provided.";
    const long = text.length > LONG_MESSAGE;
    return (
      <div className="flex items-start gap-2">
        <MessageSquare size={14} className="mt-1 text-gray-500" aria-hidden="true" />
        <div className="min-w-0 text-sm text-gray-700">
          <p className="line-clamp-2 leading-relaxed">{text}</p>
          {long && (
            <button type="button" onClick={() => setReading(item)} className="mt-1 text-xs font-semibold underline underline-offset-2 hover:text-ink">
              Read more
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderBody = () => {
    if (loading) return <div className="card animate-pulse p-16 text-center text-gray-600">Loading enquiries…</div>;
    if (error) {
      return (
        <div className="card">
          <EmptyState icon={RotateCcw} title="Couldn't load your enquiries" hint="Please check your connection and try again.">
            <button type="button" onClick={fetchEnquiries} className="btn btn-brand">
              Try again
            </button>
          </EmptyState>
        </div>
      );
    }
    if (enquiries.length === 0) {
      return (
        <div className="card">
          <EmptyState icon={MessageSquare} title="No enquiries yet" hint="They'll show up here when a customer messages you about one of your cars." />
        </div>
      );
    }
    if (filtered.length === 0) {
      return (
        <div className="card">
          <EmptyState icon={Search} title="No enquiries match your search">
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
          {filtered.map((item) => (
            <li key={item._id} className="card p-4">
              <div className="flex items-start gap-3">
                <Avatar name={item.name} />
                <ContactLines item={item} />
              </div>
              <p className="mt-3 text-sm">
                <span className="text-gray-600">About: </span>
                <span className="font-semibold">{vehicleName(item)}</span>
              </p>
              <div className="mt-2">
                {renderMessage(item)}
              </div>
              <p className="mt-3 text-xs text-gray-600">
                {formatDate(item.createdAt)} · {timeAgo(item.createdAt)}
              </p>
              <div className="mt-3 flex gap-2 border-t border-neutral-100 pt-3">
                <a href={mailto(item)} className="btn btn-brand btn-sm flex-1">
                  <Mail size={16} aria-hidden="true" /> Reply by email
                </a>
                <button type="button" onClick={() => askDelete(item)} className="icon-btn hover:!bg-red-50 hover:!text-red-700" aria-label={`Delete enquiry from ${item.name}`}>
                  <Trash2 size={18} aria-hidden="true" />
                </button>
              </div>
            </li>
          ))}
        </ul>

        {/* Tablet and up */}
        <div className="hidden md:block">
          <TableCard>
            <thead className={THEAD_CLASS}>
              <tr>
                <Th>Customer</Th>
                <Th>Vehicle</Th>
                <Th>Message</Th>
                <Th>Received</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>
            <tbody className={TBODY_CLASS}>
              {filtered.map((item) => (
                <tr key={item._id} className="align-top transition-colors hover:bg-mist">
                  <td className="px-5 py-4">
                    <div className="flex items-start gap-3">
                      <Avatar name={item.name} />
                      <ContactLines item={item} />
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm font-semibold">{vehicleName(item)}</td>
                  <td className="max-w-xs px-5 py-4">
                    {renderMessage(item)}
                  </td>
                  <td className="px-5 py-4 text-sm">
                    <p>{formatDate(item.createdAt)}</p>
                    <p className="text-xs text-gray-600">{timeAgo(item.createdAt)}</p>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <a href={mailto(item)} className="btn btn-brand btn-sm">
                        <Mail size={16} aria-hidden="true" /> Reply
                      </a>
                      <button type="button" onClick={() => askDelete(item)} className="icon-btn hover:!bg-red-50 hover:!text-red-700" aria-label={`Delete enquiry from ${item.name}`} title="Delete">
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
        <h1 className="text-2xl font-bold">Customer enquiries</h1>
        <p className="mt-1 text-sm text-gray-600">
          {loading ? "Loading…" : `${enquiries.length} ${enquiries.length === 1 ? "enquiry" : "enquiries"} from potential buyers.`}
        </p>
      </div>

      <div className="card mb-5 p-4">
        <div className="relative">
          <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" aria-hidden="true" />
          <label htmlFor="enq-search" className="sr-only">
            Search by customer or vehicle
          </label>
          <input
            id="enq-search"
            type="search"
            placeholder="Search by customer or vehicle…"
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
          onClose={() => setDeleteConfirm({ show: false, id: null, name: "" })}
          onConfirm={handleDelete}
          title="Delete enquiry?"
          message={
            <>
              You are about to delete the enquiry from <span className="font-bold text-ink">{deleteConfirm.name}</span>. This can't be undone.
            </>
          }
          confirmText="Delete"
        />
      )}

      {reading && (
        <Modal title={reading.name} subtitle={`About the ${vehicleName(reading)} · ${timeAgo(reading.createdAt)}`} onClose={() => setReading(null)} size="max-w-lg">
          <div className="space-y-5 p-6">
            <p className="whitespace-pre-line leading-relaxed">{reading.message}</p>
            <div className="flex flex-wrap gap-3 border-t border-neutral-200 pt-5">
              <a href={mailto(reading)} className="btn btn-brand">
                <Mail size={18} aria-hidden="true" /> Reply by email
              </a>
              {reading.phone && (
                <a href={`tel:${reading.phone}`} className="btn btn-light">
                  <Phone size={18} aria-hidden="true" /> Call
                </a>
              )}
            </div>
          </div>
        </Modal>
      )}
    </DealerLayout>
  );
};

export default DealerEnquiries;

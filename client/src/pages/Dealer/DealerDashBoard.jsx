import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useNavigate } from "react-router-dom";
import { Car, IndianRupee, TrendingUp, Plus, FileText, CheckCircle2, MessageSquare, Loader2 } from "lucide-react";
import DealerLayout from "../../components/common/DealerLayout";
import StatCard from "../../components/Dashboard/StateCard";
import AddCarForm from "../../components/Details/AddCarForm";
import { useToast } from "../../context/ToastContext";
import api from "../../config/server";

const DealerDashboard = () => {
  const navigate = useNavigate();
  const [ShowAddVehicleform, setShowAddVehicleform] = useState(false);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalProfit: 0,
    totalCarsSold: 0,
    activeInventory: 0,
    totalEnquiries: 0
  });
  const [statsLoaded, setStatsLoaded] = useState(false);
  const [salesData, setSalesData] = useState([]);
  const [loadingReport, setLoadingReport] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, soldRes] = await Promise.all([
          api.get('/dealer/get-dashboard-stats'),
          api.get('/dealer/get-sold-cars')
        ]);

        if (statsRes.data.success) {
          setStats(statsRes.data.stats);
        }

        if (soldRes.data.success) {
          processSalesData(soldRes.data.orders);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
        showToast("Couldn't load your dashboard numbers. Please refresh.", "error");
      } finally {
        setStatsLoaded(true);
      }
    };
    fetchData();
  }, [refreshKey, showToast]);

  const processSalesData = (orders) => {
    const lastSixMonths = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      lastSixMonths.push({
        month: d.toLocaleString('default', { month: 'short' }),
        fullDate: d,
        count: 0
      });
    }

    orders.forEach(order => {
      const orderDate = new Date(order.createdAt);
      const monthItem = lastSixMonths.find(m =>
        m.fullDate.getMonth() === orderDate.getMonth() &&
        m.fullDate.getFullYear() === orderDate.getFullYear()
      );
      if (monthItem) {
        monthItem.count += 1;
      }
    });

    setSalesData(lastSixMonths);
  };

  const handleGenerateReport = async () => {
    setLoadingReport(true);
    try {
      const [inventoryRes, soldRes] = await Promise.all([
        api.get('/dealer/get-inventory'),
        api.get('/dealer/get-sold-cars')
      ]);

      if (inventoryRes.data.success && soldRes.data.success) {
        generatePDF(inventoryRes.data.cars, soldRes.data.orders);
      }
    } catch (error) {
      console.error("Failed to generate report", error);
      showToast("Failed to generate report. Please try again.", "error");
    } finally {
      setLoadingReport(false);
    }
  };

  const generatePDF = (inventory, orders) => {
    const doc = new jsPDF();

    // Calculate Summaries
    const totalInventory = inventory.length;
    const totalSold = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + (order.amount || 0), 0);
    const totalProfit = stats.totalProfit;
    // Logo
    doc.setFontSize(24);
    doc.setTextColor(37, 99, 235);
    doc.setFont("helvetica", "bold");
    doc.text("Carverse", 14, 20);

    // Title
    doc.setFontSize(16);
    doc.setTextColor(40);
    doc.setFont("helvetica", "normal");
    doc.text("Dealer Performance Report", 14, 30);

    // Date
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 36);

    // Summary Section
    doc.setDrawColor(220);
    doc.line(14, 40, 196, 40);

    doc.setFontSize(12);
    doc.setTextColor(60);
    doc.text("Performance Summary:", 14, 48);

    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.text(`Total Inventory: ${totalInventory}`, 14, 55);
    doc.text(`Total Sales: ${totalSold}`, 50, 55);
    doc.text(`Total Revenue: Rs. ${totalRevenue.toLocaleString('en-IN')}`, 80, 55);
    doc.text(`Total Profit: Rs.${totalProfit.toLocaleString('en-IN')}`, 150, 55)
    doc.line(14, 61, 196, 61);

    // Section 1: Inventory
    doc.setFontSize(14);
    doc.setTextColor(40);
    doc.text("Current Inventory", 14, 70);

    const inventoryColumns = ["Model", "Brand", "Year", "Price", "Color", "Fuel Type", "status"];
    const inventoryRows = inventory.map(car => [
      car.model,
      car.brand,
      car.year,
      `Rs. ${car.price.toLocaleString('en-IN')}`,
      car.color,
      car.fuelType,
      car.status
    ]);

    autoTable(doc, {
      startY: 75,
      head: [inventoryColumns],
      body: inventoryRows,
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235] },
      styles: { fontSize: 10 },
    });

    const finalY = doc.lastAutoTable.finalY || 50;

    doc.setFontSize(14);
    doc.setTextColor(40);
    doc.text("Sales History", 14, finalY + 15);

    const salesColumns = ["Date", "Car", "Customer Name", "Amount"];
    const salesRows = orders.map(order => {
      const carName = order.carId ? `${order.carId.brand} ${order.carId.model}` : 'Deleted Car';
      const customerName = order.userId ? order.userId.Name : 'Unknown';
      const date = new Date(order.createdAt).toLocaleDateString();
      return [
        date,
        carName,
        customerName,
        `Rs. ${order.amount ? order.amount.toLocaleString('en-IN') : 0}`
      ];
    });

    autoTable(doc, {
      startY: finalY + 20,
      head: [salesColumns],
      body: salesRows,
      theme: 'grid',
      headStyles: { fillColor: [22, 163, 74] },
      styles: { fontSize: 10 },
    });

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text('Page ' + i + ' of ' + pageCount, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, { align: 'center' });
    }

    doc.save(`Dealer_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const formatCurrency = (num) => {
    if (!num) return '0';
    if (num >= 10000000) return (num / 10000000).toFixed(1) + 'Cr';
    if (num >= 100000) return (num / 100000).toFixed(1) + 'L';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toLocaleString('en-IN');
  };

  // Highlights for the text summary under the chart
  const totalSalesShown = salesData.reduce((sum, d) => sum + d.count, 0);
  const bestCount = Math.max(...salesData.map((d) => d.count), 0);
  const bestMonths = salesData.filter((d) => d.count === bestCount);
  const chartMax = Math.max(...salesData.map((d) => d.count), 4);
  const dash = <span className="inline-block h-8 w-20 animate-pulse rounded bg-mist-deep align-middle" aria-label="Loading" />;

  return (
    <>
      <DealerLayout>
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dealer dashboard</h1>
            <p className="mt-1 text-gray-600">A snapshot of your dealership's performance and key tasks.</p>
          </div>
          <button type="button" onClick={() => setShowAddVehicleform(true)} className="btn btn-brand self-start sm:self-auto">
            <Plus size={18} aria-hidden="true" /> Add vehicle
          </button>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Vehicles in inventory" value={statsLoaded ? stats.activeInventory : dash} icon={Car} color="blue" />
          <StatCard title="Total revenue" value={statsLoaded ? `₹${formatCurrency(stats.totalRevenue)}` : dash} icon={IndianRupee} color="green" />
          <StatCard title="Total profit" value={statsLoaded ? `₹${formatCurrency(stats.totalProfit)}` : dash} icon={TrendingUp} color="green" />
          <StatCard title="Cars sold" value={statsLoaded ? stats.totalCarsSold : dash} icon={CheckCircle2} color="purple" />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Sales chart */}
          <section className="card flex min-h-[380px] flex-col p-6 lg:col-span-2" aria-labelledby="sales-chart-title">
            <div className="mb-6 flex items-center justify-between gap-4">
              <h2 id="sales-chart-title" className="text-lg font-semibold">
                Monthly sales
              </h2>
              <span className="flex items-center gap-2 text-sm text-gray-600">
                <span className="h-3 w-3 rounded-full bg-brand" aria-hidden="true" /> Cars sold, last 6 months
              </span>
            </div>

            {salesData.length > 0 ? (
              <>
                <div className="flex flex-1 items-end justify-between gap-3 border-b border-neutral-200 px-1 pb-0 sm:gap-5" role="img" aria-label={`Bar chart of cars sold per month. ${totalSalesShown} sold in the last six months.`}>
                  {salesData.map((data) => {
                    // Bar height in px so the count label can sit right on top of its bar
                    const barHeight = Math.max(Math.round((data.count / chartMax) * 200), 6);
                    return (
                      <div key={data.month + data.fullDate} className="flex h-60 flex-1 flex-col items-center justify-end">
                        <span className="mb-1 text-sm font-semibold tabular-nums">{data.count}</span>
                        <div
                          style={{ height: `${barHeight}px` }}
                          className={`w-full max-w-[44px] rounded-t-md transition-all duration-300 ${data.count > 0 ? "bg-brand" : "bg-mist-deep"}`}
                        />
                      </div>
                    );
                  })}
                </div>
                <div className="mt-2 flex justify-between gap-3 px-1 sm:gap-5" aria-hidden="true">
                  {salesData.map((data) => (
                    <span key={data.month + data.fullDate} className="flex-1 text-center text-xs font-medium text-gray-600">
                      {data.month}
                    </span>
                  ))}
                </div>
                <p className="mt-5 text-sm text-gray-700">
                  {totalSalesShown === 0
                    ? "No sales in the last six months yet."
                    : `${totalSalesShown} ${totalSalesShown === 1 ? "car" : "cars"} sold in the last six months. ${
                        bestMonths.length === 1
                          ? `Best month: ${bestMonths[0].month} (${bestMonths[0].count}).`
                          : `Best months: ${bestMonths.map((d) => d.month).join(", ")} (${bestMonths[0].count} each).`
                      }`}
                </p>
              </>
            ) : (
              <div className="flex-1 animate-pulse rounded-lg bg-mist" aria-label="Loading chart" />
            )}
          </section>

          {/* Quick actions */}
          <section className="card p-6" aria-labelledby="quick-actions-title">
            <h2 id="quick-actions-title" className="mb-4 text-lg font-semibold">
              Quick actions
            </h2>
            <div className="space-y-3">
              <button type="button" onClick={() => setShowAddVehicleform(true)} className="btn btn-brand w-full">
                <Plus size={18} aria-hidden="true" /> Add new vehicle
              </button>
              <button type="button" onClick={() => navigate("/dealer/enquiries")} className="btn btn-light w-full">
                <MessageSquare size={18} aria-hidden="true" /> View enquiries
              </button>
              <button type="button" onClick={handleGenerateReport} disabled={loadingReport} className="btn btn-light w-full">
                {loadingReport ? <Loader2 size={18} className="animate-spin" aria-hidden="true" /> : <FileText size={18} aria-hidden="true" />}
                {loadingReport ? "Generating…" : "Generate report"}
              </button>
            </div>
          </section>
        </div>
      </DealerLayout>

      {ShowAddVehicleform && (
        <AddCarForm
          onClose={() => setShowAddVehicleform(false)}
          onAdded={() => setRefreshKey((k) => k + 1)}
        />
      )}
    </>
  );
};

export default DealerDashboard;

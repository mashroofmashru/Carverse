import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useNavigate } from "react-router-dom";
import {
  Car,
  Users2,
  DollarSign,
  Plus,
  PhoneCall,
  FileText,
  CheckCircle,
  Download,
} from "lucide-react";
import Header from "../../components/common/Header";
import SideBar from "../../components/common/SideBar";
import AddCarForm from "../../components/Details/AddCarForm";
import api from "../../config/server";
import { DEALER_LINKS } from "../../constants/Links";

const DealerDashboard = () => {
  const navigate = useNavigate();
  const [ShowAddVehicleform, setShowAddVehicleform] = useState(false);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalCarsSold: 0,
    activeInventory: 0,
    totalEnquiries: 0
  });
  const [salesData, setSalesData] = useState([]);
  const [loadingReport, setLoadingReport] = useState(false);

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
      }
    };
    fetchData();
  }, []);

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
      alert("Failed to generate report. Please try again.");
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

    // Logo
    doc.setFontSize(24);
    doc.setTextColor(37, 99, 235);
    doc.setFont("helvetica", "bold");
    doc.text("AutoNext", 14, 20);

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
    doc.text(`Total Sales: ${totalSold}`, 80, 55);
    doc.text(`Total Revenue: Rs. ${totalRevenue.toLocaleString('en-IN')}`, 140, 55);

    doc.line(14, 61, 196, 61);

    // Section 1: Inventory
    doc.setFontSize(14);
    doc.setTextColor(40);
    doc.text("Current Inventory", 14, 70);

    const inventoryColumns = ["Model", "Brand", "Year", "Price", "Color", "Fuel Type"];
    const inventoryRows = inventory.map(car => [
      car.model,
      car.brand,
      car.year,
      `Rs. ${car.price.toLocaleString('en-IN')}`,
      car.color,
      car.fuelType
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
      headStyles: { fillColor: [22, 163, 74] }, // Green color for sales
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

  return (
    <>
      <style>{`
        .font-inter { font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
        .text-primary { color: #2563eb; }
        .bg-primary { background-color: #2563eb; }
        .hover\\:bg-primary-dark:hover { background-color: #1d4ed8; }
        .shadow-primary { box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.1), 0 4px 6px -2px rgba(37, 99, 235, 0.05); }
      `}</style>

      <div className="bg-gray-50 font-inter min-h-screen flex flex-col">
        <Header title={"Dealer Control Center"} />
        <div id="dashboard-layout" className="flex min-h-[calc(100vh-4rem)]">
          <SideBar links={DEALER_LINKS} />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
              Dealer Dashboard
            </h1>
            <p className="text-gray-500 mb-8">
              Here is a snapshot of your dealership performance and key tasks.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Inventory
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.activeInventory}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full text-primary">
                  <Car className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Enquiries
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalEnquiries}</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full text-yellow-600">
                  <Users2 className="w-6 h-6" />
                </div>
              </div>

              {/* KPI Card 3: Total Revenue */}
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Revenue
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">₹{stats.totalRevenue.toLocaleString('en-IN')}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full text-green-600">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>

              {/* KPI Card 4: Cars Sold */}
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Cars Sold
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalCarsSold}</p>
                </div>
                <div className="p-3 bg-red-100 rounded-full text-red-600">
                  <CheckCircle className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Main Dashboard Sections Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2/3: Activity & Chart */}
              <div className="lg:col-span-2 space-y-6">

                {/* Sales Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 min-h-[400px] flex flex-col">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Monthly Sales Performance
                    </h2>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                      <span>Cars Sold</span>
                    </div>
                  </div>

                  <div className="flex-1 flex items-end justify-between space-x-4 px-4 pb-2 border-b border-gray-100">
                    {salesData.length > 0 ? (
                      salesData.map((data, index) => {
                        // Calculate height percentage, max assumed 10 for basic scaling, or dynamic
                        const maxVal = Math.max(...salesData.map(d => d.count), 5); // Minimum 5 for scale
                        const height = Math.max((data.count / maxVal) * 100, 5); // Min 5% height

                        return (
                          <div key={index} className="flex flex-col items-center flex-1 group">
                            <div className="relative w-full flex items-end justify-center h-64">
                              <div
                                style={{ height: `${height}%` }}
                                className="w-full max-w-[40px] bg-blue-100 rounded-t-lg group-hover:bg-primary transition-all duration-300 relative"
                              >
                                <div className="hidden group-hover:block absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded shadow-lg pointer-events-none whitespace-nowrap z-10">
                                  {data.count} Sales
                                </div>
                              </div>
                            </div>
                            <span className="mt-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                              {data.month}
                            </span>
                          </div>
                        );
                      })
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        Loading chart data...
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right 1/3: Quick Actions & Inventory */}
              <div className="lg:col-span-1 space-y-6">
                {/* Quick Actions Card */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Quick Actions
                  </h2>
                  <div className="space-y-3">
                    <button onClick={() => setShowAddVehicleform(true)} className="w-full flex items-center justify-center py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition shadow-md shadow-blue-200/50">
                      <Plus className="w-5 h-5 mr-2" />
                      Add New Vehicle{ShowAddVehicleform}
                    </button>
                    <button
                      onClick={() => navigate('/dealer/enquiries')}
                      className="w-full flex items-center justify-center py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition"
                    >
                      <PhoneCall className="w-5 h-5 mr-2" />
                      Contact Next Lead
                    </button>
                    <button
                      onClick={handleGenerateReport}
                      disabled={loadingReport}
                      className="w-full flex items-center justify-center py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loadingReport ? (
                        <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                      ) : (
                        <FileText className="w-5 h-5 mr-2" />
                      )}

                      {loadingReport ? 'Generating...' : 'Generate Report'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      {ShowAddVehicleform && (<AddCarForm onClose={() => setShowAddVehicleform(false)} />)}
    </>
  );
};

export default DealerDashboard;

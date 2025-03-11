import Layout from '../../../components/layout';
import { FaBuilding, FaUsers, FaChartPie, FaRulerCombined, FaFileExcel, FaFilePdf } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useState } from 'react';


export default function OccupancyPage({ tenants }) {
  const [selectedDate, setSelectedDate] = useState('');
  // Separate occupied and vacant tenants
  const occupiedTenants = tenants.filter(tenant => tenant.tenantName.toLowerCase() !== 'vacant');
  const vacantTenants = tenants.filter(tenant => tenant.tenantName.toLowerCase() === 'vacant');

  // Calculate occupied area (excluding vacant spaces)
  const totalOccupiedArea = occupiedTenants.reduce((sum, tenant) => sum + tenant.totalAreaSq, 0);
  // Calculate vacant area
  const totalVacantArea = vacantTenants.reduce((sum, tenant) => sum + tenant.totalAreaSq, 0);
  // Compute total building area
  const totalBuildingArea = totalOccupiedArea + totalVacantArea -5;

  // Compute total occupied percentage
  const totalOccupiedPercentage = ((totalOccupiedArea / totalBuildingArea) * 100).toFixed(2);
  // Compute total vacant percentage
  const totalVacantPercentage = ((totalVacantArea / totalBuildingArea) * 100).toFixed(2);


  // 🔹 Function to Export to Excel
  const exportToExcel = () => {
    const data = tenants.map(tenant => ({
      Floor: tenant.area.map(area => area.floor).join(', ') || '—',
      'Occupied By': tenant.tenantName,
      'Occupied Area (sq ft)': tenant.totalAreaSq,
      '%': tenant.tenantName.toLowerCase() === 'vacant'
        ? '—'
        : ((tenant.totalAreaSq / totalOccupiedArea) * 100).toFixed(2) + '%',
    }));
  
    // Add total row
    data.push(
      { Floor: 'Total', 'Occupied By': '—', 'Occupied Area (sq ft)': totalBuildingArea, '%': `${totalOccupiedPercentage}%` },
      { Floor: 'Vacant Space', 'Occupied By': '—', 'Occupied Area (sq ft)': totalVacantArea, '%': `${totalVacantPercentage}%` }
    );
  
    // Convert JSON to Excel
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Occupancy Data');
  
    // Save Excel file (no need for file-saver)
    XLSX.writeFile(wb, 'Occupancy_Report.xlsx');
  };
  

  // 🔹 Function to Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Occupancy Report', 14, 15);

    // Define table data
    const tableData = tenants.map(tenant => [
      tenant.area.map(area => area.floor).join(', ') || '—',
      tenant.tenantName,
      tenant.totalAreaSq.toLocaleString(),
      tenant.tenantName.toLowerCase() === 'vacant'
        ? '—'
        : ((tenant.totalAreaSq / totalOccupiedArea) * 100).toFixed(2) + '%',
    ]);

    // Add total row
    tableData.push(
      ['Total', '—', totalBuildingArea.toLocaleString(), `${totalOccupiedPercentage}%`],
      ['Vacant Space', '—', totalVacantArea.toLocaleString(), `${totalVacantPercentage}%`]
    );

    doc.autoTable({
      head: [['Floor', 'Occupied By', 'Occupied Area (sq ft)', '%']],
      body: tableData,
      startY: 20,
      theme: 'striped',
    });

    doc.save('Occupancy_Report.pdf');
  };

  const [selectedTenant, setSelectedTenant] = useState(tenants[0]?.tenantName || '');
  
  const selectedTenantData = tenants.find(t => t.tenantName === selectedTenant);
  const tenantPercentage = selectedTenantData ? ((selectedTenantData.totalAreaSq / totalBuildingArea) * 100).toFixed(2) : '0';
  // 🔹 Function to Export Selected tenant to PDF
  const exportSelectedTenantPDF = () => {
    const doc = new jsPDF();
    doc.text(`Occupancy Status - ${selectedTenant}`, 50, 15);
    
    
    const tableData = [
      [selectedTenant, selectedTenantData?.totalAreaSq.toLocaleString() || '—', `${tenantPercentage}%`],
      ['Service/Cafeteria', '1,947', '—']
    ];
    
    doc.autoTable({
      head: [['Name', 'Sqft', 'Total %']],
      body: tableData,
      startY: 25,
    });
    if (selectedTenant === "Saudi Pak Real State Limited" || selectedTenant ===  "Saudi Pak Ind. & Agr. Inv. Co. Ltd.") {
      const summaryData = [
        ['Total Occupied Area', totalOccupiedArea.toLocaleString()],
        ['Total Rented Area', totalBuildingArea.toLocaleString()],
        ['Total Vacant Area', totalVacantArea.toLocaleString()],
        ['Occupancy (%)', `${totalOccupiedPercentage}%`]
      ];
      doc.autoTable({
        head: [['Saudi Pak', 'Details']],
        body: summaryData,
        startY: doc.autoTable.previous.finalY + 10,
      });
    }
    
    
    if (selectedTenantData && selectedTenantData.area.length) {
      const tenantDetailTable = selectedTenantData.area.map(area => [area.floor, area.occupiedArea.toLocaleString()]);
      tenantDetailTable.push(['TOTAL', selectedTenantData.totalAreaSq.toLocaleString()]);

      doc.autoTable({
        head: [['FLOOR No.', 'AREA (Sqft)']],
        body: tenantDetailTable,
        startY: doc.autoTable.previous.finalY + 10,
      });
    }
    
    doc.save(`Occupancy_Report_${selectedTenant}.pdf`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: '2-digit' };
    return date.toLocaleDateString('en-US', options).replace(',', '');
  };

  const exportPDF = () => {
    if (!selectedDate) {
      alert('Please select a date');
      return;
    }

     const formattedDate = formatDate(selectedDate);
    const doc = new jsPDF({ orientation: 'portrait' });
    const title = `OCCUPANCY STATUS OF HEAD OFFICE BUILDING AS ON ${formattedDate}`;
    doc.setFontSize(14);
    doc.text(title, 20, 15);

    const saudiPakTenant = tenants.find(t => t.tenantName.toLowerCase() === 'saudi pak ind. & agr. inv. co. ltd.' );
    const vacantTenants = tenants.filter(t => t.tenantName.toLowerCase() === 'vacant');
    const occupiedTenants = tenants.filter(t => t.tenantName.toLowerCase() !== 'vacant');

    const RentableArea = tenants.reduce((sum, t) => sum + t.totalAreaSq, 0);
    const totalRentableArea = RentableArea + 1947 -5 ;
    const totalVacantArea = vacantTenants.reduce((sum, t) => sum + t.totalAreaSq, 0);
    const totalOccupiedArea = totalRentableArea - totalVacantArea;
    const occupiedBySaudiPak = saudiPakTenant ? saudiPakTenant.totalAreaSq : 0;
    const rentedToTenants = totalOccupiedArea - occupiedBySaudiPak - 1947 ;
    const occupancyPercentage = ((totalOccupiedArea / totalRentableArea) * 100).toFixed(2);
    const serviceCafeteria = 1947;
    const totalArea = totalRentableArea + serviceCafeteria;

    doc.autoTable({
      head: [[
        { content: 'Rentable Area (Sqft)', colSpan: 2, styles: { halign: 'center' } },
        { content: 'Service/Cafeteria', colSpan: 1, styles: { halign: 'center' } },
        { content: 'Total Occupied Area', colSpan: 1, styles: { halign: 'center' } }, 
        { content: 'Total Rentable Area', colSpan: 1, styles: { halign: 'center' } },
        { content: 'Vacant Area', colSpan: 1, styles: { halign: 'center' } },
        { content: 'Occupancy', colSpan: 1, styles: { halign: 'center' } }
      ], [
        { content: 'Rented to the Tenants', styles: { halign: 'center' } }, 
        { content: 'Occupied by Saudi Pak', styles: { halign: 'center' } }, 
        { content: '(Sqft)', styles: { halign: 'center' } }, 
        { content: '(Sqft)', styles: { halign: 'center' } }, 
        { content: '(Sqft)', styles: { halign: 'center' } }, 
        { content: '(Sqft)', styles: { halign: 'center' } }, 
        { content: '( % )', styles: { halign: 'center' } }, 
        '(Sqft)', '(Sqft)', '(Sqft)', '(Sqft)', '( % )'
      ]],
      body: [[
        rentedToTenants.toLocaleString(),
        occupiedBySaudiPak.toLocaleString(),
        serviceCafeteria.toLocaleString(),
        totalOccupiedArea.toLocaleString(),
        totalRentableArea.toLocaleString(),  
        totalVacantArea.toLocaleString(),
        `${occupancyPercentage} %`
      ]],
      startY: 25,
      theme: 'grid',
      styles: { halign: 'center', cellPadding: 2 },
      columnStyles: { 0: { cellWidth: 25 }, 1: { cellWidth: 25 }, 2: { cellWidth: 25 }, 3: { cellWidth: 25 }, 4: { cellWidth: 25 }, 5: { cellWidth: 25 }, 6: { cellWidth: 30 } }
    });

    if (saudiPakTenant && saudiPakTenant.area.length) {
      doc.text('Detail of Occupied Space by Saudi Pak Ind. & Agr. Inv. Co. Ltd.', 13, doc.autoTable.previous.finalY + 10);

      const saudiPakDetails = saudiPakTenant.area.map(area => [area.floor, area.occupiedArea.toLocaleString()]);
      saudiPakDetails.push(['TOTAL', occupiedBySaudiPak.toLocaleString()]);

      doc.autoTable({
        head: [['FLOOR No.', 'AREA (Sqft)']],
        body: saudiPakDetails,
        startY: doc.autoTable.previous.finalY + 15,
        theme: 'grid',
        styles: { halign: 'center' },
        columnStyles: { 0: { cellWidth: 40 }, 1: { cellWidth: 40 } }
      });
    }

    doc.save(`Occupancy_Report_${selectedDate}.pdf`);
  };




  return (
    <Layout>
      <div className="p-8">
        <h1 className="text-3xl font-semibold mb-6 flex items-center text-gray-800">
          <FaBuilding className="mr-3 text-gray-600" /> Occupancy Overview
        </h1>

        {/* Export Buttons */}
        <div className="mb-4 flex space-x-4">
          <button onClick={exportToExcel} className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md shadow-md hover:bg-green-700">
            <FaFileExcel className="mr-2" /> Export to Excel
          </button>
          <button onClick={exportToPDF} className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md shadow-md hover:bg-red-700">
            <FaFilePdf className="mr-2" /> Export to PDF
          </button>
        </div>

        {/* Selected Tenant Report */}
        {/* <div className="mb-4">
          <label className="text-lg font-semibold">Select Tenant:</label>
          <select
            className="ml-3 p-2 border border-gray-300 rounded-md"
            value={selectedTenant}
            onChange={(e) => setSelectedTenant(e.target.value)}
          >
            {tenants.map((tenant) => (
              <option key={tenant.id} value={tenant.tenantName}>{tenant.tenantName}</option>
            ))}
          </select>
        </div> */}
        <div className="p-4">
      <label className="text-lg font-semibold">Select Date:</label>
      <input 
        type="date" 
        value={selectedDate} 
        onChange={(e) => setSelectedDate(e.target.value)}
        className="ml-3 p-2 border border-gray-300 rounded-md"
      />
      <button 
        onClick={exportPDF} 
        className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700"
      >
        Print PDF
      </button>
    </div>

        {/* <div className="mb-4 flex space-x-4">
          <button onClick={exportSelectedTenantPDF} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700">
            <FaFilePdf className="mr-2" /> Export Selected Tenant PDF
          </button>
        </div> */}

        {/* Responsive Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 rounded-lg shadow-md">
            <thead className="bg-blue-600 text-white">
              <tr className="text-center">
                <th className="px-6 py-4 text-left">
                  <FaBuilding className="mr-2" /> Floor
                </th>
                <th className="px-6 py-4 text-left">
                  <FaUsers className="mr-2" /> Occupied By
                </th>
                <th className="px-6 py-4 text-right">
                  <FaRulerCombined className="mr-2" /> Occupied Area (sq ft)
                </th>
                <th className="px-6 py-4 text-right">
                  <FaChartPie className="mr-2" /> %
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-800">
              {tenants.length > 0 ? (
                tenants.map((tenant, index) => (
                  <tr key={index} className={`border-t ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}>
                    <td className="px-6 py-4 text-left">{tenant.area.map(area => area.floor).join(', ') || '—'}</td>
                    <td className="px-6 py-4 text-left font-semibold">{tenant.tenantName}</td>
                    <td className="px-6 py-4 text-right">{tenant.totalAreaSq.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">
                      {tenant.tenantName.toLowerCase() === 'vacant' ? '—' : ((tenant.totalAreaSq / totalOccupiedArea) * 100).toFixed(2) + '%'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                    No data available
                  </td>
                </tr>
              )}

              {/* Total Row */}
              <tr className="bg-gray-300 font-semibold border-t">
                <td className="px-6 py-4 text-left">Total</td>
                <td className="px-6 py-4 text-left">—</td>
                <td className="px-6 py-4 text-right">{totalBuildingArea.toLocaleString()}</td>
                <td className="px-6 py-4 text-right">{totalOccupiedPercentage}%</td>
              </tr>

              {/* Vacant Space Row */}
              <tr className="bg-red-200 font-semibold border-t">
                <td className="px-6 py-4 text-left">Vacant Space</td>
                <td className="px-6 py-4 text-left">—</td>
                <td className="px-6 py-4 text-right">{totalVacantArea.toLocaleString()}</td>
                <td className="px-6 py-4 text-right">{totalVacantPercentage}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  // Fetch tenant data from API
  const res = await fetch(`${process.env.BASE_URL || 'http://localhost:3000'}/api/occupancy`);
  const result = await res.json();

  return {
    props: {
      tenants: result.data || [],
    },
  };
}
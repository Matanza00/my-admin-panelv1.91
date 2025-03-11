// /pages/security-services/security-reports/edit/[id].js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../../components/layout';
 import { PrismaClient } from '@prisma/client'; // Import PrismaClient


export default function EditSecurityReport({ report }) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    date: report.date || '',
    observedBy: report.observedBy || '',
    supervisor: report.supervisor || '',
    description: report.description || '',
    action: report.action || '',
    timeNoted: report.timeNoted || '',
    timeSolved: report.timeSolved || '',
  });

  const [technicians, setTechnicians] = useState([]);
  const [supervisors, setSupervisors] = useState([]);

  useEffect(() => {
    // Fetch data for dropdowns
    const fetchDropdownData = async () => {
      try {
        const [techniciansRes, supervisorsRes] = await Promise.all([
          fetch('/api/users/filtered?roles=technician&departments=Security%20GUARD'),
          fetch('/api/users/filtered?roles=Supervisor&departments=Security'),
        ]);

        const [techniciansData, supervisorsData] = await Promise.all([
          techniciansRes.json(),
          supervisorsRes.json(),
        ]);

        setTechnicians(techniciansData || []);
        setSupervisors(supervisorsData || []);
      } catch (error) {
        console.error('Error fetching dropdown data:', error);
      }
    };

    fetchDropdownData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate and format date and time fields
      const formattedData = {
        date: formData.date,
        observedBy: parseInt(formData.observedBy),
        supervisor: parseInt(formData.supervisor),
        description: formData.description,
        action: formData.action,
        timeNoted: formData.timeNoted
          ? new Date(`${formData.date}T${formData.timeNoted}:00`).toLocaleString('en-CA', { hour12: false }).replace(',', '')
          : null,
        timeSolved: formData.timeSolved
          ? new Date(`${formData.date}T${formData.timeSolved}:00`).toLocaleString('en-CA', { hour12: false }).replace(',', '')
          : null,
      };

  
    if (isNaN(new Date(formattedData.timeNoted).getTime())) {
      alert("Invalid Time Noted. Please enter a valid time.");
      return;
    }
  
    if (formattedData.timeSolved && isNaN(new Date(formattedData.timeSolved).getTime())) {
      alert("Invalid Time Solved. Please enter a valid time.");
      return;
    }
  
    try {
      const res = await fetch(`/api/security-reports/${report.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });
  
      if (res.ok) {
        router.push('/security-services/security-reports');
      } else {
        console.error('Failed to update report');
      }
    } catch (error) {
      console.error('Error updating report:', error);
    }
  };
  

  return (
    <Layout>
      <div className="p-4">
        <h1 className="text-2xl font-semibold mb-6 text-center text-blue-600">Edit Security Report</h1>
        <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-md p-6 rounded-lg max-w-3xl mx-auto">
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Staff</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Observed By</label>
                <select
                  name="observedBy"
                  value={formData.observedBy}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                >
                  <option value="" disabled>
                    Select Observer
                  </option>
                  {technicians.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Supervisor</label>
                <select
                  name="supervisor"
                  value={formData.supervisor}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                >
                  <option value="" disabled>
                    Select Supervisor
                  </option>
                  {supervisors.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter Description"
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Action</label>
            <textarea
              name="action"
              value={formData.action}
              onChange={handleChange}
              placeholder="Enter Action Taken"
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Time Noted</label>
              <input
                type="time"
                name="timeNoted"
                value={formData.timeNoted}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Time Solved</label>
              <input
                type="time"
                name="timeSolved"
                value={formData.timeSolved}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

// Updated `getServerSideProps`
export async function getServerSideProps({ params }) {
  const prisma = new PrismaClient();

  try {
    const report = await prisma.securityreport.findUnique({
      where: { id: parseInt(params.id, 10) },
    });

    if (!report) {
      return { notFound: true };
    }

    return {
      props: {
        report: {
          id: report.id,
          date: report.date ? report.date.toISOString().split('T')[0] : '',
          timeNoted: report.timeNoted 
          ? new Date(report.timeNoted).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false }) 
          : '',
        
        timeSolved: report.timeSolved 
          ? new Date(report.timeSolved).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false }) 
          : '',
        
          observedBy: report.observedBy,
          supervisor: report.supervisor,
          description: report.description,
          action: report.action,
        },
      },
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return { notFound: true };
  } finally {
    await prisma.$disconnect();
  }
}

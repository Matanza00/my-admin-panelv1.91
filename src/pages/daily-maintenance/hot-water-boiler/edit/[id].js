import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../../components/layout';

const EditBoilerForm = () => {
  const router = useRouter();
  const { id } = router.query;
  const [formData, setFormData] = useState({
    StartTime: '',
    ShutdownTime: '',
    Remarks: '',
    OperatorName: '',
    SupervisorName: '',
    EngineerName: '',
    TimeHr: [],
  });
  const [technicians, setTechnicians] = useState([]);
  const [supervisors, setSupervisors] = useState([]);

  // Fetch boiler data and technician/supervisor lists
  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          // Fetch boiler data
          const boilerResponse = await fetch(`/api/hot-water-boiler/${id}`);
          if (boilerResponse.ok) {
            const boilerData = await boilerResponse.json();
            setFormData({
              StartTime: (() => {
                const date = new Date(boilerData.StartTime);
                return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}T${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
              })(),
              
              ShutdownTime: (() => {
                const date = new Date(boilerData.ShutdownTime);
                return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}T${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
              })(),
              Remarks: boilerData.Remarks,
              OperatorName: boilerData.OperatorName,
              SupervisorName: boilerData.SupervisorName,
              EngineerName: boilerData.EngineerName,
              TimeHr: boilerData.TimeHr.map((entry) => {
                const date = new Date(entry.time);
                return {
                  ...entry,
                  time: `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
                };
              }),
            });
          } else {
            alert('Error fetching boiler data');
          }
  
          // Fetch technicians
          const technicianResponse = await fetch(
            '/api/users/filtered?roles=Technician&departments=HVAC'
          );
          if (technicianResponse.ok) {
            const technicianData = await technicianResponse.json();
            setTechnicians(technicianData);
          }
  
          // Fetch supervisors
          const supervisorResponse = await fetch(
            '/api/users/filtered?roles=Supervisor&departments=HVAC'
          );
          if (supervisorResponse.ok) {
            const supervisorData = await supervisorResponse.json();
            setSupervisors(supervisorData);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };
  
    fetchData();
  }, [id]);
  
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleTimeHrChange = (e, index) => {
    const { name, value } = e.target;
    const updatedTimeHr = [...formData.TimeHr];
    updatedTimeHr[index][name] = value;
    setFormData((prevData) => ({ ...prevData, TimeHr: updatedTimeHr }));
  };

  const handleAddTimeHr = () => {
    setFormData((prevData) => ({
      ...prevData,
      TimeHr: [
        ...prevData.TimeHr,
        {
          time: '',
          HotWaterIn: '',
          HotWaterOut: '',
          ExhaustTemp: '',
          FurnacePressure: '',
          assistantSupervisor: '',
        },
      ],
    }));
  };

  const handleDeleteTimeHr = (index) => {
    const updatedTimeHr = formData.TimeHr.filter((_, i) => i !== index);
    setFormData((prevData) => ({ ...prevData, TimeHr: updatedTimeHr }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(`/api/hot-water-boiler/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if (response.ok) {
      alert('Boiler updated!');
      router.push(`/daily-maintenance/hot-water-boiler/view/${id}`);
    } else {
      alert('Failed to update boiler');
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-6 bg-gray-900 rounded-lg shadow-lg">
        <h2 className="text-2xl text-white font-semibold mb-6">Edit Hot Water Boiler</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {['StartTime', 'ShutdownTime'].map((field) => (
            <div key={field} className="flex flex-col">
              <label className="text-white mb-1">{field.replace(/([A-Z])/g, ' $1')}</label>
              <input
                type="datetime-local"
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="px-4 py-2 rounded-md bg-gray-800 text-white"
                required
              />
            </div>
          ))}
         <div>
  <label htmlFor="OperatorName" className="block text-sm font-medium text-gray-700">
    Operator Name
  </label>
  <select
    id="OperatorName"
    name="OperatorName"
    value={formData.OperatorName}
    onChange={handleChange}
    required
    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-800 text-white p-2"
  >
    <option value="" disabled>
      Select Operator
    </option>
    {technicians.map((tech) => (
      <option key={tech.id} value={tech.name}>
        {tech.name}
      </option>
    ))}
  </select>
</div>

<div>
  <label htmlFor="SupervisorName" className="block text-sm font-medium text-gray-700">
    Supervisor Name
  </label>
  <select
    id="SupervisorName"
    name="SupervisorName"
    value={formData.SupervisorName}
    onChange={handleChange}
    required
    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-800 text-white p-2"
  >
    <option value="" disabled>
      Select Supervisor
    </option>
    {supervisors.map((sup) => (
      <option key={sup.id} value={sup.name}>
        {sup.name}
      </option>
    ))}
  </select>
</div>

          <div className="flex flex-col">
            <label className="text-white mb-1">Remarks</label>
            <textarea
              name="Remarks"
              value={formData.Remarks}
              onChange={handleChange}
              className="px-4 py-2 rounded-md bg-gray-800 text-white"
              rows="3"
              required
            />
          </div>
          <div className="mb-4">
            <h3 className="text-white mb-2">Time Hours</h3>
            {formData.TimeHr.map((entry, index) => (
              <div key={index} className="grid grid-cols-7 gap-2 mb-2">
                {['time', 'HotWaterIn', 'HotWaterOut', 'ExhaustTemp', 'FurnacePressure', 'assistantSupervisor'].map(
                  (field) => (
                    <input
                      key={field}
                      type={field === 'time' ? 'time' : 'text'} // Use "time" input type for time field
                      placeholder={field}
                      name={field}
                      value={entry[field]} // Ensure value is correctly mapped
                      onChange={(e) => handleTimeHrChange(e, index)}
                      className="px-3 py-2 rounded-md bg-gray-700 text-white"
                    />
                  )
                )}
                <button
                  type="button"
                  onClick={() => handleDeleteTimeHr(index)}
                  className="px-3 py-2 bg-red-600 rounded-md text-white"
                >
                  Delete
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddTimeHr}
              className="px-4 py-2 bg-green-600 rounded-md text-white w-full"
            >
              Add New TimeHr Entry
            </button>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-bold"
          >
            Update Boiler
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default EditBoilerForm;

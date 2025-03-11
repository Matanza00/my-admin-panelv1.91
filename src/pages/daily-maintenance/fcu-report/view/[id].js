import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../../components/layout';
const FCUReportDetailPage = ({ fcuReport }) => {
  const [report, setReport] = useState(fcuReport || null);
  const router = useRouter();
  
  useEffect(() => {
    if (!report) {
      setReport("")
      router.push('/404');
    }
  }, [report, router]);

  if (!report) {
    return <p>Loading...</p>;
  }

  return (<Layout>
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-semibold text-center text-gray-800 mb-8">FCU Report Detail</h1>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="mb-6">
          <h2 className="text-2xl font-medium text-gray-900">Report ID: {report.id}</h2>
          <p className="text-lg text-gray-600">
  Date: {`${new Date(report.date).toLocaleDateString('en-GB')} Time: ${String(new Date(report.date).getHours()).padStart(2, '0')}:${String(new Date(report.date).getMinutes()).padStart(2, '0')}:${String(new Date(report.date).getSeconds()).padStart(2, '0')}`}
</p>

          <p className="text-lg text-gray-600">Remarks: {report.remarks}</p>
        </div>

        <div className="grid grid-cols-1 gap-6 mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">Approval Status</h3>
            <div className="flex justify-between text-lg text-gray-600">
              <p>Supervisor Approval:</p>
              <span className={`font-medium ${report.supervisorApproval ? 'text-green-500' : 'text-red-500'}`}>
                {report.supervisorApproval ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex justify-between text-lg text-gray-600">
              <p>Engineer Approval:</p>
              <span className={`font-medium ${report.engineerApproval ? 'text-green-500' : 'text-red-500'}`}>
                {report.engineerApproval ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-800">Floor FC Details</h3>
          {report.floorFCs.length > 0 ? (
            <ul className="space-y-4">
              {report.floorFCs.map((floorFC) => (
                <li key={floorFC.id} className="bg-gray-100 p-4 rounded-lg shadow-sm">
                  <h4 className="text-lg font-medium text-gray-900">Floor Range: {floorFC.floorFrom} - {floorFC.floorTo}</h4>
                  <p className="text-gray-700">Details: {floorFC.details}</p>
                  <p className="text-gray-600">Attended By: {floorFC.attendedBy}</p>
                  <p className="text-gray-600">Verified By: {floorFC.verifiedBy}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No floor FC details available.</p>
          )}
        </div>
      </div>
    </div></Layout>
  );
};

export async function getServerSideProps(context) {
  const { id } = context.params;

  try {
    const res = await fetch(`${process.env.BASE_URL || 'http://localhost:3000'}/api/fcu-reports/${id}`);
    
    if (!res.ok) {
      throw new Error('Failed to fetch FCU report');
    }

    const fcuReport = await res.json();

    if (!fcuReport) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        fcuReport,
      },
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return {
      notFound: true,
    };
  }
}

export default FCUReportDetailPage;

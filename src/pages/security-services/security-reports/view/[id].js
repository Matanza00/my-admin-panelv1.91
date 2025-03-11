// /pages/security-services/security-reports/view/[id].js
import { useRouter } from 'next/router';
import Layout from '../../../../components/layout';
import prisma from '../../../../lib/prisma';

export default function ViewSecurityReport({ report }) {
  const router = useRouter();

  if (!report) {
    return (
      <Layout>
        <p>Loading...</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-4">
        <h1 className="text-2xl font-semibold mb-6 text-center text-blue-600">Security Report Details</h1>
        <form className="space-y-6 bg-white shadow-md p-6 rounded-lg max-w-3xl mx-auto">
          {/* Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <p className="w-full p-2 border border-gray-300 rounded bg-gray-100">{new Date(report.date).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Staff Section */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Staff</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Observed By</label>
                <p className="w-full p-2 border border-gray-300 rounded bg-gray-100">{report.observedByName || "Unknown"}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Supervisor</label>
                <p className="w-full p-2 border border-gray-300 rounded bg-gray-100">{report.supervisorName || "Unknown"}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <p className="w-full p-2 border border-gray-300 rounded bg-gray-100">{report.description}</p>
          </div>

          {/* Action */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Action</label>
            <p className="w-full p-2 border border-gray-300 rounded bg-gray-100">{report.action}</p>
          </div>

          {/* Time Noted and Solved */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Time Noted</label>
              <p className="w-full p-2 border border-gray-300 rounded bg-gray-100">
                {report.timeNoted ? new Date(report.timeNoted).toLocaleTimeString() : 'N/A'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Time Solved</label>
              <p className="w-full p-2 border border-gray-300 rounded bg-gray-100">
                {report.timeSolved ? new Date(report.timeSolved).toLocaleTimeString() : 'N/A'}
              </p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => router.push('/security-services/security-reports')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300"
            >
              Back to Reports
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.params;

  const reportId = parseInt(id, 10);
  if (isNaN(reportId)) {
    return {
      notFound: true, // Return 404 if the ID is invalid
    };
  }

  try {
    // Fetch the report
    const report = await prisma.securityreport.findUnique({
      where: { id: reportId },
    });

    if (!report) {
      return { notFound: true }; // If no report is found, show 404 page
    }

    // Fetch the names for observedBy and supervisor
    const [observedByUser, supervisorUser] = await Promise.all([
      prisma.user.findUnique({ where: { id: report.observedBy }, select: { name: true } }),
      prisma.user.findUnique({ where: { id: report.supervisor }, select: { name: true } }),
    ]);

    // Serialize Date fields
    const serializedReport = {
      ...report,
      observedByName: observedByUser?.name || "Unknown",
      supervisorName: supervisorUser?.name || "Unknown",
      createdAt: report.createdAt.toISOString(),
      updatedAt: report.updatedAt.toISOString(),
      date: report.date.toISOString(),
      timeNoted: report.timeNoted ? report.timeNoted.toISOString() : null,
      timeSolved: report.timeSolved ? report.timeSolved.toISOString() : null,
    };

    return {
      props: {
        report: serializedReport,
      },
    };
  } catch (error) {
    console.error('Error fetching report:', error);
    return {
      props: {
        report: null,
      },
    };
  }
}

// pages/general-administration/occupancy/view/[id].js
// import { useRouter } from 'next/router';
import Layout from '../../../../components/layout';
import Link from 'next/link'; // Import the Link component

export default function ViewOccupancy({ occupancy }) {
  // const router = useRouter();

  if (!occupancy) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6">Occupancy Details</h1>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Tenant Name</h3>
            <p>{occupancy.tenant?.tenantName || 'Unknown Tenant'}</p>
          </div>
          <div>
            <h3 className="text-lg font-medium">Total Area</h3>
            <p>{occupancy.totalArea} sq m</p>
          </div>
          <div>
            <h3 className="text-lg font-medium">Rented Area</h3>
            <p>{occupancy.rentedArea} sq m</p>
          </div>
          <div>
            <h3 className="text-lg font-medium">Occupancy Area</h3>
            <p>{occupancy.occupancyArea} sq m</p>
          </div>
          <div>
            {/* The Link component for editing occupancy */}
            <Link href={`/general-administration/occupancy/edit/${occupancy.id}`}>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Edit Occupancy
              </button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  const res = await fetch(`${process.env.BASE_URL || 'http://localhost:3000'}/api/occupancy/${params.id}`);
  const occupancy = await res.json();

  if (!occupancy) {
    return { notFound: true };
  }

  return {
    props: {
      occupancy,
    },
  };
}

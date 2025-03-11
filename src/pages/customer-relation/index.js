// src/pages/customer-relation/feedback-complain/index.js
import Link from 'next/link';
import {  HiOutlinePencil, HiOutlineTrash, HiEye } from 'react-icons/hi';

export default function FeedbackComplainPage({ data = [] }) {
  if (!data || data.length === 0) {
    return <div>No data available</div>; // Show a message when no data is available
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Feedback/Complains</h1>
      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Feedback/Complain</th>
            <th className="border border-gray-300 p-2">Date</th>
            <th className="border border-gray-300 p-2">Complain No.</th>
            <th className="border border-gray-300 p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td className="border border-gray-300 p-2">{item.complain}</td>
              <td className="border border-gray-300 p-2">{item.date}</td>
              <td className="border border-gray-300 p-2">{item.complainNo}</td>
              <td className="border border-gray-300 p-2">
                <Link href={`/customer-relation/feedback-complain/view/${item.id}`}>
                  <div className="text-green-600 hover:text-green-800 flex items-center cursor-pointer">
                    <HiEye className="mr-1" /> View
                  </div>
                </Link>
                <Link href={`/customer-relation/feedback-complain/edit/${item.id}`}>
                  <div className="text-blue-600 hover:text-blue-800 flex items-center cursor-pointer">
                    <HiOutlinePencil className="mr-1" /> Edit
                  </div>
                </Link>
                <button className="text-red-600 ml-2 flex items-center cursor-pointer">
                  <HiOutlineTrash className="mr-1" /> Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// This function simulates fetching data from an API
export async function getServerSideProps() {
  // Simulate data fetching or replace with actual fetch request
  const data = [
    {
      id: 1,
      complain: 'Broken Light in the lobby.',
      date: '2024-11-10',
      complainNo: 'C-12345',
    },
    {
      id: 2,
      complain: 'Leaking pipe in the kitchen.',
      date: '2024-11-11',
      complainNo: 'C-12346',
    },
  ];

  return {
    props: {
      data,
    },
  };
}

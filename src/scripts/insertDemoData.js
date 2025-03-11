// src/scripts/insertDemoData.js
import prisma from "../lib/prisma.js";  // Assuming prisma client is set up in src/lib/prisma.js

async function insertDemoData() {
  try {
    // Create demo duty chart with attendance
    const dutyChart = await prisma.dutyChart.create({
      data: {
        date: new Date(),
        supervisor: 'Alice Johnson',
        remarks: 'Morning shift duty chart',
        picture: null, // Optionally include a picture
        attendance: {
          create: [
            { 
              name: 'John Doe', 
              designation: 'Cleaner', 
              timeIn: new Date(), 
              timeOut: new Date(), 
              lunchIn: null, 
              lunchOut: null 
            },
            { 
              name: 'Jane Smith', 
              designation: 'Supervisor', 
              timeIn: new Date(), 
              timeOut: new Date(), 
              lunchIn: null, 
              lunchOut: null 
            },
            { 
              name: 'Bob Brown', 
              designation: 'Janitor', 
              timeIn: new Date(), 
              timeOut: new Date(), 
              lunchIn: null, 
              lunchOut: null 
            },
            // Add more attendance records as needed
          ]
        }
      }
    });

    console.log('Demo data inserted for dutyChart:', dutyChart);

    // Create demo data for FeedbackComplain
    const complainNo = `CMP-${Date.now()}`;
    const feedbackComplain = await prisma.feedbackComplain.create({
      data: {
        complain: 'Water leakage in the restroom',
        date: new Date(),
        complainNo: complainNo,
        complainBy: 'John Doe',
        floorNo: '3',
        area: 'Restroom',
        location: 'Near the washbasin',
        listServices: 'Plumbing, Cleaning',
        materialReq: 'Pipe, Cleaning solution',
        actionTaken: 'Replaced leaking pipe and cleaned the area',
        attendedBy: 'Jane Smith',
        remarks: 'The issue was resolved within 2 hours',
        status: 'Closed',
      },
    });

    console.log('Demo data inserted for FeedbackComplain:', feedbackComplain);

    // Create demo data for JobSlip
    const jobSlip = await prisma.jobSlip.create({
      data: {
        date: new Date(),
        jobId: `JOB-${Date.now()}`,
        complainNo: complainNo,
        complainBy: 'John Doe',
        floorNo: '3',
        area: 'Restroom',
        location: 'Near the washbasin',
        complaintDesc: 'Water leakage in the restroom',
        materialReq: 'Pipe, Cleaning solution',
        actionTaken: 'Replaced leaking pipe and cleaned the area',
        attendedBy: 'Jane Smith',
        remarks: 'The issue was resolved within 2 hours',
        completed_At: new Date(),
        status: 'Completed',
        supervisorApproval: true,
        managementApproval: true,
      },
    });

    console.log('Demo data inserted for JobSlip:', jobSlip);

    // Insert demo data for Tenants
    const tenant = await prisma.tenants.create({
      data: {
        tenantName: 'Tenant A',
        totalAreaSq: 2500,
        areas: {
          create: [
            {
              areaName: 'Reception',
              floor: '1',
              occupiedArea: 500,
              location: 'Front lobby',
            },
            {
              areaName: 'Conference Room',
              floor: '2',
              occupiedArea: 700,
              location: 'Near elevator',
            },
            // Add more areas as needed
          ]
        },
        occupancy: {
          create: {
            totalArea: 2500,
            rentedArea: 2000,
            occupancyArea: 1800
          }
        }
      }
    });

    console.log('Demo data inserted for Tenant:', tenant);

    // Create demo Occupancy for the Tenant
    const occupancy = await prisma.occupancy.create({
      data: {
        tenantId: tenant.id,
        totalArea: 2500,
        rentedArea: 2000,
        occupancyArea: 1800
      }
    });

    console.log('Demo data inserted for Occupancy:', occupancy);

  } catch (e) {
    console.error('Error inserting demo data:', e);
  }
}

// Run the function
insertDemoData()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

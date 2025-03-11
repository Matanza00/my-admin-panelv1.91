import { useState, useEffect } from 'react';
import { IoLogOutOutline } from "react-icons/io5";
import { HiUser, HiHome } from 'react-icons/hi';
import { FaBroom, FaShieldAlt, FaWater, FaTools } from 'react-icons/fa';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { MdOutlineEngineering, MdOutlineFireExtinguisher, MdOutlineReport, MdOutlineAdminPanelSettings } from 'react-icons/md';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Activity, Car, User ,BookUser } from "lucide-react";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const { data: session } = useSession();
  const router = useRouter();

  // Initialize sidebar state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('isSidebarCollapsed');
    const savedMenu = localStorage.getItem('openMenu');
    if (savedState) setIsCollapsed(JSON.parse(savedState));
    if (savedMenu) setOpenMenu(savedMenu);
  }, []);

  // Sidebar toggle handler
  const handleSidebarToggle = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('isSidebarCollapsed', JSON.stringify(newState));
  };

  // Menu toggle handler
  const handleMenuToggle = (menuName) => {
    const newMenu = openMenu === menuName ? null : menuName;
    setOpenMenu(newMenu);
    localStorage.setItem('openMenu', newMenu || '');
  };

  // Extract user info from session
  const department = session?.user?.department?.toLowerCase() || '';
  const role = session?.user?.role?.toLowerCase() || '';
  const isAdmin = role === 'admin';
  const isSuperAdmin = role === 'super_admin';
  const isSupervisor = role === 'supervisor';
  const isTechnician = role === 'technician';
  const isTenant = role === 'tenant';
  const canViewAllPages = isAdmin || isSuperAdmin || isSupervisor;

  // Debugging logs for session and user role
  console.log('Department:', department);
  console.log('Role:', role);
  console.log('Session:', session);

  return (
    <aside
      className={`bg-gray-800 text-white flex flex-col fixed transition-all duration-300 relative ${
        isCollapsed ? 'w-16' : 'w-64'
      } p-2 md:p-4`}
    >
      <div
        onClick={handleSidebarToggle}
        className="flex justify-center items-center py-5 px-3 bg-white/70 rounded-lg cursor-pointer"
        style={{
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <img src="/saudipak.png" alt="Logo" width={120} height={120} />
      </div>

      <nav className="flex flex-col space-y-3 pt-10">
        {/* Admin and Supervisor Menus */}
          <>
            <NavItem
              icon={<HiHome />}
              label="Home"
              href="/"
              isCollapsed={isCollapsed}
              isActive={router.pathname === '/'}
            />

            {(isAdmin || isSuperAdmin) && (
              <NavItem
                icon={<HiUser />}
                label="Users"
                href="/users"
                isCollapsed={isCollapsed}
                isActive={router.pathname === '/users'}
              />
            )}
            
            {(isAdmin || isSuperAdmin) && (
<DropdownMenu
        icon={<Car />}
        label="Fleet Services"
        isCollapsed={isCollapsed}
        isOpen={openMenu === 'fleetServices'}
        setIsOpen={() => handleMenuToggle('fleetServices')}
        items={[
         {
            label: 'Fleet Dashboard',
            href: '/fleet/dashboard',
            icon: <Activity />,
          },
          {
            label: 'Cars',
            href: '/fleet/cars',
            icon: <Car />,
          },
          {
            label: 'Drivers',
            href: '/fleet/drivers',
            icon: <User />,
          },
          {
            label: 'Booking',
            href: '/fleet/booking',
            icon: <BookUser />,
          },
          
        ].filter(Boolean)}
        currentPath={router.pathname}
      />
       )}

            {(canViewAllPages || role === 'tenant') && (

<DropdownMenu
  icon={<HiUser />}
  label="Customer Relation"
  isCollapsed={isCollapsed}
  isOpen={openMenu === 'customerRelation'}
  setIsOpen={() => handleMenuToggle('customerRelation')}
  items={[
    (canViewAllPages || role === 'tenant') && { label: 'Feedback/Complain', href: '/customer-relation/feedback-complain', icon: <HiUser /> },
    (canViewAllPages ) && { label: 'Job Slip', href: '/customer-relation/job-slip', icon: <HiUser /> },
  ].filter(Boolean)} // Filters out any false values (like undefined)
 />
            )}
            

            {canViewAllPages && (
              <DropdownMenu
                icon={<MdOutlineAdminPanelSettings />}
                label="General Administration"
                isCollapsed={isCollapsed}
                isOpen={openMenu === 'generalAdministration'}
                setIsOpen={() => handleMenuToggle('generalAdministration')}
                items={[
                  { label: 'Duty Chart', href: '/general-administration/duty-chart', icon: <HiUser /> },
                  { label: 'Tenants', href: '/general-administration/tenants', icon: <HiUser /> },
                  { label: 'Occupancy', href: '/general-administration/occupancy', icon: <HiUser /> },
                ]}
              />
            )}
{(canViewAllPages || role === 'tenant') && (
  <DropdownMenu
    icon={<FaBroom />}
    label="Janitorial"
    isCollapsed={isCollapsed}
    isOpen={openMenu === 'janitorial'}
    setIsOpen={() => handleMenuToggle('janitorial')}
    items={[
      canViewAllPages && { label: 'Janitorial Attendance', href: '/janitorial/attendance', icon: <HiUser /> },
      (canViewAllPages || role === 'tenant') && { label: 'Janitorial Inspection Report', href: '/janitorial/report', icon: <MdOutlineReport /> },
    ].filter(Boolean)} // This filters out any false values (like undefined)
  />
)}

          </>
        

        {/** Daily Maintenance */}
{(canViewAllPages || isSupervisor || role === 'technician') && (
  <DropdownMenu
    icon={<MdOutlineEngineering />}
    label="Daily Maintenance"
    isCollapsed={isCollapsed}
    isOpen={openMenu === 'dailyMaintenance'}
    setIsOpen={() => handleMenuToggle('dailyMaintenance')}
    items={[
      role === 'technician' && { label: 'Job Slip', href: '/customer-relation/job-slip', icon: <HiUser /> },
      (canViewAllPages || department === 'hvac') && { label: 'FCU Report', href: '/daily-maintenance/fcu-report', icon: <HiUser /> },
      (canViewAllPages || department === 'hvac') && { label: 'Hot Water Boiler', href: '/daily-maintenance/hot-water-boiler', icon: <FaWater /> },
      (canViewAllPages || department === 'hvac') && { label: 'Absorption/DFA Chiller', href: '/daily-maintenance/absorptionchiller', icon: <FaWater /> },
      (canViewAllPages || department === 'plumbing') && { label: 'Plumbing', href: '/daily-maintenance/plumbing', icon: <FaTools /> },
      (canViewAllPages || department === 'plumbing') && { label: 'Water Management', href: '/daily-maintenance/water-management', icon: <FaWater /> },
      (canViewAllPages || department === 'electrical') && { label: 'Generator', href: '/daily-maintenance/generator', icon: <HiUser /> },
      (canViewAllPages || department === 'electrical') && { label: 'Transformer', href: '/daily-maintenance/transformer', icon: <HiUser /> },
      (canViewAllPages ||  department === 'firefighting' || department === 'firefightingalarm') && {
        label: 'FireFighting',
        href: '/daily-maintenance/firefighting',
        icon: <MdOutlineFireExtinguisher />,
      },
    ].filter(Boolean)}
    currentPath={router.pathname}
  />
)}

        {/** Security Services */}
    {(canViewAllPages || ['security', 'cctv', 'security guard'].includes(department)) && (
      <DropdownMenu
        icon={<FaShieldAlt />}
        label="Security Services"
        isCollapsed={isCollapsed}
        isOpen={openMenu === 'securityServices'}
        setIsOpen={() => handleMenuToggle('securityServices')}
        items={[
          (canViewAllPages || session?.user?.department === 'FireFighting' || session?.user?.department === 'FireFightingAlarm') && {
            label: 'FireFighting Duty',
            href: '/security-services/firefighting-duty',
            icon: <MdOutlineFireExtinguisher />,
          },
          (canViewAllPages || session?.user?.department === 'Security' || session?.user?.department === 'Security GUARD') && {
            label: 'Security Reports',
            href: '/security-services/security-reports',
            icon: <MdOutlineReport />,
          },
          (canViewAllPages || session?.user?.department === 'Security' || session?.user?.department === 'Security GUARD') && {
            label: 'Daily Duty Security',
            href: '/security-services/daily-duty-security',
            icon: <HiUser />,
          },
          (canViewAllPages || session?.user?.department === 'CCTV') && { label: 'CCTV Report', href: '/security-services/cctv-report', icon: <HiUser /> },
        ].filter(Boolean)}
        currentPath={router.pathname}
      />
    )}

  

        {/* Logout Button */}
        <div
          onClick={() => signOut()}
          className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 cursor-pointer"
        >
          <span>
            <IoLogOutOutline />
          </span>
          <span className={`whitespace-nowrap ${isCollapsed ? 'hidden' : ''}`}>Logout</span>
        </div>
      </nav>
    </aside>
  );
}

function NavItem({ icon, label, href, isCollapsed, isActive }) {
  return (
    <Link href={href}>
      <div
        className={`flex items-center space-x-2 p-2 rounded hover:bg-gray-700 ${
          isActive ? 'bg-gray-900' : ''
        }`}
      >
        <span>{icon}</span>
        <span className={`whitespace-nowrap ${isCollapsed ? 'hidden' : ''}`}>{label}</span>
      </div>
    </Link>
  );
}

function DropdownMenu({ icon, label, isCollapsed, isOpen, setIsOpen, items }) {
  return (
    <div className="relative">
      <button
        onClick={setIsOpen}
        className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700"
      >
        <span>{icon}</span>
        <span className={`whitespace-nowrap ${isCollapsed ? 'hidden' : ''}`}>{label}</span>
        {isOpen ? <FiChevronUp /> : <FiChevronDown />}
      </button>
      {isOpen && (
        <div
          className={`${
            isCollapsed
              ? 'absolute left-full top-0 bg-gray-900 p-2 border border-gray-700 rounded-md shadow-lg z-10'
              : 'block'
          }`}
        >
          {items.map((item, index) => (
            <NavItem
              key={index}
              icon={item.icon}
              label={item.label}
              href={item.href}
              isCollapsed={isCollapsed}
            />
          ))}
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Layout from '../../components/layout';

export default function AssignPermissions() {
  const { data: session } = useSession();
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [rolePermissions, setRolePermissions] = useState({}); // Store role permissions
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  // Fetch roles and permissions initially
  useEffect(() => {
    const fetchRolesAndPermissions = async () => {
      try {
        // Fetch roles
        const rolesRes = await fetch('/api/roles');
        const rolesData = await rolesRes.json();
        setRoles(rolesData);

        // Fetch permissions
        const permissionsRes = await fetch('/api/permissions');
        const permissionsData = await permissionsRes.json();
        setPermissions(permissionsData);

        // Store permissions for each role (for easy access later)
        const rolePermissionsData = {};
        for (const role of rolesData) {
          const rolePermRes = await fetch(`/api/roles/${role.id}/permissions`);
          const rolePermData = await rolePermRes.json();
          rolePermissionsData[role.id] = rolePermData;
        }
        console.log('Role Permissions Data:', rolePermissionsData);
        setRolePermissions(rolePermissionsData);

      } catch (error) {
        console.error('Error fetching roles or permissions:', error);
      }
    };

    fetchRolesAndPermissions();
  }, []);

  // Handle role change
  const handleRoleChange = (roleId) => {
    console.log('Role Changed:', roleId);
    setSelectedRole(roleId);

    // Update selected permissions based on the selected role's permissions
    const rolePerms = rolePermissions[roleId] || [];
    console.log('Selected Role Permissions:', rolePerms);

    // Set selected permissions based on the role's permissions
    setSelectedPermissions(rolePerms.map((perm) => perm.permissionId));
  };

  // Toggle permission selection
  const handlePermissionToggle = (permissionId) => {
    console.log('Permission Toggled:', permissionId);
    setSelectedPermissions((prevSelected) =>
      prevSelected.includes(permissionId)
        ? prevSelected.filter((id) => id !== permissionId)
        : [...prevSelected, permissionId]
    );
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('/api/roles/assignPermissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roleId: selectedRole,
          permissionIds: selectedPermissions,
        }),
      });
      alert('Permissions assigned successfully');
    } catch (error) {
      console.error('Failed to assign permissions:', error);
      alert('Failed to assign permissions');
    }
  };

  // Only allow super admin to access this page
  if (!session?.user || session.user.role !== 'super_admin') {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-xl text-red-600">Access denied. Only super admins can view this page.</p>
      </div>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Assign Permissions to Roles</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role Selection */}
          <div>
            <label className="block text-lg font-medium text-gray-700">Select Role:</label>
            <select
              onChange={(e) => handleRoleChange(e.target.value)}
              value={selectedRole || ''}
              className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="" disabled>Select a role</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          {/* Permission Selection */}
          <div>
            <label className="block text-lg font-medium text-gray-700">Permissions:</label>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {permissions.map((permission) => (
                <div key={permission.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedPermissions.includes(permission.id)}
                    onChange={() => handlePermissionToggle(permission.id)}
                    className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label className="text-gray-700">{permission.name}</label>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!selectedRole}
              className={`${
                !selectedRole
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              } text-white py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200`}
            >
              Assign Permissions
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

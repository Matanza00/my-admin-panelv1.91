import { useEffect, useState } from "react";
import Layout from '../../components/layout';

export default function Home() {
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [roleDepartmentPermissions, setRoleDepartmentPermissions] = useState([]);

  const [newDepartment, setNewDepartment] = useState("");
  const [editingDepartment, setEditingDepartment] = useState(null);

  const [newRole, setNewRole] = useState("");
  const [editingRole, setEditingRole] = useState(null);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    roleId: "",
    departmentId: "",
  });

  const [editingUser, setEditingUser] = useState(null);

  const [newPermission, setNewPermission] = useState("");
  // const [editingPermission, setEditingPermission] = useState(null);

  const [newRoleDepartmentPermission, setNewRoleDepartmentPermission] = useState({
    roleId: "",
    departmentId: "",
    permissionId: "",
  });

  const [collapsedSections, setCollapsedSections] = useState({
    departments: false,
    roles: false,
    addUser:false,
    users: false,
    permissions: false,
    roleDepartmentPermissions: false,
  });

  // Fetch Data
  useEffect(() => {
    fetchDepartments();
    fetchRoles();
    fetchUsers();
    fetchPermissions();
    fetchRoleDepartmentPermissions();
  }, []);

  const fetchDepartments = async () => {
    const res = await fetch("/api/departments");
    const data = await res.json();
    setDepartments(data);
  };

  const fetchRoles = async () => {
    const res = await fetch("/api/roles");
    const data = await res.json();
    setRoles(data);
  };

  const fetchUsers = async () => {
    const res = await fetch("/api/users");
    const data = await res.json();
    setUsers(data);
  };

  const fetchPermissions = async () => {
    const res = await fetch("/api/permissions");
    const data = await res.json();
    setPermissions(data);
  };

  const fetchRoleDepartmentPermissions = async () => {
    const res = await fetch("/api/roleDepartmentPermissions");
    const data = await res.json();
    setRoleDepartmentPermissions(data);
  };

  // Toggle Collapse
  const toggleSection = (section) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // CRUD for Departments
  const handleAddDepartment = async () => {
    if (!newDepartment.name || newDepartment.name.trim() === "") {
      alert("Department name is required.");
      return;
    }
  
    try {
      await fetch("/api/departments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newDepartment.name.trim(),
          code: newDepartment.code ? newDepartment.code.trim() : null, // Include code if provided
        }),
      });
      setNewDepartment({ name: "", code: "" }); // Reset the form
      fetchDepartments(); // Refresh the departments list
      console.log({
        name: newDepartment.name.trim(),
        code: newDepartment.code ? newDepartment.code.trim() : null, // Include code if provided
      })
    } catch (error) {
      console.error("Error adding department:", error);
      alert("Failed to add department. Please try again.");
    }
  };
  

  const handleUpdateDepartment = async (id) => {
    await fetch(`/api/departments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingDepartment),
    });
    console.log(editingDepartment)
    setEditingDepartment(null);
    fetchDepartments();
  };

  const handleDeleteDepartment = async (id) => {
    await fetch(`/api/departments/${id}`, { method: "DELETE" });
    fetchDepartments();
  };

  // CRUD for Roles
  const handleAddRole = async () => {
    await fetch("/api/roles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newRole }),
    });
    setNewRole("");
    fetchRoles();
  };

  const handleUpdateRole = async (id) => {
    await fetch(`/api/roles/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingRole),
    });
    setEditingRole(null);
    fetchRoles();
  };

  const handleDeleteRole = async (id) => {
    await fetch(`/api/roles/${id}`, { method: "DELETE" });
    fetchRoles();
  };

  // CRUD for Users
  const handleAddUser = async () => {
    await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });
    setNewUser({
      name: "",
      email: "",
      username: "",
      password: "",
      roleId: "",
      departmentId: "",
    });
    fetchUsers();
  };

  const handleUpdateUser = async (id) => {
    const {...updatedUser } = editingUser;

    await fetch(`/api/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedUser),
    });

    setEditingUser(null);
    fetchUsers();
  };

  const handleDeleteUser = async (id) => {
    await fetch(`/api/users/${id}`, { method: "DELETE" });
    fetchUsers();
  };

  // CRUD for Permissions
  const handleAddPermission = async () => {
    await fetch("/api/permissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newPermission }),
    });
    setNewPermission("");
    fetchPermissions();
  };

  // const handleUpdatePermission = async (id) => {
  //   await fetch(`/api/permissions/${id}`, {
  //     method: "PUT",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(editingPermission),
  //   });
  //   setEditingPermission(null);
  //   fetchPermissions();
  // };

  const handleDeletePermission = async (id) => {
    await fetch(`/api/permissions/${id}`, { method: "DELETE" });
    fetchPermissions();
  };

  // CRUD for RoleDepartmentPermissions
  const handleAddRoleDepartmentPermission = async () => {
    await fetch("/api/roleDepartmentPermissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newRoleDepartmentPermission),
    });
    setNewRoleDepartmentPermission({
      roleId: "",
      departmentId: "",
      permissionId: "",
    });
    fetchRoleDepartmentPermissions();
  };

  const handleDeleteRoleDepartmentPermission = async (id) => {
    await fetch(`/api/roleDepartmentPermissions/${id}`, { method: "DELETE" });
    fetchRoleDepartmentPermissions();
  };

  return (
    <Layout>
      <div className="p-6 font-sans">
        <h1 className="text-2xl font-bold text-center mb-6">CRUD Admin Panel</h1>

{/* Departments Section */}
{/* Departments Section */}
<div className="mb-6">
  <button
    className="w-full flex items-center justify-between bg-blue-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-600 transition-all"
    onClick={() => toggleSection("departments")}
  >
    <span>Departments</span>
    <svg
      className={`w-5 h-5 transform transition-transform ${collapsedSections.departments ? "rotate-0" : "rotate-180"}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth="2"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  </button>

  {collapsedSections.departments && (
    <div className="mt-4 p-6 border rounded-lg bg-gray-100 shadow-sm">
      {/* Add New Department Form */}
      <div className="space-y-4">
        <input
          type="text"
          placeholder="New Department Name"
          value={newDepartment.name}
          onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
          className="border p-3 rounded-md w-full focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="New Department Code (Optional)"
          value={newDepartment.code}
          onChange={(e) => setNewDepartment({ ...newDepartment, code: e.target.value })}
          className="border p-3 rounded-md w-full focus:ring-2 focus:ring-blue-500"
        />
        <button
          className="w-full bg-green-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-green-600 transition-all"
          onClick={handleAddDepartment}
        >
          Add Department
        </button>
      </div>

      {/* Departments List */}
      <ul className="mt-6 space-y-4">
        {departments.map((dept) => (
          <li
            key={dept.id}
            className="flex items-center justify-between bg-white p-4 rounded-md shadow-md hover:bg-gray-50 transition-all"
          >
            {editingDepartment?.id === dept.id ? (
              <>
                <input
                  type="text"
                  defaultValue={dept.name}
                  onChange={(e) => setEditingDepartment({ ...editingDepartment, name: e.target.value })}
                  className="border p-2 rounded w-1/3"
                />
                <input
                  type="text"
                  defaultValue={dept.code}
                  placeholder="Department Code (Optional)"
                  onChange={(e) => setEditingDepartment({ ...editingDepartment, code: e.target.value })}
                  className="border p-2 rounded w-1/3"
                />
                <button
                  className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-all"
                  onClick={() => handleUpdateDepartment(dept.id)}
                >
                  Save
                </button>
              </>
            ) : (
              <>
                <span className="text-lg font-semibold text-gray-700">
                  {dept.name} ({dept.code || "No Code"})
                </span>
                <div className="flex space-x-2">
                  <button
                    className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-all"
                    onClick={() => setEditingDepartment(dept)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-all"
                    onClick={() => handleDeleteDepartment(dept.id)}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  )}
</div>


{/* Roles Section */}
<div className="mb-6">
  <button
    className="w-full flex items-center justify-between bg-purple-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-purple-600 transition-all"
    onClick={() => toggleSection("roles")}
  >
    <span>Roles</span>
    <svg
      className={`w-5 h-5 transform transition-transform ${collapsedSections.roles ? "rotate-0" : "rotate-180"}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth="2"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  </button>

  {collapsedSections.roles && (
    <div className="mt-4 p-6 border rounded-lg bg-gray-100 shadow-sm">
      {/* Add New Role Form */}
      <div className="space-y-4">
        <input
          type="text"
          placeholder="New Role Name"
          value={newRole}
          onChange={(e) => setNewRole(e.target.value)}
          className="border p-3 rounded-md w-full focus:ring-2 focus:ring-purple-500"
        />
        <button
          className="w-full bg-green-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-green-600 transition-all"
          onClick={handleAddRole}
        >
          Add Role
        </button>
      </div>

      {/* Roles List */}
      <ul className="mt-6 space-y-4">
        {roles.map((role) => (
          <li key={role.id} className="flex items-center justify-between bg-white p-4 rounded-md shadow-md hover:bg-gray-50 transition-all">
            {editingRole?.id === role.id ? (
              <>
                <input
                  type="text"
                  defaultValue={role.name}
                  onChange={(e) => setEditingRole({ ...editingRole, name: e.target.value })}
                  className="border p-3 rounded-md w-full focus:ring-2 focus:ring-purple-500"
                />
                <button
                  className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-all"
                  onClick={() => handleUpdateRole(role.id)}
                >
                  Save
                </button>
              </>
            ) : (
              <>
                <span className="text-lg font-semibold text-gray-700">{role.name}</span>
                <div className="flex space-x-2">
                  <button
                    className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-all"
                    onClick={() => setEditingRole(role)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-all"
                    onClick={() => handleDeleteRole(role.id)}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  )}
</div>


 {/* Users Section */}
<div className="mb-6">
  <button
    className="w-full flex items-center justify-between bg-green-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-green-600 transition-all"
    onClick={() => toggleSection("users")}
  >
    <span>Users</span>
    <svg
      className={`w-5 h-5 transform transition-transform ${collapsedSections.users ? "rotate-0" : "rotate-180"}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth="2"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  </button>

  {collapsedSections.users && (
    <div className="mt-4 p-6 border rounded-lg bg-gray-100 shadow-sm">
      <div className="space-y-6">
        {/* Add User Form (Collapsible) */}
        <div>
          <button
            className="w-full flex items-center justify-between bg-gray-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-gray-600 transition-all"
            onClick={() => toggleSection("addUser")}
          >
            <span>Add User</span>
            <svg
              className={`w-5 h-5 transform transition-transform ${collapsedSections.addUser ? "rotate-0" : "rotate-180"}`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>

          {collapsedSections.addUser && (
            <div className="mt-4 space-y-6">
              <input
                type="text"
                placeholder="User Name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                className="border p-3 rounded-md w-full focus:ring-2 focus:ring-green-500"
              />
              <input
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="border p-3 rounded-md w-full focus:ring-2 focus:ring-green-500"
              />
              <input
                type="text"
                placeholder="Username"
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                className="border p-3 rounded-md w-full focus:ring-2 focus:ring-green-500"
              />
              <input
                type="password"
                placeholder="Password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                className="border p-3 rounded-md w-full focus:ring-2 focus:ring-green-500"
              />
              <select
                value={newUser.roleId}
                onChange={(e) => setNewUser({ ...newUser, roleId: e.target.value })}
                className="border p-3 rounded-md w-full focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select Role</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
              <select
                value={newUser.departmentId}
                onChange={(e) => setNewUser({ ...newUser, departmentId: e.target.value })}
                className="border p-3 rounded-md w-full focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
              <button
                className="w-full bg-green-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-green-600 transition-all"
                onClick={handleAddUser}
              >
                Add User
              </button>
            </div>
          )}
        </div>

        {/* Users List */}
        <ul className="mt-6 space-y-4">
          {users.map((user) => (
            <li key={user.id} className="flex items-center justify-between bg-white p-4 rounded-md shadow-md hover:bg-gray-50 transition-all">
              {editingUser?.id === user.id ? (
                // Edit Form
                <div className="w-full space-y-6">
                  <input
                    type="text"
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                    className="border p-3 rounded-md w-full focus:ring-2 focus:ring-green-500"
                  />
                  <input
                    type="email"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    className="border p-3 rounded-md w-full focus:ring-2 focus:ring-green-500"
                  />
                  <input
                    type="text"
                    value={editingUser.username}
                    onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                    className="border p-3 rounded-md w-full focus:ring-2 focus:ring-green-500"
                  />
                  <input
                    type="password"
                    placeholder="New Password"
                    value={editingUser.password}
                    onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                    className="border p-3 rounded-md w-full focus:ring-2 focus:ring-green-500"
                  />
                  <select
                    value={editingUser.roleId}
                    onChange={(e) => setEditingUser({ ...editingUser, roleId: e.target.value })}
                    className="border p-3 rounded-md w-full focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select Role</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                  <select
                    value={editingUser.departmentId}
                    onChange={(e) => setEditingUser({ ...editingUser, departmentId: e.target.value })}
                    className="border p-3 rounded-md w-full focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleUpdateUser(editingUser.id)}
                    className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-all"
                  >
                    Save Changes
                  </button>
                </div>
              ) : (
                <span className="text-sm text-gray-700">
                  <strong>Name:</strong> {user.name}, <strong>Email:</strong> {user.email}, <strong>Username:</strong> {user.username}
                </span>
              )}
              <div className="flex space-x-4">
                {editingUser?.id !== user.id && (
                  <button
                    className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-all"
                    onClick={() => setEditingUser(user)}
                  >
                    Edit
                  </button>
                )}
                <button
                  className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-all"
                  onClick={() => handleDeleteUser(user.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )}
</div>

{/* Permissions Section */}
<div className="mb-6">
  <button
    className="w-full flex items-center justify-between bg-yellow-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-yellow-600 transition-all"
    onClick={() => toggleSection("permissions")}
  >
    <span>Permissions</span>
    <svg
      className={`w-5 h-5 transform transition-transform ${collapsedSections.permissions ? "rotate-0" : "rotate-180"}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth="2"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  </button>

  {collapsedSections.permissions && (
    <div className="mt-4 p-6 border rounded-lg bg-gray-100 shadow-sm">
      {/* Add New Permission Form */}
      <div className="space-y-4">
        <input
          type="text"
          placeholder="New Permission Name"
          value={newPermission}
          onChange={(e) => setNewPermission(e.target.value)}
          className="border p-3 rounded-md w-full focus:ring-2 focus:ring-yellow-500"
        />
        <button
          className="w-full bg-green-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-green-600 transition-all"
          onClick={handleAddPermission}
        >
          Add Permission
        </button>
      </div>

      {/* Permissions List */}
      <ul className="mt-6 space-y-4">
        {permissions.map((perm) => (
          <li key={perm.id} className="flex items-center justify-between bg-white p-4 rounded-md shadow-md hover:bg-gray-50 transition-all">
            <span className="text-lg font-semibold text-gray-700">{perm.name}</span>
            <div className="flex space-x-2">
              <button
                className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-all"
                onClick={() => handleDeletePermission(perm.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )}
</div>

{/* RoleDepartment Permissions Section */}
<div className="mb-6">
  <button
    className="w-full flex items-center justify-between bg-orange-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-orange-600 transition-all"
    onClick={() => toggleSection("roleDepartmentPermissions")}
  >
    <span>Role-Department Permissions</span>
    <svg
      className={`w-5 h-5 transform transition-transform ${collapsedSections.roleDepartmentPermissions ? "rotate-0" : "rotate-180"}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth="2"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  </button>

  {collapsedSections.roleDepartmentPermissions && (
    <div className="mt-4 p-6 border rounded-lg bg-gray-100 shadow-sm">
      <div className="space-y-6">
        <div>
          <label htmlFor="role" className="block text-lg font-semibold text-gray-700 mb-2">
            Role
          </label>
          <select
            id="role"
            value={newRoleDepartmentPermission.roleId}
            onChange={(e) => setNewRoleDepartmentPermission({ ...newRoleDepartmentPermission, roleId: e.target.value })}
            className="border p-2 rounded-md w-full focus:ring-2 focus:ring-orange-500"
          >
            <option value="">Select Role</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="department" className="block text-lg font-semibold text-gray-700 mb-2">
            Department
          </label>
          <select
            id="department"
            value={newRoleDepartmentPermission.departmentId}
            onChange={(e) => setNewRoleDepartmentPermission({ ...newRoleDepartmentPermission, departmentId: e.target.value })}
            className="border p-2 rounded-md w-full focus:ring-2 focus:ring-orange-500"
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="permission" className="block text-lg font-semibold text-gray-700 mb-2">
            Permission
          </label>
          <select
            id="permission"
            value={newRoleDepartmentPermission.permissionId}
            onChange={(e) => setNewRoleDepartmentPermission({ ...newRoleDepartmentPermission, permissionId: e.target.value })}
            className="border p-2 rounded-md w-full focus:ring-2 focus:ring-orange-500"
          >
            <option value="">Select Permission</option>
            {permissions.map((perm) => (
              <option key={perm.id} value={perm.id}>
                {perm.name}
              </option>
            ))}
          </select>
        </div>

        <button
          className="w-full bg-green-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-green-600 transition-all"
          onClick={handleAddRoleDepartmentPermission}
        >
          Add Permission
        </button>
      </div>

      <ul className="mt-6 space-y-4">
        {roleDepartmentPermissions.map((rp) => (
          <li key={rp.id} className="flex items-center justify-between bg-white p-4 rounded-md shadow-md hover:bg-gray-50 transition-all">
            <span className="text-sm text-gray-700">
              <strong>Role:</strong> {rp.role?.name || 'N/A'}, <strong>Department:</strong> {rp.department?.name || 'N/A'}, <strong>Permission:</strong> {rp.permission?.name || 'N/A'}
            </span>
            <button
              className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-all"
              onClick={() => handleDeleteRoleDepartmentPermission(rp.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )}
</div>

      </div>
    </Layout>
  );
}

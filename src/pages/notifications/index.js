// pages/notificationTemplates.js

import { useState, useEffect } from 'react';
import Layout from '../../components/layout';

const NotificationTemplatesPage = () => {
  const [templates, setTemplates] = useState([]);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    templateText: '',
    isEditable: true,
  });
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch templates when the component mounts
    const fetchTemplates = async () => {
      setLoading(true);
      const response = await fetch('/api/notificationTemplates');
      const data = await response.json();
      setTemplates(data);
      setLoading(false);
    };

    fetchTemplates();
  }, []);

  // Create new template
  const createTemplate = async () => {
    setLoading(true);
    const response = await fetch('/api/notificationTemplates', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTemplate),
    });
    const data = await response.json();
    setTemplates([...templates, data]);
    setNewTemplate({ name: '', templateText: '', isEditable: true });
    setLoading(false);
  };

  // Edit an existing template
  const editTemplate = (id) => {
    const template = templates.find((template) => template.id === id);
    setEditingTemplate(template);
  };

  const updateTemplate = async () => {
    setLoading(true);
    const response = await fetch('/api/notificationTemplates', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editingTemplate),
    });
    const data = await response.json();
    setTemplates(templates.map((template) => (template.id === data.id ? data : template)));
    setEditingTemplate(null);
    setLoading(false);
  };

  // Delete a template
  const deleteTemplate = async (id) => {
    setLoading(true);
    const response = await fetch(`/api/notificationTemplates?id=${id}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      setTemplates(templates.filter((template) => template.id !== id));
    }
    setLoading(false);
  };

  return (
    <Layout>
      <div className="container mx-auto p-6 font-sans">
        <h1 className="text-2xl font-bold mb-4">Notification Templates</h1>

        {/* Create New Template */}
        <div className="bg-white shadow-md rounded p-4 mb-6">
          <h2 className="text-lg font-semibold mb-2">Create New Template</h2>
          <div className="flex flex-col gap-4">
            <input
              className="p-2 border rounded"
              type="text"
              placeholder="Template Name"
              value={newTemplate.name}
              onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
            />
            <textarea
              className="p-2 border rounded"
              placeholder="Template Text"
              value={newTemplate.templateText}
              onChange={(e) => setNewTemplate({ ...newTemplate, templateText: e.target.value })}
            ></textarea>
            <button
              className={`p-2 bg-blue-500 text-white rounded ${loading && 'opacity-50'}`}
              onClick={createTemplate}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Create Template'}
            </button>
          </div>
        </div>

        {/* Edit Template */}
        {editingTemplate && (
          <div className="bg-yellow-100 shadow-md rounded p-4 mb-6">
            <h2 className="text-lg font-semibold mb-2">Edit Template</h2>
            <div className="flex flex-col gap-4">
              <input
                className="p-2 border rounded"
                type="text"
                placeholder="Template Name"
                value={editingTemplate.name}
                onChange={(e) =>
                  setEditingTemplate({ ...editingTemplate, name: e.target.value })
                }
              />
              <textarea
                className="p-2 border rounded"
                placeholder="Template Text"
                value={editingTemplate.templateText}
                onChange={(e) =>
                  setEditingTemplate({ ...editingTemplate, templateText: e.target.value })
                }
              ></textarea>
              <div className="flex gap-2">
                <button
                  className={`p-2 bg-green-500 text-white rounded ${loading && 'opacity-50'}`}
                  onClick={updateTemplate}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Update Template'}
                </button>
                <button
                  className="p-2 bg-gray-400 text-white rounded"
                  onClick={() => setEditingTemplate(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Display Templates */}
        <h2 className="text-xl font-semibold mb-4">Template List</h2>
        {loading ? (
          <div className="text-gray-500">Loading templates...</div>
        ) : (
          <ul className="space-y-4">
            {templates.map((template) => (
              <li
                key={template.id}
                className="bg-gray-100 p-4 rounded shadow-md flex justify-between items-center"
              >
                <div>
                  <strong className="block text-lg">{template.name}</strong>
                  <p className="text-sm text-gray-600">{template.templateText}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    className="p-2 bg-yellow-400 text-white rounded"
                    onClick={() => editTemplate(template.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="p-2 bg-red-500 text-white rounded"
                    onClick={() => deleteTemplate(template.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
};

export default NotificationTemplatesPage;

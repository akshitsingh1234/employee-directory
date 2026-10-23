
import { useCallback, useEffect, useState, type FormEvent } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Pencil,
  Trash2,
  X,
  LoaderCircle,
  BriefcaseBusiness,
  Mail,
  RefreshCw,
  UserRound,
} from 'lucide-react';
import { employeeApi, getApiError } from './services/employeeApi';
import type { Employee, EmployeeInput } from './types/employee';
import './App.css';

const emptyForm: EmployeeInput = {
  name: '',
  email: '',
  role: '',
};

function App() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState<EmployeeInput>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadEmployees = useCallback(async (query: string) => {
    setLoading(true);
    setError('');

    try {
      const data = await employeeApi.getAll(query);
      setEmployees(data);
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadEmployees(search);
  }, [loadEmployees, search]);

  function openCreateForm() {
    setEditingId(null);
    setForm(emptyForm);
    setNotice('');
    setError('');
    setFormOpen(true);
  }

  function openEditForm(employee: Employee) {
    setEditingId(employee.id);
    setForm({
      name: employee.name,
      email: employee.email,
      role: employee.role,
    });
    setNotice('');
    setError('');
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setNotice('');

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      role: form.role.trim(),
    };

    if (!payload.name || !payload.email || !payload.role) {
      setError('Please complete all three fields.');
      return;
    }

    setSaving(true);

    try {
      if (editingId !== null) {
        await employeeApi.update(editingId, payload);
        setNotice('Employee updated successfully.');
      } else {
        await employeeApi.create(payload);
        setNotice('Employee added successfully.');
      }

      closeForm();
      await loadEmployees(search);
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(employee: Employee) {
    const confirmed = window.confirm(
      `Delete ${employee.name} from the directory?`,
    );

    if (!confirmed) return;

    setError('');
    setNotice('');

    try {
      await employeeApi.remove(employee.id);
      setNotice(`${employee.name} was deleted.`);
      await loadEmployees(search);
    } catch (err) {
      setError(getApiError(err));
    }
  }

  const inputClass = 'form-input';

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="PeopleHub home">
          <span className="brand-icon"><Users size={23} /></span>
          <span>PeopleHub</span>
        </a>
        <span className="topbar-label">EMPLOYEE MANAGEMENT</span>
      </header>

      <section className="page-content">
        <div className="page-heading">
          <div>
            <div className="eyebrow">YOUR ORGANIZATION</div>
            <h1>Employee Directory</h1>
            <p className="subtitle">
              Manage your team members and their information in one place.
            </p>
          </div>

          <button className="primary-button" onClick={openCreateForm}>
            <UserPlus size={18} />
            <span>Add employee</span>
          </button>
        </div>

        <section className="stats-card">
          <div className="stat-icon"><Users size={22} /></div>
          <div>
            <p className="stat-label">Total employees</p>
            <p className="stat-number">{employees.length}</p>
          </div>
          <span className="stat-caption">
            {search ? 'Matching your search' : 'In your directory'}
          </span>
        </section>

        {notice && (
          <div className="notice-banner" role="status">
            {notice}
            <button aria-label="Dismiss message" onClick={() => setNotice('')}>
              <X size={16} />
            </button>
          </div>
        )}

        {error && (
          <div className="error-banner" role="alert">
            <span>{error}</span>
            <button aria-label="Dismiss error" onClick={() => setError('')}>
              <X size={16} />
            </button>
          </div>
        )}

        <section className="directory-card">
          <div className="directory-toolbar">
            <div>
              <h2>All employees</h2>
              <p>View and manage your team</p>
            </div>

            <div className="toolbar-actions">
              <label className="search-box">
                <Search size={18} />
                <input
                  type="search"
                  placeholder="Search employees..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  aria-label="Search employees by name, email, or role"
                />
                {search && (
                  <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() => setSearch('')}
                  >
                    <X size={16} />
                  </button>
                )}
              </label>

              <button
                className="icon-button refresh-button"
                aria-label="Refresh employees"
                onClick={() => void loadEmployees(search)}
                disabled={loading}
              >
                <RefreshCw size={17} />
              </button>
            </div>
          </div>

          <div className="employee-table-wrap">
            <table className="employee-table">
              <thead>
                <tr>
                  <th>EMPLOYEE</th>
                  <th>ROLE</th>
                  <th>DATE ADDED</th>
                  <th className="actions-heading">ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="state-cell">
                      <LoaderCircle className="spinner" size={26} />
                      <span>Loading employees...</span>
                    </td>
                  </tr>
                ) : employees.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="state-cell">
                      <div className="empty-state">
                        <span className="empty-icon"><Users size={25} /></span>
                        <strong>
                          {search ? 'No matching employees' : 'No employees yet'}
                        </strong>
                        <span>
                          {search
                            ? 'Try another name, email, or role.'
                            : 'Add your first employee to get started.'}
                        </span>
                        {!search && (
                          <button
                            className="primary-button small-button"
                            onClick={openCreateForm}
                          >
                            <UserPlus size={16} /> Add employee
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  employees.map((employee) => (
                    <tr key={employee.id}>
                      <td>
                        <div className="employee-identity">
                          <span className="avatar">
                            {employee.name.trim().charAt(0).toUpperCase()}
                          </span>
                          <div className="employee-details">
                            <strong>{employee.name}</strong>
                            <span><Mail size={13} /> {employee.email}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="role-label">
                          <BriefcaseBusiness size={14} />
                          {employee.role}
                        </span>
                      </td>
                      <td className="date-cell">
                        {employee.created_at
                          ? new Date(employee.created_at).toLocaleDateString(
                              undefined,
                              { day: 'numeric', month: 'short', year: 'numeric' },
                            )
                          : '—'}
                      </td>
                      <td>
                        <div className="row-actions">
                          <button
                            className="icon-button edit-button"
                            aria-label={`Edit ${employee.name}`}
                            title="Edit employee"
                            onClick={() => openEditForm(employee)}
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            className="icon-button delete-button"
                            aria-label={`Delete ${employee.name}`}
                            title="Delete employee"
                            onClick={() => void handleDelete(employee)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <footer className="table-footer">
            <span>
              Showing {employees.length} employee{employees.length === 1 ? '' : 's'}
            </span>
            <span className="connection-status">
              <span className="status-dot" /> Connected to directory
            </span>
          </footer>
        </section>

        <p className="page-footer">PeopleHub · Employee management made simple</p>
      </section>

      {formOpen && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeForm();
          }}
        >
          <section
            className="employee-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="form-title"
          >
            <div className="modal-heading">
              <span className="modal-icon"><UserRound size={22} /></span>
              <button
                className="icon-button close-button"
                aria-label="Close form"
                onClick={closeForm}
              >
                <X size={20} />
              </button>
              <h2 id="form-title">
                {editingId !== null ? 'Edit employee' : 'Add new employee'}
              </h2>
              <p>
                {editingId !== null
                  ? 'Update the employee information below.'
                  : 'Enter the details to add someone to your directory.'}
              </p>
            </div>

            <form className="employee-form" onSubmit={handleSubmit}>
              <label>
                Full name
                <input
                  className={inputClass}
                  value={form.name}
                  onChange={(event) =>
                    setForm({ ...form, name: event.target.value })
                  }
                  placeholder="e.g. Rahul Sharma"
                  maxLength={100}
                  autoFocus
                  required
                />
              </label>

              <label>
                Email address
                <input
                  className={inputClass}
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    setForm({ ...form, email: event.target.value })
                  }
                  placeholder="e.g. rahul@company.com"
                  maxLength={255}
                  required
                />
              </label>

              <label>
                Job role
                <input
                  className={inputClass}
                  value={form.role}
                  onChange={(event) =>
                    setForm({ ...form, role: event.target.value })
                  }
                  placeholder="e.g. Software Engineer"
                  maxLength={100}
                  required
                />
              </label>

              {error && <p className="form-error" role="alert">{error}</p>}

              <div className="form-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={closeForm}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="primary-button"
                  disabled={saving}
                >
                  {saving && <LoaderCircle className="spinner" size={17} />}
                  {saving
                    ? 'Saving...'
                    : editingId !== null
                      ? 'Save changes'
                      : 'Add employee'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}

export default App;

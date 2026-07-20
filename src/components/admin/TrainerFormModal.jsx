import { useEffect, useState } from 'react';
import Modal from '../common/Modal';

const emptyForm = { name: '', email: '', password: '', specialization: '' };

const TrainerFormModal = ({ open, onClose, onSubmit, initialData }) => {
  const [form, setForm] = useState(emptyForm);
  const isEdit = Boolean(initialData);

  useEffect(() => {
    if (initialData) {
      setForm({ name: initialData.name, email: initialData.email, password: '', specialization: initialData.specialization || '' });
    } else {
      setForm(emptyForm);
    }
  }, [initialData, open]);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...form };
    if (isEdit && !payload.password) delete payload.password;
    onSubmit(payload);
  };

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit Trainer' : 'Add Trainer'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label-text">Full Name</label>
          <input name="name" required className="input-field" value={form.name} onChange={handleChange} />
        </div>
        <div>
          <label className="label-text">Email</label>
          <input type="email" name="email" required className="input-field" value={form.email} onChange={handleChange} />
        </div>
        <div>
          <label className="label-text">Specialization</label>
          <input name="specialization" className="input-field" value={form.specialization} onChange={handleChange} />
        </div>
        <div>
          <label className="label-text">{isEdit ? 'New Password (optional)' : 'Password'}</label>
          <input
            type="password"
            name="password"
            required={!isEdit}
            minLength={6}
            className="input-field"
            value={form.password}
            onChange={handleChange}
          />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            {isEdit ? 'Save Changes' : 'Create Trainer'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TrainerFormModal;

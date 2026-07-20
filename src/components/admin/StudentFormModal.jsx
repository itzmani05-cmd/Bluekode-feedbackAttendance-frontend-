import { useEffect, useState } from 'react';
import Modal from '../common/Modal';

const emptyForm = { name: '', email: '', batch: '', assignedTrainer: '' };

const StudentFormModal = ({ open, onClose, onSubmit, initialData, trainers }) => {
  const [form, setForm] = useState(emptyForm);
  const isEdit = Boolean(initialData);

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name,
        email: initialData.email,
        batch: initialData.batch,
        assignedTrainer: initialData.assignedTrainer?._id || '',
      });
    } else {
      setForm(emptyForm);
    }
  }, [initialData, open]);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit Student' : 'Add Student'}>
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
          <label className="label-text">Batch</label>
          <input name="batch" required className="input-field" value={form.batch} onChange={handleChange} />
        </div>
        <div>
          <label className="label-text">Assigned Trainer</label>
          <select name="assignedTrainer" className="input-field" value={form.assignedTrainer} onChange={handleChange}>
            <option value="">Unassigned</option>
            {trainers.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col-reverse justify-end gap-3 pt-2 sm:flex-row">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            {isEdit ? 'Save Changes' : 'Create Student'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default StudentFormModal;

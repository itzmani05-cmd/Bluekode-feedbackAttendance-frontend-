import { useEffect, useState, useCallback } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Layout from '../../components/common/Layout';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import SearchBar from '../../components/common/SearchBar';
import Pagination from '../../components/common/Pagination';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Badge from '../../components/common/Badge';
import { SkeletonTable } from '../../components/common/Skeleton';
import StudentFormModal from '../../components/admin/StudentFormModal';
import useDebounce from '../../hooks/useDebounce';
import useToast from '../../hooks/useToast';
import { getStudents, createStudent, updateStudent, deleteStudent, getBatches } from '../../api/studentService';
import { getTrainers } from '../../api/trainerService';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [batchFilter, setBatchFilter] = useState('');
  const [trainerFilter, setTrainerFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ pages: 1, total: 0 });
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const debouncedSearch = useDebounce(search);
  const toast = useToast();

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getStudents({
        search: debouncedSearch,
        batch: batchFilter,
        trainer: trainerFilter,
        page,
        limit: 8,
      });
      setStudents(res.data);
      setPagination(res.pagination);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load students');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, batchFilter, trainerFilter, page]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  useEffect(() => setPage(1), [debouncedSearch, batchFilter, trainerFilter]);

  useEffect(() => {
    getTrainers({ limit: 100 }).then((res) => setTrainers(res.data));
    getBatches().then(setBatches);
  }, []);

  const handleSave = async (payload) => {
    try {
      if (editing) {
        await updateStudent(editing._id, payload);
        toast.success('Student updated');
      } else {
        await createStudent(payload);
        toast.success('Student created');
      }
      setModalOpen(false);
      setEditing(null);
      fetchStudents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteStudent(deleteTarget._id);
      toast.success('Student deleted');
      setDeleteTarget(null);
      fetchStudents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'batch', header: 'Batch', render: (r) => <Badge variant="blue">{r.batch}</Badge> },
    { key: 'assignedTrainer', header: 'Trainer', render: (r) => r.assignedTrainer?.name || <span className="text-gray-400">Unassigned</span> },
    {
      key: 'actions',
      header: 'Actions',
      render: (r) => (
        <div className="flex gap-2">
          <button
            className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-primary-600"
            onClick={() => {
              setEditing(r);
              setModalOpen(true);
            }}
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            className="rounded-md p-2 text-gray-500 hover:bg-red-50 hover:text-red-600"
            onClick={() => setDeleteTarget(r)}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Students</h2>
        <button
          className="btn-primary w-full sm:w-auto"
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
        >
          <Plus className="h-4 w-4" /> Add Student
        </button>
      </div>

      <Card>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchBar value={search} onChange={setSearch} placeholder="Search students by name, email..." />
          <select className="input-field sm:max-w-[180px]" value={batchFilter} onChange={(e) => setBatchFilter(e.target.value)}>
            <option value="">All Batches</option>
            {batches.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
          <select className="input-field sm:max-w-[200px]" value={trainerFilter} onChange={(e) => setTrainerFilter(e.target.value)}>
            <option value="">All Trainers</option>
            {trainers.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
        {loading ? (
          <SkeletonTable />
        ) : (
          <>
            <Table columns={columns} rows={students} />
            <Pagination page={page} pages={pagination.pages} total={pagination.total} onPageChange={setPage} />
          </>
        )}
      </Card>

      <StudentFormModal
        open={modalOpen}
        initialData={editing}
        trainers={trainers}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSubmit={handleSave}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Student"
        message={`Are you sure you want to delete "${deleteTarget?.name}"?`}
        confirmLabel="Delete"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </Layout>
  );
};

export default Students;

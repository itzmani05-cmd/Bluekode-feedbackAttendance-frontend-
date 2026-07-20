import { useEffect, useState, useCallback } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Layout from '../../components/common/Layout';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import SearchBar from '../../components/common/SearchBar';
import Pagination from '../../components/common/Pagination';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { SkeletonTable } from '../../components/common/Skeleton';
import TrainerFormModal from '../../components/admin/TrainerFormModal';
import useDebounce from '../../hooks/useDebounce';
import useToast from '../../hooks/useToast';
import { getTrainers, createTrainer, updateTrainer, deleteTrainer } from '../../api/trainerService';

const Trainers = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ pages: 1, total: 0 });
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const debouncedSearch = useDebounce(search);
  const toast = useToast();

  const fetchTrainers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getTrainers({ search: debouncedSearch, page, limit: 8 });
      setTrainers(res.data);
      setPagination(res.pagination);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load trainers');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, page]);

  useEffect(() => {
    fetchTrainers();
  }, [fetchTrainers]);

  useEffect(() => setPage(1), [debouncedSearch]);

  const handleSave = async (payload) => {
    try {
      if (editing) {
        await updateTrainer(editing._id, payload);
        toast.success('Trainer updated');
      } else {
        await createTrainer(payload);
        toast.success('Trainer created');
      }
      setModalOpen(false);
      setEditing(null);
      fetchTrainers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTrainer(deleteTarget._id);
      toast.success('Trainer deleted');
      setDeleteTarget(null);
      fetchTrainers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'specialization', header: 'Specialization', render: (r) => r.specialization || '—' },
    {
      key: 'actions',
      header: 'Actions',
      render: (r) => (
        <div className="flex gap-2">
          <button
            className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-primary-600"
            onClick={() => {
              setEditing(r);
              setModalOpen(true);
            }}
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            className="rounded-md p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600"
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
        <h2 className="text-xl font-semibold text-gray-800">Trainers</h2>
        <button
          className="btn-primary"
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
        >
          <Plus className="h-4 w-4" /> Add Trainer
        </button>
      </div>

      <Card>
        <div className="mb-4">
          <SearchBar value={search} onChange={setSearch} placeholder="Search trainers by name, email..." />
        </div>
        {loading ? (
          <SkeletonTable />
        ) : (
          <>
            <Table columns={columns} rows={trainers} />
            <Pagination page={page} pages={pagination.pages} total={pagination.total} onPageChange={setPage} />
          </>
        )}
      </Card>

      <TrainerFormModal
        open={modalOpen}
        initialData={editing}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSubmit={handleSave}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Trainer"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? Assigned students will become unassigned.`}
        confirmLabel="Delete"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </Layout>
  );
};

export default Trainers;

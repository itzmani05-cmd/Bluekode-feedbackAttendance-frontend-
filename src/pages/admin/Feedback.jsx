import { useEffect, useState, useCallback } from 'react';
import Layout from '../../components/common/Layout';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import SearchBar from '../../components/common/SearchBar';
import Pagination from '../../components/common/Pagination';
import Badge from '../../components/common/Badge';
import StarRating from '../../components/common/StarRating';
import { SkeletonCard, SkeletonTable } from '../../components/common/Skeleton';
import useDebounce from '../../hooks/useDebounce';
import useToast from '../../hooks/useToast';
import { getAllFeedback, getTrainerRatings } from '../../api/feedbackService';
import { getTrainers } from '../../api/trainerService';

const Feedback = () => {
  const [feedback, setFeedback] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [ratingsLoading, setRatingsLoading] = useState(true);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [trainerFilter, setTrainerFilter] = useState('');
  const [minRating, setMinRating] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ pages: 1, total: 0 });

  const debouncedSearch = useDebounce(search);
  const toast = useToast();

  const fetchFeedback = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAllFeedback({ search: debouncedSearch, trainer: trainerFilter, minRating, page, limit: 8 });
      setFeedback(res.data);
      setPagination(res.pagination);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load feedback');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, trainerFilter, minRating, page]);

  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]);

  useEffect(() => setPage(1), [debouncedSearch, trainerFilter, minRating]);

  useEffect(() => {
    getTrainers({ limit: 100 }).then((res) => setTrainers(res.data));
    getTrainerRatings()
      .then(setRatings)
      .finally(() => setRatingsLoading(false));
  }, []);

  const columns = [
    { key: 'date', header: 'Date', render: (r) => new Date(r.date).toLocaleDateString() },
    { key: 'trainer', header: 'Trainer', render: (r) => r.trainer?.name },
    { key: 'rating', header: 'Overall', render: (r) => <StarRating value={r.rating} size="h-4 w-4" /> },
    { key: 'trainerKnowledge', header: 'Knowledge' },
    { key: 'communication', header: 'Communication' },
    { key: 'helpful', header: 'Helpful', render: (r) => <Badge variant={r.helpful ? 'green' : 'red'}>{r.helpful ? 'Yes' : 'No'}</Badge> },
    { key: 'remarks', header: 'Remarks', render: (r) => r.remarks || <span className="text-gray-400">—</span> },
  ];

  return (
    <Layout>
      <h2 className="mb-5 text-xl font-semibold text-gray-800">Anonymous Feedback</h2>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ratingsLoading
          ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
          : ratings.map((r) => (
              <Card key={r.trainerId} className="!p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{r.name}</p>
                    <p className="text-xs text-gray-500">{r.specialization || 'General'}</p>
                  </div>
                  <StarRating value={Math.round(r.avgRating)} size="h-4 w-4" />
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                  <div>
                    <p className="font-semibold text-gray-800">{r.avgRating}</p>
                    <p className="text-gray-500">Avg Rating</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{r.totalFeedback}</p>
                    <p className="text-gray-500">Responses</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{r.helpfulPercentage}%</p>
                    <p className="text-gray-500">Helpful</p>
                  </div>
                </div>
              </Card>
            ))}
        {!ratingsLoading && ratings.length === 0 && (
          <p className="col-span-full py-4 text-center text-sm text-gray-400">No feedback data yet</p>
        )}
      </div>

      <Card>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchBar value={search} onChange={setSearch} placeholder="Search remarks..." />
          <select className="input-field sm:max-w-[200px]" value={trainerFilter} onChange={(e) => setTrainerFilter(e.target.value)}>
            <option value="">All Trainers</option>
            {trainers.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name}
              </option>
            ))}
          </select>
          <select className="input-field sm:max-w-[160px]" value={minRating} onChange={(e) => setMinRating(e.target.value)}>
            <option value="">Any Rating</option>
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n}+ stars
              </option>
            ))}
          </select>
        </div>
        {loading ? (
          <SkeletonTable />
        ) : (
          <>
            <Table columns={columns} rows={feedback} keyField="_id" emptyText="No feedback found" />
            <Pagination page={page} pages={pagination.pages} total={pagination.total} onPageChange={setPage} />
          </>
        )}
      </Card>
    </Layout>
  );
};

export default Feedback;

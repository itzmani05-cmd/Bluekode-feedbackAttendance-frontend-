import { useEffect, useState, useCallback } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Layout from '../../components/common/Layout';
import Card from '../../components/common/Card';
import Pagination from '../../components/common/Pagination';
import Badge from '../../components/common/Badge';
import { SkeletonTable } from '../../components/common/Skeleton';
import useToast from '../../hooks/useToast';
import { getAttendanceReports } from '../../api/attendanceService';
import { getTrainers } from '../../api/trainerService';

const AttendanceReports = () => {
  const [records, setRecords] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trainerFilter, setTrainerFilter] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ pages: 1, total: 0 });
  const [expanded, setExpanded] = useState(null);

  const toast = useToast();

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAttendanceReports({ trainer: trainerFilter, from, to, page, limit: 8 });
      setRecords(res.data);
      setPagination(res.pagination);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load attendance reports');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trainerFilter, from, to, page]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  useEffect(() => setPage(1), [trainerFilter, from, to]);

  useEffect(() => {
    getTrainers({ limit: 100 }).then((res) => setTrainers(res.data));
  }, []);

  return (
    <Layout>
      <h2 className="mb-5 text-xl font-semibold text-gray-800">Attendance Reports</h2>

      <Card>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <select className="input-field sm:max-w-[200px]" value={trainerFilter} onChange={(e) => setTrainerFilter(e.target.value)}>
            <option value="">All Trainers</option>
            {trainers.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name}
              </option>
            ))}
          </select>
          <input type="date" className="input-field sm:max-w-[170px]" value={from} onChange={(e) => setFrom(e.target.value)} />
          <span className="hidden text-sm text-gray-400 sm:inline">to</span>
          <input type="date" className="input-field sm:max-w-[170px]" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>

        {loading ? (
          <SkeletonTable />
        ) : records.length === 0 ? (
          <p className="py-10 text-center text-sm text-gray-400">No attendance records found</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {records.map((rec) => {
              const present = rec.students.filter((s) => s.status === 'present').length;
              const isOpen = expanded === rec._id;
              return (
                <div key={rec._id} className="py-3">
                  <button
                    className="flex w-full flex-wrap items-center justify-between gap-2 text-left"
                    onClick={() => setExpanded(isOpen ? null : rec._id)}
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-gray-800">{rec.trainer?.name || 'Unknown trainer'}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(rec.date).toLocaleDateString()} · {rec.batch}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <Badge variant="green">
                        {present}/{rec.students.length} present
                      </Badge>
                      {isOpen ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
                    </div>
                  </button>
                  {isOpen && (
                    <div className="mt-3 overflow-x-auto rounded-lg border border-gray-100">
                      <table className="min-w-full divide-y divide-gray-100 text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 py-2 text-left text-xs font-semibold uppercase text-gray-500">Student</th>
                            <th className="px-3 py-2 text-left text-xs font-semibold uppercase text-gray-500">Status</th>
                            <th className="px-3 py-2 text-left text-xs font-semibold uppercase text-gray-500">Feedback Sent</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {rec.students.map((s) => (
                            <tr key={s.studentId?._id || s.studentId}>
                              <td className="px-3 py-2">{s.studentId?.name || 'Unknown'}</td>
                              <td className="px-3 py-2">
                                <Badge variant={s.status === 'present' ? 'green' : 'red'}>{s.status}</Badge>
                              </td>
                              <td className="px-3 py-2">{s.feedbackSent ? 'Yes' : '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        <Pagination page={page} pages={pagination.pages} total={pagination.total} onPageChange={setPage} />
      </Card>
    </Layout>
  );
};

export default AttendanceReports;

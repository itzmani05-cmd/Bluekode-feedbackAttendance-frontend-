import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Send } from 'lucide-react';
import Layout from '../../components/common/Layout';
import Card from '../../components/common/Card';
import { SkeletonTable } from '../../components/common/Skeleton';
import useToast from '../../hooks/useToast';
import { getMyStudents } from '../../api/studentService';
import { markAttendance, getAttendanceStatus } from '../../api/attendanceService';

const todayISO = () => new Date().toISOString().slice(0, 10);

const BatchAttendancePanel = ({ batch, students, onSubmitted }) => {
  const [attendance, setAttendance] = useState(() => Object.fromEntries(students.map((s) => [s._id, false])));
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const toggle = (id) => setAttendance((a) => ({ ...a, [id]: !a[id] }));
  const markAll = (present) => setAttendance(Object.fromEntries(students.map((s) => [s._id, present])));
  const presentCount = Object.values(attendance).filter(Boolean).length;

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload = {
        date: todayISO(),
        batch,
        students: students.map((s) => ({ studentId: s._id, status: attendance[s._id] ? 'present' : 'absent' })),
      };
      const record = await markAttendance(payload);
      toast.success(`Attendance submitted for ${batch}. Feedback emails sent to present students.`);
      onSubmitted(record);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit attendance');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card title={batch} actions={
      <div className="flex gap-2">
        <button className="btn-secondary !px-2.5 !py-1.5 text-xs" onClick={() => markAll(true)}>
          Mark All Present
        </button>
        <button className="btn-secondary !px-2.5 !py-1.5 text-xs" onClick={() => markAll(false)}>
          Mark All Absent
        </button>
      </div>
    }>
      <div className="divide-y divide-gray-100">
        {students.map((s) => (
          <label key={s._id} className="flex cursor-pointer items-center justify-between gap-3 py-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-gray-800">{s.name}</p>
              <p className="truncate text-xs text-gray-500">{s.email}</p>
            </div>
            <input
              type="checkbox"
              className="h-5 w-5 shrink-0 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              checked={Boolean(attendance[s._id])}
              onChange={() => toggle(s._id)}
            />
          </label>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">
        <p className="text-sm text-gray-500">
          <span className="font-semibold text-gray-800">{presentCount}</span> / {students.length} marked present
        </p>
        <button className="btn-primary" disabled={submitting} onClick={handleSubmit}>
          <Send className="h-4 w-4" />
          {submitting ? 'Submitting...' : 'Submit Attendance'}
        </button>
      </div>
    </Card>
  );
};

const BatchDoneCard = ({ batch, record }) => {
  const present = record.students.filter((s) => s.status === 'present').length;
  return (
    <Card>
      <div className="flex items-center gap-4">
        <CheckCircle2 className="h-9 w-9 shrink-0 text-green-500" />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-800">{batch} — Attendance already submitted</p>
          <p className="text-xs text-gray-500">
            {present} of {record.students.length} students marked present. Feedback emails have been sent.
          </p>
        </div>
      </div>
    </Card>
  );
};

const TrainerDashboard = () => {
  const [students, setStudents] = useState([]);
  const [completedRecords, setCompletedRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const loadStatus = async () => {
    const records = await getAttendanceStatus(todayISO());
    setCompletedRecords(records);
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [myStudents] = await Promise.all([getMyStudents(), loadStatus()]);
        setStudents(myStudents);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to load students');
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const batches = useMemo(() => {
    const grouped = {};
    students.forEach((s) => {
      if (!grouped[s.batch]) grouped[s.batch] = [];
      grouped[s.batch].push(s);
    });
    return grouped;
  }, [students]);

  const completedBatchNames = useMemo(() => new Set(completedRecords.map((r) => r.batch)), [completedRecords]);

  if (loading) {
    return (
      <Layout>
        <SkeletonTable />
      </Layout>
    );
  }

  const batchNames = Object.keys(batches);

  return (
    <Layout>
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-gray-800">Mark Today's Attendance</h2>
        <p className="text-sm text-gray-500">
          {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {batchNames.length === 0 ? (
        <Card>
          <p className="py-10 text-center text-sm text-gray-400">No students are assigned to you yet.</p>
        </Card>
      ) : (
        <div className="space-y-6">
          {batchNames.map((batch) => {
            const doneRecord = completedRecords.find((r) => r.batch === batch);
            if (completedBatchNames.has(batch)) {
              return <BatchDoneCard key={batch} batch={batch} record={doneRecord} />;
            }
            return (
              <BatchAttendancePanel
                key={batch}
                batch={batch}
                students={batches[batch]}
                onSubmitted={(record) => setCompletedRecords((prev) => [...prev, record])}
              />
            );
          })}
        </div>
      )}
    </Layout>
  );
};

export default TrainerDashboard;

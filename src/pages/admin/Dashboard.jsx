import { useEffect, useState } from 'react';
import { Users, GraduationCap, CalendarCheck, Percent, MessageSquareText, Star } from 'lucide-react';
import { getDashboard } from '../../api/dashboardService';
import Layout from '../../components/common/Layout';
import Card from '../../components/common/Card';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import StarRating from '../../components/common/StarRating';
import { SkeletonCard, SkeletonTable } from '../../components/common/Skeleton';
import useToast from '../../hooks/useToast';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    getDashboard()
      .then(setData)
      .catch((err) => toast.error(err.response?.data?.message || 'Failed to load dashboard'))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <SkeletonTable />
          <SkeletonTable />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <h2 className="mb-5 text-xl font-semibold text-gray-800">Dashboard Overview</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Total Students" value={data.totalStudents} icon={GraduationCap} />
        <StatCard label="Total Trainers" value={data.totalTrainers} icon={Users} accent="bg-purple-50 text-purple-600" />
        <StatCard
          label="Today's Attendance"
          value={`${data.todayAttendance.present}/${data.todayAttendance.total}`}
          icon={CalendarCheck}
          accent="bg-green-50 text-green-600"
        />
        <StatCard
          label="Attendance %"
          value={`${data.attendancePercentage}%`}
          icon={Percent}
          accent="bg-amber-50 text-amber-600"
        />
        <StatCard
          label="Feedback Submission %"
          value={`${data.feedbackSubmissionPercentage}%`}
          icon={MessageSquareText}
          accent="bg-sky-50 text-sky-600"
        />
        <StatCard
          label="Average Trainer Rating"
          value={data.averageTrainerRating || '—'}
          icon={Star}
          accent="bg-rose-50 text-rose-600"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="Recent Attendance">
          <div className="divide-y divide-gray-100">
            {data.recentAttendance.length === 0 && <p className="py-6 text-center text-sm text-gray-400">No attendance yet</p>}
            {data.recentAttendance.map((rec) => {
              const present = rec.students.filter((s) => s.status === 'present').length;
              return (
                <div key={rec._id} className="flex items-center justify-between gap-3 py-3 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-gray-800">{rec.trainer?.name || 'Unknown trainer'}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(rec.date).toLocaleDateString()} · {rec.batch}
                    </p>
                  </div>
                  <Badge variant="green">
                    {present}/{rec.students.length} present
                  </Badge>
                </div>
              );
            })}
          </div>
        </Card>

        <Card title="Recent Feedback">
          <div className="divide-y divide-gray-100">
            {data.recentFeedback.length === 0 && <p className="py-6 text-center text-sm text-gray-400">No feedback yet</p>}
            {data.recentFeedback.map((fb) => (
              <div key={fb._id} className="py-3 text-sm">
                <div className="flex items-center justify-between">
                  <StarRating value={fb.rating} size="h-4 w-4" />
                  <span className="text-xs text-gray-400">{new Date(fb.submittedAt).toLocaleDateString()}</span>
                </div>
                {fb.remarks && <p className="mt-1 text-gray-600">{fb.remarks}</p>}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;

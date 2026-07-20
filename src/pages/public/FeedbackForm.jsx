import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle2, XCircle, School } from 'lucide-react';
import StarRating from '../../components/common/StarRating';
import { SkeletonCard } from '../../components/common/Skeleton';
import { validateFeedbackToken, submitFeedback } from '../../api/feedbackService';
import useToast from '../../hooks/useToast';

const FeedbackForm = () => {
  const { token } = useParams();
  const toast = useToast();

  const [status, setStatus] = useState('loading'); // loading | valid | invalid | submitted
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [rating, setRating] = useState(0);
  const [trainerKnowledge, setTrainerKnowledge] = useState(0);
  const [communication, setCommunication] = useState(0);
  const [helpful, setHelpful] = useState(null);
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    validateFeedbackToken(token)
      .then(() => setStatus('valid'))
      .catch((err) => {
        setErrorMsg(err.response?.data?.message || 'This feedback link is invalid or has expired.');
        setStatus('invalid');
      });
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !trainerKnowledge || !communication || helpful === null) {
      toast.error('Please complete all rating fields');
      return;
    }
    setSubmitting(true);
    try {
      await submitFeedback(token, { rating, trainerKnowledge, communication, helpful, remarks });
      setStatus('submitted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-900 to-primary-700 px-4 py-10">
      <div className="w-full max-w-lg">
        <div className="mb-6 flex flex-col items-center text-center text-white">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
            <School className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-semibold">Anonymous Session Feedback</h1>
          <p className="mt-1 text-sm text-primary-100">Your response is completely anonymous</p>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-2xl">
          {status === 'loading' && <SkeletonCard />}

          {status === 'invalid' && (
            <div className="py-6 text-center">
              <XCircle className="mx-auto h-12 w-12 text-red-500" />
              <h2 className="mt-4 text-lg font-semibold text-gray-800">Link Unavailable</h2>
              <p className="mt-1 text-sm text-gray-500">{errorMsg}</p>
            </div>
          )}

          {status === 'submitted' && (
            <div className="py-6 text-center">
              <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
              <h2 className="mt-4 text-lg font-semibold text-gray-800">Thank you for your feedback!</h2>
              <p className="mt-1 text-sm text-gray-500">Your anonymous response has been recorded.</p>
            </div>
          )}

          {status === 'valid' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <p className="label-text">Overall Rating</p>
                <StarRating value={rating} onChange={setRating} />
              </div>
              <div>
                <p className="label-text">Trainer Knowledge</p>
                <StarRating value={trainerKnowledge} onChange={setTrainerKnowledge} />
              </div>
              <div>
                <p className="label-text">Communication</p>
                <StarRating value={communication} onChange={setCommunication} />
              </div>
              <div>
                <p className="label-text">Was the session helpful?</p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setHelpful(true)}
                    className={`flex-1 rounded-lg border py-2 text-sm font-medium transition-colors ${
                      helpful === true ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-gray-300 text-gray-600'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setHelpful(false)}
                    className={`flex-1 rounded-lg border py-2 text-sm font-medium transition-colors ${
                      helpful === false ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-300 text-gray-600'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>
              <div>
                <label className="label-text">Remarks (optional)</label>
                <textarea
                  className="input-field min-h-[90px]"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Anything else you'd like to share..."
                  maxLength={1000}
                />
              </div>
              <button type="submit" disabled={submitting} className="btn-primary w-full">
                {submitting ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackForm;

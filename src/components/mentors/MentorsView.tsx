import React, { useState } from 'react';
import { Users, Star, Calendar, MessageSquare, CheckCircle2, Award, Clock } from 'lucide-react';
import { MENTORS_LIST } from '../../data/mentorshipData';
import { MentorProfile } from '../../types';
import { useApp } from '../../context/AppContext';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';

export const MentorsView: React.FC = () => {
  const { addToast } = useApp();
  const [selectedMentor, setSelectedMentor] = useState<MentorProfile | null>(null);
  const [sessionTopic, setSessionTopic] = useState('');
  const [sessionDate, setSessionDate] = useState('2026-09-02');
  const [bookedSessions, setBookedSessions] = useState<string[]>([]);

  const handleBookSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMentor) return;
    setBookedSessions(prev => [...prev, selectedMentor.id]);
    addToast('Session Booked! 📅', `1-on-1 Office Hours booked with ${selectedMentor.name}.`, 'success');
    setSelectedMentor(null);
    setSessionTopic('');
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-6xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-850 via-slate-850 to-blue-950/30 border border-blue-850/40 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-700/50 text-blue-300 text-xs font-semibold">
            <Users className="w-3.5 h-3.5 text-blue-400" />
            <span>Phase 5: Mentor Network &amp; Office Hours</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
            Student Mentorship Network
          </h2>
          <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
            Connect with verified software engineers, researchers, and educators for 1-on-1 code reviews and academic guidance.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
          <span className="text-xs text-slate-400">Scheduled Sessions</span>
          <p className="text-2xl font-bold text-sky-400 mt-0.5">{bookedSessions.length}</p>
        </div>
      </div>

      {/* Mentor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {MENTORS_LIST.map(mentor => {
          const isBooked = bookedSessions.includes(mentor.id);

          return (
            <Card key={mentor.id} className="p-6 flex flex-col justify-between border-slate-800 space-y-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{mentor.avatar}</span>
                    <div>
                      <h3 className="text-base font-bold text-slate-100">{mentor.name}</h3>
                      <p className="text-xs text-slate-400">{mentor.roleTitle}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-amber-400 font-bold bg-slate-900 px-2 py-0.5 rounded-lg border border-slate-800">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{mentor.rating}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{mentor.bio}</p>

                <div className="space-y-1.5 pt-2 border-t border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Expertise</span>
                  <div className="flex flex-wrap gap-1.5">
                    {mentor.expertise.map((exp, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-sky-300">
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>{mentor.availability}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800">
                {isBooked ? (
                  <button
                    disabled
                    className="w-full py-2.5 rounded-xl bg-emerald-950/60 border border-emerald-700/60 text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Session Confirmed</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setSelectedMentor(mentor)}
                    className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-md transition flex items-center justify-center gap-1.5"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Book 1-on-1 Office Hours</span>
                  </button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Booking Modal */}
      {selectedMentor && (
        <Modal
          isOpen={!!selectedMentor}
          onClose={() => setSelectedMentor(null)}
          title={`Book Office Hours with ${selectedMentor.name}`}
          maxWidth="md"
        >
          <form onSubmit={handleBookSession} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Topic / Project for Review</label>
              <input
                type="text"
                required
                value={sessionTopic}
                onChange={e => setSessionTopic(e.target.value)}
                placeholder="e.g. Code Review on my Interactive Calculator & CSS Grid"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Date Selection</label>
              <input
                type="date"
                required
                value={sessionDate}
                onChange={e => setSessionDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none"
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="font-bold text-slate-200">Mentor Availability:</span>
              <p className="text-slate-400">{selectedMentor.availability}</p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedMentor(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold shadow"
              >
                Confirm Booking
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

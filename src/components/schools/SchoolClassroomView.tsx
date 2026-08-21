import React, { useState } from 'react';
import { School, BookOpen, CheckCircle2, Clock, Plus, Award, Send } from 'lucide-react';
import { CLASSROOMS_LIST } from '../../data/schoolData';
import { Classroom, ClassroomAssignment } from '../../types';
import { useApp } from '../../context/AppContext';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';

export const SchoolClassroomView: React.FC = () => {
  const { addToast } = useApp();
  const [classrooms, setClassrooms] = useState<Classroom[]>(CLASSROOMS_LIST);
  const [activeClassId, setActiveClassId] = useState<string>(CLASSROOMS_LIST[0].id);
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState<ClassroomAssignment | null>(null);
  const [submissionLink, setSubmissionLink] = useState('My Calculator Project (IDE)');

  const currentClass = classrooms.find(c => c.id === activeClassId) || classrooms[0];

  const handleJoinClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCodeInput.trim()) return;
    const newClass: Classroom = {
      id: `class-${Date.now()}`,
      code: joinCodeInput.toUpperCase().trim(),
      name: `${joinCodeInput.toUpperCase()} Advanced Lab`,
      teacherName: 'Faculty Advisor',
      subject: 'STEM Elective',
      announcements: ['Welcome to your newly joined classroom! Check assignments below.'],
      assignments: [
        {
          id: `asg-${Date.now()}`,
          title: 'Class Onboarding Project',
          subject: 'General',
          dueDate: '2026-09-10',
          points: 100,
          submitted: false,
          instructions: 'Submit your student portfolio link.'
        }
      ]
    };
    setClassrooms(prev => [...prev, newClass]);
    setActiveClassId(newClass.id);
    setJoinCodeInput('');
    addToast('Joined Classroom! 🎓', `Enrolled into ${newClass.code}.`, 'success');
  };

  const handleSubmitAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment) return;

    setClassrooms(prev =>
      prev.map(c =>
        c.id === activeClassId
          ? {
              ...c,
              assignments: c.assignments.map(a =>
                a.id === selectedAssignment.id ? { ...a, submitted: true, grade: 'Pending Teacher Review' } : a
              )
            }
          : c
      )
    );

    addToast('Assignment Submitted! 📤', `Submitted "${selectedAssignment.title}" for grading.`, 'success');
    setSelectedAssignment(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-6xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-850 via-slate-850 to-emerald-950/30 border border-emerald-850/40 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-700/50 text-emerald-300 text-xs font-semibold">
            <School className="w-3.5 h-3.5 text-emerald-400" />
            <span>Phase 5: Schools &amp; Classroom LMS Integration</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
            School &amp; Classroom LMS Portal
          </h2>
          <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
            Join school course sections, track teacher assignments, receive feedback, and submit IDE projects for academic credit.
          </p>
        </div>

        {/* Join Class Code Input */}
        <form onSubmit={handleJoinClass} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 shrink-0 w-full md:w-72">
          <span className="text-xs font-bold text-slate-200 block">Join Class with Code</span>
          <div className="flex gap-1.5">
            <input
              type="text"
              value={joinCodeInput}
              onChange={e => setJoinCodeInput(e.target.value)}
              placeholder="e.g. CS-101"
              className="flex-1 bg-slate-950 border border-slate-750 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 font-mono uppercase"
            />
            <button
              type="submit"
              disabled={!joinCodeInput.trim()}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow transition"
            >
              Enroll
            </button>
          </div>
        </form>
      </div>

      {/* Class Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {classrooms.map(c => (
          <button
            key={c.id}
            onClick={() => setActiveClassId(c.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeClassId === c.id
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <School className="w-3.5 h-3.5" />
            <span>{c.name} ({c.code})</span>
          </button>
        ))}
      </div>

      {/* Active Classroom Details & Announcements */}
      <Card className="p-6 border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-100">{currentClass.name}</h3>
              <Badge variant="success">{currentClass.code}</Badge>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Instructor: {currentClass.teacherName} • Subject: {currentClass.subject}</p>
          </div>

          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span>{currentClass.assignments.length} Course Assignments</span>
          </div>
        </div>

        {/* Teacher Announcements */}
        {currentClass.announcements && currentClass.announcements.length > 0 && (
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Teacher Announcements</span>
            <ul className="space-y-1 text-xs text-slate-300">
              {currentClass.announcements.map((ann, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>{ann}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Course Assignments List */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-200">Assignments &amp; Homework</h4>

          <div className="space-y-3">
            {currentClass.assignments.map(asg => (
              <div
                key={asg.id}
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-200">{asg.title}</span>
                    <Badge size="sm">{asg.points} pts</Badge>
                  </div>
                  <p className="text-xs text-slate-400">{asg.instructions}</p>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1 pt-1">
                    <Clock className="w-3 h-3" />
                    <span>Due: {asg.dueDate}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {asg.submitted ? (
                    <div className="text-right">
                      <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Submitted</span>
                      </span>
                      {asg.grade && <span className="text-[10px] text-slate-400 block mt-0.5">{asg.grade}</span>}
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelectedAssignment(asg)}
                      className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow transition flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Work</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Assignment Submission Modal */}
      {selectedAssignment && (
        <Modal
          isOpen={!!selectedAssignment}
          onClose={() => setSelectedAssignment(null)}
          title={`Submit Assignment: ${selectedAssignment.title}`}
          maxWidth="md"
        >
          <form onSubmit={handleSubmitAssignment} className="space-y-4 text-xs">
            <p className="text-slate-300">{selectedAssignment.instructions}</p>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Select IDE Project to Submit</label>
              <select
                value={submissionLink}
                onChange={e => setSubmissionLink(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none"
              >
                <option value="My Calculator Project (IDE)">My Calculator Project (IDE)</option>
                <option value="Personal Portfolio Website">Personal Portfolio Website</option>
                <option value="Semantic Bio Page">Semantic Bio Page</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedAssignment(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow"
              >
                Turn In Assignment
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

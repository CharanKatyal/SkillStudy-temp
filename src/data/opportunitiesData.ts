import { RealWorldProjectBrief, StudentOpportunity, StudentWallet } from '../types';

export const REAL_WORLD_PROJECTS: RealWorldProjectBrief[] = [
  {
    id: 'rwp-1',
    title: 'Local Animal Shelter Adoption Portal',
    clientName: 'City Paws Animal Rescue',
    clientCategory: 'Non-Profit',
    description: 'Design and build a responsive pet adoption gallery with category filters (Dogs, Cats, Birds) and inquiry contact modal.',
    budgetStipend: 150,
    deadline: '2026-09-15',
    deliverables: [
      'Semantic HTML gallery with animal cards',
      'Filter buttons for pet age and species',
      'Adoption application modal with form validation'
    ],
    status: 'available'
  },
  {
    id: 'rwp-2',
    title: 'Community Eco-Tracker & Tree Planting Log',
    clientName: 'Green Neighborhood Initiative',
    clientCategory: 'Community',
    description: 'A local web dashboard tracking neighborhood volunteer hours, planted trees, and recycling milestones.',
    budgetStipend: 200,
    deadline: '2026-09-30',
    deliverables: [
      'Interactive progress meter and streak count',
      'Log new volunteer activity form',
      'Offline IndexedDB persistence support'
    ],
    status: 'in_progress'
  },
  {
    id: 'rwp-3',
    title: 'School Library Book Catalog & Search',
    clientName: 'Central High School Library',
    clientCategory: 'Education',
    description: 'A searchable index for library books with ISBN lookup and availability toggle.',
    budgetStipend: 175,
    deadline: '2026-10-10',
    deliverables: [
      'Real-time search bar filtering titles and authors',
      'Book detail modal with synopsis and shelf location',
      'Responsive design for Chromebooks and tablets'
    ],
    status: 'available'
  }
];

export const STUDENT_OPPORTUNITIES: StudentOpportunity[] = [
  {
    id: 'opp-1',
    title: 'Junior Web Accessibility Contributor',
    organization: 'Global Web Foundation',
    type: 'micro_bounty',
    stipendAmount: 75,
    skills: ['HTML5', 'Accessibility', 'ARIA'],
    description: 'Audit and update 5 open-source templates for keyboard focus indicators and ARIA landmarks.',
    status: 'open'
  },
  {
    id: 'opp-2',
    title: 'Student Open-Source Summer Fellowship',
    organization: 'FOSS for Youth Alliance',
    type: 'grant',
    stipendAmount: 500,
    skills: ['JavaScript', 'Git', 'Open Source'],
    description: 'Educational grant awarded to students who contribute 3 verified pull requests to beginner FOSS repositories.',
    status: 'applied'
  }
];

export const INITIAL_STUDENT_WALLET: StudentWallet = {
  balanceUSD: 225,
  transactions: [
    {
      id: 'tx-1',
      title: 'Completed Eco-Tracker Milestone 1',
      amount: 75,
      type: 'credit',
      date: '2026-08-18',
      category: 'Project Stipend'
    },
    {
      id: 'tx-2',
      title: 'StillSkudy Student Educational Grant',
      amount: 150,
      type: 'credit',
      date: '2026-08-10',
      category: 'Grant'
    }
  ]
};

import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from '../components/common/Badge';
import { ProgressBar } from '../components/common/ProgressBar';
import { Card } from '../components/common/Card';
import { EmptyState } from '../components/common/EmptyState';
import { GraduationCap } from 'lucide-react';

describe('SkillForge UI Primitives', () => {
  it('should render Badge component with correct text and variant styles', () => {
    render(<Badge variant="success">Completed</Badge>);
    const badge = screen.getByText('Completed');
    expect(badge).toBeDefined();
    expect(badge.className).toContain('text-emerald-300');
  });

  it('should render ProgressBar with accurate percentages', () => {
    const { container } = render(<ProgressBar value={75} color="bg-sky-500" />);
    const bar = container.querySelector('.bg-sky-500');
    expect(bar).toBeDefined();
    expect(bar?.getAttribute('style')).toContain('width: 75%');
  });

  it('should render Card container with child contents', () => {
    render(
      <Card>
        <h2>Project Title</h2>
        <p>Project details here.</p>
      </Card>
    );
    expect(screen.getByText('Project Title')).toBeDefined();
    expect(screen.getByText('Project details here.')).toBeDefined();
  });

  it('should render EmptyState with action button', () => {
    render(
      <EmptyState
        icon={GraduationCap}
        title="No Lessons Found"
        description="You have not started any lessons yet."
        actionText="Start Learning"
        onAction={() => {}}
      />
    );
    expect(screen.getByText('No Lessons Found')).toBeDefined();
    expect(screen.getByText('Start Learning')).toBeDefined();
  });
});

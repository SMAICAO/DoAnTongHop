const mockData = {
  board: {
    id: 'board-1',
    title: '',
    columns: [
      {
        id: 'col-1',
        title: 'To Do',
        cards: [
          {
            id: 'card-1',
            title: 'Thiết kế database',
            description: 'Vẽ ERD, chuẩn hóa 3NF',
            labels: [{ id: 'label-1', text: 'Database', color: '#22c55e' }],
            assignee: { name: 'Tuấn', initials: 'T' },
          },
          {
            id: 'card-2',
            title: 'Phân tích use case',
            description: 'Liệt kê chức năng chính',
            labels: [{ id: 'label-2', text: 'Analysis', color: '#0ea5e9' }],
            assignee: { name: 'Khang', initials: 'K' },
          },
        ],
      },
      {
        id: 'col-2',
        title: 'In Progress',
        cards: [
          {
            id: 'card-3',
            title: 'Code API login',
            description: 'JWT + refresh token',
            labels: [{ id: 'label-3', text: 'Backend', color: '#6366f1' }],
            assignee: { name: 'Duy', initials: 'D' },
          },
          {
            id: 'card-4',
            title: 'Làm UI bảng điều khiển',
            description: 'React + CSS',
            labels: [{ id: 'label-4', text: 'Frontend', color: '#f97316' }],
            assignee: { name: 'Loan', initials: 'L' },
          },
        ],
      },
      {
        id: 'col-3',
        title: 'Review',
        cards: [
          {
            id: 'card-5',
            title: 'Review PR #12',
            description: 'Check logic & format code',
            labels: [{ id: 'label-5', text: 'Code review', color: '#eab308' }],
            assignee: { name: 'Nhật', initials: 'N' },
          },
        ],
      },
      {
        id: 'col-4',
        title: 'Done',
        cards: [
          {
            id: 'card-6',
            title: 'Setup project',
            description: 'Vite + React đã chạy ok',
            labels: [{ id: 'label-6', text: 'Setup', color: '#22c55e' }],
            assignee: { name: 'Team', initials: 'TM' },
          },
          {
            id: 'card-7',
            title: 'Viết README',
            description: 'Hướng dẫn chạy project',
            labels: [{ id: 'label-7', text: 'Docs', color: '#a855f7' }],
            assignee: { name: 'Tuấn', initials: 'T' },
          },
        ],
      },
    ],
  },
};

export default mockData;

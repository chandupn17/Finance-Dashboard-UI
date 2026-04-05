/** @typedef {'Food' | 'Transport' | 'Shopping' | 'Entertainment' | 'Health' | 'Utilities' | 'Salary' | 'Freelance' | 'Rent' | 'Other'} Category */
/** @typedef {'income' | 'expense'} TxType */

/**
 * @typedef {Object} Transaction
 * @property {string} id
 * @property {string} date ISO date string
 * @property {string} description
 * @property {number} amount positive number
 * @property {Category} category
 * @property {TxType} type
 * @property {string[]} [tags] optional labels for reporting and filters
 * @property {string} [notes] private context (receipts, BNPL plan, split with roommate, etc.)
 */

/** @type {Category[]} */
export const CATEGORIES = [
  'Food',
  'Transport',
  'Shopping',
  'Entertainment',
  'Health',
  'Utilities',
  'Salary',
  'Freelance',
  'Rent',
  'Other',
];

/**
 * Static mock dataset (35 rows), spread across the last ~6 months from Apr 2026.
 * @type {Transaction[]}
 */
export const mockTransactions = [
  { id: 'a1b2c3d4-e5f6-4789-a012-345678901234', date: '2025-11-02', description: 'Monthly salary deposit', amount: 5200, category: 'Salary', type: 'income', tags: ['payroll', 'recurring'] },
  { id: 'b2c3d4e5-f6a7-4890-b123-456789012345', date: '2025-11-03', description: 'Grocery run — weekend stock', amount: 142.35, category: 'Food', type: 'expense', tags: ['groceries'] },
  { id: 'c3d4e5f6-a7b8-4901-c234-567890123456', date: '2025-11-05', description: 'Metro pass renewal', amount: 89, category: 'Transport', type: 'expense' },
  { id: 'd4e5f6a7-b8c9-4012-d345-678901234567', date: '2025-11-08', description: 'Freelance design sprint', amount: 1200, category: 'Freelance', type: 'income' },
  { id: 'e5f6a7b8-c9d0-4123-e456-789012345678', date: '2025-11-10', description: 'Apartment rent', amount: 1850, category: 'Rent', type: 'expense', tags: ['housing', 'recurring'] },
  { id: 'f6a7b8c9-d0e1-4234-f567-890123456789', date: '2025-11-12', description: 'Streaming subscriptions', amount: 45.99, category: 'Entertainment', type: 'expense', tags: ['subscription'] },
  { id: 'a7b8c9d0-e1f2-4345-a678-901234567890', date: '2025-11-14', description: 'Pharmacy & vitamins', amount: 62.4, category: 'Health', type: 'expense' },
  { id: 'b8c9d0e1-f2a3-4456-b789-012345678901', date: '2025-11-18', description: 'Electric & water bill', amount: 128.75, category: 'Utilities', type: 'expense' },
  { id: 'c9d0e1f2-a3b4-4567-c890-123456789012', date: '2025-11-20', description: 'Black Friday electronics', amount: 399, category: 'Shopping', type: 'expense' },
  { id: 'd0e1f2a3-b4c5-4678-d901-234567890123', date: '2025-11-22', description: 'Team dinner', amount: 78.2, category: 'Food', type: 'expense' },
  { id: 'e1f2a3b4-c5d6-4789-e012-345678901234', date: '2025-12-01', description: 'Monthly salary deposit', amount: 5200, category: 'Salary', type: 'income', tags: ['payroll', 'recurring'] },
  { id: 'f2a3b4c5-d6e7-4890-f123-456789012345', date: '2025-12-04', description: 'Holiday gifts', amount: 256.8, category: 'Shopping', type: 'expense' },
  { id: 'a3b4c5d6-e7f8-4901-a234-567890123456', date: '2025-12-06', description: 'Uber to airport', amount: 42.5, category: 'Transport', type: 'expense' },
  { id: 'b4c5d6e7-f8a9-4012-b345-678901234567', date: '2025-12-08', description: 'Concert tickets', amount: 180, category: 'Entertainment', type: 'expense' },
  { id: 'c5d6e7f8-a9b0-4123-c456-789012345678', date: '2025-12-10', description: 'Freelance API integration', amount: 950, category: 'Freelance', type: 'income' },
  { id: 'd6e7f8a9-b0c1-4234-d567-890123456789', date: '2025-12-12', description: 'Apartment rent', amount: 1850, category: 'Rent', type: 'expense', tags: ['housing', 'recurring'] },
  { id: 'e7f8a9b0-c1d2-4345-e678-901234567890', date: '2025-12-15', description: 'Annual gym membership', amount: 420, category: 'Health', type: 'expense' },
  { id: 'f8a9b0c1-d2e3-4456-f789-012345678901', date: '2025-12-18', description: 'Coffee & pastries', amount: 34.6, category: 'Food', type: 'expense' },
  { id: 'a9b0c1d2-e3f4-4567-a890-123456789012', date: '2025-12-22', description: 'Internet upgrade', amount: 79.99, category: 'Utilities', type: 'expense' },
  { id: 'b0c1d2e3-f4a5-4678-b901-234567890123', date: '2025-12-28', description: 'Year-end bonus', amount: 2100, category: 'Salary', type: 'income' },
  { id: 'c1d2e3f4-a5b6-4789-c012-345678901234', date: '2026-01-02', description: 'Monthly salary deposit', amount: 5200, category: 'Salary', type: 'income', tags: ['payroll', 'recurring'] },
  { id: 'd2e3f4a5-b6c7-4890-d123-456789012345', date: '2026-01-05', description: 'Weekly groceries', amount: 118.9, category: 'Food', type: 'expense' },
  { id: 'e3f4a5b6-c7d8-4901-e234-567890123456', date: '2026-01-07', description: 'Car maintenance', amount: 310, category: 'Transport', type: 'expense' },
  { id: 'f4a5b6c7-d8e9-4012-f345-678901234567', date: '2026-01-10', description: 'Apartment rent', amount: 1850, category: 'Rent', type: 'expense' },
  { id: 'a5b6c7d8-e9f0-4123-a456-789012345678', date: '2026-01-14', description: 'Board game night', amount: 55, category: 'Entertainment', type: 'expense' },
  { id: 'b6c7d8e9-f0a1-4234-b567-890123456789', date: '2026-01-18', description: 'Dental checkup', amount: 195, category: 'Health', type: 'expense' },
  { id: 'c7d8e9f0-a1b2-4345-c678-901234567890', date: '2026-01-22', description: 'Freelance copywriting', amount: 600, category: 'Freelance', type: 'income' },
  { id: 'd8e9f0a1-b2c3-4456-d789-012345678901', date: '2026-01-25', description: 'Winter jacket', amount: 189.99, category: 'Shopping', type: 'expense' },
  { id: 'e9f0a1b2-c3d4-4567-e890-123456789012', date: '2026-01-28', description: 'Gas & heating', amount: 156.2, category: 'Utilities', type: 'expense' },
  { id: 'f0a1b2c3-d4e5-4678-f901-234567890123', date: '2026-02-01', description: 'Monthly salary deposit', amount: 5200, category: 'Salary', type: 'income' },
  { id: 'a1b2c3d4-e5f6-4789-a012-345678901235', date: '2026-02-04', description: 'Valentine dinner', amount: 124, category: 'Food', type: 'expense' },
  { id: 'b2c3d4e5-f6a7-4890-b123-456789012346', date: '2026-02-08', description: 'Train tickets', amount: 67.5, category: 'Transport', type: 'expense' },
  { id: 'c3d4e5f6-a7b8-4901-c234-567890123457', date: '2026-02-10', description: 'Apartment rent', amount: 1850, category: 'Rent', type: 'expense' },
  { id: 'd4e5f6a7-b8c9-4012-d345-678901234568', date: '2026-02-14', description: 'Theater show', amount: 95, category: 'Entertainment', type: 'expense' },
  { id: 'e5f6a7b8-c9d0-4123-e456-789012345679', date: '2026-02-18', description: 'Consulting retainer', amount: 1500, category: 'Freelance', type: 'income' },
  { id: 'f6a7b8c9-d0e1-4234-f567-890123456780', date: '2026-02-22', description: 'Misc household', amount: 48.3, category: 'Other', type: 'expense' },
  { id: 'a7b8c9d0-e1f2-4345-a678-901234567891', date: '2026-03-01', description: 'Monthly salary deposit', amount: 5200, category: 'Salary', type: 'income' },
  { id: 'b8c9d0e1-f2a3-4456-b789-012345678902', date: '2026-03-05', description: 'Farmers market', amount: 86.4, category: 'Food', type: 'expense' },
  { id: 'c9d0e1f2-a3b4-4567-c890-123456789013', date: '2026-03-09', description: 'Parking & tolls', amount: 38, category: 'Transport', type: 'expense' },
  { id: 'd0e1f2a3-b4c5-4678-d901-234567890124', date: '2026-03-11', description: 'Apartment rent', amount: 1850, category: 'Rent', type: 'expense' },
  { id: 'e1f2a3b4-c5d6-4789-e012-345678901245', date: '2026-03-15', description: 'Bookstore haul', amount: 72.15, category: 'Shopping', type: 'expense' },
  { id: 'f2a3b4c5-d6e7-4890-f123-456789012356', date: '2026-03-20', description: 'Mobile & cloud backup', amount: 24.99, category: 'Utilities', type: 'expense' },
  { id: 'a3b4c5d6-e7f8-4901-a234-567890123467', date: '2026-03-25', description: 'Therapy session', amount: 130, category: 'Health', type: 'expense' },
  { id: 'b4c5d6e7-f8a9-4012-b345-678901234578', date: '2026-03-28', description: 'Podcast equipment', amount: 215, category: 'Other', type: 'expense' },
  { id: 'c5d6e7f8-a9b0-4123-c456-789012345689', date: '2026-04-01', description: 'Monthly salary deposit', amount: 5200, category: 'Salary', type: 'income' },
  { id: 'd6e7f8a9-b0c1-4234-d567-890123456790', date: '2026-04-02', description: 'Lunch meetings (week)', amount: 91.25, category: 'Food', type: 'expense' },
  { id: 'e7f8a9b0-c1d2-4345-e678-901234567801', date: '2026-04-03', description: 'Ride share credits', amount: 25, category: 'Transport', type: 'expense' },
];

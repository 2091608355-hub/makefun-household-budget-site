// Sample month for the Rivera household: November 2026.
// Every figure on the site comes from these lists, so the totals,
// the budget bars and the charts always agree with each other.

export const HOUSEHOLD = {
  name: 'Rivera household',
  month: 'November 2026',
  members: ['Maya', 'Tom', 'Leo (9)', 'Nina (6)'],
  currency: '¥',
};

export const CATEGORIES = [
  { id: 'housing', label: 'Housing', color: '#2f6f5e', budget: 4200 },
  { id: 'groceries', label: 'Groceries', color: '#d98a2b', budget: 2800 },
  { id: 'eating', label: 'Eating out', color: '#c65d4e', budget: 700 },
  { id: 'transport', label: 'Transport', color: '#4a7fb5', budget: 1000 },
  { id: 'utilities', label: 'Utilities', color: '#7a6bb5', budget: 850 },
  { id: 'kids', label: 'Kids & school', color: '#3e9b8a', budget: 1500 },
  { id: 'health', label: 'Health', color: '#b54a7f', budget: 600 },
  { id: 'fun', label: 'Fun & streaming', color: '#8a9a3e', budget: 800 },
  { id: 'clothing', label: 'Clothing', color: '#5e7a8a', budget: 400 },
];

export const SAVINGS_GOAL = { label: 'Holiday & emergency fund', target: 24000, saved: 14800, monthly: 2000 };

export const MONTHS = [
  { month: 'Jun', income: 17200, spent: 11800 },
  { month: 'Jul', income: 17500, spent: 12400 },
  { month: 'Aug', income: 17800, spent: 12100 },
  { month: 'Sep', income: 18100, spent: 12900 },
  { month: 'Oct', income: 17900, spent: 11750 },
  { month: 'Nov', income: 18160, spent: 12150 },
];

export const BILLS = [
  { id: 'b1', label: 'Rent', amount: 4200, due: 'Nov 1', paid: true, note: 'Monthly rent, bank transfer' },
  { id: 'b2', label: 'Gym membership', amount: 150, due: 'Nov 5', paid: true, note: 'Family plan, two adults' },
  { id: 'b3', label: 'Streaming bundle', amount: 68, due: 'Nov 8', paid: true, note: 'Video + music, yearly discount' },
  { id: 'b4', label: 'Electricity', amount: 210, due: 'Nov 12', paid: true, note: 'Meter reading Oct 28' },
  { id: 'b5', label: 'Water', amount: 95, due: 'Nov 15', paid: false, note: 'Auto-pay on the due date' },
  { id: 'b6', label: 'Internet', amount: 129, due: 'Nov 18', paid: false, note: 'Fibre 500M, includes router' },
  { id: 'b7', label: 'Phone plans (x2)', amount: 180, due: 'Nov 20', paid: false, note: 'Maya + Tom, shared data' },
  { id: 'b8', label: 'Home insurance', amount: 340, due: 'Nov 25', paid: false, note: 'Quarterly premium, third instalment' },
];

export const SEED_TRANSACTIONS = [
  { id: 't01', date: '2026-11-01', kind: 'expense', category: 'housing', amount: 4200, note: 'November rent' },
  { id: 't02', date: '2026-11-02', kind: 'expense', category: 'groceries', amount: 420, note: 'Weekly shop, Green Mart' },
  { id: 't03', date: '2026-11-03', kind: 'expense', category: 'transport', amount: 180, note: 'Fuel, Shell station' },
  { id: 't04', date: '2026-11-04', kind: 'expense', category: 'kids', amount: 320, note: 'School lunch money, Leo + Nina' },
  { id: 't05', date: '2026-11-05', kind: 'income', category: 'income', amount: 9200, note: 'Salary, Maya' },
  { id: 't06', date: '2026-11-05', kind: 'income', category: 'income', amount: 7400, note: 'Salary, Tom' },
  { id: 't07', date: '2026-11-05', kind: 'expense', category: 'fun', amount: 96, note: 'Cinema, Saturday film' },
  { id: 't08', date: '2026-11-06', kind: 'expense', category: 'groceries', amount: 385, note: 'Weekly shop, Green Mart' },
  { id: 't09', date: '2026-11-06', kind: 'expense', category: 'eating', amount: 86, note: 'Noodles, lunch with colleagues' },
  { id: 't10', date: '2026-11-07', kind: 'expense', category: 'health', amount: 120, note: 'Pharmacy, cold medicine' },
  { id: 't11', date: '2026-11-08', kind: 'expense', category: 'fun', amount: 68, note: 'Streaming bundle, monthly' },
  { id: 't12', date: '2026-11-09', kind: 'expense', category: 'groceries', amount: 512, note: 'Big shop, pantry restock' },
  { id: 't13', date: '2026-11-10', kind: 'expense', category: 'transport', amount: 120, note: 'Metro card top-up, Maya' },
  { id: 't14', date: '2026-11-11', kind: 'expense', category: 'kids', amount: 210, note: 'School books, Leo' },
  { id: 't15', date: '2026-11-12', kind: 'expense', category: 'utilities', amount: 210, note: 'Electricity bill' },
  { id: 't16', date: '2026-11-12', kind: 'expense', category: 'eating', amount: 124, note: 'Family hotpot dinner' },
  { id: 't17', date: '2026-11-13', kind: 'expense', category: 'groceries', amount: 296, note: 'Weekly shop, Green Mart' },
  { id: 't18', date: '2026-11-14', kind: 'expense', category: 'kids', amount: 280, note: 'Piano lesson, Nina' },
  { id: 't19', date: '2026-11-15', kind: 'expense', category: 'utilities', amount: 95, note: 'Water bill' },
  { id: 't20', date: '2026-11-15', kind: 'expense', category: 'transport', amount: 165, note: 'Fuel, Shell station' },
  { id: 't21', date: '2026-11-16', kind: 'expense', category: 'groceries', amount: 448, note: 'Weekly shop, Green Mart' },
  { id: 't22', date: '2026-11-16', kind: 'expense', category: 'eating', amount: 98, note: 'Takeaway, busy Monday' },
  { id: 't23', date: '2026-11-17', kind: 'expense', category: 'health', amount: 260, note: 'Dentist check, Tom' },
  { id: 't24', date: '2026-11-18', kind: 'income', category: 'income', amount: 1350, note: 'Freelance design, Maya' },
  { id: 't25', date: '2026-11-18', kind: 'expense', category: 'utilities', amount: 129, note: 'Internet bill' },
  { id: 't26', date: '2026-11-19', kind: 'expense', category: 'fun', amount: 142, note: 'Board game, family night' },
  { id: 't27', date: '2026-11-19', kind: 'expense', category: 'transport', amount: 120, note: 'Metro card top-up, Tom' },
  { id: 't28', date: '2026-11-20', kind: 'expense', category: 'groceries', amount: 339, note: 'Weekly shop, Green Mart' },
  { id: 't29', date: '2026-11-20', kind: 'expense', category: 'kids', amount: 190, note: 'Winter shoes, Leo' },
  { id: 't30', date: '2026-11-21', kind: 'expense', category: 'eating', amount: 142, note: 'Birthday lunch, grandma' },
  { id: 't31', date: '2026-11-21', kind: 'expense', category: 'clothing', amount: 185, note: 'Winter jacket, Nina' },
  { id: 't32', date: '2026-11-22', kind: 'income', category: 'income', amount: 210, note: 'Refund, returned kettle' },
  { id: 't33', date: '2026-11-22', kind: 'expense', category: 'fun', amount: 214, note: 'Concert tickets, two seats' },
  { id: 't34', date: '2026-11-23', kind: 'expense', category: 'groceries', amount: 280, note: 'Weekly shop, Green Mart' },
  { id: 't35', date: '2026-11-23', kind: 'expense', category: 'transport', amount: 85, note: 'Parking, city centre' },
  { id: 't36', date: '2026-11-24', kind: 'expense', category: 'kids', amount: 150, note: 'Field trip fee, Leo' },
  { id: 't37', date: '2026-11-24', kind: 'expense', category: 'health', amount: 85, note: 'Vitamins, pharmacy' },
  { id: 't38', date: '2026-11-25', kind: 'expense', category: 'utilities', amount: 146, note: 'Gas bill' },
  { id: 't39', date: '2026-11-25', kind: 'expense', category: 'eating', amount: 76, note: 'Bakery breakfast, Sunday' },
  { id: 't40', date: '2026-11-26', kind: 'expense', category: 'fun', amount: 120, note: 'Books, bedtime stories' },
  { id: 't41', date: '2026-11-26', kind: 'expense', category: 'transport', amount: 60, note: 'Car wash' },
  { id: 't42', date: '2026-11-26', kind: 'expense', category: 'kids', amount: 230, note: 'Snacks + stationery, school fair' },
  { id: 't43', date: '2026-11-26', kind: 'expense', category: 'clothing', amount: 125, note: 'Socks and shirts, kids' },
  { id: 't44', date: '2026-11-26', kind: 'expense', category: 'health', amount: 75, note: 'Clinic visit, Nina' },
  { id: 't45', date: '2026-11-26', kind: 'expense', category: 'fun', amount: 80, note: 'Park picnic supplies' },
  { id: 't46', date: '2026-11-26', kind: 'expense', category: 'utilities', amount: 180, note: 'Phone plans, Maya + Tom' },
  { id: 't47', date: '2026-11-26', kind: 'expense', category: 'eating', amount: 114, note: 'Dumplings, family dinner' },
  { id: 't48', date: '2026-11-26', kind: 'expense', category: 'transport', amount: 190, note: 'Taxi, airport run' },
];

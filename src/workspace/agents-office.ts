import type { Agent } from './agents'

// Back office: idle cash, tax, travel.
export const OFFICE_AGENTS: Agent[] = [
  {
    id: 'wren',
    name: 'Wren',
    role: 'Wealth',
    color: '#f5e1c8',
    status: 'needs-you',
    doing: 'Parking the GST reserve',
    working: 'waiting for your signing key',
    since: '06:00',
    time: '1m',
    unread: 1,
    passport: 'Overnight sweep ≤ SGD 50,000',
    request: { from: 'Wren', to: '6-month SGS T-bill + fund', amount: 'SGD 15,000' },
    messages: [
      {
        from: 'agent',
        time: '06:05',
        text: "Overnight I parked SGD 38,400 of idle cash in the bank's money-market sweep. It was back in your account by 8am.",
      },
      {
        from: 'agent',
        steps: {
          took: '6s',
          items: [
            'Kept 45 days of costs untouched',
            "Left Tessa's stock money alone",
            'Found SGD 15,000 GST reserve not needed until 31 Jan',
          ],
        },
      },
      {
        from: 'agent',
        a2a: {
          counterpart: { id: 'ivy', name: 'Ivy', org: 'Certainty Bank · wealth agent', verified: true },
          verify: { who: [true, 'Certainty Bank · licensed bank agent'], authority: [true, 'May quote · Wren may not invest alone'], money: [true, 'Paid from the GST reserve, not operating cash'] },
          lines: [
            { who: 'us', text: "We have SGD 15,000 set aside for GST, due in January. What's safe and liquid until then?" },
            { who: 'them', text: '6-month SGS T-bill, backed by the government. Or our money-market fund, same-day withdrawal.' },
            { who: 'us', text: 'Which is better if Otto needs the cash early?' },
            { who: 'them', text: 'The fund. The T-bill pays a little more, but only at maturity.' },
            { who: 'us', text: 'Then SGD 10,000 in the T-bill and SGD 5,000 in the fund.' },
          ],
          outcome: 'Plan ready · needs Alex',
          tone: 'ask',
        },
      },
      {
        from: 'agent',
        card: {
          title: 'Investment request',
          figure: 'SGD 15,000',
          figureLabel: 'GST reserve, until 31 Jan',
          rows: [
            ['SGS T-bill · 6 months', 'SGD 10,000'],
            ['Money-market fund', 'SGD 5,000'],
            ['Risk', 'Government / cash-like'],
          ],
          status: 'Needs your key',
          tone: 'ask',
          note: 'Investing is outside my passport. Press OK on your signing key to approve.',
        },
      },
    ],
  },
  {
    id: 'otto',
    name: 'Otto',
    role: 'CFO',
    color: '#e2e8d5',
    status: 'needs-you',
    doing: 'GST return ready to sign',
    working: 'drafting the Form C-S',
    since: '07:30',
    time: '25m',
    unread: 1,
    passport: 'Prepare filings · Alex declares',
    request: { from: 'Otto', to: 'GST payment · Q3', amount: 'SGD 6,120' },
    messages: [
      { from: 'agent', time: '07:32', text: 'The Q3 GST return is ready. It is due on 31 October.' },
      {
        from: 'agent',
        steps: {
          took: '41s',
          items: [
            'Matched 1,284 sales to e-invoices',
            'Checked 212 purchase receipts for input tax',
            'Flagged 3 receipts without a supplier GST number',
          ],
        },
      },
      {
        from: 'agent',
        a2a: {
          counterpart: { id: 'rafi', name: 'Rafi', org: 'Tax portal · filing agent', verified: true },
          verify: { who: [true, 'Tax portal · government agent'], authority: [true, 'Pre-checks only · Alex declares'], money: [true, 'SGD 6,120 set aside in the GST reserve'] },
          lines: [
            { who: 'us', text: 'Pre-checking the Q3 GST F5 for Lim Bakery before we submit.' },
            { who: 'them', text: 'Figures match your e-invoices. 3 purchases have no supplier GST number.' },
            { who: 'us', text: 'Removed those 3 from input tax, SGD 212 in total.' },
            { who: 'them', text: "Accepted. Ready for the director's declaration." },
          ],
          outcome: 'Pre-check passed · waiting for your declaration',
          tone: 'ask',
        },
      },
      {
        from: 'agent',
        card: {
          title: 'GST F5 · Jul–Sep',
          figure: 'SGD 6,120',
          figureLabel: 'net GST payable',
          rows: [
            ['Output tax', 'SGD 14,860'],
            ['Input tax', 'SGD 8,740'],
            ['Pay from', 'GST reserve (Wren)'],
          ],
          status: 'Needs your signature',
          tone: 'ask',
          note: 'I prepare, you declare. Filing needs your signing key.',
        },
      },
      { from: 'agent', time: '07:55', text: 'Next up: the corporate income tax draft (Form C-S), by 15 November.' },
    ],
  },
  {
    id: 'jules',
    name: 'Jules',
    role: 'Admin',
    color: '#d9e4f5',
    status: 'running',
    doing: 'Booking your Las Vegas trip',
    working: 'shortlisting hotels',
    since: '10:10',
    time: '2m',
    unread: 0,
    passport: 'Travel ≤ SGD 3,000 · card token',
    request: { from: 'Jules', to: 'Merlion Air', amount: 'SGD 2,480' },
    messages: [
      { from: 'me', time: '10:10', text: 'Book me to Las Vegas for the baking expo, 14–18 Oct. Premium economy is fine.' },
      {
        from: 'agent',
        steps: {
          took: '18s',
          items: [
            'Checked your calendar: free 13–19 Oct',
            'Compared 9 routes via SFO, LAX and Tokyo',
            'Picked 1 stop via Tokyo · 21h total',
          ],
        },
      },
      {
        from: 'agent',
        a2a: {
          counterpart: { id: 'cleo', name: 'Cleo', org: 'Merlion Air · booking agent', verified: true },
          verify: { who: [true, 'Merlion Air · registered agent'], authority: [true, 'Seller of record for this fare'], money: [true, 'Single-use card ≤ SGD 3,000'] },
          lines: [
            { who: 'us', text: '1 adult, SIN → LAS, out 13 Oct, back 19 Oct, premium economy.' },
            { who: 'them', text: 'Via Tokyo, SGD 2,480 total. Seat 31A held for 15 minutes.' },
            { who: 'us', text: 'Book it. Paying with a single-use card from Kairos.' },
            { who: 'them', text: 'Confirmed. Booking ref MX7Q2L.' },
          ],
          outcome: 'Booked · ref MX7Q2L',
          tone: 'ok',
        },
      },
      {
        from: 'agent',
        card: {
          title: 'Card payment',
          figure: 'SGD 2,480',
          figureLabel: 'Merlion Air · SIN ⇄ LAS',
          rows: [
            ['Card', 'Agent token ··4417 · single use'],
            ['Limit', 'Inside travel passport'],
            ['Expense', 'Tagged: trade show'],
          ],
          status: 'Paid',
          tone: 'ok',
        },
      },
      { from: 'agent', time: '10:14', text: 'Hotels next: 3 options near the convention centre, under SGD 250 a night.' },
    ],
  },
]

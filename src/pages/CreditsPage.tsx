import { useState } from 'react';
import {
  CreditCard,
  History,
  TrendingDown,
  Plus,
  Download,
  Check,
  Zap,
  Shield,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Navigation } from '../components/layout/Navigation';
import { toast } from 'react-toastify';

// --- Types & Mock Data ---

interface Transaction {
  id: string;
  type: 'PURCHASE' | 'USAGE';
  description: string;
  amount: number; // Positive for purchase, negative for usage
  date: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  invoiceUrl?: string;
}

const HISTORY_DATA: Transaction[] = [
  { id: 'tx_1', type: 'USAGE', description: 'Survey: Gen Z Shopping Habits', amount: -450, date: 'Oct 24, 2025', status: 'SUCCESS' },
  { id: 'tx_2', type: 'PURCHASE', description: 'Pro Credit Pack (5,000)', amount: 5000, date: 'Oct 20, 2025', status: 'SUCCESS', invoiceUrl: '#' },
  { id: 'tx_3', type: 'USAGE', description: 'Survey: SaaS Pricing', amount: -120, date: 'Oct 18, 2025', status: 'SUCCESS' },
  { id: 'tx_4', type: 'USAGE', description: 'Agent Mode Testing', amount: -50, date: 'Oct 15, 2025', status: 'SUCCESS' },
  { id: 'tx_5', type: 'USAGE', description: 'Market Analysis: EV Trends', amount: -300, date: 'Oct 12, 2025', status: 'SUCCESS' },
  { id: 'tx_6', type: 'PURCHASE', description: 'Starter Pack (1,000)', amount: 1000, date: 'Oct 10, 2025', status: 'SUCCESS', invoiceUrl: '#' },
  { id: 'tx_7', type: 'USAGE', description: 'Concept Test: New Logo', amount: -75, date: 'Oct 08, 2025', status: 'SUCCESS' },
  { id: 'tx_8', type: 'USAGE', description: 'Audience Discovery', amount: -200, date: 'Oct 05, 2025', status: 'SUCCESS' },
];

const PRICING_PACKS = [
  { credits: 1000, price: '$19', label: 'Starter', features: ['Ideal for testing', 'Standard Support'] },
  { credits: 5000, price: '$79', label: 'Growth', features: ['Best for startups', 'Priority Support', 'Bonus: +200 Credits'], recommended: true },
  { credits: 20000, price: '$299', label: 'Enterprise', features: ['Volume surveys', 'Dedicated Account Manager', 'API Access'] },
];

// --- Components ---

const PricingCard = ({ pack, onPurchase }: { pack: any, onPurchase: (pack: any) => void }) => (
  <div className={`relative p-6 rounded-2xl border flex flex-col h-full transition-all duration-300 ${pack.recommended ? 'border-[#FF3B00]/50 bg-[#FF3B00]/5 shadow-[0_0_30px_-10px_rgba(255,59,0,0.2)]' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}>

    {pack.recommended && (
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FF3B00] text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
        Best Value
      </div>
    )}

    <h3 className="text-xl font-space-grotesk font-bold text-white mb-2">{pack.label}</h3>
    <div className="flex items-baseline gap-1 mb-6">
      <span className="text-3xl font-bold font-mono text-white">{pack.price}</span>
      <span className="text-gray-400 text-sm">/ one-time</span>
    </div>

    <div className="flex items-center gap-2 mb-6">
      <Zap size={18} className="text-[#FF3B00]" />
      <span className="text-lg font-mono text-white">{pack.credits.toLocaleString()} Credits</span>
    </div>

    <div className="space-y-3 mb-8 flex-grow">
      {pack.features.map((feat: string, i: number) => (
        <div key={i} className="flex items-center gap-3 text-sm text-gray-400">
          <Check size={14} className="text-emerald-500" />
          {feat}
        </div>
      ))}
    </div>

    <button
      onClick={() => onPurchase(pack)}
      className={`w-full py-3 rounded-lg font-bold text-sm transition-all duration-300 ${pack.recommended
        ? 'bg-[#FF3B00] text-black hover:bg-white hover:text-black'
        : 'bg-white text-black hover:bg-[#FF3B00] hover:text-black'
        }`}
    >
      Purchase Pack
    </button>
  </div>
);

const HistoryRow = ({ tx, onDownload }: { tx: Transaction, onDownload: (tx: Transaction) => void }) => {
  const isPositive = tx.amount > 0;
  return (
    <div className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors group items-center">
      {/* Icon & Description - Span 5 */}
      <div className="col-span-5 flex items-center gap-4">
        <div className={`p-2.5 rounded-xl ${isPositive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500'} border border-white/5`}>
          {isPositive ? <Plus size={16} /> : <TrendingDown size={16} />}
        </div>
        <div>
          <h4 className="text-white font-medium font-inter text-sm truncate pr-4">{tx.description}</h4>
          <p className="text-[10px] text-gray-500 font-mono uppercase tracking-wider mt-0.5">{tx.id}</p>
        </div>
      </div>

      {/* Date - Span 3 */}
      <div className="col-span-3">
        <span className="text-xs text-gray-400 font-mono">{tx.date}</span>
      </div>

      {/* Status - Span 2 */}
      <div className="col-span-2">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${tx.status === 'SUCCESS' ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/20' : 'bg-yellow-500/5 text-yellow-500 border-yellow-500/20'
          }`}>
          {tx.status}
        </span>
      </div>

      {/* Amount & Action - Span 2 */}
      <div className="col-span-2 flex items-center justify-end gap-4">
        <span className={`font-mono font-bold text-sm ${isPositive ? 'text-emerald-400' : 'text-white'}`}>
          {isPositive ? '+' : ''}{tx.amount.toLocaleString()}
        </span>

        {tx.invoiceUrl ? (
          <button
            onClick={(e) => { e.stopPropagation(); onDownload(tx); }}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all border border-white/5"
            title="Download Invoice"
          >
            <Download size={14} />
          </button>
        ) : (
          <div className="w-8" />
        )}
      </div>
    </div>
  );
};

// --- Main Page ---

const CreditsPage = () => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'USAGE' | 'PURCHASES'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const { credits, isAuthenticated } = useAuth();

  // Calculate percentage for progress bar
  const total = credits?.totalCredits || 1;
  const used = credits?.usedCredits || 0;
  const usedPercentage = Math.min((used / total) * 100, 100);

  // Handlers
  const handleDownloadInvoice = (tx: Transaction) => {
    toast.success(`Downloading invoice for ${tx.description}...`);
    // Mock download logic
  };

  const handlePurchase = (pack: any) => {
    toast.info(`Initiating purchase for ${pack.label} Pack...`);
    // Integration with Stripe would go here
  };

  const handleAddFunds = () => {
    const element = document.getElementById('pricing-packs');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  // Pagination Logic
  const filteredHistory = HISTORY_DATA.filter(tx =>
    activeTab === 'ALL' ||
    (activeTab === 'USAGE' && tx.type === 'USAGE') ||
    (activeTab === 'PURCHASES' && tx.type === 'PURCHASE')
  );

  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const paginatedHistory = filteredHistory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white relative">
      <Navigation />

      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#FF3B00]/5 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
      </div>

      <div className={`relative z-10 max-w-6xl mx-auto px-6 py-12 ${isAuthenticated ? 'md:ml-64 pt-8' : 'pt-28'}`}>

        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold font-space-grotesk tracking-tight mb-2">Resource Allocation</h1>
          <p className="text-gray-400">Manage your credits (CR), view transactions, and scale your agent operations.</p>
        </div>

        {/* 1. THE WALLET (Balance Section) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">

          {/* Main Balance Card */}
          <div className="md:col-span-2 p-8 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent relative overflow-hidden flex flex-col justify-between min-h-[240px]">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <CreditCard size={120} />
            </div>

            <div>
              <p className="text-sm font-mono text-gray-400 uppercase tracking-widest mb-4">Current Balance</p>
              <div className="flex items-baseline gap-2">
                <h2 className="text-6xl font-bold font-mono text-white tracking-tighter">
                  {credits?.availableCredits.toLocaleString() || '0'}
                </h2>
                <span className="text-xl text-[#FF3B00] font-bold">CR</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">Enough for approx. <strong>12 more surveys</strong> (Standard Mode)</p>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={handleAddFunds}
                className="px-6 py-3 bg-[#FF3B00] text-black font-bold rounded-lg hover:bg-[#ff5c2e] transition-colors flex items-center gap-2"
              >
                <Plus size={18} /> Add Funds
              </button>
            </div>
          </div>

          {/* Quick Stats / Burn Rate */}
          <div className="p-6 rounded-2xl border border-white/10 bg-white/5 flex flex-col justify-center space-y-6">
            <div>
              <p className="text-xs text-gray-500 font-mono uppercase mb-2 flex justify-between">
                Utilized Credits
                <span className="text-[10px] text-gray-400 border border-gray-600 px-1 rounded">{usedPercentage.toFixed(1)}%</span>
              </p>
              <div className="flex items-baseline justify-between">
                <h3 className="text-2xl font-bold text-white font-mono">{used.toLocaleString()} CR</h3>
                <span className="text-xs text-orange-500 bg-orange-500/10 px-2 py-1 rounded font-mono">Total Used</span>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full mt-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-600 to-[#FF3B00] transition-all duration-1000 ease-out"
                  style={{ width: `${usedPercentage}%` }}
                />
              </div>
            </div>
            <div className="pt-4 border-t border-white/5 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 font-mono uppercase mb-1">Total Credits</p>
                <h3 className="text-xl font-bold text-white font-mono">
                  {(credits?.totalCredits || 0).toLocaleString()} CR
                </h3>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 font-mono uppercase mb-1">Available Credits</p>
                <h3 className="text-xl font-bold text-emerald-400 font-mono">
                  {(credits?.availableCredits || 0).toLocaleString()} CR
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* 2. THE MARKETPLACE (Pricing) */}
        <div id="pricing-packs" className="mb-16">
          <h2 className="text-2xl font-bold font-space-grotesk mb-8 flex items-center gap-2">
            <Zap size={24} className="text-[#FF3B00]" /> Top-up Packages
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRICING_PACKS.map((pack, idx) => (
              <PricingCard key={idx} pack={pack} onPurchase={handlePurchase} />
            ))}
          </div>
        </div>

        {/* 3. THE LEDGER (History) */}
        <div className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden">
          {/* Ledger Header & Tabs */}
          <div className="p-6 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <History size={20} className="text-gray-400" />
              <h3 className="text-xl font-bold font-space-grotesk">Transaction History</h3>
            </div>

            <div className="flex p-1 bg-white/5 rounded-lg">
              {['ALL', 'USAGE', 'PURCHASES'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab as any); setCurrentPage(1); }}
                  className={`px-4 py-1.5 rounded-md text-xs font-bold font-mono transition-all ${activeTab === tab ? 'bg-[#FF3B00] text-black shadow-lg shadow-orange-500/20' : 'text-gray-400 hover:text-white'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Table Headers */}
          <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-white/5 bg-white/[0.02] text-[10px] font-mono text-gray-500 uppercase tracking-wider">
            <div className="col-span-5">Transaction</div>
            <div className="col-span-3">Date</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2 text-right">Amount / Invoice</div>
          </div>

          {/* Ledger List */}
          <div className="divide-y divide-white/5">
            {paginatedHistory.length > 0 ? (
              paginatedHistory.map((tx) => (
                <HistoryRow key={tx.id} tx={tx} onDownload={handleDownloadInvoice} />
              ))
            ) : (
              <div className="p-8 text-center text-gray-500 font-mono text-sm">
                No transactions found for this period.
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="p-4 flex items-center justify-center gap-20 bg-white/[0.01]">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 text-xs font-mono text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={14} /> PREV
                </button>
                <span className="text-xs font-mono text-gray-500">
                  PAGE {currentPage} OF {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 text-xs font-mono text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  NEXT <ChevronRight size={14} />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="pt-15 mt-8 flex items-center justify-center gap-2 text-gray-500 text-sm">
          <Shield size={14} />
          <span>Payments secured by Stripe. End-to-end encrypted.</span>
        </div>

      </div>
    </div>
  );
};

export default CreditsPage;

import { CreditCard, TrendingUp, Clock, Plus } from 'lucide-react';
import CreditGauge from './CreditGauge';

interface CreditHistoryTabProps {
    credits: number;
    tier: string;
    transactions: any[];
}

export default function CreditHistoryTab({ credits, tier, transactions }: CreditHistoryTabProps) {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Balance Card - Centered & Styled as requested */}
            <div className="flex justify-center">
                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 w-full max-w-md text-center">
                    <h2 className="text-lg font-bold text-gray-900 mb-8">Current Balance</h2>

                    <div className="flex justify-center mb-6">
                        <CreditGauge
                            current={credits}
                            max={tier === 'Diamond' ? 100 : tier === 'Solitaire' ? 200 : 3}
                            size={180}
                            strokeWidth={15}
                            showLabel={false}
                        />
                    </div>

                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-8">Available Credits</p>

                    <button
                        onClick={() => window.location.href = '/pricing'}
                        className="w-full py-4 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-bold rounded-xl shadow-md transition-all transform hover:scale-[1.02] active:scale-[0.98] text-lg"
                    >
                        Get More Credits
                    </button>
                </div>
            </div>

            {/* Transaction History */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-gray-400" /> Transaction History
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 font-medium">
                            <tr>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Description</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {transactions.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                                        No transactions yet.
                                    </td>
                                </tr>
                            ) : (
                                transactions.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-gray-500">
                                            {new Date(tx.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-gray-900 font-medium">
                                            {tx.description}
                                        </td>
                                        <td className={`px-6 py-4 font-bold ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {tx.amount > 0 ? '+' : ''}{tx.amount}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                                                Completed
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div >
        </div >
    );
}

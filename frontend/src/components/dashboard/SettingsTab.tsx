import { User, Mail, Shield, Bell, Key, CreditCard } from 'lucide-react';

export default function SettingsTab({ tier }: { tier: string }) {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <User className="w-6 h-6 text-purple-600" />
                Account Settings
            </h2>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-gray-400" />
                        Subscription Plan
                    </h3>
                </div>
                <div className="p-6 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Current Plan</p>
                        <p className="text-xl font-bold text-gray-900">{tier}</p>
                    </div>
                    <button onClick={() => window.location.href = '/pricing'} className="px-6 py-2 bg-purple-50 text-purple-700 font-bold rounded-lg hover:bg-purple-100 transition-colors">
                        Manage Subscription
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        <User className="w-5 h-5 text-gray-400" />
                        Profile Information
                    </h3>
                </div>
                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                            <input type="text" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none" placeholder="John Doe" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                            <input type="email" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none" placeholder="john@example.com" />
                        </div>
                    </div>
                    <button className="px-6 py-2 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 transition-colors">
                        Save Changes
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        <Bell className="w-5 h-5 text-gray-400" />
                        Notifications
                    </h3>
                </div>
                <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-gray-900">Email Notifications</p>
                            <p className="text-sm text-gray-500">Receive updates about your analysis reports.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        <Key className="w-5 h-5 text-gray-400" />
                        API Keys
                    </h3>
                </div>
                <div className="p-6">
                    <p className="text-sm text-gray-500 mb-4">Manage your API keys for external integrations.</p>
                    <button className="px-6 py-2 border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors">
                        Generate New Key
                    </button>
                </div>
            </div>
        </div>
    );
}

'use client';

import { useState, useEffect } from 'react';
import { Loader2, Save, ExternalLink } from 'lucide-react';

export default function AdminDashboard() {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editStatus, setEditStatus] = useState('');
    const [editUrl, setEditUrl] = useState('');

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const res = await fetch('/api/admin/requests');
            const data = await res.json();
            if (data.requests) setRequests(data.requests);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (req: any) => {
        setEditingId(req.id);
        setEditStatus(req.status);
        setEditUrl(req.downloadUrl || '');
    };

    const handleSave = async (id: string) => {
        try {
            await fetch('/api/admin/requests/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    requestId: id,
                    status: editStatus,
                    downloadUrl: editUrl
                })
            });
            setEditingId(null);
            fetchRequests();
        } catch (e) {
            alert('Failed to update');
        }
    };

    if (loading) return <div className="flex items-center justify-center h-screen"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard - Video Requests</h1>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 font-medium text-gray-500">Date</th>
                                <th className="px-6 py-4 font-medium text-gray-500">User</th>
                                <th className="px-6 py-4 font-medium text-gray-500">Idea</th>
                                <th className="px-6 py-4 font-medium text-gray-500">Preferences</th>
                                <th className="px-6 py-4 font-medium text-gray-500">Status</th>
                                <th className="px-6 py-4 font-medium text-gray-500">Download URL</th>
                                <th className="px-6 py-4 font-medium text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {requests.map((req) => (
                                <tr key={req.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(req.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                        {req.user.email}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        <div className="font-bold">{req.ideaTitle}</div>
                                        <div className="text-xs text-gray-500 mt-1 max-w-xs truncate">{req.notes}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        <pre className="text-xs bg-gray-100 p-2 rounded">{JSON.stringify(JSON.parse(req.preferences), null, 2)}</pre>
                                    </td>
                                    <td className="px-6 py-4">
                                        {editingId === req.id ? (
                                            <select
                                                value={editStatus}
                                                onChange={(e) => setEditStatus(e.target.value)}
                                                className="border rounded px-2 py-1 text-sm"
                                            >
                                                <option>Pending</option>
                                                <option>In Progress</option>
                                                <option>Completed</option>
                                            </select>
                                        ) : (
                                            <span className={`px-2 py-1 text-xs font-bold rounded-full ${req.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                                    req.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {req.status}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {editingId === req.id ? (
                                            <input
                                                type="text"
                                                value={editUrl}
                                                onChange={(e) => setEditUrl(e.target.value)}
                                                placeholder="https://..."
                                                className="border rounded px-2 py-1 text-sm w-full"
                                            />
                                        ) : (
                                            req.downloadUrl ? (
                                                <a href={req.downloadUrl} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline flex items-center gap-1">
                                                    View <ExternalLink className="w-3 h-3" />
                                                </a>
                                            ) : <span className="text-gray-400">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {editingId === req.id ? (
                                            <button onClick={() => handleSave(req.id)} className="text-green-600 hover:text-green-700">
                                                <Save className="w-5 h-5" />
                                            </button>
                                        ) : (
                                            <button onClick={() => handleEdit(req)} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                                                Edit
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

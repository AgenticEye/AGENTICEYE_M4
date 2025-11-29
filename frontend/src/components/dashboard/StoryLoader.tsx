import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function StoryLoader() {
    const [msgIndex, setMsgIndex] = useState(0);
    const messages = [
        "Analyzing audience sentiment...",
        "Detecting viral patterns...",
        "Extracting key topics...",
        "Predicting engagement potential...",
        "Generating content blueprint..."
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setMsgIndex(prev => (prev + 1) % messages.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex items-center gap-2 text-sm">
            <Loader2 className="animate-spin w-4 h-4" />
            <span className="animate-pulse">{messages[msgIndex]}</span>
        </div>
    );
}

import React, { useState } from 'react';
import { Copy, ShieldCheck, AlertTriangle } from 'lucide-react';

const Seal = () => {
    const [plaintext, setPlaintext] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleSeal = async () => {
        if (!plaintext.trim()) return;
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:8080/api/vault/seal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ secretText: plaintext }),
            });

            if (!response.ok) throw new Error('Failed to seal payload');

            const data = await response.json();
            const shareableUrl = `${window.location.origin}/read/${data.id}#key=${data.secret}`;
            setResult(shareableUrl);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(result);
        alert('URL copied to clipboard!');
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 py-12 px-4">
            <header className="text-center space-y-4">
                <div className="flex justify-center">
                    <ShieldCheck className="w-12 h-12 text-emerald-500" />
                </div>
                <h1 className="text-4xl font-bold tracking-tight">Zero-Knowledge Vault</h1>
                <p className="text-zinc-400">Ephemeral encryption for your most sensitive data.</p>
            </header>

            {!result ? (
                <div className="space-y-6">
                    <textarea
                        className="input-field min-h-[200px] resize-none"
                        placeholder="Paste your sensitive payload here..."
                        value={plaintext}
                        onChange={(e) => setPlaintext(e.target.value)}
                    />
                    <button
                        onClick={handleSeal}
                        disabled={loading || !plaintext.trim()}
                        className="glow-btn w-full flex justify-center items-center gap-2"
                    >
                        {loading ? 'Sealing...' : 'Seal Payload'}
                    </button>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                </div>
            ) : (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-xl space-y-4">
                        <h2 className="text-emerald-500 font-semibold flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5" />
                            Payload Sealed Successfully
                        </h2>
                        <div className="flex gap-2">
                            <input
                                readOnly
                                value={result}
                                className="input-field text-sm font-mono truncate"
                            />
                            <button
                                onClick={copyToClipboard}
                                className="bg-zinc-800 hover:bg-zinc-700 p-3 rounded-lg transition-colors"
                            >
                                <Copy className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl space-y-3">
                        <div className="flex items-center gap-2 text-amber-500">
                            <AlertTriangle className="w-5 h-5" />
                            <h3 className="font-semibold">Warning: Absolute Ephemerality</h3>
                        </div>
                        <p className="text-sm text-zinc-400">
                            The decryption key is embedded in the URL hash and <strong className="text-zinc-200">never sent to our servers</strong>. 
                            If you lose this link, the data is gone forever. Once the link is accessed, the payload will be burned from our database.
                        </p>
                    </div>

                    <button
                        onClick={() => {setResult(null); setPlaintext('');}}
                        className="text-zinc-500 hover:text-zinc-300 text-sm underline w-full text-center"
                    >
                        Seal another secret
                    </button>
                </div>
            )}
        </div>
    );
};

export default Seal;

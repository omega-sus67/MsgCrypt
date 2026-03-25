import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Flame, Unlock, Loader2, AlertCircle } from 'lucide-react';
import { decryptPayload } from '../cryptoUtils';

const Read = () => {
    const { vaultId } = useParams();
    const [decryptedText, setDecryptedText] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [key, setKey] = useState(null);

    useEffect(() => {
        const hash = window.location.hash;
        if (hash && hash.startsWith('#key=')) {
            setKey(hash.replace('#key=', ''));
        }
    }, []);

    const handleDecrypt = async () => {
        if (!key) {
            setError("Missing decryption key in URL. The payload cannot be recovered.");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            // 1. Fetch encrypted payload from backend
            const response = await fetch(`http://localhost:8080/api/vault/${vaultId}`);
            
            if (response.status === 404 || response.status === 500) {
                throw new Error("Vault Empty. The payload has either expired or was already burned.");
            }

            const data = await response.json();
            
            // 2. Decrypt locally using Web Crypto API
            const plaintext = await decryptPayload(data.base64Ciphertext, data.base64Iv, key);
            setDecryptedText(plaintext);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 py-12 px-4">
            <header className="text-center space-y-4">
                <div className="flex justify-center">
                    <Flame className="w-12 h-12 text-orange-500" />
                </div>
                <h1 className="text-4xl font-bold tracking-tight">Ephemeral Payload</h1>
                <p className="text-zinc-400">This message will self-destruct upon decryption.</p>
            </header>

            {!decryptedText ? (
                <div className="space-y-6 text-center">
                    {!error ? (
                        <>
                            <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl flex flex-col items-center gap-4">
                                <Unlock className="w-8 h-8 text-zinc-500" />
                                <p className="text-zinc-300">A secure payload has been detected. Ready to decrypt?</p>
                            </div>
                            <button
                                onClick={handleDecrypt}
                                disabled={loading}
                                className="glow-btn w-full flex justify-center items-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Decrypting...
                                    </>
                                ) : (
                                    'Decrypt & Read'
                                )}
                            </button>
                        </>
                    ) : (
                        <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-2xl space-y-4">
                            <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
                            <h2 className="text-xl font-bold">Access Revoked</h2>
                            <p className="text-zinc-400">{error}</p>
                            <a href="/" className="inline-block text-zinc-200 underline mt-4">Return Home</a>
                        </div>
                    )}
                </div>
            ) : (
                <div className="space-y-6 animate-in zoom-in duration-500">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                        <div className="bg-zinc-800/50 px-6 py-3 border-b border-zinc-700 flex justify-between items-center text-xs text-zinc-500 uppercase tracking-widest font-bold">
                            <span>Decrypted Payload</span>
                            <span className="text-orange-500 flex items-center gap-1">
                                <Flame className="w-3 h-3" /> Burned
                            </span>
                        </div>
                        <div className="p-8 font-mono text-zinc-200 whitespace-pre-wrap leading-relaxed selection:bg-emerald-500/30">
                            {decryptedText}
                        </div>
                    </div>
                    <p className="text-center text-zinc-500 text-sm">
                        The source data has been shredded and deleted from our persistent storage.
                    </p>
                    <div className="flex justify-center pt-4">
                        <a href="/" className="glow-btn inline-block">Secure another payload</a>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Read;

"use client";

import { Button } from "@/components/ui/button";
import {
  Copy,
  Trash2,
  Plus,
  Eye,
  EyeOff,
  Check,
} from "lucide-react";
import { useState } from "react";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  visibleKey?: string;
  createdAt: Date;
  lastUsed?: Date;
}

// Mock API keys
const MOCK_API_KEYS: ApiKey[] = [
  {
    id: "1",
    name: "Production API Key",
    key: "sk_prod_1234567890abcdef",
    createdAt: new Date(2024, 8, 15),
    lastUsed: new Date(2024, 9, 20),
  },
  {
    id: "2",
    name: "Development API Key",
    key: "sk_dev_abcdefghijklmnop",
    createdAt: new Date(2024, 9, 1),
    lastUsed: new Date(2024, 9, 21),
  },
];

export default function SettingsPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(MOCK_API_KEYS);
  const [visibleKey, setVisibleKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [newKeyName, setNewKeyName] = useState("");
  const [showNewKeyForm, setShowNewKeyForm] = useState(false);

  const handleGenerateKey = () => {
    if (!newKeyName.trim()) return;

    const newKey: ApiKey = {
      id: Math.random().toString(),
      name: newKeyName,
      key: `sk_${Math.random().toString(36).substring(2, 18)}`,
      createdAt: new Date(),
    };

    setApiKeys([...apiKeys, newKey]);
    setNewKeyName("");
    setShowNewKeyForm(false);
  };

  const handleCopyKey = (key: string, keyId: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(keyId);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDeleteKey = (keyId: string) => {
    setApiKeys(apiKeys.filter((k) => k.id !== keyId));
  };

  const toggleKeyVisibility = (keyId: string) => {
    if (visibleKey === keyId) {
      setVisibleKey(null);
    } else {
      setVisibleKey(keyId);
    }
  };

  const maskKey = (key: string) => {
    return `${key.substring(0, 7)}...${key.substring(key.length - 4)}`;
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-foreground/60">Manage your account and API keys</p>
      </div>

      {/* API Keys Section */}
      <div className="bg-card border border-border rounded-lg overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-bold">API Keys</h2>
          {!showNewKeyForm && (
            <Button onClick={() => setShowNewKeyForm(true)} className="gap-2">
              <Plus size={18} />
              Generate New Key
            </Button>
          )}
        </div>

        {/* New Key Form */}
        {showNewKeyForm && (
          <div className="px-6 py-4 bg-secondary/5 border-b border-border">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">
                  Key Name
                </label>
                <input
                  type="text"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="e.g., Production, Development"
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleGenerateKey}
                  disabled={!newKeyName.trim()}
                  className="gap-2"
                >
                  Create
                </Button>
                <Button
                  onClick={() => {
                    setShowNewKeyForm(false);
                    setNewKeyName("");
                  }}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Keys List */}
        <div className="overflow-x-auto">
          {apiKeys.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-foreground/60 mb-4">
                No API keys yet. Create one to get started.
              </p>
              <Button onClick={() => setShowNewKeyForm(true)} className="gap-2">
                <Plus size={18} />
                Generate First Key
              </Button>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/5">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Key
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Last Used
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {apiKeys.map((apiKey) => (
                  <tr
                    key={apiKey.id}
                    className="border-b border-border hover:bg-secondary/5 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium">{apiKey.name}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <code className="text-sm bg-secondary/20 px-3 py-1 rounded font-mono">
                          {visibleKey === apiKey.id
                            ? apiKey.key
                            : maskKey(apiKey.key)}
                        </code>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground/70">
                      {apiKey.createdAt.toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground/70">
                      {apiKey.lastUsed
                        ? apiKey.lastUsed.toLocaleDateString()
                        : "Never"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleKeyVisibility(apiKey.id)}
                          className="p-2 hover:bg-secondary/20 rounded-lg transition-colors"
                          title={
                            visibleKey === apiKey.id
                              ? "Hide key"
                              : "Show key"
                          }
                        >
                          {visibleKey === apiKey.id ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                        <button
                          onClick={() => handleCopyKey(apiKey.key, apiKey.id)}
                          className="p-2 hover:bg-secondary/20 rounded-lg transition-colors"
                          title="Copy key"
                        >
                          {copiedKey === apiKey.id ? (
                            <Check size={18} className="text-green-500" />
                          ) : (
                            <Copy size={18} />
                          )}
                        </button>
                        <button
                          onClick={() => handleDeleteKey(apiKey.id)}
                          className="p-2 hover:bg-secondary/20 rounded-lg transition-colors"
                          title="Delete key"
                        >
                          <Trash2 size={18} className="text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
        <h3 className="font-semibold text-foreground mb-2">API Key Security</h3>
        <ul className="text-sm text-foreground/70 space-y-1">
          <li>• Keep your API keys secret and never share them publicly</li>
          <li>• Regenerate keys periodically for security</li>
          <li>• Delete unused keys to reduce security risks</li>
          <li>• Use different keys for different environments</li>
        </ul>
      </div>
    </div>
  );
}

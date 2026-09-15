'use client';

import { useState } from 'react';

interface PropertyRecord {
  id: string;
  propertyId: string;
  title: string;
  location: string;
  owner: string;
  transactionHash: string;
  blockNumber: number;
  timestamp: string;
  documentType: string;
  verified: boolean;
}

const sampleRecords: PropertyRecord[] = [
  {
    id: '1',
    propertyId: 'PROP-2026-001',
    title: '5 Bedroom Duplex, Lekki Phase 1',
    location: 'Lekki, Lagos',
    owner: '0x7a3b...9f2e',
    transactionHash: '0x8f2a4b6c8d0e2f4a6b8c0d2e4f6a8b0c2d4e6f8a0b2c4d6e8f0a2b4c6d8e0',
    blockNumber: 18542931,
    timestamp: '2026-09-10T14:30:00Z',
    documentType: 'Certificate of Occupancy',
    verified: true
  },
  {
    id: '2',
    propertyId: 'PROP-2026-002',
    title: '3 Bedroom Apartment, Victoria Island',
    location: 'Victoria Island, Lagos',
    owner: '0x9c1d...3e5f',
    transactionHash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1',
    blockNumber: 18542876,
    timestamp: '2026-09-09T10:15:00Z',
    documentType: 'Deed of Assignment',
    verified: true
  },
  {
    id: '3',
    propertyId: 'PROP-2026-003',
    title: 'Commercial Land, Abuja',
    location: 'Wuse 2, Abuja',
    owner: '0x4e5f...7a8b',
    transactionHash: '0x9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9',
    blockNumber: 18542812,
    timestamp: '2026-09-08T16:45:00Z',
    documentType: 'Governor\'s Consent',
    verified: true
  }
];

export default function BlockchainPropertyRecords() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<PropertyRecord | null>(null);

  const filteredRecords = sampleRecords.filter(record =>
    record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.propertyId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatHash = (hash: string) => {
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <section className="section-padding bg-ivory">
      <div className="container-custom">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-forest/10 text-forest px-4 py-2 rounded-full mb-4">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="text-sm font-semibold">Blockchain Secured</span>
            </div>
            <h2 className="text-4xl font-bold text-charcoal mb-4">Blockchain Property Records</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Immutable, transparent, and verifiable property ownership records secured on the blockchain
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-xl shadow-soft p-6 text-center">
              <div className="w-12 h-12 bg-forest/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-bold text-charcoal mb-2">Tamper-Proof</h3>
              <p className="text-sm text-gray-600">Records cannot be altered or deleted once recorded</p>
            </div>

            <div className="bg-white rounded-xl shadow-soft p-6 text-center">
              <div className="w-12 h-12 bg-forest/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="font-bold text-charcoal mb-2">Transparent</h3>
              <p className="text-sm text-gray-600">All transactions are publicly verifiable</p>
            </div>

            <div className="bg-white rounded-xl shadow-soft p-6 text-center">
              <div className="w-12 h-12 bg-forest/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="font-bold text-charcoal mb-2">Secure</h3>
              <p className="text-sm text-gray-600">Cryptographically secured ownership proof</p>
            </div>

            <div className="bg-white rounded-xl shadow-soft p-6 text-center">
              <div className="w-12 h-12 bg-forest/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-bold text-charcoal mb-2">Instant</h3>
              <p className="text-sm text-gray-600">Real-time verification and transfer</p>
            </div>
          </div>

          {/* Search */}
          <div className="bg-white rounded-2xl shadow-soft p-6 mb-8">
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Search by property ID, title, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field flex-1"
              />
              <button className="btn-primary">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Records Table */}
          <div className="bg-white rounded-2xl shadow-soft overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-ivory border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Property ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Property</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Location</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Document Type</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Transaction Hash</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Block</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredRecords.map(record => (
                    <tr key={record.id} className="hover:bg-ivory/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-mono text-forest">{record.propertyId}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-charcoal">{record.title}</div>
                        <div className="text-xs text-gray-500">{formatDate(record.timestamp)}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{record.location}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{record.documentType}</td>
                      <td className="px-6 py-4">
                        <code className="text-xs bg-ivory px-2 py-1 rounded font-mono text-gray-700">
                          {formatHash(record.transactionHash)}
                        </code>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">#{record.blockNumber.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full bg-green-100 text-green-700">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Verified
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedRecord(record)}
                          className="text-forest hover:text-forest-600 font-semibold text-sm"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-white rounded-2xl shadow-soft p-8 mb-8">
            <h3 className="text-2xl font-bold text-charcoal mb-6">How Blockchain Records Work</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-forest/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-forest">1</span>
                </div>
                <h4 className="font-bold text-charcoal mb-2">Document Upload</h4>
                <p className="text-sm text-gray-600">
                  Property documents are verified and uploaded to the system
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-forest/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-forest">2</span>
                </div>
                <h4 className="font-bold text-charcoal mb-2">Blockchain Recording</h4>
                <p className="text-sm text-gray-600">
                  A cryptographic hash is created and stored on the blockchain
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-forest/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-forest">3</span>
                </div>
                <h4 className="font-bold text-charcoal mb-2">Instant Verification</h4>
                <p className="text-sm text-gray-600">
                  Anyone can verify the authenticity using the transaction hash
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-br from-forest to-forest-600 rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Register Your Property on Blockchain</h3>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              Secure your property ownership with immutable blockchain records. Protect against fraud and ensure transparent transfers.
            </p>
            <a
              href="https://wa.me/2348065019971?text=Hello%20De-Greenacres,%20I'm%20interested%20in%20registering%20my%20property%20on%20the%20blockchain.%20Please%20provide%20more%20information."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary bg-white text-forest hover:bg-ivory inline-block"
            >
              Get Started
            </a>
          </div>

          {/* Modal for Record Details */}
          {selectedRecord && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-charcoal mb-2">{selectedRecord.title}</h3>
                      <p className="text-gray-600">{selectedRecord.propertyId}</p>
                    </div>
                    <button
                      onClick={() => setSelectedRecord(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-ivory rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Location</div>
                        <div className="font-semibold text-charcoal">{selectedRecord.location}</div>
                      </div>
                      <div className="p-4 bg-ivory rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Document Type</div>
                        <div className="font-semibold text-charcoal">{selectedRecord.documentType}</div>
                      </div>
                      <div className="p-4 bg-ivory rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Owner Address</div>
                        <div className="font-mono text-sm text-charcoal">{selectedRecord.owner}</div>
                      </div>
                      <div className="p-4 bg-ivory rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Recorded On</div>
                        <div className="font-semibold text-charcoal">{formatDate(selectedRecord.timestamp)}</div>
                      </div>
                    </div>

                    <div className="p-4 bg-ivory rounded-lg">
                      <div className="text-sm text-gray-600 mb-2">Transaction Hash</div>
                      <code className="block text-xs font-mono text-charcoal break-all bg-white p-3 rounded">
                        {selectedRecord.transactionHash}
                      </code>
                    </div>

                    <div className="p-4 bg-ivory rounded-lg">
                      <div className="text-sm text-gray-600 mb-2">Block Information</div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs text-gray-500">Block Number</div>
                          <div className="font-mono text-charcoal">#{selectedRecord.blockNumber.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Confirmations</div>
                          <div className="font-semibold text-green-600">1,247+ confirmations</div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <svg className="w-6 h-6 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <div className="font-bold text-green-900 mb-1">Verified & Authentic</div>
                          <div className="text-sm text-green-800">
                            This record has been verified on the blockchain and is cryptographically secured.
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(selectedRecord.transactionHash);
                          alert('Transaction hash copied to clipboard!');
                        }}
                        className="btn-outline flex-1"
                      >
                        Copy Hash
                      </button>
                      <a
                        href={`https://etherscan.io/tx/${selectedRecord.transactionHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary flex-1 text-center"
                      >
                        View on Explorer
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

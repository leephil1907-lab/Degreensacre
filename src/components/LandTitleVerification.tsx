'use client';

import { useState } from 'react';
import Link from 'next/link';

interface VerificationData {
  propertyId: string;
  propertyTitle: string;
  propertyAddress: string;
  documentationType: string;
  verificationStatus: 'verified' | 'pending' | 'unverified' | 'high-risk';
  documents: DocumentCheck[];
  riskFactors: RiskFactor[];
  verificationDate?: string;
  verifiedBy?: string;
  notes?: string;
}

interface DocumentCheck {
  name: string;
  status: 'available' | 'pending' | 'missing' | 'unverified';
  verified: boolean;
  notes?: string;
}

interface RiskFactor {
  type: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  recommendation: string;
}

interface LandTitleVerificationProps {
  propertyId: string;
  propertyTitle: string;
  propertyAddress: string;
  documentationType?: string;
}

export default function LandTitleVerification({
  propertyId,
  propertyTitle,
  propertyAddress,
  documentationType
}: LandTitleVerificationProps) {
  const [showDetails, setShowDetails] = useState(false);

  // Sample verification data (in production, this would come from API/database)
  const verificationData: VerificationData = {
    propertyId,
    propertyTitle,
    propertyAddress,
    documentationType: documentationType || 'C of O',
    verificationStatus: 'verified',
    verificationDate: '2026-09-10',
    verifiedBy: 'De-Greenacres Legal Team',
    documents: [
      {
        name: 'Certificate of Occupancy (C of O)',
        status: 'available',
        verified: true,
        notes: 'Original document available for inspection'
      },
      {
        name: 'Survey Plan',
        status: 'available',
        verified: true,
        notes: 'Registered survey plan with coordinates'
      },
      {
        name: 'Deed of Assignment',
        status: 'available',
        verified: true,
        notes: 'Properly executed and stamped'
      },
      {
        name: 'Governor\'s Consent',
        status: documentationType === 'Governor\'s Consent' ? 'available' : 'pending',
        verified: documentationType === 'Governor\'s Consent',
        notes: documentationType === 'Governor\'s Consent' ? 'Available' : 'Not applicable for this property type'
      },
      {
        name: 'Excision/Gazette',
        status: 'missing',
        verified: false,
        notes: 'Not required for this property'
      }
    ],
    riskFactors: [
      {
        type: 'low',
        title: 'Omo-Onile (Land Grabber) Risk',
        description: 'Property is in a government-approved estate with minimal omo-onile activity',
        recommendation: 'Low risk - proceed with standard verification'
      },
      {
        type: 'low',
        title: 'Community/Family Disputes',
        description: 'No known disputes or litigation affecting this property',
        recommendation: 'Clear title - safe to proceed'
      },
      {
        type: 'medium',
        title: 'Flood Risk',
        description: 'Property is in a low-lying area with moderate flood risk during rainy season',
        recommendation: 'Conduct site inspection during rainy season and verify drainage'
      }
    ],
    notes: 'This property has been verified by our legal team. All primary documents are available and authentic. We recommend conducting a physical site inspection before final purchase.'
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'unverified':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'high-risk':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getDocumentStatusIcon = (status: string, verified: boolean) => {
    if (status === 'available' && verified) {
      return (
        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      );
    }
    if (status === 'pending') {
      return (
        <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      );
    }
    if (status === 'missing') {
      return (
        <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
        </svg>
      );
    }
    return (
      <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    );
  };

  const getRiskColor = (type: string) => {
    switch (type) {
      case 'low':
        return 'border-green-300 bg-green-50';
      case 'medium':
        return 'border-amber-300 bg-amber-50';
      case 'high':
        return 'border-red-300 bg-red-50';
      default:
        return 'border-gray-300 bg-gray-50';
    }
  };

  const getRiskBadgeColor = (type: string) => {
    switch (type) {
      case 'low':
        return 'bg-green-600 text-white';
      case 'medium':
        return 'bg-amber-500 text-white';
      case 'high':
        return 'bg-red-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-soft overflow-hidden">
      {/* Header */}
      <div className={`p-6 border-b-2 ${verificationData.verificationStatus === 'verified' ? 'border-green-500 bg-green-50' : 'border-amber-500 bg-amber-50'}`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-2xl font-bold text-charcoal">Title Verification</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getStatusColor(verificationData.verificationStatus)}`}>
                {verificationData.verificationStatus === 'verified' && '✓ Verified'}
                {verificationData.verificationStatus === 'pending' && '⏱ Pending Review'}
                {verificationData.verificationStatus === 'unverified' && '⚠ Unverified'}
                {verificationData.verificationStatus === 'high-risk' && '⚠ High Risk'}
              </span>
            </div>
            <p className="text-gray-600 text-sm">
              Comprehensive verification of property documentation and risk assessment
            </p>
          </div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-forest hover:text-forest-600 font-semibold text-sm"
          >
            {showDetails ? 'Hide Details' : 'Show Details'}
          </button>
        </div>
      </div>

      {/* Quick Summary */}
      <div className="p-6 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-sm text-gray-600 mb-1">Documentation Type</div>
            <div className="font-bold text-charcoal">{verificationData.documentationType}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Verification Status</div>
            <div className="font-bold text-charcoal capitalize">{verificationData.verificationStatus}</div>
          </div>
          {verificationData.verificationDate && (
            <div>
              <div className="text-sm text-gray-600 mb-1">Last Verified</div>
              <div className="font-bold text-charcoal">
                {new Date(verificationData.verificationDate).toLocaleDateString()}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detailed View */}
      {showDetails && (
        <div className="p-6 space-y-6">
          {/* Documents Checklist */}
          <div>
            <h4 className="text-lg font-bold text-charcoal mb-4">Documents Checklist</h4>
            <div className="space-y-3">
              {verificationData.documents.map((doc, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-ivory rounded-lg">
                  {getDocumentStatusIcon(doc.status, doc.verified)}
                  <div className="flex-1">
                    <div className="font-semibold text-charcoal mb-1">{doc.name}</div>
                    {doc.notes && <div className="text-sm text-gray-600">{doc.notes}</div>}
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${
                    doc.status === 'available' && doc.verified ? 'bg-green-100 text-green-800' :
                    doc.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                    doc.status === 'missing' ? 'bg-gray-100 text-gray-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {doc.status === 'available' && doc.verified ? 'Verified' :
                     doc.status === 'pending' ? 'Pending' :
                     doc.status === 'missing' ? 'Not Required' :
                     'Unverified'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Assessment */}
          <div>
            <h4 className="text-lg font-bold text-charcoal mb-4">Risk Assessment</h4>
            <div className="space-y-3">
              {verificationData.riskFactors.map((risk, index) => (
                <div key={index} className={`p-4 rounded-lg border-2 ${getRiskColor(risk.type)}`}>
                  <div className="flex items-start gap-3">
                    <span className={`text-xs font-bold px-2 py-1 rounded ${getRiskBadgeColor(risk.type)}`}>
                      {risk.type.toUpperCase()} RISK
                    </span>
                    <div className="flex-1">
                      <div className="font-bold text-charcoal mb-1">{risk.title}</div>
                      <div className="text-sm text-gray-700 mb-2">{risk.description}</div>
                      <div className="text-sm font-semibold text-charcoal">
                        💡 {risk.recommendation}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Verification Notes */}
          {verificationData.notes && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <div className="font-bold text-blue-900 mb-1">Verification Notes</div>
                  <div className="text-sm text-blue-800">{verificationData.notes}</div>
                </div>
              </div>
            </div>
          )}

          {/* Verified By */}
          {verificationData.verifiedBy && (
            <div className="text-sm text-gray-600 text-center pt-4 border-t border-gray-200">
              Verified by <span className="font-semibold text-charcoal">{verificationData.verifiedBy}</span>
              {verificationData.verificationDate && (
                <> on {new Date(verificationData.verificationDate).toLocaleDateString()}</>
              )}
            </div>
          )}
        </div>
      )}

      {/* CTA */}
      <div className="p-6 bg-gray-50 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={`https://wa.me/2348065019971?text=${encodeURIComponent(`Hello De-Greenacres, I need more information about the verification status of ${propertyTitle} at ${propertyAddress}.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 btn-secondary flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Request Full Report
          </a>
          <Link
            href="/contact"
            className="flex-1 btn-outline flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Schedule Consultation
          </Link>
        </div>
      </div>
    </div>
  );
}

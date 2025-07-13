/**
 * DIKW Architecture Demo Page
 * Showcases the complete DIKW implementation with real examples
 */

import React, { useState } from 'react'
import {
  PostsFeedExample,
  AdminDashboardExample,
} from '@shared/components/examples'

export function DIKWDemo() {
  const [activeTab, setActiveTab] = useState<'feed' | 'admin'>('feed')

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <div className='bg-white shadow-sm border-b border-gray-200'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='py-6'>
            <h1 className='text-3xl font-bold text-gray-900'>
              🏗️ DIKW Architecture Demo
            </h1>
            <p className='mt-2 text-gray-600'>
              Experience the Data-Information-Knowledge-Wisdom pyramid in action
            </p>
          </div>

          {/* Tab Navigation */}
          <nav className='flex space-x-8 pb-4'>
            <button
              onClick={() => setActiveTab('feed')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'feed'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📋 User Experience Demo
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'admin'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              🎯 Strategic Intelligence Demo
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* DIKW Architecture Overview */}
        <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8'>
          <h2 className='text-xl font-semibold text-gray-900 mb-4'>
            🏗️ DIKW Architecture Overview
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
            <div className='text-center'>
              <div className='bg-blue-100 rounded-lg p-4 mb-3'>
                <div className='text-2xl mb-2'>📊</div>
                <h3 className='font-semibold text-blue-900'>Data Layer</h3>
              </div>
              <p className='text-sm text-gray-600'>
                Raw data collection, validation, and storage. Handles user data,
                posts, and interactions.
              </p>
            </div>
            <div className='text-center'>
              <div className='bg-green-100 rounded-lg p-4 mb-3'>
                <div className='text-2xl mb-2'>🔄</div>
                <h3 className='font-semibold text-green-900'>
                  Information Layer
                </h3>
              </div>
              <p className='text-sm text-gray-600'>
                Data processing and aggregation. Transforms raw data into
                meaningful processed information.
              </p>
            </div>
            <div className='text-center'>
              <div className='bg-purple-100 rounded-lg p-4 mb-3'>
                <div className='text-2xl mb-2'>🧠</div>
                <h3 className='font-semibold text-purple-900'>
                  Knowledge Layer
                </h3>
              </div>
              <p className='text-sm text-gray-600'>
                Business logic and recommendations. Applies rules and generates
                intelligent insights.
              </p>
            </div>
            <div className='text-center'>
              <div className='bg-orange-100 rounded-lg p-4 mb-3'>
                <div className='text-2xl mb-2'>🎯</div>
                <h3 className='font-semibold text-orange-900'>Wisdom Layer</h3>
              </div>
              <p className='text-sm text-gray-600'>
                Strategic decisions and AI advisory. Makes high-level strategic
                recommendations.
              </p>
            </div>
          </div>
        </div>

        {/* Demo Content */}
        {activeTab === 'feed' && (
          <div>
            <div className='mb-6'>
              <h2 className='text-2xl font-semibold text-gray-900 mb-2'>
                📋 User Experience Demo
              </h2>
              <p className='text-gray-600'>
                This demo shows how the DIKW architecture powers personalized
                content recommendations and intelligent user experiences. The
                system processes user data through all four layers to deliver
                optimal content suggestions.
              </p>
            </div>
            <PostsFeedExample />
          </div>
        )}

        {activeTab === 'admin' && (
          <div>
            <div className='mb-6'>
              <h2 className='text-2xl font-semibold text-gray-900 mb-2'>
                🎯 Strategic Intelligence Demo
              </h2>
              <p className='text-gray-600'>
                This demo showcases system-wide intelligence and strategic
                decision making. The DIKW architecture provides comprehensive
                insights for platform optimization and strategic planning.
              </p>
            </div>
            <AdminDashboardExample />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className='bg-white border-t border-gray-200 mt-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <div className='text-center'>
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>
              🚀 DIKW Architecture Implementation Complete
            </h3>
            <p className='text-gray-600 mb-4'>
              The Data-Information-Knowledge-Wisdom pyramid provides a robust
              foundation for intelligent application architecture.
            </p>
            <div className='flex justify-center space-x-6 text-sm text-gray-500'>
              <span>✓ Modular Design</span>
              <span>✓ Scalable Architecture</span>
              <span>✓ AI-Powered Intelligence</span>
              <span>✓ Strategic Decision Support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

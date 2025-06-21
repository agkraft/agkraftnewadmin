import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'react-toastify';

// Import all API functions
import { getAllFAQs, createFAQ, getFAQStatistics } from '@/features/faqs/api/faqApi';
import { getAllJobProfiles, createJobProfile, getJobStatistics } from '@/features/jobProfiles/api/jobApi';
import { getAllCareerApplications, getCareerStatistics } from '@/features/careers/api/careerApi';
import { getAllComments, createComment, getCommentStatistics } from '@/features/postComments/api/commentApi';

const ApiTestPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>({});

  const testAPI = async (apiName: string, apiFunction: () => Promise<any>) => {
    setLoading(true);
    try {
      const result = await apiFunction();
      setResults(prev => ({ ...prev, [apiName]: result }));
      
      if (result.status) {
        toast.success(`${apiName} API working!`);
      } else {
        toast.error(`${apiName} API failed: ${result.message}`);
      }
      
      console.log(`${apiName} Result:`, result);
    } catch (error) {
      console.error(`${apiName} Error:`, error);
      toast.error(`${apiName} API error: ${error.message}`);
      setResults(prev => ({ ...prev, [apiName]: { error: error.message } }));
    } finally {
      setLoading(false);
    }
  };

  const testFAQsAPI = () => {
    testAPI('FAQs GetAll', () => getAllFAQs({ page: 1, limit: 5 }));
  };

  const testFAQsStats = () => {
    testAPI('FAQs Statistics', () => getFAQStatistics());
  };

  const testCreateFAQ = () => {
    testAPI('FAQs Create', () => createFAQ({
      question: 'Test FAQ Question?',
      answer: 'This is a test FAQ answer.',
      category: 'Test',
      status: 'active',
      order: 1
    }));
  };

  const testJobsAPI = () => {
    testAPI('Jobs GetAll', () => getAllJobProfiles({ page: 1, limit: 5 }));
  };

  const testJobsStats = () => {
    testAPI('Jobs Statistics', () => getJobStatistics());
  };

  const testCreateJob = () => {
    testAPI('Jobs Create', () => createJobProfile({
      jobTitle: 'Test Developer',
      jobDescription: 'This is a test job description.',
      techStack: ['React', 'Node.js'],
      startDateApplied: new Date().toISOString(),
      lastDayApplied: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      jobType: 'full-time'
    }));
  };

  const testCareersAPI = () => {
    testAPI('Careers GetAll', () => getAllCareerApplications({ page: 1, limit: 5 }));
  };

  const testCareersStats = () => {
    testAPI('Careers Statistics', () => getCareerStatistics());
  };

  const testCommentsAPI = () => {
    testAPI('Comments GetAll', () => getAllComments({ page: 1, limit: 5 }));
  };

  const testCommentsStats = () => {
    testAPI('Comments Statistics', () => getCommentStatistics());
  };

  const testCreateComment = () => {
    testAPI('Comments Create', () => createComment({
      name: 'Test User',
      email: 'test@example.com',
      comment: 'This is a test comment.'
    }));
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">API Test Page</h1>
        <p className="text-gray-600 mt-2">Test all 4 new APIs to ensure they are working properly</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* FAQs API Tests */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">FAQs API</CardTitle>
            <CardDescription>Test FAQ endpoints</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={testFAQsAPI} 
              disabled={loading}
              className="w-full"
              variant="outline"
            >
              Test Get All FAQs
            </Button>
            <Button 
              onClick={testFAQsStats} 
              disabled={loading}
              className="w-full"
              variant="outline"
            >
              Test FAQ Statistics
            </Button>
            <Button 
              onClick={testCreateFAQ} 
              disabled={loading}
              className="w-full"
              variant="outline"
            >
              Test Create FAQ
            </Button>
            {results['FAQs GetAll'] && (
              <div className="text-xs p-2 bg-gray-100 rounded">
                Status: {results['FAQs GetAll'].status ? 'Success' : 'Failed'}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Jobs API Tests */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Jobs API</CardTitle>
            <CardDescription>Test Job Profile endpoints</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={testJobsAPI} 
              disabled={loading}
              className="w-full"
              variant="outline"
            >
              Test Get All Jobs
            </Button>
            <Button 
              onClick={testJobsStats} 
              disabled={loading}
              className="w-full"
              variant="outline"
            >
              Test Job Statistics
            </Button>
            <Button 
              onClick={testCreateJob} 
              disabled={loading}
              className="w-full"
              variant="outline"
            >
              Test Create Job
            </Button>
            {results['Jobs GetAll'] && (
              <div className="text-xs p-2 bg-gray-100 rounded">
                Status: {results['Jobs GetAll'].status ? 'Success' : 'Failed'}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Careers API Tests */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Careers API</CardTitle>
            <CardDescription>Test Career Application endpoints</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={testCareersAPI} 
              disabled={loading}
              className="w-full"
              variant="outline"
            >
              Test Get All Careers
            </Button>
            <Button 
              onClick={testCareersStats} 
              disabled={loading}
              className="w-full"
              variant="outline"
            >
              Test Career Statistics
            </Button>
            {results['Careers GetAll'] && (
              <div className="text-xs p-2 bg-gray-100 rounded">
                Status: {results['Careers GetAll'].status ? 'Success' : 'Failed'}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Comments API Tests */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Comments API</CardTitle>
            <CardDescription>Test Post Comment endpoints</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={testCommentsAPI} 
              disabled={loading}
              className="w-full"
              variant="outline"
            >
              Test Get All Comments
            </Button>
            <Button 
              onClick={testCommentsStats} 
              disabled={loading}
              className="w-full"
              variant="outline"
            >
              Test Comment Statistics
            </Button>
            <Button 
              onClick={testCreateComment} 
              disabled={loading}
              className="w-full"
              variant="outline"
            >
              Test Create Comment
            </Button>
            {results['Comments GetAll'] && (
              <div className="text-xs p-2 bg-gray-100 rounded">
                Status: {results['Comments GetAll'].status ? 'Success' : 'Failed'}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Results Display */}
      <Card>
        <CardHeader>
          <CardTitle>Test Results</CardTitle>
          <CardDescription>Detailed API test results</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto max-h-96">
            {JSON.stringify(results, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiTestPage;

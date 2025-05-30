'use client'
import React, { useState, useEffect, useCallback } from 'react';
import { logger, LogEntry, LogLevel } from '@/lib/logger';
import Button from '@/components/ui/Button';
import ErrorBoundary from '@/components/error/ErrorBoundary';

interface ErrorStats {
  totalErrors: number;
  errorsByLevel: Record<LogLevel, number>;
  errorsByContext: Record<string, number>;
  recentErrors: LogEntry[];
  performanceMetrics: {
    averageResponseTime: number;
    slowestEndpoints: Array<{ endpoint: string; avgTime: number }>;
    errorRate: number;
  };
}

const ErrorMonitoringDashboard: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [stats, setStats] = useState<ErrorStats | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<LogLevel | 'all'>('all');
  const [selectedContext, setSelectedContext] = useState<string | 'all'>('all');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const loadLogs = useCallback(() => {
    const allLogs = logger.getLogs();
    setLogs(allLogs);
    calculateStats(allLogs);
  }, []);

  useEffect(() => {
    loadLogs();
    
    if (autoRefresh) {
      const interval = setInterval(loadLogs, 5000); // Refresh every 5 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh, loadLogs]);

  const calculateStats = (allLogs: LogEntry[]) => {
    const errorLogs = allLogs.filter(log => log.level >= LogLevel.WARN);
    
    const errorsByLevel = {
      [LogLevel.DEBUG]: 0,
      [LogLevel.INFO]: 0,
      [LogLevel.WARN]: 0,
      [LogLevel.ERROR]: 0,
      [LogLevel.FATAL]: 0,
    };

    const errorsByContext: Record<string, number> = {};
    const performanceLogs: LogEntry[] = [];

    allLogs.forEach(log => {
      errorsByLevel[log.level]++;
      
      if (log.context) {
        errorsByContext[log.context] = (errorsByContext[log.context] || 0) + 1;
      }

      if (log.context === 'Performance' || log.metadata?.duration) {
        performanceLogs.push(log);
      }
    });

    // Calculate performance metrics
    const responseTimes = performanceLogs
      .filter(log => log.metadata?.duration)
      .map(log => parseFloat(log.metadata!.duration as string));

    const averageResponseTime = responseTimes.length > 0 
      ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length 
      : 0;

    const errorRate = allLogs.length > 0 
      ? (errorLogs.length / allLogs.length) * 100 
      : 0;

    setStats({
      totalErrors: errorLogs.length,
      errorsByLevel,
      errorsByContext,
      recentErrors: errorLogs.slice(-10).reverse(),
      performanceMetrics: {
        averageResponseTime,
        slowestEndpoints: [],
        errorRate,
      },
    });
  };

  const filteredLogs = logs.filter(log => {
    const levelMatch = selectedLevel === 'all' || log.level === selectedLevel;
    const contextMatch = selectedContext === 'all' || log.context === selectedContext;
    return levelMatch && contextMatch;
  });

  const handleExportLogs = async () => {
    setIsExporting(true);
    try {
      const exportData = logger.exportLogs();
      const blob = new Blob([exportData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `error-logs-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export logs:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleClearLogs = () => {
    if (confirm('Are you sure you want to clear all logs? This action cannot be undone.')) {
      // Note: We'd need to add a clearLogs method to the logger
      setLogs([]);
      setStats(null);
    }
  };

  const getLevelColor = (level: LogLevel): string => {
    switch (level) {
      case LogLevel.DEBUG: return 'text-gray-500';
      case LogLevel.INFO: return 'text-blue-500';
      case LogLevel.WARN: return 'text-yellow-500';
      case LogLevel.ERROR: return 'text-red-500';
      case LogLevel.FATAL: return 'text-red-700';
      default: return 'text-gray-500';
    }
  };

  const getLevelName = (level: LogLevel): string => {
    return ['DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL'][level];
  };

  const uniqueContexts = Array.from(new Set(logs.map(log => log.context).filter(Boolean)));

  return (
    <ErrorBoundary level="critical">
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Error Monitoring Dashboard
          </h2>
          <div className="flex gap-2">
            <Button
              onClick={() => setAutoRefresh(!autoRefresh)}
              variant={autoRefresh ? 'primary' : 'outline'}
              size="sm"
            >
              {autoRefresh ? 'Auto Refresh On' : 'Auto Refresh Off'}
            </Button>
            <Button onClick={loadLogs} variant="outline" size="sm">
              Refresh
            </Button>
            <Button 
              onClick={handleExportLogs} 
              variant="outline" 
              size="sm"
              disabled={isExporting}
            >
              {isExporting ? 'Exporting...' : 'Export Logs'}
            </Button>
            <Button onClick={handleClearLogs} variant="danger" size="sm">
              Clear Logs
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Logs</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{logs.length}</p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-red-500">Total Errors</h3>
              <p className="text-2xl font-bold text-red-600">{stats.totalErrors}</p>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-yellow-500">Error Rate</h3>
              <p className="text-2xl font-bold text-yellow-600">
                {stats.performanceMetrics.errorRate.toFixed(1)}%
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-blue-500">Avg Response Time</h3>
              <p className="text-2xl font-bold text-blue-600">
                {stats.performanceMetrics.averageResponseTime.toFixed(0)}ms
              </p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Log Level
            </label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value as LogLevel | 'all')}
              className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Levels</option>
              <option value={LogLevel.DEBUG}>Debug</option>
              <option value={LogLevel.INFO}>Info</option>
              <option value={LogLevel.WARN}>Warning</option>
              <option value={LogLevel.ERROR}>Error</option>
              <option value={LogLevel.FATAL}>Fatal</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Context
            </label>
            <select
              value={selectedContext}
              onChange={(e) => setSelectedContext(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Contexts</option>
              {uniqueContexts.map(context => (
                <option key={context} value={context}>{context}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Error Logs Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Context
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Message
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  User
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredLogs.slice(0, 50).map((log, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${getLevelColor(log.level)}`}>
                      {getLevelName(log.level)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {log.context || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    <div className="max-w-xs truncate" title={log.message}>
                      {log.message}
                    </div>
                    {log.metadata && (
                      <details className="mt-1">
                        <summary className="cursor-pointer text-xs text-gray-500">
                          Metadata
                        </summary>
                        <pre className="text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded mt-1 overflow-x-auto">
                          {JSON.stringify(log.metadata, null, 2)}
                        </pre>
                      </details>
                    )}
                    {log.stack && (
                      <details className="mt-1">
                        <summary className="cursor-pointer text-xs text-red-500">
                          Stack Trace
                        </summary>
                        <pre className="text-xs bg-red-50 dark:bg-red-900/20 p-2 rounded mt-1 overflow-x-auto">
                          {log.stack}
                        </pre>
                      </details>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {log.userId || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLogs.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No logs found matching the current filters.
          </div>
        )}

        {filteredLogs.length > 50 && (
          <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
            Showing first 50 of {filteredLogs.length} logs. Use filters to narrow down results.
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default ErrorMonitoringDashboard; 
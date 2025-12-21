"use client"

import React, { useState } from 'react';
import { MoreVertical, FileText, Link2, Clock, AlertCircle, CheckCircle, RefreshCw, LayoutGrid, LayoutList } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

const DocumentsList = () => {
  const [viewMode, setViewMode] = useState('table');
  const [documents, setDocuments] = useState([
    {
      id: 1,
      title: 'Product Requirements Document',
      snippet: 'This document outlines the core features and specifications for the Q4 release...',
      sourceType: 'Manual',
      status: 'indexed',
      updated: '2h ago'
    },
    {
      id: 2,
      title: 'API Documentation',
      snippet: 'Complete REST API reference with authentication, endpoints, and response formats...',
      sourceType: 'URL',
      status: 'indexed',
      updated: '5h ago'
    },
    {
      id: 3,
      title: 'Marketing Strategy 2024',
      snippet: 'Comprehensive marketing plan covering digital channels, budget allocation...',
      sourceType: 'Manual',
      status: 'processing',
      updated: '1d ago'
    },
    {
      id: 4,
      title: 'Technical Architecture Overview',
      snippet: 'System design and infrastructure details for the microservices platform...',
      sourceType: 'URL',
      status: 'failed',
      updated: '3d ago'
    },
    {
      id: 5,
      title: 'User Research Findings',
      snippet: 'Analysis of user interviews and survey data from 150+ participants...',
      sourceType: 'Manual',
      status: 'indexed',
      updated: '1w ago'
    },
  ]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'indexed':
        return <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-500" />;
      case 'processing':
        return <RefreshCw className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-spin" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      indexed: 'default',
      processing: 'secondary',
      failed: 'destructive'
    };
    return (
      <Badge variant={variants[status]} className="capitalize">
        {status}
      </Badge>
    );
  };

  const handleAction = (action, doc) => {
    console.log(`${action} document:`, doc);
    // Handle actions here
  };

  const getRowClassName = (status) => {
    const base = "cursor-pointer transition-colors";
    if (status === 'failed') return `${base} bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-950/30`;
    if (status === 'processing') return `${base} bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/20 dark:hover:bg-blue-950/30`;
    return `${base} hover:bg-muted/50`;
  };

  return (
    <div className="w-full p-6 bg-background">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Documents</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage and organize your indexed documents</p>
        </div>
        <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value)}>
          <ToggleGroupItem value="table" aria-label="Table view">
            <LayoutList className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="cards" aria-label="Cards view">
            <LayoutGrid className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {viewMode === 'table' ? (
        <div className="border rounded-lg">
          <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[30%]">Title / Source</TableHead>
              <TableHead className="w-[35%]">Snippet</TableHead>
              <TableHead className="w-[10%]">Source Type</TableHead>
              <TableHead className="w-[12%]">Status</TableHead>
              <TableHead className="w-[10%]">Updated</TableHead>
              <TableHead className="w-[3%]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc) => (
              <TableRow 
                key={doc.id} 
                className={getRowClassName(doc.status)}
                onClick={() => handleAction('view', doc)}
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(doc.status)}
                    <span className="truncate">{doc.title}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-muted-foreground line-clamp-2">
                    {doc.snippet}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    {doc.sourceType === 'URL' ? (
                      <Link2 className="w-3.5 h-3.5 text-muted-foreground" />
                    ) : (
                      <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                    )}
                    <span className="text-sm">{doc.sourceType}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {getStatusBadge(doc.status)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />
                    {doc.updated}
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleAction('view', doc); }}>
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleAction('edit', doc); }}>
                        Edit
                      </DropdownMenuItem>
                      {doc.status === 'failed' && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleAction('reindex', doc); }}>
                            Re-index
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive"
                        onClick={(e) => { e.stopPropagation(); handleAction('delete', doc); }}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {documents.map((doc) => (
            <Card 
              key={doc.id} 
              className={`cursor-pointer transition-all hover:shadow-md ${
                doc.status === 'failed' 
                  ? 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/20' 
                  : doc.status === 'processing'
                  ? 'border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/20'
                  : ''
              }`}
              onClick={() => handleAction('view', doc)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {getStatusIcon(doc.status)}
                    <h3 className="font-semibold text-base truncate">{doc.title}</h3>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 shrink-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleAction('view', doc); }}>
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleAction('edit', doc); }}>
                        Edit
                      </DropdownMenuItem>
                      {doc.status === 'failed' && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleAction('reindex', doc); }}>
                            Re-index
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive"
                        onClick={(e) => { e.stopPropagation(); handleAction('delete', doc); }}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {doc.snippet}
                </p>
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      {doc.sourceType === 'URL' ? (
                        <Link2 className="w-3.5 h-3.5" />
                      ) : (
                        <FileText className="w-3.5 h-3.5" />
                      )}
                      <span>{doc.sourceType}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{doc.updated}</span>
                    </div>
                  </div>
                  {getStatusBadge(doc.status)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentsList;

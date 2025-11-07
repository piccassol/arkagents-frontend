import React, { useState, useEffect } from 'react';
import { Download, Search, X, Eye } from 'lucide-react';

const WorkflowGallery = ({ onClose, onImportWorkflow }) => {
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [error, setError] = useState(null);

  useEffect(() => {
    loadWorkflows();
  }, []);

  const loadWorkflows = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch the repository contents
      const response = await fetch('https://api.github.com/repos/Zie619/n8n-workflows/contents');
      
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }
      
      const files = await response.json();
      
      // Filter for JSON files (n8n workflows)
      const jsonFiles = files.filter(file => 
        file.name.endsWith('.json') && file.type === 'file'
      );

      // Fetch content of each workflow file
      const workflowPromises = jsonFiles.map(async (file) => {
        try {
          const contentResponse = await fetch(file.download_url);
          const workflowData = await contentResponse.json();
          
          // Parse n8n workflow format
          return {
            id: file.sha,
            name: workflowData.name || file.name.replace('.json', ''),
            description: workflowData.description || 'No description available',
            category: workflowData.tags?.[0] || 'Uncategorized',
            nodes: workflowData.nodes || [],
            connections: workflowData.connections || {},
            rawData: workflowData,
            complexity: workflowData.nodes?.length > 5 ? 'Advanced' : 
                       workflowData.nodes?.length > 3 ? 'Medium' : 'Easy',
            icon: getIconForWorkflow(workflowData)
          };
        } catch (err) {
          console.error(`Error loading workflow ${file.name}:`, err);
          return null;
        }
      });

      const loadedWorkflows = (await Promise.all(workflowPromises)).filter(w => w !== null);
      
      setWorkflows(loadedWorkflows);
      
      // Extract unique categories
      const cats = ['all', ...new Set(loadedWorkflows.map(w => w.category))];
      setCategories(cats);
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading workflows from GitHub:', error);
      setError(error.message);
      
      // Fallback to example workflows if GitHub fetch fails
      loadExampleWorkflows();
    }
  };

  const getIconForWorkflow = (workflow) => {
    // Try to determine icon based on workflow name or nodes
    const name = workflow.name?.toLowerCase() || '';
    if (name.includes('email') || name.includes('mail')) return '📧';
    if (name.includes('slack') || name.includes('chat')) return '💬';
    if (name.includes('document') || name.includes('pdf')) return '📄';
    if (name.includes('social') || name.includes('twitter')) return '📱';
    if (name.includes('calendar')) return '📅';
    if (name.includes('data') || name.includes('database')) return '📊';
    if (name.includes('ai') || name.includes('gpt')) return '🤖';
    if (name.includes('crm') || name.includes('sales')) return '🎯';
    return '🔧';
  };

  const loadExampleWorkflows = () => {
    // Fallback example workflows
    const exampleWorkflows = [
      {
        id: 1,
        name: 'AI Email Assistant',
        description: 'Auto-write and send professional email replies using GPT-4',
        category: 'AI',
        nodes: [
          { type: 'trigger', name: 'Gmail Trigger' },
          { type: 'agent', name: 'GPT-4 Response' },
          { type: 'email', name: 'Send Reply' }
        ],
        complexity: 'Easy',
        icon: '📧'
      },
      {
        id: 2,
        name: 'Document Summarizer',
        description: 'Parse PDFs, extract content, and generate summaries',
        category: 'Document Processing',
        nodes: [
          { type: 'trigger', name: 'File Upload' },
          { type: 'code', name: 'Extract Text' },
          { type: 'agent', name: 'AI Summary' },
          { type: 'database', name: 'Save Result' }
        ],
        complexity: 'Medium',
        icon: '📄'
      },
      {
        id: 3,
        name: 'Lead Scoring Agent',
        description: 'Score incoming leads based on sentiment and keywords',
        category: 'Sales',
        nodes: [
          { type: 'trigger', name: 'Webhook' },
          { type: 'agent', name: 'Sentiment Analysis' },
          { type: 'condition', name: 'Score Filter' },
          { type: 'http', name: 'Update CRM' }
        ],
        complexity: 'Medium',
        icon: '🎯'
      },
      {
        id: 4,
        name: 'Social Media Monitor',
        description: 'Monitor social media mentions and respond automatically',
        category: 'Marketing',
        nodes: [
          { type: 'trigger', name: 'Twitter Monitor' },
          { type: 'condition', name: 'Filter Mentions' },
          { type: 'agent', name: 'Generate Response' },
          { type: 'http', name: 'Post Reply' }
        ],
        complexity: 'Easy',
        icon: '📱'
      },
      {
        id: 5,
        name: 'Customer Support Bot',
        description: 'Answer customer queries using LLM + knowledge base',
        category: 'Support',
        nodes: [
          { type: 'trigger', name: 'Chat Trigger' },
          { type: 'database', name: 'Search KB' },
          { type: 'agent', name: 'GPT Response' },
          { type: 'http', name: 'Send Reply' }
        ],
        complexity: 'Advanced',
        icon: '🤖'
      },
      {
        id: 6,
        name: 'Data Pipeline',
        description: 'Extract, transform, and load data from multiple sources',
        category: 'Data',
        nodes: [
          { type: 'trigger', name: 'Schedule' },
          { type: 'http', name: 'Fetch Data' },
          { type: 'code', name: 'Transform' },
          { type: 'database', name: 'Store' }
        ],
        complexity: 'Medium',
        icon: '📊'
      },
      {
        id: 7,
        name: 'Calendar Event Creator',
        description: 'Parse natural language and create calendar events',
        category: 'Productivity',
        nodes: [
          { type: 'trigger', name: 'Chat Message' },
          { type: 'agent', name: 'Extract Details' },
          { type: 'http', name: 'Google Calendar' }
        ],
        complexity: 'Easy',
        icon: '📅'
      },
      {
        id: 8,
        name: 'Content Generator',
        description: 'Generate blog posts, social media content, and more',
        category: 'Content',
        nodes: [
          { type: 'trigger', name: 'Manual Trigger' },
          { type: 'agent', name: 'Generate Content' },
          { type: 'code', name: 'Format' },
          { type: 'http', name: 'Publish' }
        ],
        complexity: 'Medium',
        icon: '✍️'
      }
    ];

    setWorkflows(exampleWorkflows);
    const cats = ['all', ...new Set(exampleWorkflows.map(w => w.category))];
    setCategories(cats);
    setLoading(false);
  };

  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          workflow.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || workflow.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleImport = (workflow) => {
    onImportWorkflow(workflow);
    onClose();
  };

  const getComplexityColor = (complexity) => {
    switch (complexity) {
      case 'Easy': return '#10b981';
      case 'Medium': return '#f59e0b';
      case 'Advanced': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        background: '#1e293b',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '1200px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid #334155',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{ color: 'white', margin: 0, marginBottom: '8px' }}>
              🔧 Workflow Gallery
            </h2>
            <p style={{ color: '#94a3b8', margin: 0, fontSize: '14px' }}>
              {error ? '⚠️ Loading from GitHub failed, showing examples' : 
               `${workflows.length} workflow${workflows.length !== 1 ? 's' : ''} from Zie619/n8n-workflows`}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '8px'
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Search and Filters */}
        <div style={{ padding: '24px', borderBottom: '1px solid #334155' }}>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Search
                size={20}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#64748b'
                }}
              />
              <input
                type="text"
                placeholder="Search workflows..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 44px',
                  background: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '14px'
                }}
              />
            </div>
            <button
              onClick={loadWorkflows}
              style={{
                padding: '12px 20px',
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              🔄 Reload
            </button>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                style={{
                  padding: '8px 16px',
                  background: selectedCategory === category ? '#667eea' : '#334155',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  textTransform: 'capitalize'
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Workflow Grid */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px'
        }}>
          {loading ? (
            <div style={{ textAlign: 'center', color: '#94a3b8', padding: '40px' }}>
              <div style={{ marginBottom: '16px' }}>Loading workflows from GitHub...</div>
              <div style={{ fontSize: '32px' }}>⏳</div>
            </div>
          ) : filteredWorkflows.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#94a3b8', padding: '40px' }}>
              No workflows found
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '20px'
            }}>
              {filteredWorkflows.map(workflow => (
                <div
                  key={workflow.id}
                  style={{
                    background: '#334155',
                    borderRadius: '12px',
                    padding: '20px',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    border: '2px solid transparent'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.borderColor = '#667eea';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'transparent';
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '12px'
                  }}>
                    <span style={{ fontSize: '32px' }}>{workflow.icon}</span>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ color: 'white', margin: 0, fontSize: '16px', marginBottom: '4px' }}>
                        {workflow.name}
                      </h3>
                      <span style={{
                        display: 'inline-block',
                        padding: '2px 8px',
                        background: getComplexityColor(workflow.complexity),
                        color: 'white',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: '600'
                      }}>
                        {workflow.complexity}
                      </span>
                    </div>
                  </div>

                  <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '16px', lineHeight: '1.5' }}>
                    {workflow.description}
                  </p>

                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ color: '#64748b', fontSize: '12px', marginBottom: '8px' }}>
                      Nodes ({workflow.nodes?.length || 0}):
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {workflow.nodes?.slice(0, 4).map((node, idx) => (
                        <span
                          key={idx}
                          style={{
                            padding: '4px 8px',
                            background: '#1e293b',
                            color: '#94a3b8',
                            borderRadius: '4px',
                            fontSize: '11px'
                          }}
                        >
                          {node.name || node.type}
                        </span>
                      ))}
                      {workflow.nodes?.length > 4 && (
                        <span style={{
                          padding: '4px 8px',
                          background: '#1e293b',
                          color: '#94a3b8',
                          borderRadius: '4px',
                          fontSize: '11px'
                        }}>
                          +{workflow.nodes.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => setSelectedWorkflow(workflow)}
                      style={{
                        flex: 1,
                        padding: '8px 16px',
                        background: '#475569',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <Eye size={14} />
                      Preview
                    </button>
                    <button
                      onClick={() => handleImport(workflow)}
                      style={{
                        flex: 1,
                        padding: '8px 16px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <Download size={14} />
                      Import
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Preview Modal */}
        {selectedWorkflow && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1001,
              padding: '20px'
            }}
            onClick={() => setSelectedWorkflow(null)}
          >
            <div
              style={{
                background: '#1e293b',
                borderRadius: '12px',
                padding: '24px',
                maxWidth: '600px',
                width: '100%',
                maxHeight: '80vh',
                overflowY: 'auto'
              }}
              onClick={e => e.stopPropagation()}
            >
              <h3 style={{ color: 'white', marginTop: 0 }}>
                {selectedWorkflow.icon} {selectedWorkflow.name}
              </h3>
              <p style={{ color: '#94a3b8', lineHeight: '1.6' }}>
                {selectedWorkflow.description}
              </p>
              
              <div style={{ marginTop: '20px' }}>
                <h4 style={{ color: 'white', fontSize: '14px', marginBottom: '12px' }}>
                  Workflow Nodes ({selectedWorkflow.nodes?.length || 0}):
                </h4>
                {selectedWorkflow.nodes?.map((node, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '12px',
                      background: '#334155',
                      borderRadius: '8px',
                      marginBottom: '8px',
                      color: 'white',
                      fontSize: '14px'
                    }}
                  >
                    {idx + 1}. {node.name || node.type || 'Unknown Node'} 
                    <span style={{ color: '#94a3b8', fontSize: '12px', marginLeft: '8px' }}>
                      ({node.type || 'unknown'})
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setSelectedWorkflow(null)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#475569',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleImport(selectedWorkflow);
                    setSelectedWorkflow(null);
                  }}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  Import Workflow
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowGallery;
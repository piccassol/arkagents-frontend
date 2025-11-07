import React, { useState, useEffect } from 'react';
import { SignedIn, SignedOut, UserButton, useUser, SignInButton, SignUpButton } from '@clerk/clerk-react';
import AgentTemplates from './components/AgentTemplates';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import WorkflowBuilder from './components/WorkflowBuilder';
import './App.css';

const API_URL = 'https://api.arktechnologies.ai';

function App() {
  const { user } = useUser();
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCreateAgent, setShowCreateAgent] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showWorkflowBuilder, setShowWorkflowBuilder] = useState(false);
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentDesc, setNewAgentDesc] = useState('');
  const [newAgentPrompt, setNewAgentPrompt] = useState('');

  // Load agents only when user is authenticated
  useEffect(() => {
    if (user) {
      loadAgents();
    }
  }, [user]);

  // Load conversation when agent is selected
  useEffect(() => {
    if (selectedAgent) {
      loadConversation(selectedAgent.id);
    }
  }, [selectedAgent]);

  const loadAgents = async () => {
    try {
      const response = await fetch(`${API_URL}/api/agents/list`);
      const data = await response.json();
      setAgents(data.agents);
    } catch (error) {
      console.error('Error loading agents:', error);
    }
  };

  const loadConversation = async (agentId) => {
    try {
      const response = await fetch(`${API_URL}/api/agents/${agentId}/conversation`);
      const data = await response.json();
      
      setMessages(data.conversation || []);
    } catch (error) {
      console.error('Error loading conversation:', error);
      setMessages([]);
    }
  };

  const createAgent = async () => {
    try {
      const response = await fetch(`${API_URL}/api/agents/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newAgentName,
          description: newAgentDesc,
          system_prompt: newAgentPrompt || undefined
        })
      });
      const agent = await response.json();
      setAgents([...agents, agent]);
      setShowCreateAgent(false);
      setNewAgentName('');
      setNewAgentDesc('');
      setNewAgentPrompt('');
      setSelectedAgent(agent);
      setMessages([]);
    } catch (error) {
      console.error('Error creating agent:', error);
    }
  };

  const createAgentFromTemplate = async (template) => {
    try {
      const response = await fetch(`${API_URL}/api/agents/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: template.name,
          description: template.description,
          system_prompt: template.systemPrompt
        })
      });
      const agent = await response.json();
      setAgents([...agents, agent]);
      setShowTemplates(false);
      setSelectedAgent(agent);
      setMessages([]);
    } catch (error) {
      console.error('Error creating agent from template:', error);
      alert('Failed to create agent. Please try again.');
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !selectedAgent) return;

    const userMessage = { role: 'user', message: inputMessage };
    setMessages([...messages, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/agents/${selectedAgent.id}/chat`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: inputMessage })
        }
      );
      const data = await response.json();

      setMessages(prev => [...prev, {
        role: 'assistant',
        message: data.message
      }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        message: 'Error: Could not get response from agent'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const clearConversation = async () => {
    if (!selectedAgent) return;
    if (!window.confirm('Clear all messages with this agent?')) return;
    setMessages([]);
  };

  return (
    <>
      {/* Authentication Wall - Shown when NOT signed in */}
      <SignedOut>
        <div className="auth-container">
          <div className="auth-box">
            <div className="auth-header">
              <h1>🤖 ArkAgents</h1>
              <p>Create powerful AI agents in seconds</p>
            </div>
            
            <div className="auth-buttons" style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '30px' }}>
              <SignInButton mode="redirect" redirectUrl={window.location.href}>
                <button style={{
                  padding: '15px 30px',
                  fontSize: '16px',
                  fontWeight: '600',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}>
                  Sign In
                </button>
              </SignInButton>

              <SignUpButton mode="redirect" redirectUrl={window.location.href}>
                <button style={{
                  padding: '15px 30px',
                  fontSize: '16px',
                  fontWeight: '600',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}>
                  Sign Up
                </button>
              </SignUpButton>
            </div>
          </div>
        </div>
      </SignedOut>

      {/* Main App - Shown when signed in */}
      <SignedIn>
        {showWorkflowBuilder ? (
          <WorkflowBuilder
            onClose={() => setShowWorkflowBuilder(false)}
            agentId={selectedAgent?.id}
          />
        ) : showTemplates ? (
          <AgentTemplates
            onUseTemplate={createAgentFromTemplate}
            onClose={() => setShowTemplates(false)}
          />
        ) : showAnalytics ? (
          <AnalyticsDashboard
            onClose={() => setShowAnalytics(false)}
          />
        ) : (
          <div className="App">
            {/* Sidebar */}
            <div className="sidebar">
              <div className="sidebar-header">
                <h2>🤖 ArkAgents</h2>
                <UserButton afterSignOutUrl="/" />
              </div>

              <button
                className="create-btn"
                onClick={() => setShowCreateAgent(true)}
              >
                + New Agent
              </button>

              <button
                className="templates-btn"
                onClick={() => setShowTemplates(true)}
                style={{
                  marginTop: '10px',
                  width: '100%',
                  padding: '12px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                📚 Browse Templates
              </button>

              <button
                onClick={() => setShowWorkflowBuilder(true)}
                style={{
                  marginTop: '10px',
                  width: '100%',
                  padding: '12px',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                🔧 Workflow Builder
              </button>

              <button
                onClick={() => setShowAnalytics(true)}
                style={{
                  marginTop: '10px',
                  width: '100%',
                  padding: '12px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                📊 Analytics
              </button>

              <div className="agents-list">
                {agents.map(agent => (
                  <div
                    key={agent.id}
                    className={`agent-item ${selectedAgent?.id === agent.id ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedAgent(agent);
                    }}
                  >
                    <div className="agent-name">{agent.name}</div>
                    <div className="agent-desc">{agent.description}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Main Chat Area */}
            <div className="main-content">
              {selectedAgent ? (
                <>
                  <div className="chat-header">
                    <div>
                      <h3>{selectedAgent.name}</h3>
                      <p>{selectedAgent.description}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => setShowWorkflowBuilder(true)}
                        style={{
                          padding: '8px 16px',
                          background: '#f59e0b',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                      >
                        🔧 Workflows
                      </button>
                      {messages.length > 0 && (
                        <button
                          onClick={clearConversation}
                          style={{
                            padding: '8px 16px',
                            background: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '14px'
                          }}
                        >
                          🗑️ Clear Chat
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="messages">
                    {messages.map((msg, idx) => (
                      <div key={idx} className={`message ${msg.role}`}>
                        <div className="message-content">
                          {msg.message}
                        </div>
                      </div>
                    ))}
                    {loading && (
                      <div className="message assistant">
                        <div className="message-content typing">
                          Agent is thinking...
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="input-area">
                    <input
                      id="chat-input"
                      name="message"
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Type your message..."
                      disabled={loading}
                    />
                    <button onClick={sendMessage} disabled={loading}>
                      Send
                    </button>
                  </div>
                </>
              ) : (
                <div className="empty-state">
                  <h2>Welcome back, {user?.firstName || 'there'}! 👋</h2>
                  <p>Select an agent or create a new one to get started</p>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '20px', justifyContent: 'center' }}>
                    <button
                      onClick={() => setShowTemplates(true)}
                      style={{
                        padding: '12px 24px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: '600'
                      }}
                    >
                      Browse Agent Templates
                    </button>
                    <button
                      onClick={() => setShowWorkflowBuilder(true)}
                      style={{
                        padding: '12px 24px',
                        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: '600'
                      }}
                    >
                      Build Workflows
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Create Agent Modal */}
            {showCreateAgent && (
              <div className="modal-overlay" onClick={() => setShowCreateAgent(false)}>
                <div className="modal" onClick={e => e.stopPropagation()}>
                  <h3>Create New Agent</h3>
                  <input
                    id="agent-name"
                    name="agent-name"
                    type="text"
                    placeholder="Agent Name (e.g., Sales Assistant)"
                    value={newAgentName}
                    onChange={(e) => setNewAgentName(e.target.value)}
                  />
                  <textarea
                    id="agent-description"
                    name="agent-description"
                    placeholder="Description (e.g., helps with sales outreach)"
                    value={newAgentDesc}
                    onChange={(e) => setNewAgentDesc(e.target.value)}
                    rows={3}
                  />
                  <textarea
                    id="agent-prompt"
                    name="agent-prompt"
                    placeholder="System Prompt (optional - defines agent behavior)"
                    value={newAgentPrompt}
                    onChange={(e) => setNewAgentPrompt(e.target.value)}
                    rows={4}
                  />
                  <div className="modal-buttons">
                    <button onClick={() => setShowCreateAgent(false)}>Cancel</button>
                    <button onClick={createAgent} className="primary">Create</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </SignedIn>
    </>
  );
}

export default App;
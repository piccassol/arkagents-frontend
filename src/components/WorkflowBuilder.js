import React, { useState, useRef } from 'react';
import { Play, Save, Trash2, Zap, MessageSquare, Database, Code, GitBranch, Clock, Mail } from 'lucide-react';

const WorkflowBuilder = ({ onClose, agentId }) => {
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [draggingNode, setDraggingNode] = useState(null);
  const [connecting, setConnecting] = useState(null);
  const [offset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [showNodeMenu, setShowNodeMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);

  const nodeTypes = [
    { type: 'trigger', icon: Zap, label: 'Trigger', color: '#10b981', description: 'Start the workflow' },
    { type: 'agent', icon: MessageSquare, label: 'AI Agent', color: '#667eea', description: 'Call AI agent' },
    { type: 'http', icon: Database, label: 'HTTP Request', color: '#3b82f6', description: 'Make API call' },
    { type: 'code', icon: Code, label: 'Code', color: '#f59e0b', description: 'Run custom code' },
    { type: 'condition', icon: GitBranch, label: 'Condition', color: '#8b5cf6', description: 'Branch logic' },
    { type: 'delay', icon: Clock, label: 'Delay', color: '#ef4444', description: 'Wait/delay' },
    { type: 'email', icon: Mail, label: 'Email', color: '#06b6d4', description: 'Send email' }
  ];

  const createNode = (type, x, y) => {
    const nodeType = nodeTypes.find(nt => nt.type === type);
    const newNode = {
      id: `node_${Date.now()}`,
      type,
      label: nodeType.label,
      icon: nodeType.icon,
      color: nodeType.color,
      x: (x - offset.x) / zoom,
      y: (y - offset.y) / zoom,
      config: {}
    };
    setNodes([...nodes, newNode]);
    setShowNodeMenu(false);
  };

  const handleCanvasClick = (e) => {
    if (e.target === canvasRef.current) {
      setSelectedNode(null);
    }
  };

  const handleNodeMouseDown = (e, node) => {
    e.stopPropagation();
    setDraggingNode(node);
    setSelectedNode(node);
  };

  const handleMouseMove = (e) => {
    if (draggingNode) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - offset.x) / zoom;
      const y = (e.clientY - rect.top - offset.y) / zoom;
      setNodes(nodes.map(n => 
        n.id === draggingNode.id ? { ...n, x, y } : n
      ));
    }
  };

  const handleMouseUp = () => {
    setDraggingNode(null);
  };

  const startConnection = (nodeId, e) => {
    e.stopPropagation();
    setConnecting({ from: nodeId });
  };

  const completeConnection = (nodeId, e) => {
    e.stopPropagation();
    if (connecting && connecting.from !== nodeId) {
      const newConnection = {
        id: `conn_${Date.now()}`,
        from: connecting.from,
        to: nodeId
      };
      setConnections([...connections, newConnection]);
    }
    setConnecting(null);
  };

  const deleteNode = (nodeId) => {
    setNodes(nodes.filter(n => n.id !== nodeId));
    setConnections(connections.filter(c => c.from !== nodeId && c.to !== nodeId));
    setSelectedNode(null);
  };

  const deleteConnection = (connId) => {
    setConnections(connections.filter(c => c.id !== connId));
  };

  const getNodePosition = (nodeId) => {
    const node = nodes.find(n => n.id === nodeId);
    return node ? { x: node.x * zoom + offset.x, y: node.y * zoom + offset.y } : null;
  };

  const saveWorkflow = async () => {
    const workflow = {
      nodes,
      connections,
      name: `Workflow ${new Date().toLocaleDateString()}`,
      agentId
    };
    try {
      await window.storage.set(`workflow:${Date.now()}`, JSON.stringify(workflow));
      alert('Workflow saved successfully!');
    } catch (error) {
      console.error('Error saving workflow:', error);
      alert('Failed to save workflow');
    }
  };

  const executeWorkflow = () => {
    alert('Workflow execution will be implemented with your backend API');
  };

  const openNodeMenu = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    setMenuPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setShowNodeMenu(true);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: '#0f172a',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        background: '#1e293b',
        padding: '16px 24px',
        borderBottom: '1px solid #334155',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <h2 style={{ color: 'white', margin: 0, fontSize: '20px' }}>Workflow Builder</h2>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={saveWorkflow} style={{
              padding: '8px 16px',
              background: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              <Save size={16} /> Save
            </button>
            <button onClick={executeWorkflow} style={{
              padding: '8px 16px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              <Play size={16} /> Execute
            </button>
          </div>
        </div>
        <button onClick={onClose} style={{
          padding: '8px 16px',
          background: '#ef4444',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '500'
        }}>
          Close
        </button>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar */}
        <div style={{
          width: '280px',
          background: '#1e293b',
          borderRight: '1px solid #334155',
          padding: '20px',
          overflowY: 'auto'
        }}>
          <h3 style={{ color: 'white', marginTop: 0, fontSize: '16px', marginBottom: '16px' }}>
            Available Nodes
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {nodeTypes.map(nodeType => {
              const Icon = nodeType.icon;
              return (
                <div
                  key={nodeType.type}
                  onClick={() => createNode(nodeType.type, 400, 300)}
                  style={{
                    padding: '12px',
                    background: '#334155',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    border: '2px solid transparent'
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = nodeType.color}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      background: nodeType.color,
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Icon size={18} color="white" />
                    </div>
                    <span style={{ color: 'white', fontWeight: '600', fontSize: '14px' }}>
                      {nodeType.label}
                    </span>
                  </div>
                  <p style={{ color: '#94a3b8', fontSize: '12px', margin: 0 }}>
                    {nodeType.description}
                  </p>
                </div>
              );
            })}
          </div>

          {selectedNode && (
            <div style={{ marginTop: '30px' }}>
              <h3 style={{ color: 'white', fontSize: '16px', marginBottom: '16px' }}>
                Node Settings
              </h3>
              <div style={{
                padding: '16px',
                background: '#334155',
                borderRadius: '8px'
              }}>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '6px' }}>
                    Node Label
                  </label>
                  <input
                    type="text"
                    value={selectedNode.label}
                    onChange={(e) => {
                      setNodes(nodes.map(n => 
                        n.id === selectedNode.id ? { ...n, label: e.target.value } : n
                      ));
                      setSelectedNode({ ...selectedNode, label: e.target.value });
                    }}
                    style={{
                      width: '100%',
                      padding: '8px',
                      background: '#1e293b',
                      border: '1px solid #475569',
                      borderRadius: '4px',
                      color: 'white',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <button
                  onClick={() => deleteNode(selectedNode.id)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  <Trash2 size={16} /> Delete Node
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Canvas */}
        <div
          ref={canvasRef}
          onClick={handleCanvasClick}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onDoubleClick={openNodeMenu}
          style={{
            flex: 1,
            background: `radial-gradient(circle, #334155 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
            position: 'relative',
            overflow: 'hidden',
            cursor: draggingNode ? 'grabbing' : 'default'
          }}
        >
          {/* Connections */}
          <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
            {connections.map(conn => {
              const fromPos = getNodePosition(conn.from);
              const toPos = getNodePosition(conn.to);
              if (!fromPos || !toPos) return null;

              const midX = (fromPos.x + toPos.x) / 2;
              const path = `M ${fromPos.x + 75} ${fromPos.y + 40} 
                           C ${midX} ${fromPos.y + 40}, 
                             ${midX} ${toPos.y + 40}, 
                             ${toPos.x - 25} ${toPos.y + 40}`;

              return (
                <g key={conn.id}>
                  <path
                    d={path}
                    stroke="#475569"
                    strokeWidth="2"
                    fill="none"
                    style={{ pointerEvents: 'stroke', cursor: 'pointer' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm('Delete this connection?')) {
                        deleteConnection(conn.id);
                      }
                    }}
                  />
                  <circle cx={toPos.x - 25} cy={toPos.y + 40} r="4" fill="#667eea" />
                </g>
              );
            })}
            {connecting && (
              <line
                x1={getNodePosition(connecting.from).x + 75}
                y1={getNodePosition(connecting.from).y + 40}
                x2={menuPosition.x}
                y2={menuPosition.y}
                stroke="#667eea"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
            )}
          </svg>

          {/* Nodes */}
          {nodes.map(node => {
            const Icon = node.icon;
            return (
              <div
                key={node.id}
                onMouseDown={(e) => handleNodeMouseDown(e, node)}
                style={{
                  position: 'absolute',
                  left: node.x * zoom + offset.x,
                  top: node.y * zoom + offset.y,
                  width: '150px',
                  background: '#1e293b',
                  border: `2px solid ${selectedNode?.id === node.id ? node.color : '#334155'}`,
                  borderRadius: '12px',
                  padding: '16px',
                  cursor: 'move',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                  transition: 'border-color 0.2s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    background: node.color,
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Icon size={20} color="white" />
                  </div>
                  <span style={{ color: 'white', fontWeight: '600', fontSize: '13px', wordBreak: 'break-word' }}>
                    {node.label}
                  </span>
                </div>
                <div
                  onClick={(e) => startConnection(node.id, e)}
                  style={{
                    position: 'absolute',
                    right: '-12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '20px',
                    height: '20px',
                    background: node.color,
                    border: '3px solid #1e293b',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    zIndex: 10
                  }}
                />
                <div
                  onClick={(e) => completeConnection(node.id, e)}
                  style={{
                    position: 'absolute',
                    left: '-12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '20px',
                    height: '20px',
                    background: '#334155',
                    border: '3px solid #1e293b',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    zIndex: 10
                  }}
                />
              </div>
            );
          })}

          {/* Node Creation Menu */}
          {showNodeMenu && (
            <div
              style={{
                position: 'absolute',
                left: menuPosition.x - 100,
                top: menuPosition.y - 50,
                background: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '8px',
                padding: '12px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                zIndex: 1000,
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {nodeTypes.map(nodeType => {
                const Icon = nodeType.icon;
                return (
                  <button
                    key={nodeType.type}
                    onClick={() => createNode(nodeType.type, menuPosition.x, menuPosition.y)}
                    style={{
                      padding: '10px',
                      background: '#334155',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '13px',
                      fontWeight: '500'
                    }}
                  >
                    <Icon size={16} />
                    {nodeType.label}
                  </button>
                );
              })}
            </div>
          )}

          {/* Help Text */}
          {nodes.length === 0 && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              color: '#64748b',
              fontSize: '18px'
            }}>
              <p style={{ margin: 0, marginBottom: '8px' }}>Click a node type on the left to add it</p>
              <p style={{ margin: 0, fontSize: '14px' }}>or double-click the canvas</p>
            </div>
          )}
        </div>
      </div>

      {/* Zoom Controls */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        display: 'flex',
        gap: '8px',
        background: '#1e293b',
        padding: '8px',
        borderRadius: '8px',
        border: '1px solid #334155'
      }}>
        <button
          onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
          style={{
            padding: '6px 12px',
            background: '#334155',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >-</button>
        <span style={{ color: 'white', padding: '6px 12px', fontSize: '14px' }}>
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => setZoom(Math.min(2, zoom + 0.1))}
          style={{
            padding: '6px 12px',
            background: '#334155',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >+</button>
      </div>
    </div>
  );
};

export default WorkflowBuilder;
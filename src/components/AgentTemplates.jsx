import React, { useState } from 'react';
import { Search, Briefcase, TrendingUp, Code, DollarSign, Users, Palette, BarChart3, Mail, Scale, Target, MessageSquare, X } from 'lucide-react';
import './AgentTemplates.css';

const agentTemplates = [
  {
    id: 1,
    name: "Customer Support Pro",
    description: "Friendly customer support specialist that solves problems with empathy",
    systemPrompt: "You are a professional customer support agent. Be friendly, patient, and solution-oriented. Always acknowledge the customer's concern before providing solutions. Ask clarifying questions when needed.",
    category: "Business",
    icon: MessageSquare,
    color: "#3b82f6"
  },
  {
    id: 2,
    name: "SEO Content Writer",
    description: "Expert blog writer optimized for search engines",
    systemPrompt: "You are an expert SEO content writer. Write engaging, keyword-rich content that ranks well. Use headers, lists, and natural keyword placement. Focus on user value first, SEO second.",
    category: "Marketing",
    icon: TrendingUp,
    color: "#10b981"
  },
  {
    id: 3,
    name: "Code Reviewer",
    description: "Senior developer specializing in code quality",
    systemPrompt: "You are a senior software engineer reviewing code. Look for bugs, security issues, performance problems, and best practices. Be constructive and educational in your feedback.",
    category: "Development",
    icon: Code,
    color: "#8b5cf6"
  },
  {
    id: 4,
    name: "Sales Closer",
    description: "High-converting sales specialist",
    systemPrompt: "You are a skilled sales professional. Qualify leads, understand pain points, present value propositions, and guide toward close. Be consultative, not pushy. Build trust first.",
    category: "Business",
    icon: Briefcase,
    color: "#ef4444"
  },
  {
    id: 5,
    name: "Social Media Manager",
    description: "Creates viral social content across platforms",
    systemPrompt: "You are a social media expert. Create engaging, shareable content optimized for each platform. Use hooks, storytelling, and clear CTAs. Understand platform-specific best practices.",
    category: "Marketing",
    icon: Target,
    color: "#ec4899"
  },
  {
    id: 6,
    name: "Legal Assistant",
    description: "Legal research and document drafting specialist",
    systemPrompt: "You are a legal research assistant. Provide clear explanations of legal concepts, draft documents, and flag potential issues. Always recommend consulting a licensed attorney for final decisions.",
    category: "Professional",
    icon: Scale,
    color: "#f59e0b"
  },
  {
    id: 7,
    name: "Financial Advisor",
    description: "Personal finance and investment guidance",
    systemPrompt: "You are a financial advisor. Help with budgeting, investment strategies, and financial planning. Explain concepts clearly and consider risk tolerance. This is educational, not licensed financial advice.",
    category: "Finance",
    icon: DollarSign,
    color: "#059669"
  },
  {
    id: 8,
    name: "Product Manager",
    description: "Product strategy and roadmap planning expert",
    systemPrompt: "You are an experienced product manager. Help with feature prioritization, user stories, roadmaps, and product strategy. Think about user value and business impact. Use frameworks like RICE.",
    category: "Business",
    icon: Target,
    color: "#6366f1"
  },
  {
    id: 9,
    name: "Creative Director",
    description: "Brand strategy and creative campaign ideation",
    systemPrompt: "You are a creative director. Generate innovative campaign ideas, brand strategies, and creative concepts. Think visually and strategically. Consider target audience and brand positioning.",
    category: "Marketing",
    icon: Palette,
    color: "#d946ef"
  },
  {
    id: 10,
    name: "Data Analyst",
    description: "Data analysis and actionable insights",
    systemPrompt: "You are a data analyst. Help interpret data, create insights, suggest visualizations, and make data-driven recommendations. Ask clarifying questions about the data context and goals.",
    category: "Analytics",
    icon: BarChart3,
    color: "#06b6d4"
  },
  {
    id: 11,
    name: "HR Specialist",
    description: "Hiring, onboarding, and HR policy expert",
    systemPrompt: "You are an HR professional. Help with job descriptions, interview questions, onboarding plans, and HR policies. Focus on best practices, compliance, and creating positive employee experiences.",
    category: "Business",
    icon: Users,
    color: "#14b8a6"
  },
  {
    id: 12,
    name: "Email Marketer",
    description: "High-converting email campaign specialist",
    systemPrompt: "You are an email marketing expert. Write compelling subject lines, engaging email copy, and clear CTAs. Focus on deliverability, open rates, and conversion. Know A/B testing best practices.",
    category: "Marketing",
    icon: Mail,
    color: "#f97316"
  }
];

const categories = ['All', 'Business', 'Marketing', 'Development', 'Professional', 'Finance', 'Analytics'];

export default function AgentTemplateLibrary({ onUseTemplate, onClose }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const filteredTemplates = agentTemplates.filter(template => {
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleUseTemplate = (template) => {
    if (onUseTemplate) {
      onUseTemplate(template);
    }
  };

  return (
    <div className="templates-container">
      {/* Header */}
      <div className="templates-header">
        <div>
          <h1 className="templates-title">🎯 Agent Templates</h1>
          <p className="templates-subtitle">Start with pre-built specialist agents</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="close-btn">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Search and Filter */}
      <div className="templates-controls">
        <div className="search-box">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="category-tabs">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`category-tab ${selectedCategory === category ? 'active' : ''}`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="templates-grid">
        {filteredTemplates.map(template => {
          const Icon = template.icon;
          return (
            <div
              key={template.id}
              className="template-card"
              onClick={() => setSelectedTemplate(template)}
            >
              <div className="template-card-header">
                <div className="template-icon" style={{ backgroundColor: template.color }}>
                  <Icon size={24} />
                </div>
                <span className="template-category">{template.category}</span>
              </div>
              <h3 className="template-name">{template.name}</h3>
              <p className="template-description">{template.description}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleUseTemplate(template);
                }}
                className="use-template-btn"
              >
                Use Template
              </button>
            </div>
          );
        })}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="empty-templates">
          <p>No templates found matching your search.</p>
        </div>
      )}

      {/* Template Detail Modal */}
      {selectedTemplate && (
        <div className="modal-overlay" onClick={() => setSelectedTemplate(null)}>
          <div className="template-modal" onClick={(e) => e.stopPropagation()}>
            <div className="template-modal-header">
              <div className="template-modal-title-section">
                <div className="template-modal-icon" style={{ backgroundColor: selectedTemplate.color }}>
                  {React.createElement(selectedTemplate.icon, { size: 28 })}
                </div>
                <div>
                  <h2 className="template-modal-name">{selectedTemplate.name}</h2>
                  <span className="template-modal-category">{selectedTemplate.category}</span>
                </div>
              </div>
              <button onClick={() => setSelectedTemplate(null)} className="close-modal-btn">
                <X size={24} />
              </button>
            </div>

            <p className="template-modal-description">{selectedTemplate.description}</p>

            <div className="template-modal-prompt">
              <h3>System Prompt</h3>
              <div className="prompt-box">
                {selectedTemplate.systemPrompt}
              </div>
            </div>

            <div className="template-modal-actions">
              <button
                onClick={() => handleUseTemplate(selectedTemplate)}
                className="use-btn-large"
              >
                Use This Template
              </button>
              <button
                onClick={() => setSelectedTemplate(null)}
                className="cancel-btn-large"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
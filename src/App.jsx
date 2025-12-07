// src/App.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { 
  BookOpen, 
  Calculator, 
  FlaskConical, 
  Palette, 
  Music, 
  Search, 
  ExternalLink, 
  PlusCircle, 
  X,
  Menu,
  Star,
  Filter,
  Loader
} from 'lucide-react';

// Import Firebase services
import { getAllResources, addResource } from './services/resourceService';

// --- COMPONENTS ---

const Badge = ({ children, color = 'blue' }) => {
  const colors = {
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700',
    purple: 'bg-purple-100 text-purple-700',
    orange: 'bg-orange-100 text-orange-700',
  };
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[color] || colors.blue}`}>
      {children}
    </span>
  );
};

const ResourceCard = ({ resource }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col h-full">
      <div className="h-32 bg-gradient-to-r from-indigo-50 to-blue-50 flex items-center justify-center">
        <SubjectIcon subject={resource.subject} size={48} className="text-indigo-200" />
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <Badge color={getSubjectColor(resource.subject)}>{resource.subject}</Badge>
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider flex items-center gap-1">
             {resource.type}
          </span>
        </div>
        
        <h3 className="text-lg font-bold text-slate-800 mb-2 leading-tight">{resource.title}</h3>
        <p className="text-slate-600 text-sm mb-4 flex-grow line-clamp-3">{resource.description}</p>
        
        <div className="flex items-center gap-2 mb-4">
          {resource.tags && resource.tags.map(tag => (
            <span key={tag} className="text-xs text-slate-400">#{tag}</span>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
          <div className="flex items-center gap-1 text-amber-500 text-sm font-medium">
            <Star size={16} fill="currentColor" />
            {resource.likes || 0}
          </div>
          <a 
            href={resource.url} 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 text-sm font-bold transition-colors"
          >
            Open Resource <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  );
};

const SubjectIcon = ({ subject, size = 24, className = "" }) => {
  switch (subject) {
    case 'SEL': return <Star size={size} className={className} />;
    case 'Positive Discipline': return <BookOpen size={size} className={className} />;
    case 'Play-based Learning': return <Palette size={size} className={className} />;
    case 'Differentiated Instruction': return <Calculator size={size} className={className} />;
    default: return <BookOpen size={size} className={className} />;
  }
};

const getSubjectColor = (subject) => {
  switch (subject) {
    case 'SEL': return 'blue';
    case 'Positive Discipline': return 'green';
    case 'Play-based Learning': return 'purple';
    case 'Differentiated Instruction': return 'orange';
    default: return 'blue';
  }
};

const AddResourceModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    title: '',
    subject: 'SEL',
    type: 'Worksheet',
    url: '',
    description: '',
    tags: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const newResource = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
        likes: 0
      };
      
      await onAdd(newResource);
      onClose();
      setFormData({ title: '', subject: 'SEL', type: 'Worksheet', url: '', description: '', tags: '' });
    } catch (error) {
      console.error('Error adding resource:', error);
      alert('Failed to add resource. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800">Add New Resource</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600" disabled={isSubmitting}>
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
            <input 
              required
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-50"
              placeholder="e.g. Fun Math Sheets"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
              <select 
                disabled={isSubmitting}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-50"
                value={formData.subject}
                onChange={e => setFormData({...formData, subject: e.target.value})}
              >
                <option>SEL</option>
                <option>Positive Discipline</option>
                <option>Play-based Learning</option>
                <option>Differentiated Instruction</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
              <select 
                disabled={isSubmitting}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-50"
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value})}
              >
                <option>Worksheet</option>
                <option>Video</option>
                <option>Game</option>
                <option>Activity</option>
                <option>Article</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">URL</label>
            <input 
              type="url"
              required
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-50"
              placeholder="https://..."
              value={formData.url}
              onChange={e => setFormData({...formData, url: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea 
              required
              rows="3"
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-50"
              placeholder="Briefly describe the resource..."
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tags (comma separated)</label>
            <input 
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-50"
              placeholder="kindergarten, fun, easy"
              value={formData.tags}
              onChange={e => setFormData({...formData, tags: e.target.value})}
            />
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors mt-2 disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader className="animate-spin" size={16} />
                Adding...
              </>
            ) : (
              'Add Resource'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

// --- MAIN APP ---

export default function App() {
  // State
  const [resources, setResources] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load resources from Firebase on mount
  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllResources();
      setResources(data);
    } catch (err) {
      console.error('Failed to load resources:', err);
      setError('Failed to load resources. Please check your Firebase configuration.');
    } finally {
      setLoading(false);
    }
  };

  // Filtered resources
  const filteredResources = useMemo(() => {
    return resources.filter(r => {
      const matchesSubject = selectedSubject === 'All' || r.subject === selectedSubject;
      const matchesSearch = 
        (r.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || 
        (r.description?.toLowerCase() || '').includes(searchQuery.toLowerCase());
      return matchesSubject && matchesSearch;
    });
  }, [resources, selectedSubject, searchQuery]);

  const handleAddResource = async (newResourceData) => {
    try {
      // Add to Firebase
      const docId = await addResource(newResourceData);
      
      // Update local state
      setResources(prev => [{
        id: docId,
        ...newResourceData
      }, ...prev]);
      
      // Show success message
      alert('✅ Resource added successfully!');
    } catch (error) {
      console.error('Error adding resource:', error);
      throw error; // Re-throw so the modal can handle it
    }
  };

  const subjects = ['All', 'SEL', 'Positive Discipline', 'Play-based Learning', 'Differentiated Instruction'];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                <BookOpen size={20} />
              </div>
              <span className="font-bold text-xl tracking-tight text-indigo-900">BEST</span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-slate-600 hover:text-indigo-600 font-medium text-sm">Collections</a>
              <a href="#" className="text-slate-600 hover:text-indigo-600 font-medium text-sm">About</a>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-all"
              >
                <PlusCircle size={16} />
                Add Resource
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-500">
                {mobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 p-4 space-y-2">
            <a href="#" className="block px-3 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-md">Collections</a>
            <a href="#" className="block px-3 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-md">About</a>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
            >
              <PlusCircle size={16} />
              Add Resource
            </button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="bg-indigo-900 text-white py-12 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500 rounded-full mix-blend-overlay filter blur-3xl transform translate-x-1/3 translate-y-1/3"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-3xl sm:text-5xl font-extrabold mb-6 tracking-tight">
            Bringing Educators Support & Training
            <br />
            {/* <span className="text-indigo-300">Less Effort, More Support</span> */}
          </h1>
          <p className="text-indigo-100 text-lg sm:text-xl max-w-2xl mx-auto mb-10 font-light">
            A self-paced training platform for teachers with less effort and more support
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-indigo-300" />
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-indigo-300 focus:ring-2 focus:ring-white/50 focus:outline-none focus:bg-white/20 transition-all"
              placeholder="Search for 'SEL', 'Play-based', or 'Positve Discipline'..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Subject Filters */}
        <div className="flex flex-wrap gap-2 mb-10 justify-center sm:justify-start">
          <div className="flex items-center gap-2 mr-4 text-slate-400 text-sm font-medium uppercase tracking-wider">
            <Filter size={16} /> Filter by:
          </div>
          {subjects.map(subject => (
            <button
              key={subject}
              onClick={() => setSelectedSubject(subject)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedSubject === subject 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 transform -translate-y-0.5' 
                : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
              }`}
            >
              {subject}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <Loader className="animate-spin mx-auto mb-4 text-indigo-600" size={48} />
            <p className="text-slate-600">Loading resources...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-800 font-medium mb-2">Error Loading Resources</p>
            <p className="text-red-600 text-sm mb-4">{error}</p>
            <button 
              onClick={loadResources}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Resources Grid */}
        {!loading && !error && (
          filteredResources.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map(resource => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
              <div className="inline-block p-4 bg-slate-50 rounded-full mb-4 text-slate-400">
                <Search size={32} />
              </div>
              <h3 className="text-lg font-medium text-slate-900">No resources found</h3>
              <p className="text-slate-500">Try adjusting your search or filter to find what you're looking for.</p>
            </div>
          )
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-10 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>&copy; 2025 KinderGems Resource Aggregator. Built for teachers.</p>
        </div>
      </footer>

      <AddResourceModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddResource} 
      />
    </div>
  );
}
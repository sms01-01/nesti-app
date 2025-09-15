import React, { useState, useEffect } from 'react';
import { MessageSquare, Calendar, Settings, Home, ChevronRight, Send, Play, Plus, X, Check, Clock, User, Mail, Lock, Eye, EyeOff, LogOut, Bell, Search, Filter, Heart, Star, MapPin, Users } from 'lucide-react';

const NestiApp = () => {
  // États principaux
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // États pour l'authentification
  const [showAuthModal, setShowAuthModal] = useState(true);
  const [authMode, setAuthMode] = useState('login'); // 'login' ou 'register'
  const [authData, setAuthData] = useState({
    email: '',
    password: '',
    name: '',
    familyName: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  // États pour les données
  const [events, setEvents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activities, setActivities] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // États pour les modales et interactions
  const [showEventModal, setShowEventModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [meditationActive, setMeditationActive] = useState(false);
  const [meditationTimer, setMeditationTimer] = useState(0);

  // Mise à jour du temps
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      if (meditationActive) {
        setMeditationTimer(prev => prev + 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [meditationActive]);

  // Initialisation des données après connexion
  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserData();
    }
  }, [isAuthenticated, user]);

  const loadUserData = () => {
    // Simulation de chargement des données
    setEvents([
      {
        id: '1',
        title: 'Heure du goûter',
        time: '15:00',
        date: new Date(),
        color: 'bg-amber-100',
        icon: '🍪',
        textColor: 'text-amber-800',
        description: 'Pause gourmande en famille'
      },
      {
        id: '2',
        title: 'Cours de piano',
        time: '17:00',
        date: new Date(),
        color: 'bg-blue-100',
        icon: '🎹',
        textColor: 'text-blue-800',
        description: 'Leçon de piano d\'Emma'
      },
      {
        id: '3',
        title: 'Jeux de famille',
        time: '20:00',
        date: new Date(),
        color: 'bg-emerald-100',
        icon: '🎲',
        textColor: 'text-emerald-800',
        description: 'Soirée jeux de société'
      }
    ]);

    setTasks([
      {
        id: '1',
        title: 'Préparer le dîner',
        completed: false,
        assignee: 'Maman',
        dueDate: new Date(),
        priority: 'high'
      },
      {
        id: '2',
        title: 'Faire les devoirs',
        completed: true,
        assignee: 'Emma',
        dueDate: new Date(),
        priority: 'medium'
      },
      {
        id: '3',
        title: 'Acheter cadeau anniversaire',
        completed: false,
        assignee: 'Papa',
        dueDate: new Date(Date.now() + 86400000),
        priority: 'low'
      }
    ]);

    setMessages([
      {
        id: '1',
        sender: 'Emma',
        content: 'Salut à tous! Quelle activité ce soir?',
        timestamp: new Date(Date.now() - 300000),
        type: 'user'
      },
      {
        id: '2',
        sender: 'Nesti',
        content: 'Bonjour! Je peux vous suggérer la dernière expo sur l\'art thérapie à 16h',
        timestamp: new Date(Date.now() - 60000),
        type: 'bot',
        suggestions: ['En savoir plus', 'Réserver', 'Autres suggestions']
      }
    ]);

    setActivities([
      {
        id: '1',
        title: 'Expo sur l\'art-thérapie',
        location: 'Musée de l\'art moderne',
        date: new Date(Date.now() + 86400000),
        price: 'Gratuit',
        accessibility: ['Accessible PMR', 'Audio-guide'],
        rating: 4.8,
        category: 'Culture',
        ageRange: '6+'
      },
      {
        id: '2',
        title: 'Atelier cuisine du monde',
        location: 'Centre culturel',
        date: new Date(Date.now() + 172800000),
        price: '15€',
        accessibility: ['Accessible PMR', 'Traduction LSF'],
        rating: 4.9,
        category: 'Cuisine',
        ageRange: 'Tous âges'
      },
      {
        id: '3',
        title: 'Parcours nature adapté',
        location: 'Parc municipal',
        date: new Date(Date.now() + 259200000),
        price: '5€',
        accessibility: ['Accessible PMR', 'Chiens guide acceptés'],
        rating: 4.7,
        category: 'Nature',
        ageRange: 'Tous âges'
      }
    ]);

    setNotifications([
      {
        id: '1',
        title: 'Rappel: Heure du goûter dans 30 min',
        type: 'reminder',
        timestamp: new Date(),
        read: false
      },
      {
        id: '2',
        title: 'Nouvelle activité inclusive ajoutée',
        type: 'activity',
        timestamp: new Date(Date.now() - 3600000),
        read: false
      }
    ]);
  };

  // Fonctions d'authentification
  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    
    // Simulation d'appel API
    setTimeout(() => {
      if (authMode === 'login') {
        // Vérification simple pour la démo
        if (authData.email && authData.password) {
          setUser({
            id: '1',
            name: authData.email.split('@')[0],
            email: authData.email,
            familyName: 'Famille Martin',
            avatar: authData.name?.charAt(0).toUpperCase() || 'U'
          });
          setIsAuthenticated(true);
          setShowAuthModal(false);
        } else {
          alert('Veuillez remplir tous les champs');
        }
      } else {
        // Inscription
        if (authData.email && authData.password && authData.name && authData.familyName) {
          setUser({
            id: '1',
            name: authData.name,
            email: authData.email,
            familyName: authData.familyName,
            avatar: authData.name.charAt(0).toUpperCase()
          });
          setIsAuthenticated(true);
          setShowAuthModal(false);
        } else {
          alert('Veuillez remplir tous les champs');
        }
      }
      setAuthLoading(false);
    }, 1500);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setShowAuthModal(true);
    setAuthData({ email: '', password: '', name: '', familyName: '' });
    setCurrentView('dashboard');
  };

  // Fonctions pour les événements
  const addEvent = (eventData) => {
    const newEvent = {
      id: Date.now().toString(),
      ...eventData,
      date: selectedDate,
      color: 'bg-purple-100',
      textColor: 'text-purple-800',
      icon: '📅'
    };
    setEvents(prev => [...prev, newEvent]);
    setShowEventModal(false);
  };

  // Fonctions pour les tâches
  const addTask = (taskData) => {
    const newTask = {
      id: Date.now().toString(),
      ...taskData,
      completed: false,
      dueDate: selectedDate
    };
    setTasks(prev => [...prev, newTask]);
    setShowTaskModal(false);
  };

  const toggleTask = (taskId) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  // Fonctions pour le chat
  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      sender: user.name,
      content: newMessage,
      timestamp: new Date(),
      type: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Simulation de réponse de Nesti
    setTimeout(() => {
      const responses = [
        "C'est une excellente idée ! Voulez-vous que je vous aide à organiser cela ?",
        "J'ai trouvé quelques activités qui pourraient vous intéresser. Souhaitez-vous les voir ?",
        "Parfait ! Je vais ajouter cela à votre planning familial.",
        "Excellente question ! Laissez-moi vous proposer quelques suggestions personnalisées."
      ];
      
      const botMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'Nesti',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
        type: 'bot'
      };
      
      setMessages(prev => [...prev, botMessage]);
    }, 1500);

    setNewMessage('');
  };

  // Fonction méditation
  const toggleMeditation = () => {
    if (meditationActive) {
      setMeditationActive(false);
      setMeditationTimer(0);
    } else {
      setMeditationActive(true);
      setMeditationTimer(0);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calendrier
  const calendarDays = [];
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());

  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    calendarDays.push({
      date: date,
      day: date.getDate(),
      isCurrentMonth: date.getMonth() === currentMonth,
      isToday: date.toDateString() === today.toDateString(),
      hasEvents: events.some(event => event.date.toDateString() === date.toDateString())
    });
  }

  // Modal d'authentification
  const AuthModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 w-full max-w-md shadow-2xl border border-white/20">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4">
            <div className="w-10 h-8 bg-white/90 rounded-lg flex items-center justify-center">
              <div className="w-6 h-4 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-sm"></div>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Nesti</h1>
          <p className="text-gray-600">
            {authMode === 'login' ? 'Connectez-vous à votre espace familial' : 'Créez votre espace familial'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          {authMode === 'register' && (
            <>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Votre prénom"
                  value={authData.name}
                  onChange={(e) => setAuthData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-white/60 border border-white/30 rounded-xl px-12 py-3 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:bg-white/80 transition-all"
                  required={authMode === 'register'}
                />
              </div>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Nom de famille"
                  value={authData.familyName}
                  onChange={(e) => setAuthData(prev => ({ ...prev, familyName: e.target.value }))}
                  className="w-full bg-white/60 border border-white/30 rounded-xl px-12 py-3 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:bg-white/80 transition-all"
                  required={authMode === 'register'}
                />
              </div>
            </>
          )}
          
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              value={authData.email}
              onChange={(e) => setAuthData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full bg-white/60 border border-white/30 rounded-xl px-12 py-3 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:bg-white/80 transition-all"
              required
            />
          </div>
          
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Mot de passe"
              value={authData.password}
              onChange={(e) => setAuthData(prev => ({ ...prev, password: e.target.value }))}
              className="w-full bg-white/60 border border-white/30 rounded-xl px-12 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:bg-white/80 transition-all"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={authLoading}
            className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none"
          >
            {authLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Connexion...</span>
              </div>
            ) : (
              authMode === 'login' ? 'Se connecter' : 'Créer mon espace'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
            className="text-teal-600 hover:text-teal-700 font-medium"
          >
            {authMode === 'login' 
              ? "Pas encore d'espace familial ? Créer un compte" 
              : "Déjà un compte ? Se connecter"
            }
          </button>
        </div>
      </div>
    </div>
  );

  // Modal d'événement
  const EventModal = () => {
    const [eventForm, setEventForm] = useState({
      title: '',
      description: '',
      time: '',
      location: ''
    });

    return showEventModal ? (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 w-full max-w-lg shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">Nouvel événement</h3>
            <button onClick={() => setShowEventModal(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <form onSubmit={(e) => {
            e.preventDefault();
            addEvent(eventForm);
            setEventForm({ title: '', description: '', time: '', location: '' });
          }} className="space-y-4">
            <input
              type="text"
              placeholder="Titre de l'événement"
              value={eventForm.title}
              onChange={(e) => setEventForm(prev => ({ ...prev, title: e.target.value }))}
              className="w-full bg-white/60 border border-white/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-400"
              required
            />
            <textarea
              placeholder="Description"
              value={eventForm.description}
              onChange={(e) => setEventForm(prev => ({ ...prev, description: e.target.value }))}
              className="w-full bg-white/60 border border-white/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-400 h-20 resize-none"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="time"
                value={eventForm.time}
                onChange={(e) => setEventForm(prev => ({ ...prev, time: e.target.value }))}
                className="bg-white/60 border border-white/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-400"
                required
              />
              <input
                type="text"
                placeholder="Lieu"
                value={eventForm.location}
                onChange={(e) => setEventForm(prev => ({ ...prev, location: e.target.value }))}
                className="bg-white/60 border border-white/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowEventModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 font-medium py-3 rounded-xl hover:bg-gray-300 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-medium py-3 rounded-xl hover:from-teal-600 hover:to-cyan-700 transition-all"
              >
                Ajouter
              </button>
            </div>
          </form>
        </div>
      </div>
    ) : null;
  };

  // Modal de tâche
  const TaskModal = () => {
    const [taskForm, setTaskForm] = useState({
      title: '',
      assignee: '',
      priority: 'medium'
    });

    return showTaskModal ? (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 w-full max-w-lg shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">Nouvelle tâche</h3>
            <button onClick={() => setShowTaskModal(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <form onSubmit={(e) => {
            e.preventDefault();
            addTask(taskForm);
            setTaskForm({ title: '', assignee: '', priority: 'medium' });
          }} className="space-y-4">
            <input
              type="text"
              placeholder="Titre de la tâche"
              value={taskForm.title}
              onChange={(e) => setTaskForm(prev => ({ ...prev, title: e.target.value }))}
              className="w-full bg-white/60 border border-white/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-400"
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <select
                value={taskForm.assignee}
                onChange={(e) => setTaskForm(prev => ({ ...prev, assignee: e.target.value }))}
                className="bg-white/60 border border-white/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-400"
                required
              >
                <option value="">Assigner à...</option>
                <option value="Maman">Maman</option>
                <option value="Papa">Papa</option>
                <option value="Emma">Emma</option>
              </select>
              <select
                value={taskForm.priority}
                onChange={(e) => setTaskForm(prev => ({ ...prev, priority: e.target.value }))}
                className="bg-white/60 border border-white/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-400"
              >
                <option value="low">Faible</option>
                <option value="medium">Moyenne</option>
                <option value="high">Haute</option>
              </select>
            </div>
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowTaskModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 font-medium py-3 rounded-xl hover:bg-gray-300 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-medium py-3 rounded-xl hover:from-teal-600 hover:to-cyan-700 transition-all"
              >
                Ajouter
              </button>
            </div>
          </form>
        </div>
      </div>
    ) : null;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <AuthModal />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          <div className="flex min-h-screen">
            
            {/* Sidebar */}
            <div className="w-80 bg-white/50 backdrop-blur-lg border-r border-white/20 p-8">
              <div className="flex items-center space-x-3 mb-12">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <div className="w-8 h-6 bg-white/90 rounded-lg flex items-center justify-center">
                    <div className="w-4 h-3 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-sm"></div>
                  </div>
                </div>
                <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Nesti</h1>
              </div>

              <nav className="space-y-2 mb-8">
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: Home },
                  { id: 'chat', label: 'Chat', icon: MessageSquare },
                  { id: 'calendar', label: 'Calendrier', icon: Calendar },
                  { id: 'activities', label: 'Activités', icon: Star },
                  { id: 'settings', label: 'Settings', icon: Settings },
                ].map(item => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentView(item.id)}
                      className={`w-full flex items-center space-x-4 px-4 py-4 rounded-2xl font-medium transition-all duration-200 ${
                        currentView === item.id
                          ? 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 shadow-sm'
                          : 'text-gray-600 hover:bg-white/60 hover:text-gray-800'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Profil utilisateur */}
              <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-4 mt-auto">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center text-white font-bold">
                    {user.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 text-sm">{user.name}</p>
                    <p className="text-gray-600 text-xs">{user.familyName}</p>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="w-full flex items-center justify-center space-x-2 text-gray-600 hover:text-red-600 transition-colors text-sm py-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Déconnexion</span>
                </button>
              </div>
            </div>

            {/* Contenu principal */}
            <div className="flex-1 p-8">
              {/* Header avec notifications */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-4xl font-bold text-gray-800 mb-2">
                    Bonjour, {user.name}
                  </h2>
                  <p className="text-gray-600 text-lg">Organisation et bien-être pour toute la famille</p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <button className="relative p-3 bg-white/60 backdrop-blur-lg rounded-2xl shadow-sm hover:shadow-md transition-all">
                    <Bell className="w-5 h-5 text-gray-600" />
                    {notifications.filter(n => !n.read).length > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {notifications.filter(n => !n.read).length}
                      </div>
                    )}
                  </button>
                  
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-teal-600 font-bold text-lg">
                      {user.avatar}
                    </div>
                  </div>
                </div>
              </div>

              {/* Contenu selon la vue */}
              {currentView === 'dashboard' && (
                <div className="grid grid-cols-3 gap-8">
                  
                  {/* Colonne 1: Emploi du temps */}
                  <div className="space-y-6">
                    <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-white/20">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-800">Emploi du temps</h3>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setShowEventModal(true)}
                            className="p-2 bg-teal-100 text-teal-600 rounded-xl hover:bg-teal-200 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                      
                      {/* Mini calendrier */}
                      <div className="mb-6">
                        <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium text-gray-500 mb-2">
                          <div>L</div><div>M</div><div>M</div><div>J</div><div>V</div><div>S</div><div>D</div>
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                          {calendarDays.slice(0, 28).map((day, index) => (
                            <button
                              key={index}
                              onClick={() => setSelectedDate(day.date)}
                              className={`h-8 flex items-center justify-center text-sm rounded-lg cursor-pointer transition-all duration-200 relative ${
                                !day.isCurrentMonth 
                                  ? 'text-gray-300' 
                                  : day.isToday 
                                    ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold shadow-lg transform scale-110' 
                                    : 'text-gray-600 hover:bg-white/50'
                              }`}
                            >
                              {day.day}
                              {day.hasEvents && (
                                <div className="absolute bottom-0 right-0 w-2 h-2 bg-teal-400 rounded-full"></div>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Événements du jour */}
                      <div className="space-y-3">
                        {events.filter(event => 
                          event.date.toDateString() === selectedDate.toDateString()
                        ).map((event) => (
                          <div key={event.id} className="flex items-center space-x-3 p-3 rounded-2xl bg-white/40 hover:bg-white/60 transition-all duration-200 cursor-pointer group">
                            <div className={`w-10 h-10 ${event.color} rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow`}>
                              <span className="text-lg">{event.icon}</span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-gray-600">{event.time}</span>
                                <span className={`text-sm font-semibold ${event.textColor}`}>{event.title}</span>
                              </div>
                              {event.description && (
                                <p className="text-xs text-gray-500 mt-1">{event.description}</p>
                              )}
                            </div>
                          </div>
                        ))}
                        {events.filter(event => 
                          event.date.toDateString() === selectedDate.toDateString()
                        ).length === 0 && (
                          <div className="text-center py-4 text-gray-500">
                            <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">Aucun événement prévu</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Section Tâches */}
                    <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-white/20">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-800">Tâches</h3>
                        <button
                          onClick={() => setShowTaskModal(true)}
                          className="p-2 bg-teal-100 text-teal-600 rounded-xl hover:bg-teal-200 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="space-y-3">
                        {tasks.slice(0, 3).map(task => (
                          <div key={task.id} className="flex items-center space-x-3 p-3 rounded-2xl bg-white/40 hover:bg-white/60 transition-all duration-200">
                            <button
                              onClick={() => toggleTask(task.id)}
                              className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                                task.completed 
                                  ? 'bg-green-500 border-green-500 text-white' 
                                  : 'border-gray-300 hover:border-teal-400'
                              }`}
                            >
                              {task.completed && <Check className="w-4 h-4" />}
                            </button>
                            <div className="flex-1">
                              <p className={`font-medium text-sm ${task.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                                {task.title}
                              </p>
                              <p className="text-xs text-gray-500">
                                {task.assignee} • {task.priority === 'high' ? '🔴' : task.priority === 'medium' ? '🟡' : '🟢'}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Section Activités inclusives */}
                    <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-white/20">
                      <h3 className="text-xl font-bold text-gray-800 mb-4">Activités inclusives</h3>
                      
                      {activities.slice(0, 1).map(activity => (
                        <div key={activity.id} className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl p-4 hover:shadow-lg transition-all duration-200 cursor-pointer">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                              <span className="text-white font-bold text-lg">🎨</span>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-gray-800">{activity.title}</h4>
                              <p className="text-sm text-gray-600 flex items-center">
                                <MapPin className="w-3 h-3 mr-1" />
                                {activity.location}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex space-x-2">
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                {activity.price}
                              </span>
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                {activity.ageRange}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm font-medium text-gray-700">{activity.rating}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Colonne 2: Chat familial */}
                  <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-white/20 flex flex-col h-fit min-h-[600px]">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">Chat familial</h3>
                    
                    <div className="flex-1 space-y-4 mb-6 overflow-y-auto max-h-96">
                      {messages.map(message => (
                        <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                          {message.type === 'bot' && (
                            <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 mr-3">
                              <div className="w-6 h-4 bg-white/90 rounded-md flex items-center justify-center">
                                <div className="w-3 h-2 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-sm"></div>
                              </div>
                            </div>
                          )}
                          <div className={`max-w-sm rounded-2xl p-4 shadow-sm ${
                            message.type === 'user' 
                              ? 'bg-gradient-to-br from-blue-100 to-cyan-100' 
                              : 'bg-gradient-to-br from-gray-100 to-gray-50'
                          }`}>
                            {message.type === 'bot' && (
                              <div className="flex items-center space-x-2 mb-2">
                                <span className="text-sm font-bold text-gray-700">{message.sender}</span>
                                <div className="flex space-x-1">
                                  <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
                                  <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                                </div>
                              </div>
                            )}
                            <p className="text-gray-800 text-sm font-medium">{message.content}</p>
                            <p className="text-xs text-gray-500 mt-2">
                              {message.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                            {message.suggestions && (
                              <div className="flex flex-wrap gap-2 mt-3">
                                {message.suggestions.map((suggestion, idx) => (
                                  <button
                                    key={idx}
                                    className="text-xs bg-teal-100 text-teal-700 px-3 py-1 rounded-full hover:bg-teal-200 transition-colors"
                                  >
                                    {suggestion}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                          {message.type === 'user' && (
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 ml-3 text-white font-bold text-sm">
                              {user.avatar}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Zone de saisie */}
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Écrire un message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        className="w-full bg-white/50 border border-white/30 rounded-2xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:bg-white/70 transition-all duration-200"
                      />
                      <button 
                        onClick={sendMessage}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Colonne 3: Bien-être */}
                  <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-white/20 relative overflow-hidden">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">Votre bien-être</h3>
                    
                    <div className="space-y-6">
                      <div className="text-center">
                        <p className="text-gray-700 mb-4 font-medium">
                          {meditationActive ? 'Méditation en cours...' : "N'oubliez pas votre pause méditation"}
                        </p>
                        
                        {meditationActive && (
                          <div className="text-3xl font-bold text-teal-600 mb-4">
                            {formatTime(meditationTimer)}
                          </div>
                        )}
                        
                        <button 
                          onClick={toggleMeditation}
                          className={`font-bold py-3 px-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-2 mx-auto ${
                            meditationActive 
                              ? 'bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white'
                              : 'bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white'
                          }`}
                        >
                          {meditationActive ? <X className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          <span>{meditationActive ? 'Arrêter' : 'Démarrer'}</span>
                        </button>
                      </div>

                      {/* Avatar bien-être */}
                      <div className="flex justify-center">
                        <div className="relative">
                          <div className={`w-20 h-20 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-3xl flex items-center justify-center shadow-xl transition-all duration-1000 ${
                            meditationActive ? 'animate-pulse' : ''
                          }`}>
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center">
                              <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl"></div>
                            </div>
                          </div>
                          {meditationActive && (
                            <div className="absolute inset-0 w-20 h-20 bg-teal-300/30 rounded-3xl animate-ping"></div>
                          )}
                        </div>
                      </div>

                      {/* Statistiques bien-être */}
                      <div className="grid grid-cols-2 gap-3 mt-6">
                        <div className="bg-white/40 rounded-xl p-3 text-center">
                          <div className="text-2xl font-bold text-teal-600">7</div>
                          <div className="text-xs text-gray-600">jours consécutifs</div>
                        </div>
                        <div className="bg-white/40 rounded-xl p-3 text-center">
                          <div className="text-2xl font-bold text-purple-600">142</div>
                          <div className="text-xs text-gray-600">min cette semaine</div>
                        </div>
                      </div>
                    </div>

                    {/* Décorations */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-xl"></div>
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-br from-cyan-200/20 to-teal-200/20 rounded-full blur-xl"></div>
                  </div>
                </div>
              )}

              {/* Vue Chat complète */}
              {currentView === 'chat' && (
                <div className="h-full">
                  <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-white/20 h-[calc(100vh-200px)] flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-gray-800">Chat familial</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                        <span>Famille connectée</span>
                      </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2">
                      {messages.map(message => (
                        <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                          {message.type === 'bot' && (
                            <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 mr-4">
                              <div className="w-8 h-6 bg-white/90 rounded-lg flex items-center justify-center">
                                <div className="w-4 h-3 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-sm"></div>
                              </div>
                            </div>
                          )}
                          <div className={`max-w-md rounded-2xl p-4 shadow-sm ${
                            message.type === 'user' 
                              ? 'bg-gradient-to-br from-blue-100 to-cyan-100' 
                              : 'bg-gradient-to-br from-gray-100 to-gray-50'
                          }`}>
                            {message.type === 'bot' && (
                              <div className="flex items-center space-x-2 mb-2">
                                <span className="text-sm font-bold text-gray-700">{message.sender}</span>
                                <div className="flex space-x-1">
                                  <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
                                  <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                                </div>
                              </div>
                            )}
                            <p className="text-gray-800 font-medium">{message.content}</p>
                            <p className="text-xs text-gray-500 mt-2">
                              {message.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                            {message.suggestions && (
                              <div className="flex flex-wrap gap-2 mt-3">
                                {message.suggestions.map((suggestion, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => setNewMessage(suggestion)}
                                    className="text-sm bg-teal-100 text-teal-700 px-3 py-2 rounded-full hover:bg-teal-200 transition-colors"
                                  >
                                    {suggestion}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                          {message.type === 'user' && (
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 ml-4 text-white font-bold">
                              {user.avatar}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Zone de saisie étendue */}
                    <div className="bg-white/40 backdrop-blur-lg rounded-2xl p-4 border border-white/30">
                      <div className="flex space-x-3">
                        <div className="flex-1 relative">
                          <input
                            type="text"
                            placeholder="Tapez votre message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                            className="w-full bg-white/50 border border-white/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:bg-white/70 transition-all duration-200"
                          />
                        </div>
                        <button 
                          onClick={sendMessage}
                          className="px-6 py-3 bg-gradient-to-br from-teal-500 to-cyan-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
                        >
                          <Send className="w-5 h-5" />
                          <span>Envoyer</span>
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                        <span>💡 Nesti peut vous aider à reformuler vos messages</span>
                        <span>Appuyez sur Entrée pour envoyer</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Vue Calendrier complète */}
              {currentView === 'calendar' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">Calendrier familial</h3>
                    <button
                      onClick={() => setShowEventModal(true)}
                      className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
                    >
                      <Plus className="w-5 h-5" />
                      <span>Nouvel événement</span>
                    </button>
                  </div>

                  <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-white/20">
                    {/* En-tête du calendrier */}
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-xl font-bold text-gray-800">
                        {selectedDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                      </h4>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() - 1)))}
                          className="p-2 bg-white/60 rounded-xl hover:bg-white/80 transition-colors"
                        >
                          ‹
                        </button>
                        <button
                          onClick={() => setSelectedDate(new Date())}
                          className="px-4 py-2 bg-teal-100 text-teal-600 rounded-xl hover:bg-teal-200 transition-colors text-sm font-medium"
                        >
                          Aujourd'hui
                        </button>
                        <button
                          onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() + 1)))}
                          className="p-2 bg-white/60 rounded-xl hover:bg-white/80 transition-colors"
                        >
                          ›
                        </button>
                      </div>
                    </div>

                    {/* Grille du calendrier */}
                    <div className="grid grid-cols-7 gap-1">
                      {/* En-têtes des jours */}
                      {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
                        <div key={day} className="h-12 flex items-center justify-center text-sm font-medium text-gray-500 bg-gray-50 rounded-lg">
                          {day}
                        </div>
                      ))}
                      
                      {/* Jours du mois */}
                      {calendarDays.map((day, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedDate(day.date)}
                          className={`h-24 p-2 rounded-lg border transition-all duration-200 relative ${
                            !day.isCurrentMonth 
                              ? 'text-gray-300 bg-gray-50' 
                              : day.isToday 
                                ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold shadow-lg' 
                                : 'text-gray-700 bg-white hover:bg-gray-50 border-gray-200'
                          }`}
                        >
                          <span className="text-sm">{day.day}</span>
                          {day.hasEvents && (
                            <div className="absolute bottom-1 right-1 w-2 h-2 bg-teal-400 rounded-full"></div>
                          )}
                        </button>
                      ))}
                    </div>

                    {/* Événements du jour sélectionné */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h5 className="text-lg font-bold text-gray-800 mb-4">
                        Événements du {selectedDate.toLocaleDateString('fr-FR')}
                      </h5>
                      <div className="space-y-3">
                        {events.filter(event => 
                          event.date.toDateString() === selectedDate.toDateString()
                        ).map(event => (
                          <div key={event.id} className="flex items-center space-x-4 p-4 bg-white/60 rounded-2xl hover:bg-white/80 transition-all duration-200">
                            <div className={`w-12 h-12 ${event.color} rounded-xl flex items-center justify-center shadow-sm`}>
                              <span className="text-lg">{event.icon}</span>
                            </div>
                            <div className="flex-1">
                              <h6 className="font-semibold text-gray-800">{event.title}</h6>
                              <p className="text-sm text-gray-600">
                                {event.time} • {event.description}
                              </p>
                            </div>
                          </div>
                        ))}
                        {events.filter(event => 
                          event.date.toDateString() === selectedDate.toDateString()
                        ).length === 0 && (
                          <div className="text-center py-8 text-gray-500">
                            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>Aucun événement prévu pour cette date</p>
                            <button
                              onClick={() => setShowEventModal(true)}
                              className="mt-3 text-teal-600 hover:text-teal-700 font-medium text-sm"
                            >
                              Ajouter un événement
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Vue Activités complète */}
              {currentView === 'activities' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">Activités inclusives</h3>
                    <div className="flex space-x-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Rechercher une activité..."
                          className="pl-10 pr-4 py-2 bg-white/60 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
                        />
                      </div>
                      <button className="p-2 bg-white/60 border border-white/30 rounded-xl hover:bg-white/80 transition-colors">
                        <Filter className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activities.map(activity => (
                      <div key={activity.id} className="bg-white/60 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                            <span className="text-2xl">
                              {activity.category === 'Culture' ? '🎨' : 
                               activity.category === 'Cuisine' ? '👨‍🍳' : 
                               activity.category === 'Nature' ? '🌳' : '🎯'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium text-gray-700">{activity.rating}</span>
                          </div>
                        </div>

                        <h4 className="text-lg font-bold text-gray-800 mb-2">{activity.title}</h4>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="w-4 h-4 mr-2" />
                            {activity.location}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="w-4 h-4 mr-2" />
                            {activity.date.toLocaleDateString('fr-FR')}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                            {activity.price}
                          </span>
                          <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                            {activity.ageRange}
                          </span>
                          <span className="text-xs bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-medium">
                            {activity.category}
                          </span>
                        </div>

                        <div className="space-y-1 mb-4">
                          <p className="text-xs text-gray-500 font-medium">Accessibilité :</p>
                          {activity.accessibility.map((item, idx) => (
                            <span key={idx} className="inline-block text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded-full mr-1">
                              ✓ {item}
                            </span>
                          ))}
                        </div>

                        <div className="flex space-x-2">
                          <button className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-medium py-2 px-4 rounded-xl hover:from-teal-600 hover:to-cyan-700 transition-all text-sm">
                            Réserver
                          </button>
                          <button className="p-2 bg-white/60 border border-white/30 rounded-xl hover:bg-white/80 transition-colors">
                            <Heart className="w-5 h-5 text-gray-600" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Section recommandations personnalisées */}
                  <div className="mt-12">
                    <h4 className="text-xl font-bold text-gray-800 mb-6">Recommandations personnalisées</h4>
                    <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-8 shadow-xl border border-white/20">
                      <div className="flex items-center space-x-4 mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                          <span className="text-2xl">🤖</span>
                        </div>
                        <div>
                          <h5 className="text-xl font-bold text-gray-800">Nesti vous recommande</h5>
                          <p className="text-gray-600">Basé sur vos préférences familiales</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white/60 rounded-2xl p-6">
                          <h6 className="font-bold text-gray-800 mb-2">Atelier parents-enfants</h6>
                          <p className="text-sm text-gray-600 mb-4">
                            Parfait pour renforcer les liens familiaux tout en découvrant de nouvelles cultures
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-teal-600">Ce weekend</span>
                            <button className="text-sm bg-teal-100 text-teal-700 px-4 py-2 rounded-xl hover:bg-teal-200 transition-colors">
                              Voir détails
                            </button>
                          </div>
                        </div>
                        
                        <div className="bg-white/60 rounded-2xl p-6">
                          <h6 className="font-bold text-gray-800 mb-2">Festival de la diversité</h6>
                          <p className="text-sm text-gray-600 mb-4">
                            Événement gratuit célébrant toutes les cultures avec activités adaptées
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-purple-600">Mois prochain</span>
                            <button className="text-sm bg-purple-100 text-purple-700 px-4 py-2 rounded-xl hover:bg-purple-200 transition-colors">
                              M'intéresse
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Vue Settings complète */}
              {currentView === 'settings' && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-8">Paramètres</h3>
                  
                  <div className="space-y-6">
                    {/* Profil familial */}
                    <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-white/20">
                      <h4 className="text-xl font-bold text-gray-800 mb-6">Profil familial</h4>
                      
                      <div className="flex items-center space-x-6 mb-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                          {user.avatar}
                        </div>
                        <div className="flex-1">
                          <h5 className="text-lg font-bold text-gray-800">{user.name}</h5>
                          <p className="text-gray-600">{user.email}</p>
                          <p className="text-gray-500 text-sm">{user.familyName}</p>
                        </div>
                        <button className="bg-teal-100 text-teal-700 px-4 py-2 rounded-xl hover:bg-teal-200 transition-colors font-medium">
                          Modifier
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Nom de famille</label>
                          <input
                            type="text"
                            value={user.familyName}
                            className="w-full bg-white/60 border border-white/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-400"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Nombre de membres</label>
                          <select className="w-full bg-white/60 border border-white/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-400">
                            <option>3 membres</option>
                            <option>4 membres</option>
                            <option>5 membres</option>
                            <option>6+ membres</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Confidentialité et données */}
                    <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-white/20">
                      <h4 className="text-xl font-bold text-gray-800 mb-6">Confidentialité et données</h4>
                      
                      <div className="space-y-4">
                        {[
                          { label: 'Partager ma localisation', desc: 'Pour les recommandations d\'activités locales', checked: true },
                          { label: 'Notifications par email', desc: 'Rappels et suggestions d\'activités', checked: true },
                          { label: 'Suggestions d\'activités', desc: 'Recommandations personnalisées basées sur vos préférences', checked: true },
                          { label: 'Analyse des messages', desc: 'Améliorer les suggestions de reformulation', checked: false },
                          { label: 'Partage de données anonymisées', desc: 'Aider à améliorer Nesti pour toutes les familles', checked: false }
                        ].map((setting, idx) => (
                          <div key={idx} className="flex items-start justify-between p-4 bg-white/40 rounded-2xl">
                            <div className="flex-1">
                              <h6 className="font-medium text-gray-800">{setting.label}</h6>
                              <p className="text-sm text-gray-600 mt-1">{setting.desc}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer ml-4">
                              <input type="checkbox" defaultChecked={setting.checked} className="sr-only peer" />
                              <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Accessibilité */}
                    <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-white/20">
                      <h4 className="text-xl font-bold text-gray-800 mb-6">Accessibilité</h4>
                      
                      <div className="space-y-4">
                        {[
                          { label: 'Mode lecture facile', desc: 'Interface simplifiée avec texte plus grand' },
                          { label: 'Contraste élevé', desc: 'Améliore la visibilité pour les malvoyants' },
                          { label: 'Réduction des animations', desc: 'Limite les effets visuels' },
                          { label: 'Notifications sonores', desc: 'Sons pour les alertes importantes' }
                        ].map((setting, idx) => (
                          <div key={idx} className="flex items-start justify-between p-4 bg-white/40 rounded-2xl">
                            <div className="flex-1">
                              <h6 className="font-medium text-gray-800">{setting.label}</h6>
                              <p className="text-sm text-gray-600 mt-1">{setting.desc}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer ml-4">
                              <input type="checkbox" className="sr-only peer" />
                              <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Gestion des données */}
                    <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-white/20">
                      <h4 className="text-xl font-bold text-gray-800 mb-6">Gestion des données</h4>
                      
                      <div className="space-y-3">
                        <button className="w-full flex items-center justify-between p-4 bg-white/60 rounded-2xl hover:bg-white/80 transition-all duration-200 text-left">
                          <div>
                            <h6 className="font-medium text-gray-800">Exporter mes données</h6>
                            <p className="text-sm text-gray-600">Télécharger toutes vos données familiales</p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </button>
                        
                        <button className="w-full flex items-center justify-between p-4 bg-white/60 rounded-2xl hover:bg-white/80 transition-all duration-200 text-left">
                          <div>
                            <h6 className="font-medium text-gray-800">Historique des activités</h6>
                            <p className="text-sm text-gray-600">Voir et gérer l'historique de vos données</p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </button>
                        
                        <button className="w-full flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-2xl hover:bg-red-100 transition-all duration-200 text-left">
                          <div>
                            <h6 className="font-medium text-red-800">Supprimer mon compte</h6>
                            <p className="text-sm text-red-600">Suppression définitive de toutes vos données</p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-red-400" />
                        </button>
                      </div>
                    </div>

                    {/* Support et aide */}
                    <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-white/20">
                      <h4 className="text-xl font-bold text-gray-800 mb-6">Support et aide</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button className="p-4 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl hover:shadow-lg transition-all duration-200 text-center">
                          <div className="text-2xl mb-2">📚</div>
                          <h6 className="font-medium text-gray-800">Guide d'utilisation</h6>
                        </button>
                        
                        <button className="p-4 bg-gradient-to-br from-green-100 to-teal-100 rounded-2xl hover:shadow-lg transition-all duration-200 text-center">
                          <div className="text-2xl mb-2">💬</div>
                          <h6 className="font-medium text-gray-800">Contacter le support</h6>
                        </button>
                        
                        <button className="p-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl hover:shadow-lg transition-all duration-200 text-center">
                          <div className="text-2xl mb-2">⭐</div>
                          <h6 className="font-medium text-gray-800">Donner votre avis</h6>
                        </button>
                      </div>
                      
                      <div className="mt-6 p-4 bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl">
                        <h6 className="font-medium text-gray-800 mb-2">Version actuelle : Nesti 2.1.0</h6>
                        <p className="text-sm text-gray-600">
                          Dernière mise à jour : Nouvelles fonctionnalités d'accessibilité et amélioration de l'IA
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modales */}
      <EventModal />
      <TaskModal />
    </div>
  );
};

export default NestiApp;

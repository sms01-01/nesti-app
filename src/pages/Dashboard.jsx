import { Calendar, MessageCircle, Users, Settings } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-blue-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col p-6">
        <div className="flex items-center mb-10">
          <img src="/logo.svg" alt="Nesti" className="w-10 h-10 mr-3" />
          <span className="font-bold text-xl text-blue-600">Nesti</span>
        </div>
        <nav className="flex flex-col gap-4">
          <NavItem icon={<Calendar />} label="Dashboard" active />
          <NavItem icon={<MessageCircle />} label="Chat" />
          <NavItem icon={<Users />} label="Activities" />
          <NavItem icon={<Settings />} label="Settings" />
        </nav>
      </aside>
      {/* Main */}
      <main className="flex-1 p-10">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Bonjour, Emma</h1>
            <p className="text-blue-900/70">Organisation et bien-être pour toute la famille</p>
          </div>
          <img src="/avatar.svg" alt="Avatar" className="w-12 h-12 rounded-full border-2 border-blue-200" />
        </header>
        <div className="grid grid-cols-4 gap-8">
          {/* Calendrier */}
          <section className="col-span-1 bg-white rounded-xl shadow p-5">
            <h2 className="font-semibold mb-4">Emploi du temps</h2>
            {/* ...calendrier ici avec events */}
          </section>
          {/* Chat */}
          <section className="col-span-2 bg-white rounded-xl shadow p-5">
            <h2 className="font-semibold mb-4">Chat familial</h2>
            {/* ...chat ici */}
          </section>
          {/* Activités inclusives */}
          <section className="col-span-1 flex flex-col gap-6">
            <div className="bg-yellow-50 rounded-xl shadow p-5">
              <h3 className="font-semibold mb-2">Activités inclusives</h3>
              <p className="font-medium text-yellow-900">Expo sur l’art-thérapie</p>
              <p className="text-yellow-800 text-sm">Musée de l’art moderne</p>
            </div>
            <div className="bg-blue-100 rounded-xl shadow p-5 flex flex-col items-start">
              <h3 className="font-semibold mb-2">Votre bien-être</h3>
              <p className="mb-4">N’oubliez pas votre pause méditation</p>
              <button className="bg-yellow-400 text-white px-4 py-2 rounded-lg font-bold">Démarrer</button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active }) {
  return (
    <div className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer ${active ? 'bg-blue-50 font-bold text-blue-700' : 'hover:bg-blue-50 text-gray-700'}`}>
      {icon}
      <span>{label}</span>
    </div>
  );
}

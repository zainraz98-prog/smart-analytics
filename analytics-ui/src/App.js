import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const App = () => {
  const [chartData, setChartData] = useState(null);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [logs, setLogs] = useState([]);
  const [hoveredTab, setHoveredTab] = useState(null);
  
  // Settings State - Updated for Live
  const [projectName, setProjectName] = useState('SwiftStats Live');
  const [domain, setDomain] = useState('swiftstats.infinityfreeapp.com');

  const fetchData = () => {
    // UPDATED: Now points to your live InfinityFree backend
    fetch('http://swiftstats.infinityfreeapp.com/backend/get_stats.php')
      .then(res => res.json())
      .then(data => setChartData(data))
      .catch(err => console.error("Stats Fetch Error:", err));

    fetch('http://swiftstats.infinityfreeapp.com/backend/get_logs.php')
      .then(res => res.json())
      .then(data => setLogs(data))
      .catch(err => console.error("Logs Fetch Error:", err));
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  // --- HANDLERS ---

  const handleRunAnalysis = () => {
    const btn = document.getElementById('analysis-btn');
    btn.innerText = "Processing...";
    btn.disabled = true;

    // UPDATED: Live Python analysis trigger
    fetch('http://swiftstats.infinityfreeapp.com/backend/run_analysis.php')
      .then(res => res.json())
      .then(data => {
        alert(`Analysis Success: ${data.message} at ${data.timestamp}`);
        btn.innerText = "Run New Analysis";
        btn.disabled = false;
        fetchData(); 
      })
      .catch(err => {
        alert("Python Engine Error");
        btn.innerText = "Run New Analysis";
        btn.disabled = false;
      });
  };

  const handleSaveSettings = () => {
    const settingsData = { projectName, domain };

    // UPDATED: Live Save Settings
    fetch('http://swiftstats.infinityfreeapp.com/backend/save_settings.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settingsData)
    })
    .then(res => res.json())
    .then(data => {
      alert("Success: Configuration synced to database!");
      console.log("Server Response:", data);
    })
    .catch(err => alert("Error saving settings. Check backend connection."));
  };

  // --- VIEWS (Kept same as original for UI consistency) ---
  const PythonInsightsView = () => (
    <div style={styles.card}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
        <h4 style={styles.cardTitle}>Automated Intelligence</h4>
        <button id="analysis-btn" onClick={handleRunAnalysis} style={styles.actionBtn}>Run New Analysis</button>
      </div>
      <div style={styles.terminal}>
        <div style={styles.terminalHeader}>
          <div style={{display: 'flex', gap: '6px'}}>
            <div style={{...styles.dot, backgroundColor: '#ff5f56'}}></div>
            <div style={{...styles.dot, backgroundColor: '#ffbd2e'}}></div>
            <div style={{...styles.dot, backgroundColor: '#27c93f'}}></div>
          </div>
          <span style={styles.terminalTitle}>SwiftStats Engine — analysis.py</span>
        </div>
        <div style={styles.terminalBody}>
          <p style={styles.termText}><span style={{color: '#4fc3f7'}}>[INFO]</span> Connecting to Live MySQL...</p>
          <p style={styles.termText}><span style={{color: '#81c784'}}>[SUCCESS]</span> System ready for processing.</p>
          <p style={styles.termText}>Total Entries Processed: <span style={{color: '#4fc3f7'}}>{logs.length}</span></p>
          <p style={styles.termText}>System Status: <span style={{color: '#81c784'}}>Optimal</span></p>
        </div>
      </div>
    </div>
  );

  const SettingsView = () => (
    <div style={styles.card}>
      <h4 style={styles.cardTitle}>Global Configuration</h4>
      <div style={styles.settingRow}>
        <div>
          <p style={styles.settingLabel}>Project Name</p>
          <p style={styles.settingSub}>Identify your analytics property</p>
        </div>
        <input 
          style={styles.input} 
          value={projectName} 
          onChange={(e) => setProjectName(e.target.value)} 
        />
      </div>
      <div style={styles.settingRow}>
        <div>
          <p style={styles.settingLabel}>Tracking Domain</p>
          <p style={styles.settingSub}>Whitelist visits from this URL</p>
        </div>
        <input 
          style={styles.input} 
          value={domain} 
          onChange={(e) => setDomain(e.target.value)} 
        />
      </div>
      <button onClick={handleSaveSettings} style={{...styles.actionBtn, marginTop: '30px', width: '100%'}}>Save Configuration</button>
    </div>
  );

  return (
    <div style={styles.dashboard}>
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>SwiftStats<span style={{color: '#4fc3f7'}}>.</span></h2>
        <nav style={styles.nav}>
          {['Dashboard', 'Real-time Logs', 'Python Insights', 'Settings'].map(tab => (
            <div 
              key={tab}
              onClick={() => setActiveTab(tab)}
              onMouseEnter={() => setHoveredTab(tab)}
              onMouseLeave={() => setHoveredTab(null)}
              style={{
                ...styles.navItem,
                ...(activeTab === tab ? styles.navItemActive : (hoveredTab === tab ? styles.navItemHover : {}))
              }}
            >
              <span style={{marginRight: '12px'}}>{tab === 'Dashboard' ? '📊' : tab === 'Real-time Logs' ? '🕒' : tab === 'Python Insights' ? '🐍' : '⚙️'}</span>
              {tab}
            </div>
          ))}
        </nav>
      </div>

      <div style={styles.main}>
        <header style={styles.header}>
          <h2 style={{margin: 0, fontWeight: 800, color: '#0f172a'}}>{activeTab}</h2>
          <div style={styles.userProfile}><div style={styles.avatar}>A</div><span>Admin Console</span></div>
        </header>

        {activeTab === 'Dashboard' && (
          <>
            <div style={styles.statsGrid}>
              <div style={styles.card}><p style={styles.cardTitle}>Total Hits</p><h2 style={{margin:0}}>{chartData ? chartData.datasets[0].data.reduce((a, b) => a + b, 0) : 0}</h2></div>
              <div style={styles.card}><p style={styles.cardTitle}>Health</p><h2 style={{margin:0, color: '#81c784'}}>Live</h2></div>
              <div style={styles.card}><p style={styles.cardTitle}>Region</p><h2 style={{margin:0}}>Cloud</h2></div>
            </div>
            <div style={styles.chartContainer}>
                {chartData ? <Bar data={chartData} options={{responsive:true, maintainAspectRatio:false, plugins:{legend:{display:false}}}} /> : <p>Loading Live Data...</p>}
            </div>
          </>
        )}

        {activeTab === 'Real-time Logs' && (
          <div style={styles.card}>
            <table style={styles.table}>
              <thead><tr style={styles.th}><th style={styles.td}>Timestamp</th><th style={styles.td}>Event</th><th style={styles.td}>Resource</th></tr></thead>
              <tbody>
                {logs.map(log => (
                  <tr key={log.id} style={{borderBottom: '1px solid #f1f5f9'}}>
                    <td style={styles.td}>{log.created_at}</td>
                    <td style={styles.td}><span style={styles.badge}>GET</span></td>
                    <td style={styles.td}>{log.page_url}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'Python Insights' && <PythonInsightsView />}
        {activeTab === 'Settings' && <SettingsView />}
      </div>
    </div>
  );
};

// Styles remain exactly as you had them
const styles = {
  dashboard: { display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc', color: '#1e293b', fontFamily: 'Inter, system-ui' },
  sidebar: { width: '260px', backgroundColor: '#0f172a', color: '#fff', padding: '40px 20px' },
  logo: { fontSize: '26px', fontWeight: 'bold', marginBottom: '40px' },
  nav: { display: 'flex', flexDirection: 'column', gap: '8px' },
  navItem: { padding: '14px 20px', cursor: 'pointer', borderRadius: '12px', color: '#94a3b8', transition: '0.2s', display: 'flex', alignItems: 'center' },
  navItemHover: { backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff' },
  navItemActive: { backgroundColor: '#4fc3f7', color: '#0f172a', fontWeight: '700', transform: 'scale(1.02)', boxShadow: '0 4px 12px rgba(79,195,247,0.3)' },
  main: { flex: 1, padding: '50px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' },
  avatar: { width: '38px', height: '38px', backgroundColor: '#e2e8f0', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', marginRight: '10px' },
  userProfile: { display: 'flex', alignItems: 'center' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' },
  card: { backgroundColor: '#fff', padding: '24px', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' },
  cardTitle: { margin: '0 0 10px 0', fontSize: '13px', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' },
  chartContainer: { backgroundColor: '#fff', padding: '24px', borderRadius: '20px', height: '400px', border: '1px solid #e2e8f0' },
  actionBtn: { backgroundColor: '#0f172a', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', transition: '0.3s' },
  terminal: { backgroundColor: '#1e1e1e', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' },
  terminalHeader: { backgroundColor: '#333', padding: '10px 15px', display: 'flex', alignItems: 'center', gap: '10px' },
  dot: { width: '12px', height: '12px', borderRadius: '50%' },
  terminalTitle: { color: '#999', fontSize: '12px', fontFamily: 'monospace' },
  terminalBody: { padding: '20px', backgroundColor: '#000', minHeight: '200px' },
  termText: { color: '#d4d4d4', fontFamily: 'monospace', margin: '4px 0', fontSize: '13px' },
  settingRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0', borderBottom: '1px solid #f1f5f9' },
  settingLabel: { margin: 0, fontWeight: 'bold', fontSize: '15px' },
  settingSub: { margin: 0, fontSize: '12px', color: '#64748b' },
  input: { padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', width: '250px', outline: 'none' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { borderBottom: '2px solid #f1f5f9', textAlign: 'left' },
  td: { padding: '15px 10px', fontSize: '14px' },
  badge: { backgroundColor: '#e0f2fe', color: '#0369a1', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold' }
};

export default App;
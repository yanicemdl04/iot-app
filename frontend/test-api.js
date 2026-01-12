// Test de connexion API
const testAPI = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/health');
    const data = await response.json();
    console.log('✅ API accessible:', data);
  } catch (error) {
    console.error('❌ Erreur API:', error.message);
  }
};

testAPI();
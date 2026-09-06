import apiClient from "./api/client";

function App() {
  console.log("API URL:", import.meta.env.VITE_API_URL);
  console.log("Axios base URL:", apiClient.defaults.baseURL);

  return (
    <div>
      <h1>JobTrail</h1>
      <p>Frontend setup successful.</p>
    </div>
  );
}

export default App;
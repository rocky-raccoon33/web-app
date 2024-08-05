import './App.css';
import ResponsiveAppBar from './components/ResponsiveAppBar';
import Device from "./components/Device"

function App() {
  return (
    <div className="App">
      <ResponsiveAppBar />
      <Device />
    </div>
  );
}

export default App;

import Routing from "./Routing";
import './App.css';
import '../index.css';
import DataProvider from "./components/DataProvider";

function App() {
  return (
    <>
      <DataProvider>
        <Routing />
      </DataProvider>
    </>
  );
}

export default App;
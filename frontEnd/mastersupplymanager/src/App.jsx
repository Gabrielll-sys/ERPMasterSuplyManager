import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import CreateMaterial from "./Pages/CreateMaterial";
import UpdateMaterial from "./Pages/UpdateMaterial";
import SearchInventory from "./Pages/SearchInventory";
import UpdateInvetory from "./Pages/UpdateInventory";
function App() {
  
  const queryClient = new QueryClient()
  
  
  return (
    
  
    <>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route path="createMaterial" element={<CreateMaterial />} />
            <Route path="/updateMaterial" element={<UpdateMaterial />} />
            <Route path="/" element={<SearchInventory />} />
            <Route path="/updateInventory" element={<UpdateInvetory />} />
          </Routes>
        </Router>
      </QueryClientProvider>
    </>
  );
}

export default App;
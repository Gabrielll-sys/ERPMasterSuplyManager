import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import CreateMaterial from "./Pages/CreateMaterial";
import UpdateMaterial from "./Pages/UpdateMaterial";
import CreateMaterial from "./Pages/CreateMaterial";
import UpdateMaterial from "./Pages/UpdateInvetory";
function App() {
  
  const queryClient = new QueryClient()
  
  
  return (
    
  
    <>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route path="/" element={<CreateMaterial />} />
            <Route path="/updateMaterial" element={<UpdateMaterial />} />
            <Route path="/updateMaterial" element={<CreateInventory />} />
            <Route path="/updateInventory" element={<UpdateInventory />} />
          </Routes>
        </Router>
      </QueryClientProvider>
    </>
  );
}

export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import CreateMaterial from "./Pages/CreateMaterial";
import UpdateMaterial from "./Pages/UpdateMaterial";
function App() {
  
  const queryClient = new QueryClient()
  
  
  return (
    
  
    <>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route path="/" element={<CreateMaterial />} />
            <Route path="/updateMaterial" element={<UpdateMaterial />} />
          </Routes>
        </Router>
      </QueryClientProvider>
    </>
  );
}

export default App;

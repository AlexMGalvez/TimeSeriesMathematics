import React from "react";
import Layout from "./components/layout/Layout";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/home/Home";

function App() {
  return (
    <Layout>
        <Routes>
          <Route path="/" element={<Home />}></Route>
        </Routes>
    </Layout>
  );
}

export default App;

import React from "react";
import Layout from "./components/layout/Layout";
import { Routes, Route } from "react-router-dom";
import { MathJaxContext } from "better-react-mathjax";

import Home from "./pages/home/Home";
import SupportAndResistanceLines from "./pages/supportAndResistanceLines/SupportAndResistanceLines";
import Donate from "./pages/donate/Donate";

function App() {
  return (
    <Layout>
      <MathJaxContext>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route
            path="/computing-support-and-resistance-lines-in-javascript"
            element={<SupportAndResistanceLines />}
          ></Route>
          <Route path="/donate" element={<Donate />}></Route>
        </Routes>
      </MathJaxContext>
    </Layout>
  );
}

export default App;

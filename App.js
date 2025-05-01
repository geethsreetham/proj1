import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import Header from './components/Header';
import Featmancar from './components/Featmancar';
import PopTod from './components/PopTod';
import RankingSec from './components/RankingSec';
function App(){
  return(
    <div className="bg-dark text-light min-vh-100">
    <Header />
    <div className="container my-4">
      <div className="row">
        {/* Left Column: Featured + Popular */}
        <div className="col-lg-8">
          <Featmancar />
          <PopTod/>
        </div>

        {/* Right Column: Ranking */}
        <div className="col-lg-4">
          <RankingSec/>
        </div>
      </div>
    </div>
  </div>
  )
}
export default App
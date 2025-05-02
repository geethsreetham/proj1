import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../index.css';
import './MainPage.css';
import Header from './Header';
import Featmancar from './Featmancar';
import PopTod from './PopTod';
import RankingSec from './RankingSec';

function MainPage() {
  return (
    <div className="main-page-wrapper">
      <Header />
      <div className="container my-4">
        <div className="row">
          {/* Left Column: Featured + Popular */}
          <div className="col-lg-8">
            <Featmancar />
            <PopTod />
          </div>

          {/* Right Column: Ranking */}
          <div className="col-lg-4">
            <RankingSec />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
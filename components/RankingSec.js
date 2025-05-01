import React from "react";
const rankingItems = [
    { title: 'Terminally-Ill Genius Dark Knight', rating: 9.3 },
    { title: 'Nano Machine', rating: 9.3 },
    { title: 'Nano Machine', rating: 9.3 },
    { title: 'Nano Machine', rating: 9.3 },
    { title: 'Terminally-Ill Genius Dark Knight', rating: 9.3 },
    { title: 'Terminally-Ill Genius Dark Knight', rating: 9.3 },
    { title: 'Terminally-Ill Genius Dark Knight', rating: 9.3 },
    { title: 'Terminally-Ill Genius Dark Knight', rating: 9.3 },
    { title: 'Terminally-Ill Genius Dark Knight', rating: 9.3 },
    { title: 'Terminally-Ill Genius Dark Knight', rating: 9.3 }
  ];
function RankingSec(){
    return(
    <div className="container text-white my-4">
        <div className="d-flex justify-content-between">
          <h4>Weekly Rankings</h4>
          <div className="btn-group">
            <button className="btn btn-outline-light">Weekly</button>
            <button className="btn btn-outline-light">Monthly</button>
            <button className="btn btn-outline-light">All</button>
          </div>
        </div>
        <ul className="list-group mt-3">
          {rankingItems.map((item, index) => (
            <li className="list-group-item bg-dark text-white d-flex justify-content-between align-items-center" key={index}>
              {item.title}
              <span className="badge bg-warning text-dark">⭐ {item.rating}</span>
              
            </li>
          ))}
        </ul>
      </div>
    )
}
export default RankingSec
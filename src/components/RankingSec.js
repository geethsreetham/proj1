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

function RankingSec() {
  return (
    <div className="text-white my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Weekly Rankings</h4>
        <div className="btn-group">
          <button className="btn btn-outline-light">Weekly</button>
          <button className="btn btn-outline-light">Monthly</button>
          <button className="btn btn-outline-light">All</button>
        </div>
      </div>
      <ul className="list-group">
        {rankingItems.map((item, index) => (
          <li
            className={`list-group-item bg-dark text-white d-flex justify-content-between align-items-center ${index % 2 === 0 ? 'bg-dark' : 'bg-secondary'}`}
            key={index}
          >
            <span>
              <strong>{index + 1}.</strong> {item.title}
            </span>
            <span className="badge bg-warning text-dark">⭐ {item.rating}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RankingSec;
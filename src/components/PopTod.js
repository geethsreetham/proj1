import React from "react";

const items = [
  { title: "Revenge of the Iron-Blooded Sword Hound", chapter: "110", rating: "9.6", image: "https://i.ibb.co/Sm0ZsYR/manga-thumbnail.jpg" },
  { title: "The Regressed Son of Duke is an Assassin", chapter: "72", rating: "9.8", image: "https://i.ibb.co/Sm0ZsYR/manga-thumbnail.jpg" },
  { title: "Playing the Perfect Fox-Eyed Villain", chapter: "10", rating: "9.3", image: "https://i.ibb.co/Sm0ZsYR/manga-thumbnail.jpg" },
  { title: "The Regressed Mercenary's Machinations", chapter: "366", rating: "9.5", image: "https://i.ibb.co/Sm0ZsYR/manga-thumbnail.jpg" },
];

function PopTod() {
  return (
    <div>
      <h4 className="text-light my-3">Popular Today</h4>
      <div className="row">
        {items.map((item, idx) => (
          <div className="col-md-3" key={idx}>
            <div className="card bg-dark text-white mb-3 shadow-sm pop-tod-card">
              <img src={item.image} className="card-img-top" alt={item.title} style={{ height: '200px', objectFit: 'cover' }} />
              <div className="card-body">
                <h6 className="card-title">{item.title}</h6>
                <p className="card-text">Chapter {item.chapter}</p>
                <span className="badge bg-warning text-dark">⭐ {item.rating}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PopTod;
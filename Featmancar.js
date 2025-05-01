import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';

function Featmancar() {
  const cards = [
    {
      title: "Childhood Friend of the Z....",
      badge: "9.9",
      type: "MANHWA",
      genres: "Action, Fantasy, Martial Arts, Wuxia",
      description:
        "Gu Yangchun, who betrayed the Orthodox sects, became a demonic human under the Heavenly Demon...",
      img: "https://i.ibb.co/Sm0ZsYR/manga-thumbnail.jpg"
    },
    {
      title: "Martial Peak",
      badge: "9.2",
      type: "MANHUA",
      genres: "Martial Arts, Action, Adventure",
      description:
        "The path to the martial peak is a lonely and solitary one...",
      img: "https://i.ibb.co/Sm0ZsYR/manga-thumbnail.jpg"
    },
    {
      title: "Solo Leveling",
      badge: "9.5",
      type: "MANHWA",
      genres: "Action, Fantasy",
      description:
        "Sung Jin-Woo, the world's weakest hunter, awakens a hidden power within...",
      img: "https://i.ibb.co/Sm0ZsYR/manga-thumbnail.jpg"
    },
    {
      title: "Solo Leveling",
      badge: "9.5",
      type: "MANHWA",
      genres: "Action, Fantasy",
      description:
        "Sung Jin-Woo, the world's weakest hunter, awakens a hidden power within...",
      img: "https://i.ibb.co/Sm0ZsYR/manga-thumbnail.jpg"
    },
    {
      title: "Solo Leveling",
      badge: "9.5",
      type: "MANHWA",
      genres: "Action, Fantasy",
      description:
        "Sung Jin-Woo, the world's weakest hunter, awakens a hidden power within...",
      img: "https://i.ibb.co/Sm0ZsYR/manga-thumbnail.jpg"
    },
    {
      title: "Solo Leveling",
      badge: "9.5",
      type: "MANHWA",
      genres: "Action, Fantasy",
      description:
        "Sung Jin-Woo, the world's weakest hunter, awakens a hidden power within...",
      img: "https://i.ibb.co/Sm0ZsYR/manga-thumbnail.jpg"
    }
  ];

  return (
    <div className="container my-4">
      <h4 className="mb-3 text-white">Featured Manga</h4>
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        spaceBetween={20}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false
        }}
      >
        {cards.map((card, index) => (
          <SwiperSlide key={index}>
            <div className="card text-white bg-gradient p-4" style={{ backgroundColor: '#2c2c54' }}>
              <div className="row g-0">
                <div className="col-md-4">
                  <img src={card.img} className="img-fluid rounded" alt="cover" />
                </div>
                <div className="col-md-8 ps-3">
                  <div className="card-body">
                    <h5 className="card-title d-flex align-items-center">
                      <span className="badge bg-warning text-dark me-2">{card.badge}</span> {card.title}
                    </h5>
                    <h6 className="text-warning">{card.type}</h6>
                    <p className="mb-1"><strong>Genres:</strong> {card.genres}</p>
                    <p className="card-text text-light">{card.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default Featmancar;

import React from 'react';


const Carousel = () => {
  return (
    <section className="row">
      <div className="col-md-12">
        <div
          id="mycarousel"
          className="carousel slide"
          data-bs-ride="carousel"
          data-bs-interval="3000"
        >
          <div className="carousel-inner">
            <div className="carousel-item active">
              <iframe
                width="100%"
                src="https://www.youtube.com/embed/U2VXekO_VIg?loop=1&playlist=U2VXekO_VIg"
                title="YouTube video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                style={{ aspectRatio: '16/9' }} // Keeps aspect ratio
                className="w-100"
              ></iframe>
            </div>
          </div>

          {/* Controls (optional) */}
          <a
            href="#mycarousel"
            data-bs-slide="prev"
            className="carousel-control-prev"
            aria-label="Previous Slide"
          >
            <span className="carousel-control-prev-icon bg-danger"></span>
          </a>

          <a
            href="#mycarousel"
            data-bs-slide="next"
            className="carousel-control-next"
            aria-label="Next Slide"
          >
            <span className="carousel-control-next-icon bg-danger"></span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Carousel;

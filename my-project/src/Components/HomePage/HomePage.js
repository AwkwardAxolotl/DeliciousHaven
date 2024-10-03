/* global $ */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Newsletter from "../Newsletter/Newsletter";
import "./HomePage.css";

export default function HomePage() {
  const { username } = useParams();
  const [main_blog, setMainBlog] = useState({});
  const [side_blogs, setSideBlogs] = useState([]);
  const [main_recipes, setMainRecipes] = useState([]);
  const [side_recipes, setSideRecipes] = useState([]);

  const fetchHome = async () => {
    const res = await fetch("https://del-hav-back-gkh2xx6ly-krashnas-projects.vercel.app/getRecipesBlogs/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(username),
    });

    const data = await res.json();
    if (data.success) {
      setMainBlog(data.main_blog);
      setSideBlogs(data.side_blogs);
      setMainRecipes(data.main_recipes);
      setSideRecipes(data.side_recipes);
    } else {
      console.log(data.error);
    }
  };

  useEffect(() => {
    fetchHome();
    $(".welcome-post-sliders").owlCarousel({
      items: 4,
      loop: true,
      autoplay: true,
      smartSpeed: 1500,
      margin: 10,
      nav: true,
      navText: ["", ""],
      responsive: {
        320: {
          items: 1,
        },
        576: {
          items: 2,
        },
        992: {
          items: 3,
        },
        1200: {
          items: 4,
        },
      },
    });
  }, []);

  return (
    <>
      <section className="welcome-post-sliders owl-carousel mt-3">
        <div className="welcome-single-slide">
          <img src="/img/slide-1.jpg" alt="" />

          <div className="project_title">
            <div className="post-date-commnents d-flex">
              <a href="#">May 19, 2017</a>
              <a href="#">5 Comment</a>
            </div>
            <a href="#">
              <h5>“I’ve Come and I’m Gone”: A Tribute to Istanbul’s Street</h5>
            </a>
          </div>
        </div>

        <div className="welcome-single-slide">
          <img src="/img/slide-2.jpg" alt="" />

          <div className="project_title">
            <div className="post-date-commnents d-flex">
              <a href="#">May 19, 2017</a>
              <a href="#">5 Comment</a>
            </div>
            <a href="#">
              <h5>“I’ve Come and I’m Gone”: A Tribute to Istanbul’s Street</h5>
            </a>
          </div>
        </div>

        <div className="welcome-single-slide">
          <img src="/img/slide-3.jpg" alt="" />

          <div className="project_title">
            <div className="post-date-commnents d-flex">
              <a href="#">May 19, 2017</a>
              <a href="#">5 Comment</a>
            </div>
            <a href="#">
              <h5>“I’ve Come and I’m Gone”: A Tribute to Istanbul’s Street</h5>
            </a>
          </div>
        </div>

        <div className="welcome-single-slide">
          <img src="/img/slide-4.jpg" alt="" />

          <div className="project_title">
            <div className="post-date-commnents d-flex">
              <a href="#">May 19, 2017</a>
              <a href="#">5 Comment</a>
            </div>
            <a href="#">
              <h5>“I’ve Come and I’m Gone”: A Tribute to Istanbul’s Street</h5>
            </a>
          </div>
        </div>

        <div className="welcome-single-slide">
          <img src="/img/slide-1.jpg" alt="" />

          <div className="project_title">
            <div className="post-date-commnents d-flex">
              <a href="#">May 19, 2017</a>
              <a href="#">5 Comment</a>
            </div>
            <a href="#">
              <h5>“I’ve Come and I’m Gone”: A Tribute to Istanbul’s Street</h5>
            </a>
          </div>
        </div>
      </section>
      <section className="categories_area clearfix" id="about">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12 col-md-6 col-lg-4">
              <div
                className="single_catagory wow fadeInUp"
                data-wow-delay=".3s"
              >
                <img src="/img/category-1.jpg" alt="" />
                <div className="catagory-title">
                  <a href={"/recipes/"+username}>
                    <h5>Food</h5>
                  </a>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <div
                className="single_catagory wow fadeInUp"
                data-wow-delay=".6s"
              >
                <img src="/img/category-2.jpg" alt="" />
                <div className="catagory-title">
                  <a href={"/blog/"+username}>
                    <h5>Blogs</h5>
                  </a>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <div
                className="single_catagory wow fadeInUp"
                data-wow-delay=".9s"
              >
                <img src="/img/category-3.jpg" alt="" />
                <div className="catagory-title">
                  <a href={"/profile/"+username}>
                    <h5>Profile</h5>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8" key={"mainBlog"}>
            <div className="row">
              <div className="col-12">
                <div className="single-post wow fadeInUp" data-wow-delay=".2s">
                  <div className="post-thumb">
                    <img src={main_blog && main_blog.image} alt="" />
                  </div>

                  <div className="post-content">
                    <div className="post-meta d-flex">
                      <div className="post-author-date-area d-flex">
                        <div className="post-author">
                          <a href="#">By {main_blog && main_blog.author}</a>
                        </div>

                        <div className="post-date">
                          <a href="#">{main_blog && main_blog.pub_date}</a>
                        </div>
                      </div>

                      <div className="post-comment-share-area d-flex">
                        <div className="post-favourite">
                          <a href="#">
                            <i className="fa fa-heart-o" aria-hidden="true"></i>{" "}
                            10
                          </a>
                        </div>

                        <div className="post-comments">
                          <a href="#">
                            <i
                              className="fa fa-comment-o"
                              aria-hidden="true"
                            ></i>
                            12
                          </a>
                        </div>

                        <div className="post-share">
                          <a href="#">
                            <i
                              className="fa fa-share-alt"
                              aria-hidden="true"
                            ></i>
                          </a>
                        </div>
                      </div>
                    </div>
                    <a href="#">
                      <h2 className="post-headline">
                        {main_blog && main_blog.title}
                      </h2>
                    </a>
                    <p className="font-bold">
                      {main_blog.paragraphs && main_blog.paragraphs[0]}
                    </p>
                    <a
                      href={
                        "/blog/" +
                        username +
                        "/" +
                        (main_blog && main_blog.title)
                      }
                      className="read-more"
                    >
                      Continue Reading
                    </a>
                  </div>
                </div>
              </div>

              {side_blogs &&
                side_blogs.map((e) => (
                  <div className="col-12 col-md-6">
                    <div
                      className="single-post wow fadeInUp"
                      data-wow-delay=".4s"
                    >
                      <div className="post-thumb">
                        <img src={e.image} width={450} alt="" />
                      </div>

                      <div className="post-content">
                        <div className="post-meta d-flex">
                          <div className="post-author-date-area d-flex">
                            <div className="post-author">
                              <a href="#">By {e.author}</a>
                            </div>

                            <div className="post-date">
                              <a href="#">{e.pub_date}</a>
                            </div>
                          </div>

                          <div className="post-comment-share-area d-flex">
                            <div className="post-favourite">
                              <a href="#">
                                <i
                                  className="fa fa-heart-o"
                                  aria-hidden="true"
                                ></i>{" "}
                                10
                              </a>
                            </div>

                            <div className="post-comments">
                              <a href="#">
                                <i
                                  className="fa fa-comment-o"
                                  aria-hidden="true"
                                ></i>
                                12
                              </a>
                            </div>

                            <div className="post-share">
                              <a href="#">
                                <i
                                  className="fa fa-share-alt"
                                  aria-hidden="true"
                                ></i>
                              </a>
                            </div>
                          </div>
                        </div>
                        <a href={"/blog/" + username + "/" + e.title}>
                          <h4 className="post-headline">{e.title}</h4>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              {main_recipes &&
                main_recipes.map((r) => (
                  <div className="col-12 mt-5" key={r.title}>
                    <div
                      className="list-blog single-post d-sm-flex wow fadeInUpBig"
                      data-wow-delay=".2s"
                    >
                      <div className="post-thumb">
                        <img
                          src={r.image}
                          className="mx-5"
                          width={400}
                          alt=""
                          onError={(e) => {
                            e.target.src = "/img/default_image.png";
                          }}
                        />
                      </div>

                      <div className="post-content">
                        <div className="post-meta d-flex">
                          <div className="post-author-date-area d-flex">
                            <div className="post-author">
                              <a href="#">{r.category}</a>
                            </div>

                            <div className="post-date">
                              <a href="#">
                                Prep Time: {r.details["Prep Time:"]}
                              </a>
                            </div>
                          </div>

                          <div className="post-comment-share-area d-flex">
                            <div className="post-favourite">
                              <a href="#">
                                <i
                                  className="fa fa-star"
                                  aria-hidden="true"
                                ></i>{" "}
                                {r.rating}
                              </a>
                            </div>

                            <div className="post-comments">
                              <a href="#">
                                <i
                                  className="fa fa-comment-o"
                                  aria-hidden="true"
                                ></i>{" "}
                                {r.total_reviews}
                              </a>
                            </div>

                            <div className="post-share">
                              <a href="#">
                                <i
                                  className="fa fa-share-alt"
                                  aria-hidden="true"
                                ></i>
                              </a>
                            </div>
                          </div>
                        </div>
                        <a href={"/recipeSingle/" + username + "/" + r.title}>
                          <h4 className="post-headline">
                            {r.title.toLowerCase()}
                          </h4>
                        </a>
                        <p>
                          This quick {r.category} recipe serves{" "}
                          {r.details["Servings:"]} and is ready in just{" "}
                          {r.details["Total Time:"]}. The main ingredients are{" "}
                          {r.ingredients.slice(0, 2).join(", ")}, and it's
                          perfect for a delicious, no-fuss meal!
                        </p>
                        <a
                          href={"/recipeSingle/" + username + "/" + r.title}
                          className="read-more"
                        >
                          Continue Reading
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="col-12 col-sm-8 col-md-6 col-lg-4">
            <div className="blog-sidebar mt-5 mt-lg-0">
              <div className="single-widget-area about-me-widget text-center">
                <div className="widget-title">
                  <h6>About Me</h6>
                </div>
                <div className="about-me-widget-thumb">
                  <img src="/img/about-1.png" alt="" />
                </div>
                <h4 className="font-shadow-into-light">Krashna Mehta</h4>
                <p>
                  So yeah I made this website somehow. I am trying to be
                  a techie because 💸 I don't know much about myself tbh.
                </p>
              </div>

              <div className="single-widget-area subscribe_widget text-center">
                <div className="widget-title">
                  <h6>Subscribe &amp; Follow</h6>
                </div>
                <div className="subscribe-link">
                  <a href="#">
                    <i className="fa-brands fa-facebook" aria-hidden="true"></i>
                  </a>
                  <a href="#">
                    <i className="fa-brands fa-twitter" aria-hidden="true"></i>
                  </a>
                  <a href="#">
                    <i className="fa-brands fa-google" aria-hidden="true"></i>
                  </a>
                  <a href="#">
                    <i className="fa-brands fa-linkedin" aria-hidden="true"></i>
                  </a>
                  <a href="#">
                    <i
                      className="fa-brands fa-instagram"
                      aria-hidden="true"
                    ></i>
                  </a>
                  <a href="#">
                    <i className="fa-brands fa-vimeo" aria-hidden="true"></i>
                  </a>
                </div>
              </div>

              <div className="single-widget-area popular-post-widget">
                <div className="widget-title text-center">
                  <h6>Popular Dishes</h6>
                </div>
                {side_recipes &&
                  side_recipes.map((r) => (
                    <div className="single-populer-post d-flex">
                      <img
                        src={r.image}
                        alt=""
                        onError={(e) => {
                          e.target.src = "/img/default_image.png";
                        }}
                      />
                      <div className="post-content">
                        <a href={"/recipeSingle/" + username + "/" + r.title}>
                          <h6 className="text-black">
                            {r.title}
                          </h6>
                        </a>
                        <p>{r.category}</p>
                      </div>
                    </div>
                  ))}
              </div>

              <div className="single-widget mb-80">
                  <div className="quote-area text-center">
                    <span>"</span>
                    <h4>
                      Nothing is better than going home to family and eating
                      good food and relaxing
                    </h4>
                    <p>John Smith</p>
                    <div className="date-comments d-flex justify-content-between">
                      <div className="date">January 04, 2018</div>
                      <div className="comments">2 Comments</div>
                    </div>
                  </div>
                </div>

              <div className="single-widget-area newsletter-widget">
                <div className="widget-title text-center">
                  <h6>Newsletter</h6>
                </div>
                <p>
                  Subscribe our newsletter gor get notification about new
                  updates, information discount, etc.
                </p>
                <Newsletter></Newsletter>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

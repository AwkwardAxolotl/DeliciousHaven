import React, { useEffect, useRef, useState } from "react";
import "./BlogComp.css";
import Newsletter from "../Newsletter/Newsletter";
import { useParams } from "react-router-dom";

export default function BlogComp() {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [dates, setDates] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 4;
  const { username } = useParams();
  const blogContainerRef = useRef()

  const fetchBlogs = async (blogFilter = false) => {
    const res = await fetch("https://delhavback.onrender.com//getBlogs/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ filter: blogFilter }),
    });
    const data = await res.json();
    setBlogs(data.blogs);
    setCategories(data.categories);
    setDates(data.dates || dates);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Calculate the number of pages
  const pageCount = Math.ceil(blogs.length / blogsPerPage);

  // Get the blogs to display on the current page
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);

  // Handle page change
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handleCategoryChange = (category) => {
    if (blogContainerRef.current) {
      blogContainerRef.current.scrollIntoView({ behavior: "smooth" });
    }
    if (category === "all") {
      setCurrentPage(1); // Reset to the first page
      fetchBlogs();
      return;
    }
    setCurrentPage(1); // Reset to the first page
    fetchBlogs(category); // Fetch blogs based on the selected category
  };

  const handleDateChange = (date) => {
    if (blogContainerRef.current) {
      blogContainerRef.current.scrollIntoView({ behavior: "smooth" });
    }
    if (date === "all") {
      setCurrentPage(1); // Reset to the first page
      fetchBlogs();
      return;
    }
    setCurrentPage(1); // Reset to the first page
    fetchBlogs(date); // Fetch blogs based on the selected date
  };

  // Determine the range of page numbers to display
  const maxPageNumbersToShow = 5;
  let startPageNumber = Math.max(
    currentPage - Math.floor(maxPageNumbersToShow / 2),
    1
  );
  let endPageNumber = Math.min(
    startPageNumber + maxPageNumbersToShow - 1,
    pageCount
  );

  if (endPageNumber - startPageNumber + 1 < maxPageNumbersToShow) {
    startPageNumber = Math.max(endPageNumber - maxPageNumbersToShow + 1, 1);
  }

  return (
    <>
      <div
        className="page-title bg-img bg-overlay mt-3"
        style={{
          backgroundImage: "url(/img/breadcumb2.jpg)",
          overflowX: "hidden",
          height: "500px",
        }}
      >
        <div className="h-100">
          <div className="row h-100 align-items-center">
            <div className="col-12">
              <div className="breadcumb-text text-center">
                <h2>Blog</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="blog-area section-padding-80 mx-5">
        <div>
          <div className="row">
            <div className="col-12 col-lg-8">
              <div ref={blogContainerRef} className="blog-posts-area">
                {currentBlogs.map((blog) => (
                  <div className="single-blog-area mb-80" key={blog.title}>
                    <div className="blog-thumbnail">
                      <img src={blog.image} alt="img" />

                      <div className="post-date">
                        <a
                          href="#"
                          style={{ textDecoration: "none", fontWeight: "bold" }}
                        >
                          <span>{blog.pub_date.date}</span>
                          {blog.pub_date.month} <br /> {blog.pub_date.year}
                        </a>
                      </div>
                    </div>

                    <div className="blog-content">
                      <a
                        href="#"
                        className="post-title"
                        style={{ textDecoration: "none", fontWeight: "bold" }}
                      >
                        {blog.title}
                      </a>
                      <div className="meta-data">
                        by <a href="#">{blog.author}</a> in{" "}
                        <a href="#">{blog.category}</a>
                      </div>
                      <p>{blog.paragraphs[0]} </p>
                      <a
                        href={`/blog/${username}/${blog.title}`}
                        className="btn delicious-btn mt-30"
                      >
                        Read More
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              <nav aria-label="Page navigation example">
                <ul className="pagination justify-content-center">
                  <li
                    className={`page-item ${
                      currentPage === 1 ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage - 1)}
                    ></button>
                  </li>
                  {Array.from(
                    { length: endPageNumber - startPageNumber + 1 },
                    (_, index) => (
                      <li
                        key={startPageNumber + index}
                        className={`page-item ${
                          currentPage === startPageNumber + index
                            ? "active"
                            : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() =>
                            handlePageChange(startPageNumber + index)
                          }
                        >
                          {startPageNumber + index}
                        </button>
                      </li>
                    )
                  )}
                  <li
                    className={`page-item ${
                      currentPage === pageCount ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage + 1)}
                    ></button>
                  </li>
                </ul>
              </nav>
            </div>

            <div className="col-12 col-lg-4">
              <div className="blog-sidebar-area">
                <div className="single-widget mb-80">
                  <h6>Archive</h6>
                  <ul className="list">
                    <li>
                      <a
                        style={{ textDecoration: "none", cursor: "pointer" }}
                        onClick={() => handleDateChange("all")}
                      >
                        View All
                      </a>
                    </li>
                    {dates.map((date) => (
                      <li key={date}>
                        <a
                          style={{ textDecoration: "none", cursor: "pointer" }}
                          onClick={() => {
                            handleDateChange(date);
                          }}
                        >
                          {date}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="single-widget mb-80">
                  <h6>Categories</h6>
                  <ul className="list">
                    <li>
                      <a
                        style={{ textDecoration: "none", cursor: "pointer" }}
                        onClick={() => handleCategoryChange("all")}
                      >
                        View All
                      </a>
                    </li>
                    {categories.map((category) => (
                      <li key={category}>
                        <a
                          onClick={() => handleCategoryChange(category)}
                          style={{ textDecoration: "none", cursor: "pointer" }}
                        >
                          {category}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="single-widget mb-80">
                  <h6>Newsletter</h6>
                  <Newsletter></Newsletter>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

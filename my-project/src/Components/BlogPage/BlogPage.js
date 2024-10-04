import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./BlogPage.css";

const BlogPage = () => {
  const { encodedTitle } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [sideblogs, setSideBlogs] = useState([]);
  const { username } = useParams();

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        const title = encodedTitle;
        const response = await fetch(`https://del-hav-back-i9qh7hu0y-krashnas-projects.vercel.app/getSingleBlog/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title: title }),
        });

        const data = await response.json();
        if (data.success) {
          setBlog(data.blog);
          setSideBlogs(data.side_blogs);
        } else {
          console.log(data.error);
        }
      } catch (error) {
        console.error("Error decoding title or fetching blog post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPost();
  }, [encodedTitle]);

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = new Date().toLocaleDateString("en-US", options);
    const res = await fetch("https://delhavback.onrender.com//addComment/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        comment: comment,
        title: encodedTitle,
        time: formattedDate,
        username: atob(username),
        userRecipe:false,
        recipe: false,
      }),
    });
    const data = await res.json();
    if (data.success) {
      const newComment = {
        username: atob(username),
        time: formattedDate,
        comment: comment,
      };

      setBlog((prevBlog) => ({
        ...prevBlog,
        comments: [...prevBlog.comments, newComment],
      }));
    } else {
      console.log("Error:" + data.error);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }
  return (
    <div className="main-wrapper">
      <section
        className="page-title bg-img bg-overlay"
        style={{
          backgroundImage: `url(/img/breadcumb4.jpg)`,
          overflowX: "hidden",
          height: "500px",
        }}
      >
        <div className="blog-container">
          <div className="row">
            <div className="col-12">
              <div className="text-center">
                <span className="page-title-text">{blog.category}</span>
                <h1 className="page-title-heading">{blog.title}</h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section blog-wrap bg-gray">
        <div className="blog-container">
          <div className="row">
            <div className="col-lg-8">
              <div className="row">
                <div className="col-lg-12 mb-5">
                  <div className="single-blog-item">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="img-fluid rounded"
                    />

                    <div className="blog-item-content bg-white p-5">
                      <h2 className="blog-item-title">
                        <h1>{blog.title}</h1>
                      </h2>
                      <p>{blog.paragraphs[0]}</p>

                      {blog.paragraphs.slice(1).map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}

                      <div className="tag-option mt-5 clearfix">
                        <ul className="float-right list-inline">
                          <li className="list-inline-item">Share:</li>
                          <li className="list-inline-item">
                            <a
                              href="#"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <i
                                className="fab fa-facebook-f"
                                aria-hidden="true"
                              ></i>
                            </a>
                          </li>
                          <li className="list-inline-item">
                            <a
                              href="#"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <i
                                className="fab fa-twitter"
                                aria-hidden="true"
                              ></i>
                            </a>
                          </li>
                          <li className="list-inline-item">
                            <a
                              href="#"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <i
                                className="fab fa-pinterest-p"
                                aria-hidden="true"
                              ></i>
                            </a>
                          </li>
                          <li className="list-inline-item">
                            <a
                              href="#"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <i
                                className="fab fa-google-plus"
                                aria-hidden="true"
                              ></i>
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-12 mb-5">
                  <div className="comment-area card border-0 p-5">
                    <h4 className="comments-title">
                      {blog.comments.length} Comments
                    </h4>
                    {blog.comments.length > 0 ? (
                      <ul className="comment-tree list-unstyled">
                        {blog.comments.map((comment, index) => (
                          <li className="mb-5" key={index}>
                            <div className="comment-area-box">
                              <img
                                alt=""
                                src={
                                  "/profile_pics/" + comment.username + ".jpg"
                                }
                                className="mt-2 img-fluid float-start me-3 rounded"
                                height="20"
                                onError={(e) => {
                                  e.target.src =
                                    "https://assets-in.bmscdn.com/static/2023/10/default-pic.png";
                                }}
                              />

                              <h5 className="comment-author">
                                {comment.username}
                              </h5>
                              <span className="comment-location">India</span>

                              <div className="comment-meta mt-4 mt-lg-0 mt-md-0 float-lg-end float-md-end">
                                <span className="date-comm">
                                  Posted {comment.time}
                                </span>
                              </div>

                              <div className="comment-content mt-3">
                                <p>{comment.comment}</p>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No comments yet. Be the first to comment!</p>
                    )}
                  </div>
                </div>

                <div className="col-lg-12">
                  <form
                    className="contact-form bg-white rounded p-5"
                    id="comment-form"
                    onSubmit={handleSubmit}
                  >
                    <h4 className="form-title">Write a comment</h4>
                    <textarea
                      className="form-control mb-3"
                      name="comment"
                      id="comment"
                      cols="30"
                      rows="5"
                      value={comment}
                      placeholder="Comment"
                      onChange={(evt) => {
                        setComment(evt.target.value);
                      }}
                    ></textarea>

                    <input
                      className="btn btn-main rounded-pill"
                      type="submit"
                      name="submit-contact"
                      id="submit_contact"
                      value="Submit Message"
                    />
                  </form>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="sidebar-wrap">
                <div className="sidebar-widget card border-0 mb-3">
                  <img src="/img/author.jpg" alt="" className="img-fluid" />
                  <div className="card-body p-4 text-center">
                    <h5 className="author-name">{blog.author}</h5>
                    <p className="author-title">Blog Writer</p>

                    <ul className="list-inline author-socials">
                      <li className="list-inline-item mr-3">
                        <a href="#">
                          <i className="fab fa-facebook-f text-muted"></i>
                        </a>
                      </li>
                      <li className="list-inline-item mr-3">
                        <a href="#">
                          <i className="fab fa-twitter text-muted"></i>
                        </a>
                      </li>
                      <li className="list-inline-item mr-3">
                        <a href="#">
                          <i className="fab fa-linkedin-in text-muted"></i>
                        </a>
                      </li>
                      <li className="list-inline-item mr-3">
                        <a href="#">
                          <i className="fab fa-pinterest text-muted"></i>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="sidebar-widget bg-white rounded tags p-3 mb-3">
                  <h5 className="mb-4">Tags</h5>
                  <a href="#" className="tag-anchor">
                    Web
                  </a>
                  <a href="#" className="tag-anchor">
                    Agency
                  </a>
                  <a href="#" className="tag-anchor">
                    Company
                  </a>
                  <a href="#" className="tag-anchor">
                    Creative
                  </a>
                  <a href="#" className="tag-anchor">
                    Html
                  </a>
                  <a href="#" className="tag-anchor">
                    Marketing
                  </a>
                  <a href="#" className="tag-anchor">
                    Social Media
                  </a>
                  <a href="#" className="tag-anchor">
                    Branding
                  </a>
                </div>

                <div className="sidebar-widget bg-white rounded p-3 mb-3">
                  <h5 className="mb-4">Popular Posts</h5>
                  {sideblogs.map((blog) => (
                    <div key={blog.title} className="card border-0 mb-3">
                      <div className="media row no-gutters">
                        <div className="col-md-4">
                          <img src={blog.image} className="img-fluid" alt="" />
                        </div>
                        <div className="media-body col-md-8">
                          <div className="card-body">
                            <h5 className="card-title">
                              <a href={"/blog/" + username + "/" + blog.title}>
                                {blog.title}
                              </a>
                            </h5>
                            <span className="text-muted">{blog.pub_date}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPage;

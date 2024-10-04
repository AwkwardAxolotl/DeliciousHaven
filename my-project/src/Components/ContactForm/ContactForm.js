import React, { useState } from "react";

export default function ContactForm() {
  const [contactState, setContactState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [contactMessage, setContactMessage] = useState(null);
  const [contactMessageType, setContactMessageType] = useState("");

  const handleContactChange = (evt) => {
    const value = evt.target.value;
    setContactState({
      ...contactState,
      [evt.target.name]: value,
    });
  };

  const handleContactDismiss = () => {
    setContactMessage(null);
    setContactMessageType("");
  };

  const handleContactSubmit = async (evt) => {
    evt.preventDefault();
    const res = await fetch("https://delhavback.onrender.com//sendContactEmail/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contactState),
    });

    const data = await res.json();
    if (data.success === false) {
      setContactMessage(data.error || "Failed to send. Please try again.");
      setContactMessageType("error");
    } else {
      setContactMessage("Email sent successfully!");
      setContactMessageType("success");
    }
    setContactState({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="contact-area section-padding-0-80 mx-5">
      <div>
        <div className="row">
          <div className="col-12">
            <div className="section-heading">
              <h3>Contact Us</h3>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="contact-form-area">
              <form method="post" onSubmit={handleContactSubmit}>
                <div className="row">
                  <div className="col-12 col-lg-6">
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      placeholder="Name"
                      value={contactState.name}
                      onChange={handleContactChange}
                    />
                  </div>
                  <div className="col-12 col-lg-6">
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      placeholder="E-mail"
                      value={contactState.email}
                      onChange={handleContactChange}
                    />
                  </div>
                  <div className="col-12">
                    <input
                      type="text"
                      className="form-control"
                      name="subject"
                      placeholder="Subject"
                      value={contactState.subject}
                      onChange={handleContactChange}
                    />
                  </div>
                  <div className="col-12">
                    <textarea
                      name="message"
                      className="form-control"
                      cols="30"
                      rows="10"
                      placeholder="Message"
                      value={contactState.message}
                      onChange={handleContactChange}
                    ></textarea>
                  </div>
                  <div className="col-12 text-center">
                    <button className="btn delicious-btn mt-30" type="submit">
                      Send
                    </button>
                  </div>
                </div>
              </form>
              {contactMessage && (
                <div className={`alert ${contactMessageType}`}>
                  <h3>{contactMessage}</h3>
                  <button
                    onClick={handleContactDismiss}
                    className="close-button"
                  >
                    &times;
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

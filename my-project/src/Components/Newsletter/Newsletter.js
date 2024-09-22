import React, { useState } from "react";

export default function Newsletter() {
  const [newsletterState, setNewsletterState] = useState({ email: "" });
  const [newsletterMessage, setNewsletterMessage] = useState(null);
  const [newsletterMessageType, setNewsletterMessageType] = useState("");

  const handleNewsletterDismiss = () => {
    setNewsletterMessage(null);
    setNewsletterMessageType("");
  };

  const handleNewsletterChange = (evt) => {
    const value = evt.target.value;
    setNewsletterState({
      ...newsletterState,
      [evt.target.name]: value,
    });
  };

  const handleNewsletterSubmit = async (evt) => {
    evt.preventDefault();
    const res = await fetch("http://localhost:8000/SendNewsletter/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newsletterState),
    });

    const data = await res.json();
    if (data.success === false) {
      setNewsletterMessage(data.error || "Failed to send. Please try again.");
      setNewsletterMessageType("error");
    } else {
      setNewsletterMessage("Subscription email sent successfully!");
      setNewsletterMessageType("success");
    }
    setNewsletterState({ email: "" });
  };

  return (
    <div
      className="newsletter-form bg-img bg-overlay"
      style={{ backgroundImage: "url(/img/bg1.jpg)" }}
    >
      <form method="post" onSubmit={handleNewsletterSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Subscribe to newsletter"
          value={newsletterState.email}
          onChange={handleNewsletterChange}
        />
        <button type="submit" className="btn delicious-btn w-100">
          Subscribe
        </button>
      </form>
      <p>
        Join our newsletter to get the latest recipes, cooking tips, and special
        offers directly in your inbox. We promise to make it worth your while!
      </p>
      {newsletterMessage && (
        <div className={`alert ${newsletterMessageType}`}>
          <h3>{newsletterMessage}</h3>
          <button onClick={handleNewsletterDismiss} className="close-button">
            &times;
          </button>
        </div>
      )}
    </div>
  );
}

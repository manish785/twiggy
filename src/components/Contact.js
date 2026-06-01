import { useState } from "react";
import toast from "react-hot-toast";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", message: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.message) {
      toast.error("Please fill all fields");
      return;
    }
    toast.success("Message sent! We'll get back to you soon.");
    setFormData({ name: "", message: "" });
  };

  return (
    <div className="page-shell bg-dark-gradient">
      <div className="page-container py-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="card-surface !border-ink-800/50 !bg-ink-900/80 p-8 text-white backdrop-blur sm:p-10">
            <h1 className="font-display text-3xl font-bold sm:text-4xl">Contact us</h1>
            <p className="mt-3 text-ink-400">
              Have a question? We&apos;d love to hear from you. Send a message and our team
              will respond within 24 hours.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                className="input-field !border-ink-700 !bg-ink-800/50 !text-white"
              />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your message"
                rows={5}
                className="input-field !border-ink-700 !bg-ink-800/50 !text-white resize-none"
              />
              <button type="submit" className="btn-primary w-full">
                Send message
              </button>
            </form>
          </div>

          <div className="flex flex-col justify-center space-y-8 p-4 text-white sm:p-8">
            <div>
              <h2 className="font-display text-xl font-bold text-brand-400">Get in touch</h2>
              <p className="mt-4 flex items-center gap-3 text-ink-300">
                <span className="text-2xl">📧</span>
                9073078357manish@gmail.com
              </p>
              <p className="mt-3 flex items-center gap-3 text-ink-300">
                <span className="text-2xl">📞</span>
                +91 8910611562
              </p>
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-brand-400">Visit us</h2>
              <p className="mt-3 text-ink-300">Kamtaul, Darbhanga, Bihar</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

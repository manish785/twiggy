import { useState, useEffect } from "react";
import Shimmer from "./Shimmer";

const About = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("https://api.github.com/users/manish785");
        if (!res.ok) throw new Error("Failed to fetch profile");
        setUserInfo(await res.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <Shimmer />;

  if (error) {
    return (
      <div className="page-shell flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <section className="bg-hero-gradient border-b border-ink-100 py-12">
        <div className="page-container text-center">
          <h1 className="section-title">About FoodHeaven</h1>
          <p className="section-subtitle mx-auto max-w-2xl">
            A full-stack food delivery platform built with React, Node.js, Express, and
            MySQL — designed for learning and production-ready patterns.
          </p>
        </div>
      </section>

      <div className="page-container py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="card-surface p-8 text-center lg:col-span-1">
            <img
              className="mx-auto h-36 w-36 rounded-full object-cover ring-4 ring-brand-100"
              src={userInfo?.avatar_url}
              alt="Profile"
            />
            <h2 className="mt-4 font-display text-xl font-bold text-ink-900">
              {userInfo?.name || "Developer"}
            </h2>
            <p className="text-ink-500">{userInfo?.location || "India"}</p>
            <p className="mt-2 text-sm font-medium text-brand-600">
              Backend-focused software engineer
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <a
                href="https://github.com/manish785"
                target="_blank"
                rel="noreferrer"
                className="btn-secondary text-sm"
              >
                GitHub →
              </a>
              <a
                href="https://leetcode.com/9073078357manish/"
                target="_blank"
                rel="noreferrer"
                className="btn-secondary text-sm"
              >
                LeetCode →
              </a>
            </div>
          </div>

          <div className="card-surface p-8 lg:col-span-2">
            <h3 className="font-display text-lg font-bold text-brand-600">Tech stack</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {["React", "Redux", "Node.js", "Express", "MySQL", "Auth0", "REST APIs"].map(
                (tech) => (
                  <span
                    key={tech}
                    className="rounded-full bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700"
                  >
                    {tech}
                  </span>
                )
              )}
            </div>

            <h3 className="mt-8 font-display text-lg font-bold text-ink-900">Bio</h3>
            <p className="mt-2 leading-relaxed text-ink-600">
              Passionate about building scalable backend systems, clean APIs, and
              user-friendly interfaces. This project demonstrates end-to-end order flow
              with database persistence.
            </p>

            <h3 className="mt-8 font-display text-lg font-bold text-ink-900">Goals</h3>
            <p className="mt-2 leading-relaxed text-ink-600">
              Grow as a backend engineer at product companies and startups, with strong
              fundamentals in system design and distributed systems.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="container-page flex min-h-[60vh] flex-col items-center justify-center text-center">
    <p className="font-display text-6xl font-semibold text-ink">404</p>
    <p className="mt-3 text-sm text-ink-soft">This page doesn't exist.</p>
    <Link to="/" className="btn-primary mt-6">Back home</Link>
  </div>
);

export default NotFound;

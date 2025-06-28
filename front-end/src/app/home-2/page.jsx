/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* File: src/app/home-2/page.jsx */
'use client';
import React, { useState } from "react";
import Wrapper from "@/layout/wrapper";
import HeaderTwo from '@/layout/headers/header-2';
import FashionBanner from '@/components/banner/fashion-banner';
import FashionCategory from '@/components/categories/fashion-category';
import PopularProducts from '@/components/products/fashion/popular-products';
import ProductArea from '@/components/products/fashion/product-area';
import WeeksFeatured from '@/components/products/fashion/weeks-featured';
/* import TrendingProducts from '@/components/products/fashion/trending-products';
 */
import BestSellerProducts from '@/components/products/fashion/best-seller-products';
import FashionTestimonial from '@/components/testimonial/fashion-testimonial';
import BlogArea from '@/components/blog/fashion/blog-area';
import FeatureAreaTwo from '@/components/features/feature-area-2';
/* import InstagramAreaTwo from '@/components/instagram/instagram-area-2'; */
import Footer from '@/layout/footers/footer';
import { FiMessageCircle } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

export default function HomePageTwo() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name: '', phone: '', help: '', email: '', location: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleNext = (e) => { e.preventDefault(); setStep(prev => prev + 1); };
  const handleClose = () => { setOpen(false); setStep(0); setForm({ name: '', phone: '', help: '', email: '', location: '' }); };
  const handleSkipEmail = (e) => {
    e.preventDefault();
    setForm({ ...form, email: '' });
    setStep(step + 1);
  };

  return (
    <Wrapper>
      <HeaderTwo />
      <FashionBanner />
      <FashionCategory />
      <PopularProducts />
      <ProductArea />
      <WeeksFeatured />
      {/* <TrendingProducts /> */}
      {/* <BestSellerProducts /> */}
      <FashionTestimonial />
      <BlogArea />
      <FeatureAreaTwo />
     {/*  <InstagramAreaTwo /> */}

      {/* WhatsApp Floating Button (left side) */}
      <a
        href="https://wa.me/919999999999"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float-btn"
        aria-label="Chat on WhatsApp"
      >
        <FaWhatsapp size={28} />
      </a>

      {/* Floating Chat Button */}
      {!open && (
        <button className="message-float-btn" onClick={() => setOpen(true)} aria-label="Contact Us">
          <FiMessageCircle size={28} />
        </button>
      )}

      {/* Chat Modal */}
      {open && (
        <div className="custom-chat-modal-bg" onClick={handleClose}>
          <div className="custom-chat-modal" onClick={e => e.stopPropagation()}>
            <button className="custom-chat-close" onClick={handleClose}>&times;</button>

            <div className="custom-chat-content">
              {[
                { step: 0, title: 'Welcome to Amrita Global Enterprise!', desc: 'May I know your name?', name: 'name', type: 'text', placeholder: 'Enter your full name' },
                { step: 1, title: form.name ? `Thanks, ${form.name}!` : 'Thanks!', desc: 'Could you share your phone number?', name: 'phone', type: 'tel', placeholder: 'e.g. +91 98765 43210' },
                { step: 2, title: 'How can we assist you today?', desc: 'Type your query or select an option below.', name: 'help', type: 'text', placeholder: 'Your requirement or question' },
              ].map(q => step === q.step && (
                <form key={q.step} onSubmit={handleNext} className="chat-form">
                  <div className="chat-question">
                    <h4>{q.title}</h4>
                    <p>{q.desc}</p>
                    <input
                      name={q.name}
                      type={q.type}
                      value={form[q.name]}
                      onChange={handleChange}
                      placeholder={q.placeholder}
                      required
                      autoFocus={q.step === 0}
                    />
                  </div>
                  <button type="submit" className="custom-chat-next">Next →</button>
                </form>
              ))}
              {/* Email step with skip button */}
              {step === 3 && (
                <form onSubmit={handleNext} className="chat-form">
                  <div className="chat-question">
                    <h4>May I have your email?</h4>
                    <p>So we can send you updates.</p>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                    />
                  </div>
                  <div className="custom-chat-btn-row">
                    <button type="submit" className="custom-chat-next">Next →</button>
                    <button className="custom-chat-skip" onClick={handleSkipEmail} type="button">Skip</button>
                  </div>
                </form>
              )}
              {step === 4 && (
                <div className="chat-question final-step">
                  <h4>Almost done!</h4>
                  <p>We&apos;re dedicated to providing you with the best fabrics.</p>
                  <button className="custom-chat-next" onClick={() => setStep(5)}>Next →</button>
                </div>
              )}
              {step === 5 && (
                <form onSubmit={handleNext} className="chat-form">
                  <div className="chat-question">
                    <h4>Lastly, your location?</h4>
                    <p>It helps us tailor regional pricing.</p>
                    <input
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      placeholder="City, Country"
                      required
                    />
                  </div>
                  <button type="submit" className="custom-chat-next">Finish ✔︎</button>
                </form>
              )}
              {step === 6 && (
                <div className="chat-question final-step">
                  <h4>Thank you, {form.name}!</h4>
                  <p>Our team will reach out soon to assist you.</p>
                  <button className="custom-chat-next" onClick={handleClose}>Close</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        /* WhatsApp Floating Button */
        .whatsapp-float-btn {
          position: fixed;
          top: 90vh;
          left: 20px;
          transform: none;
          z-index: 10000;
          width: 48px;
          height: 48px;
          background: #25d366;
          border: 2px solid #fff;
          border-radius: 50%;
          box-shadow: 0 4px 16px rgba(0,0,0,0.18);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 1.2rem;
          transition: transform 0.3s, box-shadow 0.3s, background 0.2s;
          cursor: pointer;
        }
        .whatsapp-float-btn:hover {
          transform: scale(1.12);
          box-shadow: 0 8px 24px rgba(37,211,102,0.25);
          background: #1ebe57;
        }
        /* Floating Chat Button */
        .message-float-btn {
          position: fixed;
          top: 50%;
          right: 20px;
          transform: translateY(-50%);
          z-index: 10000;
          width: 48px;
          height: 48px;
          background: #821f40;
          border: 2px solid #facc15;
          border-radius: 50%;
          box-shadow: 0 4px 16px rgba(0,0,0,0.18);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 1.2rem;
          transition: transform 0.3s, box-shadow 0.3s;
          cursor: pointer;
        }
        .message-float-btn:hover {
          transform: translateY(-50%) scale(1.12);
          box-shadow: 0 8px 24px rgba(0,0,0,0.25);
        }
        /* Chat Modal Backdrop */
        .custom-chat-modal-bg {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.6);
          display: flex;
          justify-content: flex-end;
          align-items: center;
          z-index: 9999;
          animation: fadeIn 0.3s ease;
        }
        /* Chat Modal Container */
        .custom-chat-modal {
          width: 300px;
          max-width: 95vw;
          background: #fff;
          border-radius: 16px 0 0 16px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.15);
          padding: 18px 10px 10px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          position: relative;
          animation: slideIn 0.4s cubic-bezier(0.25,0.8,0.25,1);
        }
        /* Chat Modal Close Button */
        .custom-chat-close {
          position: absolute;
          top: 13px;
          right: 16px;
          font-size: 1.2rem;
          color: #999;
          background: none;
          border: none;
          border-radius: 50%;
          width: 26px;
          height: 26px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: color 0.2s, box-shadow 0.2s;
        }
        /* Chat Content */
        .custom-chat-content {
          background: #f9f9f9;
          border-radius: 8px;
          padding: 10px;
          max-height: 70vh;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        /* Chat Question Card */
        .chat-question {
          background: #fff;
          border-left: 4px solid #821f40;
          padding: 12px;
          border-radius: 5px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          animation: fadeInUp 0.3s ease both;
        }
        .chat-question.final-step { text-align: center; }
        .chat-question h4 {
          margin: 0 0 6px;
          color: #821f40;
          font-size: 1.08rem;
          font-weight: 700;
        }
        .chat-question p {
          margin: 0 0 8px;
          color: #1e1e1e;
          font-size: 0.97rem;
          opacity: 0.9;
        }
        /* Chat Inputs */
        .chat-question input {
          width: 100%;
          padding: 7px 10px;
          font-size: 0.97rem;
          border: 1px solid #dddddd;
          border-radius: 4px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .chat-question input:focus {
          border-color: #821f40;
          box-shadow: 0 0 0 2px rgba(130,31,64,0.13);
          outline: none;
        }
        /* Next & Skip Buttons */
        .custom-chat-next {
          align-self: flex-end;
          padding: 7px 14px;
          background: #821f40;
          border: none;
          border-radius: 4px;
          color: #fff;
          font-size: 0.93rem;
          font-weight: 600;
          box-shadow: 0 4px 12px rgba(0,0,0,0.09);
          cursor: pointer;
          transition: background 0.2s, transform 0.2s;
        }
        .custom-chat-next:hover {
          background: #b14a71;
          transform: translateY(-2px);
        }
        .custom-chat-skip {
          align-self: flex-end;
          background: #e5e7eb;
          color: #334155;
          border: none;
          border-radius: 4px;
          padding: 7px 14px;
          font-size: 0.93rem;
          margin-left: 8px;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0,0,0,0.07);
          transition: background 0.2s, color 0.2s;
        }
        .custom-chat-skip:hover {
          background: #facc15;
          color: #1e293b;
        }
        .custom-chat-btn-row {
          display: flex;
          justify-content: flex-end;
          gap: 0.5rem;
          margin-top: 8px;
        }
        /* Scrollbar for chat content */
        .custom-chat-content::-webkit-scrollbar { width: 6px; }
        .custom-chat-content::-webkit-scrollbar-thumb {
          background: #821f40;
          border-radius: 3px;
        }
        /* Animations */
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(100%) scale(0.9); } to { opacity: 1; transform: translateX(0) scale(1); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <Footer style_2={true} />
    </Wrapper>
  );
}

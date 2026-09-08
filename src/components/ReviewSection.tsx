import React, { useState } from 'react';
import { CustomerReview } from '../types';
import { addReview } from '../utils/storage';
import { 
  Star, 
  CheckCircle2, 
  MessageSquare, 
  PlusCircle, 
  X, 
  Send,
  Sparkles
} from 'lucide-react';

interface ReviewSectionProps {
  reviews: CustomerReview[];
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({ reviews }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [productPurchased, setProductPurchased] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;

    const newReview: CustomerReview = {
      id: `rev-${Date.now()}`,
      customerName: name.trim(),
      productPurchased: productPurchased.trim() || 'Digital Service',
      rating,
      comment: comment.trim(),
      date: 'Today',
      verified: true,
    };

    addReview(newReview);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setIsModalOpen(false);
      setName('');
      setProductPurchased('');
      setComment('');
      setRating(5);
    }, 1500);
  };

  return (
    <section id="reviews-section" className="py-12 border-t border-slate-200 bg-white relative font-['Outfit',sans-serif]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Customer Feedback</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Trusted by 10,000+ Happy Customers
            </h2>
            <p className="text-sm font-medium text-slate-500 mt-1">
              Real reviews from verified digital product buyers.
            </p>
          </div>

          <button
            id="write-review-btn"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 text-sm font-black shadow-sm transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4 text-emerald-600" />
            <span>Write a Review</span>
          </button>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Rating stars */}
                <div className="flex items-center gap-1 text-amber-500 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-500 text-amber-500' : 'text-slate-200'}`}
                    />
                  ))}
                  <span className="text-[10px] font-black text-slate-400 ml-2">
                    {rev.rating}.0
                  </span>
                </div>

                {/* Comment */}
                <p className="text-sm text-slate-600 font-medium italic leading-relaxed line-clamp-4">
                  "{rev.comment}"
                </p>
              </div>

              {/* Customer footer */}
              <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black text-slate-900 flex items-center gap-1">
                    {rev.customerName}
                    {rev.verified && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    )}
                  </h4>
                  <span className="text-[10px] font-bold text-emerald-600 block truncate max-w-[140px] mt-0.5 uppercase tracking-tighter">
                    {rev.productPurchased}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-slate-400">{rev.date}</span>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Review Submission Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl p-8 animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2 tracking-tight">
                <MessageSquare className="w-5 h-5 text-emerald-600" />
                <span>Submit Your Review</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitted ? (
              <div className="py-10 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-2 shadow-inner border border-emerald-200">
                   <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>
                <h4 className="text-xl font-black text-slate-900 tracking-tight">Thank You!</h4>
                <p className="text-sm font-bold text-slate-500">Your review has been successfully posted.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                
                {/* Rating selection */}
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">
                    Select Rating:
                  </label>
                  <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="p-1 transition-all active:scale-125"
                      >
                        <Star
                          className={`w-7 h-7 ${star <= rating ? 'fill-amber-500 text-amber-500' : 'text-slate-300'}`}
                        />
                      </button>
                    ))}
                    <span className="text-sm font-black text-amber-600 ml-auto mr-2">
                      {rating} Star
                    </span>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">
                    Your Name:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-sm text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:border-emerald-500 shadow-sm"
                  />
                </div>

                {/* Product Name */}
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">
                    Purchased Item:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Virtual Visa Card or NordVPN"
                    value={productPurchased}
                    onChange={(e) => setProductPurchased(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-sm text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:border-emerald-500 shadow-sm"
                  />
                </div>

                {/* Comment */}
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">
                    Share Your Experience:
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Tell us what you think about our service..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-sm text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-emerald-500 resize-none shadow-sm leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  id="submit-review-btn"
                  className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/20 transition-all active:scale-[0.98] cursor-pointer"
                >
                  <Send className="w-5 h-5" />
                  <span>Post Review</span>
                </button>

              </form>
            )}

          </div>
        </div>
      )}
    </section>
  );
};

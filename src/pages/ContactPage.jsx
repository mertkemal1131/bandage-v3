import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) { toast.error('Please fill required fields'); return; }
    toast.success("Message sent! We'll get back to you soon.");
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  const inputCls = "border border-[#E8E8E8] rounded-[5px] py-[14px] px-4 text-[14px] font-['Montserrat'] outline-none text-[#252B42] bg-white w-full box-border focus:border-[#23A6F0] transition-colors";

  return (
    <div className="font-['Montserrat'] bg-white">

      {/* Breadcrumb */}
      <div className="bg-[#FAFAFA] py-10 text-center border-b border-[#E8E8E8]">
        <h1 className="font-bold text-[24px] text-[#252B42] mb-2">Contact Us</h1>
        <div className="flex justify-center gap-2 font-bold text-[14px] text-[#737373]">
          <Link to="/" className="text-[#252B42] no-underline">Home</Link>
          <span className="text-[#BDBDBD]">›</span>
          <span>Contact</span>
        </div>
      </div>

      {/* Header */}
      <div className="text-center pt-16 pb-10 px-6 max-w-[600px] mx-auto">
        <h2 className="font-bold text-[40px] text-[#252B42] leading-[50px] mb-4">Get in touch today!</h2>
        <p className="font-normal text-[14px] text-[#737373] leading-6">
          We know how large objects will act, but things on a small scale just do not act that way.
          Problems trying to resolve the conflict between the two major realms.
        </p>
      </div>

      {/* Contact info */}
      <div className="flex flex-wrap justify-center gap-6 max-w-[1050px] mx-auto px-6 pb-16">
        {[
          { Icon: Phone,  title: 'Phone',   lines: ['+1 800 555 0118', '+1 800 555 0199'] },
          { Icon: Mail,   title: 'Email',   lines: ['hello@bandage.com', 'support@bandage.com'] },
          { Icon: MapPin, title: 'Address', lines: ['1234 Fashion Ave', 'New York, NY 10001'] },
        ].map(({ Icon, title, lines }) => (
          <div key={title} className="flex flex-col items-center text-center py-10 px-6 border border-[#E8E8E8] rounded-[5px] bg-[#FAFAFA] flex-1 min-w-[220px]">
            <div className="w-14 h-14 rounded-full bg-[rgba(35,166,240,0.1)] flex items-center justify-center mx-auto mb-4">
              <Icon size={22} color="#23A6F0" />
            </div>
            <h4 className="font-bold text-[16px] text-[#252B42] mb-3">{title}</h4>
            {lines.map(l => <p key={l} className="font-normal text-[14px] text-[#737373] mb-1">{l}</p>)}
          </div>
        ))}
      </div>

      {/* Form */}
      <div className="bg-[#FAFAFA] py-16">
        <div className="max-w-[680px] mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="font-bold text-[40px] text-[#252B42] mb-3">Send us a message</h2>
            <p className="font-normal text-[14px] text-[#737373]">
              Problems trying to resolve the conflict between the two major realms of Classical physics.
            </p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex-1 min-w-[200px]">
                <label className="block font-bold text-[13px] text-[#252B42] mb-1.5">Name *</label>
                <input
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Your name"
                  className={inputCls}
                />
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="block font-bold text-[13px] text-[#252B42] mb-1.5">Email *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="your@email.com"
                  className={inputCls}
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block font-bold text-[13px] text-[#252B42] mb-1.5">Subject</label>
              <input
                value={form.subject}
                onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                placeholder="How can we help?"
                className={inputCls}
              />
            </div>
            <div className="mb-6">
              <label className="block font-bold text-[13px] text-[#252B42] mb-1.5">Message *</label>
              <textarea
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                placeholder="Tell us about your inquiry..."
                rows={6}
                className={`${inputCls} resize-y leading-relaxed`}
              />
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="bg-[#23A6F0] text-white border-none rounded-[5px] py-4 px-[60px] font-['Montserrat'] font-bold text-[16px] cursor-pointer"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>

    </div>
  );
}

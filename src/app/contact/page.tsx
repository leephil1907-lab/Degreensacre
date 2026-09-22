'use client';

import { useState } from 'react';
import ScrollReveal from '@/components/ScrollReveal';
import { MapPin, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setSubmitted(true);
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    
    setTimeout(() => setSubmitted(false), 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-ivory">
      {/* Hero */}
      <section className="bg-gradient-to-br from-charcoal to-forest text-white py-20">
        <div className="container-custom">
          <div className="max-w-3xl">
            <p className="text-xs font-bold text-sage uppercase tracking-[0.2em] mb-4">GET IN TOUCH</p>
            <h1 className="font-display text-5xl md:text-6xl mb-6">Contact Us</h1>
            <p className="text-xl text-white/80 leading-relaxed">
              Get in touch with our team. We&apos;re here to help you with all your property needs across Nigeria.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info Cards */}
            <div className="lg:col-span-1 space-y-6">
              {/* Lagos Office */}
              <ScrollReveal direction="left" delay={0}>
                <div className="bg-white rounded-xl shadow-soft p-6 hover-lift">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-magenta/10 rounded-full flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-magenta" />
                    </div>
                    <h3 className="text-xl font-bold text-charcoal">Lagos Office</h3>
                  </div>
                  <p className="text-gray-600 mb-2">
                    5 Borogade Crescent,<br />
                    Off Okengbero Street,<br />
                    New Oko-Oba, Lagos State
                  </p>
                </div>
              </ScrollReveal>

              {/* Abuja Office */}
              <ScrollReveal direction="left" delay={0.1}>
                <div className="bg-white rounded-xl shadow-soft p-6 hover-lift">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-plum/10 rounded-full flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-plum" />
                    </div>
                    <h3 className="text-xl font-bold text-charcoal">Abuja Office</h3>
                  </div>
                  <p className="text-gray-600 mb-2">
                    Maitama District,<br />
                    Abuja FCT
                  </p>
                </div>
              </ScrollReveal>

              {/* Akwa Ibom Office */}
              <ScrollReveal direction="left" delay={0.2}>
                <div className="bg-white rounded-xl shadow-soft p-6 hover-lift">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-charcoal/10 rounded-full flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-charcoal" />
                    </div>
                    <h3 className="text-xl font-bold text-charcoal">Akwa Ibom Office</h3>
                  </div>
                  <p className="text-gray-600 mb-2">
                    Ifa Ikot Ubo,<br />
                    Uyo Local Government Area,<br />
                    Akwa Ibom State
                  </p>
                </div>
              </ScrollReveal>

              {/* Southeast Office */}
              <ScrollReveal direction="left" delay={0.3}>
                <div className="bg-white rounded-xl shadow-soft p-6 hover-lift">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-magenta/10 rounded-full flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-magenta" />
                    </div>
                    <h3 className="text-xl font-bold text-charcoal">Southeast Office</h3>
                  </div>
                  <p className="text-gray-600 mb-2">
                    Independence Layout,<br />
                    Enugu, Enugu State
                  </p>
                  <p className="text-sm text-gray-500">
                    Serving: Enugu, Anambra, Imo, Abia, Ebonyi
                  </p>
                </div>
              </ScrollReveal>

              {/* Coastal Highway — Payment Details (From Flyer) */}
              <ScrollReveal direction="left" delay={0.35}>
                <div className="bg-gradient-to-br from-forest to-forest-dark text-white rounded-xl shadow-soft p-6 border border-sage/20">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center text-charcoal font-extrabold text-xs">₦</div>
                    <h3 className="text-lg font-bold">Payment Details</h3>
                    <span className="ml-auto text-[11px] font-bold tracking-widest uppercase bg-amber-500 text-charcoal px-2.5 py-1 rounded-full">COASTAL HIGHWAY — UYO</span>
                  </div>
                  <p className="text-amber-300 text-xs font-bold tracking-widest uppercase mb-1">TODAY’S PRICE WILL NOT BE TOMORROW’S PRICE</p>
                  <p className="font-display text-2xl mb-1">SPREAD: ₦2,500,000</p>
                  <p className="text-white/70 text-xs mb-4">(Documentation plus all inclusive — 464 sqm) · Limited supply</p>
                  <div className="bg-white text-charcoal rounded-xl p-4">
                    <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1">Pay Into</p>
                    <p className="font-extrabold text-forest">WEMA BANK</p>
                    <p className="text-sm">Name: <b>De-Greenacres Properties Limited</b></p>
                    <p className="text-sm font-mono">Account Number: <b className="text-forest">0126877218</b></p>
                  </div>
                  <a href="https://wa.me/2347041754800?text=Hello%20De-Greenacres%2C%20I%20saw%20the%20Coastal%20Highway%20flyer%20(%E2%82%A62.5M%20spread)%20and%20want%20payment%20confirmation." target="_blank" rel="noopener noreferrer" className="mt-4 flex items-center justify-center gap-2 bg-amber-500 text-charcoal px-4 py-3 rounded-xl font-bold hover:bg-amber-400 transition-all text-sm">
                    Confirm Payment on WhatsApp
                  </a>
                  <p className="text-[11px] text-white/60 mt-3 text-center">Premium Plots · New Coastal Highway To Calabar — Uyo · RC: 1856064</p>
                </div>
              </ScrollReveal>

              {/* Quick Contact — Icons Only, No Exposed Details */}
              <ScrollReveal direction="left" delay={0.4}>
              <div className="bg-white rounded-xl shadow-soft p-6">
                <h3 className="text-xl font-bold text-charcoal mb-4">Get in Touch</h3>
                <p className="text-gray-600 text-sm mb-6">Choose your preferred way to reach us:</p>
                <div className="grid grid-cols-2 gap-4">
                  {/* WhatsApp — icon only, no number exposed */}
                  <a
                    href="https://wa.me/2347041754800?text=Hello%20De-Greenacres%2C%20I%20would%20like%20to%20enquire%20about%20your%20properties."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-2 p-6 bg-green-50 hover:bg-green-100 border-2 border-green-200 hover:border-green-400 rounded-xl transition-all group"
                  >
                    <svg className="w-10 h-10 text-green-600 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    <span className="text-sm font-semibold text-green-700">WhatsApp</span>
                    <span className="text-xs text-green-600">Chat with us</span>
                  </a>

                  {/* Email — icon only, no address exposed */}
                  <a
                    href="mailto:de_greenacrespropertiesltd@yahoo.com?subject=Enquiry%20from%20De-Greenacres%20Website"
                    className="flex flex-col items-center gap-2 p-6 bg-magenta/5 hover:bg-magenta/10 border-2 border-magenta/20 hover:border-magenta/40 rounded-xl transition-all group"
                  >
                    <svg className="w-10 h-10 text-magenta group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm font-semibold text-magenta">Email Us</span>
                    <span className="text-xs text-magenta/70">Send a message</span>
                  </a>
                </div>
                <p className="text-xs text-gray-500 mt-4 text-center">
                  Our team typically responds within 24 hours
                </p>
              </div>
              </ScrollReveal>

              {/* WhatsApp CTA */}
              <ScrollReveal direction="left" delay={0.5}>
              <a
                href="https://wa.me/2347041754800"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-magenta hover:bg-magenta-dark text-white rounded-xl shadow-medium p-6 transition-all hover-lift"
              >
                <div className="flex items-center space-x-3">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  <div>
                    <div className="font-bold text-lg">Chat on WhatsApp</div>
                    <div className="text-white/90 text-sm">Fastest way to reach us</div>
                  </div>
                </div>
              </a>
              </ScrollReveal>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <ScrollReveal direction="right">
              <div className="bg-white rounded-xl shadow-soft p-8">
                <h2 className="font-display text-2xl text-charcoal mb-6">Send Us a Message</h2>
                
                {submitted && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                    <p className="text-green-800 font-medium">Thank you! Your message has been sent successfully.</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-charcoal mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="input-field"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-charcoal mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="input-field"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold text-charcoal mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="+234 800 000 0000"
                      />
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-semibold text-charcoal mb-2">
                        Subject *
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="input-field"
                      >
                        <option value="">Select a subject</option>
                        <option value="Property Inquiry">Property Inquiry</option>
                        <option value="Sell My Property">Sell My Property</option>
                        <option value="Investment Advice">Investment Advice</option>
                        <option value="Viewing Request">Viewing Request</option>
                        <option value="General Question">General Question</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-charcoal mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="input-field"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center space-x-2">
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Sending...</span>
                      </span>
                    ) : (
                      'Send Message'
                    )}
                  </button>
                </form>
              </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import { useState } from 'react';
import Link from 'next/link';
import {
  BriefcaseIcon,
  HeartIcon,
  UserGroupIcon,
  TrophyIcon,
  SparklesIcon,
  GlobeAltIcon,
  AcademicCapIcon,
  CurrencyPoundIcon
} from '@heroicons/react/24/outline';

export default function Careers() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    resume: '',
    coverLetter: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          subject: `Career Application - ${formData.position}`,
          type: 'career',
          message: `Position: ${formData.position}\nExperience: ${formData.experience}\nCover Letter: ${formData.coverLetter}`
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitMessage({
          type: 'success',
          text: 'Thank you for your application! We\'ll review it and get back to you soon.',
        });
        setFormData({
          name: '',
          email: '',
          phone: '',
          position: '',
          experience: '',
          resume: '',
          coverLetter: ''
        });
      } else {
        setSubmitMessage({
          type: 'error',
          text: data.error || 'Failed to submit application. Please try again.',
        });
      }
    } catch (error) {
      setSubmitMessage({
        type: 'error',
        text: 'An error occurred. Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const benefits = [
    {
      icon: CurrencyPoundIcon,
      title: 'Competitive Salary',
      description: 'Industry-leading compensation packages with performance bonuses'
    },
    {
      icon: HeartIcon,
      title: 'Health & Wellness',
      description: 'Comprehensive health insurance and wellness programs'
    },
    {
      icon: GlobeAltIcon,
      title: 'Remote Work',
      description: 'Flexible remote work options for better work-life balance'
    },
    {
      icon: AcademicCapIcon,
      title: 'Learning & Development',
      description: 'Continuous learning opportunities and career development programs'
    },
    {
      icon: SparklesIcon,
      title: 'Product Discounts',
      description: 'Generous employee discounts on all GirlSecret products'
    },
    {
      icon: TrophyIcon,
      title: 'Growth Opportunities',
      description: 'Clear career progression paths and promotion opportunities'
    }
  ];

  const openPositions = [
    {
      title: 'E-commerce Manager',
      department: 'Marketing',
      location: 'Remote (UK)',
      type: 'Full-time'
    },
    {
      title: 'Customer Service Representative',
      department: 'Support',
      location: 'London or Remote',
      type: 'Full-time'
    },
    {
      title: 'Social Media Specialist',
      department: 'Marketing',
      location: 'Remote',
      type: 'Full-time'
    },
    {
      title: 'Product Designer',
      department: 'Design',
      location: 'Hybrid (London)',
      type: 'Full-time'
    },
    {
      title: 'Warehouse Associate',
      department: 'Operations',
      location: 'London',
      type: 'Part-time/Full-time'
    },
    {
      title: 'Content Creator',
      department: 'Marketing',
      location: 'Remote',
      type: 'Contract'
    }
  ];

  const values = [
    {
      icon: HeartIcon,
      title: 'Customer First',
      description: 'We put our customers at the heart of everything we do'
    },
    {
      icon: UserGroupIcon,
      title: 'Teamwork',
      description: 'We believe in collaboration and supporting each other'
    },
    {
      icon: SparklesIcon,
      title: 'Innovation',
      description: 'We continuously seek new ways to improve and grow'
    },
    {
      icon: TrophyIcon,
      title: 'Excellence',
      description: 'We strive for the highest quality in all our work'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-900 via-pink-800 to-black text-white py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <BriefcaseIcon className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6">
              Join Our Team
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
              Help us empower women everywhere with quality intimate apparel at affordable prices
            </p>
            <a
              href="#openings"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-black font-bold rounded-lg hover:bg-gray-100 transition-colors text-lg"
            >
              View Open Positions
            </a>
          </div>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              Why Work at GirlSecret?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join a growing company that values its people and makes a real difference
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-shadow">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
                  <benefit.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These are the principles that guide us every day
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
                <value.icon className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section id="openings" className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              Open Positions
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find your next opportunity with GirlSecret
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {openPositions.map((position, index) => (
              <div key={index} className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-purple-600 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {position.title}
                    </h3>
                    <p className="text-gray-600">{position.department}</p>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                    {position.type}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <GlobeAltIcon className="w-4 h-4 mr-1" />
                  {position.location}
                </div>
                <a
                  href="#apply"
                  className="inline-flex items-center text-purple-600 font-semibold hover:text-purple-700"
                >
                  Apply Now →
                </a>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              Don&apos;t see the perfect role? We&apos;re always looking for talented individuals!
            </p>
            <a
              href="#apply"
              className="inline-flex items-center text-purple-600 font-semibold hover:text-purple-700"
            >
              Submit a General Application →
            </a>
          </div>
        </div>
      </section>

      {/* Life at GirlSecret */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              Life at GirlSecret
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We&apos;re building more than just a company—we&apos;re building a community
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold mb-3">Inclusive Culture</h3>
              <p className="text-gray-600">
                We celebrate diversity and create an environment where everyone feels valued and respected.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold mb-3">Fast-Paced Growth</h3>
              <p className="text-gray-600">
                Join a rapidly growing company with endless opportunities for personal and professional development.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold mb-3">Make an Impact</h3>
              <p className="text-gray-600">
                Your work directly contributes to empowering women and making quality products accessible to all.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="apply" className="py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              Apply Now
            </h2>
            <p className="text-lg text-gray-600">
              Take the first step towards joining our team
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="Your phone number"
                />
              </div>

              <div>
                <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2">
                  Position Applying For *
                </label>
                <select
                  id="position"
                  name="position"
                  required
                  value={formData.position}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                >
                  <option value="">Select a position</option>
                  {openPositions.map((pos, index) => (
                    <option key={index} value={pos.title}>
                      {pos.title} - {pos.department}
                    </option>
                  ))}
                  <option value="general">General Application</option>
                </select>
              </div>

              <div>
                <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
                  Years of Relevant Experience *
                </label>
                <select
                  id="experience"
                  name="experience"
                  required
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                >
                  <option value="">Select experience level</option>
                  <option value="0-1">0-1 years</option>
                  <option value="1-3">1-3 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="5-10">5-10 years</option>
                  <option value="10+">10+ years</option>
                </select>
              </div>

              <div>
                <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-2">
                  Resume/CV Link (Google Drive, Dropbox, etc.) *
                </label>
                <input
                  type="url"
                  id="resume"
                  name="resume"
                  required
                  value={formData.resume}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-2">
                  Why do you want to work at GirlSecret? *
                </label>
                <textarea
                  id="coverLetter"
                  name="coverLetter"
                  required
                  rows={6}
                  value={formData.coverLetter}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="Tell us about yourself and why you'd be a great fit for our team..."
                />
              </div>

              {submitMessage.text && (
                <div
                  className={`p-4 rounded-lg ${
                    submitMessage.type === 'success'
                      ? 'bg-green-50 text-green-800'
                      : 'bg-red-50 text-red-800'
                  }`}
                >
                  {submitMessage.text}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-8 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-purple-900 via-pink-800 to-black text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Questions About Working Here?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Want to learn more about career opportunities at GirlSecret? Get in touch with our HR team.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Contact HR
          </Link>
        </div>
      </section>
    </div>
  );
}

export async function getStaticProps() {
  return {
    props: {
      seo: {
        title: 'Careers - Join the GirlSecret Team',
        description: 'Explore career opportunities at GirlSecret. Join our growing team and help empower women with quality, affordable intimate apparel. View open positions and apply today.',
        keywords: 'careers, jobs, employment, work at girlsecret, job opportunities, hiring, join our team',
        path: '/careers',
      },
    },
  };
}

import React from 'react';
import { ContactFormData, FormErrors, ContactFormProps } from '~/constants/contact';
import { Captcha } from '~/components/ui/captcha';

export function ContactForm({ formData, errors, isSubmitting, captchaValid, onInputChange, onSubmit, onCaptchaChange }: ContactFormProps) {
  const typedFormData: ContactFormData = formData;
  const typedErrors: FormErrors = errors;
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden max-w-2xl mx-auto">
      <form onSubmit={onSubmit} className="p-4 sm:p-6 space-y-3 sm:space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              name="your-name"
              placeholder="Enter your full name"
              value={typedFormData["your-name"]}
              onChange={onInputChange}
              onKeyPress={(e) => {
                const allowedChars = /[a-zA-ZÀ-ỹ\s'-]/;
                if (!allowedChars.test(e.key)) {
                  e.preventDefault();
                }
              }}
              className={`w-full px-3 py-2 sm:py-2.5 border-2 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base ${
                typedErrors["your-name"] 
                  ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" 
                  : "border-gray-300 dark:border-gray-600"
              }`}
            />
            {typedErrors["your-name"] && (
              <p className="text-red-500 text-xs mt-1 flex items-start sm:items-center">
                <svg className="w-3 h-3 mr-1 flex-shrink-0 mt-0.5 sm:mt-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="break-words leading-relaxed">{typedErrors["your-name"]}</span>
              </p>
            )}
          </div>
          
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="your-number"
              placeholder="+84 123 456 789"
              value={typedFormData["your-number"]}
              onChange={onInputChange}
              onKeyPress={(e) => {
                const allowedChars = /[0-9+\-()\s]/;
                if (!allowedChars.test(e.key)) {
                  e.preventDefault();
                }
              }}
              className="w-full px-3 py-2 sm:py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base"
            />
          </div>
          
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="your-email"
              placeholder="your.email@example.com"
              value={typedFormData["your-email"]}
              onChange={onInputChange}
              className="w-full px-3 py-2 sm:py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base"
            />
          </div>
          
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Event Location
            </label>
            <select
              name="event-location"
              value={typedFormData["event-location"]}
              onChange={onInputChange}
              aria-label="Event Location"
              className="w-full px-3 py-2 sm:py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base"
            >
              <option value="">Select Event Location</option>
              <option value="Ha Noi">Ha Noi</option>
              <option value="HCM">HCM</option>
              <option value="Da Nang">Da Nang</option>
            </select>
          </div>
          
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Wallet Address
            </label>
            <input
              type="text"
              name="address-wallet"
              placeholder="addr1qy..."
              value={typedFormData["address-wallet"]}
              onChange={onInputChange}
              className="w-full px-3 py-2 sm:py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base"
            />
          </div>
          
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email Introduction
            </label>
            <input
              type="text"
              name="email-intro"
              placeholder="How did you hear about us?"
              value={typedFormData["email-intro"]}
              onChange={onInputChange}
              className="w-full px-3 py-2 sm:py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base"
            />
          </div>
          
          {typedErrors.contact && (
            <div className="md:col-span-2">
              <p className="text-red-500 text-xs flex items-start sm:items-center">
                <svg className="w-3 h-3 mr-1 flex-shrink-0 mt-0.5 sm:mt-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="break-words leading-relaxed">{typedErrors.contact}</span>
              </p>
            </div>
          )}
          
          <div className="md:col-span-2">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              placeholder="Tell us about your inquiry..."
              value={typedFormData.message}
              onChange={onInputChange}
              rows={3}
              className="w-full px-3 py-2 sm:py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 resize-none text-sm sm:text-base"
            />
          </div>
          
          <div className="md:col-span-2">
            <Captcha onCaptchaChange={onCaptchaChange} />
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting || !captchaValid}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-success text-base sm:text-lg bg-blue-600 dark:bg-white px-4 sm:px-6 py-2.5 sm:py-3 font-semibold text-white dark:text-blue-900 shadow-lg hover:bg-blue-700 dark:hover:bg-gray-100 w-full"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white dark:text-blue-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Registering...
            </div>
          ) : (
            "Register"
          )}
        </button>
      </form>
    </div>
  );
} 
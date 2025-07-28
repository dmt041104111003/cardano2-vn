'use client';


interface ContactSubmitButtonProps {
  isSubmitting: boolean;
}

export default function ContactSubmitButton({ isSubmitting }: ContactSubmitButtonProps) {
  return (
    <div className="flex justify-center">
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center gap-2 rounded-sm border border-gray-300 dark:border-white/30 bg-blue-600 px-8 py-3 text-white transition-all duration-200 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Sending...</span>
          </>
        ) : (
          <>
          
            <span>Send Message</span>
          </>
        )}
      </button>
    </div>
  );
} 
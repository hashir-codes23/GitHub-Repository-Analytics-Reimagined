import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ArrowRight } from 'lucide-react';
import { parseRepoInput } from '../utils/format';

// Repository search box used on the hero and the compare page.
export default function SearchBar({ size = 'default', placeholder = 'Enter GitHub URL or owner/repository', onSearch, autoFocus = false }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    const parsed = parseRepoInput(value);
    if (!parsed) {
      setError('Enter a valid repository, e.g. facebook/react or https://github.com/facebook/react');
      return;
    }
    setError('');
    if (onSearch) onSearch(parsed);
    else navigate(`/analytics/${parsed.owner}/${parsed.repo}`);
  };

  const big = size === 'hero';

  return (
    <form onSubmit={submit} className="w-full" noValidate>
      <motion.div
        animate={error ? { x: [0, -10, 10, -6, 6, 0] } : { x: 0 }}
        transition={{ duration: 0.4 }}
        className={`group flex items-center gap-2 rounded-2xl border bg-white/90 p-2 shadow-card backdrop-blur transition-all focus-within:border-brand-500 focus-within:shadow-glow dark:bg-night-card/90 ${
          error ? 'border-red-300' : 'border-brand-200 dark:border-stone-700'
        }`}
      >
        <Search className={`ml-2 shrink-0 text-brand-600 ${big ? 'h-5 w-5' : 'h-4 w-4'}`} aria-hidden="true" />
        <input
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError('');
          }}
          placeholder={placeholder}
          autoFocus={autoFocus}
          aria-label="GitHub repository"
          aria-invalid={!!error}
          className={`w-full bg-transparent text-ink outline-none placeholder:text-ink-mute dark:text-stone-100 ${big ? 'py-3 text-base' : 'py-1.5 text-sm'}`}
        />
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          className={`btn-primary shrink-0 ${big ? '!rounded-xl !px-6 !py-3 !text-base' : '!px-4 !py-2'}`}
        >
          Analyze <ArrowRight className={big ? 'h-5 w-5' : 'h-4 w-4'} />
        </motion.button>
      </motion.div>
      {error && (
        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-2 text-sm font-medium text-red-600 dark:text-red-400" role="alert">
          {error}
        </motion.p>
      )}
    </form>
  );
}

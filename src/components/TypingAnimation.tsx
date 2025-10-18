import { useEffect, useState } from 'react';

const phrases = [
  "It's Completely Copyright free enjoy!!!",
  "Enjoy unlimited Generations!!!",
  "Transform your idea into Reality!!!",
];

const TypingAnimation = () => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);
  const [blink, setBlink] = useState(true);

  // Handle typing effect
  useEffect(() => {
    if (index >= phrases.length) return;

    if (subIndex === phrases[index].length + 1 && !reverse) {
      setTimeout(() => setReverse(true), 1500);
      return;
    }

    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % phrases.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, reverse ? 60 : 100);

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse]);

  // Handle cursor blink
  useEffect(() => {
    const blinkTimeout = setInterval(() => {
      setBlink((prev) => !prev);
    }, 800);
    return () => clearInterval(blinkTimeout);
  }, []);

  return (
    <h2 className="text-xl md:text-2xl text-center mt-2 tracking-wide font-medium min-h-[2rem]">
      <span 
        className="inline-block text-transparent bg-clip-text"
        style={{
          backgroundImage: 'linear-gradient(90deg, #ffd700, #ffb800, #ff9500, #ff6b00)',
          backgroundSize: '200% 200%',
          textShadow: '0 0 20px rgba(255, 215, 0, 0.6), 0 0 30px rgba(255, 184, 0, 0.4), 0 0 40px rgba(255, 149, 0, 0.3)'
        }}
      >
        {phrases[index].substring(0, subIndex)}
        <span 
          className={`inline-block w-0.5 h-5 md:h-6 ml-1 align-middle transition-opacity duration-100 ${blink ? 'opacity-100' : 'opacity-0'}`}
          style={{ 
            backgroundColor: '#2fd4ff',
            boxShadow: '0 0 10px rgba(47, 212, 255, 0.8)'
          }}
        />
      </span>
    </h2>
  );
};

export default TypingAnimation;

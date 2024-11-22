"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const ShuffleHero = () => {
  return (
    <section className="w-full px-8 py-12 grid grid-cols-1 md:grid-cols-2 items-center gap-8 max-w-6xl mx-auto">
      <div>
        <span className="block mb-4 text-xs md:text-sm text-indigo-500 font-medium">
          Better every day
        </span>
        <h3 className="text-2xl md:text-5xl font-semibold">
          Simplify and Accelerate Product Lifecycle Management
        </h3>
        <p className="text-base md:text-lg text-slate-700 my-4 md:my-6">
          Discover a new way to manage your PLM projects with an intuitive and
          innovative tool. Access consolidated data, collaborate in real-time,
          and make informed decisions with our comprehensive solution tailored
          to your needs.
        </p>
        <button className="bg-indigo-500 text-white font-medium py-2 px-4 rounded transition-all hover:bg-indigo-600 active:scale-95">
          Get Started Now
        </button>
      </div>
      <ShuffleGrid />
    </section>
  );
};

const shuffle = (array: (typeof squareData)[0][]) => {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

const squareData = [
  {
    id: 1,
    src: "/fleur1.jpg",
    width: 200,
    height: 200,
  },
  {
    id: 2,
    src: "/fleur2.jpeg",
    width: 200,
    height: 200,
  },
  {
    id: 3,
    src: "/industrie1.jpeg",
    width: 200,
    height: 200,
  },
  {
    id: 4,
    src: "/parfum1.jpeg",
    width: 200,
    height: 200,
  },
  {
    id: 5,
    src: "/plm1.jpeg",
    width: 200,
    height: 200,
  },
  {
    id: 6,
    src: "/reu2.jpeg",
    width: 200,
    height: 200,
  },
  {
    id: 7,
    src: "/fleur3.jpeg",
    width: 200,
    height: 200,
  },
  {
    id: 8,
    src: "/parfum5.jpeg",
    width: 200,
    height: 200,
  },
  {
    id: 9,
    src: "/fleur4.jpeg",
    width: 200,
    height: 200,
  },
  {
    id: 10,
    src: "/parfum4.jpeg",
    width: 200,
    height: 200,
  },
  {
    id: 11,
    src: "/industrie2.jpeg",
    width: 200,
    height: 200,
  },
  {
    id: 12,
    src: "/parfum3.jpeg",
    width: 200,
    height: 200,
  },
  {
    id: 13,
    src: "/fleur5.jpeg",
    width: 200,
    height: 200,
  },
  {
    id: 14,
    src: "/parfum2.jpeg",
    width: 200,
    height: 200,
  },
  {
    id: 15,
    src: "/fleur6.jpeg",
    width: 200,
    height: 200,
  },
  {
    id: 16,
    src: "/reu1.jpeg",
    width: 200,
    height: 200,
  },
];

const generateSquares = () => {
  return shuffle(squareData).map((sq) => (
    <motion.div
      key={sq.id}
      layout
      transition={{ duration: 1.5, type: "spring" }}
      className="w-full h-full relative"
    >
      <Image
        src={sq.src}
        alt=""
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        style={{ objectFit: "cover" }}
        quality={75}
      />
    </motion.div>
  ));
};

const ShuffleGrid = () => {
  const timeoutRef = useRef<any>(null);
  const [squares, setSquares] = useState(generateSquares());

  useEffect(() => {
    shuffleSquares();

    return () => clearTimeout(timeoutRef.current);
  }, []);

  const shuffleSquares = () => {
    setSquares(generateSquares());

    timeoutRef.current = setTimeout(shuffleSquares, 3000);
  };

  return (
    <div className="grid grid-cols-4 grid-rows-4 h-[450px] gap-1">
      {squares.map((sq) => sq)}
    </div>
  );
};

export default ShuffleHero;

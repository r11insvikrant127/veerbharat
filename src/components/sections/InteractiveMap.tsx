// src/components/sections/InteractiveMap.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  X,
  Compass,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Sword,
  Crown,
  Castle,
  GraduationCap,
  Church,
  BookOpen,
} from "lucide-react";

import {
  mapLocations as staticMapLocations,
  mapEras,
} from "@/data/locations";

import { MapLocation } from "@/types/map";
import { PlacesApiResponse } from "@/types/place";

import {
  placesToMapLocations,
} from "@/utils/placeMapAdapter";

// Icon mapping for location types
const iconMap = {
  fort: Castle,
  battle: Sword,
  temple: Church,
  capital: Crown,
  university: GraduationCap,
  port: MapPin,
};

// Function to get icon for location
const getLocationIcon = (type: string) => {
  return (
    iconMap[type as keyof typeof iconMap] ||
    MapPin
  );
};

export function InteractiveMap() {
  // API locations
  const [apiLocations, setApiLocations] =
    useState<MapLocation[]>([]);

  const [isLoadingPlaces, setIsLoadingPlaces] =
    useState(true);

  // Existing map state
  const [selectedLocation, setSelectedLocation] =
    useState<MapLocation | null>(null);

  const [hoveredLocation, setHoveredLocation] =
    useState<string | null>(null);

  const [currentEraIndex, setCurrentEraIndex] =
    useState(0);

  const [isAutoPlaying, setIsAutoPlaying] =
    useState(false);

  const [visibleLocations, setVisibleLocations] =
    useState<string[]>([]);

  const [revealedLocations, setRevealedLocations] =
    useState<string[]>([]);

  const [compassRotation, setCompassRotation] =
    useState(0);

  const [fogOpacity, setFogOpacity] =
    useState(0.3);

  const mapRef =
    useRef<HTMLDivElement>(null);

  const autoPlayRef =
    useRef<NodeJS.Timeout | null>(null);

  /*
    Combine:

    1. Existing static historical locations
    2. Real locations fetched from MongoDB
  */
  const allMapLocations = [
    ...staticMapLocations,
    ...apiLocations,
  ];

  /*
    Fetch published places from backend
  */
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await fetch(
          "/api/places?status=Published&limit=100"
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch places"
          );
        }

        const result: PlacesApiResponse =
          await response.json();

        const convertedLocations =
          placesToMapLocations(result.data);

        setApiLocations(convertedLocations);
      } catch (error) {
        console.error(
          "Failed to load map places:",
          error
        );

        setApiLocations([]);
      } finally {
        setIsLoadingPlaces(false);
      }
    };

    fetchPlaces();
  }, []);

  /*
    Auto-rotate compass
  */
  useEffect(() => {
    const interval = setInterval(() => {
      setCompassRotation(
        (prev) => (prev + 0.5) % 360
      );
    }, 100);

    return () => clearInterval(interval);
  }, []);

  /*
    Auto-play eras
  */
  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(() => {
        setCurrentEraIndex(
          (prev) =>
            (prev + 1) %
            mapEras.length
        );
      }, 4000);
    } else {
      if (autoPlayRef.current) {
        clearInterval(
          autoPlayRef.current
        );
      }
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(
          autoPlayRef.current
        );
      }
    };
  }, [isAutoPlaying]);

  /*
    Update visible locations
    based on selected era
  */
  useEffect(() => {
    const era =
      mapEras[currentEraIndex];

    const filtered =
      allMapLocations
        .filter(
          (loc) =>
            loc.era === era.id
        )
        .map(
          (loc) => loc.id
        );

    setVisibleLocations([]);

    let index = 0;

    const interval = setInterval(() => {
      if (index < filtered.length) {
        setVisibleLocations(
          (prev) => [
            ...prev,
            filtered[index],
          ]
        );

        index++;
      } else {
        clearInterval(interval);
      }
    }, 150);

    return () =>
      clearInterval(interval);
  }, [
    currentEraIndex,
    apiLocations,
  ]);

  /*
    Reset fog when era changes
  */
  useEffect(() => {
    setFogOpacity(0.3);

    const timer = setTimeout(() => {
      setFogOpacity(0);
    }, 1000);

    return () =>
      clearTimeout(timer);
  }, [currentEraIndex]);

  /*
    Location click
  */
  const handleLocationClick = (
    location: MapLocation
  ) => {
    setSelectedLocation(location);

    if (
      !revealedLocations.includes(
        location.id
      )
    ) {
      setRevealedLocations(
        (prev) => [
          ...prev,
          location.id,
        ]
      );
    }
  };

  /*
    Era change
  */
  const handleEraChange = (
    index: number
  ) => {
    setCurrentEraIndex(index);

    setVisibleLocations([]);
  };

  /*
    Toggle autoplay
  */
  const toggleAutoPlay = () => {
    setIsAutoPlaying(
      (prev) => !prev
    );
  };

  const currentEra =
    mapEras[currentEraIndex];

  return (
    <section className="py-20 bg-[#0F0F0F] relative overflow-hidden">
      {/* Background Texture */}

      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(
                circle at 20% 50%,
                rgba(212, 175, 55, 0.1) 0%,
                transparent 50%
              ),
              radial-gradient(
                circle at 80% 50%,
                rgba(212, 175, 55, 0.1) 0%,
                transparent 50%
              )
            `,
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.6,
          }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gold-gradient mb-4">
            The Living Map of Bharat
          </h2>

          <p className="text-[#D7C9A5] text-sm md:text-base">
            Travel across 5,000 years of Indian
            civilization. Watch kingdoms rise,
            heroes emerge, and history unfold.
          </p>
        </motion.div>

        {/* Map Container */}

        <div className="max-w-6xl mx-auto relative">
          <div className="relative bg-[#1C1410] rounded-2xl overflow-hidden border border-[#D4AF37]/10 shadow-2xl shadow-[#D4AF37]/5">

            {/* Parchment Texture Overlay */}

            <div
              className="absolute inset-0 pointer-events-none opacity-10"
              style={{
                backgroundImage:
                  `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />

            {/* Burned Edge Effect */}

            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-[#D4AF37]/5 to-transparent rounded-full blur-2xl" />

              <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-[#D4AF37]/5 to-transparent rounded-full blur-2xl" />

              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#D4AF37]/5 to-transparent rounded-full blur-xl" />

              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#D4AF37]/5 to-transparent rounded-full blur-xl" />
            </div>

            {/* Map Area */}

            <div
              ref={mapRef}
              className="relative w-full aspect-[4/3] bg-gradient-to-b from-[#1C1410] to-[#0F0F0F] overflow-hidden"
            >
              {/* Loading */}

              {isLoadingPlaces && (
                <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#0F0F0F]/60 backdrop-blur-sm">
                  <div className="text-[#D4AF37] text-sm font-serif">
                    Loading historical locations...
                  </div>
                </div>
              )}

              {/* Era Title */}

              <motion.div
                key={currentEraIndex}
                initial={{
                  opacity: 0,
                  y: -20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.5,
                }}
                className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-black/60 backdrop-blur-md px-6 py-2 rounded-full border border-[#D4AF37]/20"
              >
                <span className="text-sm md:text-base text-[#D4AF37] font-serif">
                  {currentEra.name} •{" "}
                  {currentEra.year}
                </span>
              </motion.div>

              {/* Compass */}

              <div className="absolute top-4 right-4 z-20">
                <motion.div
                  animate={{
                    rotate:
                      compassRotation,
                  }}
                  transition={{
                    duration: 0.1,
                    ease: "linear",
                  }}
                  className="relative w-12 h-12 md:w-16 md:h-16"
                >
                  <Compass className="w-full h-full text-[#D4AF37]/30" />

                  <div className="absolute top-0 left-1/2 -translate-x-1/2 text-[#D4AF37] font-bold text-xs">
                    N
                  </div>

                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[#D7C9A5]/30 text-xs">
                    S
                  </div>

                  <div className="absolute top-1/2 left-0 -translate-y-1/2 text-[#D7C9A5]/30 text-xs">
                    W
                  </div>

                  <div className="absolute top-1/2 right-0 -translate-y-1/2 text-[#D7C9A5]/30 text-xs">
                    E
                  </div>
                </motion.div>
              </div>

              {/* SVG Map */}

              <svg
                viewBox="0 0 1000 750"
                className="w-full h-full"
                style={{
                  background:
                    "transparent",
                }}
              >
                <defs>
                  <filter id="glow">
                    <feGaussianBlur
                      stdDeviation="4"
                      result="coloredBlur"
                    />

                    <feMerge>
                      <feMergeNode in="coloredBlur" />

                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>

                  <radialGradient
                    id="fogGrad"
                    cx="50%"
                    cy="50%"
                    r="70%"
                  >
                    <stop
                      offset="0%"
                      stopColor="#1C1410"
                      stopOpacity="0"
                    />

                    <stop
                      offset="100%"
                      stopColor="#0F0F0F"
                      stopOpacity="0.8"
                    />
                  </radialGradient>
                </defs>

                {/* Mountains */}

                <g opacity="0.2">
                  <path
                    d="M300,80 L350,40 L400,70 L450,30 L500,60 L550,80"
                    stroke="#D4AF37"
                    strokeWidth="2"
                    fill="none"
                  />

                  <path
                    d="M350,90 L370,60 L390,80 L410,50 L430,70 L450,90"
                    stroke="#D4AF37"
                    strokeWidth="1.5"
                    fill="none"
                  />

                  <path
                    d="M250,100 L280,70 L310,90 L340,60 L370,80"
                    stroke="#D4AF37"
                    strokeWidth="1.5"
                    fill="none"
                  />

                  <text
                    x="420"
                    y="55"
                    fill="#D4AF37"
                    opacity="0.3"
                    fontSize="16"
                    fontFamily="serif"
                    textAnchor="middle"
                  >
                    HIMALAYAS
                  </text>
                </g>

                {/* Rivers */}

                <g opacity="0.15">
                  <path
                    d="M400,100 Q420,180 410,280 Q390,380 420,480 Q440,540 430,620"
                    stroke="#D4AF37"
                    strokeWidth="2"
                    fill="none"
                  />

                  <path
                    d="M520,80 Q510,160 530,260 Q550,360 520,450 Q500,510 510,580"
                    stroke="#D4AF37"
                    strokeWidth="1.5"
                    fill="none"
                  />

                  <path
                    d="M300,120 Q310,200 290,300 Q270,400 300,500"
                    stroke="#D4AF37"
                    strokeWidth="1.5"
                    fill="none"
                  />
                </g>

                {/* Mauryan Empire */}

                <AnimatePresence>
                  {currentEra.id ===
                    "mauryan" && (
                    <motion.g
                      initial={{
                        opacity: 0,
                      }}
                      animate={{
                        opacity: 1,
                      }}
                      exit={{
                        opacity: 0,
                      }}
                    >
                      <polygon
                        points="150,200 350,150 550,200 650,300 700,450 600,550 500,600 350,550 250,450 150,350 100,250"
                        fill="rgba(212, 175, 55, 0.05)"
                        stroke="rgba(212, 175, 55, 0.3)"
                        strokeWidth="2"
                      />

                      <text
                        x="400"
                        y="380"
                        fill="#D4AF37"
                        opacity="0.4"
                        fontSize="20"
                        fontFamily="serif"
                        textAnchor="middle"
                      >
                        Mauryan Empire
                      </text>
                    </motion.g>
                  )}
                </AnimatePresence>

                {/* Maratha Empire */}

                <AnimatePresence>
                  {currentEra.id ===
                    "maratha" && (
                    <motion.g
                      initial={{
                        opacity: 0,
                      }}
                      animate={{
                        opacity: 1,
                      }}
                      exit={{
                        opacity: 0,
                      }}
                    >
                      <polygon
                        points="300,400 350,350 450,380 550,420 600,480 550,550 450,600 350,580 250,520 200,450"
                        fill="rgba(196, 106, 0, 0.05)"
                        stroke="rgba(196, 106, 0, 0.3)"
                        strokeWidth="2"
                      />

                      <text
                        x="400"
                        y="480"
                        fill="#C46A00"
                        opacity="0.4"
                        fontSize="20"
                        fontFamily="serif"
                        textAnchor="middle"
                      >
                        Maratha Empire
                      </text>
                    </motion.g>
                  )}
                </AnimatePresence>

                {/* Location Markers */}

                {allMapLocations.map(
                  (location) => {
                    const isVisible =
                      visibleLocations.includes(
                        location.id
                      );

                    const isHovered =
                      hoveredLocation ===
                      location.id;

                    const isSelected =
                      selectedLocation?.id ===
                      location.id;

                    const Icon =
                      getLocationIcon(
                        location.icon
                      );

                    return (
                      <g
                        key={location.id}
                        transform={`translate(${
                          location.x * 10
                        }, ${
                          location.y * 7.5
                        })`}
                        opacity={
                          isVisible ? 1 : 0
                        }
                        style={{
                          transition:
                            "opacity 0.5s ease",
                        }}
                      >
                        {isVisible && (
                          <motion.g
                            initial={{
                              scale: 0,
                              opacity: 0,
                            }}
                            animate={{
                              scale: 1,
                              opacity: 1,
                            }}
                            transition={{
                              duration: 0.5,
                              type: "spring",
                            }}
                            style={{
                              cursor:
                                "pointer",
                            }}
                          >
                            {/* Glow */}

                            <circle
                              cx="0"
                              cy="0"
                              r="30"
                              fill="#D4AF37"
                              opacity={
                                isHovered ||
                                isSelected
                                  ? 0.1
                                  : 0
                              }
                              className="transition-all duration-300"
                            />

                            <circle
                              cx="0"
                              cy="0"
                              r="50"
                              fill="#D4AF37"
                              opacity={
                                isHovered ||
                                isSelected
                                  ? 0.05
                                  : 0
                              }
                              className="transition-all duration-300"
                            />

                            {/* Marker */}

                            <circle
                              cx="0"
                              cy="0"
                              r="18"
                              fill={
                                isHovered ||
                                isSelected
                                  ? "#D4AF37"
                                  : "#2B221C"
                              }
                              stroke="#D4AF37"
                              strokeWidth={
                                isHovered ||
                                isSelected
                                  ? "3"
                                  : "1.5"
                              }
                              opacity={
                                isHovered ||
                                isSelected
                                  ? 1
                                  : 0.8
                              }
                              className="transition-all duration-300"
                              filter={
                                isHovered ||
                                isSelected
                                  ? "url(#glow)"
                                  : "none"
                              }
                            />

                            {/* Symbol */}

                            <text
                              x="0"
                              y="2"
                              textAnchor="middle"
                              dominantBaseline="central"
                              fontSize="16"
                              className="transition-all duration-300"
                            >
                              {location.symbol}
                            </text>

                            {/* Pulse */}

                            {(isHovered ||
                              isSelected) && (
                              <circle
                                cx="0"
                                cy="0"
                                r="25"
                                fill="none"
                                stroke="#D4AF37"
                                strokeWidth="1"
                                opacity="0.5"
                              >
                                <animate
                                  attributeName="r"
                                  from="18"
                                  to="30"
                                  dur="1.5s"
                                  repeatCount="indefinite"
                                />

                                <animate
                                  attributeName="opacity"
                                  from="0.6"
                                  to="0"
                                  dur="1.5s"
                                  repeatCount="indefinite"
                                />
                              </circle>
                            )}

                            {/* Location Name */}

                            <text
                              x="0"
                              y="-30"
                              textAnchor="middle"
                              className="text-[10px] md:text-xs font-serif"
                              fill={
                                isHovered ||
                                isSelected
                                  ? "#D4AF37"
                                  : "#D7C9A5"
                              }
                              opacity={
                                isHovered ||
                                isSelected
                                  ? 1
                                  : 0.6
                              }
                              style={{
                                transition:
                                  "all 0.3s",
                              }}
                            >
                              {location.name}
                            </text>

                            {/* Hindi Name */}

                            {location.nameHindi && (
                              <text
                                x="0"
                                y="-18"
                                textAnchor="middle"
                                className="text-[8px] md:text-[10px]"
                                fill="#A09682"
                                opacity={
                                  isHovered ||
                                  isSelected
                                    ? 0.6
                                    : 0.3
                                }
                                style={{
                                  transition:
                                    "all 0.3s",
                                }}
                              >
                                {
                                  location.nameHindi
                                }
                              </text>
                            )}

                            {/* Click Area */}

                            <circle
                              cx="0"
                              cy="0"
                              r="30"
                              fill="transparent"
                              onMouseEnter={() =>
                                setHoveredLocation(
                                  location.id
                                )
                              }
                              onMouseLeave={() =>
                                setHoveredLocation(
                                  null
                                )
                              }
                              onClick={() =>
                                handleLocationClick(
                                  location
                                )
                              }
                            />
                          </motion.g>
                        )}
                      </g>
                    );
                  }
                )}

                {/* Fog */}

                <rect
                  x="0"
                  y="0"
                  width="1000"
                  height="750"
                  fill="url(#fogGrad)"
                  opacity={fogOpacity}
                />
              </svg>

              {/* Gradients */}

              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#1C1410] to-transparent" />

              <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-[#1C1410] to-transparent" />
            </div>

            {/* Controls */}

            <div className="p-4 bg-[#1C1410] border-t border-[#D4AF37]/10">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">

                {/* Era Navigation */}

                <div className="flex items-center gap-3 w-full md:w-auto">
                  <button
                    onClick={() =>
                      handleEraChange(
                        Math.max(
                          0,
                          currentEraIndex - 1
                        )
                      )
                    }
                    className="p-2 bg-[#D4AF37]/10 rounded-lg hover:bg-[#D4AF37]/20 transition-colors border border-[#D4AF37]/20"
                    disabled={
                      currentEraIndex === 0
                    }
                  >
                    <ChevronLeft className="w-4 h-4 text-[#D4AF37]" />
                  </button>

                  <div className="flex-1 md:flex-none flex items-center gap-2 overflow-x-auto px-2 py-1">
                    {mapEras.map(
                      (era, index) => (
                        <button
                          key={era.id}
                          onClick={() =>
                            handleEraChange(
                              index
                            )
                          }
                          className={`px-3 py-1 rounded-full text-xs whitespace-nowrap transition-all duration-300 ${
                            currentEraIndex ===
                            index
                              ? "bg-[#D4AF37] text-[#0F0F0F]"
                              : "bg-[#D4AF37]/10 text-[#D7C9A5] hover:bg-[#D4AF37]/20"
                          }`}
                        >
                          {era.name}
                        </button>
                      )
                    )}
                  </div>

                  <button
                    onClick={() =>
                      handleEraChange(
                        Math.min(
                          mapEras.length - 1,
                          currentEraIndex + 1
                        )
                      )
                    }
                    className="p-2 bg-[#D4AF37]/10 rounded-lg hover:bg-[#D4AF37]/20 transition-colors border border-[#D4AF37]/20"
                    disabled={
                      currentEraIndex ===
                      mapEras.length - 1
                    }
                  >
                    <ChevronRight className="w-4 h-4 text-[#D4AF37]" />
                  </button>
                </div>

                {/* Auto Play */}

                <div className="flex items-center gap-3">
                  <button
                    onClick={
                      toggleAutoPlay
                    }
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      isAutoPlaying
                        ? "bg-[#D4AF37] text-[#0F0F0F]"
                        : "bg-[#D4AF37]/10 text-[#D7C9A5] border border-[#D4AF37]/20"
                    }`}
                  >
                    {isAutoPlaying ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}

                    {isAutoPlaying
                      ? "Pause"
                      : "Auto Play"}
                  </button>

                  <div className="flex items-center gap-1 text-xs text-[#A09682]">
                    <Clock className="w-4 h-4" />

                    <span>
                      {currentEra.year}
                    </span>
                  </div>
                </div>
              </div>

              {/* Era Description */}

              <motion.p
                key={currentEraIndex}
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="text-sm text-[#D7C9A5] text-center mt-3 max-w-2xl mx-auto"
              >
                {currentEra.description}
              </motion.p>

              {/* Location Count */}

              <div className="flex justify-center gap-4 mt-3 text-xs text-[#A09682]">
                <span>
                  🟢{" "}
                  {
                    visibleLocations.length
                  }{" "}
                  locations visible
                </span>

                <span>
                  🔵{" "}
                  {
                    revealedLocations.length
                  }{" "}
                  explored
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Location Modal */}

        <AnimatePresence>
          {selectedLocation && (
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-xl"
              onClick={() =>
                setSelectedLocation(null)
              }
            >
              <motion.div
                initial={{
                  scale: 0.9,
                  opacity: 0,
                  y: 20,
                  rotateY: 10,
                }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  y: 0,
                  rotateY: 0,
                }}
                exit={{
                  scale: 0.9,
                  opacity: 0,
                  y: 20,
                  rotateY: 10,
                }}
                transition={{
                  type: "spring",
                  damping: 25,
                }}
                className="relative max-w-2xl w-full mx-4 bg-[#1C1410] rounded-2xl border border-[#D4AF37]/20 overflow-hidden shadow-2xl shadow-[#D4AF37]/10"
                onClick={(e) =>
                  e.stopPropagation()
                }
              >
                {/* Gold Border */}

                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

                <div className="relative p-6 md:p-8">

                  {/* Close */}

                  <button
                    onClick={() =>
                      setSelectedLocation(
                        null
                      )
                    }
                    className="absolute top-4 right-4 p-2 hover:bg-[#D4AF37]/10 rounded-lg transition-colors z-10"
                  >
                    <X className="w-5 h-5 text-[#D7C9A5]" />
                  </button>

                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 bg-[#D4AF37]/20 rounded-xl flex items-center justify-center text-3xl border border-[#D4AF37]/20 flex-shrink-0">
                      {
                        selectedLocation.symbol
                      }
                    </div>

                    <div>
                      <h3 className="text-2xl md:text-3xl font-serif font-bold text-gold-gradient">
                        {
                          selectedLocation.name
                        }
                      </h3>

                      {selectedLocation.nameHindi && (
                        <p className="text-sm text-[#A09682]">
                          {
                            selectedLocation.nameHindi
                          }
                        </p>
                      )}

                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs px-2 py-0.5 bg-[#D4AF37]/10 text-[#D4AF37] rounded-full">
                          {
                            selectedLocation.era
                          }
                        </span>

                        <span className="text-xs px-2 py-0.5 bg-[#D4AF37]/10 text-[#D4AF37] rounded-full">
                          {
                            selectedLocation.icon
                          }
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-[#D4AF37]/10 pt-4 mt-2">
                    <p className="text-[#D7C9A5] leading-relaxed">
                      {
                        selectedLocation.description
                      }
                    </p>

                    <div className="mt-4 flex items-center gap-2 text-sm text-[#D4AF37]">
                      <Crown className="w-4 h-4" />

                      <span>
                        Associated with:{" "}
                        {
                          selectedLocation.hero
                        }
                      </span>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <button className="px-4 py-2 bg-[#D4AF37] text-[#0F0F0F] rounded-lg hover:bg-[#C46A00] transition-colors text-sm font-medium flex items-center gap-2">
                        <Sword className="w-4 h-4" />

                        Explore Heroes
                      </button>

                      <button className="px-4 py-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D7C9A5] rounded-lg hover:bg-[#D4AF37]/20 transition-colors text-sm flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />

                        Read More
                      </button>
                    </div>
                  </div>
                </div>

                {/* Bottom Border */}

                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
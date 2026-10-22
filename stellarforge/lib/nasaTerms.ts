export interface NasaTerm {
  term: string;
  definition: string;
  category: string;
}

export const nasaTerms: NasaTerm[] = [
  {
    term: "Delta-V",
    category: "Propulsion",
    definition:
      "Change in velocity required for a maneuver; total 'budget' of velocity change a spacecraft can achieve with its propellant.",
  },
  {
    term: "Orbital Mechanics",
    category: "Orbits",
    definition:
      "Study of motion of objects in space under gravitational influence; governs trajectories, orbits, and transfer windows.",
  },
  {
    term: "Radiation Shielding",
    category: "Environment",
    definition:
      "Materials and design used to protect crew and electronics from cosmic rays and solar particle events in space.",
  },
  {
    term: "Life Support Systems",
    category: "Systems",
    definition:
      "Systems that provide breathable air, water, temperature control, and waste management in closed environments (spacecraft, habitats).",
  },
  {
    term: "Lagrange Points",
    category: "Orbits",
    definition:
      "Stable points where gravitational forces of two large bodies (e.g. Earth and Moon) balance; L1–L5 enable fuel-efficient station-keeping.",
  },
  {
    term: "Escape Velocity",
    category: "Orbits",
    definition:
      "Minimum speed needed for an object to escape a body's gravitational pull without further propulsion.",
  },
  {
    term: "Cryogenic Propulsion",
    category: "Propulsion",
    definition:
      "Use of liquefied gases (e.g. liquid hydrogen, liquid oxygen) as rocket propellants; high performance but requires extreme cooling.",
  },
  {
    term: "Reaction Control System (RCS)",
    category: "Propulsion",
    definition:
      "Small thrusters used for attitude control, docking, and small maneuvers in space.",
  },
  {
    term: "Apoapsis / Periapsis",
    category: "Orbits",
    definition:
      "Farthest and closest points in an orbit around a body; perigee/apogee when orbiting Earth.",
  },
  {
    term: "Hohmann Transfer",
    category: "Orbits",
    definition:
      "Energy-efficient orbit transfer using two engine burns (elliptical transfer orbit) between two circular orbits.",
  },
  {
    term: "Thermal Control",
    category: "Systems",
    definition:
      "Managing spacecraft temperature via radiators, coatings, and heaters so systems stay within operating limits.",
  },
  {
    term: "Trajectory Correction Maneuver (TCM)",
    category: "Operations",
    definition:
      "Mid-flight burn to correct a spacecraft's path toward its target (e.g. planet or landing site).",
  },
  {
    term: "Sublimation",
    category: "Environment",
    definition:
      "Transition from solid to gas (e.g. ice to vapor); relevant for comets and some thermal/venting behavior in space.",
  },
  {
    term: "Redundant Systems",
    category: "Systems",
    definition:
      "Backup components or duplicate systems so mission can continue if one unit fails.",
  },
  {
    term: "Orbital Decay",
    category: "Orbits",
    definition:
      "Gradual lowering of orbit due to drag (e.g. thin atmosphere) or gravitational perturbations; leads to reentry if unchecked.",
  },
  {
    term: "Solar Flare",
    category: "Environment",
    definition:
      "Sudden release of magnetic energy from the Sun; can increase radiation risk and disrupt communications.",
  },
  {
    term: "Microgravity",
    category: "Environment",
    definition:
      "Condition of near-zero apparent gravity (free fall / orbit); affects fluids, biology, and operations.",
  },
  {
    term: "Payload",
    category: "Operations",
    definition:
      "Cargo or instruments carried by a launch vehicle or spacecraft; the mission-critical mass.",
  },
  {
    term: "Burn",
    category: "Propulsion",
    definition:
      "Firing of engines to change velocity or trajectory; duration and direction define the maneuver.",
  },
  {
    term: "Contact / Loss of Signal",
    category: "Operations",
    definition:
      "Times when a ground station has communication with the spacecraft (contact) or loses it (LOS) as the craft sets or passes behind a body.",
  },
];

export const termCategories = [
  "All",
  "Propulsion",
  "Orbits",
  "Environment",
  "Systems",
  "Operations",
] as const;

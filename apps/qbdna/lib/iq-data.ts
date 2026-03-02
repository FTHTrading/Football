/* ═══════════════════════════════════════════════════════════════
   IQ LAB — Question Bank
   The Field Intelligence Engine for Under Center
   ═══════════════════════════════════════════════════════════════ */

export type ModuleId =
  | "foundation"
  | "halo"
  | "fronts"
  | "coverage"
  | "space-counting";

export type QuestionType = "multiple_choice" | "true_false" | "ordering";
export type Difficulty = 1 | 2 | 3 | 4 | 5;

export interface IQQuestion {
  id: string;
  module: ModuleId;
  difficulty: Difficulty;
  type: QuestionType;
  question: string;
  context?: string; // optional scenario setup
  options: string[];
  correctIndex: number;
  explanation: string;
  timeLimit: number; // seconds
  xpValue: number;
  tags: string[];
}

export interface IQModule {
  id: ModuleId;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  icon: string; // lucide icon name
  questionCount: number;
  estimatedMinutes: number;
  prerequisites: ModuleId[];
  skills: string[];
}

/* ═══ MODULE DEFINITIONS ═══ */
export const IQ_MODULES: IQModule[] = [
  {
    id: "foundation",
    title: "Foundation",
    subtitle: "Field Geometry & Zones",
    description:
      "Master the dimensions, zones, and spatial awareness that form the foundation of quarterback intelligence. Hash marks, field zones, territory concepts, and geometric principles of the 100-yard battlefield.",
    color: "#00C2FF",
    icon: "Ruler",
    questionCount: 12,
    estimatedMinutes: 8,
    prerequisites: [],
    skills: [
      "Field Dimensions",
      "Zone Identification",
      "Hash Mark Awareness",
      "Territory Concepts",
    ],
  },
  {
    id: "halo",
    title: "H.A.L.O.",
    subtitle: "Hardeck Above Linebackers Observation",
    description:
      "Develop elite pre-snap reading skills. Identify tubes, bubbles, strength declarations, and linebacker alignment tendencies. The hardeck is the quarterback's first read — before the snap ever happens.",
    color: "#A855F7",
    icon: "Eye",
    questionCount: 12,
    estimatedMinutes: 10,
    prerequisites: ["foundation"],
    skills: [
      "Tube Identification",
      "Bubble Recognition",
      "Strength Declaration",
      "LB Alignment Reads",
    ],
  },
  {
    id: "fronts",
    title: "Fronts",
    subtitle: "Defensive Front Recognition",
    description:
      "Instantly identify defensive fronts and understand their implications. From 4-3 Over to Bear, Nickel to Tite — decode personnel, gap assignments, and technique alignments at a glance.",
    color: "#FACC15",
    icon: "Shield",
    questionCount: 12,
    estimatedMinutes: 10,
    prerequisites: ["foundation"],
    skills: [
      "Front Identification",
      "Gap Assignment",
      "Technique Recognition",
      "Personnel Packages",
    ],
  },
  {
    id: "coverage",
    title: "Coverage",
    subtitle: "Coverage Family Recognition",
    description:
      "Read shells, identify coverage families, and decode man vs zone indicators before the snap. Cover 0 through Cover 6, rotations, disguises, and the pre-snap tells that separate elite QBs from the rest.",
    color: "#00FF88",
    icon: "Scan",
    questionCount: 14,
    estimatedMinutes: 12,
    prerequisites: ["halo", "fronts"],
    skills: [
      "Shell Reads",
      "Coverage Families",
      "Man vs Zone Tells",
      "Rotation Recognition",
    ],
  },
  {
    id: "space-counting",
    title: "Space Counting",
    subtitle: "Numbers & Void Detection",
    description:
      "The elite-level cognitive skill. Count defenders in the box, identify numbers advantages, find void spaces, and determine run/pass strength — all in under 3 seconds. This is how NFL quarterbacks see the field.",
    color: "#FF6B35",
    icon: "Calculator",
    questionCount: 12,
    estimatedMinutes: 12,
    prerequisites: ["coverage"],
    skills: [
      "Box Count",
      "Numbers Advantage",
      "Void Detection",
      "Safety Identification",
    ],
  },
];

/* ═══ QUESTION BANK ═══ */

const foundationQuestions: IQQuestion[] = [
  {
    id: "f-001",
    module: "foundation",
    difficulty: 1,
    type: "multiple_choice",
    question: "What is the total width of a regulation football field, including both sidelines?",
    options: ["50 yards", "53⅓ yards", "55 yards", "60 yards"],
    correctIndex: 1,
    explanation:
      "A regulation football field is 53⅓ yards (160 feet) wide. This dimension is critical for understanding spacing, route depth, and coverage leverage.",
    timeLimit: 15,
    xpValue: 10,
    tags: ["dimensions", "basics"],
  },
  {
    id: "f-002",
    module: "foundation",
    difficulty: 1,
    type: "multiple_choice",
    question: "How far apart are the college hash marks from the center of the field?",
    options: ["18 feet 6 inches", "20 feet", "40 feet", "Each hash is on the 40-yard line"],
    correctIndex: 2,
    explanation:
      "College hash marks are 40 feet from the center of the field (60 feet apart total). This creates wider field/boundary differences that quarterbacks must account for in their pre-snap analysis.",
    timeLimit: 20,
    xpValue: 10,
    tags: ["hash marks", "college"],
  },
  {
    id: "f-003",
    module: "foundation",
    difficulty: 2,
    type: "multiple_choice",
    question: "In the NFL, the hash marks are 18 feet 6 inches from the center. How does this affect QB decision-making compared to college?",
    options: [
      "No effect — the field plays the same",
      "The field and boundary sides become nearly equal, reducing sideline leverage advantages",
      "It makes the boundary side significantly wider",
      "It only matters for kickers, not quarterbacks",
    ],
    correctIndex: 1,
    explanation:
      "NFL hash marks are much closer to center (18'6\") vs college (40'), making the field and boundary sides nearly symmetrical. This reduces the extreme field/boundary splits seen in college and changes how defenses align, giving QBs a more balanced read.",
    timeLimit: 20,
    xpValue: 15,
    tags: ["hash marks", "NFL vs college", "spacing"],
  },
  {
    id: "f-004",
    module: "foundation",
    difficulty: 1,
    type: "multiple_choice",
    question: "What is the 'Red Zone'?",
    options: [
      "The area inside the opponent's 40-yard line",
      "The area inside the opponent's 20-yard line",
      "The area inside the opponent's 10-yard line",
      "The area between the 20-yard lines",
    ],
    correctIndex: 1,
    explanation:
      "The Red Zone is the area inside the opponent's 20-yard line. It's critical because the condensed field changes route trees, coverage leverage, and play-calling strategy. Elite QBs convert in the Red Zone at 60%+ TD rates.",
    timeLimit: 15,
    xpValue: 10,
    tags: ["zones", "red zone"],
  },
  {
    id: "f-005",
    module: "foundation",
    difficulty: 2,
    type: "multiple_choice",
    question: "Why does the field 'shrink' for the offense as they approach the goal line?",
    options: [
      "Referees move the ball closer to the center",
      "The end zone acts as an extra defender — the defense has less field to cover behind them",
      "Defensive backs play tighter because of the crowd noise",
      "The hash marks get wider near the goal line",
    ],
    correctIndex: 1,
    explanation:
      "As the offense approaches the goal line, the end zone removes the deep portion of the field. The defense no longer needs to worry about deep routes, allowing them to compress coverage and play aggressively underneath. This is why red zone offense requires different concepts.",
    timeLimit: 20,
    xpValue: 15,
    tags: ["zones", "red zone", "spatial awareness"],
  },
  {
    id: "f-006",
    module: "foundation",
    difficulty: 2,
    type: "multiple_choice",
    question: "When the ball is on the left hash, which side of the field is the 'field' side and which is the 'boundary' side?",
    options: [
      "Field = left, Boundary = right",
      "Field = right (wide side), Boundary = left (short side)",
      "It depends on the down and distance",
      "Field and boundary don't change based on hash placement",
    ],
    correctIndex: 1,
    explanation:
      "The 'field' side is always the wide side — the side with more space between the ball and the sideline. When the ball is on the left hash, the field (wide side) is to the right and the boundary (short side) is to the left. QBs read coverages differently based on field/boundary.",
    timeLimit: 20,
    xpValue: 15,
    tags: ["field/boundary", "hash marks", "spatial awareness"],
  },
  {
    id: "f-007",
    module: "foundation",
    difficulty: 3,
    type: "multiple_choice",
    question: "A quarterback takes a 5-step drop from the left hash at the 35-yard line. Approximately how far must a 'go' route travel along the boundary sideline to reach the end zone?",
    options: [
      "35 yards",
      "40-42 yards (angled from the hash to the boundary pylon)",
      "65 yards",
      "53 yards",
    ],
    correctIndex: 1,
    explanation:
      "The receiver runs roughly 35 yards downfield but must also angle from the hash to the boundary sideline. The actual distance traveled along the hypotenuse is approximately 40-42 yards. This matters for arm strength evaluation — it's not just about depth, it's about the actual throw distance.",
    timeLimit: 25,
    xpValue: 20,
    tags: ["geometry", "throw distance", "route calculation"],
  },
  {
    id: "f-008",
    module: "foundation",
    difficulty: 3,
    type: "multiple_choice",
    question: "What is the 'green zone' in field territory concepts?",
    options: [
      "The area between the 20-yard lines (midfield territory)",
      "The area between your own 20 and the opponent's 40 — aggressive play-calling territory",
      "The opponent's end zone",
      "Any area where you have a numbers advantage",
    ],
    correctIndex: 1,
    explanation:
      "The 'green zone' represents the middle 40 yards of the field (between the 20s and into opponent territory to the 40). This is where offenses can be most aggressive with route concepts and play-calling, as they have both vertical and horizontal field to work with.",
    timeLimit: 20,
    xpValue: 20,
    tags: ["zones", "territory", "play-calling"],
  },
  {
    id: "f-009",
    module: "foundation",
    difficulty: 2,
    type: "true_false",
    question: "True or False: In high school football, the hash marks are wider than college hash marks, giving QBs an even larger field/boundary split to read.",
    options: ["True", "False"],
    correctIndex: 0,
    explanation:
      "True. High school hash marks are 53'4\" apart, college hashes are 40' from center (80' apart — wait, that's wider). Actually, HS hashes are at the one-third marks of the field, making them wider than college. This means high school QBs deal with the largest field/boundary differential.",
    timeLimit: 15,
    xpValue: 12,
    tags: ["hash marks", "high school", "levels"],
  },
  {
    id: "f-010",
    module: "foundation",
    difficulty: 3,
    type: "multiple_choice",
    question: "What is the significance of the 'plus territory' (opponent's side of the 50) for a quarterback's pre-snap process?",
    options: [
      "Nothing changes — the same reads apply everywhere",
      "The QB should focus only on running plays",
      "Vertical routes gain urgency as the end zone comes into the throw window; the QB must account for a shrinking field behind the defense",
      "The QB should audible to screens every time",
    ],
    correctIndex: 2,
    explanation:
      "In plus territory, the end zone enters the effective throw window for vertical concepts. The QB's pre-snap calculation must now factor in how the compressed field behind the defense changes leverage, safety depth, and coverage rotations. This is where IQ separates good QBs from great ones.",
    timeLimit: 25,
    xpValue: 20,
    tags: ["territory", "pre-snap", "vertical game"],
  },
  {
    id: "f-011",
    module: "foundation",
    difficulty: 4,
    type: "multiple_choice",
    question: "Ball is on the right hash at the opponent's 30. Your best receiver is split wide to the field (left) side running a deep comeback. What is the approximate throw distance?",
    options: [
      "12-14 yards",
      "16-18 yards (depth + angle from hash to numbers)",
      "25 yards",
      "8-10 yards",
    ],
    correctIndex: 1,
    explanation:
      "A comeback route breaks at ~14-16 yards depth, but the ball must travel from the right hash to the field-side numbers. The combination of vertical depth and horizontal distance creates a throw of approximately 16-18 yards. Understanding this geometry helps QBs make on-time throws with proper velocity.",
    timeLimit: 25,
    xpValue: 25,
    tags: ["geometry", "throw distance", "route calculation"],
  },
  {
    id: "f-012",
    module: "foundation",
    difficulty: 4,
    type: "multiple_choice",
    question: "Why is the area between the hashes called the 'MOF' (Middle of Field) and why is it the most dangerous place to throw?",
    options: [
      "Because the referees stand there",
      "It's not dangerous — it's the easiest area to complete passes",
      "Defenders from both sides of the formation can converge on the ball — it's the only area where both safeties and all linebackers have reasonable closing angles",
      "Because the wind is strongest in the middle of the field",
    ],
    correctIndex: 2,
    explanation:
      "The MOF (Middle of Field) is the most congested throwing window because defenders from both the field and boundary sides can converge. Both safeties, all linebackers, and interior defenders have closing angles on MOF throws. QBs who throw MOF must have exceptional timing, velocity, and anticipation.",
    timeLimit: 25,
    xpValue: 25,
    tags: ["MOF", "throw windows", "spatial awareness"],
  },
];

const haloQuestions: IQQuestion[] = [
  {
    id: "h-001",
    module: "halo",
    difficulty: 1,
    type: "multiple_choice",
    question: "What does 'H.A.L.O.' stand for in quarterback pre-snap reading?",
    options: [
      "High Altitude Low Observation",
      "Hardeck Above Linebackers Observation",
      "Hash Alignment Lateral Offset",
      "Half-field Area Leverage Overview",
    ],
    correctIndex: 1,
    explanation:
      "H.A.L.O. stands for Hardeck Above Linebackers Observation. It's the quarterback's systematic process for reading the defensive structure above the line of scrimmage — specifically the alignment and depth of linebackers, safeties, and nickel/dime defenders.",
    timeLimit: 15,
    xpValue: 10,
    tags: ["HALO", "definition"],
  },
  {
    id: "h-002",
    module: "halo",
    difficulty: 2,
    type: "multiple_choice",
    question: "What is a 'tube' in pre-snap defensive reading?",
    options: [
      "The space between the hash marks",
      "A vertical passing lane between defensive linemen or linebackers",
      "The area behind the safety",
      "The sideline corridor",
    ],
    correctIndex: 1,
    explanation:
      "A 'tube' is a vertical passing lane that exists between defenders — specifically between defensive linemen, between a DE and an OLB, or between linebackers. QBs identify tubes pre-snap to determine where quick throws can be delivered before the defense closes the lane.",
    timeLimit: 20,
    xpValue: 15,
    tags: ["tubes", "passing lanes"],
  },
  {
    id: "h-003",
    module: "halo",
    difficulty: 2,
    type: "multiple_choice",
    question: "What is a 'bubble' in the context of defensive alignment?",
    options: [
      "A screen pass concept",
      "When a receiver lines up off the line of scrimmage",
      "An open area in the defense where no defender is positioned — a void in the coverage structure",
      "A defensive blitz package",
    ],
    correctIndex: 2,
    explanation:
      "A 'bubble' is an area of the defensive alignment where no defender currently occupies space. Identifying bubbles pre-snap tells the QB where the defense is vulnerable. If a linebacker shades to the strong side, there's a bubble in the weak-side passing lanes.",
    timeLimit: 20,
    xpValue: 15,
    tags: ["bubbles", "voids", "coverage gaps"],
  },
  {
    id: "h-004",
    module: "halo",
    difficulty: 2,
    type: "multiple_choice",
    question: "How does a QB determine the 'strength' of a defensive formation?",
    options: [
      "By counting which side has more defensive linemen only",
      "By identifying which side has more total defenders aligned, typically determined by the SAM linebacker and/or extra safety alignment",
      "By looking at which side of the field is wider",
      "Strength is always to the offense's right",
    ],
    correctIndex: 1,
    explanation:
      "Defensive strength is determined by counting the total number of defenders aligned to each side. Typically, the SAM (strong-side) linebacker's alignment indicates the strength declaration. The strong safety's alignment often confirms it. QBs use this to predict blitz origins and coverage rotations.",
    timeLimit: 20,
    xpValue: 15,
    tags: ["strength", "formation reading"],
  },
  {
    id: "h-005",
    module: "halo",
    difficulty: 3,
    type: "multiple_choice",
    question: "The MIKE linebacker is aligned head-up on the center and the WILL is shifted 2 yards inside the offensive tackle. What does this tell the QB about the likely defensive concept?",
    options: [
      "The defense is in a split-safety (2-high) look with both LBs expecting to drop into zones",
      "The defense is blitzing both linebackers",
      "The WILL is likely a run-fit player with the MIKE potentially having pass responsibility to the opposite side",
      "This alignment has no significance",
    ],
    correctIndex: 2,
    explanation:
      "When the WILL shifts over the guard/tackle gap, he's typically fitting into a run gap (B or C gap). The MIKE, head-up on center, may have dual responsibility — run fit to the weak side or pass drop away from the WILL's fit side. This alignment often indicates an odd-spacing concept.",
    timeLimit: 25,
    xpValue: 20,
    tags: ["LB alignment", "run fit", "concepts"],
  },
  {
    id: "h-006",
    module: "halo",
    difficulty: 3,
    type: "multiple_choice",
    question: "You see both safeties at 12+ yards depth, split evenly across the field. What 'shell' is the defense showing and what does it suggest?",
    options: [
      "0-high shell — man coverage with no deep safety",
      "1-high shell — single high safety indicating Cover 1 or Cover 3",
      "2-high shell — typically Cover 2 or Cover 4, with two deep defenders splitting the field in half",
      "3-high shell — three deep defenders",
    ],
    correctIndex: 2,
    explanation:
      "Two safeties split at depth create a '2-high' shell. This typically indicates Cover 2 (two deep, five under), Cover 4/Quarters, or Cover 6 (quarter-quarter-half). The QB knows the deep field is divided into halves, meaning the middle of the field may be open between the safeties.",
    timeLimit: 25,
    xpValue: 20,
    tags: ["shell reads", "safety alignment", "2-high"],
  },
  {
    id: "h-007",
    module: "halo",
    difficulty: 3,
    type: "multiple_choice",
    question: "Pre-snap, you identify a bubble between the MIKE and the SAM linebacker — approximately 6 yards of horizontal space with no defender. What is your best exploitation?",
    options: [
      "Throw a deep go route over the top",
      "Run away from the bubble",
      "Attack the bubble with an intermediate route (dig, crossing route, or sit route) that settles into the void",
      "Call a timeout",
    ],
    correctIndex: 2,
    explanation:
      "Bubbles in the linebacker level are best exploited with intermediate routes that 'sit' in the void — dig routes, crossing routes, or option routes that find grass. The key is timing: the ball must arrive as the receiver enters the bubble, before the defense can close it.",
    timeLimit: 25,
    xpValue: 20,
    tags: ["bubbles", "route exploitation", "timing"],
  },
  {
    id: "h-008",
    module: "halo",
    difficulty: 4,
    type: "multiple_choice",
    question: "The defense shows a 2-high shell pre-snap, but just before the snap, the field safety begins creeping toward the line of scrimmage. What adjustment should the QB consider?",
    options: [
      "Ignore it — pre-snap looks don't change after the play starts",
      "The defense is likely rotating to a 1-high shell (Cover 1 or Cover 3), opening the deep field side where the safety vacated",
      "The safety is just bluffing and will return to his position",
      "The QB should always audible to a run on any safety movement",
    ],
    correctIndex: 1,
    explanation:
      "Late safety rotation from 2-high to 1-high is a common defensive disguise. When the field safety creeps down, the defense is likely rotating to Cover 1 or Cover 3, which means the deep field side becomes single-covered. Elite QBs see this rotation and know to target the vacated deep area.",
    timeLimit: 25,
    xpValue: 25,
    tags: ["rotation", "disguise", "safety movement"],
  },
  {
    id: "h-009",
    module: "halo",
    difficulty: 4,
    type: "multiple_choice",
    question: "You see the nickel defender aligned at 5 yards depth, splitting the difference between the slot receiver and the offensive tackle. What is he likely responsible for?",
    options: [
      "Deep coverage on the outside receiver",
      "Both run fit (contain) and short zone responsibility — he's a conflict player reading the QB's eyes",
      "Blitzing off the edge every play",
      "Only covering the running back",
    ],
    correctIndex: 1,
    explanation:
      "A nickel at 5 yards splitting the slot and tackle is a 'conflict player' — he has dual responsibility for run contain/fit and short zone or man coverage on the slot. QBs read conflict defenders because they can't do both jobs simultaneously. If he commits to the run, the slot is open. If he covers, there's a running lane.",
    timeLimit: 25,
    xpValue: 25,
    tags: ["nickel", "conflict player", "dual read"],
  },
  {
    id: "h-010",
    module: "halo",
    difficulty: 2,
    type: "multiple_choice",
    question: "What is the 'hardeck' in the HALO framework?",
    options: [
      "The line of scrimmage",
      "The imaginary horizontal plane at linebacker depth (4-5 yards deep) that separates the under coverage from the deep coverage",
      "The sideline boundary",
      "The quarterback's throwing motion",
    ],
    correctIndex: 1,
    explanation:
      "The hardeck is the imaginary horizontal plane at linebacker depth (~4-5 yards behind the line of scrimmage). Everything above the hardeck is the deep coverage structure (safeties, corners deep). Everything at or below the hardeck is the under coverage (linebackers, nickel, underneath zones). QBs read ABOVE the hardeck first.",
    timeLimit: 20,
    xpValue: 15,
    tags: ["hardeck", "definition", "coverage levels"],
  },
  {
    id: "h-011",
    module: "halo",
    difficulty: 5,
    type: "multiple_choice",
    question: "The defense is showing a 2-high shell with both LBs at 5 yards aligned over the guards. Pre-snap motion of a slot receiver causes the WILL to widen 3 yards but the MIKE doesn't move. What does this tell you?",
    options: [
      "Nothing — linebackers always adjust to motion",
      "The WILL likely has man responsibility on the motioning receiver. The MIKE maintaining position suggests zone assignment. This indicates a possible 'split coverage' concept (e.g., Cover 6 — quarters to the motion side, Cover 2 away)",
      "Both linebackers are blitzing",
      "The defense is running a prevent coverage",
    ],
    correctIndex: 1,
    explanation:
      "When motion triggers one LB to travel but the other holds position, it reveals their individual assignments. The traveling WILL likely has man responsibility on the slot, while the stationary MIKE has a zone drop. This 'split coverage' (one side man, one side zone) is a key tell that elite QBs exploit.",
    timeLimit: 30,
    xpValue: 30,
    tags: ["motion", "LB reaction", "coverage tells", "elite"],
  },
  {
    id: "h-012",
    module: "halo",
    difficulty: 5,
    type: "multiple_choice",
    question: "How does understanding 'HALO' reading change your audible decision at the line compared to reading only the front?",
    options: [
      "It doesn't — the front determines everything",
      "HALO tells you coverage, which determines route adjustments. The front tells you protection. Together they inform the full audible — you might keep the run against the front but change the pass concept based on what HALO reveals above the hardeck",
      "HALO only matters for the receivers, not the QB",
      "You should only read HALO in shotgun formations",
    ],
    correctIndex: 1,
    explanation:
      "Reading both the front AND the HALO gives the QB a complete defensive picture. The front informs protection schemes and run viability. The HALO (coverage structure above the linebackers) informs route adjustments, hot reads, and audible pass concepts. Elite QBs process both simultaneously to make full-field decisions.",
    timeLimit: 30,
    xpValue: 30,
    tags: ["audibles", "full-field", "elite processing"],
  },
];

const frontsQuestions: IQQuestion[] = [
  {
    id: "fr-001",
    module: "fronts",
    difficulty: 1,
    type: "multiple_choice",
    question: "In a standard 4-3 defense, how many down linemen and linebackers are there?",
    options: [
      "3 down linemen, 4 linebackers",
      "4 down linemen, 3 linebackers",
      "5 down linemen, 2 linebackers",
      "4 down linemen, 4 linebackers",
    ],
    correctIndex: 1,
    explanation:
      "A 4-3 defense has 4 down linemen (2 DTs, 2 DEs) and 3 linebackers (SAM, MIKE, WILL). This is one of the most common defensive fronts in football and the baseline for QB front recognition.",
    timeLimit: 15,
    xpValue: 10,
    tags: ["4-3", "basics"],
  },
  {
    id: "fr-002",
    module: "fronts",
    difficulty: 1,
    type: "multiple_choice",
    question: "What is the primary difference between a 4-3 and a 3-4 defense?",
    options: [
      "The number of defensive backs",
      "The 3-4 uses 3 down linemen and 4 linebackers, giving more flexibility for blitzing from multiple positions",
      "They are exactly the same",
      "The 3-4 has more defensive linemen",
    ],
    correctIndex: 1,
    explanation:
      "The 3-4 uses 3 down linemen (typically a nose tackle and two DEs) and 4 linebackers (2 ILBs, 2 OLBs). The extra linebacker creates ambiguity for the offense — any of the 4 LBs could rush or drop, making it harder for the QB to identify the blitz.",
    timeLimit: 15,
    xpValue: 10,
    tags: ["3-4", "4-3", "comparison"],
  },
  {
    id: "fr-003",
    module: "fronts",
    difficulty: 2,
    type: "multiple_choice",
    question: "What are the defensive line 'techniques' and what does a '3-technique' mean?",
    options: [
      "Techniques refer to tackling form; 3-technique means wrapping up low",
      "Techniques describe alignment relative to the offensive line; a 3-technique aligns on the outside shoulder of the guard",
      "Techniques describe blitz packages; 3-technique means a 3-man rush",
      "There is no such system in football",
    ],
    correctIndex: 1,
    explanation:
      "Defensive line techniques are a numbering system that describes alignment relative to offensive linemen. A 3-technique aligns on the outside shoulder of the guard, creating a B-gap threat. The system goes: 0 (head-up center), 1 (inside shoulder of guard), 2 (head-up guard), 3 (outside shoulder of guard), 4 (head-up tackle), 5 (outside shoulder of tackle), etc.",
    timeLimit: 20,
    xpValue: 15,
    tags: ["techniques", "alignment"],
  },
  {
    id: "fr-004",
    module: "fronts",
    difficulty: 2,
    type: "multiple_choice",
    question: "What are the 'gaps' in the offensive line and what is the 'A gap'?",
    options: [
      "Gaps are spaces between offensive linemen; the A gap is the space between the center and guard",
      "Gaps refer to coverage zones; the A gap is the deep middle",
      "Gaps are blocking assignments; the A gap is the first block",
      "Gaps only exist in 4-3 defenses",
    ],
    correctIndex: 0,
    explanation:
      "Gaps are the spaces between offensive linemen: A gap (between center and guard), B gap (between guard and tackle), C gap (between tackle and tight end), D gap (outside the tight end). QBs must understand gap assignments because they determine where defenders will attack and where running lanes exist.",
    timeLimit: 20,
    xpValue: 15,
    tags: ["gaps", "A gap", "offensive line"],
  },
  {
    id: "fr-005",
    module: "fronts",
    difficulty: 3,
    type: "multiple_choice",
    question: "You identify a Nickel (4-2-5) front. What does this tell you about the defense's priorities?",
    options: [
      "They're prioritizing run defense with extra linemen",
      "They've removed a linebacker for a 5th defensive back, prioritizing pass coverage and creating lighter boxes — good indicator for RPO and spread concepts",
      "They have 5 linebackers on the field",
      "This formation doesn't exist in modern football",
    ],
    correctIndex: 1,
    explanation:
      "A Nickel (4-2-5) replaces a linebacker with a 5th defensive back. This signals the defense is prioritizing pass coverage with lighter boxes. QBs should identify nickel because: (1) lighter box = potential running advantage, (2) five DBs means more coverage flexibility, (3) fewer blitz options from the LB level.",
    timeLimit: 25,
    xpValue: 20,
    tags: ["nickel", "4-2-5", "personnel"],
  },
  {
    id: "fr-006",
    module: "fronts",
    difficulty: 3,
    type: "multiple_choice",
    question: "What is an 'over' front and how does it differ from an 'under' front in a 4-3?",
    options: [
      "Over/under refers to the ball being snapped over or under center",
      "'Over' shifts the DL strength to the tight end side; 'Under' shifts DL strength away from the tight end, often creating a 3-technique to the weak side",
      "They are the same alignment with different names",
      "Over means the defense is playing zone; Under means man coverage",
    ],
    correctIndex: 1,
    explanation:
      "A 4-3 'Over' shifts the defensive line toward the tight end (strength), placing the 3-technique to the strong side. A 4-3 'Under' shifts away from the TE, putting the 3-technique weak and often walking a DE into a stand-up position. This matters for QBs because it changes run-fit responsibility and pass rush angles.",
    timeLimit: 25,
    xpValue: 20,
    tags: ["over/under", "4-3", "DL alignment"],
  },
  {
    id: "fr-007",
    module: "fronts",
    difficulty: 3,
    type: "multiple_choice",
    question: "The defense lines up in a 'Bear' front (6 defenders on the line with 0, 4i, 4i, and 2 edge players). What is the primary challenge for the quarterback?",
    options: [
      "The defense can only rush 4 — it's easier for the QB",
      "With 6 on the line, interior pressure is immediate and both A-gaps are threatened; the QB must expect quick interior penetration and have hot routes planned",
      "Bear fronts are easy to read because everyone is on the line",
      "The challenge is only for the running game, not passing",
    ],
    correctIndex: 1,
    explanation:
      "A Bear front stacks the line of scrimmage with 6 defenders, creating immediate interior pressure. Both A-gaps are threatened, and the offense often can't account for all rushers with standard 5-man protection. The QB must have quick-release answers (slants, hots, RB check-releases) ready against Bear fronts.",
    timeLimit: 25,
    xpValue: 20,
    tags: ["bear front", "interior pressure", "adjustments"],
  },
  {
    id: "fr-008",
    module: "fronts",
    difficulty: 4,
    type: "multiple_choice",
    question: "You see 3 down linemen, but both OLBs have their hand in the dirt on the edge. Is this a 3-4 or a 5-2?",
    options: [
      "It's always a 3-4 because there are 3 DL",
      "It's functionally a 5-man front (5-2) regardless of what the roster calls them — what matters is the number of potential rushers on the line, not the position labels",
      "It's neither — it's illegal",
      "It doesn't matter for the QB",
    ],
    correctIndex: 1,
    explanation:
      "Football has evolved past rigid position labels. When both OLBs have their hands down on the edge, the defense is functionally presenting a 5-man front regardless of depth chart labels. The QB must count potential rushers on the line — that's what determines protection calls, not whether the roster lists them as LBs or DEs.",
    timeLimit: 25,
    xpValue: 25,
    tags: ["position versatility", "front counting", "modern defense"],
  },
  {
    id: "fr-009",
    module: "fronts",
    difficulty: 4,
    type: "multiple_choice",
    question: "The defense shows a 4-2-5 nickel, but the nickel defender is lined up at the line of scrimmage in a 2-point stance over the slot. How should the QB adjust his count?",
    options: [
      "Don't count him — he's a DB",
      "Count him as a potential 5th rusher; the defense could be bringing a 'nickel blitz' creating a 5-man rush with man-free coverage behind it",
      "Assume he's dropping into coverage no matter what",
      "Audible to a run every time you see this",
    ],
    correctIndex: 1,
    explanation:
      "A nickel defender on the LOS in a 2-point stance is showing blitz. The QB must count him as a potential 5th rusher (creating a '5-man pressure' look). This is critical for protection: if the RB/TE can't pick him up, the QB needs a hot route to the vacated area. Always count LOS defenders as potential rushers.",
    timeLimit: 25,
    xpValue: 25,
    tags: ["nickel blitz", "counting rushers", "protection"],
  },
  {
    id: "fr-010",
    module: "fronts",
    difficulty: 4,
    type: "multiple_choice",
    question: "What is a 'mug' look and why does it create problems for the QB's front identification?",
    options: [
      "A mug is when the defense plays with no defensive linemen",
      "Both ILBs walk up to the A-gaps, showing blitz. It disguises the true rushers because either, both, or neither may actually come — the QB can't determine the real front until the snap",
      "A mug is a type of coverage, not a front",
      "Mug refers to the QB photo on the scouting report",
    ],
    correctIndex: 1,
    explanation:
      "A 'mug' look has both inside linebackers walked up into the A-gaps, presenting as blitzers. The problem is the 'simulated pressure' — one LB may rush while the other drops, both may come, or both may drop. The QB can't determine the actual front/pressure until post-snap, which is why mug looks are so effective at disrupting pre-snap reads.",
    timeLimit: 25,
    xpValue: 25,
    tags: ["mug", "simulated pressure", "disguise"],
  },
  {
    id: "fr-011",
    module: "fronts",
    difficulty: 5,
    type: "multiple_choice",
    question: "The defense is in a 3-4 with the nose in a 0-technique, both DEs in 5-techniques, and the JACK OLB walked off the ball at 3 yards depth over the slot. How many true 'on-ball' defenders do you count for protection purposes?",
    options: [
      "7 — count everyone in the front seven",
      "3 — only the down linemen on the ball",
      "4 — the 3 DL plus the standup OLB on the other edge who has his hand down, treating walked-off JACK as a coverage player unless he shows rush at the snap",
      "5 — count both OLBs regardless of alignment",
    ],
    correctIndex: 2,
    explanation:
      "For protection purposes, count 'on-ball' defenders: the 3 DL and the edge OLB who has his hand in the dirt. The JACK walked off at 3 yards over the slot is a potential rusher but currently showing coverage alignment — treat him as a coverage player unless his pre-snap movement suggests rush. This disciplined counting prevents false protection calls.",
    timeLimit: 30,
    xpValue: 30,
    tags: ["protection counting", "3-4", "edge alignments"],
  },
  {
    id: "fr-012",
    module: "fronts",
    difficulty: 5,
    type: "multiple_choice",
    question: "Defenses today 'match personnel' rather than staying in base fronts. If the offense comes out in 11 personnel (1 RB, 1 TE, 3 WR), what defensive personnel is most likely — and what front should the QB expect?",
    options: [
      "Base 4-3 with 3 LBs — defenses don't adjust to offensive personnel",
      "Nickel (4-2-5) or Dime (4-1-6) — the defense will match the 3 WRs with DBs, creating lighter boxes. Expect even-front spacing with 4 DL and reduced LBs",
      "Goal-line personnel with 6 DL",
      "The defense will keep their base personnel regardless of the offense",
    ],
    correctIndex: 1,
    explanation:
      "Modern defenses match personnel packages. Against 11 personnel (3 WR), the defense typically goes Nickel (4-2-5) or Dime (4-1-6) to match receivers with DBs. This creates lighter boxes (6 or fewer in the box), which the QB should recognize as favorable for the run game while understanding the defense has more coverage options with the extra DBs.",
    timeLimit: 30,
    xpValue: 30,
    tags: ["personnel matching", "modern defense", "tendency"],
  },
];

const coverageQuestions: IQQuestion[] = [
  {
    id: "c-001",
    module: "coverage",
    difficulty: 1,
    type: "multiple_choice",
    question: "What is 'Cover 0'?",
    options: [
      "All defenders drop into zone coverage",
      "Zero deep safeties — pure man coverage with no safety help over the top. All-out pressure.",
      "A prevent defense with everyone deep",
      "Cover 0 refers to the offense having 0 receivers",
    ],
    correctIndex: 1,
    explanation:
      "Cover 0 means zero deep safeties. Every defender has a man-to-man assignment, and at least one (often more) will rush the QB. It's the highest-risk, highest-reward defensive call — if the blitz doesn't get home, receivers are 1-on-1 with no safety net deep.",
    timeLimit: 15,
    xpValue: 10,
    tags: ["Cover 0", "man coverage", "basics"],
  },
  {
    id: "c-002",
    module: "coverage",
    difficulty: 1,
    type: "multiple_choice",
    question: "What is the key difference between Cover 1 and Cover 3?",
    options: [
      "Cover 1 is man coverage with 1 deep safety; Cover 3 is zone coverage with the deep field split into 3 zones",
      "Cover 1 uses 1 linebacker; Cover 3 uses 3 linebackers",
      "They are identical",
      "Cover 1 is only used in the red zone",
    ],
    correctIndex: 0,
    explanation:
      "Cover 1 is man-to-man coverage with a single free safety providing deep help (1-high shell). Cover 3 is zone coverage with three defenders (typically 2 corners + 1 safety) each responsible for one-third of the deep field. Both show a similar 1-high shell pre-snap, but the underneath coverage is fundamentally different.",
    timeLimit: 20,
    xpValue: 10,
    tags: ["Cover 1", "Cover 3", "man vs zone"],
  },
  {
    id: "c-003",
    module: "coverage",
    difficulty: 2,
    type: "multiple_choice",
    question: "What is the 'MOF' (Middle of Field) read and how does it help identify coverage?",
    options: [
      "MOF is a specific route concept",
      "The MOF read checks whether the middle of the field is 'open' (2-high, no safety in the middle) or 'closed' (1-high, safety occupying the deep middle) — this is the QB's first coverage key",
      "MOF stands for 'Moment of Football'",
      "MOF only applies to the red zone",
    ],
    correctIndex: 1,
    explanation:
      "The MOF read is the QB's FIRST pre-snap coverage identifier. MOFC (Middle of Field Closed) = 1 safety in the deep middle = Cover 1, Cover 3, or Cover 0. MOFO (Middle of Field Open) = 2 safeties = Cover 2, Cover 4, or Cover 6. This single read immediately narrows the coverage to 3 options instead of 6+.",
    timeLimit: 20,
    xpValue: 15,
    tags: ["MOF", "MOFC", "MOFO", "coverage identification"],
  },
  {
    id: "c-004",
    module: "coverage",
    difficulty: 2,
    type: "multiple_choice",
    question: "In Cover 2, what is the biggest vulnerability the QB should attack?",
    options: [
      "The flat areas — they're always open",
      "The 'hole' between the corner (who drops to the flat/curl zone) and the safety (who covers deep half) — the area 15-20 yards deep near the sideline",
      "The deep middle — there's no one there",
      "Cover 2 has no vulnerabilities",
    ],
    correctIndex: 1,
    explanation:
      "Cover 2's primary vulnerability is the 'hole' shot — the seam between the corner's curl/flat zone and the safety's deep half. Receivers running corner routes, post-corner, or deep out-and-up routes exploit this window approximately 15-20 yards deep near the sideline, where neither defender can easily cover.",
    timeLimit: 20,
    xpValue: 15,
    tags: ["Cover 2", "vulnerability", "hole shot"],
  },
  {
    id: "c-005",
    module: "coverage",
    difficulty: 3,
    type: "multiple_choice",
    question: "What are the pre-snap indicators that the defense is in man coverage rather than zone?",
    options: [
      "Man coverage always shows press alignment; zone always shows off coverage",
      "Man indicators include: DBs aligned inside leverage on receivers, eyes locked on receivers (not the QB), LBs shading toward eligible receivers, and defenders following pre-snap motion",
      "You can never tell man from zone pre-snap",
      "Zone always has more defenders on the field",
    ],
    correctIndex: 1,
    explanation:
      "Pre-snap man coverage tells: (1) DBs aligned with inside leverage (taking away inside releases), (2) DB eyes on the receiver — not the QB or ball, (3) LBs shading toward their man assignment, (4) defenders following motion (the strongest indicator). Zone defenders typically keep their eyes on the QB and don't move with motion.",
    timeLimit: 25,
    xpValue: 20,
    tags: ["man vs zone", "pre-snap tells", "indicators"],
  },
  {
    id: "c-006",
    module: "coverage",
    difficulty: 3,
    type: "multiple_choice",
    question: "What is Cover 4 (Quarters) and when do defenses tend to use it?",
    options: [
      "4 rushers, everyone else in coverage — it's a basic rush concept",
      "Four defensive backs each cover a deep quarter of the field; commonly used on obvious passing downs, it's excellent against vertical routes but can be vulnerable to underneath crossing routes and the run game",
      "Cover 4 means 4 defenders play man coverage",
      "Cover 4 is only used in prevent situations",
    ],
    correctIndex: 1,
    explanation:
      "Cover 4 (Quarters) assigns each of the 4 defensive backs a deep quarter of the field. It's excellent against the vertical passing game because every deep route has a defender. However, with 4 defenders deep, there are only 3 underneath defenders (the LBs), creating vulnerabilities to crossers, digs, and the run game.",
    timeLimit: 25,
    xpValue: 20,
    tags: ["Cover 4", "quarters", "coverage structure"],
  },
  {
    id: "c-007",
    module: "coverage",
    difficulty: 3,
    type: "multiple_choice",
    question: "What is 'pattern matching' and how does it differ from pure zone coverage?",
    options: [
      "Pattern matching is another name for man coverage",
      "In pattern matching, defenders start in zone positions but transition to man coverage on receivers who enter their zone — combining zone landmarks with man principles to eliminate windows",
      "Pattern matching means the defense copies the offense's formation",
      "It's a technique only used by cornerbacks",
    ],
    correctIndex: 1,
    explanation:
      "Pattern matching is a hybrid approach where defenders align in zone positions but match (man-cover) receivers who enter their area. For example, in Cover 4 'matchup,' if #2 goes vertical, the safety matches him man. If #2 goes flat, the safety looks for #1. This eliminates traditional zone 'holes' while maintaining zone landmarks.",
    timeLimit: 25,
    xpValue: 20,
    tags: ["pattern matching", "matchup zone", "modern coverage"],
  },
  {
    id: "c-008",
    module: "coverage",
    difficulty: 4,
    type: "multiple_choice",
    question: "You motion your slot receiver across the formation. The nickel follows him, but the boundary corner doesn't adjust his alignment. What can you determine?",
    options: [
      "Nothing — this is normal for all coverages",
      "The nickel is in man on the slot (he followed), but the corner is likely in zone (he maintained his zone landmark rather than adjusting to the new receiver distribution). This could indicate a split-coverage look.",
      "The entire defense is in man coverage",
      "The nickel is in zone and the corner is in man",
    ],
    correctIndex: 1,
    explanation:
      "Motion is the QB's best coverage identifier. When the nickel travels with the slot, he's almost certainly in man. When the corner maintains his position despite the receiver distribution changing, he's holding a zone landmark. This reveals a 'split coverage' — part man, part zone — like Cover 6 or a matchup quarters scheme.",
    timeLimit: 25,
    xpValue: 25,
    tags: ["motion", "coverage identification", "split coverage"],
  },
  {
    id: "c-009",
    module: "coverage",
    difficulty: 4,
    type: "multiple_choice",
    question: "What is Cover 6 and why is it difficult for QBs to diagnose?",
    options: [
      "Cover 6 uses 6 defensive backs — it's a dime package",
      "Cover 6 plays Cover 4 (quarters) to one side and Cover 2 to the other — it looks like a 2-high shell but each half of the field has different rules, making post-snap reads complex",
      "Cover 6 is man coverage with 6 potential blitzers",
      "Cover 6 doesn't exist in real football",
    ],
    correctIndex: 1,
    explanation:
      "Cover 6 is a split-field coverage: quarters to one side (usually the field/strength) and Cover 2 to the other (usually the boundary). Pre-snap it looks like a standard 2-high shell, but the rules are different on each side. QBs must read each half of the field independently, making this one of the most complex coverages to diagnose.",
    timeLimit: 25,
    xpValue: 25,
    tags: ["Cover 6", "split coverage", "complex"],
  },
  {
    id: "c-010",
    module: "coverage",
    difficulty: 4,
    type: "multiple_choice",
    question: "You're seeing a 1-high shell (MOFC). How do you differentiate Cover 1 from Cover 3 pre-snap?",
    options: [
      "You can't — they look identical pre-snap",
      "Corner alignment: In Cover 1, CBs play tighter (man) with inside leverage. In Cover 3, CBs play off/outside leverage because they're responsible for the deep third. Additionally, motion will reveal man (CB follows) vs zone (CB holds).",
      "Cover 1 always shows blitz; Cover 3 never does",
      "The safeties tell you everything — ignore the corners",
    ],
    correctIndex: 1,
    explanation:
      "Both Cover 1 and Cover 3 show a 1-high shell, but corner play reveals the difference. Cover 1 corners play tight/inside leverage (man). Cover 3 corners play off with outside leverage (protecting the deep third). Pre-snap motion is the ultimate differentiator: if corners travel with receivers = Cover 1; if corners hold position = likely Cover 3.",
    timeLimit: 25,
    xpValue: 25,
    tags: ["Cover 1 vs 3", "shell reads", "corner leverage"],
  },
  {
    id: "c-011",
    module: "coverage",
    difficulty: 5,
    type: "multiple_choice",
    question: "The defense shows 2-high pre-snap. At the snap, the boundary safety drops to a deep middle position while the field safety stays at his depth over the #2 receiver. What coverage has the defense rotated into?",
    options: [
      "Cover 2 — both safeties are still deep",
      "Cover 3 Buzz — the boundary safety has rotated to the deep middle third, the field safety plays the deep field third, and the boundary corner plays the deep boundary third. A linebacker or nickel will 'buzz' to the flat.",
      "Cover 0 — all-out blitz",
      "Nothing changed — this is still 2-high",
    ],
    correctIndex: 1,
    explanation:
      "This is a classic '2-to-3' rotation (Cover 3 Buzz/Sky). The defense disguised Cover 3 with a 2-high shell. Post-snap, the boundary safety rotates to the deep middle, the field safety stays in the deep field third, and the boundary corner (who was showing off coverage) takes the deep boundary third. A LB or nickel replaces the rotated safety in the flat. This is why elite QBs read post-snap, not just pre-snap.",
    timeLimit: 30,
    xpValue: 30,
    tags: ["rotation", "disguise", "Cover 3 buzz", "elite"],
  },
  {
    id: "c-012",
    module: "coverage",
    difficulty: 5,
    type: "multiple_choice",
    question: "Why do modern defenses layer 'coverage checks' based on offensive formation, and how does this affect QB processing?",
    options: [
      "They don't — coaches call coverage from the sideline and it doesn't change",
      "Defenses use 'check-with-me' systems where the coverage adjusts based on receiver alignment (e.g., trips = quarters adjustment, TE strong = Cover 6 call). The QB must understand the defense's check rules to predict coverage BEFORE motion/snap, essentially seeing what the defense will do before they know they're doing it.",
      "Coverage checks are only for high school defenses",
      "QBs don't need to understand defensive check systems",
    ],
    correctIndex: 1,
    explanation:
      "Modern defenses use formation-based coverage checks: specific formations trigger pre-set coverage adjustments. If the QB understands these rules (through film study), he can predict the coverage before motion confirms it. Example: 'Against 3x1, we check to quarters to the trips side and man away.' The QB who knows this sees the trips formation and already knows the coverage — that's the ultimate competitive advantage.",
    timeLimit: 30,
    xpValue: 30,
    tags: ["coverage checks", "film study", "advanced processing"],
  },
  {
    id: "c-013",
    module: "coverage",
    difficulty: 3,
    type: "multiple_choice",
    question: "What is 'robber' coverage and what makes it dangerous for QBs?",
    options: [
      "It's when a defender 'robs' the ball for an interception",
      "A defender (often a safety or linebacker) disguises himself in coverage but is actually reading the QB's eyes and jumping any intermediate route thrown to the middle of the field",
      "Robber is a blitz package, not a coverage",
      "It means the defense has a pick play",
    ],
    correctIndex: 1,
    explanation:
      "A 'robber' is a defender (typically a safety or LB) who sits in a low-hole position, reading the QB's eyes. He's not assigned a man or a traditional zone — his job is to jump the first intermediate throw to his area. This is why staring down receivers is dangerous. QBs must use their eyes to manipulate the robber before delivering the ball.",
    timeLimit: 25,
    xpValue: 20,
    tags: ["robber", "eye manipulation", "intermediate danger"],
  },
  {
    id: "c-014",
    module: "coverage",
    difficulty: 5,
    type: "multiple_choice",
    question: "Film shows your opponent runs Cover 3 72% of the time on 1st & 10. How does an elite QB use this tendency?",
    options: [
      "Ignore tendencies and just play football",
      "Assume Cover 3 on every first down without reading",
      "Use the tendency as a starting point: expect Cover 3, but confirm with pre-snap reads (corner leverage, safety depth) and motion. Build the play call around Cover 3 beaters (4-verts, floods, dagger) but have built-in adjustments if the defense breaks tendency",
      "Call a timeout to think about it",
    ],
    correctIndex: 2,
    explanation:
      "Elite QBs use preparation (film study tendencies) to narrow their pre-snap reads, not replace them. Knowing 72% Cover 3 on 1st & 10 means you START with that expectation, confirm through reads, and attack with Cover 3 beaters. But you stay disciplined — the 28% matters too. Film study + live confirmation = elite processing.",
    timeLimit: 30,
    xpValue: 30,
    tags: ["film study", "tendencies", "elite processing"],
  },
];

const spaceCountingQuestions: IQQuestion[] = [
  {
    id: "sc-001",
    module: "space-counting",
    difficulty: 1,
    type: "multiple_choice",
    question: "What does 'counting the box' mean for a quarterback?",
    options: [
      "Counting how many boxes of equipment are on the sideline",
      "Counting the number of defenders aligned within approximately 5 yards of the line of scrimmage and between the offensive tackles — these are the defenders committed to stopping the run",
      "Counting the number of offensive linemen",
      "Counting the number of timeouts remaining",
    ],
    correctIndex: 1,
    explanation:
      "Counting the box means identifying how many defenders are positioned near the LOS between the tackles (typically within 5 yards). These are the 'box defenders' committed to stopping the run. If the offense has more blockers than box defenders, they have a numbers advantage and the run should be effective.",
    timeLimit: 15,
    xpValue: 10,
    tags: ["box count", "basics", "run game"],
  },
  {
    id: "sc-002",
    module: "space-counting",
    difficulty: 2,
    type: "multiple_choice",
    question: "Your offense has 5 OL and 1 RB (6 potential blockers). You count 7 defenders in the box. What does this 'numbers disadvantage' tell you?",
    options: [
      "Nothing — just run the play as called",
      "The defense has an extra defender in the box that the offense can't block. The QB should consider checking to a pass or running away from the overloaded side, making the extra defender wrong",
      "Always audible to a quarterback sneak",
      "The defense is in prevent coverage",
    ],
    correctIndex: 1,
    explanation:
      "A 7-man box against 6 blockers creates a +1 numbers advantage for the defense. The unblocked defender will make the play. An elite QB recognizes this and: (1) checks to a pass to exploit the light coverage, (2) runs away from the overloaded side, or (3) uses RPO to hold a defender and create artificial numbers balance.",
    timeLimit: 20,
    xpValue: 15,
    tags: ["numbers advantage", "check system", "RPO"],
  },
  {
    id: "sc-003",
    module: "space-counting",
    difficulty: 2,
    type: "multiple_choice",
    question: "What is a 'high safety' and how does counting them inform your coverage read?",
    options: [
      "A safety who plays above 10 yards depth — counting them tells you the shell (0-high = Cover 0, 1-high = Cover 1/3, 2-high = Cover 2/4)",
      "A safety who is very tall",
      "A safety who plays near the line of scrimmage",
      "High safety just means the safety is the defensive captain",
    ],
    correctIndex: 0,
    explanation:
      "High safeties are defensive backs aligned 10+ yards from the line of scrimmage with deep responsibility. Counting them is the QB's fastest coverage indicator: 0 high safeties = Cover 0 (all-out pressure). 1 high safety = Cover 1 or Cover 3. 2 high safeties = Cover 2, Cover 4, or Cover 6. This takes less than 1 second and narrows coverage options immediately.",
    timeLimit: 20,
    xpValue: 15,
    tags: ["high safety", "counting", "coverage read"],
  },
  {
    id: "sc-004",
    module: "space-counting",
    difficulty: 3,
    type: "multiple_choice",
    question: "You count 6 in the box with 2-high safeties and 3 CBs in coverage. Your offense is in 11 personnel (1 RB, 1 TE, 3 WR). Where is the numbers advantage?",
    options: [
      "The defense has the advantage everywhere",
      "With only 6 in the box, the offense has a numbers advantage in the run game (5 OL + 1 TE = 6 blockers vs 6 defenders, with the RB as the +1). But the 3 CBs are matched to your 3 WRs with 2 safeties helping — the pass game is well-defended.",
      "The offense should always pass against 2-high",
      "Numbers advantages don't exist in real football",
    ],
    correctIndex: 1,
    explanation:
      "Space counting reveals leverage: 6-man box against 6 blockers + the RB (the +1 player) gives an advantage in the run game. However, 3 CBs matched on 3 WRs with 2 safety help means the passing game is well-covered. The QB should lean toward running or using RPO to stress the box count.",
    timeLimit: 25,
    xpValue: 20,
    tags: ["numbers advantage", "box count", "run vs pass"],
  },
  {
    id: "sc-005",
    module: "space-counting",
    difficulty: 3,
    type: "multiple_choice",
    question: "What is a 'void' in space counting?",
    options: [
      "A missed tackle",
      "An area of the field where no defender is positioned — a gap in the coverage or run defense structure that the offense can target",
      "An incomplete pass",
      "When a defender is injured and leaves a gap temporarily",
    ],
    correctIndex: 1,
    explanation:
      "A 'void' is an area of the field where no defender exists in the defensive structure. Voids can be horizontal (between defenders) or vertical (between coverage levels). QBs who can identify voids pre-snap know exactly where to attack. A void between the WILL and the boundary CB, for example, is the perfect window for an out-breaking route.",
    timeLimit: 20,
    xpValue: 20,
    tags: ["void", "spatial awareness", "coverage gaps"],
  },
  {
    id: "sc-006",
    module: "space-counting",
    difficulty: 3,
    type: "multiple_choice",
    question: "The defense has 8 in the box against your 21 personnel (2 RB, 1 TE, 2 WR). You have 7 potential blockers. What's your optimal response?",
    options: [
      "Run into the teeth of the defense",
      "The defense committed an 8th defender to the box, meaning there are only 3 defenders in coverage for your 2 WRs and the passing game is extremely favorable. Check to play-action or throw the ball to the 1-on-1 matchup outside.",
      "Punt",
      "Call a trick play",
    ],
    correctIndex: 1,
    explanation:
      "An 8-man box against 21 personnel means the defense has only 3 coverage defenders for 2 WRs (and potential RB releasing). This creates a massive advantage in the passing game — at least one WR is 1-on-1 with no safety help. The QB should recognize this and check to play-action, which freezes the box defenders and attacks the undermanned coverage.",
    timeLimit: 25,
    xpValue: 20,
    tags: ["box count", "play-action", "personnel advantage"],
  },
  {
    id: "sc-007",
    module: "space-counting",
    difficulty: 4,
    type: "multiple_choice",
    question: "In RPO (Run-Pass Option), the QB is counting one specific defender post-snap. Who is this defender and what determines the QB's decision?",
    options: [
      "The QB always reads the middle linebacker",
      "The QB reads the 'conflict defender' — often an OLB or overhang player — who must choose between fitting the run and covering a receiver. If the defender crashes to the run, the QB pulls and throws. If the defender widens to cover, the QB hands off into the vacated gap.",
      "The QB reads the free safety on every RPO",
      "RPO doesn't involve reading defenders — it's a predetermined choice",
    ],
    correctIndex: 1,
    explanation:
      "The RPO read is about putting a 'conflict defender' in an impossible situation. This is usually the overhang player (OLB, SAM, or nickel) who has both run-fit and pass coverage responsibility. By reading this single defender post-snap, the QB solves the numbers equation: if the defender plays run = throw; if the defender plays pass = hand off.",
    timeLimit: 25,
    xpValue: 25,
    tags: ["RPO", "conflict defender", "read progression"],
  },
  {
    id: "sc-008",
    module: "space-counting",
    difficulty: 4,
    type: "multiple_choice",
    question: "You're in a 3x1 formation (trips to the field, single receiver boundary). You count: 4 defenders over trips, 2 defenders over the single receiver, and 5 in the box with 1 high safety. Where's the advantage?",
    options: [
      "The trips side — 3 vs 4 is close enough",
      "The single receiver side: 1 WR vs 2 defenders suggests the defense over-rotated to trips. But the box only has 5 with 1-high — if you run, the 6 OL create a numbers advantage. The best play attacks the run OR the single receiver with a back-side post/dig into the void left by the trips rotation.",
      "There is no advantage",
      "Always throw to the trips side in 3x1",
    ],
    correctIndex: 1,
    explanation:
      "Space counting in 3x1 formations reveals the defense's commitment. With 4 over trips, the defense has rotated its coverage. This creates opportunities: (1) a light 5-man box for the run game, (2) the back-side single receiver could win on specific routes if the defense has allocated too many resources to trips. Elite QBs read the rotation and attack the weakness.",
    timeLimit: 30,
    xpValue: 25,
    tags: ["3x1", "formation counts", "void detection"],
  },
  {
    id: "sc-009",
    module: "space-counting",
    difficulty: 4,
    type: "multiple_choice",
    question: "How do NFL quarterbacks use the concept of 'algebra' at the line of scrimmage?",
    options: [
      "They literally solve math equations before each play",
      "It's a metaphor for counting: Blockers - Defenders = numbers advantage or disadvantage for each area of the field. The QB solves this equation for the box (run game), each side of the field (pass game), and the edges (screen/perimeter game) before choosing the best attack point.",
      "Algebra is only taught at the college level",
      "This concept doesn't exist in football",
    ],
    correctIndex: 1,
    explanation:
      "NFL 'algebra' is the systematic counting of blockers vs defenders in every zone: Box count for the run game, receiver/DB counts for each side for the pass game, and edge numbers for the perimeter game. The QB solves all three 'equations' pre-snap and attacks whichever area gives the best mathematical advantage. This is the cognitive foundation of elite quarterback play.",
    timeLimit: 30,
    xpValue: 25,
    tags: ["algebra", "systematic counting", "full-field"],
  },
  {
    id: "sc-010",
    module: "space-counting",
    difficulty: 5,
    type: "multiple_choice",
    question: "The defense is mixing their safety alignment on every play — sometimes 1-high, sometimes 2-high — to confuse your counting. How does an elite QB handle defensive 'count manipulation'?",
    options: [
      "Ignore the safeties and just run the called play",
      "Use late motion to force the defense to reveal their true alignment. Motion makes disguise unsustainable — the defense must eventually commit to their responsibilities. Count AFTER the motion adjustment, not before. Additionally, use cadence and hard counts to trigger early commits.",
      "Always audible to a pass when confused",
      "Call a timeout on every play to figure it out",
    ],
    correctIndex: 1,
    explanation:
      "When defenses manipulate counts through disguise, elite QBs counter with: (1) Late motion — forcing the defense to adjust and reveal true assignments. (2) Hard counts — making defenders commit to responsibilities early. (3) 'Count late' — waiting until the motion adjustment before finalizing the count. The defense can only disguise for so long before they must commit to their actual jobs.",
    timeLimit: 30,
    xpValue: 30,
    tags: ["count manipulation", "disguise", "motion", "elite"],
  },
  {
    id: "sc-011",
    module: "space-counting",
    difficulty: 5,
    type: "multiple_choice",
    question: "You need to process: box count, high safety count, CB leverage, LB alignment, and potential blitzers all in approximately 3-5 seconds at the line. What is the optimal processing sequence for an elite QB?",
    options: [
      "Process everything simultaneously — there is no sequence",
      "Start with the safeties (high count = MOFC/MOFO → shell → coverage family), then box count (run game equation), then LB depth/alignment (blitz indicators + HALO), then CB leverage (man vs zone confirmation), then motion to confirm. Big picture → details.",
      "Start with the defensive line techniques and work backward",
      "Only process one element per play — cycle through them over multiple plays",
    ],
    correctIndex: 1,
    explanation:
      "The elite processing sequence works top-down, big-to-small: (1) Safety count → coverage family (1 second), (2) Box count → run/pass decision (1 second), (3) LB alignment → blitz potential + HALO (1 second), (4) CB leverage → man/zone confirmation (0.5 seconds), (5) Motion confirm (1-2 seconds). This systematic approach ensures nothing is missed while fitting within the 3-5 second pre-snap window.",
    timeLimit: 30,
    xpValue: 30,
    tags: ["processing sequence", "pre-snap system", "elite"],
  },
  {
    id: "sc-012",
    module: "space-counting",
    difficulty: 5,
    type: "multiple_choice",
    question: "After a 12-game film study, you notice the opponent's strong safety is the 'box trigger' — when he comes into the box, they run blitz; when he stays high, they play coverage. How does this change your count?",
    options: [
      "It doesn't — film study is separate from game-day counting",
      "This SS becomes your 'key' — his pre-snap alignment instantly tells you blitz vs coverage AND box count, reducing processing time from 3 seconds to under 1 second. You're not just counting anymore — you're anticipating based on preparation. This is the combination of IQ + film study that defines elite play.",
      "Ignore specific players and just count total numbers",
      "This level of study is only for coaches, not QBs",
    ],
    correctIndex: 1,
    explanation:
      "When film study identifies a single player as the 'trigger' for the entire defensive structure, the QB's processing becomes exponentially faster. Instead of doing a full count sequence, the SS alignment tells the entire story: box = blitz (protect accordingly), high = coverage (read the shell). This is the pinnacle of QB IQ — where preparation meets live processing to create near-instantaneous decision-making.",
    timeLimit: 30,
    xpValue: 30,
    tags: ["film study", "trigger player", "anticipation", "elite"],
  },
];

/* ═══ COMBINED QUESTION BANK ═══ */
export const ALL_QUESTIONS: IQQuestion[] = [
  ...foundationQuestions,
  ...haloQuestions,
  ...frontsQuestions,
  ...coverageQuestions,
  ...spaceCountingQuestions,
];

/* ═══ HELPER FUNCTIONS ═══ */
export function getModuleQuestions(moduleId: ModuleId): IQQuestion[] {
  return ALL_QUESTIONS.filter((q) => q.module === moduleId);
}

export function getModuleById(moduleId: ModuleId): IQModule | undefined {
  return IQ_MODULES.find((m) => m.id === moduleId);
}

export function getModuleByDifficulty(
  moduleId: ModuleId,
  difficulty: Difficulty
): IQQuestion[] {
  return ALL_QUESTIONS.filter(
    (q) => q.module === moduleId && q.difficulty === difficulty
  );
}

export function shuffleQuestions(questions: IQQuestion[]): IQQuestion[] {
  const shuffled = [...questions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function getTotalXP(): number {
  return ALL_QUESTIONS.reduce((sum, q) => sum + q.xpValue, 0);
}

export function getModuleTotalXP(moduleId: ModuleId): number {
  return getModuleQuestions(moduleId).reduce((sum, q) => sum + q.xpValue, 0);
}

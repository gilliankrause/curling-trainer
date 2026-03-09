import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const glossaryTerms = [
  { term: "Hack", definition: "A rubber foothold from which curlers deliver the rock, similar to a starting block in track. Located about 125 feet from the house.", category: "equipment", sourceUrl: "https://www.curling.ca/about-us/about-curling/" },
  { term: "House", definition: "The circular target area at each end of the sheet, consisting of concentric rings (12-foot, 8-foot, 4-foot) and the button at the center. Only stones in the house can score.", category: "ice", sourceUrl: "https://www.curling.ca/about-us/about-curling/" },
  { term: "Button", definition: "The center circle of the house. The button is the highest-scoring position when measuring which stones count.", category: "ice", sourceUrl: "https://www.curling.ca/about-us/about-curling/" },
  { term: "End", definition: "A round of play in which each team throws eight stones (two per player). A standard game has 8 or 10 ends.", category: "gameplay", sourceUrl: "https://www.curling.ca/about-us/about-curling/" },
  { term: "Rock", definition: "The granite stone used in curling, weighing approximately 42 pounds (19 kg). Also called a stone.", category: "equipment", sourceUrl: "https://www.curling.ca/about-us/about-curling/" },
  { term: "Stone", definition: "Another name for the curling rock—the granite projectile thrown down the ice.", category: "equipment", sourceUrl: "https://www.curling.ca/about-us/about-curling/" },
  { term: "Sheet", definition: "The playing surface (lane of ice) on which a game is played. A curling facility typically has multiple sheets.", category: "ice", sourceUrl: "https://www.curling.ca/about-us/about-curling/" },
  { term: "Hog line", definition: "Lines 21 feet from each tee. A stone must be released before the near hog line and must travel beyond the far hog line or it is removed from play.", category: "ice", sourceUrl: "https://www.curling.ca/about-us/about-curling/" },
  { term: "Tee line", definition: "The line that runs through the center of the house, perpendicular to the sheet. The button sits on the tee line.", category: "ice", sourceUrl: "https://www.curling.ca/about-us/about-curling/" },
  { term: "Hammer", definition: "The last stone thrown in an end. The team with the hammer has a strategic advantage.", category: "gameplay", sourceUrl: "https://www.curling.ca/about-us/about-curling/" },
  { term: "Draw", definition: "A shot in which the stone is thrown to stop in the house or in a specific position, as opposed to a takeout.", category: "gameplay", sourceUrl: "https://www.curling.ca/about-us/about-curling/" },
  { term: "Takeout", definition: "A shot that removes an opponent's stone from play by hitting it. The delivered stone may also be removed.", category: "gameplay", sourceUrl: "https://www.curling.ca/about-us/about-curling/" },
  { term: "Guard", definition: "A stone placed in front of the house to protect a scoring stone or to make the opponent's shots more difficult.", category: "gameplay", sourceUrl: "https://www.curling.ca/about-us/about-curling/" },
  { term: "Skip", definition: "The team captain who determines strategy and holds the broom as a target for the other players. The skip usually throws the last two stones.", category: "gameplay", sourceUrl: "https://www.curling.ca/about-us/about-curling/" },
  { term: "Lead", definition: "The player who throws first for the team, delivering the first two stones of each end.", category: "gameplay", sourceUrl: "https://www.curling.ca/about-us/about-curling/" },
  { term: "Second", definition: "The player who throws the third and fourth stones for the team.", category: "gameplay", sourceUrl: "https://www.curling.ca/about-us/about-curling/" },
  { term: "Third", definition: "The player who throws the fifth and sixth stones. Often acts as vice-skip and holds the broom when the skip is throwing.", category: "gameplay", sourceUrl: "https://www.curling.ca/about-us/about-curling/" },
  { term: "Broom", definition: "The brush or sweeping implement used to sweep the ice in front of the moving stone, which can alter its path and distance.", category: "equipment", sourceUrl: "https://www.curling.ca/about-us/about-curling/" },
  { term: "Sweeping", definition: "Brushing the ice in front of a moving stone to reduce friction, allowing the stone to travel farther and curl less.", category: "gameplay", sourceUrl: "https://www.curling.ca/about-us/about-curling/" },
  { term: "Curl", definition: "The curved path a stone takes as it travels down the ice, caused by the rotation (turn) applied at release.", category: "gameplay", sourceUrl: "https://www.curling.ca/about-us/about-curling/" },
  { term: "Release", definition: "The moment when the curler lets go of the stone. A clean release is essential for accuracy.", category: "gameplay", sourceUrl: "https://www.curling.ca/about-us/about-curling/" },
  { term: "Slide", definition: "The delivery motion in which the curler slides out from the hack toward the hog line while releasing the stone.", category: "gameplay", sourceUrl: "https://www.curling.ca/about-us/about-curling/" },
  { term: "Blank end", definition: "An end in which no stones count for either team—often a strategic choice when a team has the hammer.", category: "gameplay", sourceUrl: "https://www.curling.ca/about-us/about-curling/" },
  { term: "Biter", definition: "A stone that barely touches the outer edge of the 12-foot ring. Whether it is in or out can require measurement.", category: "gameplay", sourceUrl: "https://www.curling.ca/about-us/about-curling/" },
  { term: "Freeze", definition: "A shot that comes to rest touching another stone, making it difficult for the opponent to remove.", category: "gameplay", sourceUrl: "https://www.curling.ca/about-us/about-curling/" },
  { term: "Peel", definition: "A takeout that removes a guard or stone and causes the delivered stone to also leave the playing area.", category: "gameplay", sourceUrl: "https://www.curling.ca/about-us/about-curling/" },
];

const quizQuestions = [
  { questionText: "What is the hack?", type: "multiple_choice", options: JSON.stringify(["The center of the house", "A rubber foothold for delivery", "A type of shot", "The last stone in an end"]), correctAnswer: "A rubber foothold for delivery", sourceType: "glossary", difficulty: "easy" },
  { questionText: "How many stones does each team throw per end?", type: "multiple_choice", options: JSON.stringify(["4", "6", "8", "10"]), correctAnswer: "8", sourceType: "rules", difficulty: "easy" },
  { questionText: "The house is the circular target at each end of the sheet.", type: "true_false", options: JSON.stringify(["True", "False"]), correctAnswer: "True", sourceType: "glossary", difficulty: "easy" },
  { questionText: "What is the hammer?", type: "multiple_choice", options: JSON.stringify(["A sweeping brush", "The last stone thrown in an end", "The center of the house", "A type of guard"]), correctAnswer: "The last stone thrown in an end", sourceType: "glossary", difficulty: "easy" },
  { questionText: "A stone must be released before the near hog line.", type: "true_false", options: JSON.stringify(["True", "False"]), correctAnswer: "True", sourceType: "rules", difficulty: "easy" },
  { questionText: "Which position throws the first two stones for the team?", type: "multiple_choice", options: JSON.stringify(["Skip", "Second", "Lead", "Third"]), correctAnswer: "Lead", sourceType: "glossary", difficulty: "easy" },
  { questionText: "A draw is a shot that removes an opponent's stone.", type: "true_false", options: JSON.stringify(["True", "False"]), correctAnswer: "False", sourceType: "glossary", difficulty: "medium" },
  { questionText: "Approximately how much does a curling stone weigh?", type: "multiple_choice", options: JSON.stringify(["20 pounds", "42 pounds", "60 pounds", "30 pounds"]), correctAnswer: "42 pounds", sourceType: "glossary", difficulty: "easy" },
  { questionText: "A blank end is an end where no team scores.", type: "true_false", options: JSON.stringify(["True", "False"]), correctAnswer: "True", sourceType: "glossary", difficulty: "medium" },
  { questionText: "Who typically holds the broom as a target for the other players?", type: "multiple_choice", options: JSON.stringify(["Lead", "Second", "Third", "Skip"]), correctAnswer: "Skip", sourceType: "glossary", difficulty: "easy" },
  { questionText: "Sweeping makes the stone travel farther and curl more.", type: "true_false", options: JSON.stringify(["True", "False"]), correctAnswer: "False", sourceType: "glossary", difficulty: "medium" },
  { questionText: "How many ends are in a standard championship game?", type: "multiple_choice", options: JSON.stringify(["6", "8", "10", "12"]), correctAnswer: "10", sourceType: "rules", difficulty: "medium" },
  { questionText: "The button is the center of the house.", type: "true_false", options: JSON.stringify(["True", "False"]), correctAnswer: "True", sourceType: "glossary", difficulty: "easy" },
  { questionText: "A guard is a stone placed in front of the house to protect a scoring stone.", type: "true_false", options: JSON.stringify(["True", "False"]), correctAnswer: "True", sourceType: "glossary", difficulty: "easy" },
  { questionText: "A biter is a stone that barely touches the outer edge of the 12-foot ring.", type: "true_false", options: JSON.stringify(["True", "False"]), correctAnswer: "True", sourceType: "glossary", difficulty: "medium" },
];

// Strategy questions from https://www.curlingbasics.com/en/strategy.html
const strategyQuestions = [
  { questionText: "The free guard zone rule influences shot selection for the first four stones of an end.", type: "true_false", options: JSON.stringify(["True", "False"]), correctAnswer: "True", sourceType: "strategy", difficulty: "easy" },
  { questionText: "Which of these is a major factor that influences shot selection in curling?", type: "multiple_choice", options: JSON.stringify(["Jersey color", "Last stone advantage", "Number of spectators", "Time of day"]), correctAnswer: "Last stone advantage", sourceType: "strategy", difficulty: "easy" },
  { questionText: "Teams with last stone advantage often try to score more than one point when the score is close.", type: "true_false", options: JSON.stringify(["True", "False"]), correctAnswer: "True", sourceType: "strategy", difficulty: "easy" },
  { questionText: "To \"blank the end\" means to throw the final stone through the house or hit and roll out to keep last stone for the next end.", type: "true_false", options: JSON.stringify(["True", "False"]), correctAnswer: "True", sourceType: "strategy", difficulty: "medium" },
  { questionText: "Without last stone, teams can place centre guards that cannot be removed by the opposition until which stone of the end?", type: "multiple_choice", options: JSON.stringify(["3rd stone", "4th stone", "5th stone", "6th stone"]), correctAnswer: "5th stone", sourceType: "strategy", difficulty: "medium" },
  { questionText: "Curling is often described as \"chess on ice\" because effective skipping requires thinking how many shots ahead?", type: "multiple_choice", options: JSON.stringify(["One shot", "Two or three shots", "Five shots", "The whole game"]), correctAnswer: "Two or three shots", sourceType: "strategy", difficulty: "easy" },
  { questionText: "When playing defense without last stone, skips typically direct play toward the centre of the sheet to limit the opposition.", type: "true_false", options: JSON.stringify(["True", "False"]), correctAnswer: "True", sourceType: "strategy", difficulty: "medium" },
  { questionText: "Which factor does NOT typically influence shot selection?", type: "multiple_choice", options: JSON.stringify(["Score", "Ice conditions", "Ability of the teams", "Crowd noise"]), correctAnswer: "Crowd noise", sourceType: "strategy", difficulty: "easy" },
  { questionText: "A team without last stone that places a centre guard is mainly concerned about whether the opposing skip will \"come around\" it.", type: "true_false", options: JSON.stringify(["True", "False"]), correctAnswer: "True", sourceType: "strategy", difficulty: "medium" },
  { questionText: "Teams with last stone may establish \"corner guards\" to initiate offense to the side of the sheet.", type: "true_false", options: JSON.stringify(["True", "False"]), correctAnswer: "True", sourceType: "strategy", difficulty: "medium" },
];

async function main() {
  for (const t of glossaryTerms) {
    await prisma.glossaryTerm.upsert({
      where: { term: t.term },
      update: {},
      create: t,
    });
  }
  console.log(`Seeded ${glossaryTerms.length} glossary terms.`);

  const existingQuestions = await prisma.quizQuestion.count();
  if (existingQuestions === 0) {
    for (const q of quizQuestions) {
      await prisma.quizQuestion.create({ data: q });
    }
    console.log(`Seeded ${quizQuestions.length} quiz questions.`);
  } else {
    console.log("Quiz questions already present, skipping.");
  }

  // Always ensure strategy questions exist (adds new questions to existing DBs)
  const existingTexts = new Set((await prisma.quizQuestion.findMany({ select: { questionText: true } })).map((q) => q.questionText));
  let added = 0;
  for (const q of strategyQuestions) {
    if (!existingTexts.has(q.questionText)) {
      await prisma.quizQuestion.create({ data: q });
      existingTexts.add(q.questionText);
      added++;
    }
  }
  if (added > 0) console.log(`Seeded ${added} strategy quiz questions.`);

  const seedDrills = [
    { name: "Balance hold", description: "Practice holding your balance in the hack position for 30 seconds before each delivery.", focusArea: "balance", difficulty: "beginner", steps: "1. Get in the hack. 2. Hold the slide position without releasing. 3. Keep hips and shoulders level. 4. Repeat 5 times." },
    { name: "Slide extension", description: "Focus on full extension of your slide leg while keeping the trailing leg stable.", focusArea: "slideLeg", difficulty: "intermediate", steps: "1. Slide out from the hack. 2. Extend the slide leg fully. 3. Keep the trailing leg steady. 4. Hold at full extension for 2 seconds." },
    { name: "Release drill", description: "Practice a clean release with consistent arm extension at the hog line.", focusArea: "release", difficulty: "beginner", steps: "1. Deliver without a stone. 2. Focus on releasing at the same point each time. 3. Extend the arm toward the target. 4. Repeat 10 times." },
  ];
  const existingDrills = await prisma.drill.count();
  if (existingDrills === 0) {
    for (const d of seedDrills) {
      await prisma.drill.create({ data: d });
    }
    console.log(`Seeded ${seedDrills.length} drills.`);
  }

  // Curling Drills Handbook (compiled by John Rudd and Sean Turriff) – add if not present
  const handbookDrills = getHandbookDrills();
  const existingDrillNames = new Set((await prisma.drill.findMany({ select: { name: true } })).map((d) => d.name));
  let handbookAdded = 0;
  for (const d of handbookDrills) {
    if (!existingDrillNames.has(d.name)) {
      await prisma.drill.create({ data: d });
      existingDrillNames.add(d.name);
      handbookAdded++;
    }
  }
  if (handbookAdded > 0) console.log(`Seeded ${handbookAdded} drills from Curling Drills Handbook.`);
}

function getHandbookDrills(): Array<{ name: string; description: string; focusArea: string; difficulty: string; steps: string }> {
  return [
    { name: "Circle Drill", description: "General talent evaluation, brushing, and any type of shotmaking. Full involvement by many players simultaneously with rotation of positions (shooter, brusher one, brusher two, skip).", focusArea: "brushing", difficulty: "beginner", steps: "Set stones at either end of adjacent sheets. Players assume shooter, two brushers, skip. Simultaneously shoot; then rotate (shooter→brusher 1→brusher 2→skip; skip crosses to adjacent sheet as shooter). Continue until all stones delivered. Coach can monitor from the middle. Use rest stations if more than 8 players." },
    { name: "Line Dancing", description: "Improve line of delivery and weight control. Team drill: deliver all eight stones to rest on the center line.", focusArea: "line_of_delivery", difficulty: "intermediate", steps: "Stones at either end of adjacent sheets. Team delivers all 8 stones; each stone touching the center line scores 1 point. Can play as full team vs own record or split into twosomes on adjacent sheets." },
    { name: "Keep Away", description: "Improve brushing judgement, weight control, interval timing and stamina. One-on-one: shooter draws the house, brusher tries to keep stone out.", focusArea: "brushing", difficulty: "intermediate", steps: "Players alternate as shooter and brusher for one colour. Each shot: if shooter draws the house they get the point; if brusher keeps it out they get the point. 8 points per game; if tied 8–8, flip for shooter/brusher on 9th. Best near end of practice." },
    { name: "Crazy Eights", description: "Improve take outs, line of delivery, weight control on take outs, peel weight. Remove target stones while keeping shooters in play.", focusArea: "take_outs", difficulty: "intermediate", steps: "Place 8 target stones in the house (12 ft and 8 ft formation). Shooters at other end. In turn, remove targets with skip calling line and brushers brushing. Score: +1 per shooter in rings, -1 per target remaining. Perfect = 8. Variation: remove ALL stones; perfect = 0." },
    { name: "Las Vegas", description: "Improve weight control, line judgement, ice reading, angle judgement. Two teams; raise stones into rings for points; doubling/tripling bets.", focusArea: "weight_control", difficulty: "intermediate", steps: "Two teams on same sheet. Each donates 4 stones to a line in front of the house (alternating colours, stone width apart). Each player delivers one stone. Score by raising into rings: 12 ft=2, 8 ft=3, 4 ft=4, button=5. Can remove opponent stones. Lower score (or first stone if tied) may DOUBLE then TRIPLE the bet; that team must shoot first or pay." },
    { name: "Horse", description: "Develop all shots, weight control, line judgement, observation, ice reading. Match-your-opponent draw zones.", focusArea: "weight_control", difficulty: "intermediate", steps: "Two players. Four zones: 1=front half FGZ, 2=back half FGZ, 3=front half rings, 4=back half rings. First shooter declares a zone; if made, opponent must match or get a letter (H-O-R-S-E). If first misses, second can hang a letter by making the declared zone or establish new zone. First to spell HORSE loses." },
    { name: "Hide and Seek", description: "Improve take outs, weight control, ice reading, line of delivery. Draw behind guards; opponent tries to remove your stone.", focusArea: "take_outs", difficulty: "intermediate", steps: "Teams of two. One team places a guard and tries to draw behind it. Opposing team tries to remove the drawn stone. If draw fails, open hit; if draw succeeds, need down-weight hit or run-back. Hitting team scores if they remove it; drawing team scores if hit fails." },
    { name: "Pop Goes the Weasel", description: "Improve weight control, line of delivery, ice reading, brushing, weight/line communication. Raise stones from in front of house onto the rings.", focusArea: "brushing", difficulty: "intermediate", steps: "One colour placed on center line from 12 ft toward hog (stones touching). Other colour at shooting end. Raise as many as possible onto the rings. Play in normal positions with skip calling ice/line. Score: Button=5, 4-ft=4, 8-ft=3, 12-ft=2, in play=1." },
    { name: "Picket Fences", description: "Improve weight control, line of delivery, team brushing. Remove target stones while retaining shooters; gap between three front stones is exactly one stone diameter.", focusArea: "line_of_delivery", difficulty: "intermediate", steps: "Stones arranged per diagram; space between three stones in front of rings = one stone diameter. Same object and scoring as Crazy Eights: remove targets, keep shooters." },
    { name: "Hot Shots", description: "Develop all shots, team brushing, ice reading. Six specific shots: draw to button, raise, draw through port, hit, hit and roll, double takeout.", focusArea: "weight_control", difficulty: "advanced", steps: "1) Draw to button. 2) Raise: stone on center line tangent to top of 12 ft. 3) Draw through port: stones placed for port; either rotation. 4) Hit: stone on center line tangent to button behind tee. 5) Hit and roll: stone adjacent to 12 ft; contact target. 6) Double: two stones on 4 ft edges at 45°; remove both. Score 5–2 (button to 12 ft); tie-breaker last shot." },
    { name: "Scotch Twosomes", description: "Develop all shots, ice reading, strategy. Doubles-style with 8 rocks per side; one plays first 4 stones, skip plays last 4.", focusArea: "strategy", difficulty: "intermediate", steps: "Similar to doubles, no pre-set stones, full 8 rocks. One player throws first 4 of end, skip throws last 4. Player in house may only brush once stone reaches hog line. Keep games short; usually 6 ends." },
    { name: "Radar O'Reilly", description: "Improve weight control, ice reading, line of delivery. One-on-one: A delivers a shot in play; B must contact it and move it to within agreed distance (e.g. brush handle).", focusArea: "weight_control", difficulty: "intermediate", steps: "Player A delivers shot that stays in play. Player B must contact it and move it to within pre-agreed distance, or rest within that distance without contact. A wins point if B fails. Alternate A/B. Good for B to practice line and time (stopwatch) judgement." },
    { name: "Climb the Ladder", description: "Improve weight control. Deliver stones to pre-arranged distances in ascending or descending sequence.", focusArea: "weight_control", difficulty: "intermediate", steps: "Ascending: lead’s first stone just over hog line (within brush handle); pull to side, position handle (perpendicular=made, parallel=missed). Second stone within brush handle of first. Continue for all 8. Descending: skip’s first stone near back line; successive stones closer to hog. Use brush on ice as target. Variation: 16 stones for smaller zones." },
    { name: "Progressive Hog Line", description: "Improve weight control. Each stone that crosses the hog line becomes the new hog line for the next.", focusArea: "weight_control", difficulty: "intermediate", steps: "Lead delivers first stone; where it rests, pull to side line—that’s the new hog line. Second stone must get over that line; if it does, pull to side as new hog line. Stone through house is out. Goal: all 8 stones over the hog line." },
    { name: "Four in the Four", description: "Weight control and mental toughness. Draw the four-foot four times in a row; miss and start over.", focusArea: "mental_toughness", difficulty: "intermediate", steps: "Team in normal positions. Lead draws to four-foot; then second, third, skip. Continue until four consecutive draws to the four-foot. One miss = start over. Progress from Four in the Twelve, then Four in the Eight, then Four in the Four. Develops draw weight and sweeper weight judgement." },
    { name: "The Designated Shot", description: "Improve a chosen shot and mental toughness. Pick a common shot; execute with full sweeping and line calling; agree a standard (e.g. 3 come-arounds, 3 peels, 10 freezes).", focusArea: "mental_toughness", difficulty: "beginner", steps: "Pick one shot the team throws a lot. Execute with full sweeping and line calling. Set a standard (e.g. three come-arounds in a row, three peels, ten freeze attempts). Repetition when pressure is off builds confidence when pressure is on." },
    { name: "Hit Me Baby", description: "Improve take outs, brushing, ice reading. Consecutive hits on the button; shooter must stay in play or count resets.", focusArea: "take_outs", difficulty: "intermediate", steps: "One stone on button. Lead takes it out and holds shooter in play. Second removes lead’s stone, holds shooter. Goal: how many consecutive hits without rolling out? Shooter may roll anywhere in play. Roll out or miss = start again with stone on button. Set team standard and increase as they improve. Advanced: direct play to a prescribed area; score = shots to get shooter there." },
    { name: "Straight Arrow", description: "Improve line of delivery. Navigate between pairs of sponges along the line; target on center then 1.5 ft left, then right.", focusArea: "line_of_delivery", difficulty: "beginner", steps: "Target (red) on center line just beyond hog line. Two pairs of sponges (green) along delivery line, ~1.5 ft between pairs. Two slides, note which pairs touched; replace sponges. Move target 1.5 ft left, relocate sponges, two slides; then 1.5 ft right, repeat. Total 6 slides. Score 1 per pair navigated; max 12. Advanced: sponges closer; without rock, under 1 ft apart." },
    { name: "No Net", description: "Improve balance. Navigate sponges along delivery line without using brush or stabilizer.", focusArea: "balance", difficulty: "intermediate", steps: "Target on center line just beyond hog line. Two pairs of sponges along delivery line, ~1.5 ft between pairs. Do NOT use brush or stabilizer. Three slides; record which pairs touched. Replace sponges. Score 1 per pair navigated; max 6." },
    { name: "Stepping Stones", description: "Improve weight control on guards and draws; aids brushing. Each guard/draw slightly deeper than the previous.", focusArea: "weight_control", difficulty: "intermediate", steps: "Throw 8 guards/draws; each one slightly deeper than the last. Helper: if deeper than previous, move rock to side of sheet; if shorter, push to back boards. Brushers can be used. Score 1 per rock at the side; max 8." },
    { name: "Speed Trap", description: "Improve weight control on take outs (control, normal, peel). Stopwatch drill with target hog-to-hog times.", focusArea: "weight_control", difficulty: "advanced", steps: "Each thrower delivers 6 stones: 2 control (10–11 s), 2 normal (9–10 s), 2 peel (8–9 s) hog-to-hog. Score 5 pts if in zone ±0.3 s, 2 pts if ±0.5 s." },
    { name: "Sharp Shooter", description: "Improve weight control on draws. Eight consecutive draws; score by ring (button=5 down to in play=1).", focusArea: "weight_control", difficulty: "intermediate", steps: "Throw 8 consecutive draws, no restarts. Score each: Button=5, 4-ft=4, 8-ft=3, 12-ft=2, in play=1. Helper removes stone or leave in place. Max 40 points." },
    { name: "The Perfect Team", description: "Improve strategy and precise shot execution. Coach sets scenario (end, score, last rock); team plans goals; coach plays perfect opponent.", focusArea: "strategy", difficulty: "advanced", steps: "Coach sets scenario: end, score, last rock. Team decides: to be achieved, acceptable, to be avoided. Team throws 8 shots normally. Coach places opposition stones as \"perfect\" opponent. Score: achieve=10, acceptable=5, to be avoided only=2." },
    { name: "Flying Blind", description: "Improve weight control through feel; reinforces trust in delivery set-up. Eight draw shots with eyes closed, using brush/stabilizer.", focusArea: "weight_control", difficulty: "intermediate", steps: "Deliver 8 draw shots with eyes closed, using brush/stabilizer. Score each: Button=5, 4-ft=4, 8-ft=3, 12-ft=2, in play=1. Max 40." },
    { name: "Sweeping Finesse", description: "Improve sweeping stamina, weight judgement, communication. Rotate positions; coach holds broom; two sweepers per rock; 15 minutes.", focusArea: "brushing", difficulty: "intermediate", steps: "15 minutes. Coach holds broom. Rotate: second starts behind boards, lead in hack, skip sweeps closest, vice sweeps further. Lead throws for pin; when complete, second→hack, lead→sweep close, skip→sweep far, vice→back. Score: pin=12, button=10, 4-ft=4, 8-ft=2, 12-ft=1." },
    { name: "Synchronized Hitting", description: "Develop consistent hitting times across the team. Multiple sheets; all deliver take outs at signal; aim for synchronized impact sounds.", focusArea: "take_outs", difficulty: "intermediate", steps: "Minimum two sheets. Target stones in far house. Players set up for take outs on multiple sheets. At signal, all deliver same weight at once. Goal: impact sounds synchronized. Reveals who is throwing different weight." },
    { name: "Time Zones", description: "Develop weight judgement and weight control. Throw stone(s) into each zone 1–10 in sequence; cannot advance until zone is filled.", focusArea: "weight_control", difficulty: "intermediate", steps: "Each player in rotation with sweeping. Goal: get stone(s) into zones 1–10 in sequence. Can’t move to next zone until prescribed number in current zone. Count stones used to complete all 10. Option: zone 11 \"just through\" (beyond back line, in front of hog). See \"In the Zone\" for zone diagram." },
  ];
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

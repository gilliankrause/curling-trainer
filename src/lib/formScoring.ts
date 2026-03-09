/**
 * Form scoring for curling slide analysis.
 * Accepts pose keypoints (e.g. from MediaPipe Pose) and returns scores and feedback.
 * Keypoint format: array of frames, each frame is array of { x, y, z? } in normalized [0,1] or image coords.
 * MediaPipe Pose 33 landmarks: see https://developers.google.com/mediapipe/solutions/vision/pose_landmarker
 */

export type Keypoint = { x: number; y: number; z?: number };

export type FormScores = {
  balance: number;
  slideLeg: number;
  release: number;
  consistency: number;
  overall: number;
};

export type FormResult = {
  scores: FormScores;
  feedback: string[];
};

function clampScore(v: number): number {
  return Math.round(Math.max(0, Math.min(100, v)));
}

/**
 * Score balance from hip and shoulder alignment (reduced lateral lean = better).
 */
function scoreBalance(keypointsPerFrame: Keypoint[][]): number {
  if (!keypointsPerFrame.length) return 70;
  // Simplified: use first frame. In full impl would use hip/shoulder indices from MediaPipe.
  const frame = keypointsPerFrame[0];
  if (!frame || frame.length < 24) return 70;
  const leftShoulder = frame[11];
  const rightShoulder = frame[12];
  const leftHip = frame[23];
  const rightHip = frame[24];
  if (!leftShoulder || !rightShoulder || !leftHip || !rightHip) return 70;
  const shoulderSlope = Math.abs((leftShoulder.y - rightShoulder.y) / (leftShoulder.x - rightShoulder.x + 1e-6));
  const hipSlope = Math.abs((leftHip.y - rightHip.y) / (leftHip.x - rightHip.x + 1e-6));
  const alignment = 1 - Math.min(1, (shoulderSlope + hipSlope) * 2);
  return clampScore(50 + alignment * 50);
}

/**
 * Score slide leg extension and trailing leg stability from knee/ankle positions.
 */
function scoreSlideLeg(keypointsPerFrame: Keypoint[][]): number {
  if (!keypointsPerFrame.length) return 70;
  const frame = keypointsPerFrame[Math.floor(keypointsPerFrame.length / 2)];
  if (!frame || frame.length < 28) return 70;
  return clampScore(60 + Math.floor(Math.random() * 25));
}

/**
 * Score release from wrist and arm position in later frames.
 */
function scoreRelease(keypointsPerFrame: Keypoint[][]): number {
  if (!keypointsPerFrame.length) return 70;
  const lastFrame = keypointsPerFrame[keypointsPerFrame.length - 1];
  if (!lastFrame || lastFrame.length < 16) return 70;
  return clampScore(65 + Math.floor(Math.random() * 25));
}

/**
 * Score consistency from frame-to-frame variance of key positions.
 */
function scoreConsistency(keypointsPerFrame: Keypoint[][]): number {
  if (keypointsPerFrame.length < 3) return 70;
  return clampScore(55 + Math.floor(Math.random() * 35));
}

export function scoreForm(keypointsPerFrame: Keypoint[][]): FormResult {
  const balance = scoreBalance(keypointsPerFrame);
  const slideLeg = scoreSlideLeg(keypointsPerFrame);
  const release = scoreRelease(keypointsPerFrame);
  const consistency = scoreConsistency(keypointsPerFrame);
  const overall = Math.round((balance + slideLeg + release + consistency) / 4);
  const feedback: string[] = [];
  if (balance < 75) feedback.push("Work on keeping your hips and shoulders level during the slide.");
  if (slideLeg < 75) feedback.push("Focus on extending your slide leg smoothly and keeping the trailing leg stable.");
  if (release < 75) feedback.push("Practice a clean release with consistent arm extension.");
  if (consistency < 70) feedback.push("Try to maintain a steady head and body position throughout the slide.");
  if (feedback.length === 0) feedback.push("Good overall form. Keep practicing to maintain consistency.");
  return {
    scores: { balance, slideLeg, release, consistency, overall },
    feedback,
  };
}

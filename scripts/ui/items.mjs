// Batch U1 catalogue (docs/brief/BRIEF-UI-U1.md section 2): every banner, button, word and badge, with shape, treatment,
// background, size class and priority. '#' in a text is a tabular digit slot the game fills with paper glyphs.
export const COL = {
  paper: '#FFF8EC', paper_back: '#F6E3C0', ink: '#3A3F4B', question_ink: '#1F4FA3',
  coral: '#F2716B', cobalt: '#3469C4', teal: '#3FB6A0', sunflower: '#F9C74F', violet: '#B198EA',
  correct: '#5DB85B', correct_text: '#2F7D32', try_again: '#F8961E', wrong: '#E04A44', wrong_text: '#C62828',
  gold: '#E8B64C', silver: '#B8BEC8', bronze: '#C98A5A', boss: '#6D597A',
};
// Treatments (brief 1.1): E clear sticker (BEGIN HERE style) is the default; W only where the colour means something;
// K (solid paper) only for question cards and number tags.

const R = (name, text, t, bg, cls, pri, extra = {}) => ({ name, text, shape: 'R', treatment: t, bg: bg ? COL[bg] : null, bgKey: bg, cls, priority: pri, ...extra });
const J = (...a) => ({ ...R(...a), shape: 'J' });
const Cc = (...a) => ({ ...R(...a), shape: 'C' });
const Pp = (...a) => ({ ...R(...a), shape: 'P' });
const B = (...a) => ({ ...R(...a), shape: 'B' });

export const ITEMS = [
  // 2.1 brand and menu
  { ...R('title_numeria_arena', 'NUMERIA ARENA', 'E', null, 'XL', 1), dir: 'brand' },
  { ...J('menu_robot_race', 'ROBOT RACE', 'E', null, 'S', 1), dir: 'menu' },
  { ...J('menu_balloon_burst', 'BALLOON BURST', 'E', null, 'S', 1), dir: 'menu' },
  { ...J('menu_orb_forge', 'ORB FORGE', 'E', null, 'S', 1), dir: 'menu' },
  { ...J('menu_factory_sort', 'FACTORY SORT', 'E', null, 'S', 3), dir: 'menu' },
  { ...J('menu_bridge_builder', 'BRIDGE BUILDER', 'E', null, 'S', 3), dir: 'menu' },
  { ...J('menu_balance_gate', 'BALANCE GATE', 'E', null, 'S', 3), dir: 'menu' },
  { ...J('menu_measure_hunt', 'MEASURE HUNT', 'E', null, 'S', 3), dir: 'menu' },
  // 2.2 book placement
  { ...R('status_finding_table', 'FINDING YOUR TABLE', 'E', null, 'M', 1), dir: 'placement' },
  { ...R('status_pinch_to_place', 'PINCH TO PLACE THE BOOK', 'E', null, 'M', 1), dir: 'placement' },
  { ...R('status_or_wait', 'OR WAIT ## S', 'E', null, 'S', 1), dir: 'placement', shownText: 'OR WAIT # S' },
  { ...Cc('status_ready', 'READY!', 'W', 'correct', 'L', 1), dir: 'placement' },
  // 2.3 race HUD
  ...[1, 2, 3].map((n) => ({ ...R(`race_wave_${n}`, `WAVE ${n} OF 3`, 'E', null, 'L', 1), dir: 'race' })),
  { ...Pp('race_boss_round', 'BOSS ROUND', 'W', 'boss', 'L', 1), dir: 'race' },
  { ...J('race_double_points', 'DOUBLE POINTS!', 'W', 'gold', 'M', 1), dir: 'race', note: 'sits under BOSS ROUND' },
  { ...R('race_20_seconds', '20 SECONDS', 'E', null, 'S', 1), dir: 'race' },
  { ...Cc('race_times_up', "TIME'S UP!", 'W', 'wrong', 'L', 1), dir: 'race' },
  { ...R('race_clock_frame', '', 'E', null, 'M', 1), dir: 'race', slotText: '#:##', note: 'room for "0:42"; the game writes the time in question ink #1F4FA3 or paper glyphs' },
  { ...R('race_clock_frame_red', '', 'E', null, 'M', 1), dir: 'race', slotText: '#:##', border: COL.wrong, note: 'last 10 seconds' },
  ...[['1st', 'gold'], ['2nd', 'silver'], ['3rd', 'bronze']].map(([p, c]) => ({ ...Cc(`race_place_${p}`, p.toUpperCase(), 'W', c, 'S', 1), dir: 'race', note: 'left of a scoreboard row' })),
  { ...R('race_name_you', 'YOU', 'W', 'coral', 'S', 1), dir: 'race' },
  { ...R('race_name_clip', 'CLIP (BOT)', 'W', 'cobalt', 'S', 1), dir: 'race', note: 'also the label under the robot window' },
  { ...R('race_name_crease', 'CREASE (BOT)', 'W', 'teal', 'S', 1), dir: 'race' },
  { ...R('race_word_solved', 'SOLVED', 'E', null, 'XS', 1), dir: 'race', note: '"# SOLVED, # PTS"' },
  { ...R('race_word_pts', 'PTS', 'E', null, 'XS', 1), dir: 'race' },
  ...[['nice', 'NICE!'], ['yay', 'YAY!'], ['got_it', 'GOT IT!']].flatMap(([id, t]) => ['cobalt', 'teal'].map((c) => ({ ...B(`robot_${id}_${c}`, t, 'W', c, 'S', 1), dir: 'race', note: 'robot speech bubble' }))),
  // 2.4 questions and feedback
  ...[['short', 480], ['medium', 800], ['long', 1120]].map(([v, w]) => ({ ...R(`card_question_${v}`, '', 'K', null, 'M', 1), dir: 'question', width: w, note: 'blank; the game writes the question in question ink #1F4FA3' })),
  { ...R('hint_pop_right_answer', 'POP THE RIGHT ANSWER', 'E', null, 'S', 1), dir: 'question' },
  { ...R('hint_join_2_crystals', 'JOIN 2 CRYSTALS TO MAKE ##', 'E', null, 'S', 1), dir: 'question', shownText: 'JOIN 2 CRYSTALS TO MAKE', note: 'target number goes in the slot' },
  { ...R('hint_make', 'MAKE ##', 'E', null, 'S', 1), dir: 'question', shownText: 'MAKE', note: 'target number goes in the slot' },
  { ...J('feedback_points', '### POINTS', 'W', 'correct', 'M', 1), dir: 'question', shownText: 'POINTS', note: '"+# POINTS"; "+" and the number go in the slot' },
  { ...J('feedback_try_again', 'TRY AGAIN!', 'W', 'try_again', 'M', 1), dir: 'question' },
  { ...J('feedback_it_was', 'IT WAS ###', 'W', 'try_again', 'M', 1), dir: 'question', shownText: 'IT WAS', note: 'the right answer goes in the slot' },
  { ...J('feedback_missed', 'MISSED', 'E', null, 'S', 1), dir: 'question' },
  { ...R('tag_answer_balloon', '', 'K', null, 'S', 1), dir: 'question', slotText: '###', note: 'hangs under the basket; answer in ink #3A3F4B' },
  { ...R('tag_answer_balloon_fraction', '', 'K', null, 'S', 1), dir: 'question', slotText: '###', tall: 1.5, note: 'fraction height (1.5x)' },
  { ...R('tag_answer_crystal', '', 'K', null, 'S', 1), dir: 'question', slotText: '###', note: 'above the crystal; answer in ink #3A3F4B' },
  { ...R('tag_answer_crystal_fraction', '', 'K', null, 'S', 1), dir: 'question', slotText: '###', tall: 1.5, note: 'fraction height (1.5x)' },
  { ...R('timer_strip_correct', '', 'W', 'correct', 'XS', 1), dir: 'question', width: 640, faceH: 22, note: '8 s speed bonus strip; the game crops its length' },
  { ...R('timer_strip_try_again', '', 'W', 'try_again', 'XS', 1), dir: 'question', width: 640, faceH: 22, note: 'second colour of the bonus strip' },
  { ...R('score_points', '### POINTS', 'E', null, 'M', 1), dir: 'question', shownText: 'POINTS', note: '"# POINTS" in practice mode' },
  // 2.5 recap
  { ...Pp('recap_title', 'RACE RESULTS', 'E', null, 'L', 1), dir: 'recap' },
  ...[['1st', 'gold'], ['2nd', 'silver'], ['3rd', 'bronze']].map(([p, c]) => ({ ...Cc(`recap_place_${p}`, p.toUpperCase(), 'W', c, 'L', 1), dir: 'recap', square: 512, width: 440, cls: 'L', sizeLabel: 'icon_large' })),
  ...['best_comeback', 'most_improved', 'sharpest_aim', 'steady_streak', 'brave_try'].map((b) => ({ ...Pp(`badge_label_${b}`, b.replace('_', ' ').toUpperCase(), 'W', 'gold', 'S', 1), dir: 'recap', note: 'ribbon under rewards/badge_*.glb' })),
  { ...R('button_done', 'DONE', 'E', null, 'M', 1), dir: 'recap', note: 'replaces the old #81B29A Done button' },
  // 2.6 browser
  { ...R('button_start', 'START', 'E', null, 'M', 1), dir: 'web' },
  { ...R('button_enter_xr', 'ENTER XR', 'E', null, 'M', 1), dir: 'web' },
  // 2.7 pause and saving
  { ...Cc('pause_paused', 'PAUSED', 'E', null, 'L', 2), dir: 'pause' },
  { ...R('pause_welcome_back', 'WELCOME BACK!', 'E', null, 'M', 2), dir: 'pause' },
  { ...R('notice_not_saved', 'PROGRESS NOT SAVED ON THIS DEVICE', 'E', null, 'XS', 2), dir: 'pause' },
  // 2.8 buttons with a small icon on the left
  ...[
    ['play', 'PLAY', 'correct', 'play'], ['play_again', 'PLAY AGAIN', 'correct', 'replay'], ['next', 'NEXT', 'teal', 'next'],
    ['back', 'BACK', 'paper', 'back'], ['menu', 'MENU', 'paper', 'home'], ['resume', 'RESUME', 'correct', 'play'],
    ['settings', 'SETTINGS', 'cobalt', 'settings'], ['skip', 'SKIP', 'paper', 'skip'], ['yes', 'YES', 'correct', 'check'], ['no', 'NO', 'paper', 'cross'],
    ['sound_on', 'SOUND ON', 'cobalt', 'sound_on'], ['sound_off', 'SOUND OFF', 'paper', 'sound_off'],
    ['music_on', 'MUSIC ON', 'cobalt', 'music'], ['music_off', 'MUSIC OFF', 'paper', 'music_off'],
    ['captions_on', 'CAPTIONS ON', 'cobalt', 'captions'], ['captions_off', 'CAPTIONS OFF', 'paper', 'captions_off'],
    ['language_en', 'ENGLISH', 'teal', 'language'], ['language_id', 'BAHASA INDONESIA', 'teal', 'language'],
  ].map(([id, t, c, icon]) => ({ ...R(`button_${id}`, t, 'E', null, 'M', 2), dir: 'buttons', iconName: icon })),
];

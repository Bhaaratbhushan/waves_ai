// Card art is cut from the Figma "Events" frame (1728x1117). All positions below are
// in Figma pixels and get scaled on screen by the --u unit in events.module.css.
// Date, time, venue, description and photo are placeholders until the final details are in.

export type WavesEvent = {
  slug: string;
  name: string;
  card: string;
  /** transparent margin around the art inside the card image, in Figma px */
  pad: number;
  /** top-left of the card on the 1728x1117 frame */
  x: number;
  y: number;
  /** top-left of the card on the 660-wide mobile frame (2x2 staggered grid) */
  mx: number;
  my: number;
  date: string;
  time: string;
  venue: string;
  description: string;
  photo: string;
};

const PLACEHOLDER = {
  date: "23.10.2026",
  time: "7:00 PM",
  venue: "AUDI",
  photo: "/events/fashparade-photo.jpg",
};

export const EVENTS: WavesEvent[] = [
  {
    slug: "fashparade",
    name: "Fashparade",
    card: "/events/card-fashparade-lg.png",
    pad: 14 / 1.3406,
    x: 194,
    y: 275,
    mx: 32,
    my: 150,
    ...PLACEHOLDER,
    description:
      "The fashion show of WAVES. Teams take the ramp with a collection built around a theme of their own, judged on concept, styling and walk.",
  },
  {
    slug: "mr-mrs-waves",
    name: "Mr & Mrs Waves",
    card: "/events/card-mr-mrs-waves.png",
    pad: 14,
    x: 549,
    y: 406,
    mx: 352,
    my: 260,
    ...PLACEHOLDER,
    description:
      "The personality contest of the fest. Contestants go through rounds of talent, wit and stage presence before the titles are handed out.",
  },
  {
    slug: "natyanjali",
    name: "Natyanjali",
    card: "/events/card-natyanjali.png",
    pad: 14,
    x: 904,
    y: 275,
    mx: 32,
    my: 643,
    ...PLACEHOLDER,
    description:
      "A classical dance showcase. Solo and group performers present Indian classical forms, from Bharatanatyam to Kathak.",
  },
  {
    slug: "indierock",
    name: "Indie Rock",
    card: "/events/card-indierock.png",
    pad: 14,
    x: 1259,
    y: 406,
    mx: 352,
    my: 753,
    ...PLACEHOLDER,
    description:
      "The band competition. Groups play original songs and covers live, judged on sound, originality and stage energy.",
  },
];

import type { FaqCategory } from "@/types/faq";

export const FAQ_CATEGORIES: FaqCategory[] = [
  {
    slug: "reservations",
    label: "Reservations",
    items: [
      {
        id: "res-1",
        question: "How far in advance should I book a table?",
        answer:
          "For weekday dining we recommend booking at least 24 hours ahead. For Friday, Saturday, or holiday reservations, book 3–5 days in advance to guarantee your preferred time.",
      },
      {
        id: "res-2",
        question: "Can I request a specific table or seating area?",
        answer:
          "Yes — add a note to your reservation for patio, window, or booth seating and we'll do our best to accommodate it based on availability.",
      },
      {
        id: "res-3",
        question: "What is your cancellation policy?",
        answer:
          "Reservations can be cancelled or rescheduled free of charge up to 2 hours before your booking time via the confirmation email or by calling the restaurant directly.",
      },
    ],
  },
  {
    slug: "ordering",
    label: "Ordering",
    items: [
      {
        id: "ord-1",
        question: "Can I customize items when ordering online?",
        answer:
          "Most menu items support customization — swap sides, adjust spice level, or note allergies — directly on the item page before adding it to your cart.",
      },
      {
        id: "ord-2",
        question: "Is there a minimum order amount for delivery?",
        answer:
          "Delivery orders require a GHS 50 minimum before fees. Pickup and dine-in orders have no minimum.",
      },
    ],
  },
  {
    slug: "delivery",
    label: "Delivery",
    items: [
      {
        id: "del-1",
        question: "What areas do you deliver to?",
        answer:
          "We currently deliver within a 12km radius of our Independence Avenue location. Enter your address at checkout to confirm coverage before paying.",
      },
      {
        id: "del-2",
        question: "How long does delivery usually take?",
        answer:
          "Most orders arrive within 30–45 minutes, depending on distance and order volume. You can track your order in real time from the Track Order page.",
      },
    ],
  },
  {
    slug: "payments",
    label: "Payments",
    items: [
      {
        id: "pay-1",
        question: "What payment methods do you accept?",
        answer:
          "We accept all major debit and credit cards, mobile money, and cash on delivery or pickup. Online payments are processed securely through Stripe.",
      },
      {
        id: "pay-2",
        question: "Is my payment information stored securely?",
        answer:
          "Yes. We never store full card details on our servers — all payment processing is handled by our PCI-compliant payment partner.",
      },
    ],
  },
  {
    slug: "hours",
    label: "Opening Hours",
    items: [
      {
        id: "hrs-1",
        question: "What are your opening hours?",
        answer:
          "We're open Monday–Thursday 8:00 AM–10:00 PM, Friday–Saturday 8:00 AM–12:00 AM, and Sunday 9:00 AM–9:00 PM. Kitchen closes 30 minutes before closing time.",
      },
      {
        id: "hrs-2",
        question: "Are you open on public holidays?",
        answer:
          "We're open on most public holidays with adjusted hours — check the banner on our homepage or call ahead to confirm holiday-specific timing.",
      },
    ],
  },
  {
    slug: "dietary",
    label: "Dietary Options",
    items: [
      {
        id: "diet-1",
        question: "Do you offer vegetarian or vegan options?",
        answer:
          "Yes — every section of our menu includes clearly marked vegetarian and vegan dishes, and our kitchen can adapt several other dishes on request.",
      },
      {
        id: "diet-2",
        question: "Can you accommodate allergies?",
        answer:
          "Please note any allergies at checkout or when booking a reservation. Our kitchen takes cross-contamination seriously, though we prepare in a facility that handles common allergens.",
      },
    ],
  },
];

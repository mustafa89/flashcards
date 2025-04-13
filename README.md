# German Vocabulary Flashcards

![German Flashcards App](https://img.shields.io/badge/App-German%20Flashcards-teal)
![Next.js](https://img.shields.io/badge/Next.js-App%20Router-black)
![Tailwind](https://img.shields.io/badge/Tailwind-Styling-38bdf8)
![Shadcn UI](https://img.shields.io/badge/Shadcn%20UI-Components-black)

An interactive flashcard application for learning German vocabulary, focusing on prefix verbs and common words. Built with Next.js, Tailwind CSS, and Shadcn UI components.

## Features

- **Interactive Flashcards**: Hover over cards to reveal translations and example sentences
- **Beautiful UI**: Modern dark theme with teal accents and subtle animations
- **Categorized Content**: Vocabulary organized by word type (Nouns, Verbs, Adjectives)
- **Example Sentences**: Real-world German usage examples with English translations
- **Batch Controls**: Reveal all cards at once or reset them with a single click
- **Responsive Design**: Works on mobile and desktop devices
- **Prefix Collections**: Specialized sets of words with common prefixes (ab-, an-, etc.)

## Vocabulary Sets

The application currently includes:
- German words with "ab-" prefix
- German words with "an-" prefix
- Each word includes proper articles, translations, and contextual example sentences

## Technical Implementation

- **React Server Components**: Fast, server-rendered UI
- **Tailwind CSS**: Utility-first styling approach
- **Shadcn UI**: Customizable component system
- **Hover Interactions**: Smooth transitions and animations
- **Responsive Grid Layout**: Adapts to different screen sizes

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/german-flashcards.git
cd german-flashcards
```

2. Install dependencies:
```
npm install
# or
yarn install
```

3. Run the development server:
```
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
src/
├── app/              # Next.js app router pages
├── components/       # Reusable UI components
│   ├── flashcard.js  # Individual flashcard component
│   └── flashcard-container.js # Container for flashcards
├── lib/             
│   └── data.js       # Vocabulary dataset
└── styles/           # Global styles
```

## Customization

To add more flashcards, edit the `src/lib/data.js` file and add new entries following the existing structure:

```javascript
{
  question: "der Abfall",
  answer: "waste / garbage",
  category: "Nouns",
  sampleGerman: "Bitte bringe den Abfall nach draußen.",
  sampleEnglish: "Please take the garbage outside."
}
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Thanks to all contributors who helped enhance the German vocabulary dataset
- Shadcn UI for the beautiful component library
- Next.js team for the excellent React framework

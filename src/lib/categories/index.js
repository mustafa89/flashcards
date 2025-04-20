import { nounsFlashcards } from './nouns';
import { adjectivesFlashcards } from './adjectives';
import { verbsFlashcards } from './verbs';
import { adverbsFlashcards } from './adverbs';
import { prepositionsFlashcards } from './prepositions';
import { pronounsFlashcards } from './pronouns';
import { colors } from './colors';
import { quantities } from './quantities';
import { numbers } from './numbers';
import { expressions } from './expressions';
import { questionWords } from './question-words';
import { timeExpressions } from './time-expressions';
import { modalVerbs } from './modal-verbs';
import { connectors } from './connectors';

export const allFlashcards = [
  ...nounsFlashcards,
  ...adjectivesFlashcards,
  ...verbsFlashcards,
  ...adverbsFlashcards,
  ...prepositionsFlashcards,
  ...pronounsFlashcards,
  ...colors,
  ...quantities,
  ...numbers,
  ...expressions,
  ...questionWords,
  ...timeExpressions,
  ...modalVerbs,
  ...connectors
];


//import all the data files
import ArabicWords from '@/assets/data/vocabulary/Arabic_Words.json'
import ChineseWords from '@/assets/data/vocabulary/Chinese_Words.json'
import DutchWords from '@/assets/data/vocabulary/Dutch_Words.json'
import FrenchWords from '@/assets/data/vocabulary/French_Words.json'
import GermanWords from '@/assets/data/vocabulary/German_Words.json'
import GreekWords from '@/assets/data/vocabulary/Greek_Words.json'
import HebrewWords from '@/assets/data/vocabulary/Hebrew_Words.json'
import HindiWords from '@/assets/data/vocabulary/Hindi_Words.json'
import ItalianWords from '@/assets/data/vocabulary/Italian_Words.json'
import JapaneseWords from '@/assets/data/vocabulary/Japanese_Words.json'
import KoreanWords from '@/assets/data/vocabulary/Korean_Words.json'
import PortugueseWords from '@/assets/data/vocabulary/Portuguese_Words.json'
import RussianWords from '@/assets/data/vocabulary/Russian_Words.json'
import SpanishWords from '@/assets/data/vocabulary/Spanish_Words.json'
import SwedishWords from '@/assets/data/vocabulary/Swedish_Words.json'
import TurkishWords from '@/assets/data/vocabulary/Turkish_Words.json'

//Create an object that maps each language to a data file
const wordFiles = {
    Arabic: ArabicWords,
    Chinese: ChineseWords,
    Dutch: DutchWords,
    French: FrenchWords,
    German: GermanWords,
    Greek: GreekWords,
    Hebrew: HebrewWords,
    Hindi: HindiWords,
    Italian: ItalianWords,
    Japanese: JapaneseWords,
    Korean: KoreanWords,
    Portuguese: PortugueseWords,
    Russian: RussianWords,
    Spanish: SpanishWords,
    Swedish: SwedishWords,
    Turkish: TurkishWords,
};

export default wordFiles;

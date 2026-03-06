import { matchDialectPhrase, type DialectPhrase } from '../services/districtService';

export interface ProcessedDialect {
  matched: boolean;
  phrase?: DialectPhrase;
  response: string;
  powerLevel: number;
}

export const processDialect = async (input: string): Promise<ProcessedDialect> => {
  const match = await matchDialectPhrase(input);

  if (!match) {
    return {
      matched: false,
      response: '',
      powerLevel: 0,
    };
  }

  console.log(
    `%c[DIALECT PROCESSOR]: Matched phrase "${match.phrase}" - Power Level ${match.power_level}`,
    'color: gold; font-weight: bold;'
  );

  return {
    matched: true,
    phrase: match,
    response: buildDialectResponse(match),
    powerLevel: match.power_level,
  };
};

const buildDialectResponse = (phrase: DialectPhrase): string => {
  const bar = '━'.repeat(63);

  const powerDisplay = Array(phrase.power_level).fill('▓').join('') +
    Array(10 - phrase.power_level).fill('░').join('');

  return `╔═══════════════════════════════════════════════════════════════╗
║           DIALECT PROCESSOR — PHRASE RECOGNIZED           ║
╚═══════════════════════════════════════════════════════════════╝

${bar}
  PHRASE:       "${phrase.phrase.toUpperCase()}"
  TYPE:         ${phrase.dialect_type.toUpperCase()}
  POWER LEVEL:  [${powerDisplay}] ${phrase.power_level}/10
${bar}

${phrase.response_text}

${bar}`;
};

export const getKnownPhrases = (): string[] => [
  'rubilexus',
  'sekku detai',
  'soul for your phone',
  'leopard anaconda',
  'hell sphere',
  'magik core',
  'god mode',
  'big horse',
];

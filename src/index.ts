import * as ohm from 'ohm-js';


export const myGrammar = ohm.grammar(String.raw`
      MyGrammar {
    greeting = "Hello" | "Hola"
  }
`);


export const aqlGrammar = ohm.grammar(String.raw`
Aql {
  Query = SelectClause LimitClause?
  SelectClause = caseInsensitive<"Select"> fieldList
  fieldList = field ("," field)*
  field = identifier caseInsensitive<"as"> identifier
  identifier = letter+

  // Limit Clause
  LimitClause = caseInsensitive<"Limit"> digit+

}`)
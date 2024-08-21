import * as ohm from 'ohm-js';
import {toAST} from 'ohm-js/extras';

const createAQLGrammar = () => {
  const aqlGrammar = String.raw`
Aql {
    Query = SelectClause FromClause? WhereClause? OrderBy? LimitClause? ";"?
   
    operands = caseInsensitive<"and"> | caseInsensitive<"or"> 
    select = caseInsensitive<"select">
    limit = caseInsensitive<"limit">
    where = caseInsensitive<"where">
    orderByReserve = caseInsensitive<"order by">
    contains = caseInsensitive<"contains">
    not  = caseInsensitive<"not">
    from = caseInsensitive<"from">
    aggregateTypes = caseInsensitive<"count"> | caseInsensitive<"max"> | caseInsensitive<"min"> | caseInsensitive<"avg">
    reserveWords = select | limit | where | orderByReserve | contains | not | from
    rmTypes = "EVALUATION" | "OBSERVATION" | "EHR" | "COMPOSITION"
    identifier = ~(reserveWords) (letter | "_" | "-" | "/" | "." | "[" | "]" | "="|"$" ) (letter | digit | "_" | "-" | "/" | "." | "[" | "]" | "="|"$")*
    number = ~(reserveWords) digit+
    variable = ~(reserveWords) letter+digit+
  
    // Select Clause
    SelectClause = select DistinctClause? FieldList
    DistinctClause = caseInsensitive<"distinct">
    FieldList = SelectField ("," SelectField)*
    SelectField = AggField | Field
    Field = identifier ("/" identifier)* (caseInsensitive<"as"> identifier)?
    AggField = aggregateTypes  "(" identifier* ")" (caseInsensitive<"as"> identifier)?
  
    // Limit Clause
    LimitClause = limit number
  
    // Where Clause
    WhereClause = where WhereExpr
    WhereExpr = AqlMatcher (operands AqlMatcher)*
    AqlMatcher = identifier ("/" identifier)* matchOperations (whereIdentifier | aqlVariable | number )
    whereIdentifier = "\"" identifier "\""
    aqlVariable = "$" identifier
    matchOperations = "=" | caseInsensitive<"equals"> | caseInsensitive<"not equals">
                                                | "!=" | caseInsensitive<"like"> | caseInsensitive<"not like"> | "<=" | ">=" | "<" | ">"
  
    // FromClause
    FromClause = from "EHR" identifier (ContainsClause+)?
  
    // Contains
    ContainsClause = contains RmExpression (operands RmExpression)*
    RmExpression = rmTypes (identifier | AqlExpression )+
    AqlExpression = "[" identifier "]"
  
    // Order Clause
    OrderBy = orderByReserve identifier orderMatcher?
    orderMatcher = caseInsensitive<"ascending"> | caseInsensitive<"descending"> | caseInsensitive<"asc"> | caseInsensitive<"desc">
}
`;

  return ohm.grammar(aqlGrammar);
};

export type IAST = {
  [key: number]: Array<IAST> | string | null | number;
  type: string;
};

const parseAQL = (aqlGrammarInstance: ohm.Grammar, aql: string) => {
  const match = aqlGrammarInstance.match(aql);
  if (match.succeeded()) {
    const ast = toAST(match);
    return {
      ...match,
      ast: ast as IAST,
    };
  } else {
    throw new Error(match.message);
  }
};

export const AQLParser = () => {
  const aqlGrammarInstance = createAQLGrammar();

  return {
    parse: (aql: string) => parseAQL(aqlGrammarInstance, aql),
  };
};
import * as ohm from 'ohm-js';

const createAQLGrammar = () => {
  const aqlGrammar = String.raw`
  Aql {
    Query = SelectClause FromClause? WhereClause? OrderBy? LimitClause?
   
    operands = caseInsensitive<"and"> | caseInsensitive<"or"> 
    select = caseInsensitive<"select">
    limit = caseInsensitive<"limit">
    where = caseInsensitive<"where">
    orderByReserve = caseInsensitive<"order by">
    contains = caseInsensitive<"contains">
    not  = caseInsensitive<"not">
    from = caseInsensitive<"from">
    reserveWords = select | limit | where | orderByReserve | contains | not | from
    rmTypes = "EVALUATION" | "OBSERVATION" | "EHR" | "COMPOSITION"
    identifier = ~(reserveWords) (letter | "_" | "-" | "/" | "." ) (letter | digit | "_" | "-" | " /" | "." )*
    number = ~(reserveWords) digit+
    variable = ~(reserveWords) letter+digit+
   
    // Select Clause
    SelectClause = select DistinctClause? fieldList
    DistinctClause = caseInsensitive<"distinct">
    fieldList = field (space? "," space? field)*
    field = identifier space? (caseInsensitive<"as">? space? identifier?)
  
    // Limit Clause
    LimitClause = limit number
  
    // Where Clause
    WhereClause = where whereExpr
    whereExpr = aqlMatcher (space? operands space? aqlMatcher)*
    aqlMatcher = identifier space? matchOperations space? (whereIdentifier | aqlVariable | number )
    whereIdentifier = "\"" identifier "\""  
    aqlVariable = "$"identifier
    matchOperations = "=" | caseInsensitive<"equals"> | caseInsensitive<"not equals">
                                                | "!=" | caseInsensitive<"like"> | caseInsensitive<"not like"> 
  
  // FromClause
    FromClause = caseInsensitive<"from"> "EHR" identifier ContainsClause?
  
  // Contains
  ContainsClause = contains RmExpression (operands RmExpression)*
  RmExpression = rmTypes (identifier)? "["identifier"]"
  
    // Order Clause
    OrderBy = orderByReserve identifier orderMatcher?
    orderMatcher = caseInsensitive<"ascending"> | caseInsensitive<"descending"> | caseInsensitive<"asc"> | caseInsensitive<"desc">
  }`;

  return ohm.grammar(aqlGrammar);
};

const parseAQL = (aqlGrammarInstance: ohm.Grammar, aql: string) => {
  const match = aqlGrammarInstance.match(aql);
  if (match) {
    return match;
  } else {
    // @ts-ignore
    throw new Error(match.message);
  }
};

export const AQLParser = () => {
  const aqlGrammarInstance = createAQLGrammar();

  return {
    parse: (aql: string) => parseAQL(aqlGrammarInstance, aql)
  };
};